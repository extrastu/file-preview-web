import { FilePreviewerApp } from "@/components/file-previewer-app"

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Online File Previewer",
  description:
    "Parse and preview xmind, mm, opml, md, txt, pdf, word, ppt, excel, code, images, audio and video locally in your browser. Drag and drop to preview; files are never uploaded to a server.",
  applicationCategory: "Productivity",
  operatingSystem: "Any (Web)",
  browserRequirements: "Requires JavaScript. Requires HTML5.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Mind map preview (xmind, mm, opml)",
    "Document preview (pdf, word, markdown, txt)",
    "Spreadsheet preview (excel, csv, tsv, ods)",
    "Slide preview (pptx)",
    "Code preview (json, ts, py and more)",
    "Image, audio and video preview",
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
