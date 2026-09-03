import { NextResponse } from "next/server";
import { setParentSession, generateToken } from "@/lib/auth";
import { getParentByLogin, getParentByPassword, getStudentByParentLogin } from "@/lib/store";
import { rateLimit } from "@/lib/rate-limiter";
import { validateContentType } from "@/lib/xss-utils";

export async function POST(request: Request) {
  try {
    const ct = validateContentType(request);
    if (ct) return ct;

    const ip = request.headers.get("x-forwarded-for") ?? "parent-login";
    const { allowed, retryAfter } = rateLimit(`parent:${ip}`, 10, 60_000);
    if (!allowed) return NextResponse.json({ error: "Trop de tentatives" }, { status: 429, headers: { "Retry-After": String(retryAfter) } });

    const { email, password, secret } = await request.json();

    // Password login first (new accounts)
    if (password) {
      const passwordResult = await getParentByPassword(email ?? "", password);
      if (passwordResult) {
        await setParentSession(passwordResult.student.id);
        const parentName = `${passwordResult.parent.firstName} ${passwordResult.parent.lastName}`.trim() || `Parent de ${passwordResult.student.firstName}`;
        const token = generateToken({ id: passwordResult.student.id, name: parentName, role: "parent" });
        return NextResponse.json({ student: passwordResult.student, token, user: { id: passwordResult.student.id, name: parentName, role: "parent" } });
      }
    }

    // Secret code login (legacy flow — code fourni par l'école)
    const parentResult = await getParentByLogin(email ?? "", secret ?? password ?? "");
    if (parentResult) {
      await setParentSession(parentResult.student.id);
      const parentName = `${parentResult.parent.firstName} ${parentResult.parent.lastName}`.trim() || `Parent de ${parentResult.student.firstName}`;
      const token = generateToken({ id: parentResult.student.id, name: parentName, role: "parent" });
      return NextResponse.json({ student: parentResult.student, token, user: { id: parentResult.student.id, name: parentName, role: "parent" } });
    }

    // Fallback to student-based lookup for legacy accounts
    const student = await getStudentByParentLogin(email ?? "", secret ?? password ?? "");
    if (!student) return NextResponse.json({ error: "Accès parent invalide" }, { status: 401 });

    await setParentSession(student.id);
    const parentName = `Parent de ${student.firstName}`;
    const token = generateToken({ id: student.id, name: parentName, role: "parent" });
    return NextResponse.json({ student, token, user: { id: student.id, name: parentName, role: "parent" } });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}
