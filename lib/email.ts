import { addActivity } from "@/lib/activity-log"
import { getSettings } from "@/lib/store"

const RESEND_API_KEY = process.env.RESEND_API_KEY

export function hasEmailConfig(): boolean {
  return !!RESEND_API_KEY
}

async function getEmailFrom(): Promise<string> {
  try {
    const settings = await getSettings()
    return settings.emailFrom
  } catch {
    return "Elite Code School <onboarding@resend.dev>"
  }
}

async function getAdminEmail(): Promise<string> {
  try {
    const settings = await getSettings()
    return settings.adminEmail
  } catch {
    return ""
  }
}

function logResend403(method: string) {
  addActivity("request", "Erreur email", `Resend 403: vérifie que le domaine est approuvé dans le dashboard Resend, ou utilise onboarding@resend.dev`)
}

function buildAdminNotificationHtml(payload: {
  studentFirstName: string
  studentLastName: string
  age: number
  programTitle: string
  parentName: string
  parentEmail: string
  parentPhone: string
  message?: string
}): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg,#4f46e5,#06b6d4); padding: 24px; text-align: center;">
        <h1 style="color: #fff; margin: 0; font-size: 24px;">Nouvelle demande d'inscription</h1>
      </div>
      <div style="padding: 24px; background: #f9fafb;">
        <p style="color: #374151; font-size: 16px;"><strong>Élève:</strong> ${payload.studentFirstName} ${payload.studentLastName}</p>
        <p style="color: #374151; font-size: 16px;"><strong>Âge:</strong> ${payload.age} ans</p>
        <p style="color: #374151; font-size: 16px;"><strong>Programme:</strong> ${payload.programTitle}</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
        <p style="color: #374151; font-size: 16px;"><strong>Parent:</strong> ${payload.parentName}</p>
        <p style="color: #374151; font-size: 16px;"><strong>Email:</strong> ${payload.parentEmail}</p>
        <p style="color: #374151; font-size: 16px;"><strong>Tél:</strong> ${payload.parentPhone}</p>
        ${payload.message ? `<p style="color: #374151; font-size: 14px; font-style: italic;">"${payload.message}"</p>` : ""}
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
        <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/admin/enrollments"
           style="display: inline-block; background: #4f46e5; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 999px; font-weight: bold;">
          Voir dans le tableau de bord
        </a>
      </div>
    </div>
  `
}

function buildAcceptanceHtml(payload: {
  parentName: string
  studentFirstName: string
  studentLastName: string
  parentEmail: string
  parentSecret: string
}): string {
  const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/login`
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg,#22c55e,#16a34a); padding: 24px; text-align: center;">
        <h1 style="color: #fff; margin: 0; font-size: 24px;">Inscription acceptée !</h1>
      </div>
      <div style="padding: 24px; background: #f9fafb;">
        <p style="color: #374151; font-size: 16px;">Bonjour ${payload.parentName},</p>
        <p style="color: #374151; font-size: 16px;">
          Félicitations ! L'inscription de <strong>${payload.studentFirstName} ${payload.studentLastName}</strong>
          a été acceptée.
        </p>
        <div style="background: #fff; border: 2px solid #e5e7eb; border-radius: 12px; padding: 20px; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px;">Vos identifiants parent :</p>
          <p style="color: #374151; font-size: 16px; margin: 4px 0;"><strong>Email:</strong> ${payload.parentEmail}</p>
          <p style="color: #374151; font-size: 16px; margin: 4px 0;"><strong>Code d'accès:</strong></p>
          <div style="background: #f3f4f6; border-radius: 8px; padding: 12px; text-align: center; font-family: monospace; font-size: 20px; letter-spacing: 4px; margin-top: 4px;">
            ${payload.parentSecret}
          </div>
        </div>
        <a href="${loginUrl}"
           style="display: inline-block; background: #22c55e; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 999px; font-weight: bold;">
          Connectez-vous
        </a>
        <p style="color: #9ca3af; font-size: 12px; margin-top: 16px;">
          Ce code est personnel et confidentiel. Ne le partagez pas.
        </p>
      </div>
    </div>
  `
}

function buildRejectionHtml(payload: {
  parentName: string
  studentFirstName: string
  studentLastName: string
  reason?: string
}): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg,#ef4444,#dc2626); padding: 24px; text-align: center;">
        <h1 style="color: #fff; margin: 0; font-size: 24px;">Suivi de votre demande</h1>
      </div>
      <div style="padding: 24px; background: #f9fafb;">
        <p style="color: #374151; font-size: 16px;">Bonjour ${payload.parentName},</p>
        <p style="color: #374151; font-size: 16px;">
          Suite à l'étude de votre dossier, nous ne pouvons pas donner suite
          à votre demande d'inscription pour <strong>${payload.studentFirstName} ${payload.studentLastName}</strong>
          pour le moment.
        </p>
        ${payload.reason ? `
          <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <p style="color: #991b1b; font-size: 14px; margin: 0;"><strong>Motif :</strong> ${payload.reason}</p>
          </div>
        ` : ""}
        <p style="color: #6b7280; font-size: 14px;">
          N'hésitez pas à nous recontacter pour plus d'informations.
        </p>
        <p style="color: #6b7280; font-size: 14px;">
          Cordialement,<br />L'équipe Elite Code School
        </p>
      </div>
    </div>
  `
}

