# Chapter 18: Notifications & Activity Log

> **Goal**: Real-time notifications for admin, teachers, and parents. Activity log for all actions.

---

## Tasks

### [ ] T18.1 — Activity log system
- Log actions: create/delete student, accept/reject request, add project/certif
- Store in Supabase `activity_logs` table (or demo store)
- API route `/api/activity-log`

### [ ] T18.2 — Admin activity feed
- Show recent actions in admin dashboard
- Filter by type (student, request, project)
- Timestamp + user who performed action

### [ ] T18.3 — Notification banner
- Toast notifications for: new inscription, project approval, certif added
- Notification bell icon in header
- Badge count for unread

### [ ] T18.4 — Email notifications (Resend)
- Install Resend SDK
- Send email on: inscription received, inscription accepted, project approved
- HTML email template with school branding

---

**Progress**: `0 / 4 tasks completed`

**Next**: Chapter 19 — Dark Mode & Theming
