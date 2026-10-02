import "@/lib/zod-fr";
import { NextResponse } from "next/server";
import { getParentStudentId } from "@/lib/auth";
import { updateStudent } from "@/lib/store";
import { validateContentType } from "@/lib/xss-utils";
import { z } from "zod";

const avatarSchema = z.object({
  avatarUrl: z.string().trim().min(1, "URL de l'image requise"),
});

export async function POST(request: Request) {
  try {
    const ct = validateContentType(request);
    if (ct) return ct;

    const studentId = await getParentStudentId();
    if (!studentId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const parsed = avatarSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Données invalides" }, { status: 400 });
    }

    const student = await updateStudent(studentId, {
      avatar: parsed.data.avatarUrl,
      avatarGradient: "linear-gradient(135deg,#4f46e5,#06b6d4)",
    });

    return NextResponse.json({ student });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}