export async function sendAdminNotification(payload: {
  studentFirstName: string
  studentLastName: string
  age: number
  programTitle: string
  parentName: string
  parentEmail: string
  parentPhone: string
  message?: string
}) {
  if (!hasEmailConfig()) {
    addActivity("request", "Notification admin", `[EMAIL SIMULÉ] Nouvelle inscription: ${payload.studentFirstName} ${payload.studentLastName} (${payload.parentEmail})`)
    return
  }
  const emailFrom = await getEmailFrom()
  let to = await getAdminEmail()
  if (!to) to = payload.parentEmail
  try {
    const { Resend } = await import("resend")
    const resend = new Resend(RESEND_API_KEY!)
    await resend.emails.send({
      from: emailFrom,
      to,
      subject: `Nouvelle demande d'inscription — ${payload.studentFirstName} ${payload.studentLastName}`,
      html: buildAdminNotificationHtml(payload),
    })
    addActivity("request", "Notification admin", `Email envoyé à ${to}`)
  } catch (e: any) {
    const msg = e?.statusCode === 403 ? `Resend 403 — domaine non vérifié` : e?.message ?? String(e)
    addActivity("request", "Erreur email", `Échec envoi notification admin: ${msg}`)
    if (e?.statusCode === 403) logResend403("sendAdminNotification")
    console.warn("Email send failed (admin notification):", e)
  }
}

export async function sendAcceptanceEmail(payload: {
  parentName: string
  parentEmail: string
  studentFirstName: string
  studentLastName: string
  parentSecret: string
}) {
  if (!hasEmailConfig()) {
    addActivity("student", "Email acceptation", `[EMAIL SIMULÉ] Acceptation envoyée à ${payload.parentEmail} — Code: ${payload.parentSecret}`)
    return
  }
  const emailFrom = await getEmailFrom()
  try {
    const { Resend } = await import("resend")
    const resend = new Resend(RESEND_API_KEY!)
    await resend.emails.send({
      from: emailFrom,
      to: payload.parentEmail,
      subject: `Inscription acceptée — Elite Code School`,
      html: buildAcceptanceHtml(payload),
    })
    addActivity("student", "Email acceptation", `Email d'acceptation envoyé à ${payload.parentEmail}`)
  } catch (e: any) {
    const msg = e?.statusCode === 403 ? `Resend 403 — domaine non vérifié` : e?.message ?? String(e)
    addActivity("student", "Erreur email", `Échec envoi acceptation à ${payload.parentEmail}: ${msg}`)
    if (e?.statusCode === 403) logResend403("sendAcceptanceEmail")
    console.warn("Email send failed (acceptance):", e)
  }
}

export async function sendRejectionEmail(payload: {
  parentName: string
  parentEmail: string
  studentFirstName: string
  studentLastName: string
  reason?: string
}) {
  if (!hasEmailConfig()) {
    addActivity("request", "Email refus", `[EMAIL SIMULÉ] Refus envoyé à ${payload.parentEmail} pour ${payload.studentFirstName} ${payload.studentLastName}`)
    return
  }
  const emailFrom = await getEmailFrom()
  try {
    const { Resend } = await import("resend")
    const resend = new Resend(RESEND_API_KEY!)
    await resend.emails.send({
      from: emailFrom,
      to: payload.parentEmail,
      subject: `Suivi de votre demande d'inscription — Elite Code School`,
      html: buildRejectionHtml(payload),
    })
    addActivity("request", "Email refus", `Email de refus envoyé à ${payload.parentEmail}`)
  } catch (e: any) {
    const msg = e?.statusCode === 403 ? `Resend 403 — domaine non vérifié` : e?.message ?? String(e)
    addActivity("request", "Erreur email", `Échec envoi refus à ${payload.parentEmail}: ${msg}`)
    if (e?.statusCode === 403) logResend403("sendRejectionEmail")
    console.warn("Email send failed (rejection):", e)
  }
}
