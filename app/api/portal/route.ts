// app/api/portal/route.ts
import Stripe from "stripe";
export const runtime = "nodejs";

const inProd = process.env.VERCEL_ENV === "production";
const choose = <T,>(test?: T, live?: T) => (inProd ? (live ?? test) : (test ?? live));

export async function POST(req: Request) {
  try {
    const { session_id } = await req.json().catch(() => ({} as any));

    // Pick LIVE in production, TEST elsewhere (falls back if only one is set)
    const secret = choose(process.env.STRIPE_SECRET_KEY_TEST, process.env.STRIPE_SECRET_KEY_LIVE);
    if (!secret) return Response.json({ error: "Missing STRIPE secret (TEST/LIVE)" }, { status: 500 });

    const stripe = new Stripe(secret);

    // We need a Stripe customer id. Easiest path today:
    // If you pass a Checkout session_id, we can retrieve its customer.
    let customerId: string | null = null;

    if (session_id) {
      const cs = await stripe.checkout.sessions.retrieve(session_id);
      // customer can be string or object; normalize
      customerId = (typeof cs.customer === "string" ? cs.customer : cs.customer?.id) || null;
    }

    if (!customerId) {
      // If you later have real auth + DB, look up customerId for the logged-in user here.
      return Response.json({ error: "No Stripe customer found. Provide session_id in POST body." }, { status: 400 });
    }

    const returnUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (inProd && process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${returnUrl}/pricing`,
    });

    return Response.json({ url: portal.url }, { status: 200 });
  } catch (err: any) {
    const msg = err?.raw?.message || err?.message || "Stripe portal error";
    console.error("portal error:", msg);
    return Response.json({ error: msg }, { status: 400 });
  }
}

export function GET() {
  return new Response("Use POST", { status: 405, headers: { Allow: "POST" } });
}
