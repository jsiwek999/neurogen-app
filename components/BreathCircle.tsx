'use client'
import { useEffect, useMemo, useRef, useState } from 'react'


type Props = { inhale: number; hold: number; exhale: number; cycles?: number }


type Phase = 'inhale' | 'hold' | 'exhale'


export default function BreathCircle({ inhale, hold, exhale, cycles = 3 }: Props) {
const [phase, setPhase] = useState<Phase>('inhale')
const [cycle, setCycle] = useState(1)
const timer = useRef<ReturnType<typeof setTimeout> | null>(null)


const total = inhale + hold + exhale
const next = (p: Phase): Phase => (p === 'inhale' ? 'hold' : p === 'hold' ? 'exhale' : 'inhale')
const duration = (p: Phase) => (p === 'inhale' ? inhale : p === 'hold' ? hold : exhale) * 1000


useEffect(() => {
function step(current: Phase) {
const d = duration(current)
timer.current = setTimeout(() => {
const n = next(current)
if (current === 'exhale') {
if (cycle >= cycles) return
setCycle(c => c + 1)
}
setPhase(n)
step(n)
}, Math.max(0, d))
}
step('inhale')
return () => { if (timer.current) clearTimeout(timer.current) }
}, [inhale, hold, exhale, cycles])


const scale = phase === 'inhale' ? 1.2 : phase === 'exhale' ? 0.8 : 1
const label = phase.toUpperCase()


return (
<div className="flex items-center gap-6 p-6 rounded-2xl bg-white shadow">
<div className="relative h-28 w-28">
<div
className="absolute inset-0 rounded-full shadow-inner transition-transform duration-[1000ms] ease-in-out"
style={{ transform: `scale(${scale})` }}
/>
<div className="absolute inset-2 rounded-full border border-gray-200" />
</div>
<div className="grid">
<div className="text-xs uppercase tracking-wide text-gray-500">Cycle {cycle}/{cycles}</div>
<div className="text-3xl font-semibold">{label}</div>
<div className="text-sm opacity-70">{inhale}s / {hold}s / {exhale}s</div>
</div>
</div>
)
}