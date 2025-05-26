import React, { useState } from "react";

interface Archetype {
  name: string;
  desc: string;
}

interface ArchetypeSelectScreenProps {
  onContinue: (archetype: string) => void;
}

const archetypes: Archetype[] = [
  {
    name: "Mirror Mage",
    desc: "Weaver of reflections, seeker of hidden truths. Step into the mirror and conjure new realities from within.",
  },
  {
    name: "Torchbearer",
    desc: "Igniter of inner fire, breaker of patterns. Carry the flame of transformation wherever you walk.",
  },
  {
    name: "Shadow Dancer",
    desc: "Silent mover between worlds, master of the unseen. Slip through old loops and open hidden doors.",
  },
  {
    name: "Heart Alchemist",
    desc: "Healer of energies, transmuter of emotion. Turn your feelings into the gold of growth.",
  },
  {
    name: "Resonance Singer",
    desc: "Voice of the current, anchor of new states. Sing your transformation into being.",
  },
  {
    name: "Surprise Me!",
    desc: "Let the portal choose an archetype for you. Trust the current, and discover your guide.",
  }
];

const ArchetypeSelectScreen: React.FC<ArchetypeSelectScreenProps> = ({ onContinue }) => {
  const [selected, setSelected] = useState<number | null>(null);

  function handleSelect(idx: number) {
    if (archetypes[idx].name === "Surprise Me!") {
      const randomIdx = Math.floor(Math.random() * (archetypes.length - 1));
      setSelected(randomIdx);
    } else {
      setSelected(idx);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 text-white">
      <div className="max-w-2xl mx-auto p-8 rounded-2xl shadow-xl bg-black/70">
        <h2 className="text-2xl font-bold mb-3 text-center">Choose Your Mythic Archetype</h2>
        <p className="mb-6 text-center">
          Every journey begins with a role to play. Which aspect of your mythic self will guide your first steps? Pick what calls to you—or let the portal surprise you.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {archetypes.map((a, idx) => (
            <div
              key={a.name}
              className={`p-4 rounded-xl border cursor-pointer shadow-md transition 
                ${selected === idx ? "border-blue-400 ring-2 ring-blue-500 bg-purple-900/70" : "border-transparent bg-black/50 hover:border-purple-600"}
              `}
              onClick={() => handleSelect(idx)}
            >
              <h3 className="font-semibold text-lg mb-1">{a.name}</h3>
              <p className="text-sm">{a.desc}</p>
            </div>
          ))}
        </div>
        <button
          className="w-full mt-8 px-8 py-3 bg-gradient-to-r from-pink-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg transition hover:scale-105 disabled:opacity-40"
          disabled={selected === null}
          onClick={() => selected !== null && onContinue(archetypes[selected].name)}
        >
          Continue
        </button>
        <div className="mt-4 text-gray-400 text-sm italic text-center">
          You can shift archetypes or unlock new mythic roles as you evolve. Your journey is your own.
        </div>
      </div>
    </div>
  );
};

export default ArchetypeSelectScreen;
