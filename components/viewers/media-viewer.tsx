"use client"

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
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <audio controls className="w-full">
        <source src={url} type={mime} />
        您的浏览器不支持音频播放。
      </audio>
    </div>
  )
}

export function VideoViewer({ url, mime }: { url: string; mime: string }) {
  return (
    <div className="flex justify-center rounded-lg border border-border bg-card p-4">
      <video controls className="max-h-[70vh] w-full rounded-md">
        <source src={url} type={mime} />
        您的浏览器不支持视频播放。
      </video>
    </div>
  )
}
