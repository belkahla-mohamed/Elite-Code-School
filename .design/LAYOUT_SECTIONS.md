# Layout & Section Design Patterns

> Page section patterns used in the landing page and reusable across the app.

---

## Layout Grid Patterns

### Two-Column Split (Hero)
```tsx
<div className="container-shell grid items-center gap-10 lg:grid-cols-[.95fr_1.05fr]">
  <!-- Left: Text content -->
  <!-- Right: Visual/play card -->
</div>
```
- Used in: Hero section, "Building skills that last" section, "Support" section
- Mobile: stacks vertically
- Desktop: asymmetrical split (text slightly smaller than visual)

### Three-Column Grid
```tsx
<div className="container-shell grid gap-5 md:grid-cols-3">
  <!-- Three equal cards -->
</div>
```
- Used in: "How it works" cards, "Portfolio" student cards
- Mobile: single column
- Tablet+: 3 columns

### Two-Column Grid inside Cards
```tsx
<div className="container-shell grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
  <!-- Left: narrower column -->
  <!-- Right: wider column -->
</div>
```
- Used in: "Building skills that last" (learning steps + hardware grid)

### 2-Column Sub-grid
```tsx
<div className="grid gap-4 sm:grid-cols-2">
  <!-- Items in pairs -->
</div>
```
- Used in: hardware items, mini card grids

---

## Section Color Flow (Landing Page Order)

```
1. White (Hero)
2. Sky blue (Trust band)         ← bg-sky
3. White (Formations)            ← bg-white
4. Light gray (How it works)     ← bg-[#F4F8FC]
5. Sky blue (CTA band)           ← bg-sky
6. White (Skills + Hardware)     ← bg-white
7. Cream (Competition)           ← bg-[#FFF2D7] with cream card
8. Light blue (Portfolios)       ← bg-[#C9F1FF]
9. White (Support/Contact)       ← bg-white
10. Dark/ink (Footer)            ← bg-ink
```

### Pattern Rule
Alternate between `bg-white` and colored sections. Never put two same-color sections adjacent.

---

## Section Padding

All full sections use `py-20` or `py-24` (via `.section-padding` class):
```css
.section-padding {
  @apply py-24;
}
```
CTAs and compact sections may use `py-7` or `py-20`.

---

## Container

All section content is wrapped in:
```css
.container-shell {
  @apply mx-auto w-full max-w-[1120px] px-6;
}
```

---

## Specific Section Designs

### Hero Section
```
Container:  2-column grid
Left col:   Headline (h1), subtitle (p), CTAs (2 buttons + link)
Right col:  HeroPlayCard — nested borders (cream → yellow → white content)
              └─ Play card with 3 mascots (Logic, TV icon, Robot)
Background: White
Padding:    pt-28 (accounts for fixed header), pb-14
```

### Trust Band
```
Container:  centered text
Title:      "Trusted by young creators in Marrakech" (Fredoka white)
Badges:     Flex row of white pills with sky-dark text
Background: bg-sky
Padding:    py-7
```

### "How it works" Section
```
Container:  3-column grid
Cards:      rounded-brand, white bg, border-[#E8EEF6]
Each card:  Icon (Lucide, 48px, sky), Title (Fredoka), Description (small, soft)
Background: bg-[#F4F8FC]
Padding:    py-20
```

### CTA Band
```
Container:  centered text
Tag:        "Ready to get started?" (pink tag)
Title:      Large headline (white, Fredoka)
Description: White/90 opacity
Button:     White bg, sky-dark text
Background: bg-sky
Padding:    py-20
```

### Portfolio Section
```
Container:  3-column grid of student cards
Cards:      White bg, white border (on light-blue section), hover → sky border
Content:    Avatar (colored circle with initials), name, level, stats row
Background: bg-[#C9F1FF]
```

### Competition Section
```
Container:  rounded-[34px] border-2 border-[#FFD489] bg-cream
Layout:     2-column (text + numbered steps)
Steps:      3 cards with numbered circles (01, 02, 03)
Background: bg-[#FFF2D7]
```

---

## Mobile Adaptation Rules

1. **2-column → single column** at `lg` breakpoint
2. **3-column → single column** at `md` breakpoint
3. **Hero text** centered on mobile, left-aligned on desktop
4. **Header nav** hidden on mobile (future: hamburger menu)
5. **Buttons** full-width on mobile if space is tight
6. **Font sizes** scale down: `text-[3rem]` → `sm:text-6xl` → `lg:text-[4.8rem]`
7. **Grid gaps** reduce from `gap-10` desktop to `gap-6` mobile

---

## Reusable Section Template

```tsx
<section id="section-id" className="section-padding bg-white">
  <SectionHeader title="Section Title" subtitle="Section subtitle description." />
  <div className="container-shell grid gap-5 md:grid-cols-3">
    {/* Cards / content */}
  </div>
</section>
```
