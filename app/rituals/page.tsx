// app/rituals/page.tsx
import Link from "next/link";
import { listRitualSlugs, getRitualBySlug } from "@/lib/rituals";

export const runtime = "nodejs";
export const dynamic = "force-static";

export default async function RitualsIndex() {
  const slugs = await listRitualSlugs();
  const items = await Promise.all(
    slugs.map(async (slug) => {
      const r = await getRitualBySlug(slug);
      return { slug, title: r?.title ?? slug, excerpt: r?.body?.slice(0, 140) ?? "" };
    })
  );

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-semibold">Rituals</h1>
      {items.length === 0 ? (
        <p className="mt-4 text-neutral-600">No rituals yet.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {items.map(({ slug, title, excerpt }) => (
            <li key={slug} className="rounded-lg border p-4">
              <h2 className="text-lg font-medium">
                <Link href={`/ritual/${slug}`} className="hover:underline">
                  {title}
                </Link>
              </h2>
              {excerpt && <p className="mt-1 text-sm text-neutral-600">{excerpt}…</p>}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
