// utils/parseEMXTags.tsx

export interface ParsedEMXBlock {
  type: string;   // e.g. 'shift', 'breath', etc.
  content: string;
}

export function parseEMXTags(message: string): ParsedEMXBlock[] {
  const tagRegex = /\[(\w+)\]\s*(.*?)(?=(?:\[\w+\])|$)/gs;
  const blocks: ParsedEMXBlock[] = [];

  let match;
  while ((match = tagRegex.exec(message)) !== null) {
    const [, type, content] = match;
    blocks.push({ type: type.toLowerCase(), content: content.trim() });
  }

  return blocks;
}
