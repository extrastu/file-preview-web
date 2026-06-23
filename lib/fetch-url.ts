// Fetches a remote file through the same-origin proxy and returns a File.
// Throws an Error whose message is a stable i18n error code on failure.
export async function fetchUrlAsFile(rawUrl: string): Promise<File> {
  const url = rawUrl.trim()
  if (!url) throw new Error("ERR_URL_EMPTY")

  // Normalize: allow users to omit the protocol.
  const normalized = /^https?:\/\//i.test(url) ? url : `https://${url}`

  try {
    // Validate shape early for a clearer error.
    // eslint-disable-next-line no-new
    new URL(normalized)
  } catch {
    throw new Error("ERR_URL_INVALID")
  }

  let res: Response
  try {
    res = await fetch(`/api/fetch-url?url=${encodeURIComponent(normalized)}`)
  } catch {
    throw new Error("ERR_URL_FETCH")
  }

  if (!res.ok) {
    throw new Error("ERR_URL_FETCH")
  }

  const blob = await res.blob()
  const headerName = res.headers.get("x-filename")
  const filename = headerName
    ? decodeURIComponent(headerName)
    : new URL(normalized).pathname.split("/").filter(Boolean).pop() ||
      "remote-file"

  return new File([blob], filename, {
    type: blob.type || "application/octet-stream",
  })
}
