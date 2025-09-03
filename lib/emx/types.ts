export type EmxTagName =
  | "shift" | "breath" | "mirror" | "journal" | "submodal" | "install" | "disrupt";

export interface EmxTag { name: EmxTagName; attrs?: Record<string,string>; content?: string; }

export type EmxNode =
  | { type: "text"; value: string }
  | { type: "tag"; tag: EmxTag; children: EmxNode[] };

export interface EmxDocument { nodes: EmxNode[] }
