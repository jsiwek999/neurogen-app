import { NextResponse } from "next/server";
import { emxCall } from "../../../lib/emx/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await emxCall(body);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[/api/emx] error:", err);
    return NextResponse.json({ ok: false, error: "EMX call failed" }, { status: 500 });
  }
}
