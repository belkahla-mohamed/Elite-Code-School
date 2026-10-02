import "@/lib/zod-fr";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import { requireCsrf } from "@/lib/csrf";
import { getAdminUsers, createAdminUser } from "@/lib/store";

async function requireAdminsPermission() {
  const session = await getAdminSession();
  if (!session || (session.role !== "super_admin" && !session.permissions?.includes("admins"))) {
    return { session: null, denied: NextResponse.json({ error: "Non autorisé" }, { status: 403 }) };
  }
  return { session, denied: null };
}

export async function GET() {
  try {
    const { denied } = await requireAdminsPermission();
    if (denied) return denied;
    const admins = await getAdminUsers();
    return NextResponse.json({ adminUsers: admins });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}

const adminSchema = z.object({
  email: z.string().trim().email("Email invalide"),
  firstName: z.string().trim().min(2, "Prénom requis"),
  lastName: z.string().trim().min(2, "Nom requis"),
  password: z.string().min(6, "Mot de passe court"),
  permissions: z.array(z.string()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const { denied } = await requireAdminsPermission();
    if (denied) return denied;

    const csrfError = requireCsrf(request);
    if (csrfError) return csrfError;

    const parsed = adminSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides", details: parsed.error.issues }, { status: 400 });
    }

    const created = await createAdminUser(parsed.data);
    return NextResponse.json(created);
  } catch (e: any) {
    if (e.message?.includes("déjà utilisé")) {
      return NextResponse.json({ error: "Cet email est déjà utilisé" }, { status: 400 });
    }
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}
