import React from "react";

interface DistinctionScreenProps {
  onContinue: () => void;
}

const DistinctionScreen: React.FC<DistinctionScreenProps> = ({ onContinue }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-tr from-blue-900 via-fuchsia-900 to-black text-white">
    <div className="max-w-lg mx-auto p-8 rounded-2xl shadow-xl bg-black/70">
      <h2 className="text-2xl font-bold mb-3 text-center">This Is More Than a Game—This Is Your Evolution</h2>
      <p className="mb-5 text-center">
        NEUROGEN uses quests, archetypes, and portals to make transformation feel like an adventure, not a chore.<br />
        But this is not about points or pretending—it’s about real shifts, real choices, and real change. Every action here is designed to help you become the next version of yourself.
      </p>
      <ul className="mb-4 text-left list-disc list-inside">
        <li><b>Quests & Rituals:</b> Invitations to take real action, reflect, and shift your state.</li>
        <li><b>Archetypes:</b> Living roles you embody—not avatars, but facets of your potential.</li>
        <li><b>Portals:</b> Each portal is a choice—a path to new skills, insight, or transformation.</li>
      </ul>
      <p className="mb-8 text-center italic">
        You’re not here to play at life. You’re here to play with life—and become who you’re meant to be.
      </p>
      <button
        onClick={onContinue}
        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-xl shadow-lg transition hover:scale-105"
      >
        Begin Your Journey
      </button>
    </div>
  </div>
);

export default DistinctionScreen;
