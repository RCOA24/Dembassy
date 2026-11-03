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

This is a static website built with Next.js App Router, React, and TypeScript. It includes a service directory, contact information, and an appointment inquiry form.

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

The static export does not require Node.js, PHP, a database, or a mail service on the server. Confirm the hosting subscription and document root, back up the existing site, then upload the *contents* of `out/` to the domain root. Configure HTTPS and test every route directly and on refresh, including assets. The site uses root-relative paths and is intended for a domain root rather than a subdirectory. Arrange redirects for legacy URLs and ensure old WordPress rules do not intercept the new files.

## Appointment inquiries

The form opens an email draft addressed to `admin@dembassy.ky`; visitors must send it themselves. The website does not submit, deliver, or confirm appointments. Service links preselect the service, and appointment times use Cayman Islands time.

## Before launch

Confirm the domain, office address, contact information, services, vacancies, and asset rights with the business. Review the footer text, test the site across desktop and mobile sizes and browsers, and check navigation, search, forms, accessibility, email drafts, and static hosting routes. A production build alone does not verify the deployed site or email delivery.
