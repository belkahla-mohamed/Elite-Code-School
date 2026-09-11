import { NextResponse } from "next/server";
import { getContentBlocks, updateContentBlock } from "@/lib/store";
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

export async function POST(req: Request) {
  try {
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
