import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { updateProgram, deleteProgram, getPrograms } from "@/lib/store";
import { validateContentType } from "@/lib/xss-utils";

type Props = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Props) {
  try {
    const ct = validateContentType(request);
    if (ct) return ct;
    if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    const { id } = await params;
    const body = await request.json();
    await updateProgram(id, body);
    return NextResponse.json({ programs: await getPrograms() });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Props) {
  try {
    if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    const { id } = await params;
    await deleteProgram(id);
    return NextResponse.json({ programs: await getPrograms() });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}
