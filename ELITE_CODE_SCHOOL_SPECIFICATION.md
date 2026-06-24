# Elite Code School — Complete Project Specification

> **Prepared for AI-assisted development (OpenCode / Codex / Antigravity / Cursor / Copilot)**
> School of Robotics, Coding & Artificial Intelligence — Ages 7 to 17

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [System Architecture](#2-system-architecture)
3. [Tech Stack Recommendations](#3-tech-stack-recommendations)
4. [Database Schema](#4-database-schema)
5. [Design System](#5-design-system)
6. [Interfaces & Pages](#6-interfaces--pages)
7. [Permissions & Access Control](#7-permissions--access-control)
8. [Business Rules (RG)](#8-business-rules-rg)
9. [Use Case Scenarios](#9-use-case-scenarios)
10. [Non-Functional Requirements](#10-non-functional-requirements)
11. [API Routes](#11-api-routes)
12. [File Structure](#12-file-structure)
13. [State Management](#13-state-management)
14. [Error Handling & UX Feedback](#14-error-handling--ux-feedback)
15. [Development Phases](#15-development-phases)

---

## 1. Project Overview

### 1.1 Purpose

Elite Code School is a robotics, coding, and AI education center for children aged 7–17. The application serves three purposes:

1. **Showcase** — Present the school's educational offerings to the public
2. **Management** — Handle enrollment requests from parents
3. **Portfolio tracking** — Track each student's learning journey through a personal portfolio

### 1.2 User Roles

| Role | Description |
|------|-------------|
| **Visitor** | Unauthenticated public user. Browses offerings, views public portfolios, submits enrollment requests |
| **Parent** | Authenticated via a child-specific secret. Manages portfolio privacy, downloads reports, shares certifications |
| **Administrator** | School staff. Processes enrollments, manages student records, populates portfolios with projects/certifications/photos |

### 1.3 Core Features

- Public catalog of 3 curricula (Beginner, Intermediate, Advanced AI)
- Enrollment request & approval workflow
- Student portfolios with projects, certifications, progress tracking, photo gallery
- Privacy toggle (public/private portfolio)
- Certification sharing (LinkedIn-style)
- Admin dashboard with activity overview
- Downloadable student progress report

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (SPA)                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐   │
│  │  Public  │  │  Parent  │  │  Admin Dashboard     │   │
│  │  Pages   │  │  Portal  │  │  (protected)         │   │
│  └────┬─────┘  └────┬─────┘  └──────────┬───────────┘   │
│       │              │                   │               │
│  ┌────┴──────────────┴───────────────────┴───────────┐  │
│  │              API Client (axios/fetch)              │  │
│  └──────────────────────┬────────────────────────────┘  │
└─────────────────────────┼──────────────────────────────┘
                          │ HTTP/HTTPS
┌─────────────────────────┼──────────────────────────────┐
│                Backend API (REST)                       │
│  ┌──────────────────────┴────────────────────────────┐  │
│  │           Middleware (Auth, Validation, Logging)   │  │
│  └──────────────────────┬────────────────────────────┘  │
│  ┌──────────────────────┴────────────────────────────┐  │
│  │              Route Handlers                        │  │
│  │  /api/public  /api/auth  /api/parent  /api/admin   │  │
│  └──────────────────────┬────────────────────────────┘  │
│  ┌──────────────────────┴────────────────────────────┐  │
│  │              Service Layer                         │  │
│  └──────────────────────┬────────────────────────────┘  │
│  ┌──────────────────────┴────────────────────────────┐  │
│  │              Data Access Layer (ORM)               │  │
│  └──────────────────────┬────────────────────────────┘  │
└─────────────────────────┼──────────────────────────────┘
                          │
┌─────────────────────────┼──────────────────────────────┐
│                  Database (PostgreSQL)                   │
│  Tables: students, parents, enrollments, curricula,     │
│  projects, certifications, galleries, progress_logs    │
└────────────────────────────────────────────────────────┘
```

### 2.2 Architecture Decisions

- **SPA Frontend** — React/Next.js for dynamic interactions
- **REST API** — Clear separation of concerns
- **JWT-based Auth** — Stateless authentication
- **RBAC** — Role-based access control middleware
- **Admin-only write** — All mutations gated behind admin role (RG10, RG11)
- **Soft deletes** — Audit trail for student/admin data (irreversible requires confirmation — RG12)

---

## 3. Tech Stack Recommendations

| Layer | Option A (Recommended) | Option B | Option C |
|-------|----------------------|----------|----------|
| **Frontend** | Next.js 14+ (App Router) | React + Vite | Nuxt.js |
| **Backend** | Next.js API Routes | Express.js | FastAPI (Python) |
| **Database** | PostgreSQL | MySQL | Supabase |
| **ORM** | Prisma | Drizzle | TypeORM |
| **Auth** | NextAuth.js / Auth.js | JWT custom | Supabase Auth |
| **Styling** | Tailwind CSS | Chakra UI | Material UI |
| **File Storage** | Cloudinary / AWS S3 | Local filesystem | Vercel Blob |
| **Deployment** | Vercel / Railway | Docker + VPS | Netlify |
| **Validation** | Zod | Yup | Joi |

---

## 4. Database Schema

### 4.1 Entity-Relationship Diagram (Textual)

```
┌──────────────┐       ┌──────────────────┐
│   curricula  │<──────│  enrollments      │
│  (PK: id)    │       │  (PK: id)         │
└──────────────┘       │  FK: curriculum_id│
       │               │  FK: student_id   │
       │               └────────┬─────────┘
       │                        │
       │               ┌────────┴──────────┐
       │               │    students        │
       │               │  (PK: id)          │
       │               │  FK: parent_id     │
       │               └────────┬──────────┘
       │                        │
       │               ┌────────┴──────────┐
       │               │    parents         │
       │               │  (PK: id)          │
       │               └────────────────────┘
       │
       │       ┌──────────────────┐
       │       │   projects        │
       │       │  (PK: id)         │
       │       │  FK: student_id   │
       │       └──────────────────┘
       │       ┌──────────────────┐
       │       │ certifications   │
       │       │  (PK: id)         │
       │       │  FK: student_id   │
       │       └──────────────────┘
       │       ┌──────────────────┐
       │       │   gallery_items   │
       │       │  (PK: id)         │
       │       │  FK: student_id   │
       │       └──────────────────┘
       │       ┌──────────────────┐
       │       │  progress_logs    │
       │       │  (PK: id)         │
       │       │  FK: student_id   │
       │       └──────────────────┘
```

### 4.2 Table Definitions

#### `curricula`

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| id | UUID | PK, default uuid_generate_v4() | Unique identifier |
| title | VARCHAR(255) | NOT NULL | e.g., "Beginner Robotics" |
| level | VARCHAR(50) | NOT NULL | "beginner", "intermediate", "advanced" |
| min_age | INTEGER | NOT NULL, CHECK(>= 7) | Minimum age |
| max_age | INTEGER | NOT NULL, CHECK(<= 17) | Maximum age |
| description | TEXT | NOT NULL | Course description |
| content_overview | TEXT | | What the curriculum covers |
| price | DECIMAL(10,2) | NOT NULL | Tuition cost |
| duration | VARCHAR(100) | | e.g., "12 weeks" |
| icon_url | VARCHAR(500) | | Icon/image for the curriculum card |
| is_active | BOOLEAN | DEFAULT true | Visibility toggle |
| created_at | TIMESTAMP | DEFAULT NOW() | |
| updated_at | TIMESTAMP | DEFAULT NOW() | |

#### `students`

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| id | UUID | PK | |
| first_name | VARCHAR(100) | NOT NULL | |
| last_name | VARCHAR(100) | NOT NULL | |
| date_of_birth | DATE | NOT NULL | For age validation (RG4) |
| avatar_url | VARCHAR(500) | | Student avatar |
| parent_id | UUID | FK -> parents.id, NOT NULL | Linked parent |
| enrollment_status | VARCHAR(50) | DEFAULT 'pending' | "pending", "active", "completed", "withdrawn" |
| is_portfolio_public | BOOLEAN | DEFAULT true (RG7) | Privacy toggle (RG8) |
| created_at | TIMESTAMP | DEFAULT NOW() | |
| updated_at | TIMESTAMP | DEFAULT NOW() | |

#### `parents`

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| id | UUID | PK | |
| first_name | VARCHAR(100) | NOT NULL | |
| last_name | VARCHAR(100) | NOT NULL | |
| email | VARCHAR(255) | NOT NULL, UNIQUE | Contact email |
| phone | VARCHAR(50) | | Contact phone |
| access_secret | VARCHAR(255) | NOT NULL, UNIQUE | Child-specific secret for parent auth |
| created_at | TIMESTAMP | DEFAULT NOW() | |
| updated_at | TIMESTAMP | DEFAULT NOW() | |

#### `enrollments`

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| id | UUID | PK | |
| student_first_name | VARCHAR(100) | NOT NULL | Name at request time |
| student_last_name | VARCHAR(100) | NOT NULL | |
| student_date_of_birth | DATE | NOT NULL | |
| parent_first_name | VARCHAR(100) | NOT NULL | |
| parent_last_name | VARCHAR(100) | NOT NULL | |
| parent_email | VARCHAR(255) | NOT NULL | |
| parent_phone | VARCHAR(50) | | |
| curriculum_id | UUID | FK -> curricula.id | Desired curriculum |
| status | VARCHAR(50) | DEFAULT 'pending' | "pending", "accepted", "rejected" |
| admin_notes | TEXT | | Internal notes |
| processed_by | UUID | FK -> admin_users.id, nullable | Who processed it |
| processed_at | TIMESTAMP | | When it was processed |
| created_at | TIMESTAMP | DEFAULT NOW() | |

#### `projects`

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| id | UUID | PK | |
| student_id | UUID | FK -> students.id, NOT NULL | |
| title | VARCHAR(255) | NOT NULL | |
| description | TEXT | | |
| status | VARCHAR(50) | NOT NULL, DEFAULT 'in_progress' | "completed", "in_progress" (RG6) |
| progress_percentage | INTEGER | CHECK(0-100), DEFAULT 0 | Only relevant when in_progress (RG6) |
| started_at | DATE | | |
| completed_at | DATE | | |
| media_urls | JSONB | DEFAULT '[]' | Array of image/video URLs |
| created_at | TIMESTAMP | DEFAULT NOW() | |
| updated_at | TIMESTAMP | DEFAULT NOW() | |

#### `certifications`

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| id | UUID | PK | |
| student_id | UUID | FK -> students.id, NOT NULL | |
| title | VARCHAR(255) | NOT NULL | e.g., "Python Level 1" |
| issuer | VARCHAR(255) | DEFAULT 'Elite Code School' | |
| issued_at | DATE | NOT NULL | |
| certificate_url | VARCHAR(500) | | PDF or image |
| is_shareable | BOOLEAN | DEFAULT true (RG9) | Public sharing toggle |
| share_link | VARCHAR(500) | UNIQUE, generated | Link for external sharing |
| created_at | TIMESTAMP | DEFAULT NOW() | |

#### `gallery_items`

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| id | UUID | PK | |
| student_id | UUID | FK -> students.id, NOT NULL | |
| image_url | VARCHAR(500) | NOT NULL | |
| caption | VARCHAR(255) | | |
| uploaded_by | UUID | FK -> admin_users.id | |
| sort_order | INTEGER | DEFAULT 0 | Display order |
| created_at | TIMESTAMP | DEFAULT NOW() | |

#### `progress_logs`

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| id | UUID | PK | |
| student_id | UUID | FK -> students.id, NOT NULL | |
| skill_category | VARCHAR(100) | | e.g., "Robotics", "Python", "AI" |
| skill_name | VARCHAR(255) | | Specific skill |
| level_achieved | VARCHAR(50) | | "beginner", "intermediate", "advanced" |
| notes | TEXT | | |
| recorded_at | DATE | NOT NULL | |

#### `admin_users`

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| id | UUID | PK | |
| email | VARCHAR(255) | NOT NULL, UNIQUE | |
| password_hash | VARCHAR(255) | NOT NULL | |
| first_name | VARCHAR(100) | NOT NULL | |
| last_name | VARCHAR(100) | NOT NULL | |
| role | VARCHAR(50) | DEFAULT 'admin' | For future expansion |
| created_at | TIMESTAMP | DEFAULT NOW() | |

---

## 5. Design System

### 5.1 Brand Identity

- **School Name**: Elite Code School
- **Tagline**: Robotique • Codage • Intelligence Artificielle
- **Vibe**: Modern, playful, educational, trustworthy
- **Target Audience**: Children (7–17) and their parents

### 5.2 Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-primary` | `#4F46E5` (Indigo) | Buttons, links, header, active states |
| `--color-primary-light` | `#818CF8` | Hover states, backgrounds |
| `--color-primary-dark` | `#3730A3` | Active/pressed states |
| `--color-secondary` | `#06B6D4` (Cyan) | Accents, certifications, highlights |
| `--color-accent` | `#F59E0B` (Amber) | Warnings, progress indicators |
| `--color-success` | `#10B981` (Emerald) | Accepted, completed, verified |
| `--color-danger` | `#EF4444` (Red) | Rejected, delete actions |
| `--color-surface` | `#FFFFFF` | Card backgrounds |
| `--color-background` | `#F8FAFC` | Page backgrounds |
| `--color-text` | `#1E293B` | Body text |
| `--color-text-muted` | `#64748B` | Secondary text |
| `--color-border` | `#E2E8F0` | Borders, dividers |

### 5.3 Typography

| Element | Family | Weight | Size |
|---------|--------|--------|------|
| Headings | Inter / Plus Jakarta Sans | 700 (bold) | 2rem–3rem |
| Body | Inter | 400 (regular) | 1rem |
| Small | Inter | 400 | 0.875rem |
| Labels | Inter | 600 (semibold) | 0.875rem |
| Monospace | JetBrains Mono | 400 | Code snippets |

### 5.4 Spacing Scale

`4px` — `8px` — `12px` — `16px` — `24px` — `32px` — `48px` — `64px` — `96px`

### 5.5 Component Design System (Tailwind-based)

All components follow these patterns:

| Component | Variants | Notes |
|-----------|----------|-------|
| **Button** | Primary, Secondary, Ghost, Danger, Icon | Loading state, disabled state |
| **Card** | Default, Interactive (hover lift), Bordered | Rounded-xl, shadow-sm |
| **Input** | Default, Error, Success, Disabled | With label, helper text |
| **Badge** | Status (pending/accepted/rejected), Skill level | |
| **Avatar** | Student avatar, with fallback initials | |
| **ProgressBar** | Determinate (percentage), Color-coded | |
| **Modal** | Confirmation (RG12), Form, Image gallery | |
| **Toast** | Success, Error, Warning, Info | Auto-dismiss |
| **Table** | Sortable, Responsive | Used in admin |
| **Toggle** | Public/Private portfolio switch | |
| **ShareButton** | Copy link, social share | For certifications |
| **EmptyState** | Illustration + message | For empty portfolios |

### 5.6 Responsive Breakpoints

| Breakpoint | Width |
|------------|-------|
| Mobile | < 640px |
| Tablet | 640px – 1024px |
| Desktop | > 1024px |

### 5.7 Animations

- Page transitions: fade + slide-up (300ms)
- Card hover: subtle lift (translateY -2px, shadow increase)
- Modal: fade + scale (200ms)
- Toast: slide-in from right (300ms)
- Progress bar: animated width transition (600ms)

---

## 6. Interfaces & Pages

### 6.1 Public Pages (Visitor)

| Page | Route | Description |
|------|-------|-------------|
| **Home** | `/` | Hero section, school intro, stats, CTA |
| **About** | `/about` | School mission, team, values |
| **Curricula** | `/curricula` | 3 curriculum cards with details |
| **Curriculum Detail** | `/curricula/:id` | Full curriculum info, "Enroll Now" CTA |
| **Enrollment Form** | `/enroll` | Multi-step form for enrollment request |
| **Enrollment Confirmation** | `/enroll/confirmation` | Success message after submission |
| **Public Portfolios** | `/portfolios` | Grid of public student portfolios |
| **Portfolio Detail** | `/portfolios/:id` | Single student's public portfolio |
| **Contact** | `/contact` | School contact info, map |
| **Login (Parent)** | `/parent/login` | Login with child's secret |
| **Login (Admin)** | `/admin/login` | Admin authentication |

### 6.2 Parent Portal (Authenticated)

| Page | Route | Description |
|------|-------|-------------|
| **Dashboard** | `/parent/dashboard` | Overview of child's activity |
| **Portfolio View** | `/parent/portfolio` | Detailed portfolio (same as public but with controls) |
| **Privacy Settings** | `/parent/privacy` | Toggle public/private (RG7, RG8) |
| **Certifications** | `/parent/certifications` | View & share certifications (RG9) |
| **Progress Report** | `/parent/report` | Downloadable PDF report |
| **Settings** | `/parent/settings` | View profile, change secret |

### 6.3 Admin Dashboard (Authenticated)

| Page | Route | Description |
|------|-------|-------------|
| **Dashboard** | `/admin` | Overview: counts, pending requests, charts |
| **Enrollments** | `/admin/enrollments` | List of requests, accept/reject actions |
| **Students** | `/admin/students` | CRUD student records |
| **Student Detail** | `/admin/students/:id` | Full student record management |
| **Add Project** | `/admin/students/:id/projects/new` | Create project (RG10) |
| **Add Certification** | `/admin/students/:id/certifications/new` | Create certification (RG10) |
| **Gallery** | `/admin/students/:id/gallery` | Manage photos (RG10) |
| **Curricula** | `/admin/curricula` | Manage curricula |
| **Admin Users** | `/admin/users` | Manage admin accounts |
| **Activity Log** | `/admin/logs` | Audit trail |

### 6.4 Wireframe Key Elements

#### Home Page Layout
```
┌──────────────────────────────────────────────────────┐
│ [Logo]   About  Curricula  Portfolios  Contact  [Login] │
├──────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────┐  │
│  │  Hero: "Unlock Your Child's Potential"         │  │
│  │  Subtitle: Robotics • Coding • AI              │  │
│  │  [CTA: Browse Curricula]                       │  │
│  └────────────────────────────────────────────────┘  │
│  ┌────────────┐  ┌────────────┐  ┌──────────────┐   │
│  │ Beginner   │  │ Intermed.  │  │ Advanced AI  │   │
│  │ 7-10 yrs   │  │ 10-13 yrs  │  │ 13-17 yrs    │   │
│  └────────────┘  └────────────┘  └──────────────┘   │
│  ┌────────────────────────────────────────────────┐  │
│  │  Stats: 500+ Students • 3 Programs • X Years   │  │
│  └────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────┐  │
│  │  Footer: Links, Contact, Social               │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

#### Portfolio Page Layout
```
┌──────────────────────────────────────────────────────┐
│ [Avatar] Student Name          [Public/Private Toggle] │
│ Age: X • Curriculum: Beginner Robotics              │
├──────────────────────────────────────────────────────┤
│ Progress: ████████░░ 80%                             │
├──────────┬───────────────────────────────────────────┤
│ Projects │ ┌────────────────────────────────────┐   │
│ (filter) │ │ Project Card: Name, Status, %      │   │
│          │ └────────────────────────────────────┘   │
│          │ ┌────────────────────────────────────┐   │
│          │ │ Project Card: ...                  │   │
│          │ └────────────────────────────────────┘   │
├──────────┼───────────────────────────────────────────┤
│ Skills   │ Robotics: ████░░ 60%                     │
│          │ Python:   ████████ 80%                   │
│          │ AI:       ██░░░░░░ 25%                   │
├──────────┼───────────────────────────────────────────┤
│ Certs    │ [Badge] Python L1  [Share] [Badge] Robot  │
├──────────┼───────────────────────────────────────────┤
│ Gallery  │ [Photo] [Photo] [Photo] [+X more]        │
└──────────┴───────────────────────────────────────────┘
```

#### Admin Dashboard Layout
```
┌──────────────────────────────────────────────────────┐
│ [Logo]  Dashboard  Enrollments  Students  Curricula   │
├──────────────────────────────────────────────────────┤
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌────────┐              │
│ │ 120  │ │ 15   │ │ 12   │ │ 85%    │              │
│ │Total │ │ New  │ │Pending│ │Retent. │              │
│ └──────┘ └──────┘ └──────┘ └────────┘              │
│ ┌─────────────────────────────────────────────┐     │
│ │ Pending Enrollments [Accept] [Reject]        │     │
│ │ ┌─────────────────────────────────────────┐ │     │
│ │ │ #1: Ahmed (9) - Beginner - 2 days ago  │ │     │
│ │ │ #2: Sara (14) - Advanced - 5 days ago  │ │     │
│ │ └─────────────────────────────────────────┘ │     │
│ └─────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────┘
```

---

## 7. Permissions & Access Control

### 7.1 Role Hierarchy

```
                      ┌──────────┐
                      │  Visitor │  (no auth)
                      └────┬─────┘
                           │
                      ┌────┴─────┐
                      │  Parent  │  (auth via child secret)
                      └────┬─────┘
                           │
                      ┌────┴─────┐
                      │  Admin   │  (auth via email + password)
                      └──────────┘
```

### 7.2 Permission Matrix

| Feature | Visitor | Parent | Admin |
|---------|---------|--------|-------|
| View home/about/contact | ✅ | ✅ | ✅ |
| View curricula catalog | ✅ | ✅ | ✅ |
| View public portfolios | ✅ | ✅ | ✅ |
| View own child's portfolio | ❌ | ✅ (if private) | ✅ |
| Submit enrollment | ✅ | ✅ | ❌ |
| Toggle portfolio privacy | ❌ | ✅ | ❌ |
| Download progress report | ❌ | ✅ | ✅ |
| Share certifications | ❌ | ✅ | ✅ |
| Process enrollments | ❌ | ❌ | ✅ |
| Create/edit/delete students | ❌ | ❌ | ✅ |
| Add projects | ❌ | ❌ | ✅ |
| Add certifications | ❌ | ❌ | ✅ |
| Upload gallery photos | ❌ | ❌ | ✅ |
| Manage curricula | ❌ | ❌ | ✅ |
| Manage admin users | ❌ | ❌ | ✅ |
| View admin dashboard | ❌ | ❌ | ✅ |

### 7.3 Auth Implementation Strategy

**Parent Authentication:**
- No self-registration
- Secret is auto-generated when admin accepts enrollment (RG3)
- Secret delivered to parent email
- Secret hashed in database (bcrypt)
- JWT token issued upon login
- Token contains: `{ parentId, studentIds[], role: 'parent' }`

**Admin Authentication:**
- Email + password
- Created only by another admin
- JWT token contains: `{ adminId, role: 'admin' }`

**Middleware Pattern:**
```
routes
├── public/        → no auth required
├── parent/        → requireAuth('parent')
├── admin/         → requireAuth('admin')
└── api/admin/*    → requireAuth('admin')
```

---

## 8. Business Rules (RG)

| Code | Rule | Enforcement |
|------|------|-------------|
| RG1 | Enrollment is only effective after explicit admin validation | Status field: `pending` → `accepted` |
| RG2 | Submitting a request does NOT create a student record directly | Separate `enrollments` table |
| RG3 | Acceptance generates a student record + parent access | Transaction in service layer |
| RG4 | Student age must be between 7 and 17 | DB CHECK constraint + form validation |
| RG5 | Each age range corresponds to a curriculum | Frontend: filter curricula by age; Backend: validate match |
| RG6 | Project is either completed or in_progress with percentage | ENUM status + percentage only when in_progress |
| RG7 | Student portfolio is public by default | `is_portfolio_public` defaults to `true` |
| RG8 | Parent can make portfolio private | Toggle via parent portal |
| RG9 | Certifications are shareable publicly | `is_shareable` + unique `share_link` URL |
| RG10 | Only admin can add files, photos, projects, certifications | Middleware gate: require admin role |
| RG11 | Only admin can create, modify, or delete data | All write operations require admin role |
| RG12 | Every deletion must be confirmed (irreversible) | Confirmation modal before DELETE API call |

---

## 9. Use Case Scenarios

### Scenario 1: Visitor browses and enrolls

```
1. Visitor lands on Home page
2. Clicks "Browse Curricula"
3. Views curriculum cards (Beginner / Intermediate / Advanced)
4. Clicks "Learn More" on a curriculum
5. Reads details, clicks "Enroll Now"
6. Multi-step form appears:
   Step 1: Child info (first name, last name, DOB)
   Step 2: Curriculum selection (auto-filtered by age)
   Step 3: Parent info (name, email, phone)
   Step 4: Review & Submit
7. Submits → sees confirmation screen with "Request Received" message
8. Admin sees new pending enrollment in dashboard
```

### Scenario 2: Admin processes enrollment

```
1. Admin logs in → dashboard shows "12 Pending Enrollments"
2. Clicks "View All" → list of pending requests
3. Opens a request → sees child info, parent contact, desired curriculum
4. Clicks "Accept" → confirmation modal (RG12-like confirmation)
5. System:
   a. Creates `students` record
   b. Creates `parents` record with generated access_secret
   c. Updates enrollment status to "accepted"
   d. Sends email to parent with their child's access secret
6. Toast: "Enrollment accepted. Parent notified."
```

### Scenario 3: Parent views and manages portfolio

```
1. Parent receives email with access link/secret
2. Visits /parent/login, enters secret
3. Sees dashboard with child's overview
4. Clicks "View Portfolio" → full portfolio
5. Toggles "Public" → "Private" → portfolio hidden from public (RG8)
6. Clicks "Certifications" → sees list
7. Clicks share icon on a certification → copies shareable link
8. Clicks "Download Report" → generates & downloads PDF
```

### Scenario 4: Admin builds portfolio

```
1. Admin navigates to Student Detail page
2. Clicks "Add Project"
3. Form: title, description, status (in_progress/completed), progress %, media
4. Submits → project appears on student's portfolio
5. Clicks "Add Certification" → form with title, date, optional PDF
6. Clicks "Upload Photos" → gallery section, drag & drop images
7. All changes immediately reflected in student's portfolio
```

### Scenario 5: Public portfolio discovery

```
1. Visitor clicks "Portfolios" in navigation
2. Grid of student cards (avatar, name, curriculum, progress %)
3. Clicks a card → full portfolio page
4. Sees projects, skills, certifications, gallery
5. Cannot see private portfolios (404 or "not available")
```

### Scenario 6: Certification sharing (LinkedIn-style)

```
1. Parent clicks "Share" on a certification
2. System generates unique share link: /verify/cert/:shareLink
3. Link copied to clipboard
4. Parent pastes link on social media / LinkedIn
5. Anyone with link sees a verification page:
   - Student name (or initials based on privacy)
   - Certification title
   - Issuer: Elite Code School
   - Issue date
   - Verification badge
```

---

## 10. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| **Usability** | Simple, engaging UI for non-technical users (parents, children) |
| **Feedback** | Clear toast notifications after every action |
| **Persistence** | Student data persists across sessions, builds, deployments |
| **Performance** | Portfolio pages load in < 2s, images optimized |
| **Security** | Separation between public, parent, and admin areas |
| **Privacy** | Minors' data protected; photos, identities, parent contact info secured |
| **Auth** | Access control must be real and reliable |
| **Data integrity** | No orphaned student records; transactional enrollment processing |
| **Accessibility** | WCAG 2.1 AA compliance |
| **SEO** | Public pages (curricula, portfolios) indexable by search engines |

---

## 11. API Routes

### 11.1 Public API

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/public/curricula` | List active curricula |
| GET | `/api/public/curricula/:id` | Get curriculum details |
| GET | `/api/public/portfolios` | List public portfolios |
| GET | `/api/public/portfolios/:id` | Get portfolio if public |
| POST | `/api/public/enroll` | Submit enrollment request |
| GET | `/api/public/enroll/:id/status` | Check enrollment status (by ref) |
| GET | `/api/public/verify/cert/:shareLink` | Verify shared certification |

### 11.2 Parent API (requires parent auth)

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/parent/login` | Login with secret → JWT |
| GET | `/api/parent/portfolio` | Get own child's portfolio |
| PUT | `/api/parent/portfolio/privacy` | Toggle public/private |
| GET | `/api/parent/certifications` | List certifications |
| GET | `/api/parent/report` | Download progress report PDF |
| GET | `/api/parent/profile` | Get parent profile |

### 11.3 Admin API (requires admin auth)

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/admin/login` | Admin login |
| GET | `/api/admin/dashboard` | Dashboard stats |
| GET | `/api/admin/enrollments` | List enrollments (filterable) |
| PUT | `/api/admin/enrollments/:id/accept` | Accept enrollment |
| PUT | `/api/admin/enrollments/:id/reject` | Reject enrollment |
| GET | `/api/admin/students` | List students |
| POST | `/api/admin/students` | Create student |
| GET | `/api/admin/students/:id` | Get student detail |
| PUT | `/api/admin/students/:id` | Update student |
| DELETE | `/api/admin/students/:id` | Delete student (with confirm) |
| POST | `/api/admin/students/:id/projects` | Add project (RG10) |
| PUT | `/api/admin/projects/:id` | Update project |
| DELETE | `/api/admin/projects/:id` | Delete project |
| POST | `/api/admin/students/:id/certifications` | Add certification (RG10) |
| DELETE | `/api/admin/certifications/:id` | Delete certification |
| POST | `/api/admin/students/:id/gallery` | Upload photo (RG10) |
| DELETE | `/api/admin/gallery/:id` | Delete photo |
| GET/PUT/POST/DELETE | `/api/admin/curricula` | Full CRUD curricula |
| GET/PUT/POST/DELETE | `/api/admin/users` | Manage admin users |

---

## 12. File Structure

### 12.1 Next.js (App Router) Structure

```
├── app/
│   ├── layout.tsx                    # Root layout (header, footer)
│   ├── page.tsx                      # Home page
│   ├── about/page.tsx
│   ├── curricula/
│   │   ├── page.tsx                  # Curriculum catalog
│   │   └── [id]/page.tsx             # Curriculum detail
│   ├── enroll/
│   │   ├── page.tsx                  # Enrollment form (multi-step)
│   │   └── confirmation/page.tsx
│   ├── portfolios/
│   │   ├── page.tsx                  # Public portfolio grid
│   │   └── [id]/page.tsx             # Portfolio detail
│   ├── contact/page.tsx
│   ├── parent/
│   │   ├── login/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── portfolio/page.tsx
│   │   ├── privacy/page.tsx
│   │   ├── certifications/page.tsx
│   │   ├── report/page.tsx
│   │   └── settings/page.tsx
│   ├── admin/
│   │   ├── login/page.tsx
│   │   ├── page.tsx                  # Admin dashboard
│   │   ├── enrollments/page.tsx
│   │   ├── students/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── curricula/page.tsx
│   │   └── users/page.tsx
│   └── verify/cert/[shareLink]/page.tsx
├── components/
│   ├── ui/                           # Design system components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   ├── Avatar.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── Modal.tsx
│   │   ├── Toast.tsx
│   │   ├── Toggle.tsx
│   │   ├── ShareButton.tsx
│   │   └── EmptyState.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx
│   │   └── MobileNav.tsx
│   ├── forms/
│   │   ├── EnrollmentForm.tsx
│   │   ├── ProjectForm.tsx
│   │   ├── CertificationForm.tsx
│   │   └── StudentForm.tsx
│   ├── portfolio/
│   │   ├── ProjectCard.tsx
│   │   ├── CertificationBadge.tsx
│   │   ├── SkillBar.tsx
│   │   ├── GalleryGrid.tsx
│   │   └── ProgressOverview.tsx
│   └── admin/
│       ├── StatsCard.tsx
│       ├── EnrollmentTable.tsx
│       ├── StudentTable.tsx
│       └── ActivityFeed.tsx
├── lib/
│   ├── prisma.ts                     # DB client
│   ├── auth.ts                       # Auth helpers, JWT
│   ├── middleware.ts                  # Route protection
│   ├── validations.ts                # Zod schemas
│   ├── utils.ts                      # Helpers
│   └── mail.ts                       # Email sender
├── app/api/
│   ├── public/
│   │   ├── curricula/route.ts
│   │   ├── portfolios/route.ts
│   │   ├── enroll/route.ts
│   │   └── verify/route.ts
│   ├── auth/
│   │   ├── parent/login/route.ts
│   │   └── admin/login/route.ts
│   ├── parent/
│   │   ├── portfolio/route.ts
│   │   ├── certifications/route.ts
│   │   └── report/route.ts
│   └── admin/
│       ├── dashboard/route.ts
│       ├── enrollments/route.ts
│       ├── students/route.ts
│       ├── curricula/route.ts
│       └── users/route.ts
├── prisma/
│   └── schema.prisma                 # Database schema
├── public/
│   ├── images/
│   └── uploads/
├── styles/
│   └── globals.css                   # Tailwind + custom tokens
├── .env.local                        # Environment variables
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

### 12.2 Prisma Schema Highlights

```prisma
model Curriculum {
  id              String       @id @default(uuid()) @db.Uuid
  title           String
  level           String
  minAge          Int          @map("min_age")
  maxAge          Int          @map("max_age")
  description     String
  contentOverview String?      @map("content_overview")
  price           Decimal
  duration        String?
  iconUrl         String?      @map("icon_url")
  isActive        Boolean      @default(true) @map("is_active")
  enrollments     Enrollment[]
  createdAt       DateTime     @default(now()) @map("created_at")
  updatedAt       DateTime     @updatedAt @map("updated_at")

  @@map("curricula")
}

model Enrollment {
  id                   String   @id @default(uuid()) @db.Uuid
  studentFirstName     String   @map("student_first_name")
  studentLastName      String   @map("student_last_name")
  studentDateOfBirth   DateTime @map("student_date_of_birth") @db.Date
  parentFirstName      String   @map("parent_first_name")
  parentLastName       String   @map("parent_last_name")
  parentEmail          String   @map("parent_email")
  parentPhone          String?  @map("parent_phone")
  curriculumId         String   @map("curriculum_id") @db.Uuid
  curriculum           Curriculum @relation(fields: [curriculumId], references: [id])
  status               String   @default("pending")
  adminNotes           String?  @map("admin_notes")
  processedBy          String?  @map("processed_by") @db.Uuid
  processedAt          DateTime? @map("processed_at")
  createdAt            DateTime @default(now()) @map("created_at")

  @@map("enrollments")
}
```

---

## 13. State Management

### 13.1 Approach

For a Next.js app, use a combination of:

- **React Server Components** — Data fetching on public pages (curricula, portfolios)
- **React Query / TanStack Query** — Client-side data fetching with caching (parent & admin)
- **React Context** — Auth state (JWT token, user role)
- **URL params** — Filters, pagination, portfolio ID

### 13.2 Auth State

```typescript
interface AuthState {
  user: { id: string; role: 'parent' | 'admin'; email?: string } | null;
  token: string | null;
  isLoading: boolean;
}
```

---

## 14. Error Handling & UX Feedback

### 14.1 User-Facing Messages

| Situation | Feedback |
|-----------|----------|
| Enrollment submitted | Toast: "✓ Request submitted! The school will review your application." |
| Enrollment accepted | Email + Toast to admin |
| Login failed | Inline error: "Invalid access code. Please check and try again." |
| Portfolio not found | 404 page: "This portfolio is private or doesn't exist." |
| Delete action | Modal: "Are you sure? This action is irreversible." (RG12) |
| Form validation | Inline errors under each field |
| Network error | Toast: "Connection error. Please try again." |
| Empty portfolio | EmptyState: "No projects yet. Check back soon!" |
| Unauthorized access | Redirect to login + Toast: "Please sign in to continue." |

---

## 15. Development Phases

### Phase 1: Foundation (Week 1)
- [ ] Project scaffolding (Next.js, Tailwind, Prisma, PostgreSQL)
- [ ] Database schema & migrations
- [ ] Design system components (Button, Card, Input, Badge, Modal, Toast)
- [ ] Layout (Header, Footer, navigation)
- [ ] Environment configuration

### Phase 2: Public Pages (Week 2)
- [ ] Home page (hero, stats, curriculum preview)
- [ ] About page
- [ ] Curricula catalog & detail pages
- [ ] Contact page
- [ ] SEO metadata

### Phase 3: Enrollment Flow (Week 3)
- [ ] Multi-step enrollment form with validation
- [ ] Enrollment confirmation page
- [ ] Admin enrollment management (list, accept, reject)
- [ ] Email notification (accept/reject)

### Phase 4: Parent Portal (Week 4)
- [ ] Parent authentication (login via secret)
- [ ] Parent dashboard
- [ ] Portfolio view
- [ ] Privacy toggle
- [ ] Certification sharing
- [ ] Download progress report (PDF generation)

### Phase 5: Admin Dashboard (Week 5)
- [ ] Admin authentication
- [ ] Dashboard stats
- [ ] Student CRUD
- [ ] Project, certification, gallery management
- [ ] Admin user management
- [ ] Activity log

### Phase 6: Polish & Deploy (Week 6)
- [ ] Error handling & edge cases
- [ ] Loading states & skeletons
- [ ] Responsive design audit
- [ ] Performance optimization
- [ ] Deployment (Vercel/Railway)
- [ ] Testing (critical paths)

---

## Appendix: AI Assistant Prompts

### For OpenCode / Codex / Antigravity

When asking your AI assistant to implement features, use prompts structured like this:

```
Generate the [Prisma schema] for the [Enrollment] model based on this spec:
- Links to Curriculum via curriculumId
- Fields: student name, DOB, parent name, email, phone
- Status: pending | accepted | rejected
- Tracks who processed it and when
- Created_at timestamp
```

```
Create a [MultiStepEnrollmentForm] component that:
- Step 1: Child info (name, DOB)
- Step 2: Curriculum selection (filtered by age)
- Step 3: Parent info (name, email, phone)
- Step 4: Review and submit
- Validates with Zod
- Calls POST /api/public/enroll
- Shows success toast on completion
```

```
Implement [admin middleware] that:
- Reads JWT from Authorization header
- Verifies token validity
- Checks role === 'admin'
- Returns 401/403 if unauthorized
- Attaches user to request object
```

---

> **End of Specification Document**
>
> This document is designed to be fed directly to AI coding assistants (OpenCode, Codex, Antigravity, Cursor, GitHub Copilot) to generate the complete application with minimal back-and-forth clarification.
