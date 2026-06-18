export type MindNode = {
  title: string
  note?: string
  children: MindNode[]
}

export type MindMap = {
  title: string
  root: MindNode
}

export type SheetData = {
  name: string
  rows: string[][]
}

export type SlideData = {
  index: number
  title?: string
  texts: string[]
}

export type ParseResult =
  | { kind: "text"; content: string }
  | { kind: "markdown"; content: string }
  | { kind: "html"; content: string }
  | { kind: "pdf"; data: ArrayBuffer }
  | { kind: "sheet"; sheets: SheetData[] }
  | { kind: "slides"; slides: SlideData[] }
  | { kind: "mindmap"; maps: MindMap[] }
  | { kind: "unsupported"; ext: string }

export type FileCategory =
  | "text"
  | "markdown"
  | "pdf"
  | "word"
  | "excel"
  | "ppt"
  | "mindmap"
  | "unknown"

const EXT_MAP: Record<string, FileCategory> = {
  txt: "text",
  log: "text",
  csv: "excel",
  md: "markdown",
  markdown: "markdown",
  mdx: "markdown",
  pdf: "pdf",
  doc: "word",
  docx: "word",
  xls: "excel",
  xlsx: "excel",
  ppt: "ppt",
  pptx: "ppt",
  xmind: "mindmap",
  mm: "mindmap",
}

export function getExtension(filename: string): string {
  const parts = filename.toLowerCase().split(".")
  return parts.length > 1 ? parts[parts.length - 1] : ""
}

export function getCategory(filename: string): FileCategory {
  const ext = getExtension(filename)
  return EXT_MAP[ext] ?? "unknown"
}

export const SUPPORTED_EXTENSIONS = Object.keys(EXT_MAP)
