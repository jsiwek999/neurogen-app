// app/api/memory/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { generateOpenAIResponse } from '../../../lib/openai'; // adjust path if needed

export async function POST(req: NextRequest) {
  // 1) Parse the incoming JSON
  const body = await req.json();
  const { content, archetype } = body;

  // 2) Build your prompt based on selected archetype
  let prompt = '';
  switch (archetype) {
    case 'caregiver':
      prompt = `You are a kind, nurturing presence. Respond with gentle empathy and support:\n"${content}"`;
      break;
    case 'godform':
      prompt = `You are a divine intelligence. Speak in mythic tone, archetypal symbolism, and poetic vision:\n"${content}"`;
      break;
    case 'mirror':
    default:
      prompt = `You are a reflective mirror. Offer calm, wise, and spacious insight to this reflection:\n"${content}"`;
      break;
  }

  // 3) Call OpenAI inside a try/catch **and return immediately** on success
  try {
    const aiResponse = await generateOpenAIResponse(prompt);
    console.log('[RETURNING TO CLIENT]', aiResponse);

    return NextResponse.json({
      content,
      response: aiResponse.trim(),
    });
  } catch (error: any) {
    console.error('[API ERROR]', error.message || error);

    // Return a clearly marked error so you can see it client-side
    return NextResponse.json(
      {
        content,
        response: `⚠️ OpenAI error: ${error.message || 'Unknown error'}`,
      },
      { status: 500 }
    );
  }
}
