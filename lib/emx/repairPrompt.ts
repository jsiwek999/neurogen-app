// Minimal no-op prompt repair to satisfy imports.
// Enhance later if you actually need normalization.
export function repairPrompt(input: string): string {
  return input ?? '';
}
// Minimal stub so lib/emx/client.ts can compile.
// Flesh out later with your real logic.

export const REPAIR_SYSTEM = `
You are a prompt repairer. Clean up typos, close tags, and return a coherent EMX-ready string.
Keep user intent. Output only the repaired text—no commentary.
`.trim()

export function buildRepairUser(input: string, hints: string[] = []): string {
  const hintBlock = hints.length ? `\n\nHints:\n- ${hints.join('\n- ')}` : ''
  return `Repair the following text for EMX processing:\n\n${input}${hintBlock}`
}