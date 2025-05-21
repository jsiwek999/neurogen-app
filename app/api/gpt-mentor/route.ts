import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai'; // Make sure your package.json has "openai"

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: "You are the NEUROGEN Mentor. Respond like a wise, encouraging teacher. Keep it brief but impactful." },
        ...messages.map((m: any) => ({
          role: m.role === 'mentor' ? 'assistant' : 'user',
          content: m.text
        }))
      ],
      max_tokens: 200,
    });

    const mentorText = response.choices?.[0]?.message?.content ?? '...';
    return NextResponse.json({ text: mentorText });

  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json(
      { text: "Error: Unable to reach the mirror. Try again" },
      { status: 500 }
    );
  }
}
