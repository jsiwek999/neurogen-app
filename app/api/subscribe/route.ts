import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM || "EMX <onboarding@resend.dev>"; // use emxprotocol.online in prod

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export async function POST(req: Request) {
  try {
    const { email } = await req.json().catch(() => ({}));
    if (!email || !isEmail(email)) {
      return NextResponse.json({ ok: false, error: "Invalid email." }, { status: 400 });
    }

    const subject = "Confirm your EMX updates";
    const html = `
      <div style="font-family:Inter,system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.6">
        <h2>You're almost in ✅</h2>
        <p>Tap confirm to start getting EMX updates.</p>
        <p>
          <a href="https://emxprotocol.online/updates?confirmed=1"
             style="display:inline-block;padding:10px 16px;border-radius:10px;background:#111827;color:#fff;text-decoration:none">
            Confirm subscription
          </a>
        </p>
        <p style="color:#6b7280;font-size:12px">If you didn't request this, ignore this email.</p>
      </div>
    `;

    const sendResult = await resend.emails.send({
      from: FROM,               // e.g. "EMX <updates@emxprotocol.online>"
      to: [email],
      subject,
      html,
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
