// app/api/mirror/route.ts
import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Set this in .env.local
});

export async function POST(req: Request) {
  const { prompt } = await req.json();

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a reflective mirror. Respond with depth, wisdom, and mystery.' },
        { role: 'user', content: prompt },
      ],
    });

    const reply = completion.choices[0]?.message?.content || "The mirror is silent...";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('GPT Error:', error);
    return NextResponse.json({ reply: 'Error contacting the mirror.' }, { status: 500 });
  }
}
