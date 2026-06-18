import { FilePreviewerApp } from "@/components/file-previewer-app"

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "在线文件预览器",
  description:
    "在浏览器本地解析并预览 xmind、mm、opml、md、txt、pdf、word、ppt、excel、代码、图片、音视频等多种格式，支持拖拽上传，文件不会上传到服务器。",
  applicationCategory: "Productivity",
  operatingSystem: "Any (Web)",
  browserRequirements: "Requires JavaScript. Requires HTML5.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "思维导图预览 (xmind, mm, opml)",
    "文档预览 (pdf, word, markdown, txt)",
    "表格预览 (excel, csv, tsv, ods)",
    "幻灯片预览 (pptx)",
    "代码预览 (json, ts, py 等)",
    "图片与音视频预览",
  ],
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FilePreviewerApp />
    </>
  )
}
