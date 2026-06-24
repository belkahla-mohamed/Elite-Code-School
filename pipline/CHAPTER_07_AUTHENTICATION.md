# Chapter 7: Authentication System

> **Goal**: Implement authentication for both Parent and Admin roles with JWT.

---

## Tasks

### [x] T7.1 — Create Auth utilities (`lib/auth.ts`)
- `generateToken(payload)` — sign JWT with user data + expiry (24h for parent, 8h for admin)
- `verifyToken(token)` — verify and decode JWT
- `hashPassword(password)` — bcrypt hash
- `comparePassword(password, hash)` — bcrypt compare
- `generateAccessSecret()` — generate unique secret for parent access (e.g., 12-char alphanumeric)

### [x] T7.2 — Create Auth middleware (`lib/middleware.ts`)
- `requireParentAuth()` — checks JWT from Authorization header, role === 'parent', attaches parentId and studentIds
- `requireAdminAuth()` — checks JWT, role === 'admin', attaches adminId
- Return 401 if no token, 403 if wrong role
- Return 401 if token expired

### [x] T7.3 — Create Parent login page (`app/parent/login/page.tsx`)
- Single field: access secret (password input)
- Submit → `POST /api/auth/parent/login`
- On success: store JWT in localStorage/httpOnly cookie, redirect to parent dashboard
- On failure: show error "Invalid access code. Please check and try again."
- Link: "Don't have an access code? Contact the school."

### [x] T7.4 — Create Parent login API (`POST /api/auth/parent/login`)
- Accept access_secret
- Look up parent by secret
- Compare hashed secret
- Generate JWT with `{ parentId, studentIds[], role: 'parent' }`
- Return token + parent basic info

### [x] T7.5 — Create Admin login page (`app/admin/login/page.tsx`)
- Fields: email, password
- Submit → `POST /api/auth/admin/login`
- On success: store JWT, redirect to admin dashboard
- On failure: show error "Invalid credentials."

### [x] T7.6 — Create Admin login API (`POST /api/auth/admin/login`)
- Accept email + password
- Look up admin by email
- Compare hashed password
- Generate JWT with `{ adminId, role: 'admin' }`
- Return token + admin basic info

### [x] T7.7 — Create Auth context provider (`lib/auth-context.tsx`)
- React Context for auth state
- `user` object, `token`, `isLoading`, `login()`, `logout()`, `isAuthenticated`
- On app load: check for stored token, verify it's not expired
- Auto-logout on token expiry
- Provide `isParent` and `isAdmin` derived booleans

### [x] T7.8 — Create ProtectedRoute / AuthGuard components
- `ParentGuard` wrapper — redirects to `/parent/login` if not authenticated as parent
- `AdminGuard` wrapper — redirects to `/admin/login` if not authenticated as admin
- Shows loading spinner while checking auth

### [x] T7.9 — Create Logout functionality
- Clear JWT from storage
- Redirect to home page
- Show toast: "You have been logged out."

### [~] T7.10 — Create password reset flow for Admin (optional, skipped)
- Forgot password page
- Email reset link
- Reset password form

---

**Progress**: `9 / 10 tasks completed`

**Next**: → [Chapter 8: Parent Portal](CHAPTER_08_PARENT_PORTAL.md)

---

*Check tasks by replacing `[ ]` with `[x]` when completed.*
