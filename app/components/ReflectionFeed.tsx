'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Reflection = {
  id: number;
  sender: string;
  content: string;
  createdAt: string;
};

export default function ReflectionFeed({ refreshTrigger }: { refreshTrigger: number }) {
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReflections = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        console.warn('No session found for user.');
        return;
      }

      const { data, error } = await supabase
        .from('Reflection')
        .select('*')
        .eq('user_id', session.user.id)
        .order('createdAt', { ascending: false });

      if (error) {
        console.error('Error fetching reflections:', error.message);
      } else {
        setReflections(data || []);
      }

      setLoading(false);
    };

    fetchReflections();
  }, [refreshTrigger]);

  if (loading) return <p>Loading reflections...</p>;
  if (reflections.length === 0) return <p>No reflections yet. Write your first one!</p>;

  return (
    <div className="space-y-4 mt-6">
      {reflections.map((reflection) => (
        <div
          key={reflection.id}
          className="border rounded p-4 bg-white dark:bg-gray-800 shadow-sm"
        >
          <p className="text-sm text-indigo-500 dark:text-indigo-300 font-mono">
            {new Date(reflection.createdAt).toLocaleString()}
          </p>
          <p className="mt-2 text-gray-800 dark:text-gray-100">{reflection.content}</p>
        </div>
      ))}
    </div>
  );
}
