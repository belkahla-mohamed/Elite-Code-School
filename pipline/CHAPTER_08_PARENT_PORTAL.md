# Chapter 8: Parent Portal

> **Goal**: Build the authenticated parent area for portfolio management.

---

## Tasks

### [ ] T8.1 — Create Parent Dashboard (`app/parent/dashboard/page.tsx`)
- Welcome message: "Welcome, [Parent Name]"
- Child summary card: avatar, name, age, curriculum, overall progress
- Quick actions: View Portfolio, Manage Privacy, Download Report
- Recent activity: latest projects, certifications
- Loading skeleton while fetching data

### [ ] T8.2 — Create Parent Portfolio view (`app/parent/portfolio/page.tsx`)
- Same layout as public portfolio but with management controls
- Student header with avatar upload placeholder
- Progress overview (all skill bars)
- Projects list with status badges
- Certifications list with share buttons
- Photo gallery
- All data fetched via `GET /api/parent/portfolio`

### [ ] T8.3 — Create Parent Portfolio API (`GET /api/parent/portfolio`)
- Protected by parent auth
- Return full student record including projects, certifications, gallery, progress logs
- Student must belong to the authenticated parent

### [ ] T8.4 — Create Privacy Settings page (`app/parent/privacy/page.tsx`)
- Toggle switch: "Portfolio is Public" / "Portfolio is Private"
- Description text explaining the difference
- Current status indicator
- Save button with confirmation toast
- Visual preview of how public visitors see the portfolio

### [ ] T8.5 — Update Privacy API (`PUT /api/parent/portfolio/privacy`)
- Protected by parent auth
- Accept `isPortfolioPublic: boolean`
- Update student record
- Return updated status
- Toast: "Portfolio is now [public/private]"

### [ ] T8.6 — Create Certifications page (`app/parent/certifications/page.tsx`)
- List all certifications with:
  - Title, issuer, date
  - Certificate badge/icon
  - Share button (ShareButton component)
  - Share link display (copied to clipboard)
- Success message when link copied

### [ ] T8.7 — Create Certification sharing verification page (`app/verify/cert/[shareLink]/page.tsx`)
- Public page (no auth required)
- Look up certification by shareLink
- Display: student name (or initials based on privacy), certification title, issuer, date
- Verification badge (green checkmark)
- If not found: "Certification not found" message
- API: `GET /api/public/verify/cert/:shareLink`

### [ ] T8.8 — Create Report generation (`GET /api/parent/report`)
- Protected by parent auth
- Generate PDF report with:
  - Student name, age, curriculum
  - Overall progress
  - All completed projects
  - All certifications
  - Skills summary
- Return PDF file for download
- Use `jspdf` library

### [ ] T8.9 — Create Report download page (`app/parent/report/page.tsx`)
- "Download Progress Report" button
- Shows loading state while PDF generates
- Auto-downloads PDF on completion
- Preview of what's included in the report

### [ ] T8.10 — Create Parent Settings page (`app/parent/settings/page.tsx`)
- View profile info (name, email, phone)
- Display access secret (masked, with reveal option)
- Note: "Keep this code secret. It is used to access your child's portfolio."

---

**Progress**: `0 / 10 tasks completed`

**Next**: → [Chapter 9: Admin Dashboard](CHAPTER_09_ADMIN_DASHBOARD.md)

---

*Check tasks by replacing `[ ]` with `[x]` when completed.*
