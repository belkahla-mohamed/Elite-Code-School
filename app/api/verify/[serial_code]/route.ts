import { NextResponse } from "next/server";
import { getSupabaseAdmin, hasSupabaseConfig, demoStore } from "@/lib/store";

export async function GET(request: Request, context: { params: Promise<{ serial_code: string }> }) {
  try {
    const { serial_code } = await context.params;
    
    if (!hasSupabaseConfig()) {
      const cert = demoStore().certifications.find((c: any) => c.serialCode === serial_code);
      if (!cert) return NextResponse.json({ success: false, error: "Certificat non trouvé" }, { status: 404 });
      
      const student = demoStore().students.find((s: any) => s.id === cert.studentId);
      if (!student) return NextResponse.json({ success: false, error: "Élève non trouvé" }, { status: 404 });
      
      return NextResponse.json({
        certification: cert,
        student: { firstName: student.firstName, lastName: student.lastName, slug: student.slug }
      });
    }

    const { data, error } = await getSupabaseAdmin()
      .from("certifications")
      .select("*, students(first_name, last_name, slug)")
      .eq("serial_code", serial_code)
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    }

    return NextResponse.json({
      certification: {
        id: data.id,
        title: data.title,
        mention: data.mention,
        dateLabel: data.date_label,
        emoji: data.emoji,
        gradient: data.gradient,
        issueDate: data.issue_date,
        serialCode: data.serial_code,
      },
      student: {
        firstName: data.students?.first_name || "",
        lastName: data.students?.last_name || "",
        slug: data.students?.slug || "",
      }
    });

  } catch (e: any) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
