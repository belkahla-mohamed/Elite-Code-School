# Responsive Design Guidelines

> Ensuring a consistent experience across all devices.

---

## Breakpoints

| Name | Tailwind Class | Min Width | Target Devices |
|------|---------------|-----------|----------------|
| Mobile | (default) | 0px | Phones (375px+) |
| Tablet | `sm:` | 640px | Large phones, small tablets |
| Tablet+ | `md:` | 768px | iPads, tablets |
| Desktop | `lg:` | 1024px | Laptops |
| Wide | `xl:` | 1280px | Desktops |

---

## Layout Behavior by Device

### Navigation Header

| Element | Mobile (<640px) | Tablet (640px+) | Desktop (1024px+) |
|---------|----------------|-----------------|-------------------|
| Logo | Always visible | Always visible | Always visible |
| Nav links | Hidden (hamburger TBD) | Hidden | Visible in sky pill |
| Log in | Hidden | Visible | Visible |
| Register | Always visible | Always visible | Always visible |

### Hero Section

| Aspect | Mobile | Desktop |
|--------|--------|---------|
| Layout | Single column (text on top) | 2-column grid |
| Headline size | `text-[3rem]` | `lg:text-[4.8rem]` |
| Text alignment | Center | Left |
| CTAs | Stack vertically | Side by side |
| Play card | Full width | Right column |

### Grid Systems

```tsx
// 3-column grid → stacks on mobile
<div className="grid gap-5 md:grid-cols-3">

// 2-column grid → 2-col on sm+
<div className="grid gap-4 sm:grid-cols-2">

// Asymmetric split → stacks on mobile, side-by-side on lg
<div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]">

// Hero split → stacks on mobile
<div className="grid gap-10 lg:grid-cols-[.95fr_1.05fr]">
```

### Cards

| Card Type | Mobile | Desktop |
|-----------|--------|---------|
| Program list | Full width | In grid columns |
| Student card | Full width | 3 per row |
| Learning step | Stacked | Left column |
| Hardware item | 1 per row | 2 per row |

---

## Typography Scaling

```tsx
// Hero Headline
className="text-[3rem] sm:text-6xl lg:text-[4.8rem]"

// Section Title
className="text-4xl md:text-6xl"

// Card Title
className="text-2xl"  // (no change across breakpoints)

// Small text
className="text-xs sm:text-sm"
```

---

## Component Adaptations

### Header
```tsx
<header className="fixed inset-x-0 top-0 z-50 border-b-2 border-[#E8EEF6] bg-white">
  <div className="container-shell flex items-center justify-between py-4">
    <Link href="/" className="flex items-center gap-3 font-display text-2xl font-black">
      <Code2 className="size-8" /> {/* Shrink icon on mobile? */}
      <span>Elite Code <span className="block -mt-2 text-base text-sky">School</span></span>
    </Link>
    <nav className="hidden md:flex ...">  {/* Hidden on mobile */}
      ...
    </nav>
    <div className="flex items-center gap-3">
      <Link href="/login" className="hidden sm:inline-flex ...">Log in</Link>
      <Link href="/inscription" className="...">Register</Link>
    </div>
  </div>
</header>
```

### Footer
```tsx
<footer className="bg-ink py-12 text-white">
  <div className="container-shell grid gap-8 md:grid-cols-[2fr_1fr_1fr]">
    <!-- Mobile: stacks vertically -->
    <!-- Desktop: 3 columns (2fr / 1fr / 1fr) -->
  </div>
</footer>
```

---

## Image & Media

- All images use `Next/Image` with `layout="responsive"` or `fill`
- HeroPlayCard uses CSS-constructed shapes (no actual images)
- Hardware icons are Lucide React components (vector, responsive)
- Gallery images use object-cover with fixed aspect ratios

---

## Touch Targets (Mobile)

Minimum interactive area: **44x44px**

```tsx
// Too small — fix:
<a className="p-2">  // 32px total — insufficient
<a className="p-3">  // 44px total — good

// Buttons already meet this:
<button className="px-5 py-2">  // Sufficient height
```

---

## Testing Checklist

- [ ] All pages render on 375px width without horizontal scroll
- [ ] Navigation is accessible on mobile
- [ ] All buttons and links are tappable (min 44px)
- [ ] Text is readable without zooming
- [ ] Forms are full-width on mobile
- [ ] Cards stack properly on small screens
- [ ] Section backgrounds span full width at all sizes
- [ ] Footer columns stack on mobile
- [ ] Tables scroll horizontally on mobile (admin dashboard)
- [ ] Modal/dialogs are centered and properly sized on mobile

---

## Mobile-First Approach

Always write the **mobile layout first** (single column), then add responsive variants:

```tsx
// Correct — mobile-first:
<div className="grid gap-5 md:grid-cols-3">
  {/* Mobile: 1 column, md+: 3 columns */}
</div>

// Wrong — desktop-first:
<div className="grid gap-5 grid-cols-3 max-md:grid-cols-1">
```
