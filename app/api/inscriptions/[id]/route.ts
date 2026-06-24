import { NextResponse } from "next/server";
import { acceptInscriptionRequest, refuseInscriptionRequest } from "@/lib/store";
import { isAdminAuthenticated } from "@/lib/auth";

type Props = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: Props) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  if (body.action === "accept") {
    const result = await acceptInscriptionRequest(id);
    return NextResponse.json(result);
  }

  if (body.action === "refuse") {
    const result = await refuseInscriptionRequest(id);
    return NextResponse.json({ request: result });
  }

  return NextResponse.json({ error: "Action invalide" }, { status: 400 });
}
