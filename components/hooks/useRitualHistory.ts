'use client';

import { useEffect, useState } from 'react';

export type RitualItem = {
  id: string;
  goal: string;
  ritual: string;
  ts: number; // epoch ms
};

function safeParse<T>(raw: string | null, fallback: T): T {
  try { return raw ? JSON.parse(raw) as T : fallback; } catch { return fallback; }
}

export function useRitualHistory(key = 'ritual-history') {
  const [items, setItems] = useState<RitualItem[]>([]);

  // Load once after mount
  useEffect(() => {
    setItems(safeParse(localStorage.getItem(key), [] as RitualItem[]));
  }, [key]);

  // Cross-tab sync (nice bonus)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) {
        setItems(safeParse(e.newValue, [] as RitualItem[]));
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [key]);

  function persist(next: RitualItem[]) {
    setItems(next);
    localStorage.setItem(key, JSON.stringify(next));
  }

  function add(goal: string, ritual: string) {
    const item: RitualItem = {
      id: (crypto as any).randomUUID?.() || `${Date.now()}-${Math.random()}`,
      goal,
      ritual,
      ts: Date.now(),
    };
    persist([item, ...items].slice(0, 50)); // keep last 50
  }

  function remove(id: string) {
    persist(items.filter(i => i.id !== id));
  }

  function clear() {
    persist([]);
  }

  return { items, add, remove, clear };
}
