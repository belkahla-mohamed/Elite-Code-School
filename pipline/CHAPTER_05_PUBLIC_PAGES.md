# Chapter 5: Public Pages

> **Goal**: Build all public-facing pages — home, about, curricula, portfolios, contact.

---

## Tasks

### [ ] T5.1 — Create Home page (`app/page.tsx`)
- Hero section: headline, subtitle (Robotics • Coding • AI), CTA button "Browse Curricula"
- Stats section: number of students, programs, years established
- Curriculum preview cards (3 cards linking to curricula page)
- Testimonials or featured student section
- Call-to-action section at bottom

### [ ] T5.2 — Create About page (`app/about/page.tsx`)
- School mission and vision
- Teaching approach (project-based, age-appropriate)
- Team/staff section (placeholder)
- Facilities information

### [ ] T5.3 — Create Curricula catalog (`app/curricula/page.tsx`)
- Fetch curricula from API (`GET /api/public/curricula`)
- Display 3 curriculum cards in grid layout
- Each card shows: icon, title, age range, price, brief description
- CTA "Learn More" → detail page

### [ ] T5.4 — Create Curriculum Detail page (`app/curricula/[id]/page.tsx`)
- Fetch single curriculum (`GET /api/public/curricula/:id`)
- Full curriculum information
- Age range, level, duration, price
- Content overview
- "Enroll Now" CTA button (links to enrollment form with pre-selected curriculum)

### [ ] T5.5 — Create Public Portfolios grid (`app/portfolios/page.tsx`)
- Fetch public portfolios (`GET /api/public/portfolios`)
- Grid of student cards: avatar, name, age, curriculum, progress bar
- Click navigates to portfolio detail
- Empty state if no public portfolios

### [ ] T5.6 — Create Portfolio Detail page (`app/portfolios/[id]/page.tsx`)
- Fetch portfolio if public (`GET /api/public/portfolios/:id`)
- Student header: avatar, name, age, curriculum
- Progress overview (overall percentage + skill bars)
- Projects section: cards with status badges, progress, description
- Certifications section: badges with share links (if shareable)
- Photo gallery: grid of images
- If portfolio is private: show "This portfolio is private" message
- Sections: `components/portfolio/ProjectCard.tsx`, `CertificationBadge.tsx`, `SkillBar.tsx`, `GalleryGrid.tsx`

### [ ] T5.7 — Create Contact page (`app/contact/page.tsx`)
- School contact information (email, phone, address)
- Contact form (name, email, message)
- Embedded map placeholder

### [ ] T5.8 — Create API routes for public data
- `GET /api/public/curricula` — return all active curricula
- `GET /api/public/curricula/:id` — return single curriculum
- `GET /api/public/portfolios` — return students with `isPortfolioPublic: true`, include basic info
- `GET /api/public/portfolios/:id` — return full portfolio (projects, certs, gallery) if public

### [ ] T5.9 — Add SEO metadata to all public pages
- GenerateMetadata for each page with title, description, Open Graph tags
- Structured data (JSON-LD) for curricula and portfolios

---

**Progress**: `0 / 9 tasks completed`

**Next**: → [Chapter 6: Enrollment Flow](CHAPTER_06_ENROLLMENT_FLOW.md)

---

*Check tasks by replacing `[ ]` with `[x]` when completed.*
