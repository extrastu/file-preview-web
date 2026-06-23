import type { Lang } from "@/lib/i18n"

export type ChangelogEntry = {
  version: string
  date: string
  /** Localized change bullet points. */
  changes: Record<Lang, string[]>
}

/**
 * Release history, newest first. Each entry carries bilingual bullet points so
 * the changelog stays in sync with the app's language switcher.
 */
export const CHANGELOG: ChangelogEntry[] = [
  {
    version: "1.5.0",
    date: "2026-06-23",
    changes: {
      en: [
        "Added online preview: paste a URL to fetch and preview a remote file through a built-in proxy.",
        "Added preview support for YAML / yml files.",
      ],
      zh: [
        "新增在线预览：粘贴链接即可通过内置代理获取并预览远程文件。",
        "新增对 YAML / yml 文件的预览支持。",
      ],
    },
  },
  {
    version: "1.4.0",
    date: "2026-06-20",
    changes: {
      en: [
        "Added English / Chinese language switching, defaulting to English.",
        "Localized the entire interface, viewers and example documents.",
      ],
      zh: [
        "新增中英文语言切换，默认英文。",
        "对整个界面、预览器与示例文档进行了本地化。",
      ],
    },
  },
  {
    version: "1.3.0",
    date: "2026-06-17",
    changes: {
      en: [
        "Added a dedicated About & Privacy page for better SEO.",
        "Added a link to the PeekMD iOS app.",
        "Fixed garbled Chinese characters when previewing CSV files.",
      ],
      zh: [
        "新增独立的关于与隐私页面，优化 SEO。",
        "新增 PeekMD iOS App 下载链接。",
        "修复预览 CSV 文件时中文乱码的问题。",
      ],
    },
  },
  {
    version: "1.2.0",
    date: "2026-06-14",
    changes: {
      en: [
        "Added PWA support — install to the home screen and use offline.",
        "Added a privacy notice and an install prompt.",
        "Added clickable example documents for one-click preview.",
      ],
      zh: [
        "新增 PWA 支持，可添加到桌面并离线使用。",
        "新增隐私说明与安装提示。",
        "新增可点击的示例文档，一键进入预览。",
      ],
    },
  },
  {
    version: "1.1.0",
    date: "2026-06-11",
    changes: {
      en: [
        "Optimized SEO metadata and added a favicon.",
        "Expanded formats: code, images, audio, video and OPML.",
      ],
      zh: [
        "优化 SEO 元数据并新增站点图标。",
        "扩展格式支持：代码、图片、音频、视频与 OPML。",
      ],
    },
  },
  {
    version: "1.0.0",
    date: "2026-06-08",
    changes: {
      en: [
        "Initial release: drag-and-drop preview for xmind, mm, md, txt, pdf, word, ppt and excel.",
        "Mind maps render as an interactive collapsible node tree.",
      ],
      zh: [
        "首个版本发布：支持拖拽预览 xmind、mm、md、txt、pdf、word、ppt 和 excel。",
        "思维导图以可折叠的交互式节点树呈现。",
      ],
    },
  },
]
