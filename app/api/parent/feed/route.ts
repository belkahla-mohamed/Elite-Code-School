import { NextResponse } from "next/server"
import { getParentStudentId } from "@/lib/auth"
import { getCommunityFeed } from "@/lib/store"

export async function GET() {
  try {
    const studentId = await getParentStudentId()
    if (!studentId) {
      return NextResponse.json({ error: "Non connecté" }, { status: 401 })
    }
    const feed = await getCommunityFeed(studentId)
    return NextResponse.json({ feed })
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 })
  }
}