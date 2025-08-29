// scripts/assert-webhook-events.mjs
// Ensures your *production* webhook endpoint has exactly the 4 required events.
// With --fix, it updates (or creates) the endpoint. Skips on non-production builds.

import Stripe from "stripe";

const required = [
  "checkout.session.completed",
  "invoice.payment_succeeded",
  "customer.subscription.updated",
  "customer.subscription.deleted",
];

const isProdBuild = process.env.VERCEL_ENV === "production";
const wantFix = process.argv.includes("--fix");

function exitFail(msg) {
  console.error("❌", msg);
  process.exit(1);
}
function info(msg)   { console.log("ℹ️", msg); }
function ok(msg)     { console.log("✅", msg); }
function warn(msg)   { console.warn("⚠️", msg); }

if (!isProdBuild) {
  info("Skipping webhook assertion (VERCEL_ENV != 'production').");
  process.exit(0);
}

const liveKey = process.env.STRIPE_SECRET_KEY_LIVE || process.env.STRIPE_SECRET_KEY;
if (!liveKey || !liveKey.startsWith("sk_live_")) {
  exitFail("STRIPE_SECRET_KEY_LIVE (sk_live_...) is missing in Production env.");
}

const explicitUrl = process.env.STRIPE_WEBHOOK_URL_LIVE;
const baseFromPublic = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
const endpointUrl = explicitUrl || (baseFromPublic ? `${baseFromPublic}/api/webhooks/stripe` : null);
if (!endpointUrl) {
  exitFail("No endpoint URL. Set STRIPE_WEBHOOK_URL_LIVE or NEXT_PUBLIC_APP_URL in Production.");
}

const stripe = new Stripe(liveKey, { apiVersion: "2024-06-20" });

async function main() {
  // Find existing live endpoint by URL
  const endpoints = await stripe.webhookEndpoints.list({ limit: 100 });
  const liveEndpoints = endpoints.data.filter((e) => e.livemode);
  let ep = liveEndpoints.find((e) => e.url === endpointUrl);

  if (!ep) {
    if (!wantFix) {
      exitFail(`No *live* webhook endpoint found at URL: ${endpointUrl}
Tip: Create it in Dashboard → Developers → Webhooks, or run with --fix to auto-create.`);
    }
    info(`Creating live webhook endpoint at ${endpointUrl} …`);
    ep = await stripe.webhookEndpoints.create({
      url: endpointUrl,
      enabled_events: required,
      description: "Prod webhook (auto-created by CI)",
    });
    ok(`Created endpoint ${ep.id} with required events.`);
    process.exit(0);
  }

  // If endpoint subscribes to "*", everything is covered
  const enabled = ep.enabled_events;
  const wildcard = enabled.includes("*");
  if (wildcard) {
    ok(`Endpoint ${ep.id} uses "*" (all events). Nothing to do.`);
    process.exit(0);
  }

  const missing = required.filter((ev) => !enabled.includes(ev));
  // Also optionally trim extras if you want exactly the 4 (not required, but tidy)
  const extras = enabled.filter((ev) => !required.includes(ev));

  if (missing.length === 0 && extras.length === 0) {
    ok(`Endpoint ${ep.id} already has exactly the required events.`);
    process.exit(0);
  }

  if (!wantFix) {
    console.log("— Endpoint:", ep.id, ep.url);
    console.log("— Currently enabled:", enabled.join(", "));
    if (missing.length) warn("Missing: " + missing.join(", "));
    if (extras.length)  warn("Extra (not required): " + extras.join(", "));
    exitFail("Run this script with --fix to update the endpoint.");
  }

  // With --fix: set exactly the 4 required events (clean & explicit)
  info(`Updating endpoint ${ep.id} to have exactly the required events…`);
  ep = await stripe.webhookEndpoints.update(ep.id, {
    enabled_events: required,
  });
  ok(`Updated ${ep.id}. Now enabled: ${ep.enabled_events.join(", ")}`);
  process.exit(0);
}

main().catch((err) => {
  exitFail(`Stripe API error: ${err?.message || err}`);
});
