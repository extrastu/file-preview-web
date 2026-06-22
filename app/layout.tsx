import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ServiceWorkerRegister } from '@/components/service-worker-register'
import { LanguageProvider } from '@/lib/i18n'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://file-preview.vercel.app'

const title = 'Online File Previewer - xmind/md/pdf/word/ppt/excel and more'
const description =
  'Free online file previewer that parses and previews xmind, mm, opml, md, txt, pdf, word, ppt, excel, code, images, audio and video — 60+ formats — locally in your browser. Drag and drop to preview; files are never uploaded to a server.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: '%s | Online File Previewer',
  },
  description,
  generator: 'v0.app',
  applicationName: 'Online File Previewer',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'File Previewer',
  },
  keywords: [
    'online file preview',
    'file previewer',
    'xmind preview',
    'mind map preview',
    'pdf preview online',
    'word preview online',
    'excel preview online',
    'ppt preview online',
    'markdown preview',
    'code preview',
    'view files online',
    '在线文件预览',
    '文件预览器',
  ],
  authors: [{ name: 'Online File Previewer' }],
  creator: 'Online File Previewer',
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
    locale: 'en_US',
    alternateLocale: ['zh_CN'],
    url: siteUrl,
    siteName: 'Online File Previewer',
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
    { media: '(prefers-color-scheme: light)', color: '#fcfcfd' },
    { media: '(prefers-color-scheme: dark)', color: '#191a21' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <LanguageProvider>
          {children}
          <ServiceWorkerRegister />
        </LanguageProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
