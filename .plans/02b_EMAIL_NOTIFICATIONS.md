# Phase 2b: Email Notifications

> **Goal**: Configure and integrate email notifications for enrollment acceptance/rejection, and parent communication.
> **Estimated effort**: 2–3 hours

---

## Overview

The application currently has no email sending capability. When an admin accepts or rejects an enrollment request, the parent should be notified via email with their access credentials.

---

## Task 2b.1 — Choose & Configure Email Provider

### Options
| Provider | Free Tier | Notes |
|----------|-----------|-------|
| **Resend** | 100 emails/day | Best for Next.js, easy API |
| **SendGrid** | 100 emails/day | More features, heavier SDK |
| **Nodemailer** | Free (own SMTP) | Requires SMTP server config |

### Recommendation
Use **Resend** for simplicity and Next.js compatibility.

### Implementation
1. Install Resend: `npm install resend`
2. Create `lib/email.ts` with sendEmail function
3. Configure `RESEND_API_KEY` in `.env`
4. Create email templates for:
   - Enrollment received (to admin)
   - Enrollment accepted (to parent with secret)
   - Enrollment rejected (to parent with optional reason)

### New Files
- `lib/email.ts` — Email sending utility
- `.env` updates (RESEND_API_KEY, EMAIL_FROM)

---

## Task 2b.2 — Email Templates

### Template 1: Enrollment Received (Admin Notification)
```
Subject: Nouvelle demande d'inscription — [Student Name]
To: admin@elitecodeschool.ma
Body: 
  Un nouveau parent a soumis une demande pour [Student Name].
  Âge: [age], Programme: [program]
  Parent: [parent name], Email: [email], Tel: [phone]
  Lien admin: [dashboard URL]
```

### Template 2: Enrollment Accepted (Parent Notification)
```
Subject: Inscription acceptée — Elite Code School
To: [parent email]
Body:
  Bonjour [Parent Name],
  
  Félicitations ! L'inscription de [Student Name] a été acceptée.
  
  Voici votre code d'accès parent: [ACCESS_SECRET]
  
  Connectez-vous sur: [login URL]
  Email: [parent email]
  Code: [ACCESS_SECRET]
  
  Ce code est personnel et confidentiel.
```

### Template 3: Enrollment Rejected (Parent Notification)
```
Subject: Suivi de votre demande d'inscription
To: [parent email]
Body:
  Bonjour [Parent Name],
  
  Suite à l'étude de votre dossier, nous ne pouvons pas donner suite 
  à votre demande d'inscription pour [Student Name] pour le moment.
  
  [optional reason]
  
  N'hésitez pas à nous recontacter pour plus d'informations.
```

---

## Task 2b.3 — Integrate Emails with Enrollment Flow

### In `acceptInscriptionRequest()` (lib/store.ts)
After creating the student record and generating the parent secret:
1. Call `sendEmail()` with the acceptance template
2. Log the email send in activity log
3. Handle email send failure gracefully (don't block the acceptance)

### In `refuseInscriptionRequest()` (lib/store.ts)
After updating the request status:
1. Call `sendEmail()` with the rejection template
2. Log the email send in activity log

---

## Task 2b.4 — Email Configuration UI

### In Admin Settings Page
- Show email configuration status (configured/not configured)
- Test email send button
- Update `RESEND_API_KEY` (if stored in DB)
- Show sending history

---

## Acceptance Criteria

- [ ] Email is sent when enrollment request is submitted (to admin)
- [ ] Email is sent when enrollment is accepted (to parent with secret)
- [ ] Email is sent when enrollment is rejected (to parent)
- [ ] Email send failures are handled gracefully (toast warning, not error)
- [ ] Email templates have proper HTML formatting
- [ ] Email sending is logged in activity log
- [ ] Email provider can be configured via .env
