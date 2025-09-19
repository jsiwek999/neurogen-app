// app/api/subscribe/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Verified sender in Resend (e.g., "EMX <notifications@emxprotocol.com>")
const FROM = process.env.RESEND_FROM_EMAIL || "EMX <notifications@emxprotocol.com>";

// Public site URL for links (e.g., https://emxprotocol.com)
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://emxprotocol.com";

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export async function POST(req: Request) {
  try {
    const { email } = await req.json().catch(() => ({}));
    if (!email || !isEmail(email)) {
      return NextResponse.json({ ok: false, error: "Invalid email." }, { status: 400 });
    }

    // If you later add tokens, build them here; for now we just mark confirmed=1
    const confirmUrl = new URL("/updates", BASE_URL);
    confirmUrl.searchParams.set("confirmed", "1");

    const subject = "Confirm your EMX updates";
    const html = `
      <div style="font-family:Inter,system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.6">
        <h2>You're almost in ✅</h2>
        <p>Tap confirm to start getting EMX updates.</p>
        <p>
          <a href="${confirmUrl.toString()}"
             style="display:inline-block;padding:10px 16px;border-radius:10px;background:#111827;color:#fff;text-decoration:none">
            Confirm subscription
          </a>
        </p>
        <p style="color:#6b7280;font-size:12px">If you didn't request this, ignore this email.</p>
      </div>
    `;
    const text = `You're almost in. Confirm here: ${confirmUrl.toString()}`;

    const sendResult = await resend.emails.send({
      from: FROM,
      to: [email],
      subject,
      html,
      text,
    });

    console.log("[subscribe] sendResult id:", (sendResult as any)?.data?.id || (sendResult as any)?.id);

    if ((sendResult as any).error) {
      const err = (sendResult as any).error;
      console.error("[subscribe] Resend error", err);
      return NextResponse.json({ ok: false, error: err.message || "Send failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("[subscribe] Handler error", e);
    return NextResponse.json({ ok: false, error: e?.message || "Server error" }, { status: 500 });
  }
}
