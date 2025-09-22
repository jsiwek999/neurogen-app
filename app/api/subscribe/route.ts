// app/api/subscribe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const RESEND_KEY = process.env.RESEND_API_KEY || '';
const FROM = process.env.RESEND_FROM_EMAIL || 'updates@emxprotocol.online';

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function readEmail(req: NextRequest) {
  const ct = req.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    const body = await req.json().catch(() => ({}));
    return String(body?.email ?? '').trim();
  }
  const form = await req.formData().catch(() => null);
  return String(form?.get('email') ?? '').trim();
}

export async function POST(req: NextRequest) {
  const email = await readEmail(req);
  const origin = new URL(req.url);

  const bounce = (code: string, extras?: Record<string, string>) => {
    const url = new URL('/subscribe', origin);
    url.searchParams.set('error', code);
    if (email) url.searchParams.set('email', email);
    if (extras) for (const [k, v] of Object.entries(extras)) url.searchParams.set(k, v);
    return NextResponse.redirect(url, { status: 302 });
  };

  if (!isValidEmail(email)) return bounce('invalid-email');

  if (!RESEND_KEY) {
    console.error('[subscribe] Missing RESEND_API_KEY (prod env?)');
    return bounce('server-misconfig', { hint: 'no-key' });
  }
  if (!/@.+\./.test(FROM)) {
    console.error('[subscribe] Bad FROM address:', FROM);
    return bounce('server-misconfig', { hint: 'bad-from' });
  }

  const resend = new Resend(RESEND_KEY);

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: email,
      subject: 'You’re in — EMX Updates',
      text: `Thanks for subscribing. You’ll hear from us soon.`,
      html: `<p>Thanks for subscribing to EMX updates — you’ll hear from us soon.</p>
<p style="margin-top:16px;font-size:12px;">Don’t want these?
<a href="https://emxprotocol.online/api/unsubscribe?email=${encodeURIComponent(email)}">Unsubscribe</a></p>`,
      replyTo: 'support@emxprotocol.online',
      headers: {
        'List-Unsubscribe': `<mailto:unsubscribe@emxprotocol.online>, <https://emxprotocol.online/api/unsubscribe?email=${encodeURIComponent(email)}>`,
      },
    });

    if (error) {
      console.error('[subscribe] Resend error:', JSON.stringify(error));
      return bounce('send-failed', { code: 'resend-error' });
    }

    console.log('[subscribe] Resend ok:', data);
    const ok = new URL('/updates', origin);
    ok.searchParams.set('confirmed', '1');
    ok.searchParams.set('email', email);
    return NextResponse.redirect(ok, { status: 302 });
  } catch (e: any) {
    console.error('[subscribe] Send threw:', e?.message || e);
    return bounce('send-failed', { code: 'exception' });
  }
}
