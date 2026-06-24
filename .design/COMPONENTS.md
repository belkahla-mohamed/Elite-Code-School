# Component Design Patterns

> All components follow the existing codebase conventions.

---

## 1. Button Patterns

### Primary CTA
```tsx
<Link href="/inscription" className="btn-primary">
  Start learning today <ArrowRight />
</Link>
```
- Renders as: `rounded-full bg-sky px-8 py-3 text-sm font-black uppercase tracking-wide text-white hover:bg-sky-dark`
- Used for: main actions, enrollment, submit

### Outline CTA
```tsx
<Link href="/login" className="btn-outline">
  Log in
</Link>
```
- Renders as: `rounded-full border-2 border-sky bg-white px-8 py-3 text-sm font-black uppercase tracking-wide text-sky hover:bg-sky hover:text-white`
- Used for: secondary actions, login

### Pink Register Button
```tsx
<Link href="/inscription" className="rounded-full bg-pink px-5 py-2 text-xs font-black uppercase tracking-wide text-white">
  Register
</Link>
```
- Used for: header register, emphasis CTAs

### Pink Link with Arrow
```tsx
<Link href="/inscription" className="inline-flex items-center gap-2 font-black text-pink">
  Try a free discovery session <ArrowRight className="size-4" />
</Link>
```
- Used for: inline action links

### White-on-Sky CTA
```tsx
<Link href="/inscription" className="inline-flex rounded-full bg-white px-8 py-3 text-sm font-black uppercase tracking-wide text-sky-dark">
  Create your free account <ArrowRight />
</Link>
```
- Used for: CTAs on blue/dark backgrounds

---

## 2. Card Patterns

### Default Card
```tsx
<article className="rounded-brand border-2 border-[#E8EEF6] bg-white p-8">
  <h3 className="font-display text-2xl font-black">Title</h3>
  <p className="mt-3 text-sm font-semibold leading-6 text-ink-soft">Description</p>
</article>
```

### Interactive Card (hoverable)
```tsx
<article className="rounded-[1.4rem] border-2 border-[#E8EEF6] bg-surface p-6 transition hover:border-sky">
  <!-- content -->
</article>
```

### Card with Colored Top Border
```tsx
<article className={`rounded-brand border-2 bg-white p-6 ${["border-amber", "border-sky", "border-pink"][index]}`}>
  <!-- content -->
</article>
```

### Portfolio Card (white on colored bg)
```tsx
<Link href={`/portfolio/${student.slug}`} className="rounded-brand border-2 border-white bg-white p-6 transition hover:border-sky">
  <!-- content -->
</Link>
```

---

## 3. Section Header Pattern

Reusable `SectionHeader` component pattern:
```tsx
function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="container-shell mb-14 text-center">
      <h2 className="mx-auto max-w-3xl font-display text-4xl font-black tracking-[-0.05em] text-ink md:text-6xl">
        {title}
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-base font-semibold leading-8 text-ink-soft">
        {subtitle}
      </p>
    </div>
  );
}
```

---

## 4. Tag / Badge Pattern

```tsx
<span className="tag">Mission annuelle</span>
<!-- Renders as: inline-flex rounded-full bg-pink px-4 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-white -->
```

---

## 5. Stat / Metric Display

```tsx
function MiniStat({ value, label }: { value: string | number; label: string }) {
  return (
    <span className="rounded-2xl border-2 border-[#E8EEF6] bg-surface p-3">
      <strong className="font-display text-lg font-black">{value}</strong>
      <br />
      <small className="font-bold text-ink-soft">{label}</small>
    </span>
  );
}
```

---

## 6. Avatar / Mascot Pattern

```tsx
function Mascot({ name, color, face }: { name: string; color: string; face: string }) {
  return (
    <div className="flex flex-col items-center justify-end gap-3">
      <div className={`grid size-28 place-items-center rounded-full border-4 border-white ${color} font-display text-3xl font-black text-white`}>
        {face}
      </div>
      <span className="rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-wide text-ink">{name}</span>
    </div>
  );
}
```

---

## 7. Program List Item Pattern

```tsx
<Link href="/inscription" className="flex items-center justify-between rounded-2xl border-2 border-[#EEF3FA] bg-surface p-4 font-black transition hover:border-sky">
  <span>{program.title}</span>
  <span className={`rounded-full px-3 py-1 text-xs ${programPill(index)}`}>{program.ageRange}</span>
</Link>
```

---

## 8. Icon + Background Wrapper

```tsx
<div className={`mb-5 flex size-12 items-center justify-center rounded-2xl ${programIconBg(index)}`}>
  <Icon className="text-ink" />
</div>
```

---

## 9. Tab Navigation Pattern (PortfolioTabs)

```tsx
<div className="mb-8 flex flex-wrap gap-2 rounded-brand bg-surface p-1">
  {items.map(([id, label]) => (
    <button
      key={id}
      onClick={() => setTab(id)}
      className={`rounded-brand-sm px-4 py-2 text-sm font-semibold transition ${active === id ? "bg-white text-accent" : "text-ink-soft hover:text-accent"}`}
    >
      {label}
    </button>
  ))}
</div>
```
- Active tab: white bg, accent text
- Inactive tab: soft text, hover accent
- Container: surface bg, rounded-brand, small padding

---

## 10. Fixed Header Pattern

```tsx
<header className="fixed inset-x-0 top-0 z-50 border-b-2 border-[#E8EEF6] bg-white">
  <div className="container-shell flex items-center justify-between py-4">
    <!-- Logo | Nav | Actions -->
  </div>
</header>
```
- Fixed position, z-50
- Bottom border for separation
- Container-shell for max-width
- Flexbox with space-between

---

## Design Principles for All Components

1. **No shadows** — use `border-2` for depth
2. **Chunky typography** — `font-black` and uppercase for emphasis
3. **Rounded everything** — `rounded-brand` for cards, `rounded-full` for buttons
4. **Consistent spacing** — `gap-3`/`gap-5`/`gap-6`/`gap-8` between elements
5. **Transition on interactive** — `transition hover:border-sky` on hoverable cards
6. **Flat icons** — Lucide React icons, size `size-4` to `size-12`
7. **No complex gradients** — solid colors only (exception: cert gradient backgrounds)
