import { NextResponse } from "next/server";
import { getPrograms } from "@/lib/store";

export async function GET() {
  try {
    const programs = await getPrograms();
    return NextResponse.json(programs);
  } catch {
    return NextResponse.json({ error: "Failed to fetch curricula" }, { status: 500 });
  }
}
