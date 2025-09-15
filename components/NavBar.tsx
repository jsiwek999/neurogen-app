import Link from "next/link";

export function NavBar() {
  return (
    <nav className="w-full border-b p-4">
      <div className="mx-auto max-w-4xl flex items-center justify-between">
        <Link href="/" className="font-semibold">EMX Protocol</Link>
        <div className="text-sm text-neutral-600">⋯</div>
      </div>
    </nav>
  );
}

export default NavBar;
