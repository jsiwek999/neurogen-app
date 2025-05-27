// app/components/SetIntentionScreen.tsx
"use client";
import React, { useState } from "react";

type Props = {
  onContinue: (intention: string) => void;
  onBack?: () => void;
};

const SetIntentionScreen: React.FC<Props> = ({ onContinue, onBack }) => {
  const [intention, setIntention] = useState("");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">Set Your Intention</h2>
      <input
        type="text"
        placeholder="What do you want from this experience?"
        className="mb-4 px-4 py-2 border rounded-xl w-80"
        value={intention}
        onChange={(e) => setIntention(e.target.value)}
      />
      <div className="flex gap-4">
        {onBack && (
          <button className="px-4 py-2 bg-gray-400 text-white rounded-xl" onClick={onBack}>
            Back
          </button>
        )}
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-xl"
          onClick={() => onContinue(intention)}
          disabled={!intention}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SetIntentionScreen;
