// app/api/subscribe/route.ts
import { NextRequest, NextResponse } from 'next/server';

function isValidEmail(email: string) {
  // Keep it simple; your zod/validator is fine too.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  // -------- robust body parsing (handles JSON and form) --------
  const contentType = req.headers.get('content-type') || '';
  let email = '';

  try {
    if (contentType.includes('application/json')) {
      const body = await req.json();
      email = String(body?.email ?? '').trim();
    } else if (
      contentType.includes('application/x-www-form-urlencoded') ||
      contentType.includes('multipart/form-data')
    ) {
      const form = await req.formData();
      email = String(form.get('email') ?? '').trim();
    } else {
      // Fallback: try both
      try {
        const body = await req.json();
        email = String(body?.email ?? '').trim();
      } catch {
        const form = await req.formData();
        email = String(form.get('email') ?? '').trim();
      }
    }
  } catch {
    // ignore; email stays ''
  }

  if (!isValidEmail(email)) {
    // Redirect back with error for server-rendered UX
    const url = new URL('/subscribe?error=invalid-email', req.url);
    if (email) url.searchParams.set('email', email);
    return NextResponse.redirect(url, { status: 302 });
  }

  // ---- Your existing subscription logic goes here ----
  // e.g., await addSubscriber(email) / Resend / Supabase insert, etc.

  // Success: bounce to a friendly page (or same page with flag)
  const ok = new URL('/updates?confirmed=1', req.url);
  ok.searchParams.set('email', email);
  return NextResponse.redirect(ok, { status: 302 });
}
