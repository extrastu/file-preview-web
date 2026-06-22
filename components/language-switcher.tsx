"use client"

import { Languages } from "lucide-react"
import { useLang } from "@/lib/i18n"

export function LanguageSwitcher() {
  const { lang, toggle } = useLang()

  return (
    <button
      onClick={toggle}
      aria-label={lang === "en" ? "切换到中文" : "Switch to English"}
      title={lang === "en" ? "切换到中文" : "Switch to English"}
      className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      <Languages className="size-4" />
      <span>{lang === "en" ? "中文" : "EN"}</span>
    </button>
  )
}
