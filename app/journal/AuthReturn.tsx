"use client";
import { useEffect } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function AuthReturn() {
  useEffect(() => {
    (async () => {
      const supa = supabaseBrowser();
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      const token_hash = url.searchParams.get("token_hash");
      const type = url.searchParams.get("type");
      if (code) await supa.auth.exchangeCodeForSession(url.toString());
      if (token_hash && type) await supa.auth.verifyOtp({ token_hash, type: type as any });
      if (code || token_hash) {
        window.history.replaceState({}, document.title, url.origin + url.pathname);
      }
    })();
  }, []);
  return null;
}