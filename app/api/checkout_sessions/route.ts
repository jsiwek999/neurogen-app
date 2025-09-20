// app/api/checkout_sessions/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!); // no apiVersion -> avoids TS literal mismatch

function getBaseFromReq(req: Request) {
  const { origin } = new URL(req.url);
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : origin)
  );
}

async function readBody(req: Request) {
  const ct = (req.headers.get('content-type') || '').toLowerCase();
  if (ct.includes('application/json')) {
    return (await req.json().catch(() => ({}))) as Record<string, any>;
  }
  const fd = await req.formData();
  const obj: Record<string, any> = {};
  fd.forEach((v, k) => (obj[k] = v));
  return obj;
}

export async function POST(req: Request) {
  try {
    const body = await readBody(req);

    // Expecting a Stripe Price ID (e.g. "price_123")
    const priceId =
      (body.priceId as string) || process.env.STRIPE_DEFAULT_PRICE_ID || '';
    const quantity = Number(body.quantity ?? 1) || 1;

    // Default to subscriptions; allow override to "payment"
    const mode = (body.mode as 'payment' | 'subscription' | undefined) ?? 'subscription';

    if (!priceId.startsWith('price_')) {
      return NextResponse.json(
        { error: 'Missing or invalid priceId.' },
        { status: 400 }
      );
    }

    const base = getBaseFromReq(req);
    const success_url = new URL('/pricing?status=success', base).toString();
    const cancel_url  = new URL('/pricing?status=cancel',  base).toString();

    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [{ price: priceId, quantity }],
      success_url,
      cancel_url,
      allow_promotion_codes: true,
    });

    // Return JSON (client should redirect to session.url)
    return NextResponse.json({ id: session.id, url: session.url }, { status: 200 });

    // If your client expects the API to do the redirect instead, use this:
    // return NextResponse.redirect(session.url!, { status: 303 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? 'Failed to create checkout session.' },
      { status: 500 }
    );
  }
}
