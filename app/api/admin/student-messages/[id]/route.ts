import { NextRequest, NextResponse } from "next/server"
import { isAdminAuthenticated } from "@/lib/auth"
import { replyToStudentMessage } from "@/lib/store"
import { validateContentType } from "@/lib/xss-utils"
import { requireCsrf } from "@/lib/csrf"
import { messageReplySchema } from "@/lib/validation"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }
    const ct = validateContentType(request)
    if (ct) return ct
    const csrfError = requireCsrf(request)
    if (csrfError) return csrfError

    const { id } = await params
    const parsed = messageReplySchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Données invalides" }, { status: 400 })
    }

    const message = await replyToStudentMessage(id, parsed.data.reply)
    return NextResponse.json({ message })
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 })
  }
}