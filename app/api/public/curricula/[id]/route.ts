import { NextResponse } from "next/server";
import { getPrograms } from "@/lib/store";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const programs = await getPrograms();
    const program = programs.find((p) => p.id === id);
    if (!program) return NextResponse.json({ error: "Program not found" }, { status: 404 });
    return NextResponse.json(program);
  } catch {
    return NextResponse.json({ error: "Failed to fetch program" }, { status: 500 });
  }
}
