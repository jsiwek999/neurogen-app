// components/SubscribeForm.tsx
export default function SubscribeForm({ defaultEmail = '' }: { defaultEmail?: string }) {
  return (
    <div className="mt-4 w-full flex justify-center">
      <form
        className="flex w-full max-w-md gap-2"
        action="/api/subscribe"
        method="POST"
      >
        <input
          type="email"
          name="email"
          defaultValue={defaultEmail}
          required
          placeholder="you@example.com"
          className="flex-1 border rounded px-3 py-2"
        />
        <button type="submit" className="rounded px-4 py-2 border">
          Subscribe
        </button>
      </form>
    </div>
  );
}
