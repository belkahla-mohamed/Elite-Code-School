import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { addGalleryItem, deleteGalleryItem } from "@/lib/store";
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

export async function DELETE(request: Request, { params }: Props) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get("id");
    if (!itemId) {
      return NextResponse.json({ error: "ID de l'image requis" }, { status: 400 });
    }

    await deleteGalleryItem(itemId);
    return NextResponse.json({ message: "Image supprimée" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}
