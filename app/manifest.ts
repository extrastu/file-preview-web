import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "在线文件预览器",
    short_name: "文件预览器",
    description:
      "在浏览器本地解析并预览 xmind、md、pdf、word、ppt、excel、代码、图片、音视频等多种格式，文件不会上传到服务器。",
    id: "/",
    start_url: "/?source=pwa",
    scope: "/",
    display: "standalone",
    display_override: ["window-controls-overlay", "standalone", "browser"],
    orientation: "any",
    background_color: "#fcfcfd",
    theme_color: "#4f46e5",
    lang: "zh-CN",
    dir: "ltr",
    categories: ["productivity", "utilities"],
    prefer_related_applications: false,
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "打开文件",
        short_name: "打开文件",
        description: "选择本地文件进行预览",
        url: "/?action=open",
        icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
    ],
  }
}
