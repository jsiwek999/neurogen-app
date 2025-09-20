// app/api/checkout_sessions/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import Stripe from 'stripe';

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
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      return NextResponse.json(
        { error: 'Server not configured: STRIPE_SECRET_KEY is missing.' },
        { status: 500 }
      );
    }
    // Lazy init inside the handler so build/import doesn’t explode
    const stripe = new Stripe(key); // no apiVersion -> use account default

    const body = await readBody(req);
    const priceId =
      (body.priceId as string) || process.env.STRIPE_DEFAULT_PRICE_ID || '';
    const quantity = Number(body.quantity ?? 1) || 1;
    const mode: 'payment' | 'subscription' =
      (body.mode as any) === 'payment' ? 'payment' : 'subscription';

    if (!priceId.startsWith('price_')) {
      return NextResponse.json(
        { error: 'Missing or invalid priceId.' },
        { status: 400 }
      );
    }

    const base = getBaseFromReq(req);
    const success_url = new URL('/pricing?status=success', base).toString();
    const cancel_url = new URL('/pricing?status=cancel', base).toString();

    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [{ price: priceId, quantity }],
      success_url,
      cancel_url,
      allow_promotion_codes: true,
    });

    // Return JSON so client can redirect to session.url
    return NextResponse.json({ id: session.id, url: session.url }, { status: 200 });

    // If you prefer server-side redirect:
    // return NextResponse.redirect(session.url!, { status: 303 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? 'Failed to create checkout session.' },
      { status: 500 }
    );
  }
}
