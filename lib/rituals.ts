// lib/rituals.ts
export type Ritual = {
  slug: string;
  title: string;
  summary: string;
  durationMin: number;
};

export const RITUALS: Ritual[] = [
  { slug: "calm-in-10", title: "Calm in 10", summary: "A 10-breath downshift: release, re-center, re-enter.", durationMin: 2 },
  { slug: "micro-reset", title: "Micro Reset", summary: "30-second pattern interrupt for overwhelm & spirals.", durationMin: 1 },
  { slug: "focus-primer", title: "Focus Primer", summary: "Get present, set the frame, direct your attention.", durationMin: 3 },
];

// Sync + async helpers (future-proof for DB/API swap)
export function getRitualsSync(): Ritual[] {
  return RITUALS;
}

export async function getRituals(): Promise<Ritual[]> {
  return RITUALS;
}

export async function getRitualBySlug(slug: string): Promise<Ritual | null> {
  return RITUALS.find((r) => r.slug === slug) ?? null;
}

export async function getAllRitualSlugs(): Promise<string[]> {
  return RITUALS.map((r) => r.slug);
}
