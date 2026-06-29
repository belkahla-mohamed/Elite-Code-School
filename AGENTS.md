# AGENTS.md — Elite Code School

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start Next.js dev server |
| `npm run lint` | ESLint (next/core-web-vitals) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run build` | `next build` (requires DATABASE_URL or `hasSupabaseConfig()` to be false) |
| `npm run db:generate` | `prisma generate` |
| `npm run db:push` | `prisma db push` |
| `npm run db:seed` | `tsx prisma/seed.ts` |
| `npx playwright test` | Run E2E tests in `e2e/` |

Verification order: **lint → typecheck → build**.

## Dual data layer

`lib/store.ts` checks `hasSupabaseConfig()` (whether `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` are set). If missing, all data ops fall back to an in-memory demo store seeded from `data/seed.ts`. This means the app works **without any database** for local dev. When Supabase is configured, the store reads/writes directly to Supabase REST API (not Prisma for queries, except health check).

Never import `@/lib/prisma` in API routes — the store layer is the single entry point.

## Auth (custom JWT, no NextAuth / no Supabase Auth)

- **Admin**: password checked against `ADMIN_PASSWORD` env var (fallback `admin123`). Cookie `ecs_admin` set via `lib/auth.ts`.
- **Parent**: email + plaintext secret matched via `parent_secret_hash` (sha256). Cookie `ecs_parent_student` set via `lib/auth.ts`.
- Token format: custom HS256 JWT using `AUTH_COOKIE_SECRET` (fallback `elite-code-school-dev-secret`). Server-side verification in `lib/auth.ts`, edge verification in `middleware.ts`.
- Middleware protects `/admin`, `/dashboard`, `/parent/:path*` routes.
- Client-side auth context stores a separate `ecs_token` in localStorage for API calls (`lib/auth-context.tsx`).

## Route groups

| Group | Paths | Layout |
|---|---|---|
| `(public)` | `/`, `/about`, `/curricula`, `/inscription`, `/contact`, `/login`, `/portfolios/[slug]` | Public header + nav + footer |
| `(auth)` | `/admin-login` | Minimal |
| `(admin)` | `/admin/*`, `/dashboard/*` | Sidebar + admin header |
| `(parent)` | `/parent/*` | Parent portal |

## API routes

All follow the same pattern: validate auth → `validateContentType` (POST/PUT) → Zod parse → call store function → return JSON. Located in `app/api/`.

## Config

- TypeScript: strict mode, `@/*` path alias
- Tailwind: CSS variables for light/dark, custom colors (`body`, `surface`, `ink`, `ink-soft`, `border`), `cn()` utility from `lib/utils.ts`
- shadcn/ui: New York style, `components.json` at root

## Key env vars (`.env.example`)

```
DATABASE_URL, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
SUPABASE_SERVICE_ROLE_KEY, ADMIN_PASSWORD, AUTH_COOKIE_SECRET,
COOKIE_SECURE (true only in prod), NEXT_PUBLIC_APP_URL
```

## DB

Prisma schema (`prisma/schema.prisma`) matches Supabase SQL (`supabase/migrations/`). For actual data storage, the store layer uses Supabase REST API directly (not Prisma). Prisma is used in CI for `prisma generate` and by the health endpoint.

## Testing

- Playwright E2E in `e2e/`. Config at `playwright.config.ts`.
- CI runs with `DATABASE_URL` from secrets (requires real DB).
- Local E2E can run against the in-memory demo store (no DB needed).

## Style conventions

- French UI labels, English code identifiers
- `z.string().trim()` on all Zod string fields
- `catch (e: any)` in API routes
- No semicolons in actual codebase (despite examples above using them — follow existing file style per file)
- No comments in production code unless explaining a non-obvious decision
