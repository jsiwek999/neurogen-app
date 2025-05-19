import { NextResponse } from "next/server";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const API_KEY = process.env.OPENAI_API_KEY;

export async function POST(request: Request) {
  const { prompt, systemPrompt, model, maxTokens } = await request.json();

  if (!API_KEY) {
    return NextResponse.json({ error: "Missing API key" }, { status: 500 });
  }

  try {
    const res = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
        max_tokens: maxTokens,
      }),
    });
    const json = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: json }, { status: res.status });
    }
    const text = json.choices?.[0]?.message?.content ?? "";
    return NextResponse.json({ text });
  } catch (err) {
    console.error("[route.ts] Fetch error:", err);
    return NextResponse.json({ error: "OpenAI fetch failed" }, { status: 500 });
  }
}
