# Chapter 1: Project Setup & Foundation

> **Goal**: Initialize the project with all tools, configurations, and dependencies.

---

## Tasks

### [x] T1.1 — Initialize Next.js project with TypeScript & App Router
Next.js 15 with TypeScript, App Router, React 19, Tailwind CSS. Project was already scaffolded with `create-next-app`. Verified: `package.json` has `next: ^15.0.3`, `react: ^19.0.0`, `typescript` dev dependency.

### [x] T1.2 — Configure Tailwind CSS with custom design tokens
`tailwind.config.ts` already exists with full custom theme: 16 color tokens (ink, sky, amber, lime, violet, pink, etc.), 3 font families (Fredoka, Nunito, JetBrains Mono), 2 brand border radii (28px, 16px), and flat shadow values.

### [x] T1.3 — Install and configure Prisma ORM
Prisma v5 installed (`prisma@5`, `@prisma/client@5`). Schema created at `prisma/schema.prisma` mirroring all 7 Supabase tables (Program, InscriptionRequest, Student, Teacher, Project, Certification, GalleryItem) with full relations, enums, indexes. Prisma client generated successfully. Singleton exported from `lib/prisma.ts`.

### [x] T1.4 — Set up project folder structure
Created directories: `components/ui/`, `components/layout/`, `components/forms/`, `components/portfolio/`, `components/admin/`, `public/uploads/avatars/`, `public/uploads/gallery/`, `public/uploads/certificates/`. Pre-existing: `app/`, `lib/`, `prisma/`, `data/`, `supabase/`.

### [x] T1.5 — Configure environment variables
`.env` already exists with Supabase credentials, admin password, auth cookie secret, app URL. Added `DATABASE_URL` entry to `.env.example` for Prisma direct database access.

### [x] T1.6 — Install additional dependencies
Installed: `@prisma/client`, `bcryptjs`, `jsonwebtoken` (already had: `zod`, `lucide-react`, `@supabase/supabase-js`, `clsx`, `tailwind-merge`). Also installed `react-hot-toast`, `@tanstack/react-query`, `date-fns`, `jspdf`, `html2canvas`. Dev deps: `@types/bcryptjs`, `@types/jsonwebtoken`.

### [x] T1.7 — Create global CSS with design tokens
`app/globals.css` already exists with Google Fonts import (Fredoka, Nunito, JetBrains Mono), custom utility classes (`container-shell`, `tag`, `btn-primary`, `btn-outline`, `section-padding`, `card`), and base styles.

### [x] T1.8 — Configure Next.js for image uploads
Updated `next.config.mjs` with `reactStrictMode: true`, `images.remotePatterns` for Supabase and Cloudinary, and AVIF/WebP format optimization.

### [x] T1.9 — Set up git repository
Git initialized with `git init`. `.gitignore` already exists with node_modules, .next, .env, .env.local, .supabase.

---

**Progress**: `9 / 9 tasks completed ✅`

**Next**: → [Chapter 2: Database Schema & ORM](CHAPTER_02_DATABASE_SCHEMA.md)

---

*Check tasks by replacing `[ ]` with `[x]` when completed.*
