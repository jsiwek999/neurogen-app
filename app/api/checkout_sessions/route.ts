import Stripe from "stripe";
export const runtime = "nodejs";

const inProd = process.env.VERCEL_ENV === "production";
const choose = <T,>(test?: T, live?: T) => (inProd ? (live ?? test) : (test ?? live));

export async function POST(req: Request) {
  try {
    let body: any = {};
    try { body = await req.json(); } catch { /* ignore */ }

    // Pick LIVE on prod, TEST elsewhere; allow explicit override via body.mode ("live" | "test")
    const secret =
      body.mode === "live" ? process.env.STRIPE_SECRET_KEY_LIVE
    : body.mode === "test" ? process.env.STRIPE_SECRET_KEY_TEST
    : choose(process.env.STRIPE_SECRET_KEY_TEST, process.env.STRIPE_SECRET_KEY_LIVE);

    const priceId =
      body.priceId ??
      (body.mode === "live" ? process.env.STRIPE_PRICE_499_LIVE
      : body.mode === "test" ? process.env.STRIPE_PRICE_499_TEST
      : choose(process.env.STRIPE_PRICE_499_TEST, process.env.STRIPE_PRICE_499_LIVE));

    if (!secret) {
      const expect = inProd ? "STRIPE_SECRET_KEY_LIVE" : "STRIPE_SECRET_KEY_TEST";
      return Response.json({ error: `Missing ${expect} (and no fallback present).` }, { status: 500 });
    }
    if (!priceId) {
      const expect = inProd ? "STRIPE_PRICE_499_LIVE" : "STRIPE_PRICE_499_TEST";
      return Response.json({ error: `Missing ${expect} (and no fallback present).` }, { status: 500 });
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (inProd && process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

    const stripe = new Stripe(secret);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],

      // ✅ Automatic Tax (make sure Stripe Tax is enabled in Dashboard)
      automatic_tax: { enabled: true },

      // ✅ Collect enough info to calculate tax & for receipts
      billing_address_collection: "auto",

      // ✅ Let customers enter promo codes (you create these in Stripe → Coupons/Promotion Codes)
      allow_promotion_codes: true,

      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing`,
    });

    return Response.json({ url: session.url }, { status: 200 });
  } catch (err: any) {
    const msg = err?.raw?.message || err?.message || "Stripe error";
    console.error("checkout_sessions error:", msg);
    return Response.json({ error: msg }, { status: 400 });
  }
}

export function GET() {
  return new Response("Use POST", { status: 405, headers: { "Allow": "POST" } });
}
