import type { NextRequest } from "next/server";
import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY!;
const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });

export async function POST(req: NextRequest) {
  try {
    if (!STRIPE_SECRET_KEY) {
      return json({ error: "Server missing STRIPE_SECRET_KEY" }, 500);
    }

    const { email } = await req.json().catch(() => ({} as any));
    const e = typeof email === "string" ? email.trim() : "";
    if (!e || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
      return json({ error: "Please enter a valid email." }, 400);
    }

    // Find the most recently created customer with this email
    const list = await stripe.customers.list({ email: e, limit: 10 });
    if (!list.data.length) {
      // Generic message (avoid leaking whether an email exists)
      return json({
        error: "We couldn’t find an active subscription for that email. Check your receipt email or try another address."
      }, 404);
    }
    const customer = [...list.data].sort((a,b) => (b.created||0) - (a.created||0))[0];

    // Build a return URL back to your app
    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const session = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `${origin}/account?from=portal`
    });

    return json({ url: session.url });
  } catch (err: any) {
    const msg = err?.message || "Internal error";
    return json({ error: msg }, 500);
  }
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "Cache-Control": "no-store" }
  });
}