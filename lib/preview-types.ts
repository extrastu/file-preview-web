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
  | { kind: "code"; content: string; language: string }
  | { kind: "markdown"; content: string }
  | { kind: "html"; content: string }
  | { kind: "pdf"; data: ArrayBuffer }
  | { kind: "sheet"; sheets: SheetData[] }
  | { kind: "slides"; slides: SlideData[] }
  | { kind: "mindmap"; maps: MindMap[] }
  | { kind: "image"; url: string; alt: string }
  | { kind: "audio"; url: string; mime: string }
  | { kind: "video"; url: string; mime: string }
  | { kind: "unsupported"; ext: string }

export type FileCategory =
  | "text"
  | "code"
  | "markdown"
  | "pdf"
  | "word"
  | "excel"
  | "ppt"
  | "mindmap"
  | "image"
  | "audio"
  | "video"
  | "unknown"

const EXT_MAP: Record<string, FileCategory> = {
  // Plain text
  txt: "text",
  log: "text",
  text: "text",
  rtf: "text",
  // Markdown
  md: "markdown",
  markdown: "markdown",
  mdx: "markdown",
  // Code / structured text
  json: "code",
  json5: "code",
  jsonc: "code",
  xml: "code",
  yaml: "code",
  yml: "code",
  toml: "code",
  ini: "code",
  env: "code",
  properties: "code",
  conf: "code",
  html: "code",
  htm: "code",
  css: "code",
  scss: "code",
  sass: "code",
  less: "code",
  js: "code",
  mjs: "code",
  cjs: "code",
  jsx: "code",
  ts: "code",
  tsx: "code",
  vue: "code",
  svelte: "code",
  py: "code",
  rb: "code",
  php: "code",
  java: "code",
  kt: "code",
  swift: "code",
  c: "code",
  h: "code",
  cpp: "code",
  cc: "code",
  hpp: "code",
  cs: "code",
  go: "code",
  rs: "code",
  dart: "code",
  lua: "code",
  r: "code",
  pl: "code",
  scala: "code",
  sh: "code",
  bash: "code",
  zsh: "code",
  sql: "code",
  graphql: "code",
  gql: "code",
  dockerfile: "code",
  makefile: "code",
  gradle: "code",
  // PDF
  pdf: "pdf",
  // Word
  doc: "word",
  docx: "word",
  // Spreadsheet
  csv: "excel",
  tsv: "excel",
  xls: "excel",
  xlsx: "excel",
  xlsm: "excel",
  ods: "excel",
  // Presentation
  ppt: "ppt",
  pptx: "ppt",
  // Mindmap / outline
  xmind: "mindmap",
  mm: "mindmap",
  opml: "mindmap",
  // Image
  png: "image",
  jpg: "image",
  jpeg: "image",
  gif: "image",
  webp: "image",
  svg: "image",
  bmp: "image",
  avif: "image",
  ico: "image",
  // Audio
  mp3: "audio",
  wav: "audio",
  ogg: "audio",
  oga: "audio",
  m4a: "audio",
  aac: "audio",
  flac: "audio",
  // Video
  mp4: "video",
  webm: "video",
  mov: "video",
  m4v: "video",
  ogv: "video",
}

// Map of file extension to a syntax language label (display only).
const CODE_LANGUAGE: Record<string, string> = {
  json: "JSON",
  json5: "JSON5",
  jsonc: "JSONC",
  xml: "XML",
  yaml: "YAML",
  yml: "YAML",
  toml: "TOML",
  ini: "INI",
  env: "Dotenv",
  properties: "Properties",
  conf: "Config",
  html: "HTML",
  htm: "HTML",
  css: "CSS",
  scss: "SCSS",
  sass: "Sass",
  less: "Less",
  js: "JavaScript",
  mjs: "JavaScript",
  cjs: "JavaScript",
  jsx: "JSX",
  ts: "TypeScript",
  tsx: "TSX",
  vue: "Vue",
  svelte: "Svelte",
  py: "Python",
  rb: "Ruby",
  php: "PHP",
  java: "Java",
  kt: "Kotlin",
  swift: "Swift",
  c: "C",
  h: "C",
  cpp: "C++",
  cc: "C++",
  hpp: "C++",
  cs: "C#",
  go: "Go",
  rs: "Rust",
  dart: "Dart",
  lua: "Lua",
  r: "R",
  pl: "Perl",
  scala: "Scala",
  sh: "Shell",
  bash: "Bash",
  zsh: "Zsh",
  sql: "SQL",
  graphql: "GraphQL",
  gql: "GraphQL",
  dockerfile: "Dockerfile",
  makefile: "Makefile",
  gradle: "Gradle",
}

export function getExtension(filename: string): string {
  const parts = filename.toLowerCase().split(".")
  return parts.length > 1 ? parts[parts.length - 1] : ""
}

export function getCategory(filename: string): FileCategory {
  const ext = getExtension(filename)
  return EXT_MAP[ext] ?? "unknown"
}

export function getCodeLanguage(filename: string): string {
  const ext = getExtension(filename)
  return CODE_LANGUAGE[ext] ?? "Text"
}

export const SUPPORTED_EXTENSIONS = Object.keys(EXT_MAP)
