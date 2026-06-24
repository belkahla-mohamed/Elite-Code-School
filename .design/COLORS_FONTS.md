# Colors & Typography

## Color Palette

All colors are defined in `tailwind.config.ts` under `theme.extend.colors`.

### Primary Family

| Token | Hex | Usage |
|-------|-----|-------|
| `sky` / `accent` | `#12AEEA` | Primary CTAs, active states, brand elements, header bg |
| `sky-dark` | `#0786B8` | Hover states for sky buttons, text on sky backgrounds |
| `cyan` | `#61D7F7` | Light blue backgrounds, decorative bands |

### Text Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `ink` | `#171717` | Main body text, headings |
| `ink-soft` | `#5F6572` | Secondary text, descriptions, subtitles |

### Accent Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `amber` | `#FFB31A` | Highlights, star icons, "Basics" category, warning badges |
| `lime` | `#75D64B` | Success states, "green" blocks, game board elements |
| `violet` | `#8B5CF6` | Advanced program category, secondary accent |
| `mint` | `#2DD4BF` | Decorative, skill badges |
| `coral` | `#FF6D8E` | Decorative, alerts |
| `pink` | `#C12A91` | "Register" button, `.tag` badges, links |

### Neutral Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `surface` | `#F6FBFF` | Card backgrounds, light section backgrounds |
| `cream` | `#FFF4DD` | Competition section, warm backgrounds |
| White | `#FFFFFF` | Page background, card bg |
| Border | `#E8EEF6` | Card borders, dividers |
| `bg-[#F4F8FC]` | `#F4F8FC` | "How it works" section bg |
| `bg-[#C9F1FF]` | `#C9F1FF` | Portfolio section bg |

### Color Application Rules

1. **CTAs** → `bg-sky` with white text, hover → `bg-sky-dark`
2. **Links** → `text-pink` for emphasis links
3. **Tags/badges** → `bg-pink` with white text (`.tag` class)
4. **Section backgrounds** → alternate between white and light colors
5. **Cards** → white bg + `border-2 border-[#E8EEF6]`
6. **Section header** → `text-ink` heading + `text-ink-soft` subtitle
7. **Program pills** → 4 alternating bg colors via `programPill()`

---

## Typography

### Font Stack

| Role | Font | Weights | CSS Variable |
|------|------|---------|--------------|
| **Display / Headings** | Fredoka | 500, 600, 700 | `--font-display` |
| **Body / Text** | Nunito | 500, 600, 700, 800, 900 | `--font-body` |
| **Monospace** | JetBrains Mono | 400, 600 | `--font-mono` |

Loaded via Google Fonts in `globals.css`:
```css
@import url("https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=JetBrains+Mono:wght@400;600&family=Nunito:wght@500;600;700;800;900&display=swap");
```

### Type Scale

| Element | Class | Size | Weight | Tracking |
|---------|-------|------|--------|----------|
| Hero headline | `font-display text-[3rem] sm:text-6xl lg:text-[4.8rem] font-black` | 3rem–4.8rem | 900 | `-0.04em` |
| Section title (h2) | `font-display text-4xl md:text-6xl font-black` | 2.25–3.75rem | 900 | `-0.05em` |
| Card title (h3) | `font-display text-2xl font-black` | 1.5rem | 900 | — |
| Body text | `text-base font-semibold` | 1rem | 600 | — |
| Small text | `text-sm font-semibold` | 0.875rem | 600 | — |
| Tiny/badge | `text-xs font-black uppercase tracking-wide` | 0.75rem | 900 | `wide` |
| .tag class | `text-xs font-black uppercase tracking-[0.14em]` | 0.75rem | 900 | `0.14em` |

### Usage Rules

1. All section headings → `font-display` + `font-black` + negative tracking
2. All body text → `font-body` (Nunito) via default
3. `.tag` → always `bg-pink` pill with white uppercase text
4. Button text → `text-sm font-black uppercase tracking-wide`
5. Footer headings → `font-mono text-sm uppercase tracking-wider text-white/50`
6. Never use font weights below 500 (maintain chunky look)

### Typography Pairing Examples

```
Headline (Fredoka 900):     The playful STEM school
Body (Nunito 600):          Coding, robotique et IA pour les 7–17 ans
Tag (Nunito 900 uppercase): Ready to get started?
Button (Nunito 900 uppercase):  START LEARNING TODAY
```
