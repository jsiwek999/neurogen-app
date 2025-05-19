"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface Reflection {
  id: string;
  sender: string;
  content: string;
  createdAt: string;
}

export default function SimpleReflectionsApp() {
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);

  // Initial fetch
  const fetchReflections = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/memory');
      if (!res.ok) throw new Error(`Fetch failed: ${res.statusText}`);
      const data: Reflection[] = await res.json();
      setReflections(data.reverse());
      setVisibleCount(5);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReflections();

    // Subscribe to SSE for real-time updates
    const es = new EventSource('/api/memory/stream');
    es.onmessage = (e) => {
      try {
        const newReflection: Reflection = JSON.parse(e.data);
        setReflections(prev => [newReflection, ...prev]);
        // celebrate new entry
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      } catch (err) {
        console.error('SSE parse error', err);
      }
    };
    es.onerror = (err) => {
      console.error('SSE error', err);
      es.close();
    };

    return () => es.close();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || submitting || cooldown) return;
    setSubmitting(true);
    setSubmitError(null);
    setCooldown(true);
    try {
      const res = await fetch('/api/memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: input }),
      });
      if (!res.ok) throw new Error(`Save failed: ${res.statusText}`);
      setInput('');
      // confetti on manual submit
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
    } catch (err: any) {
      console.error(err);
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
      setTimeout(() => setCooldown(false), 1000);
    }
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + 5, reflections.length));
  };

  const displayed = reflections.slice(0, visibleCount);

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4 text-center text-teal-600">Your Reflections</h1>
      <form onSubmit={handleSubmit} className="mb-4 flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Write a quick reflection..."
          className="flex-1 border rounded px-2 py-1 focus:ring focus:ring-teal-200"
          disabled={submitting || cooldown}
        />
        <button
          type="submit"
          disabled={submitting || cooldown}
          className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-1 rounded disabled:opacity-50 transition-colors"
        >
          {submitting ? 'Submitting...' : cooldown ? 'Please wait...' : 'Submit'}
        </button>
      </form>
      {submitError && <p className="text-red-600 mb-2">Error: {submitError}</p>}
      {error && <p className="text-red-600 mb-2">Error: {error}</p>}
      <ul>
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <li key={i} className="border-b py-4">
                <div className="h-4 bg-gray-300 rounded animate-pulse w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
              </li>
            ))
          : (
            <AnimatePresence initial={false}>
              {displayed.map(r => (
                <motion.li
                  key={r.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                  className="border-b py-2 hover:bg-teal-50 transition-colors"
                >
                  <p className="text-gray-800">{r.content}</p>
                  <span className="text-xs text-gray-500">
                    {new Date(r.createdAt).toLocaleString()}
                  </span>
                </motion.li>
              ))}
            </AnimatePresence>
          )}
      </ul>
      {!loading && visibleCount < reflections.length && (
        <button
          onClick={handleLoadMore}
          className="mt-4 block w-full bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
        >
          Load More
        </button>
      )}
    </div>
  );
}

/*
  Notes:
  - Install confetti: pnpm add canvas-confetti
  - Updated header and buttons to teal theme
  - Added hover states and transitions for list items and buttons
  - Triggers confetti on both SSE updates and manual submits
*/
