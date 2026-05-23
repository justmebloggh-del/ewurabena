"use client";

import { useRef, useState } from "react";

type FormState = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(formData: FormData) {
    setState("submitting");
    setMessage("");

    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      organization: String(formData.get("organization") || ""),
      event_date: String(formData.get("event_date") || ""),
      message: String(formData.get("message") || ""),
      website: String(formData.get("website") || ""),
    };

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setState("error");
      setMessage(data.error || "Could not submit your message.");
      return;
    }

    setState("success");
    setMessage("Your message was sent successfully. We will get back to you soon.");
    formRef.current?.reset();
  }

  return (
    <form
      ref={formRef}
      action={onSubmit}
      className="card"
      style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
    >
      {/* Honeypot */}
      <input type="text" name="website" autoComplete="off" tabIndex={-1} aria-hidden="true" style={{ display: "none" }} />

      <div>
        <label htmlFor="name" className="label">Full Name *</label>
        <input id="name" name="name" required className="input" placeholder="Your full name" />
      </div>
      <div>
        <label htmlFor="email" className="label">Email Address *</label>
        <input id="email" name="email" type="email" required className="input" placeholder="your@email.com" />
      </div>
      <div>
        <label htmlFor="organization" className="label">Church / Organization</label>
        <input id="organization" name="organization" className="input" placeholder="Your church or organization" />
      </div>
      <div>
        <label htmlFor="event_date" className="label">Event Date</label>
        <input id="event_date" name="event_date" type="date" className="input" />
      </div>
      <div>
        <label htmlFor="message" className="label">Message & Event Details *</label>
        <textarea id="message" name="message" required rows={5} className="input" placeholder="Tell us about your event, location, expected attendance, and any other details..." style={{ resize: "vertical" }} />
      </div>

      <button
        type="submit"
        disabled={state === "submitting"}
        className="btn-primary"
        style={{ width: "100%", justifyContent: "center", opacity: state === "submitting" ? 0.6 : 1 }}
      >
        {state === "submitting" ? "Sending..." : "Submit Booking Inquiry"}
      </button>

      {message && (
        <p style={{ fontSize: "0.875rem", color: state === "success" ? "#6ee7b7" : "#fca5a5", textAlign: "center" }}>
          {message}
        </p>
      )}
    </form>
  );
}
