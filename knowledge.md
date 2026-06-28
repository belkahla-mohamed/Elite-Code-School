# Elite Code School — Project Context

## Stack
- **Framework**: Next.js 15.5 (App Router)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS + CSS custom properties (dark/light mode)
- **Database**: PostgreSQL (Supabase) + Prisma ORM
- **Auth**: Custom JWT (HS256) with httpOnly cookies
- **File storage**: Supabase Storage
- **Deployment**: Vercel / Railway

## Actors (from Analyse_Elite_Code_School.docx)
1. **Visiteur** - Public unauthenticated (browse offerings, submit enrollment)
2. **Parent** - Authenticated via child access secret (manage portfolio, share certs)
3. **Administrateur** - School admin (process enrollments, manage students)

## Key Routes
- `/` — Home page
- `/inscription` — Enrollment form
- `/login` — Parent login
- `/admin-login` — Admin login
- `/dashboard/*` — Admin dashboard
- `/parent/*` — Parent portal
- `/portfolios/[slug]` — Public student portfolios
- `/curricula` — Program catalog
- `/contact` — Contact page

## Database Models (Prisma)
- `Program` — 6 curricula (Scratch, Robotique mBot, Arduino IoT, Python, Web Dev, IA)
- `InscriptionRequest` — Enrollment requests (pending/accepted/refused)
- `Student` — Student records linked to program, with parent secret
- `Project` — Student projects with status/progress
- `Certification` — Student certifications
- `GalleryItem` — Student gallery photos

## Key Commands
- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run db:push` — Push Prisma schema to DB
- `npm run db:generate` — Generate Prisma client
- `npm run db:studio` — Open Prisma Studio (DB GUI)
