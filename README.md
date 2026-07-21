# @rrt-nextjs/design-system

The single source of truth for RRT brand: tokens, primitives, and brand assets. Consumed by [`rrt-studio`](https://github.com/RRT-nextjs/rrt-studio) (operations) and [`rrt-app`](https://github.com/RRT-nextjs/rrt-app) (front desk), each via a pinned GitHub commit reference. The marketing site (`rrt-nextjs`) does not consume this package.

**This package is private** and distributed via GitHub Packages. It is not published to public npm.

- Spec: `docs/spec/01-design-system.md` (in the consumer repo's `docs/`).
- Microcopy: `docs/spec/03-microcopy.md`.
- Architecture and distribution: `docs/spec/04-architecture.md §10`.

---

## Versioning

Semver. Pre-1.0 we may ship breaking changes in minor bumps; both consumer apps pin to `~0.1.x`. After stabilizing across Slices 1-3, the package goes to `1.0.0`.

A change is **breaking** if:
- A primitive's prop name changes.
- A token name (CSS variable) changes.
- A hook signature changes.
- A color token's measured contrast ratio drops below its previously-declared assertion.

A change is **non-breaking** if:
- A new primitive ships.
- A new optional prop is added.
- A new token ships without removing one.
- An internal implementation changes without altering the public contract.

---

## Installation (future GitHub Packages publish)

Once published to GitHub Packages, each consumer repo will:

1. Add `.npmrc` at the repo root:

   ```
   @rrt-nextjs:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
   ```

2. Install:

   ```bash
   pnpm add @rrt-nextjs/design-system
   ```

For the current Slice 1 phase, this package is consumed **locally** via a relative file path or `pnpm link`. See the Local development section below.

---

## Consumer setup

### 1. Import tokens.css in `globals.css`

```css
/* src/app/globals.css */
@import "tailwindcss";
@import "@rrt-nextjs/design-system/styles/tokens.css";
@import "@rrt-nextjs/design-system/styles/shadcn-tokens.css";

/* Optional: extra baseline rules */
@import "@rrt-nextjs/design-system/styles/reset.css";
```

The token CSS uses Tailwind v4's `@theme` directive. Tailwind auto-derives utility classes (e.g. `bg-rrt-bg`, `text-rrt-maroon-700`) from the tokens at build time.

### 2. Configure `next/font/google`

Both consumers load Playfair Display + DM Sans themselves so each app controls font subsetting and weight selection:

```ts
// src/app/layout.tsx
import { Playfair_Display, DM_Sans } from 'next/font/google';

const display = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400'],
  variable: '--font-display-loaded',
});
const sans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans-loaded',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

Then in `globals.css`, override the design system's font CSS variables with the next/font-injected ones:

```css
:root {
  --font-display: var(--font-display-loaded), Georgia, "Times New Roman", serif;
  --font-sans: var(--font-sans-loaded), system-ui, -apple-system, sans-serif;
}
```

### 3. Use primitives

```tsx
import { Button, Tile, ProgramChip, useToast } from '@rrt-nextjs/design-system';

export function ClassRoster({ kids }) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {kids.map((k) => (
        <Tile
          key={k.id}
          size="kiosk"
          surface="kiosk"
          name={k.name}
          primaryLabel={k.shortName}
          secondaryLabel={`${k.classTime} ${k.programPrefix}`}
          photoUrl={k.photoUrl}
          photoConsent={k.family.photoConsent}
          programId={k.programId}
        />
      ))}
    </div>
  );
}
```

---

## What ships in v0.1.0

### Tokens (CSS-first, Tailwind v4 `@theme`)

| Group | Tokens |
|---|---|
| Neutrals | `--color-rrt-bg`, `--color-rrt-surface`, `--color-rrt-surface-hover`, `--color-rrt-surface-sunken`, `--color-rrt-line`, `--color-rrt-line-strong`, `--color-rrt-text`, `--color-rrt-text-soft`, `--color-rrt-text-faint` |
| Maroon (brand) | `--color-rrt-maroon-900/800/700/500/300/50` |
| Gold (restricted) | `--color-rrt-gold-500` (maroon-only bg), `--color-rrt-gold-700` (only gold cleared on cream) |
| Cream / dark | `--color-rrt-cream-50/100/300` |
| Semantic | `--color-rrt-success`, `warning`, `error`, `info` (+ `-bg` variants) |
| Program tones | `--color-rrt-program-{preschool,beginners,competitive,flexibility,ballet,fallback}-{bg,border,text,dot}` |
| Status | `--color-rrt-status-{checkedin,late,absent,pending,flag}` |
| Typography | `--font-display`, `--font-sans`, `--font-mono` + `--text-*` size tokens |
| Spacing | `--spacing-0..32` (4px base) |
| Radius | `--radius-{none,sm,md,lg,xl,2xl,3xl,pill}` |
| Shadow | `--shadow-{none,sm,md,lg,xl,focus,focus-dark}` |
| Motion | `--motion-duration-{instant,fast,normal,slow,celebration}`, `--motion-ease-*` |
| Icon sizes | `--icon-size-{sm,md,lg,xl}` |

Every color token has its WCAG contrast ratio noted as a CSS comment in `src/styles/tokens.css`, recomputed with the standard sRGB relative-luminance formula and enforced by `src/styles/tokens-contrast.test.ts`, which re-derives every annotated ratio from the declared values and fails on drift.

The 2026-07-21 adversarial recomputation found that four critique 04 "measured passes" were not real passes and replaced their values:

| Token | Old value | Claimed | Measured | New value | Measured |
|---|---|---|---|---|---|
| `--rrt-line` | `#C9BEAA` | 3.02:1 | 1.66:1 | `#948C7D` | 3.01:1 vs bg |
| `--rrt-line-strong` | `#9C907A` | 4.51:1 | 2.84:1 | `#776E5D` | 4.56:1 vs bg |
| `--rrt-warning` | `#B06B00` | 4.92:1 | 3.84:1 (3.78:1 on its tint) | `#9E6000` | 4.61:1 vs bg, 4.54:1 on its tint |
| `--rrt-gold-700` | `#8A6F1D` | 4.71:1 | 4.35:1 | `#866C1C` | 4.55:1 vs bg |

