# Elite Code School — Design System

> **Direction: « Playful professionnel »** — la joie de l'école de code pour enfants, exécutée avec la discipline d'un produit premium. Une couleur forte, des accents maîtrisés, pas de cri visuel.

## Stack
- Next.js 15+ App Router (RSC, `"use client"` where needed)
- TypeScript strict
- Tailwind CSS + CSS variables
- shadcn/ui (New York style) + Radix UI primitives
- Lucide icons
- `cn()` from `@/lib/utils` (clsx + tailwind-merge)
- next-themes for dark mode (`class` strategy)

---

## Colors

### Semantic tokens (CSS variables)
| Token | Light | Dark |
|---|---|---|
| `--background` | `#ffffff` | `#090d16` |
| `--surface` | `#f6f8fb` | `#131c2e` |
| `--text` | `#0f172a` | `#f8fafc` |
| `--text-soft` | `#475569` | `#94a3b8` |
| `--border` | `#e5e9f0` | `#1e293b` |
| `--brand` | `#2563eb` | `#60a5fa` (focus rings) |

Tailwind classes: `bg-body` / `bg-surface` / `text-ink` / `text-ink-soft` / `border-border`

### Brand palette
| Color | Class | Usage |
|---|---|---|
| **Bleu électrique** | `sky` (#2563eb) | **Couleur unique de la marque** : actions primaires, liens, hero, CTA |
| Bleu foncé | `sky-dark` (#1d4ed8) | Hover states |
| Bleu clair | `sky-light` (#60a5fa) | Accents en dark mode |

### Accents programmes (usage restreint)
Les couleurs suivantes sont **réservées aux cartes programmes** (chaque programme garde son identité) — ne pas utiliser dans la navigation, les boutons ou les sections génériques:
`amber` (#f59e0b) · `lime` (#84cc16) · `violet` (#8b5cf6) · `mint` (#14b8a6) · `coral` (#f43f5e, danger) · `pink` (#c026d3) · `cream` (#fef3c7)

### Safelisted gradient stops (programmes uniquement)
```
from-lime to-emerald
from-sky to-cyan
from-amber to-orange
from-violet to-purple
```

### Règles d'usage
- **1 couleur de marque** : tout ce qui est interactif ou important = `sky`. Pas de concurrence chromatique.
- Les accents colorés encodent une information (thème du programme), ils ne décorent jamais.
- Superficies neutres (`body`/`surface`) = 90% de l'écran ; la couleur attire l'œil là où on doit cliquer.

---

## Typography

| Role | Font | Class |
|---|---|---|
| Body | Nunito (500–800) | `font-body` |
| Headings/Display | Fredoka (500–600) | `font-display` |
| Code | JetBrains Mono | `font-mono` |

- **Interdit** : `font-black` + `uppercase` + `tracking-wide` combinés (l'ancien look « qui crie »)
- Headings: `font-display text-2xl sm:text-4xl font-semibold tracking-[-0.02em]`
- Body: `text-ink-soft leading-7 font-medium`
- Boutons: `font-bold` — jamais `font-black uppercase`
- Eyebrows/labels: `text-xs font-bold uppercase tracking-[0.12em] text-sky-dark`

---

## Border Radius

| Token | Value | Usage |
|---|---|---|
| `rounded-brand` | 20px | Cards, sections |
| `rounded-brand-sm` | 12px | Buttons, inputs, small cards |
| `rounded-full` | pill | Badges, tags, avatars **uniquement** |

---

## Elevation (shadows)

| Token | Usage |
|---|---|
| `shadow-card` | Cards au repos (remplace `border-2`) |
| `shadow-card-hover` | Hover cards (léger lift) |
| `shadow-brand` | Boutons primaires (halo bleu doux) |

Les bordures passent à `border` (1px) ; la profondeur vient des ombres, pas des bordures épaisses.

---

## Layout

### Container
```tsx
<div className="container-shell">
  {/* mx-auto w-full max-w-[1120px] px-6 */}
</div>
```

### Section pattern
```tsx
<section id="..." className="py-14 sm:section-padding bg-body dark:bg-body">
  <SectionHeader title="..." subtitle="..." />
  <div className="container-shell grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    {/* content */}
  </div>
</section>
```

### SectionHeader component
```tsx
function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="container-shell mb-10 sm:mb-14 text-center">
      <h2 className="mx-auto max-w-3xl font-display text-2xl sm:text-4xl font-black tracking-[-0.05em] text-ink">
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto mt-3 sm:mt-4 max-w-2xl text-sm sm:text-base font-semibold leading-7 text-ink-soft">
          {subtitle}
        </p>
      )}
    </div>
  )
}
```

### 4 Route Layouts
| Group | Layout |
|---|---|
| `(public)` | Sticky header + `<main className="animate-page-in">` + Footer |
| `(admin)` | Collapsible sidebar (`w-64`/`w-20`) + admin header |
| `(parent)` | Horizontal nav tabs + `container-shell py-8` |
| `(auth)` | Minimal `flex min-h-screen flex-col` |

---

## Components

### Buttons (`@/components/ui/button`)
- Use with: `import { Button } from "@/components/ui/button"`
- Variants: `primary` (sky filled), `secondary` (white outline), `ghost`, `danger` (coral), `icon`
- Sizes: `sm`, `md`, `lg`
- Always `rounded-full font-black uppercase tracking-wide`
- Loading state: add `loading` prop (shows Loader2 spinner)

```tsx
<Button variant="primary" size="lg" loading>
  Soumettre
</Button>
```

### Cards (`@/components/ui/card`)
- `Card`, `CardHeader`, `CardBody`, `CardFooter`
- Variants: `default`, `interactive` (hover lift), `bordered` (sky border)
- Always `rounded-brand border-2`

```tsx
<Card variant="interactive">
  <CardHeader>Title</CardHeader>
  <CardBody>Content</CardBody>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Inputs (`@/components/ui/input`)
- `Input`, `Textarea`, `Select` (native)
- `rounded-brand-sm border-2`, focus: `border-sky`
- Error state: add `error` prop (shows coral border + message)
- Always use `z.string().trim()` on Zod fields

```tsx
<Input label="Nom" error={errors.name} {...register("name")} />
<Textarea label="Message" rows={4} />
```

### Badges (`@/components/ui/badge`)
- Variants: `pending` (amber), `accepted` (lime), `rejected` (coral), `info` (sky), `success` (mint)
- Always `font-black uppercase tracking-wider rounded-full`

### Avatars (`@/components/ui/avatar`)
- 4 sizes: `sm`, `md`, `lg`, `xl`
- Gradient bg (`from-sky to-cyan`), `rounded-full border-2 border-white`

### Dialogs (`@/components/ui/dialog`)
- Radix-based modal, use `ConfirmDialog` for confirmation flows
- `danger` variant (coral) or `default` (sky)

### Empty states (`@/components/ui/empty-state`)
- Centered layout with optional icon, title, description, action button

### Skeleton (`@/components/ui/skeleton`)
- 8 variants: `Skeleton`, `StatCardSkeleton`, `ListItemSkeleton`, `CardSkeleton`, `TableSkeleton`, `FormSkeleton`, `DetailSkeleton`, `CardGridSkeleton`
- `animate-pulse rounded-brand-sm bg-sky/10`

### Toast (`@/components/ui/toast`)
- Uses `react-hot-toast`
- 4 variants: `success` (lime border), `error` (coral), `warning` (amber), `info` (sky)

```tsx
import toast from "react-hot-toast"
toast.success("Inscription envoyée")
toast.error("Une erreur est survenue")
```

### Page transition
```tsx
// In page files — wrap main content
<main className="animate-page-in">...</main>
```

---

## Animations

### Keyframes (defined in globals.css)
| Class | Effect |
|---|---|
| `animate-page-in` | fade-in 0.5s (opacity + translateY 12px) |
| `animate-fade-up` | fade-up 0.6s (opacity + translateY 24px) |
| `animate-scale-in` | scale-in 0.4s |

### Scroll reveal (`@/components/ui/scroll-reveal`)
```tsx
<ScrollReveal delay={0.2}>
  <div>Content fades in on scroll</div>
</ScrollReveal>
```

### Reduced motion
All animations are disabled when `prefers-reduced-motion: reduce` is active.

### Theme transition
All themed properties transition at 300ms `cubic-bezier(0.4, 0, 0.2, 1)`.

---

## Dark Mode
- `class`-based via next-themes
- All components must have `dark:` variants
- Theme toggle: pill-style with Sun/Moon icons (`@/components/ui/theme-toggle`)
- Provider: `@/components/ui/theme-provider`

---

## Icons
- Library: **Lucide** (`import { User, Settings, LogOut } from "lucide-react"`)
- Always use with `className="h-4 w-4"` or similar sizing

---

## Common Tailwind Patterns
- Section padding: `py-14 sm:section-padding` (`section-padding` = `py-24`)
- Hover lift: `hover:-translate-y-0.5 transition-all duration-300`
- Active nav: `bg-sky/10 text-sky`
- Uppercase labels: `font-black uppercase tracking-wide`
- Mobile-first responsive: `text-sm sm:text-base`

---

## Example: New Page Template
```tsx
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function NewPage() {
  return (
    <main className="animate-page-in">
      <section className="py-14 sm:section-padding">
        <div className="container-shell mb-10 sm:mb-14 text-center">
          <h1 className="font-display text-3xl sm:text-5xl font-black tracking-[-0.05em] text-ink">
            Page Title
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-ink-soft font-semibold">
            Description
          </p>
        </div>
        <div className="container-shell grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card variant="interactive">
            <CardBody>
              <h3 className="font-display text-xl font-bold text-ink">Card Title</h3>
              <p className="mt-2 text-ink-soft">Card content</p>
            </CardBody>
          </Card>
        </div>
      </section>
    </main>
  )
}
```
