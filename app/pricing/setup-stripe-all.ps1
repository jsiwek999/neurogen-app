param([switch]$Force)

$ErrorActionPreference = "Stop"

# --- find repo root (folder with package.json) no matter where this script lives ---
$start = Split-Path -Parent $PSCommandPath
$cur = Get-Item $start
$repoRoot = $null
while ($cur -ne $null) {
  if (Test-Path (Join-Path $cur.FullName "package.json")) { $repoRoot = $cur.FullName; break }
  $cur = $cur.Parent
}
if (-not $repoRoot) { Write-Host "[ERR] Could not find package.json starting at $start" -ForegroundColor Red; exit 1 }
Set-Location $repoRoot
Write-Host "[STEP] Using repo root: $repoRoot" -ForegroundColor Cyan

function Step($m){ Write-Host "[STEP] $m" -ForegroundColor Cyan }
function Ok($m){ Write-Host "[OK]  $m" -ForegroundColor Green }
function Warn($m){ Write-Host "[WARN] $m" -ForegroundColor Yellow }
function Err($m){ Write-Host "[ERR] $m" -ForegroundColor Red }
function Backup-And-Write($path, $content) {
  if (Test-Path $path) {
    if ($Force) {
      $bak = "$path.bak.$(Get-Date -Format 'yyyyMMddHHmmss')"
      Copy-Item $path $bak -Force
      $content | Set-Content -Path $path -Encoding UTF8
      Warn "Overwrote $path (backup at $bak)"
    } else {
      Ok "$path exists; not overwriting (use -Force to overwrite)"
    }
  } else {
    $content | Set-Content -Path $path -Encoding UTF8
    Ok "Created $path"
  }
}

# 0) Sanity
Step "Checking project root"
if (!(Test-Path "package.json")) { Err "package.json not found. Run this at your Next.js project root."; exit 1 }

# 1) Detect app dir & components dir
Step "Resolving directories"
$appDir = if (Test-Path "src/app") { "src/app" } elseif (Test-Path "app") { "app" } else { "app" }
if (!(Test-Path $appDir)) { New-Item -ItemType Directory -Path $appDir | Out-Null; Ok "Created $appDir" }

$componentsDirCandidates = @("components", "src/components", "$appDir/components")
$componentsDir = $null
foreach ($c in $componentsDirCandidates) { if (Test-Path $c) { $componentsDir = $c; break } }
if (-not $componentsDir) { $componentsDir = "components"; New-Item -ItemType Directory -Path $componentsDir | Out-Null; Ok "Created $componentsDir" }

# 2) Ensure .env.local TEST placeholders
Step "Ensuring .env.local has TEST placeholders"
$envPath = ".env.local"
if (!(Test-Path $envPath)) { New-Item -ItemType File -Path $envPath | Out-Null; Ok "Created .env.local" }
$rawEnv = Get-Content $envPath -Raw
function Ensure-Line($key,$example){
  if ($rawEnv -notmatch "(?m)^$key=") {
    Add-Content -Path $envPath -Value "$key=$example"
    Ok "Added $key"
  } else { Warn "$key already present" }
}
Ensure-Line "STRIPE_SECRET_KEY_TEST" "sk_test_put_your_new_key_here"
Ensure-Line "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST" "pk_test_put_your_new_key_here"
Ensure-Line "STRIPE_PRICE_499_TEST" "price_put_your_new_test_price_id_here"
Ensure-Line "STRIPE_WEBHOOK_SECRET_TEST" "whsec_set_after_stripe_listen_or_dashboard"
Ensure-Line "NEXT_PUBLIC_APP_URL" "http://localhost:3000"

# 3) Install stripe npm if missing (optional)
Step "Checking stripe npm package"
try {
  $out = (npm ls stripe --depth=0 2>$null)
  if ($LASTEXITCODE -ne 0 -or -not ($out -match "stripe@")) {
    Warn "stripe package not found; installing..."
    npm i stripe | Out-Null
    Ok "Installed stripe"
  } else { Ok "stripe package already present" }
} catch { Warn "Could not auto-install stripe. You can run: npm i stripe" }

# 4) SubscribeButton (only if missing unless -Force)
Step "Ensuring SubscribeButton component"
$subscribePath = Join-Path $componentsDir "SubscribeButton.tsx"
$subscribeContent = @'
"use client";

