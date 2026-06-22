"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"
import { useLang } from "@/lib/i18n"

export function PdfViewer({ data }: { data: ArrayBuffer }) {
  const { t } = useLang()
  const containerRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [numPages, setNumPages] = useState(0)

  useEffect(() => {
    let cancelled = false
    const container = containerRef.current
    if (!container) return

    async function render() {
      try {
        setLoading(true)
        setError(null)
        const pdfjs = await import("pdfjs-dist")
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
          import.meta.url,
        ).toString()

        // Copy buffer because pdf.js transfers/detaches it.
        const doc = await pdfjs.getDocument({ data: data.slice(0) }).promise
        if (cancelled) return
        setNumPages(doc.numPages)
        container!.innerHTML = ""

        const scale = Math.min(
          2,
          Math.max(1, (container!.clientWidth - 32) / 600),
        )

        for (let i = 1; i <= doc.numPages; i++) {
          const page = await doc.getPage(i)
          if (cancelled) return
          const viewport = page.getViewport({ scale: scale * 1.5 })
          const canvas = document.createElement("canvas")
          const ctx = canvas.getContext("2d")!
          canvas.width = viewport.width
          canvas.height = viewport.height
          canvas.className =
            "mx-auto mb-4 w-full max-w-3xl rounded-md border border-border shadow-sm"
          canvas.style.height = "auto"
          container!.appendChild(canvas)
          await page.render({ canvas, canvasContext: ctx, viewport }).promise
        }
        if (!cancelled) setLoading(false)
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : t.pdf.failed)
          setLoading(false)
        }
      }
    }

    render()
    return () => {
      cancelled = true
    }
  }, [data, t])

  return (
    <div>
      {loading && (
        <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          {t.pdf.rendering}
        </div>
      )}
      {error && (
        <p className="py-8 text-center text-sm text-destructive">{error}</p>
      )}
      {!loading && !error && numPages > 0 && (
        <p className="mb-3 text-center text-xs text-muted-foreground">
          {t.pdf.pages(numPages)}
        </p>
      )}
      <div ref={containerRef} />
    </div>
  )
}
