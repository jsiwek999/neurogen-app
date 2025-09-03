// app/legal/terms/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use • EMX",
  description: "Plain-language terms for using EMX.",
};

const LAST_UPDATED = "2025-09-03";

export default function TermsPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Terms of Use</h1>
      <p className="mt-1 text-sm text-white/60">Last updated: {LAST_UPDATED}</p>

      <div className="mt-6 space-y-6 text-sm leading-6 text-white/80">
        <section>
          <h2 className="mb-2 text-base font-medium text-white">1) Acceptance</h2>
          <p>
            By accessing or using EMX (“Service”), you agree to these Terms. If you
            don’t agree, don’t use the Service.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-medium text-white">2) Not medical advice</h2>
          <p>
            EMX offers skills training and somatic practices. It is not medical,
            psychological, or therapeutic care, and it’s not a substitute for
            professional help. If you’re in crisis, contact your local emergency
            services or a qualified professional.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-medium text-white">3) Eligibility</h2>
          <p>
            You must be legally able to enter into these Terms in your jurisdiction.
            If you use an account, you’re responsible for its security and for all
            activity under it.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-medium text-white">4) Acceptable use</h2>
          <ul className="ml-5 list-disc space-y-1">
            <li>No unlawful, abusive, or harmful activity.</li>
            <li>No reverse engineering, scraping, or excessive automated access.</li>
            <li>No infringement of third-party rights.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-base font-medium text-white">5) Content & IP</h2>
          <p>
            The Service and all materials are provided under license and remain the
            property of their respective owners. You get a personal, non-transferable,
            revocable license to use the Service as intended.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-medium text-white">6) Privacy</h2>
          <p>
            See our <a className="underline underline-offset-4" href="/legal/privacy">Privacy Policy</a> for how we handle data.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-medium text-white">7) No warranties</h2>
          <p>
            The Service is provided “as is” and “as available” without warranties of
            any kind, express or implied.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-medium text-white">8) Limitation of liability</h2>
          <p>
            To the fullest extent permitted by law, EMX and its contributors won’t be
            liable for indirect, incidental, special, consequential, or exemplary
            damages, or loss of data, profits, or goodwill.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-medium text-white">9) Changes</h2>
          <p>
            We may update these Terms from time to time. Continued use after changes
            means you accept the updated Terms.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-medium text-white">10) Contact</h2>
          <p>
            Questions? Email <a className="underline" href="mailto:support@neurogenportal.com">support@neurogenportal.com</a>.
          </p>
        </section>
      </div>
    </section>
  );
}
