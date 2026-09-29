const CSRF_COOKIE = "ecs_csrf"

function getCsrfToken(): string | null {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(new RegExp(`(^| )${CSRF_COOKIE}=([^;]+)`))
  return match ? decodeURIComponent(match[2]) : null
}

function buildHeaders(options: RequestInit, token: string | null): Headers {
  const headers = new Headers(options.headers)

  if (options.method && options.method !== "GET" && options.method !== "HEAD") {
    if (token) headers.set("X-CSRF-Token", token)
  }

  if (!headers.has("Content-Type") && options.body && typeof options.body === "string") {
    headers.set("Content-Type", "application/json")
  }

  return headers
}

export async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const mutating = !!options.method && options.method !== "GET" && options.method !== "HEAD"
  const res = await fetch(url, { ...options, headers: buildHeaders(options, getCsrfToken()) })

  if (res.status === 403 && mutating) {
    const text = await res.clone().text().catch(() => "")
    if (/csrf/i.test(text)) {
      await fetch("/api/auth/csrf", { method: "GET" }).catch(() => null)
      return fetch(url, { ...options, headers: buildHeaders(options, getCsrfToken()) })
    }
  }

  return res
}
