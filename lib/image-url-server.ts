const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'%3E%3Crect width='800' height='400' fill='%23e5e7eb'/%3E%3Ctext x='400' y='210' text-anchor='middle' fill='%239ca3af' font-size='40' font-weight='bold' font-family='sans-serif'%3EImage%3C/text%3E%3C/svg%3E";

export function imgSrc(src: string, width?: number): string {
  if (!src) return FALLBACK_IMAGE
  if (src.startsWith("data:")) return src
  if (src.startsWith("http") && !process.env.IMAGEKIT_URL_ENDPOINT && !process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT) return src
  let url: URL
  try {
    url = new URL(src)
  } catch {
    return FALLBACK_IMAGE
  }
  if (!url.hostname.includes("imagekit.io")) return src
  const endpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || process.env.IMAGEKIT_URL_ENDPOINT
  if (!endpoint) return src
  const w = width ?? 800
  url.searchParams.set("tr", `w-${w},q-80,f-auto`)
  return url.toString()
}
