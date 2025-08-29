export const REPAIR_SYSTEM = `You are NEUROGEN EMX Repair. Return ONLY a fenced emx code block with VALID JSON per schema. No prose.`


export function buildRepairUser(raw: string) {
return `Extract or reconstruct the MACHINE section for this response. Return ONLY:\n\n\u0060\u0060\u0060emx\n{ "version":"1.1", "events": [ ... ] }\n\u0060\u0060\u0060\n\nRESPONSE:\n${raw}`
}