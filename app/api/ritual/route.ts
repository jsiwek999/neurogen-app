import type { NextRequest } from "next/server";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(()=>({}));
    const goal = (typeof body?.goal === "string" ? body.goal : "").trim();
    if(!goal) return json({ error:"Missing goal" },400);

    const prompt = `You are composing a micro-ritual using EMX tags.
First line must be exactly: Goal: ${goal}
Then give 4â€“6 short lines using [breathe], [shift], [install], [ritual]. Keep it tight.`;

    const r = await fetch("https://api.openai.com/v1/responses",{
      method:"POST",
      headers:{ "Authorization":`Bearer ${OPENAI_API_KEY}`, "Content-Type":"application/json" },
      body: JSON.stringify({ model: MODEL, input: prompt, max_output_tokens: 400 })
    });
    const raw = await r.text();
    if(!r.ok){ let msg=raw; try{ msg = JSON.parse(raw)?.error?.message || msg;}catch{}; return json({ error: msg }, r.status); }
    let data:any=null; try{ data=JSON.parse(raw);}catch{ return json({ error:"Malformed upstream JSON" },502); }
    const ritual = extractText(data);
    if(ritual) return json({ ritual });

    const c = await fetch("https://api.openai.com/v1/chat/completions",{
      method:"POST",
      headers:{ "Authorization":`Bearer ${OPENAI_API_KEY}`, "Content-Type":"application/json" },
      body: JSON.stringify({ model: MODEL, messages:[{role:"system",content:"You write concise, actionable rituals."},{role:"user",content:prompt}] })
    });
    const craw = await c.text(); if(!c.ok){ let msg=craw; try{ msg=JSON.parse(craw)?.error?.message || msg;}catch{}; return json({ error: msg }, c.status); }
    let cj:any=null; try{ cj=JSON.parse(craw);}catch{ return json({ error:"Malformed upstream JSON (chat)" },502); }
    const fromChat = cj?.choices?.[0]?.message?.content?.toString().trim() || cj?.choices?.[0]?.text?.toString().trim() || "";
    if(!fromChat) return json({ error:"No text from model" },502);
    return json({ ritual: fromChat });
  } catch { return json({ error:"Internal error" },500); }
}

function extractText(d:any):string{
  if(typeof d?.output_text==="string" && d.output_text.trim()) return d.output_text.trim();
  const parts:string[]=[]; if(Array.isArray(d?.output)){ for(const n of d.output){
    if(n?.type==="message" && Array.isArray(n.content)){ for(const c of n.content){
      const val = c?.text?.value ?? (typeof c?.text==="string"?c.text:undefined) ?? c?.value;
      if(typeof val==="string" && val.trim()) parts.push(val.trim());
    } }
    if(n?.type==="output_text" && typeof n?.text==="string") parts.push(n.text.trim());
    if(typeof n?.content==="string") parts.push(n.content.trim());
  } }
  if(!parts.length && Array.isArray(d?.choices)){ const maybe = d.choices[0]?.message?.content ?? d.choices[0]?.text; if(typeof maybe==="string" && maybe.trim()) parts.push(maybe.trim()); }
  return parts.join("\n").trim();
}

function json(data:unknown, status=200){
  return new Response(JSON.stringify(data),{
    status,
    headers:{ "content-type":"application/json; charset=utf-8", "Cache-Control":"no-store" }
  });
}
