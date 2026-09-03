import { NextRequest, NextResponse } from "next/server"
import { getParentStudentId } from "@/lib/auth"
import { createStudentRequest, getStudentRequests } from "@/lib/store"
import { validateContentType } from "@/lib/xss-utils"
import { requireCsrf } from "@/lib/csrf"
import { studentRequestSchema } from "@/lib/validation"

export async function GET() {
  try {
    const studentId = await getParentStudentId()
    if (!studentId) {
      return NextResponse.json({ error: "Non connecté" }, { status: 401 })
    }
    const requests = await getStudentRequests(studentId)
    return NextResponse.json({ requests })
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const studentId = await getParentStudentId()
    if (!studentId) {
      return NextResponse.json({ error: "Non connecté" }, { status: 401 })
    }
    const ct = validateContentType(request)
    if (ct) return ct
    const csrfError = requireCsrf(request)
    if (csrfError) return csrfError

    const parsed = studentRequestSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Données invalides" }, { status: 400 })
    }

    const requestData = await createStudentRequest(studentId, parsed.data)
    return NextResponse.json({ request: requestData }, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 })
  }
}