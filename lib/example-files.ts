// In-code sample documents. Each builder returns a real File object so it
// flows through the exact same parsing pipeline as user-provided files.

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

const MARKDOWN_SAMPLE = `# 在线文件预览器

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

const CSV_SAMPLE = `月份,销售额,订单数,客单价
1月,128000,320,400
2月,96500,241,400
3月,154200,385,401
4月,142800,357,400
5月,178900,447,400
6月,203400,508,401
`

const OPML_SAMPLE = `<?xml version="1.0" encoding="UTF-8"?>
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

export const EXAMPLES: Example[] = [
  {
    id: "markdown",
    label: "产品介绍",
    fileName: "产品介绍.md",
    category: "markdown",
    build: () => textFile("产品介绍.md", MARKDOWN_SAMPLE, "text/markdown"),
  },
  {
    id: "excel",
    label: "销售数据",
    fileName: "销售数据.csv",
    category: "excel",
    build: () => textFile("销售数据.csv", CSV_SAMPLE, "text/csv"),
  },
  {
    id: "mindmap",
    label: "项目规划",
    fileName: "项目规划.opml",
    category: "mindmap",
    build: () => textFile("项目规划.opml", OPML_SAMPLE, "text/x-opml"),
  },
  {
    id: "code",
    label: "配置文件",
    fileName: "package.json",
    category: "code",
    build: () => textFile("package.json", JSON_SAMPLE, "application/json"),
  },
]
