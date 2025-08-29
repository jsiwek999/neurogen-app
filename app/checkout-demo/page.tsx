"use client";
import { useEffect, useState } from "react";

export default function CheckoutDemo() {
  const [t, setT] = useState(3);

  useEffect(() => {
    const id = setInterval(() => setT(s => (s > 0 ? s - 1 : 0)), 1000);
    const to = setTimeout(() => { window.location.href = "/success"; }, 3000);
    return () => { clearInterval(id); clearTimeout(to); };
  }, []);

  return (
    <div className="card space-y-3">
      <h1 className="text-xl font-semibold">Demo checkout</h1>
      <p className="text-sm" style={{opacity:.8}}>
        Pretending to talk to Stripe… Redirecting in {t}s.
      </p>
      <button className="btn" onClick={() => { window.location.href="/success"; }}>
        Skip wait →
      </button>
      <div className="text-xs" style={{opacity:.6}}>
        Demo mode: no charge will occur.
      </div>
    </div>
  );
}