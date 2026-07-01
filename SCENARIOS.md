# SCENARIOS.md — Elite Code School State Machine & Workflows

> Ground-truth document aligning the entire platform with the official
> functional requirements (Analyse_Elite_Code_School_2.docx).
>
> **Three actors only**: Visiteur, Administrateur, Parent.
> **No Teacher role. No Student login.**

---

## 1. ACTOR DEFINITIONS

| Actor | Auth | Session | Privileges |
|---|---|---|---|
| **Visiteur** | None (public) | None | Browse catalog, submit inscription request, view public portfolios |
| **Administrateur** | Email + password → `ecs_admin` cookie (JWT, 8h) | Server + Edge middleware | **RG11**: Sole data creation/modification/deletion authority |
| **Parent** | Email + access secret → `ecs_parent_student` cookie (JWT, 7d) | Server + Edge middleware | **Read-only** dashboard, portfolio view, privacy toggle, PDF download, cert sharing |

---

## 2. VISITEUR WORKFLOW

```
  ┌──────────────┐
  │  Landing     │  /  (homepage)
  │  /about      │
  │  /curricula  │  course catalog filtered by age group:
  │              │    • 7-10 ans  → Cursus débutant
  │              │    • 11-14 ans → Cursus intermédiaire
  │              │    • 15-17 ans → Cursus avancé
  └──────┬───────┘
         │
  ┌──────▼───────┐
  │  Portfolio   │  /portfolios/[slug]
  │  (public)    │  viewable only if student.isPublic === true
  │              │  otherwise returns 404
  └──────┬───────┘
         │
  ┌──────▼───────┐
  │  Inscription │  /inscription
  │  3-step form │  1. Student identity + age
  │              │  2. Course selection (from catalog)
  │              │  3. Parent contact info
  │              │
  │  RG2: Does   │  → POST /api/inscriptions
  │  NOT create  │  → status: "pending" (staging table)
  │  Student     │  → Admin notified via email
  └──────┬───────┘
         │
  ┌──────▼───────┐
  │  Confirmation│  /inscription/confirmation?id=...
  │              │  "Your request is being processed"
  └──────────────┘
```

### RG4: Age Constraints
- Minimum: **7 years old**
- Maximum: **17 years old**
- Enforced at form input, API Zod validation, DB `CHECK` constraint
- Programs filtered by age range (débutant 7-10, intermédiaire 11-14, avancé 15-17)

---

## 3. ADMINISTRATEUR WORKFLOW

```
  ┌──────────────┐
  │  Login       │  /admin-login
  │              │  email + password (ADMIN_PASSWORD env var)
  │              │  rate-limited: 5 attempts / 60s per IP
  │              │  → ecs_admin cookie (httpOnly, 8h)
  │              │  → redirect /dashboard
  └──────┬───────┘
         │
  ┌──────▼───────────────┐
  │  Dashboard           │  /dashboard
  │  Metrics             │  total students, new arrivals, pending reqs
  │  Quick links         │  to all management sections
  └──────┬───────────────┘
         │
  ┌──────▼───────────────┐
  │  Pending Inscriptions│  /admin/enrollments
  │                      │  table/card view, filter by status
  │                      │  batch select
  │                      │
  │  ┌─ Accept ──────────────────────────────────────────┐
  │  │  1. Status → "accepted"                            │
  │  │  2. Create Student record (permanent dossier)      │
  │  │     • slug auto-generated                          │
  │  │     • RG5: auto-assign levelLabel from program      │
  │  │     • age validated (7-17)                         │
  │  │     • isPublic = true (default)                    │
  │  │  3. Generate high-entropy access secret:           │
  │  │     • crypto.randomBytes(9) → base64url → 12 chars │
  │  │     • hash with SHA-256 → parentSecretHash         │
  │  │  4. Create Parent record (email + secretHash)      │
  │  │  5. Send email to parent with plaintext secret     │
  │  │  6. Display secret ONCE to admin (UI flash)        │
  │  │  7. Activity logged + notification created          │
  │  └───────────────────────────────────────────────────┘
  │  ┌─ Refuse ──────────────────────────────────────────┐
  │  │  1. Status → "refused"                             │
  │  │  2. Optional rejection message + admin notes       │
  │  │  3. Activity logged                                 │
  │  └───────────────────────────────────────────────────┘
  └──────┬───────────────┘
         │
  ┌──────▼───────────────┐
  │  Student Management  │  /admin/students
  │                      │  CRUD: Create, Read, Update, Delete
  │  RG12: Deletion      │  • Modal confirmation required
  │  irreversible        │  • Cascade: projects, certs, gallery all removed
  │                      │  • No soft-delete, no undo
  └──────┬───────────────┘
         │
  ┌──────▼───────────────┐
  │  Portfolio Enrichment│  /admin/students/[id]
  │  (Admin ONLY - RG11) │
  │                      │  • Add projects (status: completed|in_progress
  │                      │    + avancement % when in_progress)
  │                      │  • Upload gallery photos
  │                      │  • Add certifications
  └──────┬───────────────┘
         │
  ┌──────▼───────────────┐
  │  Programs / Categories│ /admin/curricula, /dashboard/categories
  │  CRUD                 │ full create/read/update/delete
  └───────────────────────┘
```

