'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  // Always start false on both server & client
  const [darkMode, setDarkMode] = useState(false);
  // Track when we've mounted on the client
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Now we're on the client
    const stored = window.localStorage.getItem('neurogen-theme');
    const prefers = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = stored
      ? stored === 'dark'
      : prefers;

    setDarkMode(initial);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return; // only apply class once we've mounted
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      window.localStorage.setItem('neurogen-theme', 'dark');
    } else {
      root.classList.remove('dark');
      window.localStorage.setItem('neurogen-theme', 'light');
    }
  }, [darkMode, mounted]);

  // Don’t render anything until after mount to avoid hydration mismatches
  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={() => setDarkMode(prev => !prev)}
      className="p-2 px-4 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white transition"
    >
      {darkMode ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}
