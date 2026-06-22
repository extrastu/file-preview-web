"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

export type Lang = "en" | "zh"

const STORAGE_KEY = "app-lang"

type Dict = {
  categories: Record<string, string>
  app: { title: string; subtitle: string }
  nav: { about: string; choose: string; github: string }
  status: { parsing: string; failed: string }
  preview: { parsing: string; parseFailed: string; unsupported: (ext: string) => string }
  errors: Record<string, string>
  drop: { overlay: string }
  dropzone: { title: string; subtitle: string }
  examples: { heading: string }
  privacyFooter: string
  mindmap: { empty: string }
  pdf: { failed: string; rendering: string; pages: (n: number) => string }
  sheet: { empty: string }
  slides: { empty: string; slide: (n: number) => string; noText: string }
  code: { lines: (n: number) => string }
  media: { noAudio: string; noVideo: string }
  install: {
    title: string
    desc: string
    now: string
    close: string
    iosA: string
    iosB: string
    iosC: string
  }
  langName: string
  about: {
    back: string
    title: string
    intro: string
    formatsHeading: string
    formats: { label: string; value: string }[]
    installHeading: string
    installDesc: string
    iosAppTitle: string
    iosAppDesc: string
    privacyHeading: string
    privacyLead: string
    privacyPoints: { title: string; desc: string }[]
    openSourceHeading: string
    openSourceDesc: string
    openSourceCta: string
  }
}

const en: Dict = {
  categories: {
    text: "Text",
    code: "Code",
    markdown: "Markdown",
    pdf: "PDF",
    word: "Word",
    excel: "Spreadsheet",
    ppt: "Slides",
    mindmap: "Mind Map",
    image: "Image",
    audio: "Audio",
    video: "Video",
    unknown: "Unknown",
  },
  app: {
    title: "File Previewer",
    subtitle: "Parsed locally, never uploaded",
  },
  nav: { about: "About", choose: "Choose File", github: "GitHub" },
  status: { parsing: "Parsing...", failed: "Failed" },
  preview: {
    parsing: "Parsing file...",
    parseFailed: "Failed to parse file",
    unsupported: (ext) => `Preview is not supported for .${ext} files`,
  },
  errors: {
    ERR_XMIND: "Unrecognized XMind file structure",
    ERR_FREEMIND: "Unrecognized FreeMind file structure",
    ERR_OPML: "Unrecognized OPML file structure",
    ERR_PPTX: "No slide content found (.pptx only)",
    ERR_DOC: "Legacy .doc is not supported; please convert to .docx and try again.",
    ERR_PPT: "Legacy .ppt is not supported; please convert to .pptx and try again.",
  },
  drop: { overlay: "Drop to preview" },
  dropzone: {
    title: "Drag files here, or click to select",
    subtitle:
      "Supports mind maps, documents, spreadsheets, code, images, audio/video and more",
  },
  examples: { heading: "No file? Try these examples" },
  privacyFooter:
    "All files are parsed locally in your browser and never uploaded to any server",
  mindmap: { empty: "Empty mind map" },
  pdf: {
    failed: "Failed to parse PDF",
    rendering: "Rendering PDF...",
    pages: (n) => `${n} page${n > 1 ? "s" : ""}`,
  },
  sheet: { empty: "Empty spreadsheet" },
  slides: {
    empty: "No slide content found",
    slide: (n) => `Slide ${n}`,
    noText: "(No text content on this slide)",
  },
  code: { lines: (n) => `${n} line${n > 1 ? "s" : ""}` },
  media: {
    noAudio: "Your browser does not support audio playback.",
    noVideo: "Your browser does not support video playback.",
  },
  install: {
    title: "Add to Home Screen",
    desc: "Install to use offline like a native app — faster launch, full screen, no distractions.",
    now: "Install now",
    close: "Close install prompt",
    iosA: "Tap the browser's",
    iosB: "Share button, then choose",
    iosC: '"Add to Home Screen"',
  },
  langName: "English",
  about: {
    back: "Back to previewer",
    title: "About the Online File Previewer",
    intro:
      "A file preview tool that runs entirely in your browser. Drag a file into the window to instantly preview mind maps, documents, spreadsheets, code, images, audio and video — no upload, no install required.",
    formatsHeading: "Supported formats",
    formats: [
      { label: "Mind maps", value: "xmind · mm · opml" },
      { label: "Documents", value: "pdf · doc/docx · md · txt · rtf" },
      { label: "Slides", value: "ppt · pptx" },
      { label: "Spreadsheets", value: "xls/xlsx · csv · tsv · ods" },
      { label: "Code", value: "js/ts · py · json · yaml · sql ..." },
      { label: "Media", value: "png · svg · webp · mp3 · mp4 ..." },
    ],
    installHeading: "Add to Home Screen",
    installDesc:
      "Install as an app to open offline and run full screen, just like a native app. On desktop, click the install icon in the address bar; on iPhone/iPad, use the Share menu and choose \"Add to Home Screen\".",
    iosAppTitle: "Download the iOS App: PeekMD",
    iosAppDesc: "Markdown / HTML lightning-fast previewer, free on the App Store",
    privacyHeading: "Privacy",
    privacyLead: "Your files never leave this device.",
    privacyPoints: [
      {
        title: "Local-only parsing",
        desc: "Every file is parsed and rendered directly in your browser and is never uploaded to any server.",
      },
      {
        title: "No network transfer",
        desc: "Parsing happens fully offline. File contents never travel over the network and are never cached remotely.",
      },
      {
        title: "No data storage",
        desc: "Closing or refreshing the page immediately clears loaded files from memory, leaving no trace.",
      },
      {
        title: "No accounts, no tracking",
        desc: "No login required. We do not collect file contents or any personally identifiable information.",
      },
    ],
    openSourceHeading: "Open source",
    openSourceDesc:
      "This project is fully open source. Browse the code, file issues, or contribute on GitHub.",
    openSourceCta: "View on GitHub",
  },
}

