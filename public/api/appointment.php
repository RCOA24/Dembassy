<?php
declare(strict_types=1);

use PHPMailer\PHPMailer\PHPMailer;

ini_set('display_errors', '0');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function respond(int $status, string $message): never
{
    http_response_code($status);
    echo json_encode(['ok' => $status >= 200 && $status < 300, 'message' => $message]);
    exit;
}

function unavailable(string $reason): never
{
    // Do not log request contents, SMTP credentials, addresses, or exception text.
    error_log('Appointment endpoint: ' . $reason);
    respond(503, 'Email is temporarily unavailable. Please try again later or contact us directly.');
}

function readOptions(string $file): array
{
    $raw = @file_get_contents(__DIR__ . '/' . $file);
    $data = is_string($raw) ? json_decode($raw, true) : null;
    if (!is_array($data)) {
        unavailable('service options unavailable');
    }
    return $data;
}

// A single private, bounded file avoids per-IP file accumulation. Reserve a slot
// before SMTP, including on delivery failure, and release the lock before sending.
function reserveAttempt(string $file, string $ip): void
{
    $handle = @fopen($file, 'c+');
    if ($handle === false) unavailable('rate limit storage open failed');
    if (!@flock($handle, LOCK_EX)) {
        fclose($handle);
        unavailable('rate limit storage lock failed');
    }
    @chmod($file, 0600);
    $raw = stream_get_contents($handle, 32769);
    $records = $raw === '' ? [] : json_decode($raw ?: '', true);
    if ($raw === false || strlen($raw) > 32768 || !is_array($records) || !array_is_list($records)) {
        flock($handle, LOCK_UN);
        fclose($handle);
        unavailable('rate limit storage invalid');
    }

    $now = time();
    $recent = [];
    $ipHash = hash('sha256', $ip);
    $ipCount = 0;
    foreach ($records as $record) {
        if (!is_array($record) || !isset($record['time'], $record['ip']) ||
            !is_int($record['time']) || !is_string($record['ip']) || !preg_match('/^[a-f0-9]{64}$/', $record['ip'])) {
            flock($handle, LOCK_UN);
            fclose($handle);
            unavailable('rate limit storage invalid');
        }
        if ($record['time'] > $now - 600) {
            $recent[] = $record;
            if (hash_equals($record['ip'], $ipHash)) $ipCount++;
        }
    }
    if ($ipCount >= 10 || count($recent) >= 100) {
        flock($handle, LOCK_UN);
        fclose($handle);
        header('Retry-After: 600');
        respond(429, 'Too many requests. Please wait a few minutes and try again.');
    }
    $recent[] = ['time' => $now, 'ip' => $ipHash];
    $encoded = json_encode($recent);
    rewind($handle);
    $written = is_string($encoded) && ftruncate($handle, 0) && fwrite($handle, $encoded) === strlen($encoded) && fflush($handle);
    flock($handle, LOCK_UN);
    fclose($handle);
    if (!$written) unavailable('rate limit storage write failed');
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, 'Method not allowed.');
}
if (strtolower(trim(explode(';', $_SERVER['CONTENT_TYPE'] ?? '', 2)[0])) !== 'application/json') {
    respond(415, 'Please send a JSON request.');
}

const MAX_BODY_BYTES = 20000;
if (isset($_SERVER['CONTENT_LENGTH']) && (int) $_SERVER['CONTENT_LENGTH'] > MAX_BODY_BYTES) {
    respond(413, 'Your request is too long.');
}
$raw = file_get_contents('php://input', false, null, 0, MAX_BODY_BYTES + 1);
if ($raw === false || strlen($raw) > MAX_BODY_BYTES) respond(413, 'Your request is too long.');
$input = json_decode($raw);
if (!$input instanceof stdClass || json_last_error() !== JSON_ERROR_NONE) {
    respond(400, 'Please complete the form and try again.');
}
$fields = (array) $input;
$allowedFields = ['name', 'email', 'service', 'date', 'time', 'message', 'website'];
foreach ($fields as $key => $value) {
    if (!in_array($key, $allowedFields, true) || !is_string($value)) {
        respond(400, 'Please check the form and try again.');
    }
}
foreach (['name', 'email', 'service', 'date', 'time'] as $key) {
    if (!isset($fields[$key])) respond(400, 'Please complete the form and try again.');
}

$name = trim($fields['name']);
$email = trim($fields['email']);
$service = trim($fields['service']);
$date = trim($fields['date']);
$time = trim($fields['time']);
$message = trim($fields['message'] ?? '');
$website = trim($fields['website'] ?? '');
if ($website !== '') respond(200, 'Your request was sent.');

