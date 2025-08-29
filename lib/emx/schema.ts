import { z } from 'zod'


export const EmxEventSchema = z.discriminatedUnion('type', [
z.object({ type: z.literal('breath'), inhale: z.number().int().nonnegative(), hold: z.number().int().nonnegative(), exhale: z.number().int().nonnegative(), cycles: z.number().int().positive().default(3) }),
z.object({ type: z.literal('state'), name: z.string().min(1) }),
z.object({ type: z.literal('mirror'), prompt: z.string().min(1) }),
z.object({ type: z.literal('journal'), prompt: z.string().min(1), min_lines: z.number().int().positive().default(3) }),
z.object({ type: z.literal('install'), belief: z.string().min(1), method: z.enum(['future-pace','anchoring','stacking']).optional() }),
z.object({ type: z.literal('disrupt'), action: z.string().min(1), duration_sec: z.number().int().positive().optional() }),
z.object({ type: z.literal('submodal'), params: z.record(z.union([z.string(), z.number()])) }),
z.object({ type: z.literal('identity'), name: z.string().min(1) }),
z.object({ type: z.literal('ritual'), name: z.string().min(1), phase: z.enum(['enter','exit','step']) }),
z.object({ type: z.literal('loop'), name: z.string().min(1) }),
z.object({ type: z.literal('integration'), note: z.string().optional() }),
])


export const EmxMachineSchema = z.object({
version: z.literal('1.1'),
events: z.array(EmxEventSchema),
})


export type EmxEvent = z.infer<typeof EmxEventSchema>
export type EmxMachine = z.infer<typeof EmxMachineSchema>