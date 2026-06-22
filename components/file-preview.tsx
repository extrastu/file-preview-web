"use client"

import type { ParseResult } from "@/lib/preview-types"
import { useLang } from "@/lib/i18n"
import { MindmapViewer } from "./viewers/mindmap-viewer"
import { PdfViewer } from "./viewers/pdf-viewer"
import { SheetViewer } from "./viewers/sheet-viewer"
import { SlidesViewer } from "./viewers/slides-viewer"
import { CodeViewer } from "./viewers/code-viewer"
import {
  AudioViewer,
  ImageViewer,
  VideoViewer,
} from "./viewers/media-viewer"
import {
  HtmlViewer,
  MarkdownViewer,
  TextViewer,
} from "./viewers/doc-viewer"

export function FilePreview({ result }: { result: ParseResult }) {
  const { t } = useLang()
  switch (result.kind) {
    case "text":
      return <TextViewer content={result.content} />
    case "code":
      return <CodeViewer content={result.content} language={result.language} />
    case "markdown":
      return <MarkdownViewer content={result.content} />
    case "html":
      return <HtmlViewer content={result.content} />
    case "pdf":
      return <PdfViewer data={result.data} />
    case "sheet":
      return <SheetViewer sheets={result.sheets} />
    case "slides":
      return <SlidesViewer slides={result.slides} />
    case "mindmap":
      return <MindmapViewer maps={result.maps} />
    case "image":
      return <ImageViewer url={result.url} alt={result.alt} />
    case "audio":
      return <AudioViewer url={result.url} mime={result.mime} />
    case "video":
      return <VideoViewer url={result.url} mime={result.mime} />
    case "unsupported":
      return (
        <p className="py-8 text-center text-sm text-muted-foreground">
          {t.preview.unsupported(result.ext)}
        </p>
      )
  }
}
