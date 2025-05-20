import { createBrowserClient } from '@supabase/ssr';

let _supabase: ReturnType<typeof createBrowserClient> | null;

// Lazily initialize Supabase client on first call in the browser
export function getSupabase() {
  if (!_supabase && typeof window !== 'undefined') {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.NEXT_PUBLIC_SUPABASE_KEY!;

    if (!url || !key) {
      throw new Error(
        "⚠️ Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_KEY"
      );
    }

    _supabase = createBrowserClient(url, key);
  }
  return _supabase;
}
