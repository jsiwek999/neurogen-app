// app/api/gpt/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI();

export async function GET() {
  return NextResponse.json({
    message: '👋 Hello! POST {"prompt": "..."} or {"message": "..."} to receive a ChatGPT reply.',
  });
}

export async function POST(request: NextRequest) {
  console.log("🔥 POST /api/gpt hit");

  try {
    const body = await request.json();
    const prompt = body.prompt ?? body.message;
    console.log("📥 Prompt received:", prompt);

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: "Missing or invalid 'prompt' or 'message' in request body." },
        { status: 400 }
      );
    }

    console.log("🤖 Sending to OpenAI...");

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // or 'gpt-4' if preferred
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const reply = completion.choices?.[0]?.message?.content ?? '[No reply]';
    console.log("✅ Reply from OpenAI:", reply);

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("🔥 Caught error in /api/gpt:", err);
    return NextResponse.json(
      { error: 'Server error—see logs for details.' },
      { status: 500 }
    );
  }
}
