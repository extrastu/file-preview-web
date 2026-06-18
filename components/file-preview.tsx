"use client"

import type { ParseResult } from "@/lib/preview-types"
import { MindmapViewer } from "./viewers/mindmap-viewer"
import { PdfViewer } from "./viewers/pdf-viewer"
import { SheetViewer } from "./viewers/sheet-viewer"
import { SlidesViewer } from "./viewers/slides-viewer"
import {
  HtmlViewer,
  MarkdownViewer,
  TextViewer,
} from "./viewers/doc-viewer"

export function FilePreview({ result }: { result: ParseResult }) {
  switch (result.kind) {
    case "text":
      return <TextViewer content={result.content} />
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
    case "unsupported":
      return (
        <p className="py-8 text-center text-sm text-muted-foreground">
          暂不支持预览 .{result.ext} 格式的文件
        </p>
      )
  }
}
