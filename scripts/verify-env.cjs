#!/usr/bin/env node
const path = require('path');
// Load .env.local first, then .env as fallback
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });
require('dotenv').config();

const required = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'OPENAI_API_KEY',
  'NEXT_PUBLIC_SITE_URL',
];

const missing = required.filter(k => !process.env[k] || !String(process.env[k]).trim());
if (missing.length) {
  console.error('[verify-env] Missing:', missing.join(', '));
  process.exit(1);
}
console.log('[verify-env] OK');
