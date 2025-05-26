import React, { useState } from "react";

interface SetIntentionScreenProps {
  onContinue: (intention: string) => void;
}

const SetIntentionScreen: React.FC<SetIntentionScreenProps> = ({ onContinue }) => {
  const [intention, setIntention] = useState<string>("");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-tl from-black via-indigo-900 to-purple-900 text-white">
      <div className="max-w-lg mx-auto p-8 rounded-2xl shadow-xl bg-black/70">
        <h2 className="text-2xl font-bold mb-3 text-center">What Brings You Here?</h2>
        <p className="mb-4 text-center">
          Every quest starts with a question. What do you want to shift, create, or discover in this phase of your journey? Set your intention—you can always change it later.
        </p>
        <input
          className="w-full p-3 rounded-lg border-2 border-purple-600 bg-black/70 text-white mb-6"
          placeholder="Type your intention…"
          value={intention}
          onChange={(e) => setIntention(e.target.value)}
        />
        <button
          onClick={() => onContinue(intention)}
          className="w-full px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg transition hover:scale-105 disabled:opacity-40"
          disabled={!intention.trim()}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default SetIntentionScreen;
