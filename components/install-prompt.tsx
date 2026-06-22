"use client"

import { useCallback, useEffect, useState } from "react"
import { Download, Share, SquarePlus, X } from "lucide-react"
import { useLang } from "@/lib/i18n"

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

const DISMISS_KEY = "pwa-install-dismissed"

function isStandalone() {
  if (typeof window === "undefined") return false
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  )
}

function isIos() {
  if (typeof window === "undefined") return false
  const ua = window.navigator.userAgent.toLowerCase()
  const isIosDevice = /iphone|ipad|ipod/.test(ua)
  // iPadOS 13+ reports as Mac; detect via touch.
  const isIpadOs =
    navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1
  return isIosDevice || isIpadOs
}

export function InstallPrompt() {
  const { t } = useLang()
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)
  const [iosHelp, setIosHelp] = useState(false)

  useEffect(() => {
    if (isStandalone()) return
    if (
      typeof window !== "undefined" &&
      window.localStorage.getItem(DISMISS_KEY) === "1"
    ) {
      return
    }

    const onBeforeInstall = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
      setVisible(true)
    }
    window.addEventListener("beforeinstallprompt", onBeforeInstall)

    const onInstalled = () => {
      setVisible(false)
      setDeferred(null)
    }
    window.addEventListener("appinstalled", onInstalled)

    // iOS has no beforeinstallprompt — show manual hint after a short delay.
    let iosTimer: ReturnType<typeof setTimeout> | undefined
    if (isIos()) {
      iosTimer = setTimeout(() => {
        setIosHelp(true)
        setVisible(true)
      }, 1500)
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall)
      window.removeEventListener("appinstalled", onInstalled)
      if (iosTimer) clearTimeout(iosTimer)
    }
  }, [])

  const dismiss = useCallback(() => {
    setVisible(false)
    try {
      window.localStorage.setItem(DISMISS_KEY, "1")
    } catch {
      // Ignore storage errors (private mode etc.)
    }
  }, [])

  const install = useCallback(async () => {
    if (!deferred) return
    await deferred.prompt()
    const choice = await deferred.userChoice
    if (choice.outcome === "accepted" || choice.outcome === "dismissed") {
      setVisible(false)
      setDeferred(null)
    }
  }, [deferred])

  if (!visible) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:bottom-4 sm:left-auto sm:right-4 sm:px-0">
      <div className="mx-auto flex max-w-md items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-lg">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Download className="size-5 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">{t.install.title}</p>
          {iosHelp ? (
            <p className="mt-1 flex flex-wrap items-center gap-1 text-xs leading-relaxed text-muted-foreground">
              {t.install.iosA}
              <Share className="inline size-3.5 text-primary" />
              {t.install.iosB}
              <SquarePlus className="inline size-3.5 text-primary" />
              {t.install.iosC}
            </p>
          ) : (
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {t.install.desc}
            </p>
          )}
          {!iosHelp && (
            <button
              onClick={install}
              className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Download className="size-3.5" />
              {t.install.now}
            </button>
          )}
        </div>
        <button
          onClick={dismiss}
          aria-label={t.install.close}
          className="shrink-0 rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  )
}
