import "@/lib/zod-fr";
import { NextRequest, NextResponse } from "next/server";
import { getAllCertifications, createCertification, deleteCertification } from "@/lib/store";
import { getAdminSession } from "@/lib/auth";
import { requireCsrf } from "@/lib/csrf";
import { z } from "zod";

export async function GET() {
  try {
    const certs = await getAllCertifications();
    return NextResponse.json({ certifications: certs });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}

async function requireCertPermission(): Promise<NextResponse | null> {
  const session = await getAdminSession();
  if (!session || (session.role !== "super_admin" && !session.permissions?.includes("certificates"))) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }
  return null;
}

const certSchema = z.object({
  studentId: z.string().min(1, "Élève requis"),
  title: z.string().trim().min(2, "Titre requis"),
  mention: z.string().trim().min(2, "Mention requise"),
  dateLabel: z.string().trim().min(2, "Date requise"),
  emoji: z.string().min(1, "Emoji requis"),
  gradient: z.string().min(1, "Gradient requis"),
  issueDate: z.string().min(10, "Date d'émission requise"),
  serialCode: z.string().trim().min(5, "Numéro de série requis"),
});

export async function POST(request: NextRequest) {
  try {
    const denied = await requireCertPermission();
    if (denied) return denied;

    const csrfError = requireCsrf(request);
    if (csrfError) return csrfError;

    const parsed = certSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides", details: parsed.error.issues }, { status: 400 });
    }

    const created = await createCertification(parsed.data);
    return NextResponse.json(created);
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}

const deleteSchema = z.object({
  ids: z.array(z.string().min(1)).min(1, "Aucun certificat sélectionné"),
});

export async function DELETE(request: NextRequest) {
  try {
    const denied = await requireCertPermission();
    if (denied) return denied;

    const csrfError = requireCsrf(request);
    if (csrfError) return csrfError;

    const parsed = deleteSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides", details: parsed.error.issues }, { status: 400 });
    }

    let deleted = 0;
    for (const id of parsed.data.ids) {
      await deleteCertification(id);
      deleted += 1;
    }
    return NextResponse.json({ ok: true, deleted });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}
