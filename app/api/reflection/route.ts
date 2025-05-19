// File: neurogen-app/app/api/reflection/route.ts
import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabaseClient'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export async function POST(request: Request) {
  try {
    const { content } = await request.json()
    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid payload: "content" is required.' },
        { status: 400 }
      )
    }

    // 1) Insert the user reflection
    const { data: reflections, error: reflErr } = await supabase
      .from('reflections')
      .insert([{ content }])
      .select()
    if (reflErr || !reflections?.[0]) {
      console.error('Error inserting reflection:', reflErr)
      return NextResponse.json({ success: false, error: reflErr?.message }, { status: 500 })
    }
    const reflection = reflections[0]

    // 2) Generate an AI response
    const chat = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a friendly journaling assistant.' },
        { role: 'user', content },
      ],
    })
    const responseText = chat.choices?.[0].message?.content || ''

    // 3) Insert the AI response linked to this reflection
    const { data: responses, error: respErr } = await supabase
      .from('responses')
      .insert([{ reflection_id: reflection.id, content: responseText }])
      .select()
    if (respErr) {
      console.error('Error inserting response:', respErr)
      return NextResponse.json({ success: false, error: respErr.message }, { status: 500 })
    }
    const response = responses[0]

    // 4) Return both records
    return NextResponse.json({
      success: true,
      reflection,
      response,
    })
  } catch (err: any) {
    console.error('Unexpected error in /api/reflection:', err)
    return NextResponse.json(
      { success: false, error: err.message || 'Unknown error' },
      { status: 500 }
    )
  }
}
