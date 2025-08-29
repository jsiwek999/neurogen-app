// app/not-found.tsx
export default function NotFound() {
  return (
    <div className="mx-auto max-w-screen-md px-4 py-20">
      <h2 className="text-2xl font-semibold">Page not found</h2>
      <p className="mt-3 text-white/70">Check the URL or head back home.</p>
      <a href="/" className="mt-6 inline-block underline">Go home</a>
    </div>
  );
}
