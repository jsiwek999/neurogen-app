// app/api/unsubscribe/route.ts
import { NextRequest, NextResponse } from 'next/server';

function redirectToSubscribe(origin: string, email: string) {
  const url = new URL('/subscribe', origin);
  url.searchParams.set('unsub', '1');
  if (email) url.searchParams.set('email', email);
  return NextResponse.redirect(url, { status: 302 });
}

async function extractEmail(req: NextRequest) {
  const u = new URL(req.url);
  let email = u.searchParams.get('email') ?? '';

  try {
    const ct = req.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      const body = await req.json().catch(() => ({}));
      email = String(body?.email ?? email ?? '').trim();
    } else if (
      ct.includes('application/x-www-form-urlencoded') ||
      ct.includes('multipart/form-data')
    ) {
      const form = await req.formData().catch(() => null);
      email = String(form?.get('email') ?? email ?? '').trim();
    }
  } catch {
    // ignore
  }

  return email;
}

export async function GET(req: NextRequest) {
  const email = await extractEmail(req);
  const origin = new URL(req.url).origin;
  // TODO: persist suppression in your DB or ESP if desired
  return redirectToSubscribe(origin, email);
}

export async function POST(req: NextRequest) {
  const email = await extractEmail(req);
  const origin = new URL(req.url).origin;
  // TODO: persist suppression in your DB or ESP if desired
  return redirectToSubscribe(origin, email);
}

// Ensure it runs dynamically on Vercel edge/node as needed
export const dynamic = 'force-dynamic';
