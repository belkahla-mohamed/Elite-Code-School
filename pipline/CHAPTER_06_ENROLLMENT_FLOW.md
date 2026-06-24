# Chapter 6: Enrollment Flow

> **Goal**: Build the complete enrollment request and processing workflow.

---

## Tasks

### [ ] T6.1 — Create Enrollment Form (`app/enroll/page.tsx`)
Multi-step form with progress indicator (steps 1-4):

**Step 1: Child Information**
- Fields: child first name, child last name, date of birth (date picker)
- Age validation: must be between 7-17 (RG4)
- Show "Invalid age" error if outside range

**Step 2: Curriculum Selection**
- Fetch curricula from API
- Filter curricula by child's age (RG5): show only curricula where minAge <= childAge <= maxAge
- Radio/select cards for each eligible curriculum
- Show curriculum details (price, duration) below selection

**Step 3: Parent Information**
- Fields: parent first name, parent last name, email (validated), phone (optional)
- Email format validation

**Step 4: Review & Submit**
- Display all entered information in a summary
- "Submit Request" button
- Loading state during submission
- Zod validation on all fields across all steps

### [ ] T6.2 — Create EnrollmentForm component (`components/forms/EnrollmentForm.tsx`)
- State management for multi-step form
- Navigation: Previous/Next buttons
- Step validation before proceeding
- Data stored in component state until final submit

### [ ] T6.3 — Create Enrollment confirmation page (`app/enroll/confirmation/page.tsx`)
- Success message: "Your enrollment request has been received!"
- Reference number display
- Email confirmation note: "We will contact you at the email provided."
- CTA: "Back to Home" and "Browse Curricula"

### [ ] T6.4 — Create POST API route (`POST /api/public/enroll`)
- Accept enrollment form data
- Validate with Zod schema
- Check age against curriculum age range (RG4, RG5)
- Create enrollment record with status "pending" (RG1)
- Do NOT create student record yet (RG2)
- Return success response with reference ID
- Handle duplicate submission prevention (rate limit or email check)

### [ ] T6.5 — Create Enrollment status check (`GET /api/public/enroll/:id/status`)
- Allow visitors to check enrollment status using reference ID
- Return: status (pending/accepted/rejected), basic info

### [ ] T6.6 — Create Admin Enrollment list page (`app/admin/enrollments/page.tsx`)
- Fetch all enrollments (`GET /api/admin/enrollments`)
- Filter tabs: All | Pending | Accepted | Rejected
- Table with columns: child name, age, curriculum, parent email, date, status
- Pending rows highlighted or with action buttons (Accept / Reject)
- Count badge on "Pending" tab

### [ ] T6.7 — Create Admin enrollment detail view
- Expandable row or modal showing full enrollment details
- Child info, parent contact, curriculum chosen, admin notes field
- Accept / Reject buttons

### [ ] T6.8 — Implement Accept Enrollment API (`PUT /api/admin/enrollments/:id/accept`)
- Validate admin auth
- Transaction: 
  1. Generate unique `access_secret` for parent
  2. Create `parents` record with hashed secret
  3. Create `students` record linked to parent (RG3)
  4. Update enrollment status → "accepted"
- Send confirmation email to parent with access secret
- Return updated enrollment + student ID

### [ ] T6.9 — Implement Reject Enrollment API (`PUT /api/admin/enrollments/:id/reject`)
- Validate admin auth
- Update enrollment status → "rejected"
- Optional admin notes field (reason for rejection)
- Send rejection notification email

### [ ] T6.10 — Create Admin enrollment stats in Dashboard
- Card: "Pending Enrollments" with count
- Alert/warning if count > 0
- Quick link to enrollments page

### [ ] T6.11 — Create Email notification service (`lib/mail.ts`)
- Send enrollment confirmation to parent (when request submitted)
- Send acceptance email with access secret
- Send rejection email with optional reason
- Use Resend / Nodemailer / SendGrid

---

**Progress**: `0 / 11 tasks completed`

**Next**: → [Chapter 7: Authentication System](CHAPTER_07_AUTHENTICATION.md)

---

*Check tasks by replacing `[ ]` with `[x]` when completed.*
