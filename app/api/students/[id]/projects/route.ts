import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { addProject, deleteProject } from "@/lib/store";
import { projectSchema } from "@/lib/validation";

type Props = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, { params }: Props) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const parsed = projectSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Données invalides" }, { status: 400 });
    }

    const { id } = await params;
    return NextResponse.json({ project: await addProject(id, parsed.data) }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Props) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id: studentId } = await params;
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("id");
    if (!projectId) {
      return NextResponse.json({ error: "ID du projet requis" }, { status: 400 });
    }

    await deleteProject(projectId);
    return NextResponse.json({ message: "Projet supprimé" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}
