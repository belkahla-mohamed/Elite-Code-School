# Phase 1: Fix Existing Bugs & Issues

> **Goal**: Resolve all known bugs, inconsistencies, and broken functionality in the current codebase.
> **Estimated effort**: 2–3 hours

---

## Task 1.1 — Fix Duplicate Portfolio Routes

### Problem
There are two portfolio route directories:
- `app/(public)/portfolio/[slug]/` — Used by `PortfolioTabs` for internal links
- `app/(public)/portfolios/[slug]/` — Used by the public portfolios grid

This causes 404 errors when navigating between pages.

### Solution
1. Remove `app/(public)/portfolio/[slug]/page.tsx` (keep the `portfolios` version)
2. Update all internal links:
   - In `PortfolioTabs.tsx`: Change `/portfolio/${student.slug}` → `/portfolios/${student.slug}`
   - In `ParentPortal.tsx`: Change `/portfolio/${student.slug}` → `/portfolios/${student.slug}`
   - In `StudentsContent.tsx`: Change `/portfolio/${student.slug}` → `/portfolios/${student.slug}`
3. Keep `app/(public)/portfolios/` as the canonical route

### Files to modify
- `app/(public)/portfolio/` (delete directory)
- `components/PortfolioTabs.tsx`
- `components/ParentPortal.tsx`
- `components/admin/StudentsContent.tsx`
- `components/admin/ProjectsContent.tsx`

---

## Task 1.2 — Fix Enrollment Form Review Step

### Problem
The review step (step 4) in `enrollment-form.tsx` does not display the actual data entered by the user across the previous steps. It only shows generic description text. Additionally, the form does not pass the actual form values into the `ReviewStep` component.

### Solution
1. Pass all form field values to the `ReviewStep` component
2. Display a proper summary table showing:
   - Student first name, last name, age, school level
   - Selected program title
   - Parent phone, email, message
3. Allow going back to edit any field

### Files to modify
- `components/forms/enrollment-form.tsx`

---

## Task 1.3 — Fix QuickContactForm

### Problem
The `QuickContactForm` in `QuickContactForm.tsx` does not actually send data anywhere. It just resets the form and shows a success message, but no API call is made.

### Solution
1. Create a contact API route at `app/api/contact/route.ts`
2. Add Zod validation for contact form data
3. Update `QuickContactForm` to POST to `/api/contact`
4. Store contact messages in the demo store (and Supabase if configured)
5. Show success/error messages based on API response

### Files to modify
- `app/api/contact/route.ts` (new)
- `components/QuickContactForm.tsx`
- `lib/store.ts` (add contact submission function)
- `lib/types.ts` (add ContactMessage type)
- `lib/validation.ts` (add contactSchema)

---

## Task 1.4 — Fix Settings Password Change

### Problem
The Settings page (`SettingsContent.tsx`) has a password change form that only simulates a demo update with a fake timeout. It never actually changes the admin password.

### Solution
1. Create an API route `app/api/auth/admin/password/route.ts`
2. Update the Settings page to call this API
3. The API should verify the current password and update the `ADMIN_PASSWORD` env var (or store hashed password in DB/demo store)
4. Show proper success/error feedback

### Files to modify
- `app/api/auth/admin/password/route.ts` (new)
- `components/admin/SettingsContent.tsx`
- `lib/store.ts` (add password update function)
- `lib/auth.ts` (add updateAdminPassword function)

---

## Task 1.5 — Fix ProgramsContent Data Fetching

### Problem
`ProgramsContent.tsx` expects the API to return `{ programs: [...] }` but the `GET /api/programs` route directly returns an array. This causes empty state to always show.

### Solution
Either:
- Fix `ProgramsContent.tsx` to handle both formats: `data.programs ?? data`
- Or update the API response to wrap in `{ programs: [...] }`

### Files to modify
- `components/admin/ProgramsContent.tsx`

---

## Task 1.6 — Fix PortfolioTabs Skills Section

### Problem
The skills section in `PortfolioTabs.tsx` uses hardcoded skill names and percentages instead of fetching from the student data or API.

### Solution
1. Add a `skills` field or derive skills from the student's program/projects
2. Show meaningful data instead of static values
3. Calculate percentages based on actual project completion

### Files to modify
- `components/PortfolioTabs.tsx`
- `lib/types.ts` (add Skill type)
- `lib/store.ts` (add skills calculation logic)

---

## Task 1.7 — Fix Parent Portal Login State

### Problem
The `ParentPortal.tsx` component has its own login form embedded in the component. But there's also a standalone login page at `app/(public)/login/page.tsx`. The parent portal route (`/parent`) should redirect to login if not authenticated, but the portal also has its own login form.

### Solution
1. Fix the parent layout to redirect to `/login` if not authenticated (middleware should handle this)
2. Remove the embedded login form from `ParentPortal.tsx`
3. Make `ParentPortal.tsx` only render when authenticated (it gets the student data from API)
4. Ensure the middleware properly checks the parent JWT cookie

### Files to modify
- `components/ParentPortal.tsx`
- `middleware.ts`
- `app/(parent)/parent/page.tsx`

---

## Task 1.8 — Fix Missing Parent Portal Pages

### Problem
The `parent-nav.tsx` links to pages that don't exist:
- `/parent/portfolio`
- `/parent/privacy`
- `/parent/certifications`
- `/parent/report`

These routes return 404.

### Solution
Create the missing pages (detailed in Phase 2a).

### Files to modify
- Multiple new files (see Phase 2a plan)

---

## Task 1.9 — Fix Certificate Sharing Copy URL

### Problem
The certificate share feature in `ParentPortal.tsx` copies a URL but this page doesn't exist as a public verification page. The link is useless until the verification page is created.

### Solution
Create the certification verification page (detailed in Phase 2d).

### Files to modify
- Multiple new files (see Phase 2d plan)

---

## Task 1.10 — Fix Missing Inscription Confirmation Page

### Problem
The enrollment form redirects to `/inscription/confirmation` after submission, but we need to verify this page exists and renders properly.

### Solution
1. Check `app/(public)/inscription/confirmation/page.tsx` exists
2. Verify it displays the confirmation message with reference number
3. Ensure it handles edge cases (direct access without submission)

### Files to verify
- `app/(public)/inscription/confirmation/page.tsx`

---

## Acceptance Criteria

- [ ] All portfolio routes use a single canonical path `/portfolios/[slug]`
- [ ] Enrollment form review step shows actual entered data
- [ ] QuickContactForm sends data to an API endpoint
- [ ] Settings password change updates the actual password
- [ ] ProgramsContent displays programs correctly
- [ ] PortfolioTabs skills section shows dynamic data
- [ ] Parent portal works without embedded login form
- [ ] No 404 errors on any parent portal link
- [ ] Build passes with zero TypeScript errors
