export const runtime = 'nodejs';

// inside your POST handler:
const { origin } = new URL(req.url);
const base =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : origin);

const return_url = new URL('/pricing?status=portal', base).toString();

// use `return_url` when creating the billing portal session
// e.g. stripe.billingPortal.sessions.create({ customer, return_url })
