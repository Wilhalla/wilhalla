# Wilhalla Website — Design Document

**Date:** 2026-02-24
**Status:** Approved

---

## 1. Project Overview

Wilhalla is the historic ecological garden (1 hectare, bought 1962) of Velt-pioneers Dani??l Willaeys and Aleide Lagrou in Belgium. Now run by Tinneke (daughter) and Jasmien (granddaughter), it hosts a community garden (samentuin) with ~15 volunteers, a kinesitherapy/fasciatherapy practice, horse coaching, yoga, workshops, events, and rental spaces.

The website serves as the digital home for all of Wilhalla's activities, with an interactive hand-drawn map as the centrepiece.

### Content areas

| Area | Description |
|------|-------------|
| **Tuin** | Garden history, the Wilhalla story, samentuin (community garden) |
| **Welzijn** | Fasciatherapie, lymfedrainage, KCR, Paardencoaching, Veerkracht in Beweging |
| **Yoga** | Yoga sessions (standalone page) |
| **Agenda** | Workshops, activiteiten, dansfeesten, oogstfeesten, benefiet, Google Calendar integration |
| **Verhuur** | Schuur & yurt rental |
| **Blog** | Articles (future) |

Each section contains: aanbod (offerings), info, and contact.

### Technical requirements

- 3-4 CMS editor accounts (Tinneke, Jasmien, others) for content editing, event posting, blogging
- Google Calendar integration for events
- Social media links
- CMS solution TBD at implementation time

---

## 2. Design Philosophy

**"A hand-drawn garden journal brought to life on the web."**

The site is an editorial publication in spirit: restrained, typographic, spacious. The hand-drawn pencil map and illustrations are the only source of color and warmth. Everything else steps back to let the art and content speak.

### Design references

- **De Witte Raaf** — editorial typography, generous whitespace, text-driven layout, single serif font
- **Hendrick's Gin** — whimsical hand-drawn illustrations floating over a clean background
- **Art portfolio sites** — minimal navigation, content speaks for itself

### Core principles

1. **Typography does the heavy lifting** — size, weight, tracking, and case create hierarchy without color
2. **Hand-drawn art is the only ornament** — no UI chrome, no gradients, no shadows
3. **Generous whitespace** — let content breathe
4. **The map is the hero** — it's the first thing you see, the primary navigation, and the most memorable element

---

## 3. Design System

### 3.1 Color

| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `#ffffff` | Page background |
| `--foreground` | `#1a1a1a` | Body text |
| `--muted` | `#767676` | Captions, metadata, secondary text |
| `--border` | `#e0e0e0` | Thin rules, dividers |
| `--hover` | `#f5f5f5` | Hover states on nav/links |
| `--accent` | `#000000` | Links underline, active states |

No color palette beyond black and white. The hand-drawn map and photo content provide all warmth and color.

### 3.2 Typography — EB Garamond

Single font throughout. Hierarchy through size, weight, tracking, and case.

| Role | Size | Weight | Style | Tracking |
|------|------|--------|-------|----------|
| **Display** (page titles) | `clamp(2.5rem, 5vw, 4.5rem)` | 400 | Uppercase | `0.15em` |
| **H1** (section titles) | `clamp(1.75rem, 3vw, 2.5rem)` | 500 | Normal case | `0.02em` |
| **H2** (subsections) | `1.25rem` | 600 | Normal | `0.01em` |
| **Body** | `1.125rem` (18px) | 400 | Normal | Normal |
| **Small/Caption** | `0.875rem` | 400 | Italic or normal | `0.03em` |
| **Nav links** | `0.9375rem` (15px) | 400 | Uppercase | `0.12em` |

Body text line-height: `1.7` for comfortable reading.

### 3.3 Spacing

8px base grid with generous margins:

| Token | Value | Usage |
|-------|-------|-------|
| Page max-width | `1200px` | Centered container |
| Section padding | `6rem` (96px) | Vertical spacing between sections |
| Prose column | `680px` max | Optimal reading width for body text |
| Component gaps | `2rem` / `3rem` / `4rem` | Progressive spacing scale |

### 3.4 UI Elements

- **Border radius**: `0` everywhere — sharp corners
- **Dividers**: 1px `--border` horizontal rules between sections
- **Buttons**: text-only with underline, or thin 1px bordered rectangles
- **Links**: underlined, `text-underline-offset: 4px`
- **Hover**: subtle background fill or underline thickening, no color changes
- **Cards**: no shadows, no backgrounds — content separated by whitespace or thin rules
- **Images**: no rounded corners, no shadows. Optional subtle 1px border. Captions in italic EB Garamond below.

