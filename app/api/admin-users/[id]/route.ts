import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import { requireCsrf } from "@/lib/csrf";
import { updateAdminUser, deleteAdminUser } from "@/lib/store";

const updateSchema = z.object({
  email: z.string().trim().email("Email invalide").optional(),
  firstName: z.string().trim().min(2, "Prénom requis").optional(),
  lastName: z.string().trim().min(2, "Nom requis").optional(),
  role: z.enum(["admin", "super_admin"]).optional(),
  permissions: z.array(z.string()).optional(),
});

async function requireAdminsPermission() {
  const session = await getAdminSession();
  if (!session || (session.role !== "super_admin" && !session.permissions?.includes("admins"))) {
    return { session: null, denied: NextResponse.json({ error: "Non autorisé" }, { status: 403 }) };
  }
  return { session, denied: null };
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { session, denied } = await requireAdminsPermission();
    if (denied) return denied;

    const csrfError = requireCsrf(request);
    if (csrfError) return csrfError;

    const { id } = await context.params;
    if (!id) return NextResponse.json({ error: "ID manquant" }, { status: 400 });

    const parsed = updateSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides", details: parsed.error.issues }, { status: 400 });
    }

    if (parsed.data.role === "super_admin" && session!.role !== "super_admin") {
      return NextResponse.json({ error: "Seul le super administrateur peut promouvoir un compte" }, { status: 403 });
    }

    const updated = await updateAdminUser(id, parsed.data);
    return NextResponse.json({ ok: true, user: updated });
  } catch (e: any) {
    if (e.message?.includes("introuvable")) {
      return NextResponse.json({ error: "Admin introuvable" }, { status: 404 });
    }
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { denied } = await requireAdminsPermission();
    if (denied) return denied;

    const csrfError = requireCsrf(request);
    if (csrfError) return csrfError;

    const { id } = await context.params;
    if (!id) return NextResponse.json({ error: "ID manquant" }, { status: 400 });

    await deleteAdminUser(id);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (e.message?.includes("introuvable")) {
      return NextResponse.json({ error: "Admin introuvable" }, { status: 404 });
    }
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}
