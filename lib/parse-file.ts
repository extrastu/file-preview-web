import * as XLSX from "xlsx"
import {
  getCategory,
  getCodeLanguage,
  getExtension,
  type ParseResult,
} from "./preview-types"
import { parseFreeMind, parseOpml, parseXmind } from "./parse-mindmap"
import { parsePptx } from "./parse-pptx"

// Strip RTF control words to recover readable plain text.
function stripRtf(rtf: string): string {
  if (!rtf.startsWith("{\\rtf")) return rtf
  return rtf
    .replace(/\\par[d]?/g, "\n")
    .replace(/\\'[0-9a-f]{2}/g, "")
    .replace(/\\[a-z]+-?\d* ?/g, "")
    .replace(/[{}]/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

export async function parseFile(file: File): Promise<ParseResult> {
  const ext = getExtension(file.name)
  const category = getCategory(file.name)

  switch (category) {
    case "text": {
      const content = await file.text()
      return { kind: "text", content: ext === "rtf" ? stripRtf(content) : content }
    }

    case "code": {
      const content = await file.text()
      return { kind: "code", content, language: getCodeLanguage(file.name) }
    }

    case "markdown": {
      const content = await file.text()
      return { kind: "markdown", content }
    }

    case "image": {
      const url = URL.createObjectURL(file)
      return { kind: "image", url, alt: file.name }
    }

    case "audio": {
      const url = URL.createObjectURL(file)
      return { kind: "audio", url, mime: file.type || `audio/${ext}` }
    }

    case "video": {
      const url = URL.createObjectURL(file)
      return { kind: "video", url, mime: file.type || `video/${ext}` }
    }

    case "pdf": {
      const data = await file.arrayBuffer()
      return { kind: "pdf", data }
    }

    case "word": {
      if (ext === "doc") {
        throw new Error(
          "暂不支持旧版 .doc 格式，请转换为 .docx 后重试。",
        )
      }
      const mammothMod = await import("mammoth")
      const mammoth = mammothMod.default ?? mammothMod
      const arrayBuffer = await file.arrayBuffer()
      const result = await mammoth.convertToHtml({ arrayBuffer })
      return { kind: "html", content: result.value }
    }

    case "excel": {
      // CSV/TSV are text formats: decode as UTF-8 text first so non-ASCII
      // characters (e.g. Chinese) aren't mangled by codepage auto-detection.
      const isText = ext === "csv" || ext === "tsv"
      const wb = isText
        ? XLSX.read(await file.text(), { type: "string" })
        : XLSX.read(await file.arrayBuffer(), { type: "array" })
      const sheets = wb.SheetNames.map((name) => {
        const ws = wb.Sheets[name]
        const rows = XLSX.utils.sheet_to_json<string[]>(ws, {
          header: 1,
          defval: "",
          raw: false,
        })
        return { name, rows: rows as string[][] }
      })
      return { kind: "sheet", sheets }
    }

    case "ppt": {
      if (ext === "ppt") {
        throw new Error(
          "暂不支持旧版 .ppt 格式，请转换为 .pptx 后重试。",
        )
      }
      const data = await file.arrayBuffer()
      const slides = await parsePptx(data)
      return { kind: "slides", slides }
    }

    case "mindmap": {
      if (ext === "xmind") {
        const data = await file.arrayBuffer()
        const maps = await parseXmind(data)
        return { kind: "mindmap", maps }
      }
      if (ext === "opml") {
        const text = await file.text()
        const maps = parseOpml(text)
        return { kind: "mindmap", maps }
      }
      // .mm FreeMind
      const text = await file.text()
      const maps = await parseFreeMind(text)
      return { kind: "mindmap", maps }
    }

    default:
      return { kind: "unsupported", ext }
  }
}
