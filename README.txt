Love it. Here’s a compact, copy-paste-ready **README + Ops Checklist** you can drop into your repo.

---

# NEUROGEN – Post-Fix Snapshot & Ops Checklist

*Last updated: 2025-08-24*

A tiny guide so Future-You doesn’t fight the same boss twice.

## What we fixed today

* Restored **navy site background** (killed cream override).
* Verified **blue viewport bar** root cause (overlay/stacking), then removed debug bars.
* Standardized to **App Router** (`/app`) and added missing routes (e.g., `/about`).
* Fixed **mailer type** drift and duplicate files.
* Clean **production build** and deploy path to Vercel.

---

## Source of Truth (structure)

* **App Router** only:

  ```
  app/
    layout.tsx
    page.tsx
    about/page.tsx
    pricing/page.tsx
    start-here/page.tsx
    success/page.tsx
  components/
    NavBar.tsx (optional)
  lib/
    mailer.ts   ← canonical mailer
  app/globals.css
  tailwind.config.ts
  tsconfig.json
  ```
* If you still have `/pages`, delete it (or at least `pages/_app.tsx`) to avoid double nav/import clashes.

---

## Theme: Navy Base (dark mode)

**`app/globals.css`** (keep this at the bottom):

```css
:root, html, body {
  background-color: #0B1220; /* navy */
  color: #fff;
  color-scheme: dark;
}
```

**Navbar** (no `bg-white`):

```tsx
<header className="sticky top-0 z-50 bg-[#0B1220]/70 backdrop-blur border-b border-white/10">
  {/* links use text-white/90 hover:text-white */}
</header>
```

> If a page looks washed-out, search & remove top-level `bg-white` wrappers; use white only for intentional panels.

---

## Required Routes (stubs ok)

* `/` → `app/page.tsx`
* `/about` → `app/about/page.tsx`
* `/pricing` → `app/pricing/page.tsx`
* `/start-here` → `app/start-here/page.tsx`
* `/success` → `app/success/page.tsx` (if linked)
* Optional: `app/not-found.tsx`

---

## Mailer Contract (single source)

**Keep ONE file**: `lib/mailer.ts` (delete `src/lib/mailer.ts` or re-export it)

```ts
// lib/mailer.ts
export type InvoiceEmailInput = {
  to: string | string[];
  amountMajor: string;     // e.g. "4.99"
  currency: string;        // e.g. "usd"
  subject?: string;
  invoiceUrl?: string;     // Stripe hosted_invoice_url
  invoicePdfUrl?: string;  // Stripe invoice_pdf
  bcc?: string | string[];
};

export async function sendInvoiceEmail(input: InvoiceEmailInput) {
  const subject = input.subject ??
    `Your ${
      process.env.NEXT_PUBLIC_APP_URL
        ? new URL(process.env.NEXT_PUBLIC_APP_URL).host
        : "subscription"
    } receipt`;

  console.log("[mailer] sendInvoiceEmail (noop)", { ...input, subject });
  // TODO: wire Resend/Nodemailer here
}
```

**Webhook usage**:

```ts
await sendInvoiceEmail({
  to,
  amountMajor: amountMajor.toFixed(2),
  currency,
  invoiceUrl: inv.hosted_invoice_url ?? undefined,
  invoicePdfUrl: inv.invoice_pdf ?? undefined,
  // subject?: optional
});
```

---

## Stripe & Env Vars

Use **one** webhook route: keep plural
`app/api/webhooks/stripe/route.ts`

Vercel → Project → **Environment Variables (Production)**:

* `NEXT_PUBLIC_APP_URL` = `https://your-domain`
* `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = **LIVE** `pk_...`
* `STRIPE_SECRET_KEY` = **LIVE** `sk_...`
* `STRIPE_WEBHOOK_SECRET` = from Stripe dashboard (for `/api/webhooks/stripe`)

Stripe → **Developers → Webhooks**:

* Endpoint: `https://your-domain/api/webhooks/stripe`
* Events you handle (e.g., `checkout.session.completed`, `invoice.payment_succeeded`)

---

## Build & Deploy (local → prod)

**Local sanity:**

```powershell
if (Test-Path .next) { Remove-Item .next -Recurse -Force }
npm ci
npm run build
npm start   # visit http://localhost:3000
```

**Deploy:**

```bash
vercel        # preview
vercel --prod # production
```

**Quick prod QA:**

* `/`, `/about`, `/pricing`, `/start-here`, `/success` → 200
* Navy background present
* DevTools Console: no red errors
* Logs: `vercel logs <prod-url> --since=30m`

---

## Fast Debug Playbook

**White page came back?**
Search for rogue light backgrounds:

```powershell
Get-ChildItem -Recurse -Include *.tsx,*.css |
  Select-String -Pattern 'bg-white|#fff7d6|background:\s*#fff' |
  Select Path, LineNumber, Line
```

**Blue bar disappeared?**
Likely covered by a bottom overlay. In DevTools Console:

```js
document.elementsFromPoint(innerWidth/2, innerHeight-1).map(el => ({
  tag: el.tagName.toLowerCase(),
  id: el.id || null,
  class: el.className || null,
  z: getComputedStyle(el).zIndex
}));
```

Outlines bottom-fixed offenders:

```js
Array.from(document.querySelectorAll("*")).forEach(el => {
  const cs = getComputedStyle(el);
  if (cs.position === "fixed") el.style.outline = "2px solid magenta";
});
```

**Import error (“does not contain a default export”)**

* If component file has `export function X()`, import **named**: `import { X } from ...`
* If you want `import X from ...`, make the file `export default function X()`.

**ENOENT `.next/server/app/page.js`**
Create `app/page.tsx`. Next needs a root page.

---

## Savepoint (git)

```bash
git add -A
git commit -m "Stabilize: navy theme, mailer types, routes, webhook"
git tag -a v0.1.0 -m "MVP live"
git push && git push --tags
```

---

## Optional Nice-to-Haves

* Turn on **Vercel Analytics + Speed Insights**.
* Add `/api/health` and monitor with UptimeRobot.
* Convert navy hex to Tailwind token in `tailwind.config.ts` (e.g., `bg-emx-navy`).

---

That’s it. Keep this page in the repo root as `README.md`.
When something twitches, follow the playbook — and if it still acts haunted, ping me and we’ll drop the mallet again. 🛠️🟦
