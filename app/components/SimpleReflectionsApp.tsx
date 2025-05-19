'use client';

import { useState, useRef, useEffect } from 'react';
import EMXMessage from './EMXMessage'; // adjust if needed

const formatTimestamp = (iso: string): string => {
  const date = new Date(iso);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000); // seconds

  if (diff < 10) return 'just now';
  if (diff < 60) return `${diff} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  return date.toLocaleString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    month: 'short',
    day: 'numeric',
  });
};

export default function SimpleReflectionsApp() {
  const [input, setInput] = useState('');
  const [reflections, setReflections] = useState<{
    input: string;
    response: string;
    timestamp: string;
  }[]>([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 👇 HERE: Export function lives inside component
  const handleExport = () => {
    if (reflections.length === 0) return;

    const content = reflections
      .map((entry, index) => {
        const ts = formatTimestamp(entry.timestamp);
        return `Reflection #${index + 1} (${ts})\nYou: ${entry.input}\nMirror: ${entry.response}\n`;
      })
      .join('\n---------------------------\n\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'neurogen-reflections.txt';
    link.click();

    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      setDarkMode(saved === 'true');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [reflections]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);

    try {
      const res = await fetch('/api/memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: input }),
      });

      const data = await res.json();
      const message = data?.message?.trim();

      const reflectionBlock = {
        input,
        response: message || '⚠️ No response received.',
        timestamp: new Date().toISOString(),
      };

      setReflections((prev) => [...prev, reflectionBlock]);
      setInput('');
    } catch (err: any) {
      console.error('Reflection error:', err);
      setReflections((prev) => [
        ...prev,
        {
          input,
          response: '⚠️ Something went wrong with the mirror.',
          timestamp: new Date().toISOString(),
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto py-4 px-6 w-full max-w-screen-xl mx-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-purple-700 dark:text-purple-300">
            NEUROGEN Mirror
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => setDarkMode((prev) => !prev)}
              className="text-sm px-3 py-1 border rounded focus:outline-none dark:border-gray-500"
            >
              {darkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
            <button
              onClick={handleExport}
              className="text-sm px-3 py-1 border rounded focus:outline-none dark:border-gray-500"
            >
              ⬇ Export
            </button>
          </div>
        </div>

        {reflections.length === 0 && !loading && (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center italic mt-10">
            No reflections yet. Enter something below.
          </p>
        )}

        {reflections.map((entry, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded shadow-sm space-y-2 mb-6"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400 italic">
              You reflected <span className="not-italic">({formatTimestamp(entry.timestamp)})</span>:
            </p>
            <p className="whitespace-pre-wrap">{entry.input}</p>

            <p className="text-sm text-gray-600 dark:text-gray-400 italic pt-2">Mirror responded:</p>
            <EMXMessage message={entry.response} />
          </div>
        ))}

        <div className="h-36"></div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-md"
      >
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-screen-xl mx-auto px-6">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What do you want to reflect on?"
            rows={2}
            className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-purple-600 dark:bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-700 dark:hover:bg-purple-600 transition"
          >
            {loading ? 'Reflecting...' : 'Reflect'}
          </button>
        </div>
      </form>
    </div>
  );
}
