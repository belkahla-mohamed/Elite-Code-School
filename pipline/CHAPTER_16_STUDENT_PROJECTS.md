# Chapter 16: Student Project Management

> **Goal**: Let students add/edit their own projects from their dashboard, with admin approval workflow.

---

## Tasks

### [ ] T16.1 — Student projects API
- GET `/api/student/projects` — list student's projects
- POST `/api/student/projects` — create project (pending approval)
- PATCH `/api/student/projects/[id]` — edit own project
- DELETE `/api/student/projects/[id]` — delete own project

### [ ] T16.2 — Projects page in student dashboard
- "Mes projets" page with list of projects
- Status badges: pending / approved / done / progress
- Add project form (title, description, tags, cover image)
- Edit / delete own projects

### [ ] T16.3 — Admin approval workflow
- New project status: "pending"
- Admin dashboard shows pending projects
- Admin can approve / reject with comment
- Student sees approval status

### [ ] T16.4 — Project detail modal
- Click project to see full details
- Show cover image, tags, progress bar
- Admin comment if rejected

---

**Progress**: `0 / 4 tasks completed`

**Next**: Chapter 17 — Teacher Dashboard Enhancement
