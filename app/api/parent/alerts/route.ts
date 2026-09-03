import { NextRequest, NextResponse } from "next/server"
import { getParentStudentId } from "@/lib/auth"
import { getStudentAlerts, markStudentAlertsRead } from "@/lib/store"

export async function GET() {
  try {
    const studentId = await getParentStudentId()
    if (!studentId) {
      return NextResponse.json({ error: "Non connecté" }, { status: 401 })
    }
    const alerts = await getStudentAlerts(studentId)
    return NextResponse.json({ alerts })
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const studentId = await getParentStudentId()
    if (!studentId) {
      return NextResponse.json({ error: "Non connecté" }, { status: 401 })
    }
    await markStudentAlertsRead(studentId)
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 })
  }
}