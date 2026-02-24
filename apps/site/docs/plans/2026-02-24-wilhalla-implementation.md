# Wilhalla Website Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the Wilhalla website frontend with editorial design system, interactive SVG map, and page structure.

**Architecture:** React 19 SPA with TanStack Router (file-based routing), Tailwind CSS v4 design tokens, and an SVG overlay system for the interactive map. Content is hardcoded initially; CMS integration comes later.

**Tech Stack:** React 19, TanStack Router, Tailwind CSS v4, shadcn/ui, EB Garamond Variable, Vite 7

**Design doc:** `docs/plans/2026-02-24-wilhalla-design.md`

---

## Task 1: Design System — Tailwind Tokens & Global Styles

**Files:**
- Modify: `src/styles.css`
- Create: `src/styles/typography.css`

**Step 1: Replace shadcn color tokens with Wilhalla design tokens**

Replace the `:root` block in `src/styles.css` with Wilhalla's minimal palette. Keep the shadcn `@theme inline` structure but map to our values. Set `--radius: 0` for sharp corners.

```css
:root {
  --radius: 0;
  --background: oklch(1 0 0);           /* #ffffff */
  --foreground: oklch(0.157 0 0);       /* #1a1a1a */
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.51 0 0);  /* #767676 */
  --border: oklch(0.902 0 0);           /* #e0e0e0 */
  --hover: oklch(0.97 0 0);            /* #f5f5f5 */
  --primary: oklch(0.157 0 0);          /* #1a1a1a */
  --primary-foreground: oklch(1 0 0);   /* #ffffff */
  --accent: oklch(0 0 0);              /* #000000 */
  --accent-foreground: oklch(1 0 0);
  /* keep remaining shadcn tokens mapped to neutral */
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.157 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.157 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.157 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --input: oklch(0.902 0 0);
  --ring: oklch(0.51 0 0);
}
```

Remove the `.dark` block entirely — no dark mode for this site.

**Step 2: Add typography utility classes**

Create `src/styles/typography.css` with custom utility classes for the type scale defined in the design doc:

```css
/* Typography scale — EB Garamond Variable */

.text-display {
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  line-height: 1.1;
}

.text-h1 {
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  font-weight: 500;
  letter-spacing: 0.02em;
  line-height: 1.2;
}

.text-h2 {
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  line-height: 1.3;
}

.text-body {
  font-size: 1.125rem;
  font-weight: 400;
  line-height: 1.7;
}

.text-small {
  font-size: 0.875rem;
  font-weight: 400;
  letter-spacing: 0.03em;
  line-height: 1.5;
}

.text-nav {
  font-size: 0.9375rem;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  line-height: 1;
}
```

**Step 3: Import typography in styles.css**

Add `@import "./styles/typography.css";` after the font import in `src/styles.css`.

**Step 4: Update body styles**

In `src/styles.css`, update the body rule to set `text-body` as default and ensure the underline offset:

```css
body {
  @apply m-0 text-body;
  font-family: "EB Garamond Variable", serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  text-underline-offset: 4px;
}
```

**Step 5: Verify dev server runs**

Run: `bun run dev`
Expected: Dev server starts, page loads with updated font styles, no errors.

**Step 6: Commit**

```bash
git add src/styles.css src/styles/typography.css
git commit -m "feat: add Wilhalla design system tokens and typography scale"
```

---

## Task 2: Layout Shell — Navbar & Footer

**Files:**
- Create: `src/components/navbar.tsx`
- Create: `src/components/footer.tsx`
- Create: `src/components/mobile-menu.tsx`
- Modify: `src/routes/__root.tsx`

**Step 1: Build the Navbar component**

