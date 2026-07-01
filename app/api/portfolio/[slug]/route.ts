import { NextResponse } from "next/server";
import { getParentStudentId, isAdminAuthenticated } from "@/lib/auth";
import { getPortfolioBySlug, getStudentById } from "@/lib/store";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, { params }: Props) {
  try {
    const { slug } = await params;

    if (await isAdminAuthenticated()) {
      const student = await getPortfolioBySlug(slug, true);
      if (!student) return NextResponse.json({ error: "Portfolio introuvable" }, { status: 404 });
      return NextResponse.json({ student });
    }

    const parentStudentId = await getParentStudentId();
    if (parentStudentId) {
      const parentStudent = await getStudentById(parentStudentId);
      if (!parentStudent || parentStudent.slug !== slug) {
        return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 });
      }
      const student = await getPortfolioBySlug(slug, true);
      if (!student) return NextResponse.json({ error: "Portfolio introuvable" }, { status: 404 });
      return NextResponse.json({ student });
    }

    const student = await getPortfolioBySlug(slug, false);
    if (!student) {
      return NextResponse.json({ error: "Portfolio privé ou introuvable" }, { status: 403 });
    }

    return NextResponse.json({ student });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}
