// app/api/unsubscribe/route.ts
import { NextRequest, NextResponse } from 'next/server';

function redirectToSubscribe(origin: string, email: string) {
  const url = new URL('/subscribe', origin);
  url.searchParams.set('unsub', '1');
  if (email) url.searchParams.set('email', email);
  return NextResponse.redirect(url, { status: 302 });
}

async function extractEmail(req: NextRequest) {
  // Start with query param
  const u = new URL(req.url);
  let email = u.searchParams.get('email') ?? '';

  // Also accept POST bodies per RFC 8058 (providers send POSTs for one-click)
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
    // ignore; fall back to whatever we have
  }

  return email;
}

export async function GET(req: NextRequest) {
  const email = await extractEmail(req);
  const origin = new URL(req.url).origin;

  // TODO: add your suppression persistence here (DB / ESP suppression list)
  // e.g., await supabase.from('suppression').insert({ email, reason: 'manual' });

  return redirectToSubscribe(origin, email);
}

export async function POST(req: NextRequest) {
  const email = await extractEmail(req);
  const origin = new URL(req.url).origin;

  // TODO: add your suppression persistence here

  return redirectToSubscribe(origin, email);
}

// Avoid caching; treat as dynamic
export const dynamic = 'force-dynamic';
