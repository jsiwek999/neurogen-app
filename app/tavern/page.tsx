// app/tavern/page.tsx

import React from 'react';
import Link from 'next/link';

export default function MonsterTavern() {
  return (
    <main className="min-h-screen bg-[#1a1a1a] text-gray-100 p-8 relative overflow-hidden font-serif">
      <div className="absolute inset-0 bg-[url('/tavern-texture.jpg')] bg-cover bg-center opacity-20 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/80 via-black/50 to-transparent z-0" />

      <section className="relative z-10 max-w-5xl mx-auto text-center">
        <h1 className="text-5xl font-extrabold tracking-wider text-amber-200 mb-6 drop-shadow-lg">
          🐲 The 1600-Year-Old Monster Tavern 🐲
        </h1>
        <p className="text-xl mb-10 max-w-2xl mx-auto leading-relaxed text-gray-300">
          You step into a vast cavern of clinking mugs, echoing laughter, and ancient power.
          Firelight flickers on the cracked stone walls, and every corner hides a legend.
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          <TavernLink href="/portal-room/guildhouse" label="🔥 Speak to the Bartender" />
          <TavernLink href="/portal-room/chamber-of-challenges" label="🪓 Join the Pit Fight" />
          <TavernLink href="/portal-room/library" label="📚 Find the Shadow Scribe" />
        </div>
      </section>
    </main>
  );
}

const TavernLink = ({ href, label }: { href: string; label: string }) => (
  <Link
    href={href}
    className="block p-6 bg-black/40 border border-amber-900 rounded-xl hover:bg-amber-900/20 transition-all duration-300 shadow-lg hover:shadow-amber-700"
  >
    <span className="text-lg font-semibold tracking-wide">{label}</span>
  </Link>
);
