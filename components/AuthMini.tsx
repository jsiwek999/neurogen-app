"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";

export default function AuthMini() {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    if (!supabase) return;

    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSignedIn(!!data.session);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => setSignedIn(!!session)
    );

    return () => {
      mounted = false;
      subscription?.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  // If Supabase isn’t configured yet, just show a Login link
  if (!supabase) {
    return (
      <Link
        href="/login"
        className="rounded-lg px-3 py-1.5 text-sm text-white/80 hover:bg-white/10 hover:text-white"
      >
        Log in
      </Link>
    );
  }

  return signedIn ? (
    <button
      onClick={signOut}
      className="rounded-lg px-3 py-1.5 text-sm text-white/80 hover:bg-white/10 hover:text-white"
    >
      Log out
    </button>
  ) : (
    <Link
      href="/login"
      className="rounded-lg px-3 py-1.5 text-sm text-white/80 hover:bg-white/10 hover:text-white"
    >
      Log in
    </Link>
  );
}
