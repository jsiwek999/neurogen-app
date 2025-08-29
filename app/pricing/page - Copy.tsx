import SubscribeButton from "@/components/SubscribeButton";

export default function PricingPage() {
  return (
    <main className="emx-pricing" style={{ padding: 24, maxWidth: 880, margin: "0 auto" }}>
      <header>
        <h1>Pricing</h1>
        <p><strong>Start for less than a cup of coffee.</strong></p>
        <p>Every plan comes with the same promise: a quick way to shift out of overwhelm in about 2 minutes.</p>
        <hr />
      </header>

      <section className="plans" style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr 1fr" }}>
        <div className="plan highlight" style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
          <h2>Basic</h2>
          <p className="price" style={{ fontSize: 24, marginTop: 8 }}>$4.99<span style={{ fontSize: 14 }}>/month</span></p>
          <ul>
            <li>Access to all 2-minute resets</li>
            <li>Guided breath & micro-movement cues</li>
            <li>Private, anytime use on your phone</li>
          </ul>
          <div style={{ marginTop: 12 }}>
            <SubscribeButton label="Get EMX for $4.99/mo" />
          </div>
        </div>

        <div className="plan coming-soon" style={{ border: "1px solid #eee", borderRadius: 12, padding: 16, opacity: 0.6 }}>
          <h2>Plus <span className="tag">Coming Soon</span></h2>
          <p className="price">—</p>
          <ul>
            <li>Expanded ritual library</li>
            <li>Reflection prompts & state tracking</li>
            <li>Priority access to new resets</li>
          </ul>
        </div>

        <div className="plan coming-soon" style={{ border: "1px solid #eee", borderRadius: 12, padding: 16, opacity: 0.6 }}>
          <h2>Premium <span className="tag">Coming Soon</span></h2>
          <p className="price">—</p>
          <ul>
            <li>Deep-dive guided sessions</li>
            <li>Community access & support</li>
            <li>Exclusive future tools & updates</li>
          </ul>
        </div>
      </section>

      <footer style={{ marginTop: 16 }}>
        <hr />
        <p><strong>No contracts. Cancel anytime.</strong></p>
        <p>Not sure yet? <a className="link-emx" href="/start-here">Try a free 2-minute reset</a></p>
      </footer>
    </main>
  );
}
