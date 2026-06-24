# Chapter 9: Admin Dashboard

> **Goal**: Build the complete admin management dashboard.

---

## Tasks

### [ ] T9.1 — Create Admin Dashboard page (`app/admin/page.tsx`)
- Stats cards row: Total Students, New This Month, Pending Enrollments, Retention Rate
- Recent enrollments widget (last 5 pending)
- Quick action buttons: "Process Enrollments", "Add Student", "Manage Curricula"
- Activity feed (recent actions)

### [ ] T9.2 — Create Admin Dashboard API (`GET /api/admin/dashboard`)
- Return: total students count, new students (this month), pending enrollments count, recent enrollments, quick stats

### [ ] T9.3 — Create Student management page (`app/admin/students/page.tsx`)
- Table of all students: avatar, name, age, curriculum, status, parent email
- Search bar (by name)
- Filter by status (active/completed/withdrawn)
- "Add Student" button
- Row click → student detail page

### [ ] T9.4 — Create Student CRUD API
- `GET /api/admin/students` — list with search & filter
- `POST /api/admin/students` — create student + parent record
- `GET /api/admin/students/:id` — full student detail with relations
- `PUT /api/admin/students/:id` — update student info
- `DELETE /api/admin/students/:id` — soft or hard delete with confirmation (RG12)

### [ ] T9.5 — Create Student Detail page (`app/admin/students/[id]/page.tsx`)
- Student info section (editable fields)
- Portfolio preview (similar to public view)
- Management sections:

### [ ] T9.6 — Create Project management (admin)
- `components/forms/ProjectForm.tsx` — title, description, status (in_progress/completed), progress %, media upload
- `POST /api/admin/students/:id/projects` — add project (RG10)
- `PUT /api/admin/projects/:id` — update project
- `DELETE /api/admin/projects/:id` — delete with confirmation
- UI: list of projects with edit/delete actions

### [ ] T9.7 — Create Certification management (admin)
- `components/forms/CertificationForm.tsx` — title, issued date, certificate file upload
- `POST /api/admin/students/:id/certifications` — add certification (RG10)
- `DELETE /api/admin/certifications/:id` — delete with confirmation
- UI: list of certifications with delete actions
- Auto-generate `shareLink` when created

### [ ] T9.8 — Create Gallery management (admin)
- `POST /api/admin/students/:id/gallery` — upload image (RG10)
- `DELETE /api/admin/gallery/:id` — delete image with confirmation
- UI: drag-and-drop upload zone, grid of current photos, delete button on each photo
- Image optimization on upload (resize, compress)

### [ ] T9.9 — Create Curriculum management (`app/admin/curricula/page.tsx`)
- CRUD for curricula
- `components/forms/CurriculumForm.tsx` — all curriculum fields
- List view with edit/delete actions
- Confirmation modal before delete (RG12)

### [ ] T9.10 — Create Admin User management (`app/admin/users/page.tsx`)
- List of admin users
- Create new admin (email, name, password)
- Delete admin (confirmation, prevent deleting yourself)
- No editing (delete + recreate)

### [ ] T9.11 — Create enrollment processing UI (if not done in Ch6)
- Ensure enrollment accept/reject with confirmation modals
- Admin notes field when processing
- Success/error toasts

### [ ] T9.12 — Implement confirmation modals for all destructive actions (RG12)
- Delete student → "Are you sure you want to delete [Student Name]? This action is irreversible."
- Delete project → "This project will be permanently removed from the portfolio."
- Delete certification → similar
- Delete gallery image → similar
- Reject enrollment → "This will notify the parent of rejection."

### [ ] T9.13 — Create Activity Log (optional)
- `GET /api/admin/logs` — return recent admin actions
- Log actions: enrollment processed, student created, project added, etc.
- Display in dashboard and dedicated logs page

---

**Progress**: `0 / 13 tasks completed`

**Next**: → [Chapter 10: Deployment & Polish](CHAPTER_10_DEPLOYMENT_POLISH.md)

---

*Check tasks by replacing `[ ]` with `[x]` when completed.*
