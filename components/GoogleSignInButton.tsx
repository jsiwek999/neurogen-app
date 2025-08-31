// components/GoogleSignInButton.tsx
"use client";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function GoogleSignInButton({ next = "/" }: { next?: string }) {
  async function handleLogin() {
    const origin = typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL!;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
        queryParams: { prompt: "consent", access_type: "offline" }, // solid default
      },
    });
    if (error) console.error("Google OAuth error:", error.message);
  }

  return (
    <button onClick={handleLogin} className="inline-flex items-center gap-2 rounded-lg border px-4 py-2">
      <GoogleGlyph />
      <span>Sign in with Google</span>
    </button>
  );
}

function GoogleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.6 32.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C33.5 6.1 28.9 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c10.4 0 19-8.4 19-19 0-1.2-.1-2.3-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 18.9 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C33.5 6.1 28.9 4 24 4c-7.7 0-14.3 4.3-17.7 10.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.3-5.2l-6.1-5.2C29.1 35.6 26.7 36 24 36c-5.2 0-9.6-3.4-11.2-8.1l-6.6 5.1C9.7 39.6 16.3 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.3 3.6-4.6 6-8.3 6-5.2 0-9.6-3.4-11.2-8.1l-6.6 5.1C9.7 39.6 16.3 44 24 44c10.4 0 19-8.4 19-19 0-1.2-.1-2.3-.4-3.5z"/>
    </svg>
  );
}
