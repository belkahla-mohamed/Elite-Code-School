import { NextResponse } from "next/server";
import { getPublicPortfolios } from "@/lib/store";

export async function GET() {
  try {
    const portfolios = await getPublicPortfolios();
    return NextResponse.json(portfolios);
  } catch {
    return NextResponse.json({ error: "Failed to fetch portfolios" }, { status: 500 });
  }
}
