'use server'


import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getTemplate } from '@/lib/emx/rituals'


export async function createSession(formData: FormData) {
const template = String(formData.get('template') || '')
const t = getTemplate(template)
if (!t) throw new Error('Invalid template')


const supabase = await createSupabaseServerClient()
const { data: { user } } = await supabase.auth.getUser()
if (!user) redirect('/login')


const { data, error } = await supabase.from('emx_sessions').insert({
user_id: user.id,
template,
step: 0,
status: 'active',
}).select('id').single()


if (error) throw new Error(error.message)


redirect(`/ritual/${data!.id}`)
}