// app/api/emx/stream/route.ts
import OpenAI from 'openai'
import { NextResponse } from 'next/server'
import { parseAuthoringToHints, buildDirectiveFooter } from '../../../lib/emx/parse'
import { SYSTEM_PROMPT, buildUserPrompt } from '../../../lib/emx/prompt'
import { extractBlock, tryParseMachine } from '../../../lib/emx/post'


export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'


export async function POST(req: Request) {
const { authoring } = await req.json()
if (typeof authoring !== 'string' || !authoring.trim()) {
return NextResponse.json({ error: 'authoring required' }, { status: 400 })
}


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })
const hints = parseAuthoringToHints(authoring)
const footer = buildDirectiveFooter(hints)
const user = buildUserPrompt(authoring, footer)


const completion = await openai.chat.completions.create({
model: process.env.EMX_MODEL || 'gpt-4o-mini',
temperature: 0.5,
stream: true,
messages: [
{ role: 'system', content: SYSTEM_PROMPT },
{ role: 'user', content: user },
],
})


const encoder = new TextEncoder()
let buffer = ''


const stream = new ReadableStream<Uint8Array>({
async start(controller) {
// optional open event
controller.enqueue(encoder.encode('event: open\ndata: {}\n\n'))
try {
for await (const part of completion) {
const token = (part as any)?.choices?.[0]?.delta?.content || ''
if (token) {
buffer += token
const payload = JSON.stringify({ type: 'token', data: token })
controller.enqueue(encoder.encode(`data: ${payload}\n\n`))
}
}
// Parse MACHINE from final buffer
let machine: any = { version: '1.1', events: [] }
const block = extractBlock(buffer)
if (block) {
const parsed = tryParseMachine(block)
if (parsed) machine = parsed
}
controller.enqueue(encoder.encode(`event: machine\ndata: ${JSON.stringify(machine)}\n\n`))
controller.enqueue(encoder.encode('event: done\ndata: {}\n\n'))
} catch (err: any) {
controller.enqueue(encoder.encode(`event: error\ndata: ${JSON.stringify({ message: err?.message || 'stream error' })}\n\n`))
} finally {
controller.close()
}
},
})


return new Response(stream, {
headers: {
'Content-Type': 'text/event-stream; charset=utf-8',
'Cache-Control': 'no-cache, no-transform',
Connection: 'keep-alive',
'X-Accel-Buffering': 'no',
},
})
}