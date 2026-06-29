# Phase 2c: Admin Enhancements

> **Goal**: Add missing admin features — user management, activity log page, bulk operations.
> **Estimated effort**: 2–3 hours

---

## Task 2c.1 — Admin User Management Page

### Route
`app/(admin)/dashboard/admin-users/page.tsx`

### Features
- List of admin users with name, email, role, last login
- "Add Admin" button → modal with email, name, password fields
- Delete admin button with confirmation modal
- Cannot delete yourself (prevent lockout)
- Role badges (Super Admin / Admin)
- Created at date

### New API Routes
- `GET /api/admin/users` — List admin users
- `POST /api/admin/users` — Create new admin
- `DELETE /api/admin/users/[id]` — Delete admin

### New Files
- `app/(admin)/dashboard/admin-users/page.tsx`
- `app/api/admin/users/route.ts`
- `app/api/admin/users/[id]/route.ts`
- `components/admin/AdminUsersContent.tsx` (optional, if using content pattern)

### Store Updates
- Add admin users to `lib/types.ts`
- Add CRUD functions in `lib/store.ts`
- Seed at least 1 admin user in `data/seed.ts`

---

## Task 2c.2 — Activity Log Page

### Route
`app/(admin)/dashboard/activity/page.tsx`

### Features
- Full activity feed with all logs (not just last 7)
- Filter by type: Student, Project, Certification, Request
- Filter by date range
- Search by description text
- Pagination (20 items per page)
- Each entry shows: action description, type icon, timestamp, user who performed it

### API Dependencies
- `GET /api/activity-log` — Already exists, add filtering/pagination support

### New Files
- `app/(admin)/dashboard/activity/page.tsx`
- `components/admin/ActivityContent.tsx`

### Sidebar Update
Add "Activité" link to `Sidebar.tsx`:
```tsx
{ href: "/dashboard/activity", label: "Activité", icon: Activity }
```

---

## Task 2c.3 — Sidebar Navigation Update

### Add Missing Links
The sidebar currently has 7 links. Add:
- `/{ href: "/dashboard/admin-users", label: "Admin Users", icon: Shield }`
- `/{ href: "/dashboard/activity", label: "Activité", icon: Activity }`

---

## Task 2c.4 — Bulk Operations for Students

### Features
- Checkbox selection in students list
- Batch actions bar:
  - "Change Program" (dropdown with program list)
  - "Toggle Public/Private"
  - "Export Selected as CSV"
- Confirmation dialog for bulk actions

### Implementation
- Add checkbox column to student list
- Manage selected IDs in state
- API endpoint: `POST /api/students/bulk` with action + IDs

---

## Task 2c.5 — Enrollment Processing Enhancements

### Features
- Admin notes field when accepting/rejecting
- Custom message to parent when rejecting
- "Process selected" (batch accept/reject)
- Sort enrollments by date, status, name
- Export filtered enrollments as CSV

---

## Acceptance Criteria

- [ ] Admin users can be added and deleted
- [ ] Activity log page shows full history with filters
- [ ] Sidebar has all navigation links working
- [ ] Bulk operations work for students
- [ ] Enrollment processing has notes and batch actions
- [ ] All confirmations use the ConfirmDialog component (RG12)
