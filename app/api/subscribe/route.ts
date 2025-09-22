import { NextRequest, NextResponse } from 'next/server';

type Payload = { email?: string };

function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export async function POST(req: NextRequest) {
  try {
    const { email } = (await req.json().catch(() => ({}))) as Payload;

    if (!email || !isEmail(email)) {
      return NextResponse.json({ error: 'Invalid email.' }, { status: 400 });
    }

    // --- Optional DB write (recommended, non-fatal if it fails) ---
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.SUPABASE_URL as string,
        process.env.SUPABASE_ANON_KEY as string
      );

      // Upsert to avoid duplicates; adjust table/columns if yours differ
      const { error: dbErr } = await supabase
        .from('subscribers')
        .upsert({ email, confirmed: false }, { onConflict: 'email' });

      if (dbErr) console.error('Supabase upsert error:', dbErr);
    } catch (e) {
      // Don’t block email send if Supabase isn’t ready
      console.error('Supabase block skipped/failed:', e);
    }

    // --- Send confirmation email via Resend ---
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const FROM = process.env.RESEND_FROM_EMAIL || 'notifications@emxprotocol.com';
    const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://emxprotocol.com';

    if (!RESEND_API_KEY) {
      return NextResponse.json({ error: 'Missing RESEND_API_KEY' }, { status: 500 });
    }

const confirmUrl = `${SITE}/updates?confirmed=1&email=${encodeURIComponent(email)}`;

const html = `
  <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial;">
    <h2>Confirm your subscription</h2>
    <p>Tap the link below to confirm and start getting updates from EMX Protocol.</p>
    <p><a href="${confirmUrl}">Confirm my email</a></p>
    <p>Or open Updates: <a href="${SITE}/updates?email=${encodeURIComponent(email)}">Updates</a></p>
  </div>`;


    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `EMX Protocol <${FROM}>`,
        to: [email],
        subject: 'Confirm your subscription',
        html,
      }),
    });

    if (!r.ok) {
      const err = await r.json().catch(() => ({}));
      console.error('Resend error:', err);
      return NextResponse.json({ error: 'Email send failed.' }, { status: 502 });
    }

    return NextResponse.json({ status: 'ok' }, { status: 200 });
  } catch (e) {
    console.error('Subscribe handler error:', e);
    return NextResponse.json({ error: 'Unexpected error.' }, { status: 500 });
  }
}
