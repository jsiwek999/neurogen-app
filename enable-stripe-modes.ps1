# enable-stripe-modes.ps1
param(
  [switch]$Force # Overwrite files if they exist (with .bak backup)
)

$ErrorActionPreference = "Stop"

function Step($m){ Write-Host "[STEP] $m" -ForegroundColor Cyan }
function Ok($m){ Write-Host "[OK]   $m" -ForegroundColor Green }
function Warn($m){ Write-Host "[WARN] $m" -ForegroundColor Yellow }
function Err($m){ Write-Host "[ERR]  $m" -ForegroundColor Red }

# 0) Sanity
if (!(Test-Path "package.json")) { Err "Run this in your Next.js project root."; exit 1 }

# 1) Resolve app folder (app/ or src/app/)
$appDir = if (Test-Path "src/app") { "src/app" } elseif (Test-Path "app") { "app" } else { "app" }
if (!(Test-Path $appDir)) { New-Item -ItemType Directory -Path $appDir | Out-Null; Ok "Created $appDir" }

# 2) Ensure .env.local entries for TEST/LIVE (placeholders)
Step "Ensuring .env.local has TEST/LIVE keys"
$envPath = ".env.local"
if (!(Test-Path $envPath)) { New-Item -ItemType File -Path $envPath | Out-Null; Ok "Created .env.local" }
$envRaw = Get-Content $envPath -Raw

function EnsureLine($key, $example) {
  if ($envRaw -notmatch "(?m)^$key=") {
    Add-Content -Path $envPath -Value "$key=$example"
    Ok "Added $key"
  } else { Warn "$key already present" }
}

# TEST (local/dev/preview)
EnsureLine "STRIPE_SECRET_KEY_TEST" "sk_test_your_key_here"
EnsureLine "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST" "pk_test_your_key_here"
EnsureLine "STRIPE_PRICE_499_TEST" "price_test_499_here"
EnsureLine "STRIPE_WEBHOOK_SECRET_TEST" "whsec_test_here"

# LIVE (production)
EnsureLine "STRIPE_SECRET_KEY_LIVE" "sk_live_your_key_here"
EnsureLine "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE" "pk_live_your_key_here"
EnsureLine "STRIPE_PRICE_499_LIVE" "price_live_499_here"
EnsureLine "STRIPE_WEBHOOK_SECRET_LIVE" "whsec_live_here"

# Base URL (for redirects)
EnsureLine "NEXT_PUBLIC_APP_URL" "http://localhost:3000"

# 3) Write the API route with TEST/LIVE selection + guardrails
$apiDir = Join-Path $appDir "api/checkout_sessions"
if (!(Test-Path $apiDir)) { New-Item -ItemType Directory -Path $apiDir -Force | Out-Null; Ok "Created $apiDir" }
$apiRoutePath = Join-Path $apiDir "route.ts"

$apiRouteContent = @'
import Stripe from "stripe";

export const runtime = "nodejs";

// Prefer VERCEL_ENV for accuracy: "development" | "preview" | "production".
// Locally, VERCEL_ENV is usually undefined -> treat as TEST.
const isProd =
  process.env.VERCEL_ENV === "production";

function pick<T>(testVal: T | undefined, liveVal: T | undefined): T | undefined {
  return isProd ? liveVal : testVal;
}

function assertStripeEnv() {
  const sk = pick(process.env.STRIPE_SECRET_KEY_TEST, process.env.STRIPE_SECRET_KEY_LIVE);
  const pk = pick(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST, process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE);
  const price = pick(process.env.STRIPE_PRICE_499_TEST, process.env.STRIPE_PRICE_499_LIVE);

  if (!sk) throw new Error("Missing Stripe secret key for this environment.");
  if (!price) throw new Error("Missing Stripe price id for this environment.");

  // Guard against mixing test/live keys
  if (pk) {
    const skIsTest = sk.startsWith("sk_test_");
    const pkIsLive = pk.startsWith("pk_live_");
    const skIsLive = sk.startsWith("sk_live_");
    const pkIsTest = pk.startsWith("pk_test_");
    if ((skIsTest && pkIsLive) || (skIsLive && pkIsTest)) {
      throw new Error("Stripe key mismatch: secret/publishable modes do not match.");
    }
  }
}

export async function POST() {
  try {
    assertStripeEnv();

    const secret = pick(process.env.STRIPE_SECRET_KEY_TEST, process.env.STRIPE_SECRET_KEY_LIVE)!;
    const priceId = pick(process.env.STRIPE_PRICE_499_TEST, process.env.STRIPE_PRICE_499_LIVE)!;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const stripe = new Stripe(secret, { apiVersion: "2024-06-20" });

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/success`,
      cancel_url: `${baseUrl}/pricing`,
    });

    return Response.json({ url: session.url });
  } catch (err: any) {
    const message = err?.message || "Stripe error";
    return new Response(JSON.stringify({ error: message }), { status: 400 });
  }
}
'@

Step "Writing $apiRoutePath"
if (Test-Path $apiRoutePath) {
  if ($Force) {
    $bak = "$apiRoutePath.bak.$(Get-Date -Format 'yyyyMMddHHmmss')"
    Copy-Item $apiRoutePath $bak
    $apiRouteContent | Set-Content -Path $apiRoutePath -Encoding UTF8
    Warn "Overwrote $apiRoutePath (backup at $bak)"
  } else {
    Ok "API route exists; not overwriting (use -Force to overwrite)"
  }
} else {
  $apiRouteContent | Set-Content -Path $apiRoutePath -Encoding UTF8
  Ok "Created $apiRoutePath"
}

Ok "Done. Next:"
Write-Host "  1) Put REAL values into .env.local for the *_TEST vars (keep LIVE empty locally)."
Write-Host "  2) Restart dev: npm run dev"
Write-Host "  3) Go to /pricing and click “Get EMX for $4.99/mo” (button is already on the page) — it posts to /api/checkout_sessions." 
Write-Host "  4) Use Stripe test card 4242 4242 4242 4242"
Write-Host "  5) On Vercel → set *_TEST on Development/Preview, *_LIVE on Production."
