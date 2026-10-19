"use client";

import { useRef, useState } from "react";

type FormState = "idle" | "submitting" | "success" | "error";

export function PrayerRequestForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(formData: FormData) {
    setState("submitting");
    setMessage("");

    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      message: String(formData.get("prayer_request") || ""),
      website: String(formData.get("website") || ""),
    };

    const response = await fetch("/api/prayer-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setState("error");
      setMessage(data.error || "Could not submit your prayer request.");
      return;
    }

    setState("success");
    setMessage("Your prayer request was received. We are standing with you in prayer.");
    formRef.current?.reset();
  }

  return (
    <form
      ref={formRef}
      action={onSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}
    >
      {/* Honeypot */}
      <input type="text" name="website" autoComplete="off" tabIndex={-1} aria-hidden="true" style={{ display: "none" }} />

      <div>
        <label className="label">Your Name</label>
        <input type="text" name="name" required placeholder="Enter your name" className="input" />
      </div>
      <div>
        <label className="label">Your Email</label>
        <input type="email" name="email" required placeholder="So we can follow up with you" className="input" />
      </div>
      <div>
        <label className="label">Prayer Request</label>
        <textarea
          name="prayer_request"
          rows={5}
          required
          placeholder="Share your prayer request..."
          className="input"
          style={{ resize: "vertical" }}
        />
      </div>
      <button
        type="submit"
        disabled={state === "submitting"}
        className="btn-primary"
        style={{ alignSelf: "flex-start", opacity: state === "submitting" ? 0.6 : 1 }}
      >
        {state === "submitting" ? "Sending…" : "🙏  Submit Prayer Request"}
      </button>

      {message && (
        <p style={{ fontSize: "0.875rem", color: state === "success" ? "#2E7D32" : "#C0392B" }}>
          {message}
        </p>
      )}
    </form>
  );
}
