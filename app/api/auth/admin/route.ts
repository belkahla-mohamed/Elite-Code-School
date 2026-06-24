import { NextResponse } from "next/server";
import { setAdminSession, verifyAdminPassword } from "@/lib/auth";

export async function POST(request: Request) {
  const { password } = await request.json();

  if (!verifyAdminPassword(password ?? "")) {
    return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
  }

  await setAdminSession();
  return NextResponse.json({ ok: true });
}