```tsx
// src/components/navbar.tsx
import { Link } from "@tanstack/react-router"
import { useState } from "react"
import { MobileMenu } from "./mobile-menu"

const navLinks = [
  { label: "Tuin", to: "/tuin" },
  { label: "Welzijn", to: "/welzijn" },
  { label: "Yoga", to: "/yoga" },
  { label: "Agenda", to: "/agenda" },
  { label: "Verhuur", to: "/verhuur" },
  { label: "Blog", to: "/blog" },
] as const

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <nav className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4">
        <Link to="/" className="text-display !text-[1.5rem] no-underline">
          WILHALLA
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className="text-nav no-underline text-foreground hover:bg-hover px-2 py-1 transition-colors"
                activeProps={{ className: "underline" }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </nav>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} links={navLinks} />
    </header>
  )
}
```

**Step 2: Build the MobileMenu component**

```tsx
// src/components/mobile-menu.tsx
import { Link } from "@tanstack/react-router"

type MobileMenuProps = {
  open: boolean
  onClose: () => void
  links: ReadonlyArray<{ label: string; to: string }>
}

export function MobileMenu({ open, onClose, links }: MobileMenuProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center gap-10">
      <button
        className="absolute top-4 right-6 p-2 text-foreground"
        onClick={onClose}
        aria-label="Close menu"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <line x1="4" y1="4" x2="20" y2="20" />
          <line x1="20" y1="4" x2="4" y2="20" />
        </svg>
      </button>

      {links.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className="text-display !text-[1.75rem] no-underline text-foreground"
          onClick={onClose}
        >
          {link.label}
        </Link>
      ))}
    </div>
  )
}
```

**Step 3: Build the Footer component**

```tsx
// src/components/footer.tsx
export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-nav mb-4">Contact</h3>
            <address className="text-small not-italic text-muted-foreground leading-relaxed">
              Wilhalla<br />
              {/* Address TBD from CMS */}
            </address>
          </div>
          <div>
            <h3 className="text-nav mb-4">Openingsuren</h3>
            <p className="text-small text-muted-foreground">
              {/* Hours TBD from CMS */}
            </p>
          </div>
          <div>
            <h3 className="text-nav mb-4">Volg ons</h3>
            <div className="flex gap-4">
              {/* Social links TBD */}
            </div>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-border">
          <p className="text-small text-muted-foreground italic">
            Wilhalla — Velt-ecotuin sinds 1962
          </p>
        </div>
      </div>
    </footer>
  )
}
```

**Step 4: Wire into root layout**

Update `src/routes/__root.tsx` to include Navbar and Footer wrapping the Outlet:

```tsx
import { Outlet, createRootRoute } from "@tanstack/react-router"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
```

Remove the TanStack Devtools from root in production (keep for dev only with lazy import or remove entirely — your call).

**Step 5: Verify in browser**