### RG11 — Creation Privilege Enforcement
All mutation endpoints (`POST`, `PUT`, `PATCH`, `DELETE`) in:
- `/api/students/*`
- `/api/programs/*`
- `/api/categories/*`
- `/api/students/[id]/projects`
- `/api/students/[id]/certifications`
- `/api/students/[id]/gallery`

Must verify `isAdminAuthenticated()` before proceeding. Parents can never create/modify data.

### RG12 — Deletion Safety
- Every destructive action shows a modal with explicit confirmation text
- Deletion is irreversible: no recycle bin, no soft-delete
- Cascade deletes related child records (projects, certifications, gallery)

---

## 4. PARENT WORKFLOW

```
  ┌──────────────┐
  │  Login       │  /login
  │              │  email + 12-char access secret
  │              │  rate-limited: 10 attempts / 60s per IP
  │              │  secret verified against parentSecretHash (SHA-256)
  │              │  → ecs_parent_student cookie (JWT, 7d)
  │              │  → redirect /parent
  └──────┬───────┘
         │
  ┌──────▼──────────────────┐
  │  Parent Dashboard       │  /parent
  │  (Read-only portfoilo)  │
  │                         │  • Student profile card
  │  ZERO creation powers   │  • Stats (projects, certs, hours)
  │                         │  • Quick links to sub-pages
  └──────┬──────────────────┘
         │
  ┌──────▼──────┐   ┌──────▼───────┐   ┌──────▼──────┐
  │  Portfolio  │   │  Planning    │   │  Certificats│
  │  /parent/   │   │  /parent/    │   │  /parent/   │
  │  portfolio  │   │  planning    │   │certifications│
  │             │   │              │   │             │
  │  View       │   │  Séances     │   │  Share via  │
  │  projects,  │   │  progression │   │  WhatsApp / │
  │  gallery    │   │  calendar    │   │  LinkedIn   │
  └─────────────┘   └──────────────┘   └──────┬──────┘
                                              │
  ┌──────────────┐   ┌──────────────────┐     │
  │  Privacy     │   │  Report (PDF)    │     │
  │  /parent/    │   │  /parent/report  │     │
  │  privacy     │   │                  │     │
  │              │   │  Download        │     │
  │  RG8: Toggle │   │  comprehensive   │     │
  │  isPublic    │   │  progress report │     │
  │  true/false  │   │  as PDF          │     │
  └──────────────┘   └──────────────────┘     │
                                              │
         ┌────────────────────────────────────┘
         │
  ┌──────▼──────────────────────────────────────────┐
  │  RG8 — Privacy State Machine                    │
  │                                                 │
  │  ┌─────────┐    toggle     ┌──────────┐        │
  │  │ Public  │ ────────────→ │  Private │        │
  │  │         │ ←──────────── │          │        │
  │  │ isPublic│    toggle     │ isPublic │        │
  │  │ = true  │               │ = false  │        │
  │  └────┬────┘               └────┬─────┘        │
  │       │                        │               │
  │       │ /portfolios/[slug]     │ /portfolios/  │
  │       │ accessible to ANYONE   │ [slug]        │
  │       │                        │ BLOCKED       │
  │       │                        │ (403 unless   │
  │       │                        │  parent JWT   │
  │       │                        │  matches      │
  │       │                        │  studentId)   │
  └────────────────────────────────────────────────┘
```

### RG8 — IDOR Protection for Private Portfolios
The `/api/portfolio/[slug]` endpoint implements a strict chain:
1. If `isPublic === true` → allow access to anyone
2. If `isPublic === false` → check for valid `ecs_parent_student` JWT
3. If JWT present, verify `payload.studentId` matches the target student's ID
4. If mismatch → return **403 Unauthorized**, not 404 (avoid information leakage)

---

## 5. DATA STATE MACHINE

### InscriptionRequest States

```
                    ┌──────────┐
                    │  PENDING │  ← initial state on form submission
                    └────┬─────┘
                         │
              ┌──────────┼──────────┐
              │                     │
              ▼                     ▼
        ┌──────────┐         ┌──────────┐
        │ ACCEPTED │         │ REFUSED  │  ← terminal state
        └────┬─────┘         └──────────┘
             │
             │ Creates:
             │  • Student record (permanent)
             │  • Parent record (with hashed secret)
             │  • Sends email with access secret
             ▼
        ┌──────────┐
        │  ACTIVE  │  Student dossier — now manageable by Admin
        └──────────┘
```

