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

/** Canonical absolute base for links inside EMAILS. */
function canonicalBase(req: Request) {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  if (env) return env;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return new URL(req.url).origin; // dev fallback
}

/** Build an ABSOLUTE, same-origin URL for redirects. */
function sameOrigin(req: Request, pathAndQuery: string) {
  return new URL(pathAndQuery, req.url);
}

export async function POST(req: Request) {
  const email = await getEmailFromRequest(req);

  if (!isValidEmail(email)) {
    return NextResponse.redirect(sameOrigin(req, '/updates?error=Invalid%20email.'), {
      status: 303,
    });
  }

  // Build absolute confirmation link for the EMAIL content
  const confirmUrl = new URL('/updates?confirmed=1', canonicalBase(req)).toString();

  try {
    const key = process.env.RESEND_API_KEY;
    if (!key || !process.env.RESEND_FROM_EMAIL) {
      return NextResponse.redirect(sameOrigin(req, '/updates?error=Email%20send%20failed.'), {
        status: 303,
      });
    }

    const resend = new Resend(key);
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: email,
      subject: 'Confirm your subscription',
      html: `<p>Click to confirm: <a href="${confirmUrl}">${confirmUrl}</a></p>`,
    });
    if (error) throw error;
  } catch {
    return NextResponse.redirect(sameOrigin(req, '/updates?error=Email%20send%20failed.'), {
      status: 303,
    });
  }

  return NextResponse.redirect(sameOrigin(req, '/updates?subscribed=1'), { status: 303 });
}
