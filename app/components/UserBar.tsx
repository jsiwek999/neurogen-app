"use client";
import { useSession, signOut } from "next-auth/react";

export default function UserBar() {
  const { data: session } = useSession();

  if (!session) return null;                      // not signed in → nothing

  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <span style={{ fontSize: 14 }}>
        Signed in as <strong>{session.user?.email ?? "you"}</strong>
      </span>

      <button
        onClick={() => signOut()}                 // ← magic line
        style={{
          padding: "4px 10px",
          borderRadius: 4,
          border: "1px solid #aaa",
          background: "#fafafa",
          cursor: "pointer",
        }}
      >
        Sign out
      </button>
    </div>
  );
}
