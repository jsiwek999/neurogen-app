'use client';

import { useState, useCallback } from 'react';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState<string>('');

  const validate = useCallback((e: string) => {
    // Simple RFC-ish email check; no conditional hooks anywhere
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  }, []);

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate(email)) {
      setMessage('Please enter a valid email.');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setMessage('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || 'Subscription failed.');
      }

      setStatus('success');
      setMessage('Check your inbox for the confirmation email.');
    } catch (e: any) {
      setStatus('error');
      setMessage(e?.message || 'Something went wrong. Try again.');
    }
  };

  const disabled = status === 'submitting' || status === 'success';

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3 w-full max-w-md">
      <label className="text-sm font-medium">Email</label>
      <input
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border rounded-lg px-3 py-2"
        disabled={disabled}
        required
      />
      <button
        type="submit"
        disabled={disabled}
        className={`rounded-lg px-4 py-2 font-semibold border ${
          disabled ? 'opacity-60 cursor-not-allowed' : 'hover:shadow'
        }`}
      >
        {status === 'submitting' ? 'Submitting…' : status === 'success' ? 'Subscribed' : 'Subscribe'}
      </button>

      {message ? (
        <p
          className={`text-sm ${
            status === 'error' ? 'text-red-600' : status === 'success' ? 'text-green-700' : ''
          }`}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
