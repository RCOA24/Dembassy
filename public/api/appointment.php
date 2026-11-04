<?php
declare(strict_types=1);

use PHPMailer\PHPMailer\PHPMailer;

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function respond(int $status, string $message): never
{
    http_response_code($status);
    echo json_encode(['message' => $message]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    respond(405, 'Method not allowed.');
}

if (isset($_SERVER['CONTENT_LENGTH']) && (int) $_SERVER['CONTENT_LENGTH'] > 8192) {
    respond(413, 'Your request is too long.');
}

$input = json_decode(file_get_contents('php://input', false, null, 0, 8193) ?: '', true);
if (!is_array($input)) {
    respond(400, 'Please complete the form and try again.');
}

function field(array $input, string $key): string
{
    return isset($input[$key]) && is_string($input[$key]) ? trim($input[$key]) : '';
}

$name = field($input, 'name');
$email = field($input, 'email');
$service = field($input, 'service');
$date = field($input, 'date');
$time = field($input, 'time');
$message = field($input, 'message');

// Quietly discard automated submissions to the hidden field.
if (field($input, 'website') !== '') {
    respond(200, 'Your request was sent.');
}

if ($name === '' || strlen($name) > 120 || preg_match('/[\r\n]/', $name) ||
    !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 254 ||
    $service === '' || strlen($service) > 120 || preg_match('/[\r\n]/', $service) ||
    strlen($message) > 3000 || !in_array($time, ['Morning', 'Afternoon', 'No preference'], true)) {
    respond(422, 'Please check your name, email, service, and message.');
}

$zone = new DateTimeZone('America/Cayman');
$preferred = DateTimeImmutable::createFromFormat('!Y-m-d', $date, $zone);
if (!$preferred || $preferred->format('Y-m-d') !== $date ||
    $preferred < new DateTimeImmutable('today', $zone)) {
    respond(422, 'Please choose a valid future date in Cayman Islands time.');
}

$autoload = getenv('APPOINTMENT_AUTOLOAD') ?: dirname(__DIR__, 2) . '/dembassy-mailer/vendor/autoload.php';
$host = getenv('SMTP_HOST');
$username = getenv('SMTP_USERNAME');
$password = getenv('SMTP_PASSWORD');
$from = getenv('SMTP_FROM');
$to = getenv('APPOINTMENT_TO') ?: 'admin@dembassy.ky';
$port = filter_var(getenv('SMTP_PORT') ?: '587', FILTER_VALIDATE_INT);
$encryption = getenv('SMTP_ENCRYPTION') ?: 'tls';

if (!is_file($autoload) || !$host || !$username || !$password ||
    !filter_var($from, FILTER_VALIDATE_EMAIL) || !filter_var($to, FILTER_VALIDATE_EMAIL) ||
    !$port || $port < 1 || $port > 65535 || !in_array($encryption, ['tls', 'ssl'], true)) {
    error_log('Appointment mailer is not configured.');
    respond(503, 'Email is temporarily unavailable. Please contact us directly.');
}

// Limit repeat submissions from one IP. The lock covers the SMTP send too.
$clientIp = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$lockPath = sys_get_temp_dir() . '/dembassy-appointment-' . hash('sha256', $clientIp);
$lock = fopen($lockPath, 'c+');
if (!$lock || !flock($lock, LOCK_EX)) {
    error_log('Appointment rate limit storage is unavailable.');
    respond(503, 'Email is temporarily unavailable. Please contact us directly.');
}
$lastSent = (int) stream_get_contents($lock);
if ($lastSent > time() - 60) {
    respond(429, 'Please wait a minute before sending another request.');
}

require_once $autoload;

try {
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = $host;
    $mail->SMTPAuth = true;
    $mail->Username = $username;
    $mail->Password = $password;
    $mail->Port = $port;
    $mail->SMTPSecure = $encryption === 'ssl' ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;
    $mail->CharSet = PHPMailer::CHARSET_UTF8;
    $mail->setFrom($from, "D' Embassy Appointments");
    $mail->addAddress($to);
    $mail->addCC($email, $name);
    $mail->addReplyTo($email, $name);
    $mail->Subject = 'Appointment request - ' . $service;
    $mail->Body = implode("\n", [
        "Appointment request for D' Embassy",
        '',
        'Name: ' . $name,
        'Email: ' . $email,
        'Service: ' . $service,
        'Preferred date: ' . $date,
        'Preferred time: ' . $time . ' (Cayman Islands time)',
        '',
        'Message:',
        $message !== '' ? $message : '(none)',
        '',
        'The team will reply to confirm availability.',
    ]);
    $mail->send();

    rewind($lock);
    ftruncate($lock, 0);
    fwrite($lock, (string) time());
    fflush($lock);
    respond(200, 'Your request was sent.');
} catch (Throwable $error) {
    error_log('Appointment email failed: ' . $error->getMessage());
    respond(503, 'Your request could not be sent. Please try again or contact us directly.');
}