- **PENDING** → ACCEPTED: Admin click "Accept"
- **PENDING** → REFUSED: Admin click "Refuse" (optional reason)
- ACCEPTED and REFUSED are **terminal** — no transition back to PENDING

### Student Privacy States

```
                    ┌──────────┐
                    │  PUBLIC  │  default on creation (isPublic = true)
                    └────┬─────┘
                         │
                    toggle (parent-only action)
                         │
                    ┌────▼─────┐
                    │  PRIVATE │  isPublic = false
                    └────┬─────┘
                         │
                    toggle (parent-only action)
                         │
                    ┌────▼─────┐
                    │  PUBLIC  │
                    └──────────┘
```

### Project States

```
                    ┌──────────────┐
                    │  IN_PROGRESS │  initial (avancement 0-99%)
                    └──────┬───────┘
                           │
                    Admin marks complete
                           │
                    ┌──────▼───────┐
                    │  COMPLETED   │  avancement = 100%
                    └──────────────┘
```

- Only two states: `"in_progress"` and `"completed"`
- `avancement` (integer 0-100) is meaningful only when `status === "in_progress"`
- When status changes to `"completed"`, avancement is set to 100

---

## 6. AGE GROUP → CURRICULUM MAPPING (RG5)

| Age | Cursus | Program Level Filter |
|-----|--------|---------------------|
| 7–10 | Débutant | `level: "debutant"` |
| 11–14 | Intermédiaire | `level: "intermediaire"` |
| 15–17 | Avancé | `level: "avance"` |

When admin accepts an inscription, the student's `levelLabel` is auto-assigned from the selected program's level, not manually entered.

---

## 7. MIDDLEWARE PROTECTION MAP

```
Edge Middleware (middleware.ts) — runs on matcher paths
┌─────────────────────────────────────────────────────┐
│  /admin/*, /dashboard/*  → requires ecs_admin cookie │
│  /parent/*                → requires ecs_parent JWT  │
│  /api/*                   → excluded from middleware │
│                              (API routes self-auth)  │
└─────────────────────────────────────────────────────┘
```

API routes authenticate individually:
- Admin-only endpoints call `isAdminAuthenticated()`
- Parent-only endpoints call `getParentStudentId()`
- Public endpoints have no auth check

---

## 8. CROSS-CUTTING RULES

| Rule | Enforced At | Implementation |
|---|---|---|
| **RG2**: Inscription → staging only | Store layer | `createInscriptionRequest` creates pending request, not student |
| **RG3**: Accept → create dossier | Store layer | `acceptInscriptionRequest` creates Student + Parent atomically |
| **RG4**: Age 7-17 | Form + Zod + DB | `z.number().int().min(7).max(17)`, DB `CHECK (age BETWEEN 7 AND 17)` |
| **RG5**: Auto-assign curriculum | Store layer | `levelLabel` derived from program on acceptance |
| **RG6**: Project status + avancement | Types + Zod | `status: "completed" \| "in_progress"`, `avancement: 0-100` |
| **RG7**: Public by default | Store + DB | `Student.isPublic` defaults to `true` |
| **RG8**: Privacy + IDOR | API + Middleware | `portfolio/[slug]` checks JWT ownership for private portfolios |
| **RG11**: Admin-only mutations | API routes | `isAdminAuthenticated()` guard on all POST/PUT/PATCH/DELETE |
| **RG12**: Irreversible deletion | UI + Store | Modal confirmation, cascade delete, no undo |
| **Secrets**: crypto.randomBytes | Auth lib | `generateAccessSecret()` uses `crypto.randomBytes`, never `Math.random` |
| **No Teacher role** | Schema | `teachers` table removed from Supabase migration, no Prisma model |
| **No Student login** | Auth | No student auth flow, no student password field anywhere |

---

## 9. AUDIT FINDINGS (Pre-Refactoring)

| # | Issue | Location | Severity |
|---|---|---|---|
| 1 | `teachers` table exists | `supabase/migrations/` | High — remove |
| 2 | `Math.random` in ID generation | `lib/activity-log.ts`, `lib/upload.ts` | Medium — use `crypto.randomBytes` |
| 3 | `ProjectStatus` has `planned` and `pending` | `lib/types.ts` | High — must be `completed \| in_progress` |
| 4 | Inscription acceptance not transactional (Supabase path) | `lib/store.ts` | Medium — risk of partial writes |
| 5 | Parent create doesn't display secret once to admin | `lib/store.ts` | Medium — UX gap |
| 6 | Portfolio private check returns 404 not 403 | `api/portfolio/[slug]` | Low — security hardening |

---

*This document is the single source of truth for system behavior.
All code changes must align with the workflows described above.*
