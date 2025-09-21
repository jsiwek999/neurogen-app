// app/api/subscribe/confirm/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { Resend } from 'resend';
import { supabaseService } from '@/lib/supabase/service';

function absolute(req: Request, pathAndQuery: string) {
  return new URL(pathAndQuery, req.url);
}

async function sendWelcome(email: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) return;
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: email,
    subject: 'Welcome to EMX updates',
    html: `
      <p>You're in. 👋</p>
      <p>What to expect: short updates on EMX progress, experiments, and invites to try new features early.</p>
      <p>Reply any time—yes, a human reads it.</p>
    `,
  });
  if (error) throw error;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token') || '';
  try {
    const secret = process.env.SUBSCRIBE_TOKEN_SECRET;
    if (!secret) throw new Error('missing secret');
    const key = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, key);
    const email = String(payload.email || '');
    if (!email) throw new Error('no email');

    // mark confirmed
    await supabaseService
      .from('newsletter_subscribers')
      .update({ confirmed_at: new Date().toISOString() })
      .eq('email', email);

    // send welcome if not yet sent (best-effort)
    try {
      const { data } = await supabaseService
        .from('newsletter_subscribers')
        .select('welcome_sent_at')
        .eq('email', email)
        .maybeSingle();

      if (!data?.welcome_sent_at) {
        await sendWelcome(email);
        await supabaseService
          .from('newsletter_subscribers')
          .update({ welcome_sent_at: new Date().toISOString() })
          .eq('email', email);
      }
    } catch {}

    return NextResponse.redirect(absolute(req, '/updates?confirmed=1'), { status: 303 });
  } catch {
    return NextResponse.redirect(absolute(req, '/updates?error=Invalid%20or%20expired%20link'), { status: 303 });
  }
}
