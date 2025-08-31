/**
 * Minimal env gate for builds.
 * Loads .env.local for local dev; CI (Vercel) uses project env vars.
 */
const fs = require("fs");
const path = require("path");

// Load .env.local if present
const envLocalPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envLocalPath)) {
  // Use dotenv to inject .env.local
  try {
    require("dotenv").config({ path: envLocalPath });
    console.log(`[dotenv] loaded .env.local`);
  } catch (e) {
    console.warn(`[dotenv] not installed; skipping .env.local load`);
  }
}

const required = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
];

const missing = required.filter((k) => !process.env[k]);

if (missing.length) {
  console.error(`[verify-env] Missing: ${missing.join(", ")}`);
  process.exit(1);
} else {
  console.log(`[verify-env] OK (${required.length})`);
}
