import { supabase } from '@/lib/supabaseClient';

export async function submitReflection(content: string) {
  const {
    data: { session },
    error: sessionError
  } = await supabase.auth.getSession();

  if (sessionError) {
    console.error("Session fetch error:", sessionError.message);
  }

  if (!session || !session.user) {
    throw new Error("User not authenticated");
  }

  const userId = session.user.id;

  const { data, error } = await supabase
    .from("Reflection")
    .insert([
      {
        sender: "Julian",
        content,
        createdAt: new Date().toISOString(),
        user_id: userId,
      },
    ]);

  if (error) throw error;

  return data;
}
