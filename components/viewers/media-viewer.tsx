"use client"

import { useLang } from "@/lib/i18n"

export function ImageViewer({ url, alt }: { url: string; alt: string }) {
  return (
    <div className="flex items-center justify-center rounded-lg border border-border bg-card p-4">
      {/* Local object URL from a user-provided file */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url || "/placeholder.svg"}
        alt={alt}
        className="max-h-[70vh] max-w-full rounded-md object-contain"
      />
    </div>
  )
}

export function AudioViewer({ url, mime }: { url: string; mime: string }) {
  const { t } = useLang()
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <audio controls className="w-full">
        <source src={url} type={mime} />
        {t.media.noAudio}
      </audio>
    </div>
  )
}

export function VideoViewer({ url, mime }: { url: string; mime: string }) {
  const { t } = useLang()
  return (
    <div className="flex justify-center rounded-lg border border-border bg-card p-4">
      <video controls className="max-h-[70vh] w-full rounded-md">
        <source src={url} type={mime} />
        {t.media.noVideo}
      </video>
    </div>
  )
}
