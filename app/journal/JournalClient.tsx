// app/journal/JournalClient.tsx
'use client'
import { useSearchParams } from 'next/navigation'

export default function JournalClient() {
  const params = useSearchParams()
  const q = params.get('q')
  return <div className="p-8">Journal query: {q ?? '—'}</div>
}
