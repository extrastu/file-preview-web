import JSZip from "jszip"
import type { MindMap, MindNode } from "./preview-types"

// ---------- XMind ----------

// Newer XMind (content.json) structure
type XmindJsonTopic = {
  title?: string
  notes?: { plain?: { content?: string } }
  children?: { attached?: XmindJsonTopic[] }
}

type XmindJsonSheet = {
  title?: string
  rootTopic?: XmindJsonTopic
}

function fromJsonTopic(topic: XmindJsonTopic | undefined): MindNode {
  if (!topic) return { title: "(empty)", children: [] }
  const children = topic.children?.attached ?? []
  return {
    title: topic.title?.trim() || "(untitled)",
    note: topic.notes?.plain?.content?.trim() || undefined,
    children: children.map(fromJsonTopic),
  }
}

// Older XMind (content.xml) structure
function fromXmlTopic(topic: Element): MindNode {
  const titleEl = Array.from(topic.children).find(
    (c) => c.tagName === "title",
  )
  const title = titleEl?.textContent?.trim() || "(untitled)"

  const childrenContainer = Array.from(topic.children).find(
    (c) => c.tagName === "children",
  )

  let childTopics: Element[] = []
  if (childrenContainer) {
    const topicsEl = Array.from(childrenContainer.children).find(
      (c) => c.tagName === "topics",
    )
    if (topicsEl) {
      childTopics = Array.from(topicsEl.children).filter(
        (c) => c.tagName === "topic",
      )
    }
  }

  return {
    title,
    children: childTopics.map(fromXmlTopic),
  }
}

export async function parseXmind(data: ArrayBuffer): Promise<MindMap[]> {
  const zip = await JSZip.loadAsync(data)

  // Try modern JSON format first
  const jsonFile = zip.file("content.json")
  if (jsonFile) {
    const text = await jsonFile.async("string")
    const parsed = JSON.parse(text) as XmindJsonSheet[]
    const sheets = Array.isArray(parsed) ? parsed : [parsed]
    return sheets.map((sheet, i) => ({
      title: sheet.title?.trim() || `Sheet ${i + 1}`,
      root: fromJsonTopic(sheet.rootTopic),
    }))
  }

  // Fall back to legacy XML format
  const xmlFile = zip.file("content.xml")
  if (xmlFile) {
    const text = await xmlFile.async("string")
    const doc = new DOMParser().parseFromString(text, "text/xml")
    const sheets = Array.from(doc.getElementsByTagName("sheet"))
    if (sheets.length === 0) {
      const topic = doc.querySelector("topic")
      if (topic) {
        return [{ title: "Sheet 1", root: fromXmlTopic(topic) }]
      }
    }
    return sheets.map((sheet, i) => {
      const rootTopic = Array.from(sheet.children).find(
        (c) => c.tagName === "topic",
      )
      const titleAttr = sheet.getAttribute("title")
      return {
        title: titleAttr || `Sheet ${i + 1}`,
        root: rootTopic
          ? fromXmlTopic(rootTopic)
          : { title: "(empty)", children: [] },
      }
    })
  }

  throw new Error("ERR_XMIND")
}

// ---------- FreeMind / .mm ----------

function fromMmNode(node: Element): MindNode {
  const childNodes = Array.from(node.children).filter(
    (c) => c.tagName === "node",
  )
  // FreeMind can store rich text inside <richcontent>
  let title = node.getAttribute("TEXT") ?? ""
  if (!title) {
    const rich = Array.from(node.children).find(
      (c) => c.tagName.toLowerCase() === "richcontent",
    )
    title = rich?.textContent?.trim() ?? ""
  }
  return {
    title: title.trim() || "(untitled)",
    children: childNodes.map(fromMmNode),
  }
}

export async function parseFreeMind(text: string): Promise<MindMap[]> {
  const doc = new DOMParser().parseFromString(text, "text/xml")
  const map = doc.getElementsByTagName("map")[0]
  const rootNode = map
    ? Array.from(map.children).find((c) => c.tagName === "node")
    : doc.getElementsByTagName("node")[0]

  if (!rootNode) throw new Error("ERR_FREEMIND")

  const root = fromMmNode(rootNode)
  return [{ title: root.title, root }]
}

// ---------- OPML outline ----------

function fromOutline(el: Element): MindNode {
  const title =
    el.getAttribute("text") ?? el.getAttribute("title") ?? "(untitled)"
  const note = el.getAttribute("_note") ?? el.getAttribute("note") ?? undefined
  const children = Array.from(el.children).filter(
    (c) => c.tagName.toLowerCase() === "outline",
  )
  return {
    title: title.trim() || "(untitled)",
    note: note?.trim() || undefined,
    children: children.map(fromOutline),
  }
}

export function parseOpml(text: string): MindMap[] {
  const doc = new DOMParser().parseFromString(text, "text/xml")
  const body = doc.getElementsByTagName("body")[0]
  const headTitle = doc
    .getElementsByTagName("title")[0]
    ?.textContent?.trim()
  const topOutlines = body
    ? Array.from(body.children).filter(
        (c) => c.tagName.toLowerCase() === "outline",
      )
    : []

  if (topOutlines.length === 0) {
    throw new Error("ERR_OPML")
  }

  // Single root outline -> use it directly; multiple -> wrap under a title node.
  if (topOutlines.length === 1) {
    const root = fromOutline(topOutlines[0])
    return [{ title: headTitle || root.title, root }]
  }

  const root: MindNode = {
    title: headTitle || "OPML",
    children: topOutlines.map(fromOutline),
  }
  return [{ title: root.title, root }]
}
