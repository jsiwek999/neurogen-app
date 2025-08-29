"use client";

export default function SubscribeButton({ label }: { label: string }) {
  async function handleClick() {
    try {
      const res = await fetch("/api/checkout_sessions", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.url) throw new Error(data?.error ?? "Could not create checkout session.");
      window.location.href = data.url; // Stripe Checkout
    } catch (err: any) {
      alert(err?.message ?? "Something went wrong creating the session.");
    }
  }

  return (
    <button
      onClick={handleClick}
      style={{ padding: "12px 16px", borderRadius: 12, border: "1px solid #ccc", cursor: "pointer" }}
      className="btn-emx"
    >
      {label ?? "Subscribe"}
    </button>
  );
}
