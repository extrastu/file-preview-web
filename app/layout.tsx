import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://file-preview.vercel.app'

const title = '在线文件预览器 - xmind/md/pdf/word/ppt/excel 等多格式预览'
const description =
  '免费的在线文件预览工具，在浏览器本地解析并预览 xmind、mm、opml、md、txt、pdf、word、ppt、excel、代码、图片、音视频等 60+ 种格式。支持拖拽上传，文件不会上传到服务器，安全私密。'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: '%s | 在线文件预览器',
  },
  description,
  generator: 'v0.app',
  applicationName: '在线文件预览器',
  keywords: [
    '在线文件预览',
    '文件预览器',
    'xmind 预览',
    '思维导图预览',
    'pdf 在线预览',
    'word 在线预览',
    'excel 在线预览',
    'ppt 在线预览',
    'markdown 预览',
    '代码预览',
    '在线查看文件',
    'file preview',
    'document viewer',
  ],
  authors: [{ name: '在线文件预览器' }],
  creator: '在线文件预览器',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: siteUrl,
    siteName: '在线文件预览器',
    title,
    description,
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
  category: 'productivity',
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
