import { createBrowserClient } from '@supabase/ssr';

// Initialize Supabase client only in the browser (avoid build-time errors)
const supabase =
  typeof window !== 'undefined'
    ? createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_KEY!
      )
    : null;

export { supabase };
