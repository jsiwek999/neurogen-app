'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabaseClient';

interface Response {
  id: string;
  content: string;
  created_at: string;
}

interface Reflection {
  id: string;
  content: string;
  created_at: string;
  responses?: Response[];
}

interface Props {
  onSuccess: () => void;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export default function ReflectionForm({ onSuccess }: Props) {
  const [input, setInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const reflectionsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadReflections();
  }, []);

  useEffect(() => {
    reflectionsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [reflections]);

  const loadReflections = async () => {
    const { data, error } = await supabase
      .from('reflections')
      .select(`
        id,
        content,
        created_at,
        responses (
          id,
          content,
          created_at
        )
      `)
      .order('created_at', { ascending: true })
      .order('created_at', { foreignTable: 'responses', ascending: true });

    if (error) {
      console.error('Error loading reflections:', error);
      setFeedback('Failed to load reflections.');
    } else {
      setReflections(data ?? []);
      setFeedback(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) {
      setFeedback('Please enter a reflection before submitting.');
      return;
    }

    setSubmitting(true);
    setFeedback('NEUROGEN is reflecting...');

    try {
      const { data, error, status, statusText } = await supabase
        .from('reflections')
        .insert([{ content: input.trim() }])
        .select()
        .throwOnError();

      console.log('Insert result:', { status, statusText, error, data });

      if (!data || data.length === 0) {
        console.error('Insert returned empty data.');
        setFeedback('Reflection not saved. Try again.');
        setSubmitting(false);
        return;
      }

      const reflectionId = data[0].id;

      const res = await fetch('/api/respond-to-reflection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reflectionId }),
      });

      const json = await res.json();
      console.log('AI API response:', json);

      if (json.error) {
        console.error('GPT response error:', json.error);
        setFeedback('Reflection saved, but AI response failed.');
      } else {
        setFeedback('Reflection and AI response saved ✅');
        await loadReflections();
        onSuccess?.();
        setTimeout(() => setFeedback(null), 5000);
      }
    } catch (err: any) {
      console.error('🔥 Supabase insert threw:', err);
      setFeedback('Something went wrong. Please try again.');
    }

    setInput('');
    setSubmitting(false);
  };

  return (
    <div className="w-full h-screen flex flex-col justify-between items-center px-4 pb-0 pt-2 bg-white text-gray-900 dark:bg-black dark:text-white">
      <div className="w-full text-center py-2 text-2xl font-bold tracking-wider text-blue-700 dark:text-blue-400">
        NEUROGEN ✧ Mirror of Becoming
      </div>

      <div className="flex-1 w-full overflow-y-auto space-y-4 pt-2 max-w-3xl mx-auto px-2">
        {reflections.map((r) => (
          <div
            key={r.id}
            className="rounded-lg p-4 bg-gradient-to-b from-neutral-900 to-neutral-800 border border-neutral-700 text-white shadow-lg"
          >
            <div className="text-xs text-gray-400 mb-2">{formatDate(r.created_at)}</div>
            <p className="text-base font-medium">{r.content}</p>
            {r.responses?.map((resp) => (
              <p
                key={resp.id}
                className="text-sm italic text-green-400 mt-2 ml-2 pl-4 border-l-2 border-green-700"
              >
                {resp.content}
              </p>
            ))}
          </div>
        ))}
        <div ref={reflectionsEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="sticky bottom-0 w-full max-w-3xl mx-auto bg-black bg-opacity-80 backdrop-blur-md px-6 pt-4 pb-6 rounded-t-2xl shadow-2xl space-y-4"
      >
        <label htmlFor="reflection" className="text-sm font-semibold text-white">
          Enter your reflection.
        </label>

        <textarea
          id="reflection"
          name="reflection"
          rows={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-3 rounded-md bg-neutral-900 text-green-200 border border-green-500 placeholder-green-400 resize-none shadow-inner"
          placeholder="What's on your mind today?"
        />

        <div className="flex justify-between items-center">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded shadow-md transition"
          >
            {submitting ? 'Reflecting...' : 'Submit Reflection'}
          </button>

          {feedback && (
            <div className="text-sm text-yellow-300 bg-yellow-900/20 px-3 py-1 rounded shadow-inner">
              {feedback}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
