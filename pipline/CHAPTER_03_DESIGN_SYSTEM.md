# Chapter 3: Design System & UI Components

> **Goal**: Build all reusable UI components following the design specification.

---

## Tasks

### [ ] T3.1 — Create Button component
- Variants: `primary`, `secondary`, `ghost`, `danger`, `icon`
- States: default, hover, active, disabled, loading (with spinner)
- Sizes: `sm`, `md`, `lg`
- Props: `variant`, `size`, `isLoading`, `isDisabled`, `children`, `onClick`, `type`, `className`

### [ ] T3.2 — Create Card component
- Variants: `default`, `interactive` (hover lift + shadow), `bordered`
- Sub-components: `Card.Header`, `Card.Body`, `Card.Footer`
- Props: `variant`, `className`, `children`

### [ ] T3.3 — Create Input component family
- `Input` — text, email, password, number types
- `Textarea` — multi-line text
- `Select` — dropdown options
- Props: `label`, `error` (string), `helperText`, `isDisabled`, `isRequired`, `placeholder`
- All show error state (red border + message) when `error` prop is set

### [ ] T3.4 — Create Badge component
- Variants: `pending` (amber), `accepted` (green), `rejected` (red), `info` (blue), `success` (emerald)
- Sizes: `sm`, `md`
- Used for enrollment status, skill levels, project status

### [ ] T3.5 — Create Avatar component
- Props: `src`, `alt`, `fallback` (initials), `size` (sm/md/lg/xl)
- Shows image when available, fallback initials when not
- Circular shape with border

### [ ] T3.6 — Create ProgressBar component
- Props: `value` (0-100), `color` (primary/success/accent), `size` (sm/md/lg), `showLabel` (boolean)
- Animated width transition (600ms)
- Color coding based on value range: < 30% amber, 30-70% blue, > 70% green

### [ ] T3.7 — Create Modal component
- Props: `isOpen`, `onClose`, `title`, `children`, `footer`, `size` (sm/md/lg)
- Overlay backdrop with click-outside-to-close
- Escape key to close
- Fade + scale animation (200ms)
- Used for confirmations (RG12), forms, image galleries

### [ ] T3.8 — Create Toast notification system
- Variants: `success`, `error`, `warning`, `info`
- Auto-dismiss after 4 seconds (except error: 6 seconds)
- Slide-in from top-right animation (300ms)
- Dismiss button on hover
- Uses `react-hot-toast` or custom implementation
- Messages for: enrollment submitted, login failed, data saved, etc.

### [ ] T3.9 — Create Toggle/Switch component
- Props: `checked`, `onChange`, `label`, `disabled`
- Used for public/private portfolio toggle (RG7, RG8)
- Animated sliding dot with color change

### [ ] T3.10 — Create ShareButton component
- Props: `shareLink`, `title`
- On click: copies share link to clipboard + shows toast
- Used for certification sharing (RG9)

### [ ] T3.11 — Create EmptyState component
- Props: `icon` (or illustration), `title`, `description`, `action` (optional button)
- Used for empty portfolios, no search results, no enrollments

### [ ] T3.12 — Create LoadingSpinner component
- Props: `size` (sm/md/lg), `color`
- Full-page variant: `LoadingPage` (centered spinner)
- Inline variant: for buttons and small sections

### [ ] T3.13 — Create ErrorBoundary component
- Wraps page sections
- Catches rendering errors
- Shows friendly error message with retry button

---

**Progress**: `0 / 13 tasks completed`

**Next**: → [Chapter 4: Layout & Navigation](CHAPTER_04_LAYOUT_NAVIGATION.md)

---

*Check tasks by replacing `[ ]` with `[x]` when completed.*
