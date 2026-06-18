"use client"

import { useState } from "react"
import type { SheetData } from "@/lib/preview-types"
import { cn } from "@/lib/utils"

export function SheetViewer({ sheets }: { sheets: SheetData[] }) {
  const [active, setActive] = useState(0)

  if (sheets.length === 0) {
    return <p className="text-sm text-muted-foreground">空白表格</p>
  }

  const sheet = sheets[active]
  const maxCols = sheet.rows.reduce((m, r) => Math.max(m, r.length), 0)

  return (
    <div className="flex flex-col gap-4">
      {sheets.length > 1 && (
        <div className="flex flex-wrap gap-1.5">
          {sheets.map((s, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                "rounded-md px-3 py-1 text-sm transition-colors",
                i === active
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              {s.name}
            </button>
          ))}
        </div>
      )}

      <div className="overflow-auto rounded-lg border border-border">
        <table className="w-full border-collapse text-sm">
          <tbody>
            {sheet.rows.map((row, ri) => (
              <tr key={ri} className={ri === 0 ? "bg-muted font-medium" : ""}>
                <td className="sticky left-0 z-10 w-12 border border-border bg-muted px-2 py-1 text-center text-xs text-muted-foreground">
                  {ri + 1}
                </td>
                {Array.from({ length: maxCols }).map((_, ci) => (
                  <td
                    key={ci}
                    className="min-w-24 max-w-xs truncate border border-border px-3 py-1.5 text-foreground"
                    title={row[ci] ?? ""}
                  >
                    {row[ci] ?? ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
