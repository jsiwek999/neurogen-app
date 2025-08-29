"use client";
import { useState } from "react";

export default function AccountClient() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);

  async function openPortal(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.trim()) { setError("Please enter the email you used at checkout."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/portal", {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json().catch(()=>null);
      if (!res.ok || !data?.url) {
        // Avoid template literals to dodge PowerShell escaping issues
        throw new Error((data && data.error) || ("HTTP " + res.status));
      }
      window.location.href = data.url;
    } catch (err: any) {
      setError(String(err?.message || err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card space-y-4">
      <h1 className="text-2xl font-semibold">Manage billing</h1>
      <p className="text-sm" style={{opacity:.8}}>
        Enter the email you used at checkout to open the billing portal.
      </p>
      <form onSubmit={openPortal} className="flex gap-2" autoComplete="off">
        <input
          className="input flex-1"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={e=>setEmail(e.target.value)}
        />
        <button className="btn" disabled={loading || !email.trim()}>
          {loading ? "Opening…" : "Open billing portal"}
        </button>
      </form>
      {error && <div className="text-red-500 text-sm">Error: {error}</div>}
      <div className="text-xs" style={{opacity:.6}}>
        Powered by Stripe Billing Portal.
      </div>
    </div>
  );
}