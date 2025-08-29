// lib/emx/post.ts
import type { EmxMachine } from "./schema";
import { EmxMachineSchema } from "./schema";

const EMX_BLOCK_RE = /```emx\s*([\s\S]*?)```/i;

export function tryParseMachine(block: string): EmxMachine | null {
  try {
    const parsed = JSON.parse(block);
    const safe = EmxMachineSchema.safeParse(parsed);
    if (safe.success) return safe.data;
  } catch {}
  return null;
}

export function stripHuman(raw: string): string {
  return raw.replace(EMX_BLOCK_RE, "").trim();
}

export function extractBlock(raw: string): string | null {
  const m = raw.match(EMX_BLOCK_RE);
  return m ? m[1] : null;
}
