import { NextResponse } from "next/server";
import { getParentStudentId, isAdminAuthenticated } from "@/lib/auth";
import { updateStudentPrivacy } from "@/lib/store";

type Props = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: Props) {
  try {
    const { id } = await params;
    const parentStudentId = await getParentStudentId();
    const isAdmin = await isAdminAuthenticated();

    if (!isAdmin && parentStudentId !== id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { isPublic } = await request.json();
    const student = await updateStudentPrivacy(id, Boolean(isPublic));
    return NextResponse.json({ student });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}
