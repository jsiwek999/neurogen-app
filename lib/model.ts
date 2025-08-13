// lib/model.ts
export const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
export const isFixed = (m: string) => /(^o\d\b|reasoning)/i.test(m);
export const sampling = (m: string, t=0.7) => (isFixed(m) ? {} : { temperature: t });
