import { NextResponse } from "next/server";
import { addGalleryItem } from "@/lib/store";
import { getAdminSession } from "@/lib/auth";
import { z } from "zod";

const gallerySchema = z.object({
  studentId: z.string().min(1, "Élève requis"),
  label: z.string().trim().min(2, "Titre requis"),
  emoji: z.string().min(1, "Emoji requis"),
  gradient: z.string().min(1, "Gradient requis"),
  imageUrl: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const parsed = gallerySchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides", details: parsed.error.issues }, { status: 400 });
    }

    const { studentId, ...payload } = parsed.data;
    const created = await addGalleryItem(studentId, payload);
    return NextResponse.json(created);
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}
