export function buildAuthRedirect(withNextFromCurrent = true) {
  if (typeof window === "undefined") return undefined;
  const origin = window.location.origin;
  let next = "/";

  if (withNextFromCurrent) {
    const url = new URL(window.location.href);
    next = url.searchParams.get("next") || (url.pathname + url.search);
  }
  return `${origin}/auth-check?next=${encodeURIComponent(next)}`;
}
