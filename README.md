# D’ Embassy

**Connections that go beyond borders.**

D’ Embassy helps individuals and businesses move forward with reliable solutions, personal attention, and a global outlook. Based in the Cayman Islands, the team connects people across borders and makes complex tasks easier to understand through guidance tailored to each client’s goals.

## About us

D’ Embassy serves people from different industries, nationalities, and backgrounds. Its approach begins with listening and builds relationships through trust, integrity, and care. From the Cayman Islands to opportunities beyond, personal understanding is the starting point for meaningful support.

### Our mission

Connect people with the right solutions through reliable service, innovative thinking, and personalized guidance that helps people and businesses thrive locally and internationally.

### Our vision

Be a trusted partner for growth and new possibilities in the Cayman Islands and beyond.

### What guides us

- **Trust and integrity:** Dependable support and thoughtful communication build lasting relationships.
- **Your needs, understood:** Every client has a different story, so the team starts by listening.
- **Ideas that move you forward:** Practical problem-solving and an inclusive perspective help address different challenges.

## About this website

This is a static website built with Next.js App Router, React, and TypeScript. It includes a service directory, contact information, and an appointment inquiry form backed by a PHP email endpoint.

Page content lives in `components/pages/`, shared service details in `public/api/services.json` and `components/service-detail.tsx`, and styling in `app/globals.css`. The main application is in `app/`, `components/`, and `lib/`. Page components render as static HTML; the header, service directory, and appointment form are interactive client components. The form and PHP endpoint share the service and time options in `public/api/`; edit these files together with any relevant page content when options change.

## Run locally

Use Node.js 20.9 or later, preferably Node.js 24:

```sh
npm ci
npm run dev
```

Open the local URL printed in the terminal. To check and build the site:

```sh
npm run lint
npm run typecheck
npm run build
```

For local appointment testing, install PHP 8.1+ with OpenSSL and Composer 2. In a second terminal run `npm run dev:php` to start PHP on `127.0.0.1:8000`; the Next.js development server proxies `/api/appointment.php` to it. Restart `npm run dev` after changing `next.config.ts`. Set up the private local directory (PowerShell):

```powershell
New-Item -ItemType Directory -Force dembassy-mailer
Copy-Item server/composer.json, server/composer.lock dembassy-mailer/
composer install --no-dev --working-dir=dembassy-mailer
if (-not (Test-Path dembassy-mailer/config.php)) { Copy-Item server/config.example.php dembassy-mailer/config.php }
```

Only copy the example config if `dembassy-mailer/config.php` does not already exist. Set the SMTP values and a test recipient you control in that private, Git-ignored config. The PHP server and config are only for local testing; production still serves the static export through PHP hosting. Never commit or share the config or credentials.

The deployable static files are in `out/`. Set `NEXT_PUBLIC_SITE_URL` at build time to the confirmed production origin. The current default is `https://dembassy.ky` and should be confirmed before launch. Canonical URLs, the sitemap, robots rules, and structured data use this origin.

## Appointment architecture

The static form sends JSON to `/api/appointment.php`. PHP validates it and uses PHPMailer with authenticated SMTP. One email goes to `admin@dembassy.ky` by default and CCs the visitor; the visitor is also Reply-To. The From address is an SMTP-authorized site address. A successful response means the SMTP server accepted the message; it does not guarantee inbox delivery or confirm the appointment. Preferred dates use `America/Cayman`.

## Hostinger deployment

