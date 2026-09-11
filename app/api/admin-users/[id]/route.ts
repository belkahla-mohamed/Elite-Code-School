import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import { updateAdminUser, deleteAdminUser } from "@/lib/store";

const updateSchema = z.object({
  email: z.string().trim().email("Email invalide").optional(),
  firstName: z.string().trim().min(2, "Prénom requis").optional(),
  lastName: z.string().trim().min(2, "Nom requis").optional(),
  role: z.enum(["admin", "super_admin"]).optional(),
  permissions: z.array(z.string()).optional(),
});

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getAdminSession();
    if (!session || session.role !== "super_admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { id } = await context.params;
    if (!id) return NextResponse.json({ error: "ID manquant" }, { status: 400 });

    const parsed = updateSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides", details: parsed.error.issues }, { status: 400 });
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

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getAdminSession();
    if (!session || session.role !== "super_admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

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
