import { NextResponse } from "next/server";
import { isAdminAuthenticated, isTeacherAuthenticated } from "@/lib/auth";
import { addCertification } from "@/lib/store";
import { certificationSchema } from "@/lib/validation";

type Props = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, { params }: Props) {
  try {
    if (!(await isAdminAuthenticated()) && !(await isTeacherAuthenticated())) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const parsed = certificationSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Données invalides" }, { status: 400 });
    }

    const { id } = await params;
    return NextResponse.json({ certification: await addCertification(id, parsed.data) }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}
