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
    url: `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
  };
}

export function AppointmentForm() {
  const [service, setService] = useState("");
  const [minimumDate, setMinimumDate] = useState("");
  const [draftUrl, setDraftUrl] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const [fallback, setFallback] = useState("");

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
    const { url } = createDraft(event.currentTarget);
    setDraftUrl(url);
    window.location.href = url;
  }

  async function copyDetails(form: HTMLFormElement) {
    if (!form.reportValidity()) return;
    const { subject, body } = createDraft(form);
    const text = `To: ${recipient}\nSubject: ${subject}\n\n${body}`;
    try {
      await navigator.clipboard.writeText(text);
      setFallback("");
      setCopyStatus(
        "Details copied. Paste them into an email and send it to admin@dembassy.ky.",
      );
    } catch {
      setFallback(text);
      setCopyStatus("Select and copy the details below into your email.");
    }
  }

  return (
    <form id="appointment-form" className="form-panel" onSubmit={submit}>
      <h2>Request an appointment</h2>
      <p>
        This form opens a draft in your email app. Review and manually send it.
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
        Prepare email request <span aria-hidden="true">↗</span>
      </button>{" "}
      <button
        className="button outline"
        type="button"
        onClick={(event) => {
          if (event.currentTarget.form)
            void copyDetails(event.currentTarget.form);
        }}
      >
        Copy appointment details
      </button>
      <p role="status">{copyStatus}</p>
      {fallback && (
        <textarea
          aria-label="Appointment details to copy"
          readOnly
          value={fallback}
          onFocus={(event) => event.currentTarget.select()}
        />
      )}
      {draftUrl && (
        <div className="form-message" role="status">
          If your email app opened, review and send the draft. Nothing has been
          submitted through this website. If it did not open, try again or copy
          the details.{" "}
          <a href={draftUrl} style={{ textDecoration: "underline" }}>
            Open email draft ↗
          </a>
        </div>
      )}
    </form>
  );
}
