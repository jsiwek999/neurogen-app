// components/ManageBillingButton.tsx
"use client";

export default function ManageBillingButton({ sessionId }: { sessionId?: string }) {
  async function go() {
    const res = await fetch("/api/portal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.url) {
      alert(data.error ?? "Could not open billing portal.");
      return;
    }
    window.location.href = data.url;
  }
  return (
    <button onClick={go} className="btn-emx" style={{ padding: 12, borderRadius: 12 }}>
      Manage Billing
    </button>
  );
}
