"use client"

import { useLang } from "@/lib/i18n"

export function CodeViewer({
  content,
  language,
}: {
  content: string
  language: string
}) {
  const { t } = useLang()
  const lines = content.replace(/\n$/, "").split("\n")

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-2">
        <span className="font-mono text-xs font-medium text-muted-foreground">
          {language}
        </span>
        <span className="text-xs text-muted-foreground">
          {t.code.lines(lines.length)}
        </span>
      </div>
      <div className="overflow-auto">
        <table className="w-full border-collapse font-mono text-sm leading-relaxed">
          <tbody>
            {lines.map((line, i) => (
              <tr key={i} className="hover:bg-muted/40">
                <td className="select-none border-r border-border px-3 py-0 text-right align-top text-xs text-muted-foreground">
                  {i + 1}
                </td>
                <td className="whitespace-pre px-4 py-0 text-foreground">
                  {line || " "}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