export default function SubscribeButton({ label }: { label: string }) {
  async function handleClick() {
    const res = await fetch("/api/checkout_sessions", { method: "POST" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.url) {
      alert(data.error ?? "Could not create checkout session.");
      return;
    }
    window.location.href = data.url; // Stripe Checkout
  }
  return (
    <button
      onClick={handleClick}
      style={{ padding: "12px 16px", borderRadius: 12, border: "1px solid #ccc", cursor: "pointer" }}
      className="btn-emx"
    >
      {label ?? "Subscribe"}
    </button>
  );
}
'@
Backup-And-Write $subscribePath $subscribeContent

# 5) Checkout API route (App Router)
Step "Writing Checkout API route (App Router)"
$checkoutDir = Join-Path $appDir "api/checkout_sessions"
if (!(Test-Path $checkoutDir)) { New-Item -ItemType Directory -Path $checkoutDir -Force | Out-Null; Ok "Created $checkoutDir" }
$checkoutRoute = Join-Path $checkoutDir "route.ts"
$checkoutContent = @'
import Stripe from "stripe";
export const runtime = "nodejs";

const isProd = process.env.VERCEL_ENV === "production";
const pick = <T,>(t?: T, l?: T) => (isProd ? l : t);

export async function POST() {
  try {
    const secret = pick(process.env.STRIPE_SECRET_KEY_TEST, process.env.STRIPE_SECRET_KEY_LIVE);
    const priceId = pick(process.env.STRIPE_PRICE_499_TEST, process.env.STRIPE_PRICE_499_LIVE);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    if (!secret) return new Response("Missing STRIPE_SECRET_KEY", { status: 500 });
    if (!priceId) return new Response("Missing STRIPE_PRICE_499_*", { status: 500 });

    const stripe = new Stripe(secret, { apiVersion: "2024-06-20" });
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/success`,
      cancel_url: `${baseUrl}/pricing`,
    });
    return Response.json({ url: session.url });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message ?? "Stripe error" }), { status: 400 });
  }
}
'@
Backup-And-Write $checkoutRoute $checkoutContent

# 6) Webhook route (Node runtime, raw body)
Step "Writing Webhook route (Stripe)"
$webhookDir = Join-Path $appDir "api/webhooks/stripe"
if (!(Test-Path $webhookDir)) { New-Item -ItemType Directory -Path $webhookDir -Force | Out-Null; Ok "Created $webhookDir" }
$webhookRoute = Join-Path $webhookDir "route.ts"
$webhookContent = @'
import Stripe from "stripe";
export const runtime = "nodejs";

const isProd = process.env.VERCEL_ENV === "production";
const pick = <T,>(t?: T, l?: T) => (isProd ? l : t);

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const raw = Buffer.from(await req.arrayBuffer());

  const sk  = pick(process.env.STRIPE_SECRET_KEY_TEST,      process.env.STRIPE_SECRET_KEY_LIVE);
  const wh  = pick(process.env.STRIPE_WEBHOOK_SECRET_TEST,  process.env.STRIPE_WEBHOOK_SECRET_LIVE);
  if (!sk)  return new Response("Missing STRIPE_SECRET_KEY", { status: 500 });
  if (!wh)  return new Response("Missing STRIPE_WEBHOOK_SECRET", { status: 500 });

  const stripe = new Stripe(sk, { apiVersion: "2024-06-20" });

  let event: Stripe.Event;
  try { event = stripe.webhooks.constructEvent(raw, sig!, wh); }
  catch (e: any) { console.error("Signature verify failed:", e.message); return new Response(`Webhook Error: ${e.message}`, { status: 400 }); }

  switch (event.type) {
    case "checkout.session.completed": {
      const s = event.data.object as Stripe.Checkout.Session;
      console.log("✅ session.completed", { customer: s.customer, subscription: s.subscription, email: s.customer_details?.email });
      // TODO: mark user active in DB
      break;
    }
    case "invoice.payment_succeeded":     console.log("✅ invoice.payment_succeeded"); break;
    case "customer.subscription.updated": console.log("ℹ️ subscription.updated");     break;
    case "customer.subscription.deleted": console.log("🛑 subscription.deleted");      break;
    default:                              console.log("↪️ Unhandled:", event.type);
  }
  return new Response("ok", { status: 200 });
}

// Optional: respond to GET so the browser shows something friendly
export function GET() {
  return new Response("Stripe webhook endpoint. Send POST with Stripe signature.", { status: 200 });
}
'@
Backup-And-Write $webhookRoute $webhookContent

# 7) Success page
Step "Ensuring /success page"
$successDir = Join-Path $appDir "success"
if (!(Test-Path $successDir)) { New-Item -ItemType Directory -Path $successDir -Force | Out-Null; Ok "Created $successDir" }
$successPage = Join-Path $successDir "page.tsx"
$successContent = @'
export default function SuccessPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Success 🎉</h1>
      <p>Test subscription created. Check your Stripe Dashboard (Test mode) → Customers / Payments.</p>
      <a href="/pricing">Back to Pricing</a>
    </main>
  );
}
'@
Backup-And-Write $successPage $successContent

Ok "All set."

Write-Host "`nNext steps:"
Write-Host "  1) Open .env.local and replace TEST placeholders with your REAL test keys + price id."
Write-Host "       STRIPE_SECRET_KEY_TEST=sk_test_..."
Write-Host "       NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST=pk_test_..."
Write-Host "       STRIPE_PRICE_499_TEST=price_..."
Write-Host "       STRIPE_WEBHOOK_SECRET_TEST=whsec_... (from stripe listen or Dashboard TEST endpoint)"
Write-Host "       NEXT_PUBLIC_APP_URL=http://localhost:3000"
Write-Host "  2) Restart dev: npm run dev"
Write-Host "  3) In another terminal: stripe listen --forward-to http://localhost:3000/api/webhooks/stripe"
Write-Host "     Copy the whsec_... into STRIPE_WEBHOOK_SECRET_TEST and restart dev again."
Write-Host "  4) Visit http://localhost:3000/pricing → click your 4.99 button → pay with 4242 4242 4242 4242"
Write-Host "  5) You should land on /success and see '✅ session.completed' in server logs."
