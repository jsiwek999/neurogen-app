'use client';
import React from 'react';

type Props = {
  selectedArchetype: string;
  setSelectedArchetype: (value: string) => void;
};

const archetypes = [
  { id: 'mirror', label: '🪞 Mirror' },
  { id: 'caregiver', label: '💗 Caregiver' },
  { id: 'godform', label: '🌟 Godform' },
  // Hypnodomme stays private, not shown unless toggled manually or linked to profile
  // { id: 'hypnodomme', label: '🖤 Hypnodomme' },
];

export default function ArchetypeSelector({ selectedArchetype, setSelectedArchetype }: Props) {
  return (
    <div className="flex gap-2 mb-4 justify-center">
      {archetypes.map((a) => (
        <button
          key={a.id}
          className={`px-4 py-2 rounded-full border text-sm transition-all ${
            selectedArchetype === a.id
              ? 'bg-purple-600 text-white border-purple-700 shadow-lg'
              : 'bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700'
          }`}
          onClick={() => setSelectedArchetype(a.id)}
        >
          {a.label}
        </button>
      ))}
    </div>
  );
}
