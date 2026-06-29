import { cookies } from "next/headers";
import { createHash, randomBytes } from "crypto";

const ADMIN_COOKIE = "ecs_admin";
const PARENT_COOKIE = "ecs_parent_student";

const JWT_SECRET = process.env.AUTH_COOKIE_SECRET ?? "elite-code-school-dev-secret";

export function hashSecret(secret: string) {
  return createHash("sha256").update(secret).digest("hex");
}

export function generateToken(payload: Record<string, unknown>, expiresInHours = 24) {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const body = { ...payload, iat: now, exp: now + expiresInHours * 3600 };

  const encode = (obj: object) => Buffer.from(JSON.stringify(obj)).toString("base64url");
  const sig = createHash("sha256").update(`${encode(header)}.${encode(body)}.${JWT_SECRET}`).digest("base64url");
  return `${encode(header)}.${encode(body)}.${sig}`;
}

export function verifyToken(token: string): Record<string, unknown> | null {
  try {
    const [header, body, sig] = token.split(".");
    const expected = createHash("sha256").update(`${header}.${body}.${JWT_SECRET}`).digest("base64url");
    if (sig !== expected) return null;
    const payload = JSON.parse(Buffer.from(body, "base64url").toString());
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export function generateAccessSecret() {
  return randomBytes(9).toString("base64url").toUpperCase().slice(0, 12);
}

export async function isAdminAuthenticated() {
  const jar = await cookies();
  return jar.get(ADMIN_COOKIE)?.value === adminToken();
}

export async function getParentStudentId() {
  const jar = await cookies();
  const token = jar.get(PARENT_COOKIE)?.value;
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload || typeof payload.studentId !== "string") return null;
  return payload.studentId;
}

export async function setAdminSession() {
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, adminToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.COOKIE_SECURE === "true",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  const { setCsrfCookie } = await import("@/lib/csrf");
  setCsrfCookie(jar);
}

export async function setParentSession(studentId: string) {
  const jar = await cookies();
  jar.set(PARENT_COOKIE, generateToken({ studentId }, 24 * 7), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.COOKIE_SECURE === "true",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  const { setCsrfCookie } = await import("@/lib/csrf");
  setCsrfCookie(jar);
}

export async function clearSessions() {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
  jar.delete(PARENT_COOKIE);
}

export function verifyAdminPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD ?? "admin123";
  return password === expected;
}

function adminToken() {
  const secret = process.env.AUTH_COOKIE_SECRET ?? "elite-code-school-dev-secret";
  return hashSecret(`admin:${secret}`);
}
