# Chapter 13: Parent Portal Enhancement

> **Goal**: Add PDF download of student report, shareable certifications (LinkedIn-style).

---

## Tasks

### [ ] T13.1 — PDF generation utility
- Install `jspdf` + `html2canvas` (already in package.json)
- Create `lib/pdf-generator.ts`
- Generate student report: identity, projects, certs, gallery, hours, progress
- Multi-page PDF with styling matching school colors

### [ ] T13.2 — Download report button in parent portal
- Replace `window.print()` with real PDF generation
- Show loading state during generation
- Download dialog with filename format: `Elite_Code_{FirstName}_{LastName}_2026.pdf`
- Share via WhatsApp/email button

### [ ] T13.3 — Share certification (LinkedIn-style)
- Generate unique share link per certification: `/certification/[id]`
- Open Graph meta tags for social preview
- "Partager sur LinkedIn" button with pre-filled text
- "Copier le lien" button
- Public certification page with school branding

### [ ] T13.4 — Certification verification page
- Public page `/certification/[id]` showing:
  - Student name, certification title, mention, date
  - Unique verification code
  - School logo + signature
- SEO metadata for social sharing

### [ ] T13.5 — Parent notification preferences
- Email notifications on/off
- When project added, certif added, portfolio updated
- Parent can subscribe to updates

---

**Progress**: `0 / 5 tasks completed`

**Next**: Chapter 14 — Admin CRUD Complete
