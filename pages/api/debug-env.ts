// pages/api/debug-env.ts

// WARNING: expose only in Preview environments and remove before going to production!
export default function handler(req, res) {
  // List exactly the vars you want to verify
  const debugVars = {
    // Build-time vs. runtime
    NODE_ENV: process.env.NODE_ENV,
    // Replace these with the ones you’re checking
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    // Show all client-exposed prefixes
    ALL_PUBLIC_VARS: Object.keys(process.env)
      .filter((k) => k.startsWith('NEXT_PUBLIC_'))
  };

  res.status(200).json(debugVars);
}
