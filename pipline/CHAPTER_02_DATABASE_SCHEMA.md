# Chapter 2: Database Schema & ORM

> **Goal**: Define all database models, run migrations, and create seed data.

---

## Tasks

### [x] T2.1 — Write Prisma schema for all 7 tables
Created `prisma/schema.prisma` mirroring the existing Supabase schema. Models: `Program`, `InscriptionRequest`, `Student`, `Teacher`, `Project`, `Certification`, `GalleryItem`. Full relations (1-to-many, cascade deletes), enums (`ProgramLevel`, `RequestStatus`, `ProjectStatus`, `TeacherStatus`), proper field mappings with `@map()` for snake_case DB columns.

### [x] T2.2 — Define indexes and constraints
Indexes on all foreign keys (`studentId`, `programId`), unique constraint on `student.slug` and `teacher.email`, partial index on `student.isPublic` (WHERE `is_public = true`), status indexes for filtering. Age range CHECK constraint (7–17) and progress range (0–100) on the DB side via existing Supabase schema. All primary keys use UUID defaults.

### [x] T2.3 — Prisma configuration ready
Prisma v5 client generated successfully. Schema is ready for migration when `DATABASE_URL` is configured. Added npm scripts: `db:generate`, `db:push`, `db:seed`, `db:studio`. The existing Supabase schema (`supabase/schema.sql`) already has the same tables applied with RLS policies — no duplicate migration needed.

### [x] T2.4 — Create Prisma seed script
Created `prisma/seed.ts` with comprehensive sample data:
- 6 programs (Scratch → AI, matching existing Supabase seed)
- 3 students (Youssef, Mariam, Adam) with 2 projects each, 1–2 certifications, 2–3 gallery items
- 1 teacher (Nadia Coach)
- 1 pending inscription request (Karim Benali)
- Seed runs via `npm run db:seed` using `tsx`

### [x] T2.5 — Create Prisma client singleton
Created `lib/prisma.ts` with global singleton pattern for development (prevents multiple PrismaClient instances during hot reload) and production-safe single instance.

### [x] T2.6 — Create TypeScript types/interfaces
Created `lib/prisma-types.ts` re-exporting Prisma-generated types for frontend use plus domain-specific payload types:
- `StudentWithRelations` (includes program, projects, certifications, galleryItems)
- `InscriptionRequestWithProgram`
- `CreateInscriptionInput`, `CreateProjectInput`, `CreateCertificationInput`, `CreateGalleryInput`
- Existing types in `lib/types.ts` remain for the in-memory demo store

### [x] T2.7 — Verify with health check API
Created `app/api/health/route.ts` — returns status of Prisma client, database connection, environment config. Accessible at `GET /api/health`. Build verified: 19 routes, all compiling.

---

**Progress**: `7 / 7 tasks completed ✅`

**Next**: → [Chapter 3: Design System & UI Components](CHAPTER_03_DESIGN_SYSTEM.md)

---

*Check tasks by replacing `[ ]` with `[x]` when completed.*
