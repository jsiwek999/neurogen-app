'use client'
import { useState } from 'react'
import BreathCircle from '../../components/BreathCircle'

type EmxEvent =
  | { type: 'breath'; inhale: number; hold: number; exhale: number; cycles?: number }
  | { type: 'state'; name: string }
  | { type: 'mirror'; prompt: string }
  | { type: 'journal'; prompt: string; min_lines?: number }

const PRESETS: { label: string; authoring: string }[] = [
  {
    label: 'Calm Reset',
    authoring: `[identity Torchbearer]
[breath 4-4-6]
[shift calm]
[mirror] What is the quietest sensation in your body?
[journal] Name it in 3 short lines.`,
  },
  {
    label: 'Sovereign Anchor',
    authoring: `[identity Sovereign]
[breath 5-0-5]
[shift centered]
[install belief="My presence is my power."]`,
  },
  {
    label: 'Loop Interrupt',
    authoring: `[loop rumination]
[disrupt] Stand up. Shake for 10s.
[breath 4-4-4]
[mirror] What just changed, even 1%?`,
  },
]

export default function EmxStreamRunner() {
  const [authoring, setAuthoring] = useState(PRESETS[0].authoring)
  const [human, setHuman] = useState('')
  const [machine, setMachine] = useState<{ version: '1.1'; events: EmxEvent[] } | null>(null)
  const [loading, setLoading] = useState(false)

  async function run() {
    setHuman('')
    setMachine(null)
    setLoading(true)

    const res = await fetch('/api/emx/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authoring }),
    })
    if (!res.body) { setLoading(false); return }

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let leftover = ''

    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value)
      leftover += chunk

      const frames = leftover.split('\n\n')
      leftover = frames.pop() || ''

      for (const frame of frames) {
        const lines = frame.split('\n')
        let event = 'message'
        let data = ''
        for (const line of lines) {
          if (line.startsWith('event:')) event = line.slice(6).trim()
          else if (line.startsWith('data:')) data += line.slice(5).trim()
        }

        if (event === 'machine') {
          try {
            const m = JSON.parse(data)
            setMachine(m)
            // fire-and-forget save of the session
            fetch('/api/emx/save', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ authoring, human, machine: m }),
            }).catch(() => {})
          } catch {/* ignore */}
        } else if (event === 'error') {
          console.error('EMX stream error', data)
        } else if (event === 'done') {
          // no-op
        } else {
          // token payload
          try {
            const payload = JSON.parse(data)
            if (payload?.type === 'token') setHuman((h) => h + payload.data)
          } catch {
            setHuman((h) => h + data)
          }
        }
      }
    }

    setLoading(false)
  }

  return (
    <div className="grid gap-4">
      {/* Presets */}
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => setAuthoring(p.authoring)}
            className="px-3 py-1.5 text-sm rounded-full border border-white/20 text-white/90 hover:bg-white/10"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Authoring */}
      <textarea
        className="border rounded p-3 min-h-32 w-full bg-white/5 text-white border-white/20 placeholder-white/50"
        value={authoring}
        onChange={(e) => setAuthoring(e.target.value)}
        placeholder="[breath 4-4-6]\n[shift calm]\n[mirror] What is here now?"
      />

      {/* Action */}
      <button
        onClick={run}
        className="px-4 py-2 rounded bg-white/10 hover:bg-white/20 text-white border border-white/20 w-fit"
        disabled={loading}
      >
        {loading ? 'Running…' : 'Run Ritual'}
      </button>

      {/* HUMAN stream */}
      <article className="prose max-w-none whitespace-pre-wrap leading-relaxed p-3 rounded bg-white/5 text-white">
        {human || 'HUMAN guidance will appear here as it streams…'}
      </article>

      {/* MACHINE events */}
      <div className="grid gap-3">
        {machine?.events?.map((e, i) =>
          e.type === 'breath' ? (
            <BreathCircle
              key={i}
              inhale={e.inhale}
              hold={e.hold}
              exhale={e.exhale}
              cycles={e.cycles ?? 3}
            />
          ) : e.type === 'mirror' ? (
            <div key={i} className="p-4 rounded border bg-white/5 border-white/20 text-white">{e.prompt}</div>
          ) : e.type === 'journal' ? (
            <div key={i} className="p-4 rounded border bg-white/5 border-white/20 text-white">{e.prompt}</div>
          ) : e.type === 'state' ? (
            <div key={i} className="text-xs uppercase tracking-wide opacity-80 text-white/80">State: {e.name}</div>
          ) : null
        )}
      </div>
    </div>
  )
}
