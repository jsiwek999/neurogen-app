import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { systemPrompt, userInput } = body;

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userInput },
        ],
        temperature: 0.7,
      }),
    });

    const data = await openaiResponse.json();
    const reflection = data?.choices?.[0]?.message?.content?.trim();

    return NextResponse.json({ message: reflection || '' });
  } catch (error) {
    console.error('EMX Lab API Error:', error);
    return NextResponse.json({ message: 'Mirror cracked. Please try again.' }, { status: 500 });
  }
}

export async function GET() {
  return new Response('GET not allowed', { status: 405 });
}
