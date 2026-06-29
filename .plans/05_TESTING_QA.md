# Phase 5: Testing & QA

> **Goal**: Write and run E2E tests with Playwright, add unit tests for critical paths, verify build integrity.
> **Estimated effort**: 3–5 hours

---

## Overview

Testing ensures the application works correctly across all user flows and prevents regressions. This phase adds automated tests at two levels: E2E (user flows) and unit (critical logic).

Playwright is already configured (`playwright.config.ts`) with a basic test at `e2e/home.spec.ts`.

---

## Task 5.1 — E2E Test: Complete Enrollment Flow

### Test File
`e2e/enrollment.spec.ts`

### Test Scenarios
1. **Visitor browses curricula**
   - Navigate to `/curricula`
   - Verify curriculum cards are displayed
   - Click on a curriculum → detail page loads
   
2. **Visitor submits enrollment request**
   - Navigate to `/inscription`
   - Fill step 1: child name, age
   - Step 2: select program
   - Step 3: parent name, email, phone
   - Step 4: review and submit
   - Verify redirect to confirmation page
   - Verify confirmation message

3. **Admin processes enrollment (accept)**
   - Log in as admin (`/admin-login`)
   - Navigate to dashboard
   - See pending enrollment count
   - Click accept on a pending enrollment
   - Verify status changes to accepted
   - Verify parent secret is generated

4. **Parent logs in with secret**
   - Navigate to `/login`
   - Enter email and access secret
   - Verify redirect to parent portal
   - Verify student name is displayed

---

## Task 5.2 — E2E Test: Admin CRUD Operations

### Test File
`e2e/admin.spec.ts`

### Test Scenarios
1. **Admin login**
   - Navigate to `/admin-login`
   - Enter password
   - Verify redirect to dashboard
   
2. **Student management**
   - Navigate to students list
   - Search for a student
   - Click on student → detail page
   - Edit student info
   - Verify changes saved
   
3. **Program management**
   - Navigate to programs
   - Add new program
   - Verify program appears in list
   - Edit program
   - Delete program (with confirmation)

4. **Logout**
   - Click logout
   - Verify redirect to admin-login

---

## Task 5.3 — E2E Test: Portfolio & Privacy

### Test File
`e2e/portfolio.spec.ts`

### Test Scenarios
1. **Public portfolio visibility**
   - Navigate to `/portfolios`
   - Verify public portfolios are displayed
   - Click on a portfolio
   - Verify projects, certifications, gallery tabs work

2. **Private portfolio handling**
   - Verify private portfolio shows "Portfolio privé" message
   
3. **Parent privacy toggle**
   - Log in as parent
   - Toggle privacy to private
   - Verify public page shows private message
   - Toggle back to public
   - Verify portfolio is visible again

---

## Task 5.4 — E2E Test: Certification & Sharing

### Test File
`e2e/certification.spec.ts`

### Test Scenarios
1. **Certification verification page**
   - Navigate to `/certification/[id]`
   - Verify certification details are displayed
   - Verify verification badge

2. **Share link**
   - Log in as parent
   - Click copy link on certification
   - Verify link was copied (clipboard API)
   - Open the copied link in new tab
   - Verify verification page loads

---

## Task 5.5 — Unit Tests: Auth Utilities

### Test File
`lib/__tests__/auth.test.ts`

### Test Cases
1. `generateToken()` creates a valid JWT
2. `verifyToken()` returns payload for valid token
3. `verifyToken()` returns null for expired token
4. `verifyToken()` returns null for tampered token
5. `hashSecret()` produces consistent hashes
6. `generateAccessSecret()` produces unique secrets
7. `verifyAdminPassword()` matches configured password

---

## Task 5.6 — Unit Tests: Validation Schemas

### Test File
`lib/__tests__/validation.test.ts`

### Test Cases
1. `inscriptionSchema` validates correct data
2. `inscriptionSchema` rejects age < 7
3. `inscriptionSchema` rejects age > 17
4. `inscriptionSchema` rejects invalid email
5. `inscriptionSchema` rejects missing required fields
6. `projectSchema` validates correct data
7. `projectSchema` rejects progress > 100
8. `certificationSchema` validates correct data
9. `gallerySchema` validates correct data

---

## Task 5.7 — Unit Tests: Store Functions

### Test File
`lib/__tests__/store.test.ts`

### Test Cases
1. `getPrograms()` returns all programs
2. `createInscriptionRequest()` adds to store
3. `acceptInscriptionRequest()` creates student + generates secret
4. `refuseInscriptionRequest()` updates status
5. `deleteStudent()` cascades to related data
6. `getPublicPortfolios()` only returns public students
7. `getPortfolioBySlug()` respects privacy setting

---

## Task 5.8 — Build Verification

### Checklist
- [ ] `npm run build` passes with zero errors
- [ ] No TypeScript strict mode errors
- [ ] No ESLint warnings or errors
- [ ] Bundle size is reasonable
- [ ] All dynamic imports work
- [ ] No missing dependencies

### Automation
Add to `.github/workflows/ci.yml`:
```yaml
- name: Run tests
  run: npm run test:e2e
- name: Build check
  run: npm run build
```

---

## Task 5.9 — Manual QA Checklist

### Public Pages
- [ ] Home page: hero, sections, CTAs all render
- [ ] About page: mission, values, approach display
- [ ] Curricula: all programs shown, clickable
- [ ] Detail page: program info, tools, CTA
- [ ] Portfolios: grid of public students
- [ ] Detail: tabs work (projects, certs, skills, gallery)
- [ ] Contact: form submits, info displayed
- [ ] Login: parent login works, error states
- [ ] Admin login: password auth works

### Admin Dashboard
- [ ] Stats cards: correct counts
- [ ] Enrollments: list, filter, accept/reject
- [ ] Students: list, search, CRUD
- [ ] Programs: CRUD with confirmation
- [ ] Settings: password change
- [ ] Gallery: view student media
- [ ] Projects: view student projects

### Parent Portal
- [ ] Login with secret works
- [ ] Student info displayed
- [ ] Privacy toggle works
- [ ] PDF download works
- [ ] Certifications: share, copy link
- [ ] Notifications toggle

### Responsive
- [ ] Mobile (375px): no breakage, readable
- [ ] Tablet (768px): 2-column grids
- [ ] Desktop (1280px): full layout

---

## Acceptance Criteria

- [ ] All E2E tests pass in CI
- [ ] All unit tests pass
- [ ] Build passes with zero errors
- [ ] Manual QA checklist completed
- [ ] GitHub Actions CI runs tests on push
- [ ] Edge cases handled (empty data, invalid input, network errors)
