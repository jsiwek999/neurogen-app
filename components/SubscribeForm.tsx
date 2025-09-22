// components/SubscribeForm.tsx
// (No "use client" needed unless you add hooks)

export default function SubscribeForm({ defaultEmail = '' }: { defaultEmail?: string }) {
  return (
    <form
      className="mt-4 flex gap-2 items-start"
      action="/api/subscribe"
      method="POST"
    >
      <input
        type="email"
        name="email"
        defaultValue={defaultEmail}
        required
        placeholder="you@example.com"
        className="border rounded px-3 py-2 w-full max-w-sm"
      />
      <button
        type="submit"
        className="rounded px-4 py-2 border"
      >
        Subscribe
      </button>
    </form>
  );
}
