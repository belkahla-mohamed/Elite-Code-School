# Chapter 11: Student Dashboard

> **Goal**: Build the student space with missions, badges, progression tracking.

---

## Tasks

### [ ] T11.1 — Student data API
- API route `/api/student/dashboard` returning: student info, enrollments, projects, certifications, missions, badges, progress stats
- Auth guard: only the logged-in student can access their data
- Return structured data for dashboard display

### [ ] T11.2 — Student layout & navigation
- Create `app/(student)/student/dashboard/page.tsx`
- Student sidebar: Dashboard, Mes projets, Certificats, Badges, Mon portfolio
- Header with student avatar + logout

### [ ] T11.3 — Dashboard overview page
- Welcome card with student name, level, hours
- Stats cards: projects done, certifications, badges, current streak
- Quick action buttons: "Voir mon portfolio", "Nouveau projet"
- Progress bar for overall completion

### [ ] T11.4 — Missions & challenges
- Mission cards with status (locked/available/in-progress/completed)
- Mission detail view with requirements
- Progress indicator per mission
- Badge rewards for completing missions

### [ ] T11.5 — Badges & achievements
- Badge grid display (earned vs locked)
- Badge detail: name, description, icon, unlock criteria
- Count and progress toward next badge
- Toast notification when new badge earned

### [ ] T11.6 — My projects page
- List of projects with status, progress, date
- Add project form (for students to suggest)
- Edit/delete own projects (pending admin approval)

### [ ] T11.7 — Real-time progress sync
- Sync student progress to parent portal
- Update hour count when missions complete
- Activity feed: recent actions, new badges, completed projects

---

**Progress**: `0 / 7 tasks completed`

**Next**: Chapter 12 — File Uploads
