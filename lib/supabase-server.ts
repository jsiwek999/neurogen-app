// lib/supabase-server.ts
import { getServerSupabase } from "./supabase/server";

// Keep old imports working:
export async function getSupabaseServer() {
  return getServerSupabase();
}

// (Optional) re-export for convenience
export { getServerSupabase };
