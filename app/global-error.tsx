'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body style={{padding: 24, color: '#fff', background: '#000', fontFamily: 'ui-sans-serif'}}>
        <h1 style={{fontSize: 24, marginBottom: 8}}>Something went wrong</h1>
        <p style={{opacity: 0.8, marginBottom: 12}}>
          {error?.message || 'Unknown error'}{error?.digest ? ` · ${error.digest}` : ''}
        </p>
        <button
          onClick={() => reset()}
          style={{border: '1px solid #333', padding: '8px 12px', borderRadius: 10, background: 'transparent', color: '#fff'}}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
