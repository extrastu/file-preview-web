"use client"

import Link from "next/link"
import { Apple, ArrowLeft, Download, ExternalLink, Shield } from "lucide-react"
import { useLang } from "@/lib/i18n"
import { LanguageSwitcher } from "@/components/language-switcher"

export function AboutContent() {
  const { t } = useLang()
  const a = t.about

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-16">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          {a.back}
        </Link>
        <LanguageSwitcher />
      </div>

      <article className="mt-8">
        <header>
          <h1 className="text-balance text-2xl font-bold text-foreground sm:text-3xl">
            {a.title}
          </h1>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            {a.intro}
          </p>
        </header>

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-foreground">
            {a.formatsHeading}
          </h2>
          <ul className="mt-4 divide-y divide-border rounded-lg border border-border">
            {a.formats.map((f) => (
              <li key={f.label} className="flex items-baseline gap-3 px-4 py-3">
                <span className="w-24 shrink-0 text-sm font-medium text-foreground">
                  {f.label}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {f.value}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-foreground">
            {a.installHeading}
          </h2>
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 p-4">
            <Download className="mt-0.5 size-4 shrink-0 text-primary" />
            <p className="text-sm leading-relaxed text-foreground">
              {a.installDesc}
            </p>
          </div>
          <a
            href="https://apps.apple.com/cn/app/peekmd-markdown-html-%E6%9E%81%E9%80%9F%E9%A2%84%E8%A7%88%E5%99%A8/id6775353195"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/60 hover:bg-muted/40"
          >
            <Apple className="size-5 shrink-0 text-foreground" />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-foreground">
                {a.iosAppTitle}
              </span>
              <span className="block text-xs text-muted-foreground">
                {a.iosAppDesc}
              </span>
            </span>
            <ExternalLink className="size-4 shrink-0 text-muted-foreground" />
          </a>
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-foreground">
            {a.privacyHeading}
          </h2>
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 p-4">
            <Shield className="mt-0.5 size-4 shrink-0 text-primary" />
            <p className="text-sm leading-relaxed text-foreground">
              {a.privacyLead}
            </p>
          </div>
          <ul className="mt-4 space-y-4">
            {a.privacyPoints.map((p) => (
              <li key={p.title}>
                <h3 className="text-sm font-medium text-foreground">
                  {p.title}
                </h3>
                <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                  {p.desc}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </main>
  )
}
