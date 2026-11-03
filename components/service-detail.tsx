import Link from "next/link";
import { services } from "../lib/site";

type Service = (typeof services)[number];

export function ServiceDetail({ service }: { service: Service }) {
  const label = `Our services / ${service.name}`;
  return (
    <>
      <section className="page-intro">
        <div className="wrap">
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>{label}</span>
          </div>
          <span className="eyebrow">{label}</span>
          <h1>
            {service.name}.<br />
            <em>With you in mind.</em>
          </h1>
          <p>{service.intro}</p>
        </div>
      </section>
      <section className="section wrap detail-layout">
        <div>
          <span className="eyebrow">{service.tag}</span>
          <h2>
            {service.slug === "visa-services"
              ? "Destinations we support"
              : "How we can help"}
          </h2>
          <ul className="offer-list">
            {service.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="detail-note">
            Discuss your circumstances with the team to confirm the appropriate
            service, requirements and fees.
          </p>
          <Link className="text-link" href="/services/">
            ← Explore all services
          </Link>
        </div>
        <aside className="aside">
          <span className="eyebrow">Let’s get started</span>
          <h3>
            A little guidance.
            <br />A clearer next step.
          </h3>
          <p>
            Tell us what you have in mind and we’ll help you start the
            conversation.
          </p>
          <Link
            className="button"
            href={`/appointment/?service=${encodeURIComponent(service.name)}`}
          >
            Request an appointment<span aria-hidden="true">↗</span>
          </Link>
          <a href="tel:+13459458006">+1 (345) 945-8006 ↗</a>
          <small style={{ marginTop: 20 }}>
            Monday–Friday, 8:30am–5:00pm
            <br />
            Cayman Islands time
          </small>
        </aside>
      </section>
      <section className="section wrap" style={{ paddingTop: 0 }}>
        <span className="eyebrow">What to expect</span>
        <h2>Personal support, step by step.</h2>
        <Steps />
      </section>
      <CallToAction />
    </>
  );
}

export function Steps() {
  const steps = [
    [
      "A conversation about you",
      "Share your plans and circumstances so the team can understand the support you need.",
    ],
    [
      "Clarity on the paperwork",
      "Work through the relevant documents and application requirements with personal guidance.",
    ],
    [
      "Support along the way",
      "Stay informed as your application progresses and understand the next steps.",
    ],
  ];
  return (
    <div className="steps">
      {steps.map(([title, description], index) => (
        <article className="step" key={title}>
          <span className="number">{String(index + 1).padStart(2, "0")}</span>
          <h3>{title}</h3>
          <p>{description}</p>
        </article>
      ))}
    </div>
  );
}

export function CallToAction() {
  return (
    <div className="wrap cta">
      <div>
        <span className="eyebrow">Your next step</span>
        <h2>
          Let’s open a world
          <br />
          of possibilities.
        </h2>
        <p>Tell us where you want to go. We’ll help you get started.</p>
      </div>
      <Link className="button" href="/appointment/">
        Book an appointment<span aria-hidden="true">↗</span>
      </Link>
    </div>
  );
}
