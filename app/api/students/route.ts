import { NextResponse } from "next/server";
import { getDashboardSnapshot, getPublicPortfolios } from "@/lib/store";
import { isAdminAuthenticated, isTeacherAuthenticated } from "@/lib/auth";

export async function GET() {
  if ((await isAdminAuthenticated()) || (await isTeacherAuthenticated())) {
    const snapshot = await getDashboardSnapshot();
    return NextResponse.json({ students: snapshot.students });
  }

  return NextResponse.json({ students: await getPublicPortfolios() });
}

