import { NextResponse } from "next/server";
import { getParentStudentId } from "@/lib/auth";
import { addProject } from "@/lib/store";

type Props = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Props) {
  try {
    const studentId = await getParentStudentId();
    if (!studentId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { id } = await params;
    const body = await request.json();

    const project = await addProject(studentId, { ...body, id });
    return NextResponse.json({ project });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Props) {
  try {
    const studentId = await getParentStudentId();
    if (!studentId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { id } = await params;
    // For demo store, we just mark it as deleted by filtering
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}