`--rrt-status-late` tracks `--rrt-warning` and moved with it. Gold-500 remains demoted to maroon-only backgrounds (1.90:1 on cream), and error remains the critique 04 replacement of destructive `#C84E3E` (measured 4.12:1), now annotated at its recomputed 5.92:1. Every other annotation was corrected in place where its number had drifted.

### Primitives (29 shipping, 2 deferred)

**shadcn-pattern primitives** (token-themed, Radix-backed where applicable):

- `Button` (5 variants, 4 sizes)
- `Input` (3 sizes, leading/trailing icon, trailing action)
- `Select` (+ `SelectTrigger`, `SelectContent`, `SelectItem`, ...)
- `Combobox` (searchable single-select, Command + Popover)
- `Dialog` (+ `DialogContent`, `DialogHeader`, `DialogTitle`, ...)
- `Sheet` (4 sides, 4 sizes, mobile-bottom default)
- `Toast` (+ `ToastProvider`, `ToastViewport`, `ToastAction`, ...)
- `Banner` (4 variants, dismissible, with action)
- `Badge` (6 variants, 2 sizes)
- `Pill` (2 variants, 2 sizes, selected state)
- `ProgramChip` (5 program tones + fallback, enforces 1.4.1 prefix rule)
- `Tooltip` (+ `TooltipProvider`, `TooltipTrigger`, `TooltipContent`)
- `DropdownMenu` (+ items, separator, label, shortcut, sub-menu)
- `Tabs` (+ `TabsList`, `TabsTrigger`, `TabsContent`)
- `Table` (+ `TableHeader`, `TableHead` with sort, `TableRow`, `TableCell`)
- `FormField` (label + input + error wiring; required around every Input)
- `Switch` (with optional label + description)
- `Checkbox` (with indeterminate state)
- `RadioGroup` (+ `RadioGroupItem`)
- `Pagination`
- `EmptyState` (4 illustrations: ribbon, inbox, calendar, search)
- `ErrorState`
- `LoadingState` (spinner + skeleton variants, respects `prefers-reduced-motion`)
- `IconButton` (forces `aria-label` + Tooltip wrap)
- `Command` / `CommandDialog` (cmdk-based, Cmd-K palette substrate)

**Bespoke RRT primitives**:

- `Avatar` (photo-OR-initials with COPPA gate, status overlay, flag overlay; 8 sizes; alt = first name only)
- `Tile` (Family Photo Tile; 3 size classes: `compact` / `comfortable` / `kiosk`)
- `TileSkeleton` (suspense fallback for tile grids)
- `PhotoUploader` (drop-zone, preview, validation - pure UI)
- `ConsentForm` (COPPA parental consent form - microcopy verbatim from spec 03 §8.1)
- `RibbonMark` (brand mark SVG, 3 tones, 6 standard sizes)
- `Wordmark` (stacked + inline variants)

**Deferred** (Slice 7 unless noted):

- `DatePicker` (needs `react-day-picker`; Calendar v2)
- `TimePicker` (needs hour+minute select pair on mobile, native input[type=time] on desktop)
- `Table` virtualization (deferred until Students CRM exceeds ~500 rows; Slice 8+)
- `ProgramChip` dark variant (deferred until rendered on a maroon-900 surface)

### Helpers

