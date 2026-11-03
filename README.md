# D’ Embassy

A static website for D’ Embassy built with Next.js App Router, React and TypeScript. It includes the service directory, contact information and an appointment inquiry form.

The application lives in `app/`, `components/`, and `lib/`. Page components render as static HTML; the header, service directory, and appointment form are interactive client components. Edit page content in `components/pages/`, shared service details in `lib/services.json` and `components/service-detail.tsx`, and styling in `app/globals.css`. Internal links use Next.js navigation and the logo in `public/assets/logo.jpg` is also the site icon.

## Build

Use Node.js 20.9 or later, preferably Node 24:

```sh
npm ci
npm run dev
```

Open the local URL printed in the terminal. To create and check a production build:

```sh
npm run lint
npm run typecheck
npm run build
```

The deployable files are in `out/`. Set `NEXT_PUBLIC_SITE_URL` at build time to the confirmed production origin; the current default is `https://dembassy.ky`, based on the original project notes and must be confirmed. Canonical URLs, sitemap, robots and structured data use this origin. Do not allow staging sites to be indexed.

Run `npm run dev` to preview the app locally. The development server uses `.next-dev`, separate from the production build's `.next` directory. If port 3000 is already in use, Next.js selects another port and prints its address. Stop an existing development server before starting another for this project.

## Deployment

This is a static export and does not need Node.js, PHP, a database, or a mail service on the server. Confirm the actual subscription and document root in Hostinger hPanel. Back up the existing site first, then upload the *contents* of `out/` to the domain root. Configure HTTPS and, if supported, the custom 404 page (`404.html`). Ensure old WordPress rules do not intercept the new files and arrange redirects for legacy URLs. Test each route directly and on refresh, including assets. The application uses root-relative paths and is intended for a domain root, not a subdirectory. Hostinger plan and Node support cannot be determined without account access.

## Appointment requests

The form opens an encoded mailto draft addressed to admin@dembassy.ky; the visitor must manually send it. There is no submission, delivery or appointment confirmation by the website. The retry link and copy-details button provide fallbacks. Service links preselect the service. Times are Cayman Islands time. No contact number was added because the original form did not collect one.

## Launch checks

Confirm the domain, office address and unit, contact information, services, vacancies, existing review, asset rights, and any legacy downloads and redirects with the business. The original footer's “Website redesign concept” text is retained for fidelity and should be reviewed before launch. Check all pages and interactions at 320, 375, 768, 1024, 1440 and wider viewports, with keyboard, reduced motion, and current Chrome, Edge, Firefox, Safari and mobile browsers. Check search/filter, mobile menu and Escape, FAQ, links and service preselection. Test required fields, special characters, date limits, draft content, retry and copy fallback, and manually send a test email from actual configured mail clients. Test static hosting routes, HTTPS, search metadata and accessibility with real devices before launch.
