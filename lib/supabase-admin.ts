import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _admin: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    // Don't throw at module import time; throw only when a handler actually needs the client.
    throw new Error("Supabase admin env vars missing (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY).");
  }

  if (!_admin) {
    _admin = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { "X-Client-Info": "emx-admin" } },
    });
  }
  return _admin;
}
