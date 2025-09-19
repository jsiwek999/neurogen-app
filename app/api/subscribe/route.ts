// app/api/subscribe/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';

const EmailSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
});

export async function POST(req: Request) {
  // 1) Parse body (form OR json)
  const ct = req.headers.get('content-type') || '';
  let raw: any = {};
  try {
    if (ct.includes('application/json')) {
      raw = await req.json();
    } else {
      const fd = await req.formData(); // handles x-www-form-urlencoded & multipart
      raw.email = (fd.get('email') ?? '') as string;
    }
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 });
  }

  // 2) Validate email
  const parsed = EmailSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Invalid email.' }, { status: 400 });
  }
  const email = parsed.data.email;

  // 3) Build confirm URL
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const confirmUrl = new URL('/updates', base);
  confirmUrl.searchParams.set('confirmed', '1');

  // 4) Send mail
  const resend = new Resend(process.env.RESEND_API_KEY!);
  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,              // e.g., "Julian <hello@emxprotocol.online>"
    to: email,
    subject: 'Confirm your subscription',
    html: `<p>Click to confirm: <a href="${confirmUrl}">${confirmUrl}</a></p>`,
  });
  if (error) {
    return NextResponse.json({ ok: false, error: 'Failed to send email.' }, { status: 500 });
  }

  // 5) Redirect the browser back to UI with status
  // Use 303 so form POST doesn’t re-POST on refresh
  const subscribedUrl = new URL('/updates?subscribed=1', base);
  return NextResponse.redirect(subscribedUrl, { status: 303 });
}