---

## 4. Hand-Drawn Asset System

### 4.1 Asset types

| Type | Format | Usage |
|------|--------|-------|
| **Section dividers** | SVG or transparent PNG | Between major content sections (vine, branch, herbs) |
| **Background textures** | Large PNG/WebP, light pencil texture | Behind special subsections (very light, 10-15% opacity) |
| **Map overlay borders** | SVG paths with pencil-style filter | Hotspot outlines on the interactive map |
| **Spot illustrations** | Small SVG/PNG | Inline accents near relevant content |

### 4.2 Design rules

- Always scanned pencil / colored pencil — visual unity with the map
- Background textures are very light so text remains readable
- Dividers span full content width, thin and horizontal
- No hand-drawn element repeats identically — each accent is unique
- All hand-drawn assets lazy-loaded except above-the-fold

### 4.3 Placement guide

| Location | Asset idea |
|----------|-----------|
| Below map hero -> first section | Delicate vine or branch divider |
| Between Therapie and Yoga | Herb/plant sketch |
| Samentuin section | Light pencil garden texture as background |
| Verhuur (yurt/schuur) | Sketch of the yurt or schuur as background texture |
| Blog section header | Botanical border |
| Footer area | Root/ground-level sketch divider |

### 4.4 Implementation

```tsx
// Section divider component
<SectionDivider asset="vine-01" />

// Hand-drawn background wrapper
<HandDrawnBg asset="texture-herbs">
  <content />
</HandDrawnBg>
```

- Dividers: `<img>` between sections with negative margins to overlap into whitespace
- Backgrounds: CSS `background-image` on container, `background-size: cover`, low opacity

---

## 5. Navigation

### 5.1 Structure

Top horizontal navbar, sticky on scroll.

```
WILHALLA          Tuin   Welzijn   Yoga   Agenda   Verhuur   Blog
```

- "WILHALLA" wordmark: EB Garamond, uppercase, wide-tracked (`0.15em`), left-aligned
- Links: uppercase, small (`15px`), wide-tracked (`0.12em`), right-aligned
- 1px bottom border
- White background (opaque on scroll)
- Mobile: hamburger icon right, full-screen overlay menu

### 5.2 Navigation grouping

| Nav item | Contains |
|----------|----------|
| **Tuin** | Garden history, samentuin, the Wilhalla story |
| **Welzijn** | Fasciatherapie, lymfedrainage, KCR, Paardencoaching, Veerkracht in Beweging |
| **Yoga** | Standalone page |
| **Agenda** | Workshops, activiteiten, events calendar |
| **Verhuur** | Schuur & yurt rental |
| **Blog** | Blog listing + articles |

Tuin and Welzijn are landing pages that link to sub-pages.

---

## 6. Page Layouts

### 6.1 Homepage

```
[Sticky navbar]

[Interactive hand-drawn map — near full viewport height]

[Short intro text — 2-3 sentences, centered, 680px]

~~~ hand-drawn vine divider ~~~

[Three teaser blocks: Samentuin | Welzijn | Agenda]
[Each with short intro + "ontdek ->" link]

~~~ hand-drawn herb divider ~~~

[Featured block with hand-drawn bg texture]
[E.g., Verhuur highlight or upcoming event]

~~~ hand-drawn root divider ~~~

[Footer]
```

### 6.2 Content page template

All inner pages share this structure:

```
[Sticky navbar]

PAGE TITLE                          <- Display size, uppercase, wide-tracked
-------------------------------     <- 1px rule

Intro paragraph (max 680px prose)

~~~ hand-drawn divider ~~~

AANBOD                              <- H2 subsection
Description + optional image grid

~~~ hand-drawn divider ~~~

[Optional: special block with hand-drawn bg texture]
[Quote, featured info, highlight]

~~~ hand-drawn divider ~~~

INFO                                <- H2 subsection
Practical details, pricing, schedules

-------------------------------

CONTACT                             <- Per-section contact
Name | Email | Phone

[Footer]
```

### 6.3 Landing pages (Tuin, Welzijn)

Same template but the main content area becomes a link list to sub-pages:

```
WELZIJN
-------

Intro over de holistische aanpak...

  Fasciatherapie              ->
  Lymfedrainage               ->
  Kinetic Chain Release       ->
  Paardencoaching             ->
  Veerkracht in Beweging      ->
```

