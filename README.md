# NEUROGEN PWA (Next.js + Tailwind + Clerk + Stripe + OpenAI)
A minimal, production-minded starter.

## Quickstart
npm i
cp .env.example .env.local
npm run dev

## ENV
OPENAI_API_KEY, OPENAI_MODEL
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, STRIPE_PRICE_ID
NEXT_PUBLIC_APP_URL

## Notes
- Use Node 20+
- If peer deps complain, lock to: next@14.2.5 react@18.3.1 react-dom@18.3.1 @clerk/nextjs@6.3.0
