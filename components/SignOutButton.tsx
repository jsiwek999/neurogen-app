"use client";
import { useMemo } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function SignOutButton() {
  const supabase = useMemo(() => supabaseBrowser(), []);
  return (
    <button
      className="rounded-lg border px-3 py-1"
      onClick={async () => {
        await supabase.auth.signOut();
        // optional: location.reload();
      }}
    >
      Sign out
    </button>
  );
}