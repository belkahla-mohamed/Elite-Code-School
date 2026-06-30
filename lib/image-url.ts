export function getOptimizedUrl(src: string, opts?: { width?: number; height?: number; quality?: number }): string {
  if (!src || src.startsWith("data:")) return src
  const endpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT
  if (!endpoint) return src
  try {
    const url = new URL(src)
    if (!url.hostname.includes("imagekit.io")) return src
    const w = opts?.width ?? 800
    const q = opts?.quality ?? 80
    const h = opts?.height
    const tr = h ? `w-${w},h-${h},c-maintain_ratio,q-${q},f-auto` : `w-${w},q-${q},f-auto`
    url.searchParams.set("tr", tr)
    return url.toString()
  } catch {
    return src
  }
}
