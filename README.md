# File Preview Web

A fast, privacy-first online file previewer that runs **entirely in your browser**. Drag a file into the window and instantly preview mind maps, documents, spreadsheets, slides, code, images, audio, and video — no upload, no sign-up, no server.

> All parsing happens locally on your device. Your files never leave the browser.

🔗 **Repository:** [github.com/extrastu/file-preview-web](https://github.com/extrastu/file-preview-web)

## Features

- **Drag & drop preview** — drop one or more files and parse them in parallel
- **60+ formats** across many categories
- **100% client-side** — files are never uploaded; parsing runs fully offline
- **PWA** — installable to your home screen / desktop with offline support
- **Internationalized** — English (default) and Chinese, switchable at runtime
- **Built-in examples** — try the app instantly with sample documents

## Supported formats

| Category    | Formats                                    |
| ----------- | ------------------------------------------ |
| Mind maps   | `xmind` · `mm` · `opml`                    |
| Documents   | `pdf` · `doc`/`docx` · `md` · `txt` · `rtf`|
| Slides      | `ppt` · `pptx`                             |
| Spreadsheets| `xls`/`xlsx` · `csv` · `tsv` · `ods`       |
| Code        | `js`/`ts` · `py` · `json` · `yaml` · `sql` …|
| Media       | `png` · `svg` · `webp` · `mp3` · `mp4` …   |

> Legacy binary `.doc` and `.ppt` are not parsable in-browser — convert to `.docx` / `.pptx` first.

## Tech stack

- **Next.js (App Router)** + **React** + **TypeScript**
- **Tailwind CSS** + **shadcn/ui** for styling and components
- **pdfjs-dist** (PDF), **mammoth** (Word), **xlsx** (spreadsheets), **jszip** (pptx/xmind)
- Custom parsers for FreeMind / XMind / OPML mind maps

## Getting Started

Install dependencies and run the development server:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Other scripts

```bash
pnpm build   # production build
pnpm start   # run the production server
pnpm lint    # lint the project
```

## How it works

Files are read with the browser `File` API and dispatched to a format-specific parser in `lib/parse-file.ts`. Each parser returns a normalized result that the matching viewer renders. Because everything runs client-side, there is no backend and no network transfer of file contents.

## Contributing

Issues and pull requests are welcome on [GitHub](https://github.com/extrastu/file-preview-web). To add a new format, extend `EXT_MAP` in `lib/preview-types.ts`, add a parser branch in `lib/parse-file.ts`, and create a viewer component.

## Built with v0

This repository is linked to a [v0](https://v0.app) project and auto-deploys to Vercel on every merge to `main`.

[Continue working on v0 →](https://v0.app/chat/projects/prj_WYr4qE6wRfBENLmsB668FDGZQQrH)
