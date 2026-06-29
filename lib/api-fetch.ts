const CSRF_COOKIE = "ecs_csrf"

function getCsrfToken(): string | null {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(new RegExp(`(^| )${CSRF_COOKIE}=([^;]+)`))
  return match ? decodeURIComponent(match[2]) : null
}

export async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const headers = new Headers(options.headers)

  if (options.method && options.method !== "GET" && options.method !== "HEAD") {
    const token = getCsrfToken()
    if (token) {
      headers.set("X-CSRF-Token", token)
    }
  }

  if (!headers.has("Content-Type") && options.body && typeof options.body === "string") {
    headers.set("Content-Type", "application/json")
  }

  return fetch(url, { ...options, headers })
}
