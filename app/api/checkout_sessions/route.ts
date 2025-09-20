// at top of the file if not present:
export const runtime = 'nodejs';

// inside your POST handler (near where you compute success_url/cancel_url)
const { origin } = new URL(req.url);
const base =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : origin);

const success_url = new URL('/pricing?status=success', base).toString();
const cancel_url  = new URL('/pricing?status=cancel',  base).toString();

// pass success_url/cancel_url into Stripe checkout session creation
// e.g. stripe.checkout.sessions.create({ ..., success_url, cancel_url })
