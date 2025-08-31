'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function createEntry(formData: FormData) {
  const content = (formData.get('content') as string)?.trim()
  if (!content) return

  const supabase = await createSupabaseServerClient()
  const { data: { user }, error: userErr } = await supabase.auth.getUser()
  if (userErr || !user) redirect('/login')

  const { error } = await supabase.from('journal').insert({ user_id: user.id, content })
  if (error) throw new Error(error.message)

  revalidatePath('/journal')
}
