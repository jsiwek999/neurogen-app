// app/journal/actions.ts
"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server"; // or getServerSupabase

export async function createEntry(formData: FormData) {
  const content = (formData.get("content") as string | null)?.trim() ?? "";
  if (!content) return { error: "Please write something before saving." };

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/login?next=${encodeURIComponent("/journal")}`);
  }

  // 🔧 Replace "journal_entries" with your actual table name if different
  const { error } = await supabase.from("journal_entries").insert({
    user_id: user!.id,
    content,
    // created_at is auto if your table has default now()
  });

  if (error) {
    console.error("[journal] insert failed:", error.message);
    return { error: "Could not save your entry. Try again." };
  }

  revalidatePath("/journal");
  return { ok: true };
}
