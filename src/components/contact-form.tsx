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
      className="space-y-4 rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--bg-card)] p-6"
    >
      <input
        type="text"
        name="website"
        autoComplete="off"
        tabIndex={-1}
        aria-hidden="true"
        className="hidden"
      />
      <div>
        <label htmlFor="name" className="label">
          Full Name
        </label>
        <input id="name" name="name" required className="input" />
      </div>
      <div>
        <label htmlFor="email" className="label">
          Email
        </label>
        <input id="email" name="email" type="email" required className="input" />
      </div>
      <div>
        <label htmlFor="organization" className="label">
          Organization
        </label>
        <input id="organization" name="organization" className="input" />
      </div>
      <div>
        <label htmlFor="event_date" className="label">
          Event Date 
        </label>
        <input id="event_date" name="event_date" type="date" className="input" />
      </div>
      <div>
        <label htmlFor="message" className="label">
          Message
        </label>
        <textarea id="message" name="message" required rows={5} className="input" />
      </div>

      <button type="submit" disabled={state === "submitting"} className="btn-primary w-full disabled:opacity-60">
        {state === "submitting" ? "Sending..." : "Send Inquiry"}
      </button>

      {message && (
        <p className={state === "success" ? "text-sm text-emerald-300" : "text-sm text-rose-300"}>{message}</p>
      )}
    </form>
  );
}
