// app/api/subscribe/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { SignJWT } from 'jose';
import { supabaseService } from '@/lib/supabase/service';

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function canonicalBase(req: Request) {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  if (env) return env;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return new URL(req.url).origin;
}
function absolute(req: Request, pathAndQuery: string) {
  return new URL(pathAndQuery, req.url);
}

// tiny burst limiter
const buckets = new Map<string, { c: number; exp: number }>();
function allow(ip: string, limit = 5) {
  const now = Date.now(), win = 60_000, slot = Math.floor(now / win);
  const key = `${ip}:${slot}`;
  let b = buckets.get(key);
  if (!b || b.exp <= now) b = { c: 0, exp: (slot + 1) * win }, buckets.set(key, b);
  if (b.c >= limit) return false;
  b.c++;
  if (buckets.size > 1000) for (const [k, v] of buckets) if (v.exp <= now) buckets.delete(k);
  return true;
}

export async function POST(req: Request) {
  const ct = (req.headers.get('content-type') || '').toLowerCase();

  let email = '';
  let honeypot = '';
  let utm: Record<string,string> = {};
  try {
    if (ct.includes('application/json')) {
      const body = await req.json().catch(() => ({} as any));
      email = String(body?.email || '').trim().toLowerCase();
      honeypot = String(body?.website || '').trim();
      utm = {
        utm_source: body?.utm_source || '',
        utm_medium: body?.utm_medium || '',
        utm_campaign: body?.utm_campaign || '',
        utm_term: body?.utm_term || '',
        utm_content: body?.utm_content || '',
        referer_url: body?.referer_url || '',
      };
    } else {
      const fd = await req.formData();
      email = String(fd.get('email') || '').trim().toLowerCase();
      honeypot = String(fd.get('website') || '').trim();
      utm = {
        utm_source: String(fd.get('utm_source') || ''),
        utm_medium: String(fd.get('utm_medium') || ''),
        utm_campaign: String(fd.get('utm_campaign') || ''),
        utm_term: String(fd.get('utm_term') || ''),
        utm_content: String(fd.get('utm_content') || ''),
        referer_url: String(fd.get('referer_url') || ''),
      };
    }
  } catch {}

  // honeypot: pretend success
  if (honeypot.length > 0) {
    return NextResponse.redirect(absolute(req, '/updates?subscribed=1'), { status: 303 });
  }

  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0]?.trim() || '0.0.0.0';
  if (!allow(ip)) {
    return NextResponse.redirect(absolute(req, '/updates?error=Too%20many%20requests'), { status: 303 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.redirect(absolute(req, '/updates?error=Invalid%20email.'), { status: 303 });
  }

  // fetch existing to avoid overwriting first-touch attribution
  let existing: any = null;
  try {
    const { data } = await supabaseService
      .from('newsletter_subscribers')
      .select('utm_source,utm_medium,utm_campaign,utm_term,utm_content,referer_url')
      .eq('email', email)
      .maybeSingle();
    existing = data;
  } catch {}

  const toUpsert: any = {
    email,
    source: '/updates',
    last_ip: ip,
  };

  // only set UTM/ref if missing on existing
  const keys = ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','referer_url'] as const;
  for (const k of keys) {
    const incoming = (utm[k] || '').slice(0, 512);
    if (!existing || !existing[k as keyof typeof existing]) {
      if (incoming) toUpsert[k] = incoming;
    }
  }

  try {
    await supabaseService
      .from('newsletter_subscribers')
      .upsert(toUpsert, { onConflict: 'email' });
  } catch {
    // non-fatal
  }

  const secret = process.env.SUBSCRIBE_TOKEN_SECRET;
  if (!secret) {
    return NextResponse.redirect(absolute(req, '/updates?error=Server%20config%20missing'), { status: 303 });
  }
  const key = new TextEncoder().encode(secret);
  const token = await new SignJWT({ email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30m')
    .sign(key);

  const confirmUrl = new URL(`/api/subscribe/confirm?token=${encodeURIComponent(token)}`, canonicalBase(req)).toString();

  try {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM_EMAIL;
    if (!apiKey || !from) throw new Error('email not configured');

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: email,
      subject: 'Confirm your subscription',
      html: `<p>Click to confirm your subscription:</p><p><a href="${confirmUrl}">${confirmUrl}</a></p><p>If you didn't request this, you can ignore it.</p>`,
    });
    if (error) throw error;
  } catch {
    // still show success
    return NextResponse.redirect(absolute(req, '/updates?subscribed=1'), { status: 303 });
  }

  return NextResponse.redirect(absolute(req, '/updates?subscribed=1'), { status: 303 });
}
