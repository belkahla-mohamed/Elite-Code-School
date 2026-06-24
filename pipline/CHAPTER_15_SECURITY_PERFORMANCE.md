# Chapter 15: Security & Performance

> **Goal**: Rate limiting, loading skeletons, Zod validation, responsive polish.

---

## Tasks

### [ ] T15.1 — Rate limiting
- Add rate limiting to: `/api/auth/*`, `/api/inscriptions`
- Use `upstash-rate-limiter` or in-memory Map
- Return 429 with retry-after header
- Prevent brute force on login

### [ ] T15.2 — Loading skeletons
- Create skeleton components matching card shapes
- Replace "Chargement..." text everywhere
- Skeleton for: student list, portfolio tabs, admin stats cards
- Animated shimmer effect

### [ ] T15.3 — Zod validation audit
- Create full validation schemas in `lib/validation.ts`
- All API routes validate input with Zod
- Inline error messages under form fields
- Disable submit until form is valid

### [ ] T15.4 — Responsive design polish
- Test all pages at 375px, 768px, 1280px
- Fix admin sidebar collapse on mobile
- Fix enrollment form on small screens
- Ensure 44x44px touch targets on mobile

### [ ] T15.5 — Error boundaries everywhere
- Add error boundaries to all page sections
- Fallback UI per section (not full page crash)
- Log errors to console for debugging

### [ ] T15.6 — XSS & CSRF protection
- Sanitize all user inputs
- Add CSRF token to mutation requests
- Validate content-type headers
- Escape HTML in dynamic content

---

**Progress**: `0 / 6 tasks completed`

**Next**: 🎉 Project Complete!
