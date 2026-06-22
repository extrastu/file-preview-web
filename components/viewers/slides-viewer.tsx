"use client"

import type { SlideData } from "@/lib/preview-types"
import { useLang } from "@/lib/i18n"

export function SlidesViewer({ slides }: { slides: SlideData[] }) {
  const { t } = useLang()
  if (slides.length === 0) {
    return <p className="text-sm text-muted-foreground">{t.slides.empty}</p>
  }

  return (
    <div className="flex flex-col gap-5">
      {slides.map((slide) => (
        <div
          key={slide.index}
          className="overflow-hidden rounded-lg border border-border bg-card"
        >
          <div className="flex items-center justify-between border-b border-border bg-muted px-4 py-2">
            <span className="text-xs font-medium text-muted-foreground">
              {t.slides.slide(slide.index)}
            </span>
          </div>
          <div className="aspect-video p-6">
            {slide.title && (
              <h3 className="text-balance text-lg font-semibold text-foreground">
                {slide.title}
              </h3>
            )}
            <ul className="mt-3 flex flex-col gap-1.5">
              {slide.texts.map((t, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm leading-relaxed text-foreground/90"
                >
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span className="text-pretty">{t}</span>
                </li>
              ))}
            </ul>
            {!slide.title && slide.texts.length === 0 && (
              <p className="text-sm text-muted-foreground">{t.slides.noText}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
