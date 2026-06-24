import { NextResponse } from "next/server";
import { getPortfolioBySlug } from "@/lib/store";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const portfolio = await getPortfolioBySlug(slug);
    if (!portfolio) return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
    return NextResponse.json(portfolio);
  } catch {
    return NextResponse.json({ error: "Failed to fetch portfolio" }, { status: 500 });
  }
}
