import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const email = String(formData.get("email") || "").trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
    }

    // Send the “Calm in 2 Minutes” toolkit immediately
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "EMX <hello@emxprotocol.com>",
      to: email,
      subject: "Your EMX ‘Calm in 2 Minutes’ Toolkit",
      text: [
        "Here’s your quick reset:",
        "",
        "1) Breath Gate: Inhale 4, exhale 6 (x5 cycles).",
        "2) Body Anchor: Press feet into floor for 10s.",
        "3) Vision Shift: Soften focus, widen peripheral view.",
        "4) Action Cue: One small next step you can do now.",
        "",
        "Save this email. Use it anytime you need a 2-minute reset.",
        "",
        "— EMX Protocol",
        (process.env.NEXT_PUBLIC_SITE_URL || "https://emxprotocol.com") + "/start-here",
      ].join("\n"),
    });

    // Optional: add to your DB/ESP here

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("subscribe error:", err);
    return NextResponse.json({ ok: false, error: "SERVER_ERROR" }, { status: 500 });
  }
}