// JSON decoding guarantees UTF-8. Count Unicode characters instead of bytes so
// names and messages in other languages are not rejected solely for encoding.
if ($name === '' || preg_match_all('/./us', $name) > 120 || preg_match('/[\x00-\x1f\x7f]/u', $name) ||
    strlen($email) > 254 || !filter_var($email, FILTER_VALIDATE_EMAIL) ||
    preg_match_all('/./us', $message) > 3000 || preg_match('/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/u', $message)) {
    respond(422, 'Please check your name, email, and message.');
}
$services = readOptions('services.json');
$options = readOptions('appointment-options.json');
$serviceNames = array_column($services, 'name');
if (!isset($options['otherService'], $options['times']) || !is_string($options['otherService']) || !is_array($options['times'])) {
    unavailable('appointment options invalid');
}
$serviceNames[] = $options['otherService'];
if (!in_array($service, $serviceNames, true) || !in_array($time, $options['times'], true)) {
    respond(422, 'Please choose a valid service and time preference.');
}
$zone = new DateTimeZone('America/Cayman');
$preferred = DateTimeImmutable::createFromFormat('!Y-m-d', $date, $zone);
if (!$preferred || $preferred->format('Y-m-d') !== $date || $preferred < new DateTimeImmutable('today', $zone)) {
    respond(422, 'Please choose today or a future date in Cayman Islands time.');
}

// Only REMOTE_ADDR is trusted. Forwarded headers can be supplied by clients.
$privateDir = dirname(__DIR__, 3) . '/dembassy-mailer';
if (!is_dir($privateDir)) unavailable('rate limit private directory missing');
reserveAttempt($privateDir . '/rate-limit.json', $_SERVER['REMOTE_ADDR'] ?? 'unknown');

$config = [];
$configFile = $privateDir . '/config.php';
if (is_file($configFile)) {
    if (!is_readable($configFile)) unavailable('private configuration unreadable');
    try {
        $config = require $configFile;
        if (!is_array($config)) unavailable('private configuration invalid');
    } catch (Throwable $error) {
        unavailable('private configuration could not be loaded');
    }
} else {
    // Environment variables can supply all configuration without a file.
    error_log('Appointment endpoint: private configuration file missing; checking environment');
}
$getConfig = static function (string $key, string $default = '') use ($config): string {
    $environment = getenv($key);
    if (is_string($environment) && $environment !== '') return $environment;
    $value = $config[$key] ?? $default;
    return is_string($value) || is_int($value) ? (string) $value : '';
};
$autoload = $getConfig('APPOINTMENT_AUTOLOAD', $privateDir . '/vendor/autoload.php');
$host = $getConfig('SMTP_HOST');
$username = $getConfig('SMTP_USERNAME');
$password = $getConfig('SMTP_PASSWORD');
$from = $getConfig('SMTP_FROM');
$to = $getConfig('APPOINTMENT_TO', 'admin@dembassy.ky');
$port = filter_var($getConfig('SMTP_PORT', '587'), FILTER_VALIDATE_INT);
$encryption = $getConfig('SMTP_ENCRYPTION', 'tls');
if (!is_file($autoload) || !is_readable($autoload)) unavailable('mail dependency missing or unreadable');
if ($host === '' || preg_match('/[\s\x00-\x1f\x7f]/', $host) ||
    $username === '' || $password === '' || !filter_var($from, FILTER_VALIDATE_EMAIL) ||
    !filter_var($to, FILTER_VALIDATE_EMAIL) || !$port || $port < 1 || $port > 65535 ||
    !in_array($encryption, ['tls', 'ssl'], true)) {
    unavailable('mailer configuration invalid');
}

$smtpStage = 'setup';
try {
    require_once $autoload;
    if (!class_exists(PHPMailer::class)) unavailable('mail dependency invalid');
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    // Temporary diagnostics: retain only fixed stage labels, never SMTP traffic.
    $mail->SMTPDebug = 1;
    $mail->Debugoutput = static function ($line, $level) use (&$smtpStage): void {
        if (strpos($line, 'CLIENT -> SERVER: STARTTLS') === 0) $smtpStage = 'tls';
        elseif (strpos($line, 'CLIENT -> SERVER: AUTH ') === 0) $smtpStage = 'authentication';
        elseif (strpos($line, 'CLIENT -> SERVER: MAIL FROM:') === 0) $smtpStage = 'message submission';
    };
    $mail->Host = $host;
    $mail->SMTPAuth = true;
    $mail->Username = $username;
    $mail->Password = $password;
    $mail->Port = $port;
    $mail->SMTPSecure = $encryption === 'ssl' ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Timeout = 15;
    $mail->CharSet = PHPMailer::CHARSET_UTF8;
    $mail->setFrom($from, "D' Embassy Appointments");
    $mail->addAddress($to);
    $mail->addCC($email, $name);
    $mail->addReplyTo($email, $name);
    $mail->Subject = 'Appointment request - ' . $service;
    $mail->Body = implode("\n", [
        "Appointment request for D' Embassy", '', 'Name: ' . $name, 'Email: ' . $email,
        'Service: ' . $service, 'Preferred date: ' . $date,
        'Preferred time: ' . $time . ' (Cayman Islands time)', '',
        'Message:', $message !== '' ? $message : '(none)', '',
        'The team will reply to confirm availability.',
    ]);
    $smtpStage = 'connection or implicit TLS';
    $mail->send();
    respond(200, 'Your request was sent.');
} catch (Throwable $error) {
    unavailable('SMTP delivery failed; stage: ' . $smtpStage);
}
