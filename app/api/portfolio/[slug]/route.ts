import { NextResponse } from "next/server";
import { getParentStudentId, isAdminAuthenticated } from "@/lib/auth";
import { getPortfolioBySlug } from "@/lib/store";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, { params }: Props) {
  try {
    const { slug } = await params;
    const allowPrivate = Boolean(await isAdminAuthenticated()) || Boolean(await getParentStudentId());
    const student = await getPortfolioBySlug(slug, allowPrivate);

    if (!student) {
      return NextResponse.json({ error: "Portfolio introuvable ou privé" }, { status: 404 });
    }

    return NextResponse.json({ student });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}
