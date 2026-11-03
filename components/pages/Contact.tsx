import Link from "next/link";
export default function Contact() {
  return (
    <>
      <section className="page-intro">
        <div className="wrap">
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Contact</span>
          </div>
          <span className="eyebrow">Contact</span>
          <h1>
            A conversation can
            <br />
            <em>open new doors.</em>
          </h1>
          <p>
            Have a question or ready to get started? Connect with our team in
            the Cayman Islands.
          </p>
        </div>
      </section>
      <section className="section wrap contact-grid">
        <div>
          <span className="eyebrow">We’re here to help</span>
          <h2>Let’s connect.</h2>
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
              3rd Floor, Amerigo House
              <br />
              Elizabethan Square, 80 Shedden Road
              <br />
              George Town, Cayman Islands
            </p>
            <a
              className="text-link"
              style={{ font: "12px Arial", marginTop: "15px" }}
              target="_blank"
              rel="noopener"
              href={
                "https://www.google.com/maps/search/?api=1&query=Amerigo+House+Elizabethan+Square+George+Town+Cayman+Islands"
              }
            >
              Get directions ↗
            </a>
          </div>
          <div className="contact-row">
            <span className="eyebrow">Support</span>
            <a href="tel:+13459384978">+1 (345) 938-4978 ↗</a>
          </div>
        </div>
        <div>
          <img
            className="office-photo"
            src="/assets/team.jpg"
            alt="Amerigo House at Elizabethan Square"
          />
          <span className="eyebrow">Office hours · Cayman Islands time</span>
          <div className="hours">
            <div>
              <span>Monday–Friday</span>
              <span>8:30am–5:00pm</span>
            </div>
            <div>
              <span>Saturday</span>
              <span>By appointment</span>
            </div>
            <div>
              <span>Sunday</span>
              <span>Closed</span>
            </div>
          </div>
          <div style={{ marginTop: "28px" }}>
            <Link className="button " href="/appointment/">
              Request an appointment
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
