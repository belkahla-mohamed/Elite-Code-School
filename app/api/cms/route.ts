import "@/lib/zod-fr";
import { NextRequest, NextResponse } from "next/server";
import { getContentBlocks, updateContentBlock } from "@/lib/store";
import { isAdminAuthenticated } from "@/lib/auth";
import { requireCsrf } from "@/lib/csrf";
import { z } from "zod";

const blockSchema = z.object({
  key: z.string().trim().min(1),
  value: z.string().trim()
});

export async function GET() {
  try {
    const blocks = await getContentBlocks();
    return NextResponse.json({ blocks });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    const csrfError = requireCsrf(req);
    if (csrfError) return csrfError;

    const body = await req.json();
    const parsed = z.array(blockSchema).parse(body.blocks);
    
    for (const block of parsed) {
      await updateContentBlock(block.key, block.value);
    }
    
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Données invalides" }, { status: 400 });
  }
}
