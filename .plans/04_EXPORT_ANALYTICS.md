# Phase 4: Export & Analytics

> **Goal**: Add CSV/Excel exports for all admin data, analytics dashboard with charts, and student progress tracking.
> **Estimated effort**: 3–4 hours

---

## Overview

This phase adds data export capabilities (CSV) for all admin tables and builds an analytics dashboard with visual charts for tracking student growth, enrollment trends, and program popularity.

---

## Task 4.1 — CSV Export for All Admin Tables

### Current State
CSV export function (`lib/csv-export.ts`) already exists. Students page has a CSV download button. We need to add CSV export to all admin data tables.

### Features to Add
1. **Enrollments CSV** — Export filtered/current enrollment list
   - Columns: Student Name, Age, Program, Parent Email, Phone, Status, Date
2. **Students CSV** — Already exists, enhance with more columns
   - Add: Program, Hours, Level, Public/Private, Last Activity
3. **Programs CSV** — Export program list
   - Columns: Title, Level, Age Range, Price, Color, Tools
4. **Activity Log CSV** — Export filtered activity logs
   - Columns: Date, Type, Action, Description

### Download Button Pattern
```tsx
<button onClick={() => downloadCsv(data, "export.csv")} className="...">
  <Download className="size-4" /> CSV
</button>
```

### Files to modify
- `app/(admin)/dashboard/inscriptions/page.tsx` (add CSV button to `InscriptionsContent`)
- `app/(admin)/dashboard/activity/page.tsx` (when created)
- `components/admin/InscriptionsContent.tsx`
- `components/admin/ProgramsContent.tsx`

---

## Task 4.2 — Analytics Dashboard with Charts

### Route
`app/(admin)/dashboard/analytics/page.tsx`

### Features
1. **Students per Program** — Bar chart showing distribution
2. **Inscriptions Over Time** — Line chart (monthly)
3. **Status Distribution** — Pie/donut chart (pending/accepted/rejected)
4. **Growth Rate** — Month-over-month student growth
5. **Program Popularity** — Which programs have most students
6. **Age Distribution** — Students grouped by age range

### Library Options
| Library | Pros | Cons |
|---------|------|------|
| **recharts** | React-native, popular, good docs | Heavy bundle |
| **chart.js** + react-chartjs-2 | Lightweight, flexible | More setup |
| **Custom CSS charts** | Zero dependencies, simple | Limited visual options |

### Recommendation
Use **recharts** (already listed in package.json dependencies).

### New Sidebar Link
```tsx
{ href: "/dashboard/analytics", label: "Analytiques", icon: BarChart3 }
```

### New Files
- `app/(admin)/dashboard/analytics/page.tsx`
- `components/admin/AnalyticsContent.tsx`
- `components/admin/charts/StudentsByProgram.tsx`
- `components/admin/charts/InscriptionsOverTime.tsx`
- `components/admin/charts/StatusDistribution.tsx`

---

## Task 4.3 — Date Range Filter for Dashboard

### Features
- Filter analytics by: 7 days, 30 days, 90 days, all time
- Custom date picker (start date + end date)
- All charts update based on selected range
- Selected range displayed as tag/chip

### Implementation
```tsx
const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d" | "all" | "custom">("30d");
const [customStart, setCustomStart] = useState("");
const [customEnd, setCustomEnd] = useState("");
```

---

## Task 4.4 — Student Progress Timeline

### Features
- Per-student chart: hours per month
- Projects completed over time
- Certifications timeline
- Accessible from student detail page

### Implementation
- Add a "Progress" tab to the admin student detail page
- Show a simple timeline chart

---

## Acceptance Criteria

- [ ] CSV export available on all admin data tables
- [ ] CSV includes proper headers and UTF-8 encoding
- [ ] Analytics dashboard has at least 4 charts
- [ ] Charts update with date range filter
- [ ] Analytics page is responsive
- [ ] Student progress timeline shows in student detail
- [ ] No TypeScript errors in chart components
- [ ] Build passes with recharts dependency
