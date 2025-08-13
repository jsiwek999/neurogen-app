import { headers } from 'next/headers'
import Stripe from 'stripe'
import { NextResponse } from 'next/server'
export async function POST(req: Request) {
  const body = await req.text()
  const sig = (await headers()).get('stripe-signature') as string
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) return NextResponse.json({ error: 'Missing STRIPE_WEBHOOK_SECRET' }, { status: 400 })
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-06-20' })
  let event: Stripe.Event
  try { event = stripe.webhooks.constructEvent(body, sig, secret) }
  catch (err: any) { return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 }) }
  console.log('Stripe event:', event.type)
  return NextResponse.json({ received: true })
}
