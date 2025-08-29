"use client";
import { useMemo } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function SignInButton() {
  const supabase = useMemo(() => supabaseBrowser(), []);
  return (
    <button
      className="rounded-lg border px-3 py-1"
      onClick={async () => {
        await supabase.auth.signInWithOAuth({
          provider: "google",
          options: { redirectTo: `${window.location.origin}/auth-check` },
        });
      }}
    >
      Sign in with Google
    </button>
  );
}