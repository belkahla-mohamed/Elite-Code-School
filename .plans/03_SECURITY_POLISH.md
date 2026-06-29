# Phase 3: Security & Polish

> **Goal**: Audit and harden security, add CSRF protection, improve error handling, loading states, and responsive design.
> **Estimated effort**: 3–4 hours

---

## Overview

This phase focuses on making the application production-ready by addressing security vulnerabilities, improving user experience with proper loading states and error handling, and ensuring responsive design works across all devices.

---

## Task 3.1 — CSRF Protection

### Problem
The application has no CSRF protection. Mutation endpoints (POST, PATCH, DELETE) could be targeted by cross-site request forgery attacks.

### Solution
1. Generate CSRF token on login and store in cookie
2. Add CSRF token to all mutation requests
3. Validate CSRF token on server side for all mutations
4. Skip CSRF for public endpoints (enrollment submission with rate limiting)

### Implementation
```typescript
// lib/csrf.ts
export function generateCsrfToken(): string { /* random token */ }
export function validateCsrfToken(token: string): boolean { /* compare */ }
```

### Files to create/modify
- `lib/csrf.ts` (new)
- `lib/auth.ts` (add CSRF token to login response)
- `middleware.ts` (validate CSRF on mutations)
- All API routes with mutations (add CSRF check)

---

## Task 3.2 — XSS Sanitization Audit

### Problem
User-submitted content (names, messages, descriptions) is rendered directly without sanitization in some places.

### Solution
1. Use `escapeHtml()` from `lib/xss-utils.ts` everywhere user content is displayed
2. Add HTML escaping to all dynamic content in:
   - Portfolio pages (projects, certifications descriptions)
   - Admin pages (student names, notes)
   - Contact form messages
3. Never use `dangerouslySetInnerHTML` with user content

### Files to audit
- `app/(public)/portfolios/[slug]/page.tsx`
- `app/(public)/contact/page.tsx`
- `app/(admin)/admin/students/[id]/page.tsx`
- `components/PortfolioTabs.tsx`
- `components/ParentPortal.tsx`

---

## Task 3.3 — Error Boundaries

### Problem
Components are not wrapped in error boundaries. A rendering error in one component can crash the entire page.

### Solution
1. Create a generic `ErrorBoundary` component (already exists as `components/ui/error-boundary.tsx`)
2. Wrap each major section in an error boundary:
   - Portfolio tabs
   - Admin dashboard widgets
   - Enrollment form steps
   - Parent portal sections
3. Each error boundary shows a friendly message with retry button

### Implementation Pattern
```tsx
<ErrorBoundary fallback={<p>Section temporairement indisponible</p>}>
  <PortfolioTabs student={student} />
</ErrorBoundary>
```

---

## Task 3.4 — Loading States & Skeletons

### Problem
Many pages show simple "Chargement..." text instead of proper skeletons.

### Solution
1. Replace all "Chargement..." text with skeleton components
2. Create additional skeleton variants:
   - `FormSkeleton` — for forms with fields
   - `TableSkeleton` — for data tables
   - `CardGridSkeleton` — for card grids
   - `DetailSkeleton` — for detail pages
3. Add loading states to:
   - Portfolio detail page
   - Student detail page (admin)
   - Curricula pages
   - All parent portal pages

### Skeleton Component Already Exists
`components/ui/skeleton.tsx` has `Skeleton` and `CardSkeleton`. Create more variants.

---

## Task 3.5 — Button Loading States

### Problem
Some buttons don't disable during async operations, allowing double-clicks.

### Solution
1. Audit all form submit buttons
2. Ensure all use `isLoading` or `disabled` state
3. Prevent double-submission:
   - Disable button immediately on click
   - Show spinner
   - Re-enable on error
4. Pages to fix:
   - `components/forms/enrollment-form.tsx` (submit button)
   - `components/admin/InscriptionsContent.tsx` (accept/reject buttons)
   - `components/ParentPortal.tsx` (PDF download, privacy toggle)

---

## Task 3.6 — Responsive Design Audit

### Problem
Some pages break at mobile widths (375px).

### Solution
1. Test every page at 375px, 768px, 1280px
2. Fix specific issues:
   - Admin sidebar: ensure collapsible works on mobile
   - Enrollment form: make fields full-width on mobile
   - Portfolio grid: 1 column on mobile, 2 on tablet, 3 on desktop
   - Admin tables: horizontal scroll on mobile
   - Modal/dialogs: full-width on mobile with padding
   - Buttons: minimum 44px touch targets
3. Ensure no horizontal scroll on any page

---

## Task 3.7 — Consistent Error Responses

### Problem
API error responses are inconsistent — some return `{ error: string }`, others return `{ message: string }`.

### Solution
Create a shared error response utility:
```typescript
// lib/api-utils.ts
export function apiError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export function apiSuccess(data: Record<string, unknown>, status = 200) {
  return NextResponse.json(data, { status });
}
```

Update all API routes to use these utilities.

---

## Task 3.8 — Form Validation Audit

### Problem
Not all forms have proper client-side validation feedback.

### Solution
1. Add inline error messages under fields
2. Add `aria-invalid` and `aria-describedby` for accessibility
3. Validate on blur (not just on submit)
4. Pages to audit:
   - Login page (parent + admin)
   - Enrollment form (all steps)
   - Contact form
   - Admin forms (student edit, program create)

---

## Task 3.9 — Accessibility Improvements

### Items
1. Add `aria-label` to icon buttons
2. Add `role="alert"` to error messages
3. Add `aria-live="polite"` to toast notifications
4. Ensure all form inputs have associated labels
5. Add keyboard navigation support to tabs
6. Add focus trap to modals
7. Respect `prefers-reduced-motion` (already in globals.css)

---

## Acceptance Criteria

- [ ] CSRF protection is active on all mutation endpoints
- [ ] User content is sanitized before display
- [ ] Error boundaries prevent full-page crashes
- [ ] All pages have proper loading skeletons
- [ ] All buttons disable during async operations
- [ ] All pages render correctly at 375px width
- [ ] API error responses are consistent
- [ ] Form validation shows inline errors
- [ ] Accessibility: labels, roles, keyboard nav, focus management
