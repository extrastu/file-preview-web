// In-code sample documents. Each builder returns a real File object so it
// flows through the exact same parsing pipeline as user-provided files.

import type { Lang } from "@/lib/i18n"

export type Example = {
  id: string
  label: string
  fileName: string
  category: "markdown" | "excel" | "mindmap" | "code"
  build: () => File
}

function textFile(name: string, content: string, type: string): File {
  return new File([content], name, { type })
}

// ---------- English samples ----------

const MARKDOWN_EN = `# Online File Previewer

A **100% local** multi-format file preview tool. Files are never uploaded to a server.

## Highlights

- Supports 60+ file formats
- Drag and drop to preview, no upload
- Installable as a PWA for offline use

## Supported formats

| Category | Formats |
| --- | --- |
| Documents | pdf, docx, txt, rtf |
| Spreadsheets | xlsx, xls, csv |
| Mind maps | xmind, mm, opml |
| Code | ts, js, py, json |

> Tip: all parsing happens in your browser — safe and private.

\`\`\`ts
function preview(file: File) {
  return parseFile(file)
}
\`\`\`
`

const CSV_EN = `Month,Revenue,Orders,Avg Order Value
Jan,128000,320,400
Feb,96500,241,400
Mar,154200,385,401
Apr,142800,357,400
May,178900,447,400
Jun,203400,508,401
`

const OPML_EN = `<?xml version="1.0" encoding="UTF-8"?>
<opml version="2.0">
  <head><title>Project Plan</title></head>
  <body>
    <outline text="Product Launch Plan">
      <outline text="Requirements">
        <outline text="User research"/>
        <outline text="Competitor analysis"/>
        <outline text="Requirement review"/>
      </outline>
      <outline text="Design">
        <outline text="Interaction design"/>
        <outline text="Visual design"/>
      </outline>
      <outline text="Development">
        <outline text="Frontend"/>
        <outline text="Backend"/>
        <outline text="Integration testing"/>
      </outline>
      <outline text="Release">
        <outline text="Canary release"/>
        <outline text="General availability"/>
        <outline text="Retrospective"/>
      </outline>
    </outline>
  </body>
</opml>
`

// ---------- Chinese samples ----------

const MARKDOWN_ZH = `# 在线文件预览器

一个 **100% 本地解析** 的多格式文件预览工具，文件不会上传到服务器。

## 主要特性

- 支持 60+ 种文件格式
- 拖拽即可预览，无需上传
- 可安装为 PWA，离线使用

## 支持的格式

| 类别 | 格式 |
| --- | --- |
| 文档 | pdf, docx, txt, rtf |
| 表格 | xlsx, xls, csv |
| 思维导图 | xmind, mm, opml |
| 代码 | ts, js, py, json |

> 提示：所有解析都在你的浏览器中完成，安全又私密。

\`\`\`ts
function preview(file: File) {
  return parseFile(file)
}
\`\`\`
`

const CSV_ZH = `月份,销售额,订单数,客单价
1月,128000,320,400
2月,96500,241,400
3月,154200,385,401
4月,142800,357,400
5月,178900,447,400
6月,203400,508,401
`

const OPML_ZH = `<?xml version="1.0" encoding="UTF-8"?>
<opml version="2.0">
  <head><title>项目规划</title></head>
  <body>
    <outline text="产品上线计划">
      <outline text="需求阶段">
        <outline text="用户调研"/>
        <outline text="竞品分析"/>
        <outline text="需求评审"/>
      </outline>
      <outline text="设计阶段">
        <outline text="交互设计"/>
        <outline text="视觉设计"/>
      </outline>
      <outline text="开发阶段">
        <outline text="前端开发"/>
        <outline text="后端开发"/>
        <outline text="联调测试"/>
      </outline>
      <outline text="上线阶段">
        <outline text="灰度发布"/>
        <outline text="正式发布"/>
        <outline text="数据复盘"/>
      </outline>
    </outline>
  </body>
</opml>
`

// JSON sample is language-neutral (shared).
const JSON_SAMPLE = `{
  "name": "file-previewer",
  "version": "1.0.0",
  "private": true,
  "features": [
    "local-parsing",
    "drag-and-drop",
    "pwa",
    "offline"
  ],
  "supportedFormats": {
    "documents": ["pdf", "docx", "txt"],
    "spreadsheets": ["xlsx", "csv"],
    "mindmaps": ["xmind", "mm", "opml"]
  },
  "privacy": {
    "uploadsToServer": false,
    "tracking": false
  }
}
`

type ExampleConfig = {
  markdown: string
  csv: string
  opml: string
}

const CONFIG: Record<Lang, ExampleConfig> = {
  en: { markdown: MARKDOWN_EN, csv: CSV_EN, opml: OPML_EN },
  zh: { markdown: MARKDOWN_ZH, csv: CSV_ZH, opml: OPML_ZH },
}

const LABELS: Record<Lang, { markdown: string; excel: string; mindmap: string; code: string }> = {
  en: {
    markdown: "Product Intro",
    excel: "Sales Data",
    mindmap: "Project Plan",
    code: "Config File",
  },
  zh: {
    markdown: "产品介绍",
    excel: "销售数据",
    mindmap: "项目规划",
    code: "配置文件",
  },
}

const FILE_NAMES: Record<Lang, { markdown: string; excel: string; mindmap: string }> = {
  en: { markdown: "product-intro.md", excel: "sales-data.csv", mindmap: "project-plan.opml" },
  zh: { markdown: "产品介绍.md", excel: "销售数据.csv", mindmap: "项目规划.opml" },
}

export function getExamples(lang: Lang): Example[] {
  const cfg = CONFIG[lang]
  const labels = LABELS[lang]
  const names = FILE_NAMES[lang]
  return [
    {
      id: "markdown",
      label: labels.markdown,
      fileName: names.markdown,
      category: "markdown",
      build: () => textFile(names.markdown, cfg.markdown, "text/markdown"),
    },
    {
      id: "excel",
      label: labels.excel,
      fileName: names.excel,
      category: "excel",
      build: () => textFile(names.excel, cfg.csv, "text/csv"),
    },
    {
      id: "mindmap",
      label: labels.mindmap,
      fileName: names.mindmap,
      category: "mindmap",
      build: () => textFile(names.mindmap, cfg.opml, "text/x-opml"),
    },
    {
      id: "code",
      label: labels.code,
      fileName: "package.json",
      category: "code",
      build: () => textFile("package.json", JSON_SAMPLE, "application/json"),
    },
  ]
}
