// app/api/subscribe/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { Resend } from 'resend';

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function getEmailFromRequest(req: Request) {
  const ct = (req.headers.get('content-type') || '').toLowerCase();
  try {
    if (ct.includes('application/json')) {
      const body = await req.json().catch(() => ({} as any));
      return (body?.email ?? '').toString().trim().toLowerCase();
    }
    const fd = await req.formData(); // x-www-form-urlencoded or multipart
    return (fd.get('email') ?? '').toString().trim().toLowerCase();
  } catch {
    return '';
  }
}

/** Always redirect back to the SAME origin that made the request. */
function sameOrigin(req: Request, pathAndQuery: string) {
  return new URL(pathAndQuery, req.url);
}

/** Canonical absolute base for links inside EMAILS. */
function canonicalBase(req: Request) {
  const envBase = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  if (envBase) return envBase;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return new URL(req.url).origin;
}

export async function POST(req: Request) {
  const email = await getEmailFromRequest(req);

  if (!isValidEmail(email)) {
    const back = sameOrigin(req, '/updates?error=Invalid%20email.');
    return NextResponse.redirect(back, { status: 303 });
  }

  // Build absolute confirmation link for the EMAIL content
  const confirmUrl = new URL('/updates?confirmed=1', canonicalBase(req)).toString();

  try {
    const resend = new Resend(process.env.RESEND_API_KEY!);
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!, // e.g., "Julian <hello@emxprotocol.com>"
      to: email,
      subject: 'Confirm your subscription',
      html: `<p>Click to confirm: <a href="${confirmUrl}">${confirmUrl}</a></p>`,
    });
    if (error) throw error;
  } catch {
    const fail = sameOrigin(req, '/updates?error=Email%20send%20failed.');
    return NextResponse.redirect(fail, { status: 303 });
  }

  const ok = sameOrigin(req, '/updates?subscribed=1');
  return NextResponse.redirect(ok, { status: 303 });
}
