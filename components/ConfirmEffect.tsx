'use client';

import { useEffect } from 'react';

export default function ConfirmEffect({ email }: { email?: string }) {
  useEffect(() => {
    if (!email) return;
    const key = `confirm-${email}`;
    if (typeof window !== 'undefined' && localStorage.getItem(key)) return;

    fetch('/api/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    }).finally(() => {
      try { localStorage.setItem(key, '1'); } catch {}
    });
  }, [email]);

  return null;
}
