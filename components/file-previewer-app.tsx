"use client"

import { useCallback, useRef, useState } from "react"
import Link from "next/link"
import {
  FileCode,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileType2,
  FileVideo,
  Info,
  Loader2,
  Music,
  Network,
  Presentation,
  ShieldCheck,
  Upload,
  X,
} from "lucide-react"
import { parseFile } from "@/lib/parse-file"
import { getExamples, type Example } from "@/lib/example-files"
import {
  getCategory,
  SUPPORTED_EXTENSIONS,
  type FileCategory,
  type ParseResult,
} from "@/lib/preview-types"
import { cn } from "@/lib/utils"
import { useLang, type Lang } from "@/lib/i18n"
import { FilePreview } from "@/components/file-preview"
import { InstallPrompt } from "@/components/install-prompt"
import { LanguageSwitcher } from "@/components/language-switcher"
import { GithubIcon } from "@/components/github-icon"

type Item = {
  id: string
  name: string
  size: number
  category: FileCategory
  status: "parsing" | "done" | "error"
  result?: ParseResult
  error?: string
}

const CATEGORY_META: Record<
  FileCategory,
  { icon: typeof FileText; color: string }
> = {
  text: { icon: FileText, color: "text-muted-foreground" },
  code: { icon: FileCode, color: "text-sky-600" },
  markdown: { icon: FileType2, color: "text-primary" },
  pdf: { icon: FileText, color: "text-destructive" },
  word: { icon: FileText, color: "text-primary" },
  excel: { icon: FileSpreadsheet, color: "text-emerald-600" },
  ppt: { icon: Presentation, color: "text-orange-600" },
  mindmap: { icon: Network, color: "text-primary" },
  image: { icon: FileImage, color: "text-pink-600" },
  audio: { icon: Music, color: "text-amber-600" },
  video: { icon: FileVideo, color: "text-indigo-600" },
  unknown: { icon: FileText, color: "text-muted-foreground" },
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export function FilePreviewerApp() {
  const { t, lang } = useLang()
  const [items, setItems] = useState<Item[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback(async (fileList: FileList | File[]) => {
    const files = Array.from(fileList)
    if (files.length === 0) return

    const newItems: Item[] = files.map((f) => ({
      id: `${f.name}-${f.size}-${Date.now()}-${Math.random()}`,
      name: f.name,
      size: f.size,
      category: getCategory(f.name),
      status: "parsing",
    }))

    setItems((prev) => [...prev, ...newItems])
    setActiveId(newItems[0].id)

    await Promise.all(
      files.map(async (file, i) => {
        const id = newItems[i].id
        try {
          const result = await parseFile(file)
          setItems((prev) =>
            prev.map((it) =>
              it.id === id ? { ...it, status: "done", result } : it,
            ),
          )
        } catch (e) {
          const code = e instanceof Error ? e.message : ""
          const error = t.errors[code] ?? t.preview.parseFailed
          setItems((prev) =>
            prev.map((it) =>
              it.id === id ? { ...it, status: "error", error } : it,
            ),
          )
        }
      }),
    )
  }, [t])

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files)
    },
    [handleFiles],
  )

  const removeItem = useCallback(
    (id: string) => {
      const target = items.find((it) => it.id === id)
      const res = target?.result
      if (
        res &&
        (res.kind === "image" || res.kind === "audio" || res.kind === "video")
      ) {
        URL.revokeObjectURL(res.url)
      }
      setItems((prev) => prev.filter((it) => it.id !== id))
      setActiveId((cur) => {
        if (cur !== id) return cur
        const rest = items.filter((it) => it.id !== id)
        return rest.length ? rest[rest.length - 1].id : null
      })
    },
    [items],
  )

  const active = items.find((it) => it.id === activeId) ?? null

  return (
    <div
      className="flex min-h-screen flex-col bg-background"
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={(e) => {
        if (e.currentTarget === e.target) setDragging(false)
      }}
      onDrop={onDrop}
    >
      <header className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <FileType2 className="size-4" />
          </div>
          <div>
            <h1 className="text-sm font-semibold leading-none text-foreground">
              {t.app.title}
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              {t.app.subtitle}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <LanguageSwitcher />
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Info className="size-4" />
            <span className="hidden sm:inline">{t.nav.about}</span>
          </Link>
          <a
            href="https://github.com/extrastu/file-preview-web"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.nav.github}
            title={t.nav.github}
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <GithubIcon className="size-4" />
            <span className="hidden sm:inline">{t.nav.github}</span>
          </a>
          <button
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Upload className="size-4" />
            <span className="hidden sm:inline">{t.nav.choose}</span>
          </button>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          accept={SUPPORTED_EXTENSIONS.map((e) => `.${e}`).join(",")}
          onChange={(e) => {
            if (e.target.files) handleFiles(e.target.files)
            e.target.value = ""
          }}
        />
      </header>

      <div className="flex flex-1 flex-col md:flex-row">
        {/* Sidebar */}
        {items.length > 0 && (
          <aside className="shrink-0 border-b border-border md:w-64 md:border-b-0 md:border-r">
            <div className="flex flex-col gap-1 p-2">
              {items.map((it) => {
                const Meta = CATEGORY_META[it.category]
                const Icon = Meta.icon
                return (
                  <button
                    key={it.id}
                    onClick={() => setActiveId(it.id)}
                    className={cn(
                      "group flex items-center gap-2 rounded-md px-2 py-2 text-left transition-colors",
                      it.id === activeId
                        ? "bg-muted"
                        : "hover:bg-muted/60",
                    )}
                  >
                    <Icon className={cn("size-4 shrink-0", Meta.color)} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-foreground">
                        {it.name}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {it.status === "parsing"
                          ? t.status.parsing
                          : it.status === "error"
                            ? t.status.failed
                            : `${t.categories[it.category]} · ${formatSize(it.size)}`}
                      </span>
                    </span>
                    {it.status === "parsing" && (
                      <Loader2 className="size-3.5 shrink-0 animate-spin text-muted-foreground" />
                    )}
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation()
                        removeItem(it.id)
                      }}
                      className="shrink-0 rounded p-0.5 text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
                    >
                      <X className="size-3.5" />
                    </span>
                  </button>
                )
              })}
            </div>
          </aside>
        )}

        {/* Main */}
        <main className="flex flex-1 flex-col">
          {!active && (
            <div className="flex flex-1 items-center justify-center p-6">
              <Dropzone
                t={t}
                lang={lang}
                onPick={() => inputRef.current?.click()}
                onExample={(ex) => handleFiles([ex.build()])}
              />
            </div>
          )}

          {active && (
            <div className="flex-1 overflow-auto p-4 sm:p-6">
              <div className="mx-auto max-w-4xl">
                <div className="mb-4 flex items-center gap-2">
                  <h2 className="text-balance text-base font-semibold text-foreground">
                    {active.name}
                  </h2>
                </div>

                {active.status === "parsing" && (
                  <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" />
                    {t.preview.parsing}
                  </div>
                )}
                {active.status === "error" && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                    {active.error}
                  </div>
                )}
                {active.status === "done" && active.result && (
                  <FilePreview result={active.result} />
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Global drag overlay */}
      {dragging && (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-primary/10 backdrop-blur-sm">
          <div className="rounded-xl border-2 border-dashed border-primary bg-card px-10 py-8 text-center shadow-lg">
            <Upload className="mx-auto size-8 text-primary" />
            <p className="mt-3 text-base font-medium text-foreground">
              {t.drop.overlay}
            </p>
          </div>
        </div>
      )}

      <InstallPrompt />
    </div>
  )
}

