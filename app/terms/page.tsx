export const dynamic = "force-static";
export const metadata = { title: "Terms of Service — NEUROGEN" };

const COMPANY = process.env.NEXT_PUBLIC_COMPANY_NAME || "Neurogen Labs, LLC";
const CONTACT = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "support@example.com";
const PRODUCT = process.env.NEXT_PUBLIC_PRODUCT_NAME || "EMX Protocol";
const EFFECTIVE = "August 13, 2025";

export default function Terms() {
  return (
    <div className="card space-y-4">
      <h1 className="text-2xl font-semibold">Terms of Service</h1>
      <div className="text-sm" style={{opacity:.7}}>
        Effective: {EFFECTIVE} — If you have questions, email {CONTACT}.
      </div>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">1) Acceptance</h2>
        <p className="text-sm" style={{opacity:.9}}>
          By using NEUROGEN (the “Service”), you agree to these Terms. If you don’t agree, don’t use the Service.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">2) Eligibility</h2>
        <p className="text-sm" style={{opacity:.9}}>
          You must be at least 13 years old (or the age of digital consent in your region) to use the Service.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">3) Subscriptions & Billing</h2>
        <p className="text-sm" style={{opacity:.9}}>
          We offer a recurring subscription to <b>{PRODUCT}</b> and charge via Stripe Checkout / Payment Links.
          Prices (e.g., $4.99/month) are shown before purchase. By subscribing, you authorize recurring charges
          until you cancel. Stripe handles your payment information; we don’t store full card details.
        </p>
        <p className="text-sm" style={{opacity:.9}}>
          You can cancel at any time to stop future renewals. Unless required by law, fees already paid are non-refundable.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">4) Acceptable Use</h2>
        <p className="text-sm" style={{opacity:.9}}>
          Don’t break the law, abuse the Service, attempt to bypass limits, or harm others. We may suspend or terminate accounts for violations.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">5) Intellectual Property</h2>
        <p className="text-sm" style={{opacity:.9}}>
          The Service, its content, and underlying technology are owned by {COMPANY} or our licensors. You get a personal, non-transferable license.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">6) AI Output</h2>
        <p className="text-sm" style={{opacity:.9}}>
          Outputs may be imperfect. Use your own judgment. Not medical or mental-health advice; informational/reflective purposes only.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">7) Disclaimers</h2>
        <p className="text-sm" style={{opacity:.9}}>
          The Service is provided “as is” and “as available” without warranties of any kind, express or implied.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">8) Limitation of Liability</h2>
        <p className="text-sm" style={{opacity:.9}}>
          To the fullest extent permitted by law, {COMPANY} will not be liable for indirect, incidental, special, consequential, or exemplary damages.
          Our total liability is limited to the amount you paid in the 3 months preceding the event.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">9) Termination</h2>
        <p className="text-sm" style={{opacity:.9}}>
          You can stop using the Service at any time. We may suspend or terminate access if you violate these Terms or pose risk.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">10) Governing Law</h2>
        <p className="text-sm" style={{opacity:.9}}>
          These Terms are governed by the laws of [Your State/Country]. Courts in [Your Venue] have exclusive jurisdiction. (Replace with your actual venue.)
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">11) Changes</h2>
        <p className="text-sm" style={{opacity:.9}}>
          We may update these Terms from time to time. The Effective date will change when we do. If updates are material, we’ll try to notify you.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">12) Contact</h2>
        <p className="text-sm" style={{opacity:.9}}>
          Questions about these Terms? Email {CONTACT}.
        </p>
      </section>
    </div>
  );
}