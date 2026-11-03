import Link from "next/link";
import { CallToAction } from '../service-detail';
export default function Careers() {
  return (
    <>
      <section className="page-intro">
        <div className="wrap">
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Careers</span>
          </div>
          <span className="eyebrow">Careers</span>
          <h1>
            People who care.
            <br />
            <em>Work that connects.</em>
          </h1>
          <p>
            Explore opportunities to support individuals and businesses as part
            of the D’ Embassy team.
          </p>
        </div>
      </section>
      <section className="section wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">Grow with us</span>
            <h2>Bring your perspective.</h2>
          </div>
          <p>
            Collaboration, meaningful work and opportunities to grow are part of
            the team’s approach.
          </p>
        </div>
        <div className="value-grid">
          <article>
            <h3>Make an impact</h3>
            <p>Help clients move forward with important plans and decisions.</p>
          </article>
          <article>
            <h3>Work together</h3>
            <p>Contribute your ideas in a collaborative environment.</p>
          </article>
          <article>
            <h3>Keep growing</h3>
            <p>Explore opportunities to build your skills and experience.</p>
          </article>
        </div>
      </section>
      <section className="section wrap" style={{ paddingTop: "0" }}>
        <span className="eyebrow">Explore opportunities</span>
        <h2>Find your next chapter.</h2>
        <p style={{ marginTop: "20px" }}>
          Roles listed on the existing website. Contact the team to confirm
          current availability.
        </p>
        <div className="job">
          <h3>Marketing / Sales Representative</h3>
          <a
            href={
              "mailto:admin@dembassy.ky?subject=Career%20enquiry%3A%20Marketing%20%2F%20Sales%20Representative"
            }
          >
            Enquire about role ↗
          </a>
        </div>
        <div className="job">
          <h3>Administrative Assistant</h3>
          <a
            href={
              "mailto:admin@dembassy.ky?subject=Career%20enquiry%3A%20Administrative%20Assistant"
            }
          >
            Enquire about role ↗
          </a>
        </div>
        <div className="job">
          <h3>Sales Representative / Administrative Assistant</h3>
          <a
            href={
              "mailto:admin@dembassy.ky?subject=Career%20enquiry%3A%20Sales%20Representative%20%2F%20Administrative%20Assistant"
            }
          >
            Enquire about role ↗
          </a>
        </div>
        <div className="job">
          <h3>Technical Support</h3>
          <a
            href={
              "mailto:admin@dembassy.ky?subject=Career%20enquiry%3A%20Technical%20Support"
            }
          >
            Enquire about role ↗
          </a>
        </div>
      </section>
      <CallToAction />
    </>
  );
}
