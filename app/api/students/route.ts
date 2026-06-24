import { NextResponse } from "next/server";
import { getDashboardSnapshot, getPublicPortfolios } from "@/lib/store";
import { isAdminAuthenticated, isTeacherAuthenticated } from "@/lib/auth";

export async function GET() {
  try {
    if ((await isAdminAuthenticated()) || (await isTeacherAuthenticated())) {
      const snapshot = await getDashboardSnapshot();
      return NextResponse.json({ students: snapshot.students });
    }

    return NextResponse.json({ students: await getPublicPortfolios() });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}
