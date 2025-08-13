'use client';

import { useEffect, useState } from 'react';

export default function HelpPanel() {
  const KEY = 'ritual-help-hidden';
  const [hidden, setHidden] = useState(true);   // start collapsed but visible
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setDismissed(localStorage.getItem(KEY) === '1');
  }, []);

  if (dismissed) return null;

  return (
    <div className="card p-4 mb-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-semibold">How to use this screen</h2>
          {!hidden && (
            <div className="mt-2 text-sm space-y-3">
              <ol className="list-decimal list-inside space-y-1">
                <li><b>Type your goal</b> in plain words (e.g., <i>calm under pressure</i>, <i>focus on demand</i>).</li>
                <li>Hit <b>Create</b>. You’ll get a compact ritual using the EMX tags <code>[breathe]</code>, <code>[shift]</code>, <code>[install]</code>, <code>[ritual]</code>.</li>
                <li>Use <b>Copy</b> or <b>Download</b> to save it. Every result is auto-saved to <b>History</b> on this device.</li>
                <li>In <b>History</b>, you can <b>Load</b> a past ritual, <b>Copy</b>/<b>Download</b>, or <b>Delete</b>.</li>
              </ol>
              <div className="text-xs text-black/60">
                <b>Tips for better results:</b> keep goals short (3–6 words), mention context if helpful
                (e.g., “before public speaking”), and prefer verbs (“steady confidence” vs “confidence”).
              </div>
              <div className="text-xs text-black/60">
                <b>Privacy:</b> your History lives in this browser (localStorage). Nothing is synced unless you add a backend later.
              </div>
              <div className="text-xs text-black/60">
                <b>Troubleshooting:</b> if you see “Error generating ritual,” an offline template will appear. Try again or check your connection.
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            className="btn btn-ghost text-sm"
            onClick={() => setHidden(v => !v)}
            aria-expanded={!hidden}
            aria-controls="help-content"
          >
            {hidden ? 'Show' : 'Hide'}
          </button>
          <button
            className="btn btn-ghost text-sm"
            onClick={() => { localStorage.setItem(KEY, '1'); setDismissed(true); }}
          >
            Don’t show again
          </button>
        </div>
      </div>
      {/* For screen readers; we keep content toggled by state above */}
      <div id="help-content" className="sr-only">{!hidden && 'Help visible'}</div>
    </div>
  );
}
