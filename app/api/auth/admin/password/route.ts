import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminUsers, updateAdminPassword } from "@/lib/store";
import { validateContentType } from "@/lib/xss-utils";

export async function POST(request: Request) {
  try {
    const ct = validateContentType(request);
    if (ct) return ct;

    const jar = await cookies();
    const adminCookie = jar.get("ecs_admin")?.value;
    if (!adminCookie) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();
    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: "Le nouveau mot de passe doit contenir au moins 6 caractères" }, { status: 400 });
    }

    const users = await getAdminUsers();
    const admin = users.find((u) => u.role === "super_admin");
    if (!admin) {
      return NextResponse.json({ error: "Aucun super admin trouvé" }, { status: 403 });
    }

    const { verifyAdminCredentials } = await import("@/lib/store");
    const verified = await verifyAdminCredentials(admin.email, currentPassword);
    if (!verified) {
      return NextResponse.json({ error: "Mot de passe actuel incorrect" }, { status: 403 });
    }

    await updateAdminPassword(admin.id, newPassword);
    return NextResponse.json({ ok: true, message: "Mot de passe mis à jour avec succès" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}
