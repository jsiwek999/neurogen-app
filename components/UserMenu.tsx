"use client";

import { useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import Link from "next/link";

export default function UserMenu() {
  const supabase = useMemo(() => supabaseBrowser(), []);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser();
      setEmail(data.user?.email ?? null);
    };
    load();
    const { data: sub } = supabase.auth.onAuthStateChange(() => load());
    return () => sub.subscription?.unsubscribe();
  }, [supabase]);

  if (email) {
    return (
      <div className="flex items-center gap-3 text-sm">
        <span className="opacity-80">{email}</span>
        <button
          className="rounded-lg border px-3 py-1"
          onClick={async () => {
            await supabase.auth.signOut();
            // optional: location.reload();
          }}
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <Link href="/login" className="rounded-lg border px-3 py-1 text-sm">
      Sign in
    </Link>
  );
}
