import OpenAI from 'openai'
import { SYSTEM_PROMPT, buildUserPrompt } from './prompt'
import { parseAuthoringToHints, buildDirectiveFooter } from './parse'
import { extractBlock, stripHuman, tryParseMachine } from './post'
import { REPAIR_SYSTEM, buildRepairUser } from './repairPrompt'


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })


export async function emxCall(authoring: string) {
const hints = parseAuthoringToHints(authoring)
const footer = buildDirectiveFooter(hints)
const user = buildUserPrompt(authoring, footer)


const res = await openai.chat.completions.create({
model: process.env.EMX_MODEL || 'gpt-4o-mini',
temperature: 0.5,
messages: [
{ role: 'system', content: SYSTEM_PROMPT },
{ role: 'user', content: user },
],
})
const raw = res.choices?.[0]?.message?.content || ''
let machine = null
const block = extractBlock(raw)
if (block) machine = tryParseMachine(block)


if (!machine) {
// Repair: ask model for MACHINE only
const fix = await openai.chat.completions.create({
model: process.env.EMX_MODEL || 'gpt-4o-mini',
temperature: 0,
messages: [
{ role: 'system', content: REPAIR_SYSTEM },
{ role: 'user', content: buildRepairUser(raw) },
],
})
const fixRaw = fix.choices?.[0]?.message?.content || ''
const fixBlock = extractBlock(fixRaw)
if (fixBlock) machine = tryParseMachine(fixBlock)
}


return {
human: stripHuman(raw),
machine: machine ?? { version: '1.1', events: [] },
}
}