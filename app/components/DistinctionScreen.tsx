// app/components/DistinctionScreen.tsx
"use client";
import React from "react";

type Props = {
  onNext: () => void;
  onBack: () => void;
};

const DistinctionScreen: React.FC<Props> = ({ onNext, onBack }) => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <h2 className="text-2xl font-semibold mb-4">Distinctions</h2>
    <p className="mb-8 text-lg">
      Explore the key distinctions that set NeuroGen apart from other platforms.
    </p>
    <div className="flex gap-4">
      <button className="px-4 py-2 bg-gray-400 text-white rounded-xl" onClick={onBack}>
        Back
      </button>
      <button className="px-4 py-2 bg-blue-600 text-white rounded-xl" onClick={onNext}>
        Next
      </button>
    </div>
  </div>
);

export default DistinctionScreen;
