# Phase 2a: Parent Portal Pages

> **Goal**: Build all missing parent portal pages — portfolio view, privacy settings, certifications, report download.
> **Estimated effort**: 3–4 hours

---

## Overview

The parent navigation (`parent-nav.tsx`) links to 4 pages that currently don't exist:
- `/parent/portfolio` — View and manage child's portfolio
- `/parent/privacy` — Toggle public/private visibility
- `/parent/certifications` — View and share certifications
- `/parent/report` — Download PDF progress report

All pages require parent authentication (handled by middleware).

---

## Task 2a.1 — Parent Portfolio View Page

### Route
`app/(parent)/parent/portfolio/page.tsx`

### Features
- Display full student portfolio with all tabs (projects, certifications, gallery)
- Same layout as public portfolio but with management controls
- Student header with avatar, name, age, curriculum, progress
- Edit controls: upload avatar placeholder
- All data fetched via `GET /api/portfolio/[slug]` API

### Implementation
```tsx
// app/(parent)/parent/portfolio/page.tsx
"use client";
import { useEffect, useState } from "react";
import { PortfolioTabs } from "@/components/PortfolioTabs";
// Fetch student data and render PortfolioTabs with management overlay
```

### API Dependencies
- `GET /api/portfolio/[slug]` — Returns full student portfolio (already exists)

---

## Task 2a.2 — Privacy Settings Page

### Route
`app/(parent)/parent/privacy/page.tsx`

### Features
- Toggle switch: "Portfolio is Public" / "Portfolio is Private"
- Description text explaining the difference
- Current status indicator (badge)
- Save button with confirmation toast
- Visual preview of how public visitors see the portfolio
- Log of privacy changes (if activity log exists)

### API Dependencies
- `PATCH /api/students/[id]/privacy` — Update privacy setting (needs creation)

### New Files
- `app/api/students/[id]/privacy/route.ts` — Privacy update API

---

## Task 2a.3 — Certifications Page

### Route
`app/(parent)/parent/certifications/page.tsx`

### Features
- List all certifications with:
  - Title, issuer, date, mention
  - Certificate badge/icon with gradient background
  - Share button (WhatsApp + Copy Link)
  - Verification link display
- Success toast when link copied
- Option to download certification image
- Empty state when no certifications exist

### Reuse
- Share logic from `ParentPortal.tsx` (shareCert, copyCertLink functions)

---

## Task 2a.4 — Report Download Page

### Route
`app/(parent)/parent/report/page.tsx`

### Features
- "Download Progress Report" button
- Shows loading state while PDF generates
- Auto-downloads PDF on completion
- Preview of what's included in the report
- Last generated date display
- Option to email the report

### API Dependencies
- `generateStudentReport()` from `lib/pdf-generator.ts` (already exists)
- `GET /api/parent/report` — Generate and return PDF blob

### New Files
- `app/api/parent/report/route.ts` — PDF generation API endpoint

---

## Task 2a.5 — Refactor ParentPortal Component

### Problem
The current `ParentPortal.tsx` combines login + dashboard in one component. This should be split.

### Solution
1. Remove the embedded login form from `ParentPortal.tsx`
2. Make `ParentPortal.tsx` a pure dashboard component
3. Move all shared logic (privacy toggle, PDF download, cert sharing) into reusable hooks
4. Create a `lib/hooks/useParentData.ts` hook for shared parent data fetching

### New Files
- `lib/hooks/useParentData.ts` — Custom hook for parent data with loading/error states

---

## Acceptance Criteria

- [ ] `/parent/portfolio` loads and displays full portfolio with management controls
- [ ] `/parent/privacy` toggle works and persists
- [ ] `/parent/certifications` lists all certs with working share buttons
- [ ] `/parent/report` generates and downloads PDF
- [ ] All pages show loading skeletons while fetching data
- [ ] All pages show proper error states
- [ ] All pages are protected by auth middleware
- [ ] Responsive design works on mobile (375px)
