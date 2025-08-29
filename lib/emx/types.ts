// lib/emx/types.ts
export type { EmxEvent, EmxMachine } from './schema';

export interface EmxResult {
  human: string;
  machine: import('./schema').EmxMachine;
}
