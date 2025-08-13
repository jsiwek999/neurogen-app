import { NextResponse } from 'next/server'
export async function POST() { return NextResponse.json({ ok: true, message: "Shimmer marked complete. Streak +1 (demo)." }) }
