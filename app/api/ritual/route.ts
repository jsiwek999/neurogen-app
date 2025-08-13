// app/api/ritual/route.ts
import type { NextRequest } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const goal = (typeof body?.goal === 'string' ? body.goal : '').trim();
    if (!goal) return json({ error: 'Missing goal' }, 400);

    const prompt =
      `You are composing a micro-ritual using EMX tags.\n` +
      `First line must be exactly: Goal: ${goal}\n` +
      `Then give 4–6 short lines using [breathe], [shift], [install], [ritual]. Keep it tight.`;

    // ----- Try Responses API first -----
    const respRes = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        input: prompt,
        max_output_tokens: 400, // safe; no temperature/top_p for reasoning models
      }),
    });

    const respRaw = await respRes.text();
    if (!respRes.ok) {
      let msg = respRaw;
      try { msg = JSON.parse(respRaw)?.error?.message || msg; } catch {}
      // Bubble upstream status to client
      return json({ error: msg || `Upstream ${respRes.status}` }, respRes.status);
    }

    let respJson: any = null;
    try { respJson = JSON.parse(respRaw); } catch {
      console.error('OpenAI (Responses) malformed JSON:', respRaw.slice(0, 2000));
      return json({ error: 'Malformed upstream JSON' }, 502);
    }

    // Debug: see what we actually got back
    try {
      console.log('OpenAI Responses keys:', Object.keys(respJson));
      console.log(
        'OpenAI Responses output sample:',
        JSON.stringify(respJson.output ?? respJson, null, 2).slice(0, 2000)
      );
    } catch {}

    const fromResponses = extractText(respJson);
    if (fromResponses) {
      return json({ ritual: fromResponses, modelUsed: 'responses', echoGoal: goal });
    }

    // ----- Fallback: Chat Completions -----
    const chatRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: 'You write concise, actionable rituals.' },
          { role: 'user', content: prompt },
        ],
        // do NOT send temperature here either unless you switch to a model that supports it
      }),
    });

    const chatRaw = await chatRes.text();
    if (!chatRes.ok) {
      let msg = chatRaw;
      try { msg = JSON.parse(chatRaw)?.error?.message || msg; } catch {}
      return json({ error: msg || `Upstream ${chatRes.status}` }, chatRes.status);
    }

    let chatJson: any = null;
    try { chatJson = JSON.parse(chatRaw); } catch {
      console.error('OpenAI (Chat) malformed JSON:', chatRaw.slice(0, 2000));
      return json({ error: 'Malformed upstream JSON (chat)' }, 502);
    }

    const fromChat =
      chatJson?.choices?.[0]?.message?.content?.toString().trim() ||
      chatJson?.choices?.[0]?.text?.toString().trim() ||
      '';

    if (!fromChat) {
      console.error('No text from model; chat payload:', JSON.stringify(chatJson).slice(0, 2000));
      return json({ error: 'No text from model' }, 502);
    }

    return json({ ritual: fromChat, modelUsed: 'chat', echoGoal: goal });
  } catch (err: any) {
    console.error('ritual fatal:', err?.message || err);
    return json({ error: 'Internal error' }, 500);
  }
}

function extractText(data: any): string {
  // 1) Handy field, when present:
  if (typeof data?.output_text === 'string' && data.output_text.trim()) {
    return data.output_text.trim();
  }
  // 2) Canonical Responses API shape:
  const parts: string[] = [];
  if (Array.isArray(data?.output)) {
    for (const node of data.output) {
      if (node?.type === 'message' && Array.isArray(node.content)) {
        for (const c of node.content) {
          const val =
            c?.text?.value ??
            (typeof c?.text === 'string' ? c.text : undefined) ??
            c?.value;
          if (typeof val === 'string' && val.trim()) parts.push(val.trim());
        }
      }
      if (node?.type === 'output_text' && typeof node?.text === 'string') {
        parts.push(node.text.trim());
      }
      if (typeof node?.content === 'string') {
        parts.push(node.content.trim());
      }
    }
  }
  // 3) Old-school fallback:
  if (!parts.length && Array.isArray(data?.choices)) {
    const maybe = data.choices[0]?.message?.content ?? data.choices[0]?.text;
    if (typeof maybe === 'string' && maybe.trim()) parts.push(maybe.trim());
  }
  return parts.join('\n').trim();
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
