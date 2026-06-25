import { NextResponse } from "next/server";
import { isAdminAuthenticated, isTeacherAuthenticated, getParentStudentId } from "@/lib/auth";
import { updateStudent, deleteStudent, getStudentById } from "@/lib/store";

type Props = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Props) {
  try {
    const { id } = await params;
    const isAdmin = await isAdminAuthenticated();
    const isTeacher = await isTeacherAuthenticated();
    const parentId = await getParentStudentId();
    if (!isAdmin && !isTeacher && parentId !== id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    const student = await getStudentById(id);
    if (!student) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    return NextResponse.json({ student });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: Props) {
  try {
    if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    const { id } = await params;
    const body = await request.json();
    const student = await updateStudent(id, body);
    return NextResponse.json({ student });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Props) {
  try {
    if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    const { id } = await params;
    await deleteStudent(id);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}
