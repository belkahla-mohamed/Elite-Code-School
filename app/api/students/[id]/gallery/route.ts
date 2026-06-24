import { NextResponse } from "next/server";
import { isAdminAuthenticated, isTeacherAuthenticated } from "@/lib/auth";
import { addGalleryItem } from "@/lib/store";
import { gallerySchema } from "@/lib/validation";

type Props = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, { params }: Props) {
  if (!(await isAdminAuthenticated()) && !(await isTeacherAuthenticated())) {
    return NextResponse.json({ error: "Non autorisÃ©" }, { status: 401 });
  }

  const parsed = gallerySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "DonnÃ©es invalides" }, { status: 400 });
  }

  const { id } = await params;
  return NextResponse.json({ galleryItem: await addGalleryItem(id, parsed.data) }, { status: 201 });
}

