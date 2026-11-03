import Link from "next/link";
import { CallToAction } from '../service-detail';
export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Cayman Islands · Global possibilities</span>
          <h1>
            Bridging borders.
            <br />
            Opening
            <br />
            <em>possibilities.</em>
          </h1>
          <p>
            Personal guidance for life, travel and business.
            <br />
            From your first question to your next chapter,
            <br />
            move forward with D’ Embassy.
          </p>
          <div className="actions">
            <Link className="button " href="/services/">
              Explore our services
              <span aria-hidden="true">↗</span>
            </Link>
            <Link className="text-link" href="/about/">
              Our story
              <span>↗</span>
            </Link>
          </div>
          <div className="hero-note">
            <span className="seal">◎</span>
            For individuals, families and businesses.
          </div>
        </div>
        <div className="hero-image">
          <img
            src="/assets/cayman.webp"
            alt={
              "Aerial view of the Cayman Islands coastline and turquoise Caribbean waters"
            }
            fetchPriority="high"
          />
          <div className="image-label">
            <div>
              <small>LOCAL UNDERSTANDING. GLOBAL OUTLOOK.</small>
              <strong>Your journey starts here.</strong>
            </div>
            <span aria-hidden="true">↗</span>
          </div>
        </div>
      </section>
      <div className="trust-strip">
        <span>Personalized guidance</span>
        <span>Clear communication</span>
        <span>Professional support</span>
        <span>Based in the Cayman Islands</span>
      </div>
      <section className="section wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">How we can help</span>
            <h2>
              One trusted connection.
              <br />
              So many ways forward.
            </h2>
          </div>
          <p>
            For the places you want to go and the plans you want to make. Find
            the support that fits your next step.
          </p>
        </div>
        <div className="service-grid">
          <Link className="service-card" href="/immigration-services/">
            <svg
              className="icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9"></circle>
              <ellipse cx="12" cy="12" rx="4" ry="9"></ellipse>
              <path d="M3 12h18M5 6h14M5 18h14"></path>
            </svg>
            <h3>Immigration</h3>
            <p>
              Find your way through work permits, residency and life in the
              Cayman Islands.
            </p>
            <span className="mini">Live &amp; work in Cayman</span>
            <span className="arrow" aria-hidden="true">
              ↗
            </span>
          </Link>
          <Link className="service-card" href="/visa-services/">
            <svg
              className="icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m21 3-7 18-3-8-8-3 18-7Z M11 13 21 3"></path>
            </svg>
            <h3>Visa services</h3>
            <p>
              Personal guidance for your travel plans, documents and visa
              application.
            </p>
            <span className="mini">Travel with a clearer plan</span>
            <span className="arrow" aria-hidden="true">
              ↗
            </span>
          </Link>
          <Link className="service-card" href="/passport-services/">
            <svg
              className="icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="5" y="3" width="14" height="18" rx="1"></rect>
              <circle cx="12" cy="10" r="4"></circle>
              <path d="M8 10h8M12 6v8M9 17h6"></path>
            </svg>
            <h3>Passport services</h3>
            <p>
              Support with Cayman Islands and British passport applications.
            </p>
            <span className="mini">Your next journey starts here</span>
            <span className="arrow" aria-hidden="true">
              ↗
            </span>
          </Link>
          <Link className="service-card" href="/corporate-services/">
            <svg
              className="icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path
                d={
                  "M4 21V7h8V3h8v18M2 21h20M8 10v2M8 15v2M16 7v2M16 12v2M16 17v4"
                }
              ></path>
            </svg>
            <h3>Corporate services</h3>
            <p>
              Practical support to establish and manage your business in the
              Cayman Islands.
            </p>
            <span className="mini">Build your business</span>
            <span className="arrow" aria-hidden="true">
              ↗
            </span>
          </Link>
          <Link className="service-card" href="/naturalization-services/">
            <svg
              className="icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20 3C7 2 3 8 5 15s14 4 15-12ZM4 21 15 9"></path>
            </svg>
            <h3>Naturalization</h3>
            <p>
              Guidance for British Overseas Territories citizenship and British
              registration.
            </p>
            <span className="mini">Take the next step</span>
            <span className="arrow" aria-hidden="true">
              ↗
            </span>
          </Link>
          <Link
            className="service-card"
            href="/notary-public-justice-of-the-peace/"
          >
            <svg
              className="icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m4 16 12-12 4 4L8 20H4v-4ZM13 7l4 4M12 21h9"></path>
            </svg>
            <h3>Notary &amp; Justice of the Peace</h3>
            <p>
              Assistance with affidavits, authentication and important personal
              documents.
            </p>
            <span className="mini">Documents, carefully handled</span>
            <span className="arrow" aria-hidden="true">
              ↗
            </span>
          </Link>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "28px",
            gap: "25px",
          }}
        >
          <p style={{ fontSize: "12px", margin: "0" }}>
            Looking for ongoing support? Explore our administrative packages.
          </p>
          <Link
            className="text-link"
            href="/services/"
            style={{ whiteSpace: "nowrap" }}
          >
            View all services ↗
          </Link>
        </div>
      </section>
      <section className="section dark-section">
        <div className="wrap split">
          <img
            src="/assets/team.jpg"
            alt="Amerigo House at Elizabethan Square in George Town"
            loading="lazy"
          />
          <div className="split-copy">
            <span className="eyebrow">
              Rooted in Cayman. Connected to the world.
            </span>
            <h2>
              Big possibilities.
              <br />
              <em>A personal approach.</em>
            </h2>
            <p>
              Behind every application is a person, a family or a business with
              a plan for the future. That’s where we begin.
            </p>
            <p>
              D’ Embassy brings people and businesses together with practical
              solutions, thoughtful guidance and an understanding of what makes
              every journey different.
            </p>
            <div className="values-inline">
              <span>Trust</span>
              <span>Integrity</span>
              <span>Personal attention</span>
            </div>
            <Link href="/about/" className="text-link">
              Get to know D’ Embassy
              <span>↗</span>
            </Link>
          </div>
        </div>
      </section>
      <section className="section wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">A clearer path forward</span>
            <h2>
              Every journey begins
              <br />
              with a conversation.
            </h2>
          </div>
          <Link className="text-link" href="/appointment/">
            Let’s talk
            <span>↗</span>
          </Link>
        </div>
        <div className="steps">
          <article className="step">
            <span className="number">01</span>
            <h3>A conversation about you</h3>
            <p>
              Share your plans and circumstances so the team can understand the
              support you need.
            </p>
          </article>
          <article className="step">
            <span className="number">02</span>
            <h3>Clarity on the paperwork</h3>
            <p>
              Work through the relevant documents and application requirements
              with personal guidance.
            </p>
          </article>
          <article className="step">
            <span className="number">03</span>
            <h3>Support along the way</h3>
            <p>
              Stay informed as your application progresses and understand the
              next steps.
            </p>
          </article>
        </div>
      </section>
      <section className="quote-section">
        <span className="eyebrow">A client’s perspective</span>
        <div className="stars" aria-hidden="true">
          ✧
        </div>
        <blockquote>
          “Very professional and much more friendly well loved it.”
        </blockquote>
        <cite>Rabin Parajuli</cite>
        <small>
          Client review published on D’ Embassy’s website · April 2026
        </small>
      </section>
      <CallToAction />
    </>
  );
}
