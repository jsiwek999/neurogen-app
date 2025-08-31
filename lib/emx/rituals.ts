export type RitualStep = { key: string; title: string; prompt?: string };
export type RitualTemplate = { key: string; name: string; steps: RitualStep[] };


export const RITUALS: RitualTemplate[] = [
{
key: 'two_minute_reset',
name: 'Two-Minute Reset',
steps: [
{ key: 'breath', title: '[breath] 4-4-6', prompt: 'Inhale 4, hold 4, exhale 6 — three rounds.' },
{ key: 'name', title: '[name] What am I feeling now?', prompt: 'One sentence. No fixing.' },
{ key: 'shift', title: '[shift] Tiny action', prompt: 'What is one 30-second action that improves this by 1%?' },
{ key: 'integration', title: '[integration] Lock it in', prompt: 'Anchor a word or gesture to this calmer state.' },
],
},
{
key: 'mirror_loop',
name: 'Mirror Loop',
steps: [
{ key: 'reflect', title: '[mirror] What do you see?', prompt: 'Describe your current loop in 2 lines.' },
{ key: 'disrupt', title: '[disrupt] Pattern break', prompt: 'Write a playful inversion of the loop.' },
{ key: 'install', title: '[install] New line', prompt: 'Write the line you’ll run instead.' },
],
},
];


export const getTemplate = (key: string) => RITUALS.find(r => r.key === key);