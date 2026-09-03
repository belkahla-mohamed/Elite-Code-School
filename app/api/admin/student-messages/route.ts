import { NextResponse } from "next/server"
import { isAdminAuthenticated } from "@/lib/auth"
import { getAllStudentMessages, getDashboardSnapshot } from "@/lib/store"

export async function GET() {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }
    const [messages, snapshot] = await Promise.all([getAllStudentMessages(), getDashboardSnapshot()])
    return NextResponse.json({ messages, students: snapshot.students })
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 })
  }
}