Run: `bun run dev`
Expected: Navbar shows "WILHALLA" left + nav links right. Footer shows at bottom. Hamburger on mobile. Links route to 404 (pages don't exist yet) which is fine.

**Step 6: Commit**

```bash
git add src/components/navbar.tsx src/components/mobile-menu.tsx src/components/footer.tsx src/routes/__root.tsx
git commit -m "feat: add navbar and footer layout shell"
```

---

## Task 3: Interactive Map — SVG Overlay with Pencil Effect

**Files:**
- Create: `src/components/map/interactive-map.tsx`
- Create: `src/components/map/map-hotspot.tsx`
- Create: `src/components/map/pencil-filter.tsx`
- Create: `src/components/map/hotspots.ts`
- Copy: `~/Code/wilhalla/assets/house_path.svg` → extract path data into `hotspots.ts`
- Modify: `src/routes/index.tsx`

**Context for implementer:**

The map image is 4000x2337px. The SVG path from `house_path.svg` was traced in Inkscape at absolute coordinates offset by `(594.59889, 431.93085)`. The path `d` attribute needs to be translated to map-relative coordinates by subtracting the group transform. The SVG `viewBox` for the overlay must match `0 0 4000 2337` (the map dimensions), and the path coordinates need to be mapped into this space.

The Inkscape SVG has `width="142.7749" height="59.802582"` in its own units, with a transform `translate(-594.59889,-431.93085)`. The path points are in absolute Inkscape document coordinates. To convert to map pixel coordinates, we need to determine the Inkscape document's DPI/scale relative to the 4000x2337 image. Since the map was loaded as background in Inkscape at its native resolution, the coordinates should map 1:1 if the Inkscape document was set to the same pixel dimensions as the image. **The implementer should verify this by checking the house position visually in the browser and adjusting if needed.**

**Step 1: Create the pencil filter SVG component**

```tsx
// src/components/map/pencil-filter.tsx

export function PencilFilter() {
  return (
    <defs>
      <filter id="pencil-stroke" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence
          type="turbulence"
          baseFrequency="0.03"
          numOctaves="4"
          result="noise"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="noise"
          scale="2"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </defs>
  )
}
```

**Step 2: Create the hotspot data file**

Extract the path `d` attribute from `house_path.svg`. The path coordinates are absolute in the Inkscape document. Since the SVG overlay viewBox will match the map dimensions, and the Inkscape tracing was done over the map image, the coordinates should work directly.

```ts
// src/components/map/hotspots.ts

export type MapHotspot = {
  id: string
  label: string
  route: string
  path: string
  labelPosition: { x: number; y: number }
}

// Path extracted from house_path.svg
// Original SVG had transform="translate(-594.59889,-431.93085)" on the group,
// meaning the path points are in absolute document coords.
// The viewBox of the overlay SVG is "0 0 4000 2337" (map pixel dimensions).
// If Inkscape doc matched map dimensions, coords map 1:1.
// Verify visually and adjust if needed.
const HOUSE_PATH = "m 618.56041,432.7902 -2.82456,1.02344 -0.53396,1.71677 -3.83728,1.58725 -2.4935,1.24335 -1.94866,1.7964 -0.30245,3.01921 -1.24373,2.32962 0.003,3.42365 -0.77095,2.87574 -0.34466,3.00555 -0.74983,2.84452 -0.74534,2.85559 -1.40409,1.86782 -1.40011,3.0477 -0.0235,3.37297 -0.75577,3.02947 -0.70606,2.8743 -0.65203,2.90149 1.48623,2.90561 -2.66699,2.20719 -1.13355,3.454 2.94358,0.39923 4.15907,0.69052 1.43897,0.0503 2.90693,0.28118 2.70801,0.1136 2.77632,0.15204 3.0561,-0.15436 2.90955,0.38957 2.96866,0.47164 2.61917,-0.3433 4.77101,1.02513 1.67263,0.48487 3.08042,0.81779 3.56084,0.48772 0.8921,-0.11179 2.41329,-1.72991 1.22397,-2.99823 1.8934,-1.28966 3.0265,-1.65816 0.62701,-2.03026 3.69238,0.61968 1.98979,0.0419 3.16722,0.2752 2.48965,-0.70189 3.30179,-0.002 2.93317,-0.42212 3.38937,-0.15201 3.15516,-0.76217 3.26946,-0.0238 3.16888,0.57852 5.03588,0.78015 1.70192,0.24861 1.84922,-1.11495 3.49008,0.69718 3.47325,0.87188 2.32409,0.44987 4.11493,0.83682 1.8407,0.39021 4.07989,0.78005 1.71779,0.34078 2.57888,0.23755 4.04263,0.97106 2.4381,0.61826 3.10196,0.80588 3.13984,0.83352 3.62706,0.72507 1.06095,-0.5211 3.55571,1.44635 -0.11943,-3.26287 1.72972,-2.32041 1.63488,-2.5188 0.0904,-3.72598 -0.0877,-2.44828 0.94713,-2.67424 -0.0764,-3.05083 -0.0305,-3.87656 0.11265,-1.64554 0.51654,-2.72778 -0.20582,-3.41895 -0.27428,-2.75228 1.5268,-2.157 -0.48984,-3.62814 -0.44746,-2.74825 -0.1298,-2.58415 -0.0483,-2.81235 0.27432,-2.78514 -3.54513,-0.92875 -2.46608,-0.56077 -1.41392,0.21054 -4.63652,-1.28019 -2.93046,-0.25935 -2.98752,-0.10081 -1.49011,0.28591 -4.74391,-0.3338 -1.6714,0.27511 -4.28031,-0.26026 -3.07476,-1.41229 -3.29762,-0.54969 -0.79602,0.0806 -3.65133,0.17825 -3.80615,0.0429 -2.76862,0.0522 -3.22322,0.0704 -3.22748,-0.0471 -1.69649,0.13055 -3.06903,0.10317 -2.84482,-0.12064 -2.42123,0.0386 -4.528,0.0892 -3.22683,0.0213 -3.44694,-0.20891 -3.05228,-0.37588 -2.21509,0.1979 -3.46521,-0.0588 -3.5957,-0.86533 -2.64811,-0.12588 -2.97721,-0.067 -3.30255,-0.47749 -2.70965,0.0161 -2.83,0.0988 -3.41709,-0.16681 -2.31053,0.25735 -2.97295,0.21281 -2.63379,0.18552 z"

export const hotspots: MapHotspot[] = [
  {
    id: "woning",
    label: "Woning & Schuur",
    route: "/verhuur",
    path: HOUSE_PATH,
    labelPosition: { x: 660, y: 460 },
  },
  // Future hotspots added here as paths are traced:
  // { id: "boomgaard", label: "Boomgaard", route: "/tuin", path: "...", labelPosition: { x: ..., y: ... } },
  // { id: "moestuin", label: "Moestuin", route: "/tuin/samentuin", path: "...", labelPosition: { x: ..., y: ... } },
  // { id: "serre", label: "Serre", route: "/tuin/samentuin", path: "...", labelPosition: { x: ..., y: ... } },
  // { id: "bessenkooi", label: "Bessenkooi", route: "/tuin", path: "...", labelPosition: { x: ..., y: ... } },
]
```

**Step 3: Create the MapHotspot component**

```tsx
// src/components/map/map-hotspot.tsx
import { useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import type { MapHotspot } from "./hotspots"

type MapHotspotProps = {
  hotspot: MapHotspot
}

export function MapHotspotPath({ hotspot }: MapHotspotProps) {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)

  return (
    <g>
      <path
        d={hotspot.path}
        fill={hovered ? "rgba(255,255,255,0.12)" : "transparent"}
        stroke={hovered ? "rgba(0,0,0,0.6)" : "none"}
        strokeWidth={hovered ? 2 : 0}
        filter="url(#pencil-stroke)"
        className="cursor-pointer transition-all duration-300"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => navigate({ to: hotspot.route })}
        role="button"
        tabIndex={0}
        aria-label={hotspot.label}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            navigate({ to: hotspot.route })
          }
        }}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
      />

      {/* Label */}
      <text
        x={hotspot.labelPosition.x}
        y={hotspot.labelPosition.y}
        textAnchor="middle"
        className="pointer-events-none select-none transition-opacity duration-300"
        style={{
          fontFamily: "'EB Garamond Variable', serif",
          fontSize: 16,
          fontWeight: 500,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          fill: hovered ? "#1a1a1a" : "transparent",
          opacity: hovered ? 1 : 0,
        }}
      >
        {hotspot.label}
      </text>
    </g>
  )
}
```

**Step 4: Create the InteractiveMap component**

```tsx
// src/components/map/interactive-map.tsx
import { PencilFilter } from "./pencil-filter"
import { MapHotspotPath } from "./map-hotspot"
import { hotspots } from "./hotspots"

const MAP_WIDTH = 4000
const MAP_HEIGHT = 2337

export function InteractiveMap() {
  return (
    <section className="relative w-full" style={{ aspectRatio: `${MAP_WIDTH}/${MAP_HEIGHT}` }}>
      {/* Map image */}
      <picture>
        <source media="(min-width: 2560px)" srcSet="/wilhalla_map-3840.webp" />
        <source media="(min-width: 1920px)" srcSet="/wilhalla_map-2560.webp" />
        <source media="(min-width: 1024px)" srcSet="/wilhalla_map-1920.webp" />
        <source media="(min-width: 640px)" srcSet="/wilhalla_map-1024.webp" />
        <img
          src="/wilhalla_map-640.webp"
          alt="Wilhalla tuinkaart — klik op een gebied om meer te ontdekken"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
      </picture>

      {/* SVG overlay */}
      <svg
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <PencilFilter />
        {hotspots.map((hotspot) => (
          <MapHotspotPath key={hotspot.id} hotspot={hotspot} />
        ))}
      </svg>
    </section>
  )
}
```

**Step 5: Update the homepage to use InteractiveMap**

```tsx
// src/routes/index.tsx
import { createFileRoute } from "@tanstack/react-router"
import { InteractiveMap } from "@/components/map/interactive-map"

export const Route = createFileRoute("/")({ component: HomePage })

function HomePage() {
  return (
    <div>
      <InteractiveMap />

      {/* Intro text */}
      <section className="mx-auto max-w-[680px] px-6 py-24 text-center">
        <p className="text-body">
          Wilhalla is de historische Velt-tuin van Velt-pioniers Dani&euml;l Willaeys
          en Aleide Lagrou. Sinds 1962 wordt er biologisch getuinierd op deze tuin
          van 1 hectare. Tinneke en Jasmien zetten hun visie verder met een samentuin,
          therapie, yoga en tal van activiteiten.
        </p>
      </section>
    </div>
  )
}
```

**Step 6: Verify in browser**

Run: `bun run dev`
Expected:
- Map displays full-width with correct aspect ratio
- Hovering the house area shows a pencil-style border outline + "Woning & Schuur" label
- Clicking the house area navigates (to 404 for now, that's fine)
- The pencil filter makes the border look slightly wobbly/hand-drawn

**Important:** Visually verify the house path aligns with the buildings on the map. If the path is offset or scaled wrong, the coordinate mapping needs adjustment. The most likely fix is that Inkscape uses a different coordinate space than raw pixels — in that case, multiply all path coordinates by a scale factor (e.g., if Inkscape was at 96 DPI and the image is at a different DPI).

**Step 7: Commit**

```bash
git add src/components/map/ src/routes/index.tsx
git commit -m "feat: add interactive map with SVG overlay and pencil filter effect"
```

---

## Task 4: Homepage — Teaser Sections & Structure

**Files:**
- Create: `src/components/section-divider.tsx`
- Create: `src/components/teaser-block.tsx`
- Modify: `src/routes/index.tsx`

**Step 1: Create the SectionDivider component**

This is a placeholder that renders a 1px rule for now. When hand-drawn assets are scanned, they replace the rule.

```tsx
// src/components/section-divider.tsx

type SectionDividerProps = {
  asset?: string  // future: path to hand-drawn divider image
}

export function SectionDivider({ asset }: SectionDividerProps) {
  if (asset) {
    return (
      <div className="mx-auto max-w-[1200px] px-6 py-4">
        <img
          src={asset}
          alt=""
          role="presentation"
          className="w-full h-auto"
          loading="lazy"
        />
      </div>
    )
  }

  // Fallback: simple 1px rule
  return (
    <div className="mx-auto max-w-[1200px] px-6">
      <hr className="border-border border-t" />
    </div>
  )
}
```

**Step 2: Create the TeaserBlock component**

```tsx
// src/components/teaser-block.tsx
import { Link } from "@tanstack/react-router"

type TeaserBlockProps = {
  title: string
  description: string
  to: string
  linkLabel?: string
}

export function TeaserBlock({ title, description, to, linkLabel = "Ontdek" }: TeaserBlockProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-h2 uppercase tracking-[0.08em]">{title}</h2>
      <p className="text-body text-muted-foreground">{description}</p>
      <Link to={to} className="text-nav text-foreground inline-flex items-center gap-2 no-underline hover:underline">
        {linkLabel} <span aria-hidden="true">&rarr;</span>
      </Link>
    </div>
  )
}
```

**Step 3: Create the HandDrawnBg component**

```tsx
// src/components/hand-drawn-bg.tsx
import type { ReactNode } from "react"

type HandDrawnBgProps = {
  asset?: string  // path to background texture image
  children: ReactNode
}

export function HandDrawnBg({ asset, children }: HandDrawnBgProps) {
  return (
    <section
      className="relative py-24"
      style={asset ? {
        backgroundImage: `url(${asset})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      } : {
        backgroundColor: "var(--hover)",
      }}
    >
      <div className="mx-auto max-w-[1200px] px-6">
        {children}
      </div>
    </section>
  )
}
```

**Step 4: Build out the full homepage**

Update `src/routes/index.tsx`:

```tsx
import { createFileRoute } from "@tanstack/react-router"
import { InteractiveMap } from "@/components/map/interactive-map"
import { SectionDivider } from "@/components/section-divider"
import { TeaserBlock } from "@/components/teaser-block"
import { HandDrawnBg } from "@/components/hand-drawn-bg"

