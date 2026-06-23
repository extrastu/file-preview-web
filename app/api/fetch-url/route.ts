import { type NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

// Max remote file size we are willing to proxy (25 MB).
const MAX_BYTES = 25 * 1024 * 1024
const FETCH_TIMEOUT_MS = 15_000

// Basic SSRF guard: reject obvious internal / non-public hosts.
function isBlockedHost(hostname: string): boolean {
  const host = hostname.toLowerCase()
  if (
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host === "0.0.0.0" ||
    host === "::1" ||
    host.endsWith(".local") ||
    host.endsWith(".internal")
  ) {
    return true
  }
  // IPv4 private / loopback / link-local ranges.
  const m = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/)
  if (m) {
    const [a, b] = [Number(m[1]), Number(m[2])]
    if (a === 127 || a === 10 || a === 0) return true
    if (a === 169 && b === 254) return true // link-local
    if (a === 172 && b >= 16 && b <= 31) return true
    if (a === 192 && b === 168) return true
  }
  return false
}

function filenameFromUrl(url: URL, contentType: string | null): string {
  const last = url.pathname.split("/").filter(Boolean).pop() ?? ""
  const decoded = (() => {
    try {
      return decodeURIComponent(last)
    } catch {
      return last
    }
  })()
  if (decoded && decoded.includes(".")) return decoded

  // Fall back to a content-type derived extension.
  const ctExt: Record<string, string> = {
    "application/pdf": "pdf",
    "text/markdown": "md",
    "text/plain": "txt",
    "text/csv": "csv",
    "application/json": "json",
    "text/html": "html",
    "application/yaml": "yml",
    "text/yaml": "yml",
  }
  const base = (contentType ?? "").split(";")[0].trim().toLowerCase()
  const ext = ctExt[base]
  const name = decoded || "remote-file"
  return ext ? `${name}.${ext}` : name
}

export async function GET(req: NextRequest) {
  const target = req.nextUrl.searchParams.get("url")
  if (!target) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 })
  }

  let parsed: URL
  try {
    parsed = new URL(target)
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 })
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return NextResponse.json(
      { error: "Only http and https URLs are supported" },
      { status: 400 },
    )
  }

  if (isBlockedHost(parsed.hostname)) {
    return NextResponse.json(
      { error: "This host is not allowed" },
      { status: 403 },
    )
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

  let upstream: Response
  try {
    upstream = await fetch(parsed.toString(), {
      signal: controller.signal,
      redirect: "follow",
      headers: { "user-agent": "FilePreviewBot/1.0" },
    })
  } catch {
    clearTimeout(timeout)
    return NextResponse.json(
      { error: "Failed to fetch the remote file" },
      { status: 502 },
    )
  }
  clearTimeout(timeout)

  if (!upstream.ok) {
    return NextResponse.json(
      { error: `Remote server responded with ${upstream.status}` },
      { status: 502 },
    )
  }

  const declaredLength = Number(upstream.headers.get("content-length") ?? "0")
  if (declaredLength && declaredLength > MAX_BYTES) {
    return NextResponse.json(
      { error: "Remote file is too large (max 25 MB)" },
      { status: 413 },
    )
  }

  const buffer = await upstream.arrayBuffer()
  if (buffer.byteLength > MAX_BYTES) {
    return NextResponse.json(
      { error: "Remote file is too large (max 25 MB)" },
      { status: 413 },
    )
  }

  const contentType =
    upstream.headers.get("content-type") ?? "application/octet-stream"
  const filename = filenameFromUrl(parsed, contentType)

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "content-type": contentType,
      "x-filename": encodeURIComponent(filename),
      "cache-control": "no-store",
    },
  })
}
