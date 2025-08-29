// lib/mailer.ts  (this is your canonical mailer)
export type InvoiceEmailInput = {
  to: string | string[];
  amountMajor: string;
  currency: string;
  subject?: string;
  invoiceUrl?: string;      // Stripe hosted_invoice_url
  invoicePdfUrl?: string;   // Stripe invoice_pdf
  bcc?: string | string[];
};

export async function sendInvoiceEmail(input: InvoiceEmailInput) {
  const subject =
    input.subject ??
    `Your ${
      process.env.NEXT_PUBLIC_APP_URL
        ? new URL(process.env.NEXT_PUBLIC_APP_URL).host
        : "subscription"
    } receipt`;

  console.log("[mailer] sendInvoiceEmail (noop)", {
    ...input,
    subject,
  });

  // TODO: send via your provider here
}