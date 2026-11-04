"use client";

import { useEffect, useState, type FormEvent } from "react";
import { services } from "../lib/site";

export function AppointmentForm() {
  const [service, setService] = useState("");
  const [minimumDate, setMinimumDate] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  useEffect(() => {
    const selected = new URLSearchParams(window.location.search).get("service");
    if (services.some((item) => item.name === selected)) setService(selected ?? "");
    setMinimumDate(new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Cayman", year: "numeric", month: "2-digit", day: "2-digit",
    }).format(new Date()));
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setSending(true);
    setResult(null);

    try {
      const response = await fetch("/api/appointment.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const payload = await response.json().catch(() => null) as { message?: string } | null;
      if (!response.ok || !payload?.message) {
        throw new Error(payload?.message || "Your request could not be sent. Please try again.");
      }

      form.reset();
      setService("");
      setResult({ ok: true, message: "Your request was sent. We emailed you a copy and will reply to confirm availability." });
    } catch (error) {
      setResult({
        ok: false,
        message: error instanceof Error ? error.message : "Your request could not be sent. Please try again.",
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <form id="appointment-form" className="form-panel" onSubmit={submit}>
      <h2>Request an appointment</h2>
      <p>Send your request to our team. You will receive a copy by email, and we will reply to confirm availability.</p>
      <div className="form-row">
        <label>
          Your name
          <input required name="name" autoComplete="name" placeholder="Full name" maxLength={120} />
        </label>
        <label>
          Email address
          <input required name="email" type="email" autoComplete="email" placeholder="you@example.com" maxLength={254} />
        </label>
      </div>
      <label>
        What can we help with?
        <select name="service" id="appointment-service" required value={service} onChange={(event) => setService(event.target.value)}>
          <option value="">Choose a service</option>
          {services.map((item) => <option key={item.slug}>{item.name}</option>)}
          <option>I’m not sure yet</option>
        </select>
      </label>
      <div className="form-row">
        <label>
          Preferred date
          <input name="date" type="date" required min={minimumDate || undefined} />
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
        Anything you’d like us to know? <span style={{ fontWeight: 400 }}>(optional)</span>
        <textarea name="message" placeholder="A brief description of the support you need" maxLength={3000} />
      </label>
      <div style={{ position: "absolute", left: "-10000px" }} aria-hidden="true">
        <label>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <p style={{ fontSize: 11 }}>
        Please leave passport numbers and other sensitive documents out of this initial enquiry. Preferred times are in Cayman Islands time.
      </p>
      <button className="button" type="submit" disabled={sending}>
        {sending ? "Sending…" : "Send a Message"} <span aria-hidden="true">↗</span>
      </button>
      {result && <div className="form-message" role={result.ok ? "status" : "alert"}>{result.message}</div>}
    </form>
  );
}
