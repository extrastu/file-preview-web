"use client"

import { useState } from "react"
import { Download, Info, Shield } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const FORMATS = [
  { label: "思维导图", value: "xmind · mm · opml" },
  { label: "文档", value: "pdf · doc/docx · md · txt · rtf" },
  { label: "演示", value: "ppt · pptx" },
  { label: "表格", value: "xls/xlsx · csv · tsv · ods" },
  { label: "代码", value: "js/ts · py · json · yaml · sql ..." },
  { label: "媒体", value: "png · svg · webp · mp3 · mp4 ..." },
]

const PRIVACY_POINTS = [
  {
    title: "纯本地解析",
    desc: "所有文件都在你的浏览器中直接解析与渲染，绝不会上传到任何服务器。",
  },
  {
    title: "无网络传输",
    desc: "解析过程完全离线进行，文件内容不经过网络，也不会被缓存到远端。",
  },
  {
    title: "不存储数据",
    desc: "关闭或刷新页面后，已加载的文件会立即从内存中清除，不留任何痕迹。",
  },
  {
    title: "无账号、无追踪",
    desc: "无需登录即可使用，我们不收集文件内容或任何可识别个人身份的信息。",
  },
]

export function InfoDialog() {
  const [tab, setTab] = useState<"about" | "privacy">("about")

  return (
    <Dialog>
      <DialogTrigger className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
        <Info className="size-4" />
        <span className="hidden sm:inline">关于</span>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>在线文件预览器</DialogTitle>
          <DialogDescription>
            在浏览器本地解析并预览多种格式文件，安全、私密、免安装。
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-1 rounded-lg bg-muted p-1">
          <button
            onClick={() => setTab("about")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              tab === "about"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Info className="size-3.5" />
            关于
          </button>
          <button
            onClick={() => setTab("privacy")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              tab === "privacy"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Shield className="size-3.5" />
            隐私说明
          </button>
        </div>

        {tab === "about" ? (
          <div className="space-y-4 text-sm">
            <p className="leading-relaxed text-muted-foreground">
              这是一个完全运行在浏览器中的文件预览工具。把文件拖进窗口，即可即时预览思维导图、文档、表格、代码、图片与音视频，无需上传、无需安装。
            </p>
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                支持的格式
              </h3>
              <ul className="space-y-2">
                {FORMATS.map((f) => (
                  <li key={f.label} className="flex items-baseline gap-3">
                    <span className="w-16 shrink-0 font-medium text-foreground">
                      {f.label}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {f.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3">
              <Download className="mt-0.5 size-4 shrink-0 text-primary" />
              <p className="text-xs leading-relaxed text-foreground">
                <span className="font-medium">添加到桌面使用：</span>
                可安装为 App，添加到主屏幕或桌面后支持离线打开、全屏运行，体验如同原生应用。桌面浏览器点击地址栏的安装图标，iPhone/iPad 通过分享菜单选择{'"添加到主屏幕"'}。
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3">
              <Shield className="mt-0.5 size-4 shrink-0 text-primary" />
              <p className="text-sm leading-relaxed text-foreground">
                你的文件永远不会离开这台设备。
              </p>
            </div>
            <ul className="space-y-3">
              {PRIVACY_POINTS.map((p) => (
                <li key={p.title}>
                  <p className="font-medium text-foreground">{p.title}</p>
                  <p className="mt-0.5 leading-relaxed text-muted-foreground">
                    {p.desc}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
