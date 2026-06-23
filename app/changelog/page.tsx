import type { Metadata } from "next"
import { ChangelogContent } from "@/components/changelog-content"

export const metadata: Metadata = {
  title: "Changelog",
  description:
    "Release history for the Online File Previewer: new format support, online preview, PWA, internationalization and other improvements and fixes.",
  alternates: { canonical: "/changelog" },
  openGraph: {
    title: "Changelog | Online File Previewer",
    description:
      "A record of new features, improvements and fixes in the Online File Previewer.",
    url: "/changelog",
    type: "article",
  },
}

export default function ChangelogPage() {
  return <ChangelogContent />
}
