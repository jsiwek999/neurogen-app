// lib/emx/parse.ts
const BREATH_RE = /\[breath\s+(\d+)-(\d+)-(\d+)\]/i;
const SHIFT_RE = /\[shift\s+([a-zA-Z_-]+)\]/i;
const JOURNAL_RE = /\[journal\](.*)$/im;
const MIRROR_RE = /\[mirror\](.*)$/im;
const INSTALL_RE =
  /\[install\s+belief=\"([^\"]+)\"(?:\s+method=\"([^\"]+)\")?\]/i;
const DISRUPT_RE = /\[disrupt\](.*)$/im;

export function parseAuthoringToHints(input: string) {
  const hints: any[] = [];

  const breath = input.match(BREATH_RE);
  if (breath) {
    hints.push({
      type: "breath",
      inhale: +breath[1],
      hold: +breath[2],
      exhale: +breath[3],
      cycles: 3,
    });
  }

  const shift = input.match(SHIFT_RE);
  if (shift) {
    hints.push({ type: "state", name: shift[1].toLowerCase() });
  }

  const mirror = input.match(MIRROR_RE);
  if (mirror) {
    hints.push({
      type: "mirror",
      prompt: mirror[1].trim() || "What are you noticing right now?",
    });
  }

  const journal = input.match(JOURNAL_RE);
  if (journal) {
    hints.push({
      type: "journal",
      prompt: journal[1].trim() || "Write three lines.",
      min_lines: 3,
    });
  }

  const install = input.match(INSTALL_RE);
  if (install) {
    hints.push({
      type: "install",
      belief: install[1],
      method: (install[2] as any) || undefined,
    });
  }

  const disrupt = input.match(DISRUPT_RE);
  if (disrupt) {
    hints.push({ type: "disrupt", action: disrupt[1].trim() });
  }

  return hints;
}

export function buildDirectiveFooter(hints: any[]): string {
  if (!hints.length) return "";
  const lines = hints.map((h) => {
    switch (h.type) {
      case "breath":
        return `- breath: ${h.inhale}/${h.hold}/${h.exhale} for ${h.cycles ?? 3} cycles`;
      case "state":
        return `- shift: ${h.name}`;
      case "mirror":
        return `- mirror: ${h.prompt}`;
      case "journal":
        return `- journal: ${h.min_lines ?? 3} lines: ${h.prompt}`;
      case "install":
        return `- install: ${h.belief}${h.method ? " via " + h.method : ""}`;
      case "disrupt":
        return `- disrupt: ${h.action}`;
      default:
        return `- ${h.type}`;
    }
  });
  return `\n\nEMX_DIRECTIVES:\n${lines.join("\n")}\n`;
}
