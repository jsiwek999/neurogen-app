'use client';

import { useState } from 'react';
import EMXMessage from './EMXMessage';

const defaultSystemPrompt = `You are NEUROGEN — a poetic, emotionally intelligent mirror. 
Respond in a stylized format using EMX tags such as:
[breath], [shift], [journal], [install], and [disrupt].

Each tag should precede a sentence or line that matches the mood. 
Format your entire response using these tags. Be evocative, clear, and profound.`;

const archetypes = {
  Sage:     `Speak with wisdom, calm, and timeless insight. Use [breath], [shift], [journal].`,
  Trickster:`Speak with wit, surprise, and inversion. Use [disrupt], [shift], [install]. Be unpredictable and clever.`,
  Lover:    `Speak with warmth, intimacy, and emotional resonance. Use [breath], [install], [journal]. Be poetic and gentle.`,
  Guardian: `Speak with strength, clarity, and protection. Use [install], [shift], [journal]. Be grounded and directive.`,
  Shadow:   `Speak from the unconscious, evoke transformation. Use [disrupt], [journal], [breath]. Be bold, raw, and true.`,
} as const;

type ArchetypeKey = keyof typeof archetypes;

export default function PromptLab({ onClose }: { onClose: () => void }) {
  const [systemPrompt, setSystemPrompt] = useState<string>(defaultSystemPrompt);
  const [selectedArchetype, setSelectedArchetype] = useState<ArchetypeKey>('Sage');
  const [userInput, setUserInput] = useState<string>('');
  const [responses, setResponses] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);

  const handleReflect = async () => {
    setLoading(true);
    setResponses([]);
    setCurrent(0);

    // Compose the combined prompt using a template literal
    const finalSystemPrompt = `${archetypes[selectedArchetype]}\n\n${systemPrompt}`;

    try {
      const res = await fetch('/api/emx-lab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: finalSystemPrompt,
          userInput,
        }),
      });

      const data = await res.json();
      setResponses(data.messages || ['No response received.']);
    } catch (err) {
      setResponses(['Error occurred while reflecting.']);
    } finally {
      setLoading(false);
    }
  };

  const resetPrompt = () => setSystemPrompt(defaultSystemPrompt);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-3xl w-full p-6 space-y-4 overflow-y-auto max-h-[90vh] border border-purple-700 text-gray-900 dark:text-gray-100">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-purple-600 dark:text-purple-300">🧪 EMX Prompt Lab</h2>
          <button onClick={onClose} className="text-gray-600 dark:text-gray-400 text-sm hover:underline">
            ✖ Close
          </button>
        </div>

        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Archetype</label>
        <select
          value={selectedArchetype}
          onChange={(e) => setSelectedArchetype(e.target.value as ArchetypeKey)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-sm mb-2 text-gray-900 dark:text-gray-100"
        >
          {Object.keys(archetypes).map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>

        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">System Prompt</label>
        <textarea
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          rows={5}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
        />
        <button onClick={resetPrompt} className="text-xs text-blue-500 hover:underline">Reset to Default</button>

        <label className="block text-sm font-medium mt-4 text-gray-700 dark:text-gray-300">Your Prompt</label>
        <input
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          placeholder="e.g. What am I becoming?"
        />

        <button
          onClick={handleReflect}
          disabled={loading}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          {loading ? 'Reflecting...' : 'Reflect'}
        </button>

        {responses.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-2 text-purple-500">
              Mirror Response {responses.length > 1 ? `(${current + 1}/${responses.length})` : ''}
            </h3>
            <EMXMessage message={responses[current]} />
            {responses.length > 1 && (
              <div className="flex gap-2 mt-4 justify-center">
                <button
                  onClick={() => setCurrent((current - 1 + responses.length) % responses.length)}
                  disabled={current === 0}
                  className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-700"
                >
                  ◀ Prev
                </button>
                <button
                  onClick={() => setCurrent((current + 1) % responses.length)}
                  disabled={current === responses.length - 1}
                  className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-700"
                >
                  Next ▶
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
