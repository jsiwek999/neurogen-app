'use client'
import { useState } from 'react'
import BreathTimer from '@/components/BreathTimer'


type Event =
| { type: 'breath'; inhale: number; hold: number; exhale: number; cycles?: number }
| { type: 'state'; name: string }
| { type: 'mirror'; prompt: string }
| { type: 'journal'; prompt: string; min_lines?: number }


export default function EmxRunner() {
const [human, setHuman] = useState('')
const [events, setEvents] = useState<Event[]>([])
const [authoring, setAuthoring] = useState('[breath 4-4-6]\n[shift calm]\n[mirror] What is here now?')


async function run() {
const res = await fetch('/api/emx', { method: 'POST', body: JSON.stringify({ authoring }) })
const data = await res.json()
setHuman(data.human)
setEvents(data.machine?.events ?? [])
// Save session
await fetch('/api/emx/save', { method: 'POST', body: JSON.stringify({ authoring, human: data.human, machine: data.machine }) })
}


return (
<div className="grid gap-4">
<textarea className="border rounded p-3" value={authoring} onChange={(e)=>setAuthoring(e.target.value)} />
<button onClick={run} className="px-4 py-2 rounded bg-black text-white w-fit">Run EMX</button>
<article className="prose max-w-none whitespace-pre-wrap">{human}</article>
<div className="grid gap-3">
{events.map((e, i) => e.type === 'breath' ? (
<BreathTimer key={i} inhale={e.inhale} hold={e.hold} exhale={e.exhale} cycles={e.cycles}/>
) : e.type === 'mirror' ? (
<div key={i} className="p-4 rounded border">{e.prompt}</div>
) : e.type === 'journal' ? (
<div key={i} className="p-4 rounded border">{e.prompt}</div>
) : e.type === 'state' ? (
<div key={i} className="text-xs uppercase tracking-wide opacity-70">State: {e.name}</div>
) : null)}
</div>
</div>
)
}