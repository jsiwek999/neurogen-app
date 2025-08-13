export default function Pricing() {
  return (
    <div className="card p-8">
      <h2 className="text-2xl font-semibold">Membership</h2>
      <p className="text-white/80 mt-2">Daily nudges, custom rituals on request, streak tracking, and history. Cancel anytime.</p>
      <ul className="list-disc ml-6 mt-4 text-white/80">
        <li>Daily one-minute drill</li>
        <li>Unlimited ritual generations (fair use)</li>
        <li>Journal + history</li>
      </ul>
      <form action="/api/stripe/checkout" method="POST" className="mt-6">
        <button className="btn">Start $4.99/mo</button>
      </form>
      <p className="text-xs text-white/60 mt-4">Not therapy. If you are in crisis, contact local emergency services or your regional helpline.</p>
    </div>
  )
}
