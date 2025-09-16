"use client";

import { useState } from "react";

export default function UpdatesPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setMessage("Check your inbox to confirm your subscription.");
        setEmail("");
      } else {
        const data = await res.json().catch(() => ({}));
        setStatus("error");
        setMessage(data?.error ?? "Subscription failed. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-bold mb-2">Get Updates</h1>
      <p className="text-gray-300 mb-6">
        Join the list for releases, tools, and rapid state-change tips.
      </p>

      <form onSubmit={onSubmit} className="rounded-xl border border-white/10 bg-white/5 p-4">
        <label htmlFor="email" className="block text-sm text-gray-300 mb-2">
          Email address
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
        />

        <button
          type="submit"
          disabled={status === "loading"}
          className="mt-3 w-full rounded-lg bg-white/10 px-4 py-2 text-white hover:bg-white/20 transition disabled:opacity-60"
          aria-busy={status === "loading"}
        >
          {status === "loading" ? "Subscribing…" : "Subscribe"}
        </button>

        {message && (
          <p
            className={`mt-3 text-sm ${
              status === "success" ? "text-emerald-300" : "text-red-300"
            }`}
          >
            {message}
          </p>
        )}
      </form>

      <p className="mt-4 text-xs text-gray-400">
        We’ll never share your email. Unsubscribe anytime.
      </p>
    </div>
  );
}
