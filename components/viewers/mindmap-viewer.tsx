"use client"

import { useState } from "react"
import { ChevronRight, FileText } from "lucide-react"
import type { MindMap, MindNode } from "@/lib/preview-types"
import { useLang } from "@/lib/i18n"
import { cn } from "@/lib/utils"

function Node({ node, depth }: { node: MindNode; depth: number }) {
  const hasChildren = node.children.length > 0
  const [open, setOpen] = useState(depth < 2)

  return (
    <div className="select-text">
      <div
        className={cn(
          "group flex items-start gap-1.5 rounded-md py-1 pr-2 transition-colors",
          hasChildren && "cursor-pointer hover:bg-muted",
        )}
        onClick={() => hasChildren && setOpen((o) => !o)}
        style={{ paddingLeft: depth === 0 ? 0 : 4 }}
      >
        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center">
          {hasChildren ? (
            <ChevronRight
              className={cn(
                "size-4 text-muted-foreground transition-transform",
                open && "rotate-90",
              )}
            />
          ) : (
            <span className="size-1.5 rounded-full bg-border" />
          )}
        </span>
        <div className="min-w-0">
          <span
            className={cn(
              "text-pretty leading-relaxed",
              depth === 0 && "text-base font-semibold text-foreground",
              depth === 1 && "font-medium text-foreground",
              depth >= 2 && "text-sm text-foreground/90",
            )}
          >
            {node.title}
          </span>
          {node.note && (
            <p className="mt-0.5 flex items-start gap-1 text-xs leading-relaxed text-muted-foreground">
              <FileText className="mt-0.5 size-3 shrink-0" />
              <span>{node.note}</span>
            </p>
          )}
        </div>
      </div>

      {hasChildren && open && (
        <div className="ml-2.5 border-l border-border pl-3">
          {node.children.map((child, i) => (
            <Node key={i} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export function MindmapViewer({ maps }: { maps: MindMap[] }) {
  const { t } = useLang()
  const [active, setActive] = useState(0)

  if (maps.length === 0) {
    return <p className="text-sm text-muted-foreground">{t.mindmap.empty}</p>
  }

  return (
    <div className="flex flex-col gap-4">
      {maps.length > 1 && (
        <div className="flex flex-wrap gap-1.5">
          {maps.map((m, i) => (
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
              {m.title}
            </button>
          ))}
        </div>
      )}
      <div className="rounded-lg border border-border bg-card p-4">
        <Node node={maps[active].root} depth={0} />
      </div>
    </div>
  )
}
