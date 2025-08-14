export const dynamic = "force-static";
export const metadata = { title: "Privacy Policy — NEUROGEN" };

const COMPANY = process.env.NEXT_PUBLIC_COMPANY_NAME || "Neurogen Labs, LLC";
const CONTACT = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "support@example.com";
const EFFECTIVE = "August 13, 2025";

export default function Privacy() {
  return (
    <div className="card space-y-4">
      <h1 className="text-2xl font-semibold">Privacy Policy</h1>
      <div className="text-sm" style={{opacity:.7}}>
        Effective: {EFFECTIVE}
      </div>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Who we are</h2>
        <p className="text-sm" style={{opacity:.9}}>
          {COMPANY} (“we”, “us”) provides the NEUROGEN service (the “Service”).
          This policy explains what we collect, why, and how we handle it.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Data we collect</h2>
        <ul className="text-sm" style={{opacity:.9, paddingLeft: "1rem", listStyle: "disc"}}>
          <li>Account & contact info (if you provide it), such as email.</li>
          <li>Billing info via Stripe (we don’t store full card numbers).</li>
          <li>Usage data, device/browser info, and logs for reliability/security.</li>
          <li>Content you input to generate rituals (processed to return outputs).</li>
          <li>Cookies/analytics to understand and improve the Service.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">How we use data</h2>
        <ul className="text-sm" style={{opacity:.9, paddingLeft: "1rem", listStyle: "disc"}}>
          <li>Provide, maintain, and improve the Service.</li>
          <li>Process payments and manage subscriptions (via Stripe).</li>
          <li>Prevent abuse, secure accounts, and debug issues.</li>
          <li>Communicate about updates and important notices.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Sharing</h2>
        <p className="text-sm" style={{opacity:.9}}>
          We share data with service providers that help us run the Service
          (e.g., hosting, analytics, payments). For payments, we use Stripe to
          process transactions; your payment data is handled under Stripe’s terms
          and privacy policy. We may disclose data if required by law, to protect
          rights and safety, or in a business transfer.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Retention</h2>
        <p className="text-sm" style={{opacity:.9}}>
          We keep data only as long as necessary for the purposes described above
          or as required by law, then delete or anonymize it.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Security</h2>
        <p className="text-sm" style={{opacity:.9}}>
          We use reasonable technical and organizational measures to protect data.
          No method is 100% secure; please use the Service responsibly.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Your choices</h2>
        <ul className="text-sm" style={{opacity:.9, paddingLeft: "1rem", listStyle: "disc"}}>
          <li>You can choose not to provide certain data (some features may not work).</li>
          <li>You can request access, correction, or deletion by emailing {CONTACT}.</li>
          <li>You can cancel your subscription at any time to stop future charges.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">International users & legal bases</h2>
        <p className="text-sm" style={{opacity:.9}}>
          If you’re in the EEA/UK, our legal bases include performance of a
          contract (to provide the Service), legitimate interests (e.g., to
          improve and secure the Service), and consent where required (e.g.,
          certain cookies). Data may be processed outside your country with
          appropriate safeguards.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Children’s privacy</h2>
        <p className="text-sm" style={{opacity:.9}}>
          The Service is not directed to children under 13 (or the minimum age
          in your jurisdiction). If you believe a child provided personal data,
          contact us and we’ll take appropriate steps.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Changes</h2>
        <p className="text-sm" style={{opacity:.9}}>
          We may update this policy from time to time. The Effective date above
          will change when we do. If updates are material, we’ll take reasonable
          steps to notify you.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Contact</h2>
        <p className="text-sm" style={{opacity:.9}}>
          Questions or requests? Email {CONTACT}.
        </p>
      </section>
    </div>
  );
}