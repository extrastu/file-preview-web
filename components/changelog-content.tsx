"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useLang } from "@/lib/i18n"
import { LanguageSwitcher } from "@/components/language-switcher"
import { CHANGELOG } from "@/lib/changelog"

export function ChangelogContent() {
  const { t, lang } = useLang()
  const c = t.changelog

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-16">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          {c.back}
        </Link>
        <LanguageSwitcher />
      </div>

      <article className="mt-8">
        <header>
          <h1 className="text-balance text-2xl font-bold text-foreground sm:text-3xl">
            {c.title}
          </h1>
          <p className="mt-3 leading-relaxed text-muted-foreground">{c.intro}</p>
        </header>

        <ol className="mt-10 space-y-10">
          {CHANGELOG.map((entry) => (
            <li
              key={entry.version}
              className="relative border-l border-border pl-6"
            >
              <span
                className="absolute -left-[5px] top-1.5 size-2.5 rounded-full bg-primary"
                aria-hidden="true"
              />
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h2 className="text-lg font-semibold text-foreground">
                  v{entry.version}
                </h2>
                <time className="font-mono text-xs text-muted-foreground">
                  {entry.date}
                </time>
              </div>
              <ul className="mt-3 space-y-2">
                {entry.changes[lang].map((change, i) => (
                  <li
                    key={i}
                    className="flex gap-2 text-sm leading-relaxed text-muted-foreground"
                  >
                    <span
                      className="mt-1.5 size-1.5 shrink-0 rounded-full bg-muted-foreground/50"
                      aria-hidden="true"
                    />
                    <span>{change}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </article>
    </main>
  )
}
