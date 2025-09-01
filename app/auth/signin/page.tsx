"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function SignInPage() {
  const [email, setEmail] = useState(""); const [err, setErr] = useState<string|null>(null); const [sent, setSent] = useState(false);
  async function signInWithGoogle(){ setErr(null); const { error } = await sb.auth.signInWithOAuth({ provider: "google", options:{ redirectTo: `${window.location.origin}/auth/callback` } }); if (error) setErr(error.message); }
  async function sendMagicLink(e:React.FormEvent){ e.preventDefault(); setErr(null); const { error } = await sb.auth.signInWithOtp({ email, options:{ emailRedirectTo: `${window.location.origin}/auth/callback` } }); if (error) setErr(error.message); else setSent(true); }

  return (
    <main className="mx-auto max-w-md space-y-6 text-white">
      <h1 className="text-2xl font-semibold">Sign in</h1>
      <button onClick={signInWithGoogle} className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10">Continue with Google</button>
      <div className="text-center text-white/50 text-sm">or</div>
      {sent ? <p className="rounded-xl border border-white/10 bg-white/5 p-4">Magic link sent. Check your email.</p> : (
        <form onSubmit={sendMagicLink} className="space-y-3">
          <input type="email" required placeholder="you@example.com" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2 placeholder-white/40 outline-none focus:border-white/30" />
          <button className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10">Send magic link</button>
        </form>
      )}
      {err && <p className="rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">{err}</p>}
    </main>
  );
}
