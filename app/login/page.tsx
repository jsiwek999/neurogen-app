"use client";

import { useState } from "react";
import { supabaseBrowser } from "../../lib/supabase/browser";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "";

  async function loginGoogle() {
    setError(null);
    await supabaseBrowser.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: (site || window.location.origin) + "/auth/callback",
      },
    });
    // user is redirected by Supabase
  }

  async function loginEmail(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const { error } = await supabaseBrowser.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: (site || window.location.origin) + "/auth/callback" },
    });
    if (error) setError(error.message);
    else setSent(true);
  }

  return (
    <div className="p-6 max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Sign in</h1>

      <button
        onClick={loginGoogle}
        className="w-full rounded-xl bg-white/10 px-4 py-2 hover:bg-white/20 transition"
      >
        Continue with Google
      </button>

      <div className="opacity-60 text-sm">— or —</div>

      <form onSubmit={loginEmail} className="space-y-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-xl border bg-transparent px-3 py-2"
        />
        <button
          type="submit"
          className="w-full rounded-xl border px-4 py-2 hover:bg-white/5 transition"
        >
          Send magic link
        </button>
      </form>

      {sent && <p className="text-sm opacity-80">Check your email for the sign-in link.</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
