# Animation & Interaction Design

> Micro-interactions that make the UI feel alive without being distracting.

---

## Current State

The current codebase uses minimal animations:
- `scroll-behavior: smooth` on `html`
- `transition` on interactive elements (cards, buttons)
- `hover:border-sky` on hoverable cards

---

## Recommended Animation Patterns

### 1. Hover Effects (existing, keep)

| Element | Effect | Implementation |
|---------|--------|----------------|
| Card | Border color change to sky | `transition hover:border-sky` |
| Button | Background darkens | `transition hover:bg-sky-dark` |
| Link | Color change | `transition hover:text-*` |

### 2. Page Load / Entry Animations

Add subtle fade-in-up for sections as they enter viewport:

```tsx
// Tailwind approach (no extra library needed):
<section className="animate-fade-in-up">
```

Add to `tailwind.config.ts`:
```ts
keyframes: {
  "fade-in-up": {
    "0%": { opacity: "0", transform: "translateY(24px)" },
    "100%": { opacity: "1", transform: "translateY(0)" },
  }
},
animation: {
  "fade-in-up": "fade-in-up 0.6s ease-out forwards",
}
```

### 3. Card Stagger Animation

When a grid of cards appears, stagger their entry:

```tsx
// Each card gets increasing animation-delay
<div className="container-shell grid gap-5 md:grid-cols-3">
  {items.map((item, index) => (
    <article
      key={item.id}
      className="animate-fade-in-up opacity-0"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {item.content}
    </article>
  ))}
</div>
```

### 4. Number Counter Animation

For stats (Total Students, New This Month, etc.), animate counting up:
- Start at 0, animate to target value over 1.5s
- Ease-out timing
- Trigger on viewport entry

### 5. Button Press / Click Effect

```tsx
// Active state
className="active:scale-[0.97] transition-transform duration-150"
```

### 6. Progress Bar Animation

When progress percentage updates, animate the width change:
```css
transition: width 0.6s ease-out;
```

### 7. Mobile Menu / Drawer Animation

When hamburger menu opens on mobile:
- Slide-in from right: `translate-x-full → translate-x-0`
- Duration: 300ms, ease-out
- Backdrop fades in: `opacity-0 → opacity-50`

---

## Animation Principles

1. **Subtle** — max 300-600ms duration
2. **Performance** — prefer `transform` and `opacity` (GPU-composited)
3. **Progressive enhancement** — works without JS, better with it
4. **No motion preference** — respect `prefers-reduced-motion`
5. **Not distracting** — never animate content that needs reading

---

## prefers-reduced-motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## Implementation Priority

| Priority | Animation | Effort | Impact |
|----------|-----------|--------|--------|
| P0 | Hover states on interactive elements | Already done | High |
| P1 | Progress bar animation | Low | Medium |
| P2 | Card entry stagger on portfolio grids | Medium | High |
| P3 | Fade-in-up sections on scroll | Medium | Medium |
| P4 | Number counters on dashboard | Medium | Low |
| P5 | Mobile drawer animation | Low | Medium |
