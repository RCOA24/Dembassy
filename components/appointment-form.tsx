"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { services } from "../lib/site";
import appointmentOptions from "../public/api/appointment-options.json";

type ApiResponse = { ok: boolean; message: string };
type ActiveRequest = { controller: AbortController; timer: ReturnType<typeof setTimeout>; cancelled: boolean; timedOut: boolean };

function isApiResponse(value: unknown): value is ApiResponse {
  if (typeof value !== "object" || value === null) return false;
  const response = value as Record<string, unknown>;
  return typeof response.ok === "boolean" && typeof response.message === "string" && response.message.length > 0;
}

export function AppointmentForm() {
  const [service, setService] = useState("");
  const [minimumDate, setMinimumDate] = useState("");
  const [sending, setSending] = useState(false);
  const submitting = useRef(false);
  const activeRequest = useRef<ActiveRequest | null>(null);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  useEffect(() => {
    const selected = new URLSearchParams(window.location.search).get("service");
    if (services.some((item) => item.name === selected)) setService(selected ?? "");
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Cayman", year: "numeric", month: "2-digit", day: "2-digit",
    }).formatToParts(new Date());
    const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value ?? "";
    setMinimumDate(`${part("year")}-${part("month")}-${part("day")}`);
  }, []);

  useEffect(() => () => {
    const request = activeRequest.current;
    if (request) {
      request.cancelled = true;
      clearTimeout(request.timer);
      request.controller.abort();
    }
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const field = (name: string) => String(formData.get(name) ?? "");
    const data = {
      name: field("name"), email: field("email"), service: field("service"),
      date: field("date"), time: field("time"), message: field("message"), website: field("website"),
    };
    submitting.current = true;
    setSending(true);
    setResult(null);
    const controller = new AbortController();
    const request: ActiveRequest = {
      controller,
      cancelled: false,
      timedOut: false,
      timer: setTimeout(() => {
        request.timedOut = true;
        controller.abort();
      }, 30_000),
    };
    activeRequest.current = request;

    try {
      const response = await fetch("/api/appointment.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal: controller.signal,
      });
      const payload: unknown = await response.json().catch((error: unknown) => {
        if (controller.signal.aborted) throw error;
        return null;
      });
      if (request.cancelled) return;
      if (request.timedOut) throw new DOMException("Request timed out", "AbortError");
      if (!isApiResponse(payload) || payload.ok !== response.ok) {
        throw new Error("The server returned an unexpected response. Please try again or contact us directly.");
      }
      if (!response.ok) {
        throw new Error(payload.message);
      }

      form.reset();
      setService("");
      setResult({ ok: true, message: "Your request was accepted for delivery. A copy was sent to your email address. The team will reply to confirm availability." });
    } catch (error) {
      if (!request.cancelled) {
        setResult({
          ok: false,
          message: request.timedOut ? "Your request timed out. It may have been received by our team. Please contact us before submitting again to avoid sending a duplicate request." :
            error instanceof TypeError ? "We could not connect. Please check your connection and try again." :
              error instanceof Error ? error.message : "Your request could not be sent. Please try again.",
        });
      }
    } finally {
      clearTimeout(request.timer);
      if (!request.cancelled) setSending(false);
      submitting.current = false;
      if (activeRequest.current === request) activeRequest.current = null;
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
          <option>{appointmentOptions.otherService}</option>
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
            {appointmentOptions.times.map((time) => <option key={time}>{time}</option>)}
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
