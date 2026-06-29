import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getActivityLog } from "@/lib/activity-log";

export async function GET() {
  try {
    if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    return NextResponse.json({ activities: getActivityLog(200) });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}
