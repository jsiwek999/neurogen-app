// EMX registry + tolerant parser with tag aliases and consent injection

export type EMXTag =
  | "emotion" | "loop" | "shift" | "ritual" | "journal prompt" | "breath"
  | "install" | "disrupt" | "mirror" | "identity" | "submodal" | "consent";

type Step = { tag: EMXTag; title: string; content: string; seconds: number };

const DEFAULT_SECONDS: Partial<Record<EMXTag, number>> = {
  breath: 30, shift: 20, "journal prompt": 45, identity: 15,
  install: 25, disrupt: 10, submodal: 35, ritual: 0, mirror: 20, emotion: 10, loop: 15, consent: 10,
};

const TAG_ALIASES: Record<string, EMXTag> = {
  // no-space aliases map to canonical tags-with-space when needed
  journal: "journal prompt",
  "journal-prompt": "journal prompt",
  submodalities: "submodal",
  // identity synonyms (extend as you like)
  self: "identity",
};

function normalizeTag(raw: string): EMXTag | null {
  const t = raw.trim().toLowerCase();
  const canonical =
    (TAG_ALIASES[t]) ||
    (["emotion","loop","shift","ritual","journal prompt","breath","install","disrupt","mirror","identity","submodal","consent"]
      .find(x => x === t)) ||
    null;
  return canonical as EMXTag | null;
}

export function parseEMXToSteps(text: string) {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  const steps: Step[] = [];
  for (const line of lines) {
    const m = line.match(/^\[([^\]]+)\]\s*(.*)$/); // captures tags with spaces
    if (!m) continue;
    const tag = normalizeTag(m[1]);
    if (!tag) continue;
    const content = m[2] || "";
    steps.push({
      tag,
      title: tag.charAt(0).toUpperCase() + tag.slice(1),
      content,
      seconds: DEFAULT_SECONDS[tag] ?? 20,
    });
  }

  // Sovereignty/consent injection (only if we’re about to deepen):
  const needsConsent = steps.some(s => s.tag === "install" || s.tag === "identity" || s.tag === "loop");
  const hasConsent = steps.some(s => s.tag === "consent");
  if (needsConsent && !hasConsent) {
    steps.unshift({
      tag: "consent",
      title: "Consent Check",
      seconds: DEFAULT_SECONDS.consent ?? 10,
      content:
        `If you wish to deepen, take one slow breath and say: “I offer myself to the mirror.” ` +
        `If not, simply pause and we’ll stay gentle.`,
    });
  }

  const totalSeconds = steps.reduce((s, x) => s + (x.seconds || 0), 0);
  return { steps, totalSeconds };
}
