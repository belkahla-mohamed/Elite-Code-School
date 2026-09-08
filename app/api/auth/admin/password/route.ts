import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/auth";
import { getAdminUsers, updateAdminPassword } from "@/lib/store";
import { validateContentType } from "@/lib/xss-utils";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Mot de passe actuel requis").max(200),
  newPassword: z
    .string()
    .min(8, "Le nouveau mot de passe doit contenir au moins 8 caractères")
    .max(200)
    .regex(/[A-Za-z]/, "Doit contenir au moins une lettre")
    .regex(/[0-9]/, "Doit contenir au moins un chiffre"),
});

export async function POST(request: Request) {
  try {
    const ct = validateContentType(request);
    if (ct) return ct;

    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const parsed = passwordSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }
    const { currentPassword, newPassword } = parsed.data;

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
