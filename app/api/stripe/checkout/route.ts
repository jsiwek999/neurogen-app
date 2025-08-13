import { NextResponse } from 'next/server'
import Stripe from 'stripe'
export async function POST() {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-06-20' })
  const price = process.env.STRIPE_PRICE_ID
  const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  if (!process.env.STRIPE_SECRET_KEY || !price) return NextResponse.json({ error: 'Stripe not configured. Set STRIPE_SECRET_KEY and STRIPE_PRICE_ID.' }, { status: 400 })
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription', line_items: [{ price, quantity: 1 }],
    success_url: `${origin}/dashboard?checkout=success`, cancel_url: `${origin}/pricing?checkout=cancel`,
  })
  return NextResponse.redirect(session.url!, { status: 303 })
}
