import * as XLSX from "xlsx"
import { getCategory, getExtension, type ParseResult } from "./preview-types"
import { parseFreeMind, parseXmind } from "./parse-mindmap"
import { parsePptx } from "./parse-pptx"

export async function parseFile(file: File): Promise<ParseResult> {
  const ext = getExtension(file.name)
  const category = getCategory(file.name)

  switch (category) {
    case "text": {
      const content = await file.text()
      return { kind: "text", content }
    }

    case "markdown": {
      const content = await file.text()
      return { kind: "markdown", content }
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
      const data = await file.arrayBuffer()
      const wb = XLSX.read(data, { type: "array" })
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
      // .mm FreeMind
      const text = await file.text()
      const maps = await parseFreeMind(text)
      return { kind: "mindmap", maps }
    }

    default:
      return { kind: "unsupported", ext }
  }
}