Simple list, generous vertical spacing, arrow indicators.

### 6.4 Sub-pages

Include a breadcrumb: `Welzijn / Fasciatherapie` — small, uppercase, muted color, links back to parent.

### 6.5 Agenda page

- Upcoming events listed above calendar: large date, title, short description
- Events separated by 1px rules (not cards)
- Embedded Google Calendar below (styled to match via iframe or API)

### 6.6 Blog

- Listing: title + date + first line, separated by rules (De Witte Raaf style)
- Article: full prose template with optional images
- No sidebar, no tag cloud, no clutter

---

## 7. Interactive Map

### 7.1 Overview

The hand-drawn colored pencil bird's-eye map is the homepage hero and primary discovery element. Users hover garden areas to see labels and borders, click to navigate to pages.

### 7.2 SVG overlay system

An SVG layer sits on top of the responsive map image. Each garden area is a `<path>` traced to match the area's organic shape.

```
+----------------------------------+
|  <img> map (responsive <picture>)|  <- bottom layer
|                                  |
|  <svg> overlay (same dimensions) |  <- top layer, position: absolute
|    <path> boomgaard              |     viewBox matches map aspect ratio
|    <path> moestuin               |     paths invisible by default
|    <path> serre                  |
|  </svg>                          |
+----------------------------------+
```

### 7.3 Hotspot data

```ts
type MapHotspot = {
  id: string
  label: string                        // "Moestuin", "Boomgaard"
  route: string                        // "/tuin/samentuin"
  path: string                         // SVG path d attribute
  labelPosition: { x: number, y: number }  // where label appears (%)
}
```

### 7.4 Interaction states

| State | Appearance |
|-------|-----------|
| **Default** | Paths invisible (`fill: transparent`, `stroke: none`) |
| **Hover** | `stroke: rgba(0,0,0,0.6)` 2px + `fill: rgba(255,255,255,0.12)` subtle wash + label fades in |
| **Focus** | Same as hover (keyboard accessible) |
| **Active/click** | Routes to page via TanStack Router |

### 7.5 Hand-drawn border effect

SVG filter makes clean paths look like pencil strokes:

```svg
<filter id="pencil">
  <feTurbulence baseFrequency="0.03" numOctaves="4" />
  <feDisplacementMap in="SourceGraphic" scale="2" />
</filter>
```

Alternative approaches:
- `stroke-dasharray: 8 4` for a dashed/sketched feel
- Slightly irregular path control points for natural wobble
- Pre-drawn scanned borders per area (most authentic but most work)

### 7.6 Tracing workflow

1. Open map image in Figma or Inkscape
2. Draw paths over each garden area with pen tool
3. Export SVG path `d` attributes
4. Define in hotspot data array
5. Fine-tune positions in browser

### 7.7 Approximate hotspot areas

| Hotspot | Area on map | Routes to |
|---------|------------|-----------|
| Boomgaard | Left side, orchard trees | `/tuin` |
| Woning/Schuur | Center, buildings | `/verhuur` |
| Moestuin | Right side, garden beds | `/tuin/samentuin` |
| Serre/Folietunnel | Right-center, greenhouse | `/tuin/samentuin` |
| Bessenkooi | Right, berry cages | `/tuin` |
| Kippen | Center-right, chickens | `/tuin` |

Positions to be fine-tuned during implementation.

### 7.8 Mobile

- Hotspot areas show subtle dotted border by default (discoverability)
- Tap: shows label + navigates
- Minimum tap target: 44x44px

### 7.9 Accessibility

- Each hotspot is a `<button>` or `<a>` with `aria-label`
- `Tab` cycles through hotspots
- `Enter` navigates
- Focus triggers hover visual state
- Labels are in DOM for screen readers

---

## 8. Responsive behavior

| Breakpoint | Behavior |
|-----------|----------|
| Desktop (>1024px) | Full layout, sticky nav with all links, map at near-viewport height |
| Tablet (768-1024px) | Slightly reduced spacing, nav may collapse, map scales down |
| Mobile (<768px) | Hamburger nav, full-screen menu overlay, map with tap targets, single-column content |

---

## 9. Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Routing | TanStack Router (file-based) |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui (new-york, neutral base) |
| Data fetching | TanStack Query |
| Font | EB Garamond Variable |
| Build | Vite 7 |
| CMS | TBD (self-hosted headless CMS or custom API) |
