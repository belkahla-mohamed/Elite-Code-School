# Chapter 2: Database Schema & ORM

> **Goal**: Define all database models, run migrations, and create seed data.

---

## Tasks

### [ ] T2.1 — Write Prisma schema for all 8 tables
Create the complete Prisma schema (`prisma/schema.prisma`) with all models:

- **Curriculum** — id, title, level, minAge, maxAge, description, contentOverview, price, duration, iconUrl, isActive, timestamps
- **Student** — id, firstName, lastName, dateOfBirth, avatarUrl, parentId (FK), enrollmentStatus, isPortfolioPublic, timestamps
- **Parent** — id, firstName, lastName, email, phone, accessSecret, timestamps
- **Enrollment** — id, student firstName/lastName/DOB, parent name/email/phone, curriculumId (FK), status, adminNotes, processedBy, processedAt, timestamps
- **Project** — id, studentId (FK), title, description, status, progressPercentage, startedAt, completedAt, mediaUrls (JSON), timestamps
- **Certification** — id, studentId (FK), title, issuer, issuedAt, certificateUrl, isShareable, shareLink, timestamps
- **GalleryItem** — id, studentId (FK), imageUrl, caption, uploadedBy, sortOrder, timestamps
- **ProgressLog** — id, studentId (FK), skillCategory, skillName, levelAchieved, notes, recordedAt
- **AdminUser** — id, email, passwordHash, firstName, lastName, role, timestamps

### [ ] T2.2 — Define indexes and constraints
Add proper indexes for foreign keys, unique constraints (parent email, shareLink), CHECK constraints (age 7-17, progress 0-100), and default values.

### [ ] T2.3 — Run Prisma migration
Generate and run the initial migration to create all tables in PostgreSQL.

### [ ] T2.4 — Create Prisma seed script
Write `prisma/seed.ts` with sample data:
- 3 curricula (Beginner Robotics, Intermediate Coding, Advanced AI)
- 1 admin user
- 5-10 sample students with parents
- Sample projects, certifications, gallery items

### [ ] T2.5 — Create Prisma client singleton
Create `lib/prisma.ts` with a singleton Prisma client instance (prevents multiple instances in development).

### [ ] T2.6 — Create TypeScript types/interfaces
Generate or write TypeScript types matching the Prisma models for use in the frontend (response types, form input types, etc.).

### [ ] T2.7 — Verify seed data with a test query
Write a simple script or API route to confirm data can be read from all tables.

---

**Progress**: `0 / 7 tasks completed`

**Next**: → [Chapter 3: Design System & UI Components](CHAPTER_03_DESIGN_SYSTEM.md)

---

*Check tasks by replacing `[ ]` with `[x]` when completed.*