export const Route = createFileRoute("/")({ component: HomePage })

function HomePage() {
  return (
    <div>
      {/* Hero: Interactive Map */}
      <InteractiveMap />

      {/* Intro */}
      <section className="mx-auto max-w-[680px] px-6 py-24 text-center">
        <p className="text-body">
          Wilhalla is de historische Velt-tuin van Velt-pioniers Dani&euml;l Willaeys
          en Aleide Lagrou. Sinds 1962 wordt er biologisch getuinierd op deze tuin
          van 1 hectare. Tinneke en Jasmien zetten hun visie verder met een samentuin,
          therapie, yoga en tal van activiteiten.
        </p>
      </section>

      <SectionDivider />

      {/* Teaser blocks */}
      <section className="mx-auto max-w-[1200px] px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <TeaserBlock
            title="Samentuin"
            description="Samen de moestuin onderhouden met een groep van 15 vrijwilligers. Serre, folietunnel, bessenkooi en boomgaard."
            to="/tuin"
          />
          <TeaserBlock
            title="Welzijn"
            description="Fasciatherapie, paardencoaching en lichaamsgerichte therapie door Tinneke en Jasmien."
            to="/welzijn"
          />
          <TeaserBlock
            title="Agenda"
            description="Workshops, oogstfeesten, dansfeesten, yoga en meer. Bekijk wat er binnenkort te beleven valt."
            to="/agenda"
          />
        </div>
      </section>

      <SectionDivider />

      {/* Featured block with hand-drawn bg (placeholder) */}
      <HandDrawnBg>
        <div className="max-w-[680px] mx-auto text-center">
          <h2 className="text-h1 mb-6">Verhuur</h2>
          <p className="text-body text-muted-foreground mb-8">
            De schuur en yurt zijn beschikbaar voor verhuur.
            Organiseer je workshop, retraite of feest op Wilhalla.
          </p>
          <a href="/verhuur" className="text-nav text-foreground inline-flex items-center gap-2 no-underline hover:underline">
            Meer info <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </HandDrawnBg>

      <SectionDivider />
    </div>
  )
}
```

**Step 5: Verify in browser**

Run: `bun run dev`
Expected: Full homepage renders — map hero, intro text, 3 teaser blocks in a row (stacked on mobile), featured Verhuur block with grey background, dividers between sections.

**Step 6: Commit**

```bash
git add src/components/section-divider.tsx src/components/teaser-block.tsx src/components/hand-drawn-bg.tsx src/routes/index.tsx
git commit -m "feat: add homepage teaser sections, dividers, and hand-drawn bg component"
```

---

## Task 5: Route Structure — All Pages as Stubs

**Files:**
- Create: `src/routes/tuin/index.tsx`
- Create: `src/routes/tuin/samentuin.tsx`
- Create: `src/routes/welzijn/index.tsx`
- Create: `src/routes/welzijn/fasciatherapie.tsx`
- Create: `src/routes/welzijn/limfedrainage.tsx`
- Create: `src/routes/welzijn/kcr.tsx`
- Create: `src/routes/welzijn/paardencoaching.tsx`
- Create: `src/routes/welzijn/veerkracht.tsx`
- Create: `src/routes/yoga.tsx`
- Create: `src/routes/agenda.tsx`
- Create: `src/routes/verhuur.tsx`
- Create: `src/routes/blog/index.tsx`
- Create: `src/components/page-header.tsx`
- Create: `src/components/breadcrumb.tsx`

**Step 1: Create shared PageHeader component**

```tsx
// src/components/page-header.tsx

