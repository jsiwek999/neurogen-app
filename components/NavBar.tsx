// components/NavBar.tsx (Server or Client; if Client, mark "use client")
import Link from "next/link";

export default function Navbar({ user }: { user: any }) {
  return (
    <nav className="flex items-center justify-between p-4">
      <Link href="/">EMX</Link>
      {user ? (
        <form action="/auth/signout" method="post">
          <button className="rounded border px-3 py-1">Sign out</button>
        </form>
      ) : (
        <Link href="/login" className="rounded border px-3 py-1">Sign in</Link>
      )}
    </nav>
  );
}
