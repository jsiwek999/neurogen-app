import { notFound, redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getTemplate } from '@/lib/emx/rituals'
import { nextStep, prevStep, completeSession, saveAnswer, restartSession } from './server-actions'

export const dynamic = 'force-dynamic'

export default async function RitualSessionPage(
  { params }: { params: Promise<{ id: string }> }   // 👈 awaitable params
) {
  const { id } = await params                         // 👈 unwrap id

  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: session } = await supabase
    .from('emx_sessions')
    .select('id, template, step, status, created_at')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!session) return notFound()
  const t = getTemplate(session.template)
  if (!t) return notFound()

  const current = t.steps[session.step]
  const isFirst = session.step === 0
  const isLast  = session.step >= t.steps.length - 1

  return (
    <main className="mx-auto max-w-xl p-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">{t.name}</h1>
        <p className="text-sm text-neutral-500">
          Step {session.step + 1} of {t.steps.length} — {current.title}
        </p>
      </header>

      <form action={saveAnswer} className="space-y-3">
        <input type="hidden" name="session_id" value={session.id} />
        <input type="hidden" name="key" value={current.key} />
        {current.prompt && <p className="text-sm text-neutral-600">{current.prompt}</p>}
        <textarea name="value" rows={4} className="w-full rounded-2xl border p-3" placeholder="Write your answer here…" />
        <div className="flex gap-2">
          {!isFirst && (
            <button formAction={prevStep} className="rounded-xl border px-4 py-2 text-sm">Back</button>
          )}
          {!isLast ? (
            <button formAction={nextStep} className="rounded-xl border px-4 py-2 text-sm">Next</button>
          ) : (
            <button formAction={completeSession} className="rounded-xl border px-4 py-2 text-sm">Complete</button>
          )}
          <a href="/ritual/new" className="ml-auto rounded-xl border px-4 py-2 text-sm">New Session</a>
          <button formAction={restartSession} className="rounded-xl border px-4 py-2 text-sm" type="submit">Restart</button>
        </div>
      </form>
    </main>
  )
}
