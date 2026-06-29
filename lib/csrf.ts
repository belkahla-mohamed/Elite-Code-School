import { randomBytes } from "crypto"
import { NextRequest, NextResponse } from "next/server"

const CSRF_COOKIE = "ecs_csrf"

export function generateCsrfToken(): string {
  return randomBytes(24).toString("base64url")
}

export function validateCsrfToken(token: string, expected: string): boolean {
  if (!token || !expected) return false
  try {
    return token.length === 32 && token === expected
  } catch {
    return false
  }
}

export function setCsrfCookie(jar: { set: (name: string, value: string, opts: Record<string, any>) => void }) {
  const token = generateCsrfToken()
  jar.set(CSRF_COOKIE, token, {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.COOKIE_SECURE === "true",
    path: "/",
    maxAge: 60 * 60 * 2,
  })
  return token
}

export function requireCsrf(request: NextRequest): NextResponse | null {
  const headerToken = request.headers.get("x-csrf-token")
  const cookieToken = request.cookies.get(CSRF_COOKIE)?.value
  if (!headerToken || !cookieToken || !validateCsrfToken(headerToken, cookieToken)) {
    return NextResponse.json({ error: "CSRF validation échouée" }, { status: 403 })
  }
  return null
}

export { CSRF_COOKIE }
