"use client";

import { useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";

type Sesh = { email?: string | null; last_sign_in_at?: string | null; user_id?: string };

export default function AuthCheckPage() {
  const supabase = useMemo(() => supabaseBrowser(), []);
  const [loading, setLoading] = useState(true);
  const [sesh, setSesh] = useState<Sesh | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [debug, setDebug] = useState<any>(null);

  // Force canonical host to avoid PKCE verifier mismatches
  useEffect(() => {
    const host = window.location.hostname;
    if (host === "www.emxprotocol.com") {
      window.location.replace("https://emxprotocol.com/auth-check");
    }
  }, []);

  async function refresh() {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      setError(error.message);
      setSesh(null);
      return;
    }
    const user = data.user;
    if (!user) {
      setSesh(null);
      return;
    }
    // TS-safe read of last_sign_in_at with metadata fallback
    const last =
      (user as { last_sign_in_at?: string | null }).last_sign_in_at ??
      ((user.user_metadata as { last_sign_in_at?: string | null } | null)?.last_sign_in_at ?? null);

    setSesh({ email: user.email, user_id: user.id, last_sign_in_at: last });
  }

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const url = new URL(window.location.href);
        const hasCode = !!url.searchParams.get("code");                // PKCE return
        const token_hash = url.searchParams.get("token_hash");         // magic link / recovery
        const type = url.searchParams.get("type");
        const hasHashTokens = window.location.hash.includes("access_token="); // implicit fallback

        setDebug({
          origin: window.location.origin,
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
          hasCode,
          token_hash: !!token_hash,
          type,
          hasHashTokens,
        });

        // 1) Exchange PKCE code for a session
        if (hasCode) {
          const { error } = await supabase.auth.exchangeCodeForSession(url.toString());
          if (error) throw error;
        }

        // 2) Implicit fallback (#access_token=...) -> setSession
        if (hasHashTokens) {
          const hash = new URLSearchParams(window.location.hash.slice(1));
          const access_token = hash.get("access_token");
          const refresh_token = hash.get("refresh_token");
          if (access_token && refresh_token) {
            const { error } = await supabase.auth.setSession({ access_token, refresh_token });
            if (error) throw error;
          }
        }

        // 3) Magic link / recovery / invite / email change
        if (token_hash && type) {
          const { error } = await supabase.auth.verifyOtp({
            token_hash,
            type: type as "magiclink" | "recovery" | "invite" | "email_change" | "signup",
          });
          if (error) throw error;
        }

        // 4) Clean URL (so reloads don’t re-run exchanges)
        if (hasCode || token_hash || hasHashTokens) {
          window.history.replaceState({}, document.title, url.origin + url.pathname);
        }
      } catch (e: any) {
        setError(e?.message ?? "Auth exchange failed");
      } finally {
        await refresh();
        setLoading(false);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(() => refresh());
    return () => sub.subscription?.unsubscribe();
  }, [supabase]);

  async function googleLogin() {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth-check` },
    });
    if (error) setError(error.message);
  }

  async function signOut() {
    setError(null);
    const { error } = await supabase.auth.signOut();
    if (error) setError(error.message);
    await refresh();
  }

  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Auth Check</h1>

      <div className="rounded-xl border p-4">
        {loading ? (
          <p>Checking session…</p>
        ) : sesh ? (
          <div>
            <p><span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-2" /> <strong>Logged in</strong></p>
            <p className="mt-2">Email: {sesh.email}</p>
            <p>User ID: <code>{sesh.user_id}</code></p>
            <p>Last sign-in (ET): <strong>{sesh.last_sign_in_at ?? "—"}</strong></p>
            <div className="mt-4 flex gap-2">
              <button onClick={refresh} className="rounded-lg border px-3 py-1">Refresh</button>
              <button onClick={signOut} className="rounded-lg border px-3 py-1">Sign out</button>
            </div>
          </div>
        ) : (
          <div>
            <p><span className="inline-block h-2 w-2 rounded-full bg-red-500 mr-2" /> <strong>Not logged in</strong></p>
            <div className="mt-4 flex gap-2">
              <button onClick={googleLogin} className="rounded-lg border px-3 py-1">
                Sign in with Google
              </button>
              <button onClick={refresh} className="rounded-lg border px-3 py-1">Refresh</button>
            </div>
          </div>
        )}

        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
      </div>

      {/* Debug footer (remove later if you want) */}
      {debug && (
        <pre className="mt-4 text-xs opacity-70 overflow-auto border rounded p-2">
{JSON.stringify(debug, null, 2)}
        </pre>
      )}
    </main>
  );
}