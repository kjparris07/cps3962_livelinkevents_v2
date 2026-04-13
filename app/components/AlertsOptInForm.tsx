"use client";

import { useState } from "react";

type Props = {
  source?: string;
};

export default function AlertsOptInForm({ source = "homepage_form" }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/alerts/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="alerts-form">
      <label htmlFor="alerts-email" className="alerts-label">
        Get concert alerts in your inbox
      </label>

      <div className="alerts-input-row">
        <input
          id="alerts-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="alerts-input"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="alerts-button"
        >
          {status === "loading" ? "Subscribing..." : "Notify me"}
        </button>
      </div>

      <p className="alerts-helper">
        Be the first to know about new shows, presales, and special events. No spam, unsubscribe anytime.
      </p>

      {status === "success" && (
        <p className="alerts-success">
          Check your email to confirm your subscription.
        </p>
      )}
      {status === "error" && (
        <p className="alerts-error">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}
