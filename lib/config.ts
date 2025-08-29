// Centralized, validated config for the app

const APP_NAME = "emxprotocol-web";

// Helper
function invariant(cond: any, msg: string): asserts cond {
  if (!cond) throw new Error(`[Config] ${msg}`);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

// Validate format
invariant(url, "NEXT_PUBLIC_SUPABASE_URL is missing");
invariant(anon, "NEXT_PUBLIC_SUPABASE_ANON_KEY is missing");

// NO `.ref.` allowed
invariant(!url!.includes(".ref.supabase.co"),
  `NEXT_PUBLIC_SUPABASE_URL must not contain ".ref." (got: ${url})`);

// Simple shape check: https://<project>.supabase.co
invariant(/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/.test(url!),
  `NEXT_PUBLIC_SUPABASE_URL looks wrong: ${url}`);

export const CONFIG = {
  APP_NAME,
  SUPABASE_URL: url!,
  SUPABASE_ANON_KEY: anon!,
  // Canonical host: choose apex; change if you prefer www
  CANONICAL_HOST: "emxprotocol.com",
} as const;

// In dev, log once so you can verify quickly
if (process.env.NODE_ENV !== "production") {
  // eslint-disable-next-line no-console
  console.log(`[Config] Using ${CONFIG.SUPABASE_URL}`);
}
