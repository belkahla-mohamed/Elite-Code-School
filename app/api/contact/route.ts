import { NextResponse } from "next/server";
import { addActivity } from "@/lib/activity-log";
import { validateContentType } from "@/lib/xss-utils";

const globalForContact = globalThis as unknown as {
  ecsContactMessages?: { id: string; name: string; phone: string; message: string; createdAt: string }[];
};

function getMessages() {
  if (!globalForContact.ecsContactMessages) {
    globalForContact.ecsContactMessages = [];
  }
  return globalForContact.ecsContactMessages;
}

export async function POST(request: Request) {
  try {
    const ct = validateContentType(request);
    if (ct) return ct;

    const body = await request.json();
    const { name, phone, message } = body;

    if (!name?.trim() || name.trim().length < 2) {
      return NextResponse.json({ error: "Nom requis (min 2 caractères)" }, { status: 400 });
    }
    if (!phone?.trim() || phone.trim().length < 6) {
      return NextResponse.json({ error: "Téléphone requis" }, { status: 400 });
    }

    const entry = {
      id: `contact-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      message: (message ?? "").trim(),
      createdAt: new Date().toISOString(),
    };

    getMessages().unshift(entry);
    addActivity("request", "Message contact reçu", `${entry.name} · ${entry.phone}`);

    return NextResponse.json({ ok: true, message: "Message reçu. Nous vous contacterons bientôt." }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}
