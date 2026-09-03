import { NextRequest, NextResponse } from "next/server"
import { getParentStudentId } from "@/lib/auth"
import { getFollowedIds, toggleFollow } from "@/lib/store"
import { validateContentType } from "@/lib/xss-utils"
import { requireCsrf } from "@/lib/csrf"
import { followRequestSchema } from "@/lib/validation"

export async function GET() {
  try {
    const studentId = await getParentStudentId()
    if (!studentId) {
      return NextResponse.json({ error: "Non connecté" }, { status: 401 })
    }
    const followingIds = await getFollowedIds(studentId)
    return NextResponse.json({ followingIds })
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

    const parsed = followRequestSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Données invalides" }, { status: 400 })
    }

    const following = await toggleFollow(studentId, parsed.data.targetId)
    return NextResponse.json({ following })
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 })
  }
}