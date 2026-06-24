import { cookies } from "next/headers";
import { createHash } from "crypto";

const ADMIN_COOKIE = "ecs_admin";
const PARENT_COOKIE = "ecs_parent_student";
const TEACHER_COOKIE = "ecs_teacher";

export function hashSecret(secret: string) {
  return createHash("sha256").update(secret).digest("hex");
}

export async function isAdminAuthenticated() {
  const jar = await cookies();
  return jar.get(ADMIN_COOKIE)?.value === adminToken();
}

export async function getParentStudentId() {
  const jar = await cookies();
  return jar.get(PARENT_COOKIE)?.value;
}

export async function getTeacherId() {
  const jar = await cookies();
  return jar.get(TEACHER_COOKIE)?.value;
}

export async function isTeacherAuthenticated() {
  return Boolean(await getTeacherId());
}

export async function setAdminSession() {
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, adminToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.COOKIE_SECURE === "true",
    path: "/",
    maxAge: 60 * 60 * 8
  });
}

export async function setParentSession(studentId: string) {
  const jar = await cookies();
  jar.set(PARENT_COOKIE, studentId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.COOKIE_SECURE === "true",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export async function setTeacherSession(teacherId: string) {
  const jar = await cookies();
  jar.set(TEACHER_COOKIE, teacherId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.COOKIE_SECURE === "true",
    path: "/",
    maxAge: 60 * 60 * 8
  });
}

export async function clearSessions() {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
  jar.delete(PARENT_COOKIE);
  jar.delete(TEACHER_COOKIE);
}

export function verifyAdminPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD ?? "admin123";
  return password === expected;
}

function adminToken() {
  const secret = process.env.AUTH_COOKIE_SECRET ?? "elite-code-school-dev-secret";
  return hashSecret(`admin:${secret}`);
}
