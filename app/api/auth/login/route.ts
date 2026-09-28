import { NextResponse } from "next/server";
import { z } from "zod";
import { setAdminSession, setParentSession, generateToken } from "@/lib/auth";
import {
  verifyAdminCredentials,
  updateAdminLastLogin,
  getParentByPassword,
  getParentByLogin,
  getStudentByParentLogin,
} from "@/lib/store";
import { rateLimit } from "@/lib/rate-limiter";
import { validateContentType } from "@/lib/xss-utils";

const loginSchema = z.object({
  email: z.string().trim().min(1, "Email requis").max(200),
  password: z.string().min(1, "Mot de passe requis").max(200),
});

export async function POST(request: Request) {
  try {
    const ct = validateContentType(request);
    if (ct) return ct;

    const ip = request.headers.get("x-forwarded-for") ?? "login";
    const { allowed, retryAfter } = rateLimit(`login:${ip}`, 15, 60_000);
    if (!allowed) return NextResponse.json({ error: "Trop de tentatives" }, { status: 429, headers: { "Retry-After": String(retryAfter) } });

    const parsed = loginSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 });
    }
    const { email, password } = parsed.data;

    // 1) Admin credentials
    const admin = await verifyAdminCredentials(email, password);
    if (admin) {
      const name = `${admin.firstName} ${admin.lastName}`.trim() || admin.email;
      await updateAdminLastLogin(admin.id);
      await setAdminSession({ id: admin.id, role: admin.role, permissions: admin.permissions });
      const token = generateToken({ id: admin.id, name, role: admin.role, permissions: admin.permissions });
      return NextResponse.json({
        ok: true,
        role: "admin",
        token,
        user: { id: admin.id, name, role: admin.role, permissions: admin.permissions },
      });
    }

    // 2) Parent password login
    const passwordResult = await getParentByPassword(email, password);
    if (passwordResult) {
      await setParentSession(passwordResult.student.id);
      const parentName = `${passwordResult.parent.firstName} ${passwordResult.parent.lastName}`.trim() || `Parent de ${passwordResult.student.firstName}`;
      const token = generateToken({ id: passwordResult.student.id, name: parentName, role: "parent" });
      return NextResponse.json({
        ok: true,
        role: "parent",
        token,
        student: passwordResult.student,
        user: { id: passwordResult.student.id, name: parentName, role: "parent" },
      });
    }

    // 3) Parent secret code login (legacy flow — code fourni par l'école)
    const parentResult = await getParentByLogin(email, password);
    if (parentResult) {
      await setParentSession(parentResult.student.id);
      const parentName = `${parentResult.parent.firstName} ${parentResult.parent.lastName}`.trim() || `Parent de ${parentResult.student.firstName}`;
      const token = generateToken({ id: parentResult.student.id, name: parentName, role: "parent" });
      return NextResponse.json({
        ok: true,
        role: "parent",
        token,
        student: parentResult.student,
        user: { id: parentResult.student.id, name: parentName, role: "parent" },
      });
    }

    // 4) Student-based lookup for legacy accounts
    const student = await getStudentByParentLogin(email, password);
    if (!student) return NextResponse.json({ error: "Identifiants incorrects" }, { status: 401 });

    await setParentSession(student.id);
    const parentName = `Parent de ${student.firstName}`;
    const token = generateToken({ id: student.id, name: parentName, role: "parent" });
    return NextResponse.json({
      ok: true,
      role: "parent",
      token,
      student,
      user: { id: student.id, name: parentName, role: "parent" },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}
