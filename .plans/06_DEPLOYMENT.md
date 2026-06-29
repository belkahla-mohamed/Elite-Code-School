# Phase 6: Deployment

> **Goal**: Deploy the application to production with proper database, environment configuration, monitoring, and documentation.
> **Estimated effort**: 3–4 hours

---

## Overview

This phase covers everything needed to take the application from development to production: infrastructure setup, environment configuration, deployment, monitoring, and handoff documentation.

---

## Task 6.1 — Production Database Setup

### Options
| Provider | Cost | Notes |
|----------|------|-------|
| **Supabase** (current) | Free tier | Already configured, schema exists |
| **Railway PostgreSQL** | $5/month | Good for production |
| **Vercel Postgres** | Free tier | Native Vercel integration |
| **Neon** | Free tier | Serverless Postgres, branching |

### Recommendation
Use **Supabase** (already configured in the project) for production. The schema is already in `supabase/schema.sql`.

### Steps
1. Create Supabase project for production
2. Run `supabase/schema.sql` migrations
3. Run `prisma/seed.ts` for initial data
4. Enable RLS policies if needed
5. Configure connection pooling (PgBouncer)

---

## Task 6.2 — Environment Configuration

### Required Variables
```
# Database
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://... (for migrations)

# Auth
AUTH_COOKIE_SECRET=<random 64-char string>
ADMIN_PASSWORD=<strong admin password>
COOKIE_SECURE=true

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# App
NEXT_PUBLIC_SITE_URL=https://elitecodeschool.ma
NEXT_PUBLIC_APP_URL=https://elitecodeschool.ma

# Optional
RESEND_API_KEY=re_... (for email)
SENTRY_DSN=https://... (for error tracking)
```

### Steps
1. Generate `AUTH_COOKIE_SECRET`: `openssl rand -hex 32`
2. Set strong `ADMIN_PASSWORD`
3. Configure all Supabase credentials
4. Set `NODE_ENV=production`

---

## Task 6.3 — File Storage Configuration

### Current State
File uploads use Supabase Storage with the `ecs-uploads` bucket.

### Production Steps
1. Ensure `ecs-uploads` bucket exists in production Supabase
2. Set bucket to public (for public portfolio images)
3. Configure CORS policies if needed
4. Set file size limit (5MB)

---

## Task 6.4 — Choose Deployment Platform

### Options
| Platform | Pros | Cons |
|----------|------|------|
| **Vercel** | Best Next.js support, free tier, automatic SSL | Cold starts on free tier |
| **Railway** | Good for full-stack, easy DB setup | More expensive |
| **Docker + VPS** | Full control | More maintenance |

### Recommendation
**Vercel** for the Next.js app + **Supabase** for database and storage.

### Vercel Setup Steps
1. Push code to GitHub (`git push origin main`)
2. Import repository in Vercel dashboard
3. Configure environment variables
4. Set build command: `npm run build`
5. Set output directory: `.next`
6. Deploy
7. Configure custom domain (if applicable)

---

## Task 6.5 — Run Database Migrations

### Steps
1. Ensure `DATABASE_URL` points to production database
2. Run `npx prisma db push` to sync schema
3. Run `npx prisma db seed` for initial data
4. Verify tables are created correctly

### Docker Compose Alternative (for Railway)
Create `docker-compose.yml`:
```yaml
version: "3.8"
services:
  app:
    build: .
    ports:
      - "3000:3000"
    env_file: .env
  db:
    image: postgres:16
    environment:
      POSTGRES_DB: elite_code_school
      POSTGRES_PASSWORD: ${DB_PASSWORD}
```

---

## Task 6.6 — Post-Deployment Verification

### Functional Checklist
- [ ] Home page loads and is responsive
- [ ] Public pages load (About, Curricula, Portfolios, Contact)
- [ ] Enrollment form submits successfully
- [ ] Admin login works
- [ ] Admin dashboard loads with correct data
- [ ] Student CRUD operations work
- [ ] Program CRUD operations work
- [ ] Enrollment accept/reject works
- [ ] File uploads work
- [ ] Dark mode toggle works
- [ ] PDF generation works
- [ ] CSV export works
- [ ] All API endpoints respond correctly

### Performance Checklist
- [ ] Lighthouse score > 80 (Mobile)
- [ ] Lighthouse score > 90 (Desktop)
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] No console errors
- [ ] Images are optimized (WebP, lazy loading)

---

## Task 6.7 — Monitoring & Error Tracking

### Sentry Setup
1. Create Sentry account (sentry.io)
2. Install `@sentry/nextjs`
3. Configure `SENTRY_DSN` in environment
4. Add basic error tracking

### Uptime Monitoring
1. Set up Better Uptime or similar
2. Monitor `/api/health` endpoint
3. Configure alert for downtime

### Logging
1. Enable Vercel logs (built-in)
2. Add structured logging to API routes
3. Log errors with context (request path, params, user)

---

## Task 6.8 — Backup Strategy

### Database Backups
- Supabase: Automatic daily backups (Pro plan)
- Optional: `pg_dump` script for manual backups
- Store backups in cloud storage (S3, Google Cloud)

### File Storage Backups
- Supabase Storage: Included in backup
- Optional: sync to secondary bucket

### Schedule
- Daily: Database backup
- Weekly: Full backup (DB + files)
- Monthly: Archived backup

---

## Task 6.9 — CI/CD Pipeline

### GitHub Actions
The project already has `.github/workflows/ci.yml`. Enhance it:

```yaml
name: CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "npm"
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
        env:
          # Test environment variables

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: "--prod"
```

---

## Task 6.10 — Handoff Documentation

### Update README.md
Add comprehensive setup instructions:
```markdown
# Elite Code School

## Quick Start
1. Clone repo: `git clone ...`
2. Install: `npm install`
3. Copy `.env.example` to `.env`
4. Start: `npm run dev`

## Environment Variables
[List all variables with descriptions]

## Deployment
1. Push to GitHub
2. Import to Vercel
3. Configure environment variables
4. Deploy

## Admin Access
- URL: https://app.elitecodeschool.ma/admin-login
- Password: [configured in env]

## Parent Test Account
- Email: parent@example.com
- Secret: [generated after enrollment accept]
```

### Create ADMIN_GUIDE.md
- How to manage enrollments
- How to manage students
- How to add projects/certifications
- How to manage programs
- How to change admin password
- How to export data

---

## Acceptance Criteria

- [ ] Application is deployed to production URL
- [ ] HTTPS is configured (automatic with Vercel)
- [ ] Custom domain is pointing to the app (if applicable)
- [ ] Database is running with production data
- [ ] File uploads work in production
- [ ] Environment variables are configured
- [ ] CI/CD pipeline runs on push
- [ ] Error tracking is configured (Sentry)
- [ ] Uptime monitoring is active
- [ ] Backups are configured
- [ ] README is updated with setup instructions
- [ ] Admin guide is ready
- [ ] All pages load and work in production
