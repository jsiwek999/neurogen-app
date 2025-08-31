'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getTemplate } from '@/lib/emx/rituals';

export async function saveAnswer(formData: FormData) {
  const session_id = String(formData.get('session_id') || '');
  const key = String(formData.get('key') || '');
  const value = String(formData.get('value') || '');

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  await supabase
    .from('emx_session_data')
    .upsert(
      { session_id, key, value: value ? { text: value } : null },
      { onConflict: 'session_id,key' }
    );

  revalidatePath(`/ritual/${session_id}`);
}

export async function nextStep(formData: FormData) {
  const session_id = String(formData.get('session_id') || '');

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: s } = await supabase
    .from('emx_sessions')
    .select('template, step')
    .eq('id', session_id)
    .eq('user_id', user.id)
    .single();

  if (!s) return redirect('/ritual/new');

  const t = getTemplate(s.template);
  if (!t) return redirect('/ritual/new');

  const next = Math.min(s.step + 1, t.steps.length - 1);

  await supabase
    .from('emx_sessions')
    .update({ step: next })
    .eq('id', session_id)
    .eq('user_id', user.id);

  revalidatePath(`/ritual/${session_id}`);
}

export async function prevStep(formData: FormData) {
  const session_id = String(formData.get('session_id') || '');

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: s } = await supabase
    .from('emx_sessions')
    .select('step')
    .eq('id', session_id)
    .eq('user_id', user.id)
    .single();

  if (!s) return redirect('/ritual/new');

  const prev = Math.max(s.step - 1, 0);

  await supabase
    .from('emx_sessions')
    .update({ step: prev })
    .eq('id', session_id)
    .eq('user_id', user.id);

  revalidatePath(`/ritual/${session_id}`);
}

export async function completeSession(formData: FormData) {
  const session_id = String(formData.get('session_id') || '');

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  await supabase
    .from('emx_sessions')
    .update({ status: 'complete' })
    .eq('id', session_id)
    .eq('user_id', user.id);

  redirect('/ritual/new');
}

export async function restartSession(formData: FormData) {
  const session_id = String(formData.get('session_id') || '');

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  await supabase
    .from('emx_sessions')
    .update({ step: 0, status: 'active' })
    .eq('id', session_id)
    .eq('user_id', user.id);

  revalidatePath(`/ritual/${session_id}`);
}
