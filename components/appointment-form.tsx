"use client";

import { useEffect, useState, type FormEvent } from "react";
import { services } from "../lib/site";

const recipient = "admin@dembassy.ky";

function createDraft(form: HTMLFormElement) {
  const data = new FormData(form);
  const field = (name: string) => String(data.get(name) ?? "").trim();
  const subject = `Appointment request — ${field("service")}`;
  const body = [
    "Hello D’ Embassy,",
    "",
    "I would like to request an appointment.",
    "",
    `Name: ${field("name")}`,
    `Email: ${field("email")}`,
    `Service: ${field("service")}`,
    `Preferred date: ${field("date")}`,
    `Preferred time: ${field("time")} (Cayman Islands time)`,
    "",
    field("message"),
    "",
    "Please confirm availability. Thank you.",
  ].join("\n");
  return {
    subject,
    body,
  };
}

export function AppointmentForm() {
  const [service, setService] = useState("");
  const [minimumDate, setMinimumDate] = useState("");
  const [draftPrepared, setDraftPrepared] = useState(false);

  useEffect(() => {
    const selected = new URLSearchParams(window.location.search).get("service");
    if (services.some((item) => item.name === selected))
      setService(selected ?? "");
    setMinimumDate(
      new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Cayman",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date()),
    );
  }, []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const { subject, body } = createDraft(event.currentTarget);
    setDraftPrepared(true);
    const params = new URLSearchParams({ view: "cm", fs: "1", to: recipient, su: subject, body });
    window.open(`https://mail.google.com/mail/?${params}`, "_blank", "noopener,noreferrer");
  }

  return (
    <form id="appointment-form" className="form-panel" onSubmit={submit}>
      <h2>Request an appointment</h2>
      <p>
        Open your Gmail draft, then review and send it.
        The team will respond to confirm availability.
      </p>
      <div className="form-row">
        <label>
          Your name
          <input
            required
            name="name"
            autoComplete="name"
            placeholder="Full name"
          />
        </label>
        <label>
          Email address
          <input
            required
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
          />
        </label>
      </div>
      <label>
        What can we help with?
        <select
          name="service"
          id="appointment-service"
          required
          value={service}
          onChange={(event) => setService(event.target.value)}
        >
          <option value="">Choose a service</option>
          {services.map((item) => (
            <option key={item.slug}>{item.name}</option>
          ))}
          <option>I’m not sure yet</option>
        </select>
      </label>
      <div className="form-row">
        <label>
          Preferred date
          <input
            name="date"
            type="date"
            required
            min={minimumDate || undefined}
          />
        </label>
        <label>
          Preferred time of day
          <select name="time">
            <option>Morning</option>
            <option>Afternoon</option>
            <option>No preference</option>
          </select>
        </label>
      </div>
      <label>
        Anything you’d like us to know?{" "}
        <span style={{ fontWeight: 400 }}>(optional)</span>
        <textarea
          name="message"
          placeholder="A brief description of the support you need"
        />
      </label>
      <p style={{ fontSize: 11 }}>
        Please leave passport numbers and other sensitive documents out of this
        initial enquiry. Preferred times are in Cayman Islands time.
      </p>
      <button className="button" type="submit">
        Send a Message <span aria-hidden="true">↗</span>
      </button>
      {draftPrepared && (
        <div className="form-message" role="status">
          Review and send the draft in Gmail. Your request is not sent until
          you send the email. If Gmail did not open, check your browser’s pop-up settings.
        </div>
      )}
    </form>
  );
}
