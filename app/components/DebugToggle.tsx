'use client';

import { useEffect, useState } from 'react';

export default function DebugToggle() {
  const [debugMode, setDebugMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('debug', debugMode);
  }, [debugMode]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setDebugMode(prev => !prev)}
        className="px-4 py-2 bg-yellow-400 text-black rounded shadow-md"
      >
        {debugMode ? '🟢 Debug On' : '🌿 Debug Off'}
      </button>
    </div>
  );
}
