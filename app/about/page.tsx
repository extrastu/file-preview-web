import type { Metadata } from "next"
import Link from "next/link"
import { Apple, ArrowLeft, Download, ExternalLink, Shield } from "lucide-react"

export const metadata: Metadata = {
  title: "关于与隐私说明",
  description:
    "了解在线文件预览器：一个完全运行在浏览器本地的文件预览工具，支持思维导图、文档、表格、代码、图片与音视频等多种格式。所有文件均在本地解析，绝不上传到服务器，安全私密。",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "关于与隐私说明 | 在线文件预览器",
    description:
      "完全运行在浏览器本地的文件预览工具，支持多种格式，文件不会上传到服务器。",
    url: "/about",
    type: "article",
  },
}

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

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-16">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        返回预览器
      </Link>

      <article className="mt-8">
        <header>
          <h1 className="text-balance text-2xl font-bold text-foreground sm:text-3xl">
            关于在线文件预览器
          </h1>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            这是一个完全运行在浏览器中的文件预览工具。把文件拖进窗口，即可即时预览思维导图、文档、表格、代码、图片与音视频，无需上传、无需安装。
          </p>
        </header>

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-foreground">支持的格式</h2>
          <ul className="mt-4 divide-y divide-border rounded-lg border border-border">
            {FORMATS.map((f) => (
              <li
                key={f.label}
                className="flex items-baseline gap-3 px-4 py-3"
              >
                <span className="w-16 shrink-0 text-sm font-medium text-foreground">
                  {f.label}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {f.value}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-foreground">
            添加到桌面使用
          </h2>
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 p-4">
            <Download className="mt-0.5 size-4 shrink-0 text-primary" />
            <p className="text-sm leading-relaxed text-foreground">
              可安装为 App，添加到主屏幕或桌面后支持离线打开、全屏运行，体验如同原生应用。桌面浏览器点击地址栏的安装图标，iPhone/iPad 通过分享菜单选择{'"添加到主屏幕"'}。
            </p>
          </div>
          <a
            href="https://apps.apple.com/cn/app/peekmd-markdown-html-%E6%9E%81%E9%80%9F%E9%A2%84%E8%A7%88%E5%99%A8/id6775353195"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/60 hover:bg-muted/40"
          >
            <Apple className="size-5 shrink-0 text-foreground" />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-foreground">
                下载 iOS App：PeekMD
              </span>
              <span className="block text-xs text-muted-foreground">
                Markdown / HTML 极速预览器，App Store 免费下载
              </span>
            </span>
            <ExternalLink className="size-4 shrink-0 text-muted-foreground" />
          </a>
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-foreground">隐私说明</h2>
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 p-4">
            <Shield className="mt-0.5 size-4 shrink-0 text-primary" />
            <p className="text-sm leading-relaxed text-foreground">
              你的文件永远不会离开这台设备。
            </p>
          </div>
          <ul className="mt-4 space-y-4">
            {PRIVACY_POINTS.map((p) => (
              <li key={p.title}>
                <h3 className="text-sm font-medium text-foreground">
                  {p.title}
                </h3>
                <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                  {p.desc}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </main>
  )
}