type PageHeaderProps = {
  title: string
  intro?: string
}

export function PageHeader({ title, intro }: PageHeaderProps) {
  return (
    <header className="mx-auto max-w-[1200px] px-6 pt-24 pb-12">
      <h1 className="text-display mb-6">{title}</h1>
      <hr className="border-border border-t mb-8" />
      {intro && (
        <p className="text-body max-w-[680px]">{intro}</p>
      )}
    </header>
  )
}
```

**Step 2: Create shared Breadcrumb component**

```tsx
// src/components/breadcrumb.tsx
import { Link } from "@tanstack/react-router"

type BreadcrumbProps = {
  items: Array<{ label: string; to?: string }>
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mx-auto max-w-[1200px] px-6 pt-6">
      <ol className="flex gap-2 text-small text-muted-foreground uppercase tracking-[0.08em] list-none m-0 p-0">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">/</span>}
            {item.to ? (
              <Link to={item.to} className="text-muted-foreground hover:text-foreground no-underline hover:underline">
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
```

**Step 3: Create all route stubs**

Each page follows the same pattern. Example for a landing page:

```tsx
// src/routes/tuin/index.tsx
import { createFileRoute, Link } from "@tanstack/react-router"
import { PageHeader } from "@/components/page-header"
import { SectionDivider } from "@/components/section-divider"

export const Route = createFileRoute("/tuin/")({ component: TuinPage })

const subPages = [
  { label: "Samentuin", to: "/tuin/samentuin" },
]

function TuinPage() {
  return (
    <div>
      <PageHeader
        title="Tuin"
        intro="Wilhalla is een tuin van 1 hectare met boomgaard, moestuin, bessenkooi, serre, kippen, bijen en meer."
      />
      <SectionDivider />
      <section className="mx-auto max-w-[1200px] px-6 py-24">
        <ul className="list-none m-0 p-0 flex flex-col gap-6">
          {subPages.map((page) => (
            <li key={page.to}>
              <Link
                to={page.to}
                className="text-h2 text-foreground no-underline hover:underline inline-flex items-center gap-3"
              >
                {page.label} <span aria-hidden="true">&rarr;</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
```

Example for a sub-page:

```tsx
// src/routes/welzijn/fasciatherapie.tsx
import { createFileRoute } from "@tanstack/react-router"
import { PageHeader } from "@/components/page-header"
import { Breadcrumb } from "@/components/breadcrumb"

export const Route = createFileRoute("/welzijn/fasciatherapie")({ component: FasciatherapiePage })

function FasciatherapiePage() {
  return (
    <div>
      <Breadcrumb items={[{ label: "Welzijn", to: "/welzijn" }, { label: "Fasciatherapie" }]} />
      <PageHeader
        title="Fasciatherapie"
        intro="Placeholder — content van Tinneke en Jasmien."
      />
    </div>
  )
}
```

Create ALL route files listed above following these two patterns (landing pages with sub-links, sub-pages with breadcrumbs). Standalone pages (yoga, agenda, verhuur) use PageHeader without breadcrumbs.

**Step 4: Verify in browser**

Run: `bun run dev`
Expected: All nav links work. Landing pages show sub-page lists. Sub-pages show breadcrumbs. TanStack Router auto-generates the route tree.

**Step 5: Commit**

```bash
git add src/routes/ src/components/page-header.tsx src/components/breadcrumb.tsx
git commit -m "feat: add all route stubs with page headers and breadcrumbs"
```

---

## Task 6: Content Page Template Component

**Files:**
- Create: `src/components/content-page.tsx`
- Modify: one route to demonstrate (e.g., `src/routes/welzijn/fasciatherapie.tsx`)

**Step 1: Create the reusable content page template**

This encapsulates the pattern: PageHeader → sections (Aanbod, Info, Contact) with dividers between them.

```tsx
// src/components/content-page.tsx
import type { ReactNode } from "react"
import { PageHeader } from "./page-header"
import { SectionDivider } from "./section-divider"

type ContentSection = {
  title: string
  content: ReactNode
}

type ContentPageProps = {
  title: string
  intro?: string
  sections: ContentSection[]
  contact?: {
    name: string
    email?: string
    phone?: string
  }
  breadcrumb?: ReactNode  // pass <Breadcrumb /> from the route
  dividerAsset?: string
}

export function ContentPage({ title, intro, sections, contact, breadcrumb, dividerAsset }: ContentPageProps) {
  return (
    <div>
      {breadcrumb}
      <PageHeader title={title} intro={intro} />

      {sections.map((section, i) => (
        <div key={i}>
          <SectionDivider asset={dividerAsset} />
          <section className="mx-auto max-w-[1200px] px-6 py-24">
            <h2 className="text-h2 uppercase tracking-[0.08em] mb-8">{section.title}</h2>
            <div className="max-w-[680px] text-body">
              {section.content}
            </div>
          </section>
        </div>
      ))}

      {contact && (
        <>
          <div className="mx-auto max-w-[1200px] px-6">
            <hr className="border-border border-t" />
          </div>
          <section className="mx-auto max-w-[1200px] px-6 py-24">
            <h2 className="text-h2 uppercase tracking-[0.08em] mb-8">Contact</h2>
            <address className="text-body not-italic">
              <p className="font-medium">{contact.name}</p>
              {contact.email && <p><a href={`mailto:${contact.email}`}>{contact.email}</a></p>}
              {contact.phone && <p><a href={`tel:${contact.phone}`}>{contact.phone}</a></p>}
            </address>
          </section>
        </>
      )}
    </div>
  )
}
```

**Step 2: Use it in a route as demo**

Update `src/routes/welzijn/fasciatherapie.tsx` to use ContentPage with placeholder content. This proves the template works.

**Step 3: Verify in browser**

Run: `bun run dev`, navigate to `/welzijn/fasciatherapie`
Expected: Breadcrumb → title → divider → sections → contact. Clean editorial layout.

**Step 4: Commit**

```bash
git add src/components/content-page.tsx src/routes/welzijn/fasciatherapie.tsx
git commit -m "feat: add reusable content page template component"
```

---

## Future Tasks (not in this sprint)

These are tracked but not detailed yet:

- **Task 7:** Hand-drawn asset integration — replace 1px rule dividers with scanned assets
- **Task 8:** Google Calendar integration on Agenda page
- **Task 9:** Blog listing and article pages
- **Task 10:** CMS backend selection and integration
- **Task 11:** Social media links and footer content
- **Task 12:** Mobile polish — test all pages on mobile, fine-tune tap targets on map
- **Task 13:** SEO — meta tags, Open Graph, structured data
- **Task 14:** Additional map hotspot paths — trace remaining garden areas in Inkscape
