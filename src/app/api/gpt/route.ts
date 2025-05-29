// src/app/api/gpt/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  // Handy for quick browser checks:
  return NextResponse.json({
    message: '👋 Hello! Send a POST with { "prompt": "your text" } to get an echo back.',
  });
}

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    // TODO: replace this with your real GPT call or business logic
    const reply = `Echoing back your prompt: "${prompt}"`;

    return NextResponse.json({ reply });
  } catch (err) {
    console.error('Error parsing JSON or handling POST:', err);

    return NextResponse.json(
      { error: 'Invalid request body. Make sure you\'re sending valid JSON.' },
      { status: 400 }
    );
  }
}
