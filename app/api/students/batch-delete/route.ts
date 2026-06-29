import { NextResponse } from "next/server"
import { isAdminAuthenticated } from "@/lib/auth"
import { batchDeleteStudents } from "@/lib/store"

export async function POST(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }
    const body = await request.json()
    const { ids } = body
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "Liste d'IDs requise" }, { status: 400 })
    }
    await batchDeleteStudents(ids)
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 })
  }
}
