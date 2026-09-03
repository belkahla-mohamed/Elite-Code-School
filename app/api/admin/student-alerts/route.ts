import { NextRequest, NextResponse } from "next/server"
import { isAdminAuthenticated } from "@/lib/auth"
import { createStudentAlert, getAllStudentAlerts } from "@/lib/store"
import { validateContentType } from "@/lib/xss-utils"
import { requireCsrf } from "@/lib/csrf"
import { studentAlertSchema } from "@/lib/validation"

export async function GET() {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }
    const alerts = await getAllStudentAlerts()
    return NextResponse.json({ alerts })
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }
    const ct = validateContentType(request)
    if (ct) return ct
    const csrfError = requireCsrf(request)
    if (csrfError) return csrfError

    const parsed = studentAlertSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Données invalides" }, { status: 400 })
    }

    const alert = await createStudentAlert(parsed.data)
    return NextResponse.json({ alert }, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 })
  }
}