# Elite Code School — Design System

> Inspired by **Kodable** — playful, colorful, flat, chunky typography.
> Built with **Next.js + Tailwind CSS** for a professional, production-grade result.

---

## Design Philosophy

**"Playful meets professional."**

The design targets two audiences simultaneously:
- **Kids (7–17)**: Bright colors, rounded shapes, game-like UI, fun typography
- **Parents**: Clean layouts, clear information hierarchy, trustworthy feel

Every decision balances fun engagement with professional credibility.

---

## Visual DNA (Kodable-inspired)

| Element | Approach |
|---------|----------|
| **Shapes** | Extra-rounded (`28px`), pill buttons, soft squares |
| **Colors** | Flat, saturated, high contrast — sky blue anchor |
| **Typography** | Chunky display font (Fredoka) + friendly body (Nunito) |
| **Shadows** | None — pure flat design with colored borders |
| **Borders** | `2px` solid borders for card definition |
| **Icons** | Lucide icons, line style, used as accent elements |

---

## Core Tokens

| Token | Value | Where Defined |
|-------|-------|---------------|
| Primary color | `#12AEEA` (sky) | `tailwind.config.ts` |
| Display font | Fredoka | `globals.css` @import |
| Body font | Nunito | `globals.css` @import |
| Brand radius | `28px` | `tailwind.config.ts` |
| Section padding | `py-24` | Custom `.section-padding` class |
| Container max-width | `1120px` | Custom `.container-shell` class |

---

## Available Design References

| File | Content |
|------|---------|
| [COLORS_FONTS.md](COLORS_FONTS.md) | Full color palette, usage guidelines, typography scale |
| [COMPONENTS.md](COMPONENTS.md) | Reusable UI component patterns, states, variants |
| [LAYOUT_SECTIONS.md](LAYOUT_SECTIONS.md) | Page section patterns, hero, trust band, cards grid, CTA |
| [SKILLS_SECTION.md](SKILLS_SECTION.md) | Deep-dive: "Building skills that last" Play → Learn → Create |
| [ANIMATIONS.md](ANIMATIONS.md) | Micro-interactions, transitions, hover effects |
| [RESPONSIVE.md](RESPONSIVE.md) | Breakpoint behavior, mobile adaptations, grid rules |

---

## Quick Start for Developers

1. Use `tailwind.config.ts` tokens — never hardcode colors
2. Use `cn()` from `lib/utils.ts` for conditional classes
3. All cards use `rounded-brand` + `border-2 border-[#E8EEF6]`
4. All headings use `font-display` + `font-black`
5. All section headers use `SectionHeader` component pattern
6. All CTAs use `.btn-primary` or `.btn-outline` utility classes
7. Keep flat — no `shadow-*` classes, use colored borders instead

---

## File Structure

```
.design/
├── README.md          ← This file
├── COLORS_FONTS.md
├── COMPONENTS.md
├── LAYOUT_SECTIONS.md
├── SKILLS_SECTION.md
├── ANIMATIONS.md
└── RESPONSIVE.md
```
