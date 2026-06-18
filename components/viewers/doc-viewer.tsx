"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export function TextViewer({ content }: { content: string }) {
  return (
    <pre className="overflow-auto whitespace-pre-wrap rounded-lg border border-border bg-card p-4 font-mono text-sm leading-relaxed text-foreground">
      {content}
    </pre>
  )
}

export function MarkdownViewer({ content }: { content: string }) {
  return (
    <article className="prose-preview rounded-lg border border-border bg-card p-6">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </article>
  )
}

export function HtmlViewer({ content }: { content: string }) {
  return (
    <article
      className="prose-preview rounded-lg border border-border bg-card p-6"
      // Content comes from local file parsed by mammoth; rendered client-side.
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
