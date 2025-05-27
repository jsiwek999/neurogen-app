// app/components/ArchetypeSelectScreen.tsx
"use client";
import React, { useState } from "react";

const archetypes = [
  "Seeker",
  "Guide",
  "Mirror",
  "Torchbearer",
  "Phoenix Spirit",
  // Add your actual archetypes here!
];

type Props = {
  onContinue: (archetype: string) => void;
  onBack: () => void;
};

const ArchetypeSelectScreen: React.FC<Props> = ({ onContinue, onBack }) => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">Choose Your Archetype</h2>
      <div className="mb-8 grid grid-cols-1 gap-3">
        {archetypes.map((a) => (
          <button
            key={a}
            className={`px-6 py-2 rounded-xl border ${
              selected === a ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
            onClick={() => setSelected(a)}
          >
            {a}
          </button>
        ))}
      </div>
      <div className="flex gap-4">
        <button className="px-4 py-2 bg-gray-400 text-white rounded-xl" onClick={onBack}>
          Back
        </button>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-xl"
          onClick={() => selected && onContinue(selected)}
          disabled={!selected}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ArchetypeSelectScreen;
