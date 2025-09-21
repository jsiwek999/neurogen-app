import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Lazy singleton Supabase "service role" client.
 * - No work at import time (avoids Next build/import issues)
 * - Requires: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 * - Only use from Node.js runtime (not Edge)
 */

let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    // Throw at CALL time (clear 500 in logs), not at import time
    throw new Error('Supabase service env missing: set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  }
  _client = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { 'X-Client-Info': 'emxprotocol/1.0 service' } },
  });
  return _client;
}

// Export a proxy so existing call sites can do: supabaseService.from('table')...
export const supabaseService = new Proxy({} as SupabaseClient, {
  get(_t, prop) {
    // @ts-expect-error dynamic forwarding
    return getClient()[prop as keyof SupabaseClient];
  },
});
