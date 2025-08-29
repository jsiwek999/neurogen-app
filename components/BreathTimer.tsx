'use client'
import { useEffect, useState } from 'react'

type Props = { inhale: number; hold: number; exhale: number; cycles?: number }
export default function BreathTimer({ inhale, hold, exhale, cycles = 3 }: Props) {
  const [phase, setPhase] = useState<'inhale'|'hold'|'exhale'>('inhale')
  const [count, setCount] = useState(inhale)
  const [cycle, setCycle] = useState(1)

  useEffect(() => {
    const tick = setInterval(() => setCount((c) => c - 1), 1000)
    if (count <= 0) {
      clearInterval(tick)
      if (phase === 'inhale') { setPhase('hold'); setCount(hold) }
      else if (phase === 'hold') { setPhase('exhale'); setCount(exhale) }
      else {
        if (cycle >= cycles) return
        setCycle(cycle + 1)
        setPhase('inhale'); setCount(inhale)
      }
    }
    return () => clearInterval(tick)
  }, [count, phase])

  useEffect(() => { setCount(inhale) }, [inhale])

  return (
    <div className="p-6 rounded-2xl shadow">
      <div className="text-sm opacity-70">Cycle {cycle}/{cycles}</div>
      <div className="text-4xl font-semibold">{phase.toUpperCase()}</div>
      <div className="text-6xl tabular-nums">{count}s</div>
    </div>
  )
}