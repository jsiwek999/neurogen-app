// pages/api/debug-env.ts

import type { NextApiRequest, NextApiResponse } from 'next'

// WARNING: expose only in Preview environments and remove before going to production!
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Record<string, any>>
) {
  const debugVars = {
    // Build-time vs. runtime
    NODE_ENV: process.env.NODE_ENV,
    // Your critical server-side vars
    DATABASE_URL: process.env.DATABASE_URL,
    // Your client-side prefixes
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    // List all NEXT_PUBLIC_ vars
    ALL_PUBLIC_VARS: Object.keys(process.env).filter((k) =>
      k.startsWith('NEXT_PUBLIC_')
    ),
  }

  res.status(200).json(debugVars)
}
