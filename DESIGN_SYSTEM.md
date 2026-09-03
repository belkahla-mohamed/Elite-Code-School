# Elite Code School — Design System

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
| `--surface` | `#f8fafc` | `#131c2e` |
| `--text` | `#0f172a` | `#f8fafc` |
| `--text-soft` | `#475569` | `#94a3b8` |
| `--border` | `#e2e8f0` | `#1e293b` |

Tailwind classes: `bg-body` / `bg-surface` / `text-ink` / `text-ink-soft` / `border-border`

### Brand palette
| Color | Class | Usage |
|---|---|---|
| Bleu | `sky` (#0284c7) | Primary actions, links, buttons |
| Bleu foncé | `sky-dark` (#075985) | Hover states |
| Bleu clair | `sky-light` (#38bdf8) | Accents |
| Ambre | `amber` (#f59e0b) | Warning |
| Lime | `lime` (#84cc16) | Success |
| Violet | `violet` (#8b5cf6) | Creativity theme |
| Mint | `mint` (#14b8a6) | Info |
| Corail | `coral` (#f43f5e) | Danger/error |
| Rose | `pink` (#c026d3) | Tags, special |
| Crème | `cream` (#fef3c7) | Warm backgrounds |

### Safelisted gradient stops
```
from-lime to-emerald
from-sky to-cyan
from-amber to-orange
from-violet to-purple
```

---

## Typography

| Role | Font | Class |
|---|---|---|
| Body | Nunito | `font-body` |
| Headings/Display | Fredoka | `font-display` |
| Code | JetBrains Mono | `font-mono` |

- Heavy use of `font-black` (900) and `font-bold` (700)
- Section headings: `font-display text-2xl sm:text-4xl font-black tracking-[-0.05em]`
- Body text: `font-semibold leading-7 text-ink-soft`
- UI labels: `font-black uppercase tracking-wide`
- Imported via Google Fonts

---

## Border Radius

| Token | Value | Usage |
|---|---|---|
| `rounded-brand` | 28px | Cards, sections |
| `rounded-brand-sm` | 16px | Inputs, small cards |

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
