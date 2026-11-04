<?php
// Copy to the private dembassy-mailer directory as config.php and fill in on the host.
// Values in server environment variables take precedence over these settings.
return [
    'SMTP_HOST' => '',
    'SMTP_PORT' => '587',
    'SMTP_ENCRYPTION' => 'tls', // tls for STARTTLS or ssl for implicit TLS
    'SMTP_USERNAME' => '',
    'SMTP_PASSWORD' => '',
    'SMTP_FROM' => '',
    'APPOINTMENT_TO' => 'admin@dembassy.ky',
    // 'APPOINTMENT_AUTOLOAD' => '/absolute/private/path/vendor/autoload.php',
];
