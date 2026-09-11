import { NextResponse } from "next/server";
import { getAllCertifications, createCertification } from "@/lib/store";
import { getAdminSession } from "@/lib/auth";
import { z } from "zod";

export async function GET() {
  try {
    const certs = await getAllCertifications();
    return NextResponse.json({ certifications: certs });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
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

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session || (session.role !== "super_admin" && !session.permissions?.includes("certificates"))) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

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
