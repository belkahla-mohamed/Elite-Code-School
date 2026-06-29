import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { addCertification, deleteCertification } from "@/lib/store";
import { certificationSchema } from "@/lib/validation";

type Props = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, { params }: Props) {
  try {
    if (!(await isAdminAuthenticated())) {
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

export async function DELETE(request: Request, { params }: Props) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const certId = searchParams.get("id");
    if (!certId) {
      return NextResponse.json({ error: "ID du certificat requis" }, { status: 400 });
    }

    await deleteCertification(certId);
    return NextResponse.json({ message: "Certificat supprimé" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}
