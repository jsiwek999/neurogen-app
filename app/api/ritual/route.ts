// app/api/ritual/route.ts
import { NextRequest, NextResponse } from "next/server";
import { parseEMXToSteps } from "@/lib/emx-system";
import { EMX_RITUAL_SCHEMA } from "@/lib/schemas";
import Ajv, { ValidateFunction, ErrorObject } from "ajv";
import addFormats from "ajv-formats";

export const runtime = "nodejs";

/** ---------- helpers: dynamic enum + mapping ---------- **/

// Generate candidate variants for a tag (snake/hyphen/spaces/synonyms)
function variants(tag: string): string[] {
  const low = tag.trim().toLowerCase();
  const snake = low.replace(/\s+/g, "_");
  const hyphen = low.replace(/\s+/g, "-");
  const nospace = low.replace(/\s+/g, "");
  const list = Array.from(new Set([low, snake, hyphen, nospace]));
  // common synonyms
  const syn: Record<string, string[]> = {
    "journal prompt": ["journal_prompt", "journal", "note", "write"],
    submodal: ["submodalities", "nlp_submodal"],
    identity: ["self", "self_claim"],
  };
  if (syn[low]) list.push(...syn[low]);
  return Array.from(new Set(list));
}

// Pull allowed enum values for steps[].tag from JSON Schema (if present)
function getAllowedTagsFromSchema(schema: any): string[] | null {
  try {
    const tagEnum =
      schema?.properties?.steps?.items?.properties?.tag?.enum ??
      schema?.definitions?.Step?.properties?.tag?.enum ??
      null;
    return Array.isArray(tagEnum) ? tagEnum.map((t: any) => String(t)) : null;
  } catch {
    return null;
  }
}

// Map our tag to one allowed by schema, or null if no reasonable match
function mapToAllowed(tag: string, allowed: Set<string>): string | null {
  // direct hit?
  if (allowed.has(tag)) return tag;

  // try variants
  for (const v of variants(tag)) {
    if (allowed.has(v)) return v;
  }

  // gentle fallbacks: bias to breath/ritual/shift if present
  const gentle = ["breath", "ritual", "shift", "journal_prompt", "journal"];
  for (const g of gentle) {
    if (allowed.has(g)) return g;
  }

  // no safe mapping
  return null;
}

/** ---------- prepare Ajv if using JSON Schema ---------- **/
let ajvValidate: ValidateFunction | null = null;
let allowedTagsSet: Set<string> | null = null;

(() => {
  try {
    const isJSONSchema = EMX_RITUAL_SCHEMA && typeof EMX_RITUAL_SCHEMA === "object" && "type" in (EMX_RITUAL_SCHEMA as any);
    if (isJSONSchema) {
      const ajv = new Ajv({ allErrors: true, allowUnionTypes: true });
      addFormats(ajv);
      ajvValidate = ajv.compile(EMX_RITUAL_SCHEMA as any);

      const allowed = getAllowedTagsFromSchema(EMX_RITUAL_SCHEMA as any);
      if (allowed && allowed.length) {
        allowedTagsSet = new Set(allowed.map(s => String(s).toLowerCase()));
      }
    }
  } catch {
    ajvValidate = null;
    allowedTagsSet = null;
  }
})();

/** ---------- handler ---------- **/
export async function POST(req: NextRequest) {
  try {
    const { title = "2-Minute Reset", emx, intent = "reset", cautions = [] } = await req.json();

    const script: string =
      (emx as string) ??
      `
[breath] Inhale 4, hold 4, exhale 6. Repeat softly.
[shift] Feel feet on floor; jaw and shoulders soften.
[journal prompt] One line: What matters in the next 10 minutes?
[install] I am the operator of my state—now.
[identity] I am responsible. I am enough. As I am.
`.trim();

    const parsed = parseEMXToSteps(script);

    // If we know the allowed enum, normalize to it. Otherwise, use snake_case strategy.
    const stepsRaw = parsed.steps.map(s => {
      const raw = s.tag.toString().toLowerCase().replace(/\s+/g, "_");
      const tag = allowedTagsSet ? mapToAllowed(s.tag, allowedTagsSet) : raw;
      return { tag, cue: s.content, duration: s.seconds };
    });

    // Drop any step we cannot legally map
    const steps = stepsRaw.filter(s => !!s.tag) as { tag: string; cue: string; duration: number }[];

    const ritual = {
      title,
      intent,
      duration_seconds: steps.reduce((acc, x) => acc + (x.duration || 0), 0),
      cautions,
      steps,
    };

    // Zod path (if your EMX_RITUAL_SCHEMA is Zod)
    const maybeZod = EMX_RITUAL_SCHEMA as any;
    if (maybeZod?.parse) {
      const safe = maybeZod.parse(ritual);
      return NextResponse.json({ ok: true, ritual: safe });
    }

    // JSON Schema path (Ajv)
    if (ajvValidate) {
      const ok = ajvValidate(ritual);
      if (!ok) {
        const errs = (ajvValidate.errors as ErrorObject[] | null) ?? [];
        const errors = errs.map(e => `${e.instancePath || e.schemaPath}: ${e.message}`).join("; ");
        return NextResponse.json({ ok: false, error: `Invalid ritual: ${errors}` }, { status: 400 });
      }
    }

    return NextResponse.json({ ok: true, ritual });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message ?? "Invalid payload" }, { status: 400 });
  }
}
