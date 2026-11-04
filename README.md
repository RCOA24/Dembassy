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

Page content lives in `components/pages/`, shared service details in `lib/services.json` and `components/service-detail.tsx`, and styling in `app/globals.css`. The main application is in `app/`, `components/`, and `lib/`. Page components render as static HTML; the header, service directory, and appointment form are interactive client components.

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

The deployable static files are in `out/`. Set `NEXT_PUBLIC_SITE_URL` at build time to the confirmed production origin. The current default is `https://dembassy.ky` and should be confirmed before launch. Canonical URLs, the sitemap, robots rules, and structured data use this origin.

## Deployment

The static pages do not require Node.js on the server. Appointment requests require PHP 8.1 or later, Composer-installed PHPMailer, and an authenticated SMTP account. Confirm the hosting subscription and document root, back up the existing site, then upload the *contents* of `out/` to the domain root. Configure HTTPS and test every route directly and on refresh, including assets. The site uses root-relative paths and is intended for a domain root rather than a subdirectory. Arrange redirects for legacy URLs and ensure old WordPress rules do not intercept the new files. Ensure `/api/appointment.php` is executed by PHP rather than downloaded or served as text.

## Appointment inquiries

The form POSTs to `/api/appointment.php`. PHPMailer sends one email to `admin@dembassy.ky` and CCs the address entered by the visitor, so the visitor receives a copy. The visitor's address is also the Reply-To address; the From address is the authenticated site mailbox. A successful response means the SMTP server accepted the message, not that an appointment is confirmed or that final inbox delivery is guaranteed. Service links preselect the service, and appointment times use Cayman Islands time.

Install the PHP dependency from `server/composer.json` with `composer install --no-dev --working-dir=server` (or run Composer in that directory). Deploy `server/vendor/` **outside the public document root**, for example as `dembassy-mailer/vendor/` beside `public_html/`. The endpoint defaults to that location; set `APPOINTMENT_AUTOLOAD` to the absolute path of `vendor/autoload.php` if the host uses a different layout. Do not publish the SMTP password or put it in the static build.

Set these server-side environment variables in the PHP hosting configuration:

| Variable | Value |
| --- | --- |
| `SMTP_HOST` | SMTP host provided by the mail service |
| `SMTP_PORT` | Usually `587` for TLS or `465` for SSL |
| `SMTP_ENCRYPTION` | `tls` or `ssl` |
| `SMTP_USERNAME` | Authenticated mailbox username |
| `SMTP_PASSWORD` | Mailbox password or app password |
| `SMTP_FROM` | Sender address authorized by the SMTP service |
| `APPOINTMENT_TO` | Optional team inbox; defaults to `admin@dembassy.ky` |

After deployment, submit a real request using an address you control. Check that the team receives it, the visitor receives the CC, Reply-To addresses the visitor, and the form shows an error if SMTP is unavailable. PHP is not installed in this local workspace, so PHP syntax and live SMTP delivery need to be checked on a PHP-capable host.

## Before launch

Confirm the domain, office address, contact information, services, vacancies, and asset rights with the business. Review the footer text, test the site across desktop and mobile sizes and browsers, and check navigation, search, forms, accessibility, appointment email delivery, and static hosting routes. A production build alone does not verify the deployed site or email delivery.
