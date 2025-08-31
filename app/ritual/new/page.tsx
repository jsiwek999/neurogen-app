import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { RITUALS } from '@/lib/emx/rituals'
import { createSession } from './server-actions'


export const dynamic = 'force-dynamic'


export default async function NewRitualPage() {
const supabase = await createSupabaseServerClient()
const { data: { user } } = await supabase.auth.getUser()
if (!user) redirect('/login')


return (
<main className="mx-auto max-w-xl p-6 space-y-6">
<h1 className="text-2xl font-semibold">Start a new ritual</h1>
<form action={createSession} className="space-y-3">
<label className="block text-sm">Choose a template</label>
<select name="template" className="w-full rounded-2xl border p-3">
{RITUALS.map(r => (
<option key={r.key} value={r.key}>{r.name}</option>
))}
</select>
<button className="rounded-xl border px-4 py-2 text-sm hover:bg-neutral-50">Start</button>
</form>
</main>
)
}