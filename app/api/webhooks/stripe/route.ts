import Stripe from "stripe";
import { sendInvoiceEmail } from "@/lib/mailer";


export const runtime = "nodejs";

const inProd = process.env.VERCEL_ENV === "production";
const pick = <T,>(test?: T, live?: T) => (inProd ? live ?? test : test ?? live);

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const raw = Buffer.from(await req.arrayBuffer());

  const sk = pick(process.env.STRIPE_SECRET_KEY_TEST, process.env.STRIPE_SECRET_KEY_LIVE);
  const wh = pick(process.env.STRIPE_WEBHOOK_SECRET_TEST, process.env.STRIPE_WEBHOOK_SECRET_LIVE);

  if (!sk)  return new Response("Missing STRIPE_SECRET_KEY", { status: 500 });
  if (!wh)  return new Response("Missing STRIPE_WEBHOOK_SECRET", { status: 500 });

  const stripe = new Stripe(sk);

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig!, wh);
  } catch (e: any) {
    console.error("Signature verify failed:", e.message);
    return new Response(`Webhook Error: ${e.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const s = event.data.object as Stripe.Checkout.Session;
        console.log("✅ session.completed", {
          customer: s.customer,
          subscription: s.subscription,
          email: s.customer_details?.email,
        });
        // TODO: mark user active in DB later if desired
        break;
      }

      case "invoice.payment_succeeded": {
        const inv = event.data.object as Stripe.Invoice;

        // Determine recipient email
        let to = inv.customer_email || "";
        if (!to && inv.customer) {
          const cust = await stripe.customers.retrieve(
            typeof inv.customer === "string" ? inv.customer : inv.customer.id
          );
          if (!cust || (cust as Stripe.DeletedCustomer).deleted) {
            console.warn("Customer not found for invoice:", inv.id);
          } else {
            to = (cust as Stripe.Customer).email || "";
          }
        }

        if (!to) {
          console.warn("No email on invoice/customer; skipping email for invoice", inv.id);
          break;
        }

        // Money formatting (basic)
        const amountMajor = (inv.amount_paid ?? 0) / 100;
        const currency = (inv.currency || "usd").toUpperCase();

await sendInvoiceEmail({
  to,
  subject: `Your ${
    process.env.NEXT_PUBLIC_APP_URL
      ? new URL(process.env.NEXT_PUBLIC_APP_URL).host
      : "subscription"
  } receipt`,
  amountMajor: amountMajor.toFixed(2),
  currency,
  invoiceUrl: inv.hosted_invoice_url ?? undefined,   // ← use invoiceUrl
  invoicePdfUrl: inv.invoice_pdf ?? undefined,        // ← use invoicePdfUrl
});


        console.log("📧 Sent invoice email to", to, "for invoice", inv.id);
        break;
      }

      case "customer.subscription.updated":
        console.log("ℹ️ subscription.updated");
        break;

      case "customer.subscription.deleted":
        console.log("🛑 subscription.deleted");
        break;

      default:
        console.log("↪️ Unhandled:", event.type);
    }

    return new Response("ok", { status: 200 });
  } catch (err: any) {
    console.error("Webhook handler error:", err.message || err);
    // Still 200 so Stripe won't retry forever for non-critical email failures
    return new Response("ok", { status: 200 });
  }
}

// Optional GET for sanity
export function GET() {
  return new Response("Stripe webhook endpoint. Send POST with Stripe signature.", { status: 200 });
}
