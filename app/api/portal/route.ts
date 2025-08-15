// app/api/portal/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs"; // ensure Node runtime for Stripe

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
if (!STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY");
}

// Create the Stripe client (no apiVersion pinned; use account default)
const stripe = new Stripe(STRIPE_SECRET_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email, return_url } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "email is required" }, { status: 400 });
    }

    // Look up the most recent customer with this email
    const list = await stripe.customers.list({ email, limit: 1 });
    const customer = list.data[0];

    // Avoid leaking whether an email exists
    if (!customer) {
      return NextResponse.json({ ok: true });
    }

    const portal = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: return_url || new URL("/", req.url).toString(),
    });

    return NextResponse.json({ url: portal.url });
  } catch (err) {
    console.error("Portal route error:", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
