// src/components/StoicMirror.tsx
'use client';

import React, { useState } from 'react';
import { stoicPrompts } from 'utils/promptsConfig';

const StoicMirror = () => {
  const [prompt, setPrompt] = useState('');

  const generatePrompt = () => {
    const randomPrompt = stoicPrompts[Math.floor(Math.random() * stoicPrompts.length)];
    setPrompt(randomPrompt.prompt);
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg text-white">
      <h2 className="text-xl font-bold mb-4">🏛️ The Stoic Mirror</h2>
      <button
        className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
        onClick={generatePrompt}
      >
        Reflect Now
      </button>
      {prompt && <p className="mt-4 italic">{prompt}</p>}
    </div>
  );
};

export default StoicMirror;
