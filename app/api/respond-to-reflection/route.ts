import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';

export async function POST(req: NextRequest) {
  try {
    const { reflectionId } = await req.json();

    if (!reflectionId) {
      return NextResponse.json({ error: 'Missing reflection ID' }, { status: 400 });
    }

    const { data: reflection, error: fetchError } = await supabase
      .from('reflections')
      .select('content')
      .eq('id', reflectionId)
      .single();

    if (fetchError || !reflection) {
      console.error('❌ Reflection fetch error:', fetchError);
      return NextResponse.json({ error: 'Could not fetch reflection content' }, { status: 500 });
    }

    const prompt = `A user submitted the following reflection:\n"${reflection.content}"\n\nGenerate a thoughtful, supportive response that helps them reflect more deeply.`;

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    });

    const aiData = await openaiRes.json();
    const responseText = aiData.choices?.[0]?.message?.content?.trim();

    if (!responseText) {
      return NextResponse.json({ error: 'No response from OpenAI' }, { status: 500 });
    }

    const { error: insertError } = await supabase
      .from('responses')
      .insert([{ reflection_id: reflectionId, content: responseText }]);

    if (insertError) {
      console.error('❌ Supabase insert error:', insertError);
      return NextResponse.json({ error: 'Failed to save AI response' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('🔥 Unexpected API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
