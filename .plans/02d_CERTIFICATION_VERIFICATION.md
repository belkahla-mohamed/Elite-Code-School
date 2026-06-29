# Phase 2d: Certification Verification Page

> **Goal**: Build a public certification verification page (LinkedIn-style) that allows anyone to verify a student's certification.
> **Estimated effort**: 2 hours

---

## Overview

When a parent shares a certification link, anyone with the link should be able to view a verification page showing:
- Student name (or initials based on privacy)
- Certification title, mention, date
- Issuer: Elite Code School
- Verification badge
- Unique verification code

---

## Task 2d.1 — Certification Verification Page

### Route
`app/certification/[id]/page.tsx`

### Features
- Public page (no auth required)
- Look up certification by ID from store/API
- Display:
  - School logo and branding
  - Student name
  - Certification title with emoji/gradient
  - Mention (e.g., "Validé", "Excellent", "Très bien")
  - Date issued
  - Unique verification code (certification ID)
  - Green verification badge with checkmark
  - School signature area
- SEO metadata for social sharing (Open Graph)
- If not found: "Certification not found" message with 404 status

### API Dependencies
- `GET /api/certification/[id]` — Already exists, returns `{ certification, student }`

### Current File
`app/certification/[id]/page.tsx` — Already exists, needs review and enhancement

---

## Task 2d.2 — Open Graph Meta Tags

### Implementation
Add `generateMetadata` to the certification page:
```tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  // Fetch certification data
  // Return title, description, openGraph with image
}
```

### Meta Tags
```html
<meta property="og:title" content="Certification — Elite Code School" />
<meta property="og:description" content="[Student Name] a obtenu [Cert Title]" />
<meta property="og:type" content="website" />
<meta property="og:image" content="/og-certification.png" />
```

---

## Task 2d.3 — Share Functionality Enhancement

### Current State
`ParentPortal.tsx` has a `copyCertLink` function that copies `/certification/[id]` to clipboard.

### Enhancement
1. Add LinkedIn share button (pre-filled text)
2. Add Twitter/X share button
3. Add WhatsApp share button
4. Show QR code for mobile sharing (optional)

### LinkedIn Share URL Format
```
https://www.linkedin.com/sharing/share-offsite/?url=[encoded URL]
```

---

## Task 2d.4 — Certification List in Student Portfolio

### Current State
The portfolio tabs show certifications but without proper share buttons.

### Enhancement
In `PortfolioTabs.tsx`, add share buttons to each certification card:
- "Share" link → copies verification URL
- External link icon → opens verification page

---

## Acceptance Criteria

- [ ] `/certification/[id]` loads and displays proper certification info
- [ ] SEO meta tags are present for social sharing
- [ ] Invalid certification IDs return a proper 404
- [ ] Share buttons on parent portal copy the correct verification URL
- [ ] LinkedIn share works
- [ ] WhatsApp share works
- [ ] Page is responsive (mobile + desktop)
- [ ] Page has school branding (logo, colors, typography)
