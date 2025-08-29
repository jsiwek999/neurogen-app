// app/api/portal/route.ts
import Stripe from "stripe";
export const runtime = "nodejs";

const isProd = process.env.VERCEL_ENV === "production";
const pick = <T,>(test?: T, live?: T) => (isProd ? live : test);

export async function POST(req: Request) {
  // read input
  const { customerId, returnUrl } = await req.json().catch(() => ({}));
  if (!customerId) {
    return new Response(JSON.stringify({ error: "Missing customerId" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // pick the right key at *request time*
  const secret = pick(process.env.STRIPE_SECRET_KEY_TEST, process.env.STRIPE_SECRET_KEY_LIVE);
  if (!secret) {
    return new Response(JSON.stringify({ error: "Missing Stripe secret (STRIPE_SECRET_KEY_TEST or STRIPE_SECRET_KEY_LIVE)" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const stripe = new Stripe(secret);
  const base = returnUrl ?? new URL(req.url).origin + "/pricing";

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: base,
    });
    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message ?? "Stripe error" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Optional: avoid 404 when opened in browser
export function GET() {
  return new Response("POST { customerId, returnUrl? } â†’ returns { url }", { status: 200 });
}

