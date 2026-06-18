import JSZip from "jszip"
import type { SlideData } from "./preview-types"

function naturalSort(a: string, b: string): number {
  const na = Number.parseInt(a.replace(/\D/g, ""), 10)
  const nb = Number.parseInt(b.replace(/\D/g, ""), 10)
  return na - nb
}

// Extract text runs from a slide's XML, preserving paragraph breaks.
function extractTexts(xml: string): string[] {
  const doc = new DOMParser().parseFromString(xml, "text/xml")
  const paragraphs = Array.from(doc.getElementsByTagName("a:p"))
  const lines: string[] = []

  for (const p of paragraphs) {
    const runs = Array.from(p.getElementsByTagName("a:t"))
    const line = runs
      .map((r) => r.textContent ?? "")
      .join("")
      .trim()
    if (line) lines.push(line)
  }
  return lines
}

export async function parsePptx(data: ArrayBuffer): Promise<SlideData[]> {
  const zip = await JSZip.loadAsync(data)

  const slidePaths = Object.keys(zip.files)
    .filter((p) => /^ppt\/slides\/slide\d+\.xml$/.test(p))
    .sort(naturalSort)

  if (slidePaths.length === 0) {
    throw new Error("未找到幻灯片内容（仅支持 .pptx 格式）")
  }

  const slides: SlideData[] = []
  for (let i = 0; i < slidePaths.length; i++) {
    const file = zip.file(slidePaths[i])
    if (!file) continue
    const xml = await file.async("string")
    const texts = extractTexts(xml)
    slides.push({
      index: i + 1,
      title: texts[0],
      texts: texts.slice(1),
    })
  }

  return slides
}
