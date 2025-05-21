import { NextRequest, NextResponse } from 'next/server';

// --- Simple in-memory rate limiter ---
const rateLimitWindowMs = 60 * 1000;
const rateLimitMax = 10;
const rateLimitMap = new Map<string, { count: number, lastReset: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return true;
  }
  if (now - entry.lastReset > rateLimitWindowMs) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return true;
  }
  if (entry.count < rateLimitMax) {
    entry.count += 1;
    return true;
  }
  return false;
}

export async function POST(req: NextRequest) {
  // Rate limit logic
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ messages: ["Rate limit exceeded. Please wait and try again."] }, { status: 429 });
  }

  // ...rest of your OpenAI code as before...
  const { systemPrompt, userInput } = await req.json();

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ messages: ["OpenAI API key not set."] }, { status: 500 });
  }

  const payload = {
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userInput },
    ],
    max_tokens: 600,
    temperature: 0.8,
    n: 1,
  };

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    return NextResponse.json({ messages: ["Error contacting OpenAI API."] }, { status: 500 });
  }

  const data = await response.json();
  const messages = data.choices?.map((choice: any) => choice.message?.content) || ["No response received."];

  return NextResponse.json({ messages });
}
