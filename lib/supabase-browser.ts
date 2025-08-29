import { createClient } from "@supabase/supabase-js";
import { CONFIG } from "@/lib/config";

export const supabaseBrowser = () =>
  createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      flowType: "pkce",
    },
    global: {
      headers: { "x-client-info": CONFIG.APP_NAME },
    },
  });

export const getSupabaseBrowser = supabaseBrowser;
