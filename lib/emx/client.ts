import "server-only";

type EmxCallInput = {
  tag: string;
  payload?: Record<string, unknown>;
};

export async function emxCall({ tag, payload = {} }: EmxCallInput) {
  // TODO: replace with your real EMX logic
  return { ok: true, tag, payload, ts: Date.now() };
}

// If you prefer default export, switch imports accordingly:
// export default emxCall;
