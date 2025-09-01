// components/GoogleSignInButton.tsx
"use client";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function GoogleSignInButton({ next = "/" }: { next?: string }) {
  async function handleLogin() {
    const origin = typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL!;
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
        queryParams: { flow_type: "pkce", prompt: "consent", access_type: "offline" },
        skipBrowserRedirect: true, // 👈 let us inspect `data.url` first
      },
    });
    if (error) return console.error("OAuth init error:", error.message);

    console.log("[OAuth URL]", data?.url); // 👈 Copy the redirect_uri=... from here
    if (data?.url) window.location.href = data.url; // then navigate
  }

  return (
    <button onClick={handleLogin} className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border">
      <span>Sign in with Google</span>
    </button>
  );
}
