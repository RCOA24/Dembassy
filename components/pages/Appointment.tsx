import Link from "next/link";
import { AppointmentForm } from "../appointment-form";
export default function Appointment() {
  return (
    <>
      <section className="page-intro">
        <div className="wrap">
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Appointments</span>
          </div>
          <span className="eyebrow">Appointments</span>
          <h1>
            Your next chapter.
            <br />
            <em>Let’s talk about it.</em>
          </h1>
          <p>
            Tell us what you need help with and send an appointment request
            to our team.
          </p>
        </div>
      </section>
      <section className="section wrap contact-grid">
        <div>
          <span className="eyebrow">Personal support starts here</span>
          <h2>
            A time to discuss
            <br />
            your possibilities.
          </h2>
          <p>
            Choose a service and share a little about your plans. The team will
            confirm availability and advise on next steps.
          </p>
          <div className="contact-row">
            <span className="eyebrow">Call our team</span>
            <a href="tel:+13459458006">+1 (345) 945-8006 ↗</a>
          </div>
          <div className="contact-row">
            <span className="eyebrow">Email us</span>
            <a href="mailto:admin@dembassy.ky">admin@dembassy.ky ↗</a>
          </div>
          <div className="contact-row">
            <span className="eyebrow">Visit us</span>
            <p>
              Unit 3C, Grand Cayman, 80 Shedden Road,
              <br />
              Elizabethan Square, Amerigo House,
              <br />
              KY1-1503, Cayman Islands
            </p>
            <a
              className="text-link"
              style={{ font: "12px Arial", marginTop: "15px" }}
              target="_blank"
              rel="noopener"
              href={
                "https://www.google.com/maps/dir/?api=1&destination=19.2940755%2C-81.3798832"
              }
            >
              Get directions ↗
            </a>
          </div>
        </div>
        <AppointmentForm />
      </section>
      <section className="section wrap" style={{ paddingTop: "0" }}>
        <div className="faq">
          <span className="eyebrow">Before we talk</span>
          <h2>A few helpful answers.</h2>
          <details>
            <summary>
              Is my appointment confirmed when I complete this form?
            </summary>
            <p>
              No. The form sends your request to our team and emails you a copy.
              The team will respond to confirm availability.
            </p>
          </details>
          <details>
            <summary>What should I prepare for the first conversation?</summary>
            <p>
              Share the service you are interested in and a short overview of
              your plans. The team can then explain which information or
              documents are relevant to your situation.
            </p>
          </details>
          <details>
            <summary>Can I contact the team directly?</summary>
            <p>
              Yes. Call
              <a href="tel:+13459458006">+1 (345) 945-8006</a>
              or email
              <a href="mailto:admin@dembassy.ky">admin@dembassy.ky</a>.
            </p>
          </details>
        </div>
      </section>
    </>
  );
}
