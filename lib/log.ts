export function log(...args: any[]) {
if (process.env.NODE_ENV !== 'production') console.log('[EMX]', ...args)
}
export function warn(...args: any[]) {
console.warn('[EMX:WARN]', ...args)
}
export function error(...args: any[]) {
console.error('[EMX:ERR]', ...args)
}