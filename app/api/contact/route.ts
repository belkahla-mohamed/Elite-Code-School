import { NextResponse } from "next/server";
import { validateContentType } from "@/lib/xss-utils";
import { createContactLead } from "@/lib/store";
import { sendContactFormEmail } from "@/lib/email";
import { addActivity } from "@/lib/activity-log";

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

    const lead = await createContactLead({ name: name.trim(), phone: phone.trim(), message: (message ?? "").trim() });

    addActivity("request", "Message contact reçu", `${lead.name} · ${lead.phone}`);

    // Send email notification (non-blocking — don't fail the request if email fails)
    sendContactFormEmail({ name: lead.name, phone: lead.phone, message: lead.message }).catch((e) => {
      console.warn("Contact form email failed (lead saved):", e);
    });

    const response = NextResponse.json({ ok: true, message: "Message envoyé avec succès ! Notre équipe vous contactera sous 24h." }, { status: 201 });
    return response;
  } catch (e: any) {
    console.error("Contact API error:", e);
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}