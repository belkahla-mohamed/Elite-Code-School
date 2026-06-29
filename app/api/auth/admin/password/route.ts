import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { validateContentType } from "@/lib/xss-utils";

// In-memory store for password changes (demo mode)
const globalForAdmin = globalThis as unknown as {
  ecsAdminPassword?: string;
};

export async function POST(request: Request) {
  try {
    const ct = validateContentType(request);
    if (ct) return ct;

    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: "Le nouveau mot de passe doit contenir au moins 6 caractères" }, { status: 400 });
    }

    // Verify current password
    const expected = globalForAdmin.ecsAdminPassword ?? process.env.ADMIN_PASSWORD ?? "admin123";
    if (currentPassword !== expected) {
      return NextResponse.json({ error: "Mot de passe actuel incorrect" }, { status: 403 });
    }

    // Update password (in-memory for demo, would update env/DB in production)
    globalForAdmin.ecsAdminPassword = newPassword;

    return NextResponse.json({ ok: true, message: "Mot de passe mis à jour avec succès" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}
