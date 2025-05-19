"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButton() {
  const { data: session, status } = useSession();
  if (status === "loading") return null;

  return session ? (
    <button onClick={() => signOut()}>Sign out ({session.user?.email})</button>
  ) : (
    <button onClick={() => signIn()}>Sign in</button>
  );
}