function Dropzone({
  t,
  lang,
  onPick,
  onExample,
}: {
  t: ReturnType<typeof useLang>["t"]
  lang: Lang
  onPick: () => void
  onExample: (ex: Example) => void
}) {
  const examples = getExamples(lang)
  return (
    <div className="w-full max-w-lg text-center">
      <button
        onClick={onPick}
        className="group flex w-full flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-border bg-card px-6 py-14 transition-colors hover:border-primary/60 hover:bg-muted/40"
      >
        <div className="flex size-14 items-center justify-center rounded-full bg-muted transition-colors group-hover:bg-primary/10">
          <Upload className="size-6 text-muted-foreground transition-colors group-hover:text-primary" />
        </div>
        <div>
          <p className="text-base font-medium text-foreground">
            {t.dropzone.title}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t.dropzone.subtitle}
          </p>
        </div>
      </button>

      <div className="mt-6 flex flex-wrap justify-center gap-1.5">
        {[
          "xmind",
          "mm",
          "opml",
          "md",
          "pdf",
          "docx",
          "pptx",
          "xlsx",
          "csv",
          "json",
          "ts",
          "py",
          "png",
          "svg",
          "mp3",
          "mp4",
        ].map((ext) => (
          <span
            key={ext}
            className="rounded-md bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground"
          >
            .{ext}
          </span>
        ))}
      </div>

      <div className="mt-8">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {t.examples.heading}
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {examples.map((ex) => {
            const Meta = CATEGORY_META[ex.category]
            const Icon = Meta.icon
            return (
              <button
                key={ex.id}
                onClick={() => onExample(ex)}
                className="flex flex-col items-center gap-2 rounded-lg border border-border bg-card px-3 py-4 transition-colors hover:border-primary/60 hover:bg-muted/40"
              >
                <Icon className={cn("size-5", Meta.color)} />
                <span className="text-sm font-medium text-foreground">
                  {ex.label}
                </span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {ex.fileName}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <ShieldCheck className="size-3.5 text-primary" />
        {t.privacyFooter}
      </p>
    </div>
  )
}
