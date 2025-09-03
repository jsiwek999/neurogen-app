import type { Metadata } from "next";
import LoginPanel from "@/components/LoginPanel";

export const metadata: Metadata = {
  title: "Log in • EMX",
  description: "Sign in to sync and personalize your EMX experience.",
};

export default function LoginPage() {
  return (
    <section className="mx-auto max-w-md px-4 py-12">
      <h1 className="mb-2 text-2xl font-semibold">Log in</h1>
      <p className="mb-6 text-white/70">
        Use Google to sign in. No spam, no nonsense.
      </p>
      <LoginPanel />
      <p className="mt-6 text-xs text-white/50">
        Trouble signing in? Email <a className="underline" href="mailto:support@neurogenportal.com">support@neurogenportal.com</a>.
      </p>
    </section>
  );
}