The host must execute PHP 8.1 or later with OpenSSL, JSON, filter, hash and ctype extensions, provide writable private storage and allow outbound SMTP to the chosen provider. Use a currently supported PHP version and confirm CLI and website PHP versions separately. Hostinger documents [PHP configuration](https://support.hostinger.com/en/articles/1575755-how-to-change-the-php-version-of-your-hosting-plan), [PHP information](https://support.hostinger.com/en/articles/1583467-how-to-check-the-php-information-of-your-website), and [Composer over SSH](https://support.hostinger.com/en/articles/5792078-how-to-use-composer); availability can vary by plan.

1. Back up the current website, database and configuration, and establish a rollback route before changing the document root. Record existing WordPress redirects and rewrite rules; do not delete the existing installation or change DNS/MX as part of this setup.
2. Build with `npm ci` and `npm run build`. Upload the **contents** of `out/` into the actual domain document root. This site assumes the domain root, not a subdirectory. Confirm `api/appointment.php`, `api/services.json` and `api/appointment-options.json` are included. Configure HTTPS and arrange required legacy redirects. Existing WordPress rules must not intercept static routes, assets or `/api/appointment.php`.
3. Create `dembassy-mailer` as a sibling of the actual `public_html`. Upload `server/composer.json`, `server/composer.lock`, and `server/config.example.php` there. The default lookup is relative to the deployed endpoint, so this exact sibling relationship matters:

   ```text
   domains/dembassy.ky/                # example; confirm the actual domain root
   ├── public_html/
   │   ├── index.html
   │   ├── _next/
   │   ├── assets/
   │   └── api/
   │       ├── appointment.php
   │       ├── services.json
   │       └── appointment-options.json
   └── dembassy-mailer/                # outside every web-accessible document root
       ├── config.php                  # private credentials, created on the host
       ├── composer.json
       ├── composer.lock
       ├── rate-limit.json             # created by PHP; writable by its user
       └── vendor/autoload.php
   ```

4. In the private directory run `composer2 install --no-dev --no-interaction --prefer-dist` via SSH, if available. Alternatively, run Composer 2 locally using compatible PHP/extensions and upload the resulting `vendor/` there. Deploy the lock file with the dependency. If the vendor directory must live elsewhere, set `APPOINTMENT_AUTOLOAD` to its absolute `vendor/autoload.php` path in the private configuration or server environment.
5. Copy `config.example.php` to `config.php` **inside the private directory** and enter the SMTP settings on the host. Restrict access to the hosting account and PHP user; for a typical same-user setup use directory mode `700` and config mode `600`, adjusting only if the hosting account requires it. PHP must be able to create and write `rate-limit.json` there. Do not put credentials in Git, `public_html`, a public `.env`, or the static build. Verify the private directory is outside *all* domain and subdomain document roots, including aliases and symlinks.
6. Verify PHP execution before using the form: open `/api/appointment.php` with a browser GET and confirm HTTP 405 with JSON, rather than a download, source code, or WordPress page. Check the two JSON files are deployed and static routes and assets work on direct navigation and refresh. Test with controlled addresses as described below. Never expose `phpinfo()` publicly for this check.

## Private SMTP configuration

Obtain SMTP settings from the chosen email provider; `admin@dembassy.ky` is not assumed to use Hostinger email. Fill `config.php` with the keys in `server/config.example.php`. An environment variable visible to PHP takes precedence for each nonempty setting; otherwise the private file is used. Do not assume a `.env` file is automatically loaded into `getenv()` on shared hosting. PHP can run with a different environment from SSH.

| Setting | Value |
| --- | --- |
| `SMTP_HOST` | Provider's outgoing SMTP hostname |
| `SMTP_PORT` | Usually `587` for STARTTLS or `465` for implicit TLS |
| `SMTP_ENCRYPTION` | `tls` for STARTTLS or `ssl` for implicit TLS |
| `SMTP_USERNAME` | SMTP account username |
| `SMTP_PASSWORD` | SMTP password or provider-issued app password |
| `SMTP_FROM` | Sender address authorized by the provider |
| `APPOINTMENT_TO` | Optional team inbox; defaults to `admin@dembassy.ky` |
| `APPOINTMENT_AUTOLOAD` | Optional absolute path to private `vendor/autoload.php` |

Certificate verification remains enabled. The configured account must support the provider's SMTP authentication method; the current code uses username/password authentication. If the provider requires OAuth, a compatible provider or an OAuth implementation is needed. Do not disable TLS verification to work around a certificate issue.

## Abuse controls and limitations

The endpoint allows 10 valid submission attempts per observed IP and 100 across the installation in a rolling 10-minute window. Attempts are reserved before SMTP, including failed delivery attempts. A single bounded JSON file is locked only while updating counts; expired entries are pruned on subsequent attempts. If private storage is unavailable or corrupt, the endpoint returns 503 rather than sending without a limit. Only `REMOTE_ADDR` is used; forwarded headers are not trusted. A reverse proxy may make many visitors share one limit. A busy shared network or the global limit can temporarily block legitimate users. The honeypot silently discards obvious bot submissions.

The visitor CC is sent to the address supplied in the form without proving ownership. Limits and the honeypot reduce abuse but cannot prevent distributed spam or unsolicited copies. Monitor mail-provider usage and logs; add a suitable verification or challenge if abuse occurs. CC exposes the team address and visitor address to both recipients. On multi-server installations, this file-based limit applies per filesystem, not across independent servers. If a connection fails after SMTP acceptance or the browser loses the response, the sender may see an error even though a message was accepted; retrying can produce a duplicate.

## Tests and troubleshooting

Run PHP syntax and Composer checks using the host's compatible PHP and Composer:

```sh
php -l public/api/appointment.php
php -l server/config.example.php
composer2 validate --no-check-publish --working-dir=server
npm run test:appointment
```

The automated endpoint tests require Node.js and PHP on `PATH`; set `PHP_BIN` to an executable path if needed. They run local PHP servers against isolated temporary files and a fake mailer, with no real email. They cover all displayed services and times, UTF-8, invalid input, missing configuration/storage/autoload, failed sends, and concurrent rate limits. They do not prove real SMTP delivery or the browser's appearance.

For manual testing, use a temporary SMTP account and **two email addresses you control**, configured in the private file; never run automated tests against a client's SMTP account. Submit valid and invalid forms, verify the sending/loading state and preserved input after errors, check success resets the form, and simulate network failure, malformed responses, 429 and 503. Check the team inbox and visitor CC, message contents, and Reply-To. Verify the appointment is described as a request. Afterwards configure the authorized production sender and recipient and perform an agreed live test with controlled addresses.

| Response | Check |
| --- | --- |
| 400 | JSON must be an object with expected string fields; check the deployed frontend and endpoint versions. |
| 413 | Request exceeds 20,000 bytes; reduce the message. |
| 415 | The endpoint accepts `Content-Type: application/json`; check the frontend and hosting rules. |
| 422 | Check the required fields, service/time options and date in Cayman time. |
| 429 | Wait up to 10 minutes; check whether a proxy or shared IP groups visitors. |
| 503 | Check private directory permissions, Composer autoload, PHP extensions, config values, SMTP connectivity and PHP error logs. Logs contain categories, not SMTP exception details or inquiry text. |

For SMTP failures, verify provider hostname, port, TLS mode, credentials, sender authorization, outbound network access and the provider's authentication requirements. Rotate a password by updating the private config or hosting environment with the new provider credential, then run a controlled delivery test and revoke the old credential according to the provider's process. Avoid logging secrets or message contents.

To roll back, restore the previously backed-up site files and server rewrite configuration to their original locations, verify their routes and mail flow, and retain the private mailer directory securely until the rollback is confirmed. Restore any database only if that migration actually changed it. DNS and MX records should remain as previously configured.

## Before launch

Confirm the domain, office address, contact information, services, vacancies, and asset rights with the business. Review the footer text, test the site across desktop and mobile sizes and browsers, and check navigation, search, forms, accessibility, appointment email delivery, and static hosting routes. A production build alone does not verify the deployed site or email delivery.
