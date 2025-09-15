"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPanel() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [hasKeys, setHasKeys] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setHasKeys(!!supabase);
    setReady(true);
  }, []);

  const signInGoogle = async () => {
    if (!supabase) return;
    setLoading(true);
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/login`, // returns here after Supabase exchange
      },
    });
    if (error) {
      console.error("Google sign-in error:", error.message);
      setLoading(false);
    }
  };

  if (!ready) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="text-sm text-white/70">Loading…</p>
      </div>
    );
  }

  if (!hasKeys) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="text-sm text-white/80">
          Login is not configured yet. Add <code className="px-1">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code className="px-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in Vercel &amp; .env to enable Google sign-in.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <button
        onClick={signInGoogle}
        disabled={loading}
        className="w-full rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm hover:bg-white/15 disabled:opacity-60"
      >
        {loading ? "Redirecting…" : "Continue with Google"}
      </button>
    </div>
  );
}
