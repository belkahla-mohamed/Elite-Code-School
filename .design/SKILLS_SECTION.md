# "Building Skills That Last" — Deep Dive

> The Kodable-inspired **Play → Learn → Create** framework.
> Located in the landing page `#materiel` section.

---

## Concept

This section communicates that the school builds **durable, transferable skills** through three progressive stages. It mirrors Kodable's "Play → Learn → Create" model:

| Stage | Kodable | Elite Code School |
|-------|---------|-------------------|
| **Play** | Games that spark curiosity | Robots, missions, game-based learning |
| **Learn** | Real skills at their own pace | Logic, algorithms, hardware, AI, web |
| **Create** | Design their own games | Each student builds and presents a project |

---

## Current Implementation

```tsx
<section id="materiel" className="section-padding bg-white">
  <SectionHeader
    title="Building skills that last"
    subtitle="Des compétences durables grâce aux jeux, aux robots, aux projets et à la créativité."
  />
  <div className="container-shell grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
    <!-- LEFT: 3 learning step cards -->
    <div className="grid gap-4">
      {["Play", "Learn", "Create"].map((title, index) => (
        <article key={title} className={`rounded-brand border-2 bg-white p-6 ${borderColors[index]}`}>
          <h3 className={`font-display text-3xl font-black ${textColors[index]}`}>{title}</h3>
          <p className="mt-2 text-sm font-semibold leading-6 text-ink-soft">{description}</p>
        </article>
      ))}
    </div>
    <!-- RIGHT: 2x4 hardware grid -->
    <div className="grid gap-4 sm:grid-cols-2">
      {hardware.map(([Icon, name, description], index) => (
        <article key={name} className="rounded-[1.4rem] border-2 border-[#E8EEF6] bg-surface p-6 transition hover:border-sky">
          <div className={`mb-5 flex size-12 items-center justify-center rounded-2xl ${programIconBg(index)}`}>
            <Icon className="text-ink" />
          </div>
          <h3 className="font-display text-lg font-black">{name}</h3>
          <p className="mt-2 text-sm font-semibold leading-6 text-ink-soft">{description}</p>
        </article>
      ))}
    </div>
  </div>
</section>
```

---

## Visual Design Breakdown

### Left Column — 3 Learning Stages

| Element | Style |
|---------|-------|
| **Play** card | `border-amber`, heading `text-amber` |
| **Learn** card | `border-sky`, heading `text-sky` |
| **Create** card | `border-pink`, heading `text-pink` |
| Card body | `bg-white p-6 rounded-brand` |
| Description | `text-sm font-semibold text-ink-soft` |
| Layout | Stacked vertically, `gap-4` |

### Right Column — Hardware Grid

| Element | Style |
|---------|-------|
| Container | `grid gap-4 sm:grid-cols-2` |
| Each item | `rounded-[1.4rem] border-2 border-[#E8EEF6] bg-surface p-6` |
| Hover | `transition hover:border-sky` |
| Icon wrapper | `flex size-12 items-center justify-center rounded-2xl` with colored bg |
| Title | `font-display text-lg font-black` |
| Description | `text-sm font-semibold leading-6 text-ink-soft` |

### Icon Background Colors (alternating)

| Index | Color Class | Hex |
|-------|-------------|-----|
| 0 | `bg-[#E8F7FF]` | Light sky |
| 1 | `bg-[#EFF9D8]` | Light lime |
| 2 | `bg-[#FFF3D6]` | Light amber |
| 3 | `bg-[#F1EAFE]` | Light violet |
| 4 | `bg-[#FFE8ED]` | Light coral |
| 5 | `bg-[#EAF0FF]` | Light blue |

---

## Enhancement Recommendations

### 1. Add Progress Indicator Between Stages
```
[Play] ──→ [Learn] ──→ [Create]
```
Use arrow or connecting line between cards to show progression.

### 2. Add Stage Number Badges
```
0 1  PLAY
0 2  LEARN
0 3  CREATE
```
Small circled numbers on each card for narrative flow.

### 3. Add Short Labels Under Each Title
```
PLAY       LEARN        CREATE
Jeux guidés  Concepts    Projets
et robots    clairs      personnels
```

### 4. Animate on Scroll
Cards fade in from left → right as user scrolls down.

### 5. Add Visual Icon per Stage
- Play: `Gamepad2` or `Sparkles`
- Learn: `BrainCircuit` or `BookOpen`
- Create: `Rocket` or `Trophy`

---

## Kodable Reference (Play → Learn → Create)

Kodable's version uses three sections with icons:

```
<FUN-BASED LEARNING          {CSTA, ISTE & MORE          [DIGITAL MAKERSPACE
Play                         Learn                       Create
Kids explore typing, logic,  Students develop real       Kids put it all together
and problem-solving through  skills from keyboarding     designing their own
play-based games.            fluency to writing code.    games and projects.
```

Elite Code School adapts this as:
```
PLAY                         LEARN                       CREATE
Jeux guidés, robots et       Concepts clairs: logique,   Chaque élève finit par
mini-missions pour           algorithmique, hardware,    créer, présenter et
déclencher la curiosité.     IA et web.                  documenter son projet.
```

---

## Skills Section Variants

### For Parent Portal
Show child's progress through Play → Learn → Create stages with percentage completion per stage.

### For Student Profile
Show which hardware items the student has used, with checkmarks or progress indicators.

### For Admin
Show which students are in which stage, for cohort management.
