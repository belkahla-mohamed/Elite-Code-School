import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { addGalleryItem } from "@/lib/store";
import { gallerySchema } from "@/lib/validation";

type Props = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, { params }: Props) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const parsed = gallerySchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Données invalides" }, { status: 400 });
    }

    const { id } = await params;
    return NextResponse.json({ galleryItem: await addGalleryItem(id, parsed.data) }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}
