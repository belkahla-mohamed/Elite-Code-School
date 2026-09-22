import { NextRequest, NextResponse } from "next/server"
import { getBlogViews, incrementBlogView } from "@/lib/store"
import { validateContentType } from "@/lib/xss-utils"
import { blogViewSchema } from "@/lib/validation"

export async function GET() {
  try {
    const views = await getBlogViews()
    return NextResponse.json({ views })
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const ct = validateContentType(request)
    if (ct) return ct

    const parsed = blogViewSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Données invalides" }, { status: 400 })
    }

    const views = await incrementBlogView(parsed.data.slug)
    return NextResponse.json({ slug: parsed.data.slug, views })
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 })
  }
}
