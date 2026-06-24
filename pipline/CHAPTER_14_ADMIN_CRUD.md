# Chapter 14: Admin CRUD Complete

> **Goal**: Full admin CRUD: edit/delete students, programs, email notifications.

---

## Tasks

### [ ] T14.1 — Edit student info
- Admin form to edit: name, age, program, level, hours, parent email
- PATCH API route `/api/students/[id]`
- Auto-fill form with existing data
- Save confirmation with toast

### [ ] T14.2 — Delete student with confirmation
- Delete button in student detail
- ConfirmDialog before deletion
- DELETE API route `/api/students/[id]`
- Cascade: delete projects, certs, gallery
- Redirect to students list after delete

### [ ] T14.3 — CRUD for programs
- Add program form in admin curricula page
- Edit program (name, age, level, price, description, icon, color)
- Delete program with confirmation

### [ ] T14.4 — Email notifications
- Install nodemailer or use Resend API
- Send email when: inscription request received
- Send email when: inscription accepted (with parent secret)
- Send email when: new project/certif added
- Email template with school branding

### [ ] T14.5 — Admin activity log
- Log all admin actions: create/delete student, accept/reject request
- Display in admin dashboard as recent activity feed
- Timestamp + action description

### [ ] T14.6 — Bulk operations
- Select multiple students
- Bulk change program
- Bulk toggle public/private

---

**Progress**: `0 / 6 tasks completed`

**Next**: Chapter 15 — Security & Performance
