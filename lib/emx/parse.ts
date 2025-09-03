import type { EmxDocument, EmxNode, EmxTagName } from "./types";

const TAGS = new Set<EmxTagName>([
  "shift","breath","mirror","journal","submodal","install","disrupt"
]);

export function parseEmx(src: string): EmxDocument {
  const nodes: EmxNode[] = [];
  const re = /\[(\w+)([^\]]*)\](?:([\s\S]*?)\[\/\1\])?/g;
  let last = 0; let m: RegExpExecArray | null;

  while ((m = re.exec(src))) {
    if (m.index > last) nodes.push({ type: "text", value: src.slice(last, m.index) });

    const name = m[1].toLowerCase() as EmxTagName;
    if (!TAGS.has(name)) { nodes.push({ type: "text", value: m[0] }); last = re.lastIndex; continue; }

    const attrs: Record<string,string> = {};
    m[2]?.trim().replace(/(\w+)="([^"]*)"/g, (_, k, v) => (attrs[k]=v, "")); // naive attr parse

    const inner = m[3];
    if (inner != null) {
      nodes.push({ type: "tag", tag: { name, attrs }, children: [{ type:"text", value: inner }] });
    } else {
      nodes.push({ type: "tag", tag: { name, attrs }, children: [] });
    }
    last = re.lastIndex;
  }
  if (last < src.length) nodes.push({ type: "text", value: src.slice(last) });
  return { nodes };
}

function textOf(nodes: EmxNode[]): string {
  return nodes.map(n => n.type === "text" ? n.value : textOf(n.children)).join("").trim();
}

export type EmxHint = { tag: EmxTagName; text: string; attrs?: Record<string,string> };

export function parseAuthoringToHints(src: string): EmxHint[] {
  const doc = parseEmx(src);
  const hints: EmxHint[] = [];
  const walk = (ns: EmxNode[]) => {
    for (const n of ns) {
      if (n.type === "tag") {
        hints.push({ tag: n.tag.name, text: textOf(n.children), attrs: n.tag.attrs ?? {} });
        if (n.children.length) walk(n.children);
      }
    }
  };
  walk(doc.nodes);
  return hints;
}

export function buildDirectiveFooter(hints: EmxHint[]): string {
  if (!hints?.length) return "";
  const lines = hints.map(h => {
    const atts = h.attrs && Object.keys(h.attrs).length
      ? " " + Object.entries(h.attrs).map(([k,v]) => `${k}="${v}"`).join(" ")
      : "";
    const txt = h.text ? `: ${h.text}` : "";
    return `- [${h.tag}]${atts}${txt}`;
  });
  return `\n\n[EMX Directives]\n${lines.join("\n")}`;
}
