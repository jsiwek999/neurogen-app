// lib/url.ts
export function canonicalBaseFromReq(req: Request) {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : new URL(req.url).origin)
  );
}
export function sameOriginUrl(req: Request, pathAndQuery: string) {
  return new URL(pathAndQuery, req.url); // absolute, same-origin
}
