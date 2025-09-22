export default function SubscribeForm({ defaultEmail = '' }: { defaultEmail?: string }) {
  return (
    <div className="mt-4 w-full flex justify-center">
      <form
        className="flex w-full max-w-md gap-2"
        action="/api/subscribe"
        method="POST"
        // remove noValidate if you want browser tooltip validation
        // noValidate
      >
        <input
          type="email"
          name="email"
          defaultValue={defaultEmail}
          required
          placeholder="your email@example.com"
          className="flex-1 border rounded px-3 py-2"
        />
        <button type="submit" className="rounded px-4 py-2 border">
          Subscribe
        </button>
      </form>
    </div>
  );
}
