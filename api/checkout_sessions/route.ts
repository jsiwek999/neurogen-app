import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: process.env.STRIPE_PRICE_499!, // $4.99/mo (TEST price ID)
          quantity: 1,
        },
      ],
      // Use your local URL in dev; set to your domain in prod
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    });

    return Response.json({ url: session.url });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message ?? "Stripe error" }),
      { status: 400 }
    );
  }
}
