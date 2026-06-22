import type { Metadata } from "next"
import { AboutContent } from "@/components/about-content"

export const metadata: Metadata = {
  title: "About & Privacy",
  description:
    "Learn about the Online File Previewer: a tool that runs entirely in your browser and supports mind maps, documents, spreadsheets, code, images, audio and video. All files are parsed locally and never uploaded to a server — safe and private.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About & Privacy | Online File Previewer",
    description:
      "A file preview tool that runs entirely in your browser and supports many formats. Files are never uploaded to a server.",
    url: "/about",
    type: "article",
  },
}

export default function AboutPage() {
  return <AboutContent />
}