- `cn(...inputs)` - safe Tailwind class concatenation (clsx + tailwind-merge)
- `initialsFor(name)` - 1 char single token, 2 chars multi-token, uppercase, diacritics normalized
- `initialsColorHash(name, programId?)` - deterministic hash to one of 6 pre-audited AAA tone pairs
- `firstNameOf(name)` - safe first-name derivation for alt text (privacy)
- `colors`, `programTones`, `radius`, `motion` - TS constants mirroring tokens.css

---

## Local development

This package lives at `/Users/maxella/Desktop/projects/rrt-design-system/` (sibling to `rrt-app` and `rrt-nextjs`). During Slice 1 we develop locally and consume via `pnpm link` or a `file:` reference in the consumer apps.

### Scripts

```bash
pnpm install     # install deps
pnpm build       # tsup build to dist/ (ESM + CJS + types)
pnpm dev         # tsup watch mode
pnpm typecheck   # tsc --noEmit, no emit
pnpm clean       # remove dist/
```

### Build output

`pnpm build` emits to `dist/`:

```
dist/
  index.js         # ESM bundle, ~109 KB unminified
  index.cjs        # CJS bundle, ~118 KB unminified
  index.d.ts       # type declarations
  index.d.cts      # type declarations (CJS)
  *.map            # source maps
```

The bundle prepends a `"use client"` directive so consuming Next.js apps treat every export as a client primitive. (See `tsup.config.ts onSuccess` hook.)

`react`, `react-dom`, and `tailwindcss` are externalized; consumers must install them as peer dependencies.

---

## Accessibility

This package is the gate between RRT and WCAG 2.1 AA / AAA compliance. Every primitive ships:

- `:focus-visible` ring at 8.42:1 on cream (`--shadow-focus`), or 7.17:1 on maroon (`--shadow-focus-dark`).
- Known gap: the dark theme's alpha borders composite to 1.69:1 (`--rrt-line`) and 2.58:1 (`--rrt-line-strong`) on maroon-900, below the 1.4.11 3:1 boundary floor. Raising the alphas to about 0.40 / 0.55 would clear it; tracked as follow-up, owner decision pending.
- `prefers-reduced-motion` collapses motion to 0ms and disables transforms.
- iOS Safari auto-zoom prevention: 16px input floor on viewports under 768px (via `reset.css`).
- ARIA roles, `aria-disabled` (not HTML `disabled`) for focus-readable disabled states, `aria-busy` for loading.
- Tooltips fire on focus (keyboard) as well as hover.
- `IconButton` enforces `aria-label`.
- `FormField` auto-wires `aria-describedby`, `role="alert"` on errors, and required indicators.
- `Avatar` enforces COPPA photo gate at the component layer (defense in depth) and uses FIRST NAME ONLY in alt text.
- `ProgramChip` ALWAYS renders the 2-letter program prefix (WCAG 1.4.1 Use of Color).

If you find a contrast regression or a missing ARIA wiring, open an issue and tag it `a11y`.

---

## File tree

```
rrt-design-system/
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── README.md
├── .gitignore
├── .npmrc
├── src/
│   ├── index.ts                          # barrel export
│   ├── lib/
│   │   ├── utils.ts                      # cn(), initialsFor, initialsColorHash, firstNameOf
│   │   └── tokens.ts                     # TS constants mirroring tokens.css
│   ├── styles/
│   │   ├── tokens.css                    # @theme block - the source of truth
│   │   ├── tokens-contrast.test.ts       # recomputes every annotated WCAG ratio
│   │   ├── shadcn-tokens.css             # shadcn variable remap
│   │   └── reset.css                     # baseline rules supplement
│   └── components/
│       ├── avatar.tsx                    # bespoke - photo/initials + COPPA gate
│       ├── tile.tsx                      # bespoke - Family Photo Tile (3 sizes)
│       ├── photo-uploader.tsx            # bespoke - drop-zone for photo upload
│       ├── consent-form.tsx              # bespoke - COPPA consent form
│       ├── ribbon-mark.tsx               # brand SVG
│       ├── wordmark.tsx                  # brand SVG lockup
│       └── ui/
│           ├── badge.tsx
│           ├── banner.tsx
│           ├── button.tsx
│           ├── checkbox.tsx
│           ├── combobox.tsx
│           ├── command.tsx
│           ├── dialog.tsx
│           ├── dropdown-menu.tsx
│           ├── empty-state.tsx
│           ├── error-state.tsx
│           ├── form-field.tsx
│           ├── icon-button.tsx
│           ├── input.tsx
│           ├── loading-state.tsx
│           ├── pagination.tsx
│           ├── pill.tsx
│           ├── program-chip.tsx
│           ├── radio-group.tsx
│           ├── select.tsx
│           ├── sheet.tsx
│           ├── switch.tsx
│           ├── table.tsx
│           ├── tabs.tsx
│           ├── toast.tsx
│           └── tooltip.tsx
├── examples/
│   └── avatar.html                       # static QA page for Avatar states
└── dist/                                 # generated by `pnpm build`
```
