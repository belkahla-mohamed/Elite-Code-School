import { NextResponse } from "next/server"
import { isAdminAuthenticated } from "@/lib/auth"
import { getAllStudentRequests, getDashboardSnapshot } from "@/lib/store"

export async function GET() {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }
    const [requests, snapshot] = await Promise.all([getAllStudentRequests(), getDashboardSnapshot()])
    return NextResponse.json({ requests, students: snapshot.students })
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 })
  }
}