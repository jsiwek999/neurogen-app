'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

interface Reflection {
  id: string;
  content: string;
  created_at: string;
  response?: string;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export default function ReflectionList() {
  const [reflections, setReflections] = useState<Reflection[]>([]);

  useEffect(() => {
    const fetchReflections = async () => {
      try {
        const { data, error } = await supabase
          .from('reflections')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) {
          console.error('❌ Supabase error:', error.message || error);
        }

        if (!data) {
          console.warn('⚠️ No data returned from reflections query.');
          return;
        }

        console.log('✅ Reflections fetched:', JSON.stringify(data, null, 2));
        setReflections(data);
      } catch (err) {
        console.error('🔥 Unexpected fetchReflections crash:', err);
      }
    };

    fetchReflections();
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <h2 className="text-xl font-bold mb-4 text-white">Your Reflections</h2>

      {reflections.length === 0 ? (
        <p className="text-red-400">No reflections found or error loading data.</p>
      ) : (
        reflections.map((reflection) => (
          <div
            key={reflection.id}
            className="mb-6 p-4 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-sm"
          >
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              {formatDate(reflection.created_at)}
            </div>

            <div className="text-base text-black dark:text-white">
              {reflection.content?.trim() || <em className="text-gray-400">[No reflection text]</em>}
            </div>

            {reflection.response && (
              <div className="mt-3 p-3 bg-neutral-100 dark:bg-neutral-800 rounded-md text-sm text-green-600 dark:text-green-400">
                {reflection.response?.trim() || <em className="text-gray-500">[No AI response]</em>}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
