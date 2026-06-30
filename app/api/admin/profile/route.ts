import { NextResponse } from "next/server";
import { isAdminAuthenticated, generateToken } from "@/lib/auth";
import { getAdminProfile, updateAdminProfile } from "@/lib/store";

export async function GET(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID requis" }, { status: 400 });
    }
    const profile = await getAdminProfile(id);
    if (!profile) {
      return NextResponse.json({ error: "Admin introuvable" }, { status: 404 });
    }
    return NextResponse.json({ profile });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: "ID requis" }, { status: 400 });
    }
    await updateAdminProfile(body.id, {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
    });

    const profile = await getAdminProfile(body.id);
    const token = profile
      ? generateToken({ id: profile.id, name: `${profile.firstName} ${profile.lastName}`, role: "admin" })
      : undefined;

    return NextResponse.json({ success: true, profile, token });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}