const zh: Dict = {
  categories: {
    text: "文本",
    code: "代码",
    markdown: "Markdown",
    pdf: "PDF",
    word: "Word",
    excel: "表格",
    ppt: "幻灯片",
    mindmap: "思维导图",
    image: "图片",
    audio: "音频",
    video: "视频",
    unknown: "未知",
  },
  app: {
    title: "文件预览器",
    subtitle: "本地解析，文件不会上传",
  },
  nav: { about: "关于", choose: "选择文件", github: "开源" },
  status: { parsing: "解析中...", failed: "解析失败" },
  preview: {
    parsing: "正在解析文件...",
    parseFailed: "解析失败",
    unsupported: (ext) => `暂不支持预览 .${ext} 格式的文件`,
  },
  errors: {
    ERR_XMIND: "无法识别的 XMind 文件结构",
    ERR_FREEMIND: "无法识别的 FreeMind 文件结构",
    ERR_OPML: "无法识别的 OPML 文件结构",
    ERR_PPTX: "未找到幻灯片内容（仅支持 .pptx 格式）",
    ERR_DOC: "暂不支持旧版 .doc 格式，请转换为 .docx 后重试。",
    ERR_PPT: "暂不支持旧版 .ppt 格式，请转换为 .pptx 后重试。",
  },
  drop: { overlay: "松开鼠标即可解析文件" },
  dropzone: {
    title: "拖入文件到此处，或点击选择",
    subtitle: "支持思维导图、文档、表格、代码、图片、音视频等多种格式",
  },
  examples: { heading: "没有文件？试试这些示例" },
  privacyFooter: "所有文件均在本地浏览器解析，绝不上传到服务器",
  mindmap: { empty: "空白思维导图" },
  pdf: {
    failed: "PDF 解析失败",
    rendering: "正在渲染 PDF...",
    pages: (n) => `共 ${n} 页`,
  },
  sheet: { empty: "空白表格" },
  slides: {
    empty: "未找到幻灯片内容",
    slide: (n) => `幻灯片 ${n}`,
    noText: "（此页无文本内容）",
  },
  code: { lines: (n) => `${n} 行` },
  media: {
    noAudio: "您的浏览器不支持音频播放。",
    noVideo: "您的浏览器不支持视频播放。",
  },
  install: {
    title: "添加到桌面使用",
    desc: "安装后可像原生应用一样离线使用，启动更快、全屏无干扰。",
    now: "立即安装",
    close: "关闭安装提示",
    iosA: "点击浏览器的",
    iosB: "分享按钮，选择",
    iosC: '"添加到主屏幕"',
  },
  langName: "中文",
  about: {
    back: "返回预览器",
    title: "关于在线文件预览器",
    intro:
      "这是一个完全运行在浏览器中的文件预览工具。把文件拖进窗口，即可即时预览思维导图、文档、表格、代码、图片与音视频，无需上传、无需安装。",
    formatsHeading: "支持的格式",
    formats: [
      { label: "思维导图", value: "xmind · mm · opml" },
      { label: "文档", value: "pdf · doc/docx · md · txt · rtf" },
      { label: "演示", value: "ppt · pptx" },
      { label: "表格", value: "xls/xlsx · csv · tsv · ods" },
      { label: "代码", value: "js/ts · py · json · yaml · sql ..." },
      { label: "媒体", value: "png · svg · webp · mp3 · mp4 ..." },
    ],
    installHeading: "添加到桌面使用",
    installDesc:
      '可安装为 App，添加到主屏幕或桌面后支持离线打开、全屏运行，体验如同原生应用。桌面浏览器点击地址栏的安装图标，iPhone/iPad 通过分享菜单选择"添加到主屏幕"。',
    iosAppTitle: "下载 iOS App：PeekMD",
    iosAppDesc: "Markdown / HTML 极速预览器，App Store 免费下载",
    privacyHeading: "隐私说明",
    privacyLead: "你的文件永远不会离开这台设备。",
    privacyPoints: [
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
    ],
    openSourceHeading: "开源",
    openSourceDesc:
      "本项目完全开源，欢迎在 GitHub 上浏览代码、提交问题或参与贡献。",
    openSourceCta: "在 GitHub 查看",
  },
}

const DICTS: Record<Lang, Dict> = { en, zh }

type LangContextValue = {
  lang: Lang
  setLang: (l: Lang) => void
  toggle: () => void
  t: Dict
}

const LangContext = createContext<LangContextValue>({
  lang: "en",
  setLang: () => {},
  toggle: () => {},
  t: en,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Always start at "en" so server and first client render match (no hydration
  // mismatch); read the stored preference after mount.
  const [lang, setLangState] = useState<Lang>("en")

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY) as Lang | null
      if (stored === "en" || stored === "zh") {
        setLangState(stored)
      }
    } catch {
      // Ignore storage access errors (private mode, etc.)
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en"
  }, [lang])

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    try {
      window.localStorage.setItem(STORAGE_KEY, l)
    } catch {
      // Ignore storage errors
    }
  }, [])

  const toggle = useCallback(() => {
    setLangState((cur) => {
      const next: Lang = cur === "en" ? "zh" : "en"
      try {
        window.localStorage.setItem(STORAGE_KEY, next)
      } catch {
        // Ignore storage errors
      }
      return next
    })
  }, [])

  const value = useMemo(
    () => ({ lang, setLang, toggle, t: DICTS[lang] }),
    [lang, setLang, toggle],
  )

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  return useContext(LangContext)
}
