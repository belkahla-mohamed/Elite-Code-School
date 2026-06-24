# Chapter 4: Layout & Navigation

> **Goal**: Build the shared layout structure, navigation, and routing system.

---

## Tasks

### [ ] T4.1 — Create RootLayout
- `app/layout.tsx` with global providers:
  - React Query provider
  - Toast provider
  - Auth context provider
  - SEO metadata (title template, description)
- Font loading (Inter, Plus Jakarta Sans)

### [ ] T4.2 — Create Header component
- Logo + school name (link to home)
- Navigation links: About, Curricula, Portfolios, Contact
- Login dropdown (Parent / Admin)
- Mobile hamburger menu (below 640px)
- Sticky on scroll with background blur
- Responsive breakpoints

### [ ] T4.3 — Create Footer component
- School info and tagline
- Quick links (All public pages)
- Contact info (email, phone, address)
- Social media links (icons)
- Copyright notice
- Privacy policy link

### [ ] T4.4 — Create Mobile navigation
- Slide-in drawer from right
- All navigation links
- Close on link click
- Backdrop overlay

### [ ] T4.5 — Create Admin Sidebar component
- Navigation for admin section only
- Links: Dashboard, Enrollments, Students, Curricula, Admin Users
- Active link highlighting
- Collapsible on mobile
- User info + logout at bottom

### [ ] T4.6 — Create Parent navigation
- Simple top nav for parent portal
- Links: Dashboard, Portfolio, Privacy, Certifications, Report, Settings
- Breadcrumb component for nested pages

### [ ] T4.7 — Implement route groups
- `(public)/` — no layout wrapper
- `(parent)/` — parent auth check layout
- `(admin)/` — admin auth check layout with sidebar

### [ ] T4.8 — Create 404 page
- Custom not-found page with illustration
- "Back to Home" button

### [ ] T4.9 — Create 500 error page
- Custom error page
- "Try Again" + "Go Home" buttons

---

**Progress**: `0 / 9 tasks completed`

**Next**: → [Chapter 5: Public Pages](CHAPTER_05_PUBLIC_PAGES.md)

---

*Check tasks by replacing `[ ]` with `[x]` when completed.*
