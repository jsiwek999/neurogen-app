// app/api/portal/route.ts
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
    // Lazy init to avoid build-time crash
    const stripe = new Stripe(key);

    const body = await readBody(req);
    // You might compute this from your auth/session; this is a generic version:
    const customer =
      (body.customer as string) || (body.customerId as string) || '';

    if (!customer.startsWith('cus_')) {
      return NextResponse.json(
        { error: 'Missing or invalid Stripe customer id.' },
        { status: 400 }
      );
    }

    const base = getBaseFromReq(req);
    const return_url = new URL('/pricing?status=portal', base).toString();

    const session = await stripe.billingPortal.sessions.create({
      customer,
      return_url,
    });

    // Return JSON so client can redirect
    return NextResponse.json({ url: session.url }, { status: 200 });

    // Or server-side redirect:
    // return NextResponse.redirect(session.url!, { status: 303 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? 'Failed to create billing portal session.' },
      { status: 500 }
    );
  }
}
