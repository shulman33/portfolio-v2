# Void Terminal Homepage — Implementation Spec

> Reference design: `design/concept-2-void-terminal.html`
> Excludes: AI Career Twin Chat section (already implemented, see `specs/ai-career-twin-chat.md`)

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Design System](#2-design-system)
3. [Boot Sequence (Page Load)](#3-boot-sequence)
4. [Navigation](#4-navigation)
5. [Hero Section](#5-hero-section)
6. [Stats Bar](#6-stats-bar)
7. [Projects Section](#7-projects-section)
8. [Skills Section](#8-skills-section)
9. [Contact Section](#9-contact-section)
10. [Footer](#10-footer)
11. [Responsive Behavior](#11-responsive-behavior)
12. [Performance & Accessibility](#12-performance--accessibility)
13. [SEO & Open Graph](#13-seo--open-graph)
14. [Data Files](#14-data-files)
15. [File Structure](#15-file-structure)

---

## 1. Architecture Overview

- **Single-page layout** — all sections on one page with smooth-scroll anchor navigation
- **Next.js 16 App Router** with React 19 Server Components by default
- `'use client'` only where needed (terminal animation, contact form, scroll-triggered animations, boot sequence)
- **Fonts** self-hosted via `next/font` (Syne, Fragment Mono, DM Sans)
- **Tailwind CSS v4** for styling, extended with the Void Terminal design tokens
- **No blog/writing section** — removed from scope

### Sections in Order (top to bottom)

1. Boot sequence overlay (1.5s, then reveals page)
2. Fixed navigation bar
3. Hero (name + terminal)
4. Stats bar
5. AI Career Twin Chat _(already implemented — skip)_
6. Projects
7. Skills
8. Contact
9. Footer

---

## 2. Design System

### Color Tokens

| Token            | Value                          | Usage                        |
| ---------------- | ------------------------------ | ---------------------------- |
| `--void`         | `#080810`                      | Page background              |
| `--surface`      | `#0F0F1A`                      | Card/section backgrounds     |
| `--surface-2`    | `#151524`                      | Elevated surfaces, hover     |
| `--surface-3`    | `#1C1C30`                      | Tertiary surface             |
| `--border`       | `#252538`                      | Default borders              |
| `--border-bright`| `#353550`                      | Hover/active borders         |
| `--text`         | `#E2E2F0`                      | Primary text                 |
| `--text-dim`     | `#888898`                      | Secondary text               |
| `--text-muted`   | `#5A5A75`                      | Decorative text (bumped from `#3A3A55` for WCAG AA) |
| `--green`        | `#00E87A`                      | Primary accent               |
| `--green-dim`    | `rgba(0,232,122,0.15)`         | Green tint backgrounds       |
| `--green-glow`   | `0 0 20px rgba(0,232,122,0.25)`| Glow box-shadow              |
| `--purple`       | `#9B7FD4`                      | Tag/secondary accent         |
| `--purple-dim`   | `rgba(155,127,212,0.12)`       | Purple tint                  |
| `--blue`         | `#5B9CF6`                      | Tertiary accent              |

> **Accessibility note:** `--text-muted` has been bumped to `#5A5A75` (~4.5:1 contrast on `--void`) to pass WCAG AA. All primary and secondary text colors already pass AA/AAA.

### Typography

| Font           | Weight(s)    | Usage                                     | Loading           |
| -------------- | ------------ | ----------------------------------------- | ----------------- |
| Syne           | 800          | Section headings, hero name, stat numbers | `next/font/google` |
| Fragment Mono  | 400          | Nav, terminal UI, tags, labels, inputs    | `next/font/google` |
| DM Sans        | 300, 400, 500| Body text, chat bubbles                   | `next/font/google` |

### Visual Rules

- **Border radius:** `0px` everywhere — sharp corners on all devices, no exceptions
- **Touch targets on mobile:** Increase padding/size to minimum 44x44px tap area while keeping 0px radius
- **Borders:** 1px solid `var(--border)` for structure; brighter on hover
- **Scanline overlay:** Repeating 2px transparent/opaque gradient over entire page (`z-index: 9999`, `pointer-events: none`). Disabled via `prefers-reduced-motion: reduce`
- **Scrollbar:** Webkit-only custom green scrollbar (`4px` width, green thumb on void track). Accept default scrollbar on Firefox
- **Glow effects:** `var(--green-glow)` box-shadow on hover for primary interactive elements

---

## 3. Boot Sequence

A terminal-styled loading overlay that displays on first page load before revealing the site content.

### Behavior

1. On page load, a full-screen overlay (`z-index: 10000`) covers the page with `background: var(--void)`
2. Text lines appear sequentially in Fragment Mono, green text:
   ```
   > initializing void_terminal v2.0...
   > loading modules.............. done
   > establishing connection...... done
   > rendering portfolio.......... done

   [system ready]
   ```
3. Each line appears with a ~250ms stagger
4. Total duration: ~1.5 seconds
5. After "system ready", the overlay fades out over 300ms revealing the page beneath
6. The boot sequence runs **once per session** — use `sessionStorage` to skip on subsequent navigations/reloads within the same tab session

### Implementation

- Client Component wrapping page content
- CSS transitions for fade-out (no heavy animation library)
- `prefers-reduced-motion: reduce` — skip boot sequence entirely, show page immediately
- Page content renders behind the overlay (no blocking of actual content loading)

---

## 4. Navigation

### Desktop (>768px)

- **Fixed** at top, full width
- Left: logo `sam_shulman` in Fragment Mono with blinking green cursor `_`
- Right: horizontal link list in Fragment Mono
- Links: `./chat` | `./projects` | `./skills` | `./contact`
- `./contact` has a green CTA style (green-dim background, green text, green border)
- Background: `rgba(8,8,16,0.92)` with `backdrop-filter: blur(12px)`
- Bottom border: `1px solid var(--border)`
- Active section highlighting on scroll (Intersection Observer)

### Mobile (<768px) — Full-screen Terminal Overlay

- Collapsed: show logo on left, a `>_` prompt icon/button on right
- Tapping the prompt icon opens a **full-screen overlay** styled as a terminal session:
  - Background: `var(--void)` at full opacity
  - Top: terminal bar with dots (red/yellow/green) and title "navigation"
  - Body: nav links listed vertically as terminal commands, each prefixed with `> `
  - Tapping a link closes the overlay and smooth-scrolls to the section
  - Close button or tapping outside closes the overlay
- Overlay animates in with a quick opacity fade (150ms)
- Body scroll is locked while overlay is open

### Scroll Behavior

- `scroll-behavior: smooth` on `html`
- Nav links use anchor `href="#section-id"` with offset accounting for fixed nav height
- Active link gets `color: var(--green)` based on which section is in viewport (Intersection Observer)

---

## 5. Hero Section

### Layout

- **Desktop:** CSS Grid, `1fr 1fr`, vertically centered
- **Mobile:** Single column — terminal window is **hidden**, only name/tagline/CTAs shown
- Full viewport height (`min-height: 100vh`)
- Padding: `8rem 4rem 4rem` desktop, adjusted for mobile

### Background

- CSS grid lines: `60px` cells on desktop, **scaled to 36px on mobile** (`<768px`)
- Grid opacity: `0.4`
- Radial gradient fade overlaying the grid: `radial-gradient(ellipse 70% 70% at 30% 50%, transparent 0%, var(--void) 100%)`

### Left Column — Hero Content

1. **Prompt line:** `> whoami --verbose` in Fragment Mono, green text, `0.75rem`
2. **Name:** Two-line display in Syne 800
   - Line 1: "Samuel" — solid `var(--text)` color
   - Line 2: "Shulman" — transparent fill with `1px` green stroke (outline effect)
   - Size: `clamp(4rem, 6.5vw, 7.5rem)`, line-height `0.9`, uppercase
3. **Tagline:** DM Sans 300, `0.95rem`, `var(--text-dim)`, max-width `42ch`
   - Content: "**Software engineer & AI systems builder.** I design intelligent interfaces and robust backends — and I built an AI twin that knows my career better than a resume ever could."
   - `<strong>` text uses `var(--text)` at font-weight `400`
4. **CTA buttons:**
   - Primary: `./start_conversation` — green background, void text, Fragment Mono
   - Secondary: `./view_projects` — transparent with border, dim text, Fragment Mono
   - Both link to anchor sections (`#chat` and `#projects`)

### Right Column — Terminal Window (Desktop Only)

- Hidden on mobile (`display: none` below 768px)
- **Terminal chrome:** surface-2 header bar with red/yellow/green dots + "career_profile.json" title
- **Terminal body:** Monospace JSON display showing career profile data

#### Typewriter Animation

- On first page load (after boot sequence completes), the terminal content animates line-by-line
- Each line of JSON appears with a typing effect (~40ms per character or ~200ms per line stagger)
- Fires **once only** — does not replay on scroll
- After all lines are rendered, a blinking green cursor block appears at the bottom `$ ` prompt
- Implementation: Client Component with `useEffect`, incrementally revealing pre-rendered content using CSS `opacity` or `clip-path` per line
- `prefers-reduced-motion` — show all content immediately, skip animation

#### Terminal Content

```json
{
  "name": "Samuel Shulman",
  "role": "Software Engineer + AI Builder",
  "location": "New York, NY",
  "stack": [
    "Next.js", "Python", "LangChain",
    "Gemini", "TypeScript", "PostgreSQL"
  ],
  "focus": "AI-native applications",
  "open_to": "new opportunities",
  "ai_twin": true
}
```

Syntax coloring: keys in `var(--purple)`, string values in `var(--blue)`, braces/brackets in `var(--text-muted)`, `true` in `var(--blue)`

---

## 6. Stats Bar

### Layout

- Full-width bar between hero and chat sections
- Background: `var(--surface)`
- Top and bottom `1px solid var(--border)`
- Desktop: 4-column grid, stats separated by vertical `1px` border lines
- Mobile: 2x2 grid

### Stats (Final Values)

| Value | Label             |
| ----- | ----------------- |
| `3+`  | Years Coding      |
| `10+` | Ideas Prototyped  |
| check | Full-Stack + AI   |
| `inf` | Always Building   |

- Numbers/symbols: Syne 800, `2.5rem`, `var(--green)`
- Labels: Fragment Mono, `0.65rem`, `var(--text-dim)`, uppercase, letter-spacing `0.1em`
- The check mark uses a `✓` character; the infinity uses `∞`

### Count-Up Animation

- Numbers (`3+`, `10+`) animate counting from 0 to target when the stats bar scrolls into viewport
- Triggered via Intersection Observer, fires once
- `✓` and `∞` appear with a quick fade-in (no counting needed)
- Duration: ~1.2 seconds, easing: ease-out
- `prefers-reduced-motion` — show final values immediately

---

## 7. Projects Section

### Layout

- Background: `var(--surface)`, top border
- Section header: `// selected_projects` label + horizontal rule line
- Desktop: 3-column grid with 1px gap (gap filled by `var(--border)` background on parent)
- Tablet (768px-1024px): 2-column grid
- Mobile (<768px): single column stack
- Cards have `var(--void)` background within the border-gapped grid

### Project Card

- **Index:** `project_01`, `project_02`, etc. — Fragment Mono, `0.62rem`, muted
- **Title:** Syne 700, `1.15rem`, `var(--text)`
- **Description:** DM Sans 300, `0.82rem`, `var(--text-dim)`, line-height `1.8`
- **Tags:** Fragment Mono `0.6rem`, purple border + background tint, flex-wrap
- **Links:** Array of labeled links, each as `label →` in Fragment Mono `0.65rem`, muted text, green on hover

### Hover Effect

- Card background transitions to `var(--surface-2)`
- A 1px green line at the top of the card scales from `scaleX(0)` to `scaleX(1)` (left to right, `0.35s ease`)

### Scroll Animation

- Project cards stagger-fade-in when scrolling into viewport
- Each card fades up with a slight `translateY(20px)` to `translateY(0)` + opacity `0` to `1`
- Stagger: ~100ms delay between each card
- `prefers-reduced-motion` — no animation, render immediately

### Data Source

Projects are defined in a TypeScript data file. See [Data Files](#14-data-files) section for schema.

---

## 8. Skills Section

### Layout

- Background: `var(--surface)`, top border
- Section header: `// tech_stack` label + horizontal rule line
- Desktop: 2-column layout — left column has heading + description, right column has skill groups
- Mobile: single column, heading/description stacked above skill groups

### Left Column

- Heading: "Technical **Stack**" — Syne 800, `clamp(2rem, 3vw, 3rem)`, uppercase. "Stack" in `var(--green)`
- Body: DM Sans 300, `0.9rem`, `var(--text-dim)`
- Content: "Depth across the modern stack — AI systems, full-stack web, and distributed architecture. I reach for the right tool, not the familiar one."

### Right Column — Skill Tag Clouds

4 groups displayed in a 2x2 grid on desktop, stacked on mobile:

#### Group 1: Frontend
- React / Next.js, TypeScript, Tailwind CSS

#### Group 2: AI / ML
- LangChain, Python, Gemini / GPT APIs

#### Group 3: Backend
- Node.js, PostgreSQL, Cloud / DevOps

#### Group 4: Tools
- Git / CI/CD, Docker, Vercel / AWS

### Skill Group Card

- Background: `var(--void)`, `1px solid var(--border)`, padding `1.5rem`
- Header: `// category_name` — Fragment Mono `0.62rem`, green, uppercase, bottom border
- Tags: `flex-wrap` container with gap `0.35rem`

### Skill Tag Styling

- **Uniform appearance** across all tags (no emphasis tiers)
- Fragment Mono, `0.6rem`, letter-spacing `0.06em`
- Color: `var(--purple)`
- Border: `1px solid rgba(155,127,212,0.2)`
- Background: `rgba(155,127,212,0.05)`
- Padding: `0.2rem 0.5rem`

---

## 9. Contact Section

### Layout

- Background: `var(--void)`, top border
- Desktop: 2-column grid (`1fr 1fr`), `6rem` gap
- Mobile: single column stack

### Left Column

- Section header: `// contact` label + rule
- Heading: "Let's **Connect**" — Syne 800, `clamp(2.5rem, 4vw, 4.5rem)`, uppercase. "Connect" in green on its own line
- Subtext: Fragment Mono `0.72rem`, dim text. "Open to interesting opportunities, collaborations, and conversations. Best response time: email or LinkedIn."
- Resume button: `./download_resume` — Fragment Mono, green border, transparent background, links to `/resume.pdf` (static PDF in `/public`)
  - Hover: green-dim background + green glow

### Right Column — Contact Links + Form

#### Direct Links (top)

Vertical list of contact links, each as a row:

| Label    | Value                       | URL                                  |
| -------- | --------------------------- | ------------------------------------ |
| email    | sam@shulman.dev             | `mailto:sam@shulman.dev`             |
| linkedin | linkedin.com/in/samshulman  | `https://linkedin.com/in/samshulman` |
| github   | github.com/shulman33        | `https://github.com/shulman33`       |

- Each link is a full-width row with label (muted, uppercase, `0.58rem`) + value (Fragment Mono, `0.82rem`) on the left, and `→` arrow on the right
- Separated by `1px` bottom borders
- Hover: indent left padding by `0.6rem`, value text turns green, arrow turns green

#### Contact Form (below links)

A simple 3-field form styled in the terminal aesthetic:

- **Fields:** Name, Email, Message (textarea)
- All inputs: `var(--surface-2)` background, `1px solid var(--border)`, Fragment Mono, `var(--text)`, no border-radius
- Focus state: border-color transitions to `rgba(0,232,122,0.35)`
- Placeholder text in `var(--text-muted)`
- **Submit button:** `./send_message` — same style as `btn-primary` (green background, void text)
- **Form states:**
  - Submitting: button text changes to `sending...` with disabled state
  - Success: brief inline message "message sent" in green text, form resets after 3 seconds
  - Error: inline error message in red/muted text below the form

#### Server Action

- Form submission handled by a Server Action in `actions.ts`
- Sends email via **Resend** API to `sam@shulman.dev`
- Logs submission as structured JSON to server console (no database storage)
- Basic server-side validation: all 3 fields required, email format check
- Rate limiting: consider basic IP-based throttle or rely on Vercel's built-in protections

---

## 10. Footer

### Layout

- Full width, `var(--surface)` background, top border
- Flex row: left text + right status
- Padding: `1.5rem 4rem` desktop, `1.5rem 1.5rem` mobile

### Content

- **Left:** `© {currentYear} Samuel Shulman` — Fragment Mono `0.65rem`, muted. Year is dynamic (from `new Date().getFullYear()` in the Server Component)
- **Right:** Green pulsing dot + `all systems nominal` + `|` + `view source →` link to GitHub repo (`https://github.com/shulman33`)
  - All Fragment Mono `0.65rem`, muted text
  - Source link: muted text, green on hover

---

## 11. Responsive Behavior

### Breakpoints

| Breakpoint | Label   | Notes                                    |
| ---------- | ------- | ---------------------------------------- |
| < 480px    | Phone   | Single column, compact spacing           |
| 480–768px  | Large phone | Single column, slightly more padding  |
| 768–1024px | Tablet  | 2-column grids where applicable          |
| > 1024px   | Desktop | Full layout as designed                  |

### Section-by-Section Mobile Adaptations

| Section    | Desktop                       | Tablet (768-1024)           | Mobile (<768)                        |
| ---------- | ----------------------------- | --------------------------- | ------------------------------------ |
| Nav        | Horizontal links              | Horizontal links (tighter)  | Logo + `>_` button, full-screen overlay |
| Hero       | 2-col: content + terminal     | 2-col narrower              | 1-col: content only, terminal hidden |
| Hero Grid BG | 60px cells                 | 60px cells                  | 36px cells                           |
| Stats      | 4-col                         | 4-col                       | 2x2 grid                            |
| Projects   | 3-col grid                    | 2-col grid                  | 1-col stack                          |
| Skills     | 2-col (intro + groups)        | 2-col narrower              | 1-col stack, groups also 1-col       |
| Contact    | 2-col                         | 2-col narrower              | 1-col stack                          |
| Footer     | Flex row                      | Flex row                    | Flex row (wrap if needed)            |

### Padding

- Desktop: `4rem` horizontal section padding
- Tablet: `2.5rem`
- Mobile: `1.25rem`

### Touch Targets

- All interactive elements (buttons, links, nav items, form inputs, pills) must have minimum **44x44px** tap area on mobile
- Increase padding on buttons and links to meet this without adding border-radius
- Input heights: minimum `44px` on mobile (up from 36px desktop)

---

## 12. Performance & Accessibility

### Performance

- **Fonts:** Self-hosted via `next/font` with `display: swap` — no external font requests
- **Scanline overlay:** Pure CSS, uses `will-change: transform` for GPU compositing. Disabled for `prefers-reduced-motion`
- **Animations:** All scroll-triggered animations use Intersection Observer with `{ once: true }` — no continuous observers
- **Images:** None in current spec (no project thumbnails). If added later, use `next/image` with WebP/AVIF
- **JavaScript:** Boot sequence and terminal animation are the only meaningful JS. Both are lightweight, no external animation libraries

### Accessibility

- **Color contrast:** All text meets WCAG AA (4.5:1 minimum). `--text-muted` bumped to `#5A5A75` for compliance
- **`prefers-reduced-motion: reduce`:**
  - Boot sequence: skipped entirely
  - Terminal typewriter: content shown immediately
  - Stats count-up: show final values
  - Scroll animations: disabled
  - Cursor blink: stopped
  - Scanline overlay: hidden
- **Keyboard navigation:** All interactive elements focusable, visible focus outlines (green border glow)
- **Semantic HTML:** Proper heading hierarchy (h1 for hero name, h2 for section headings, h3 for card titles)
- **ARIA:** `aria-label` on icon-only buttons (mobile nav toggle, send button). `aria-hidden` on decorative elements (terminal dots, section rules, status dots)
- **Form:** Labels associated with inputs, required field indicators, error messages linked via `aria-describedby`
- **Skip link:** Hidden "Skip to main content" link at top of page, visible on focus

---

## 13. SEO & Open Graph

### Metadata

```typescript
export const metadata: Metadata = {
  title: "Sam Shulman — Software Engineer & AI Builder",
  description: "Portfolio of Samuel Shulman. Software engineer building AI-native applications with Next.js, Python, LangChain, and Gemini.",
  // ... additional meta tags
}
```

### Dynamic OG Image

- Generated using **Next.js ImageResponse API** (`app/opengraph-image.tsx`)
- Design: Void Terminal aesthetic — dark background (`--void`), Syne heading "Samuel Shulman", green accent text "Software Engineer + AI Builder", subtle grid pattern, terminal-style decorative elements
- Size: 1200x630px
- Used for: Twitter cards, LinkedIn shares, general URL unfurling

---

## 14. Data Files

### `src/data/projects.ts`

```typescript
export interface ProjectLink {
  label: string   // e.g. "live demo", "github", "writeup"
  url: string
}

export interface Project {
  title: string
  description: string
  tags: string[]
  links: ProjectLink[]
}

export const projects: Project[] = [
  {
    title: "Career Twin Agent",
    description: "Agentic AI system with full professional context. Handles nuanced conversations and recruiter outreach via email tools.",
    tags: ["LangChain", "Gemini", "Python"],
    links: [
      { label: "view_project", url: "#" }
    ]
  },
  {
    title: "Portfolio Platform",
    description: "This site — Next.js with a native AI chat interface, terminal-inspired design system, and dynamic OG generation.",
    tags: ["Next.js", "Tailwind", "TypeScript"],
    links: [
      { label: "view_source", url: "https://github.com/shulman33" }
    ]
  },
  {
    title: "Distributed Research",
    description: "Research into fault-tolerant architectures focusing on consensus algorithms and partition tolerance.",
    tags: ["Python", "Distributed", "Research"],
    links: [
      { label: "view_project", url: "#" }
    ]
  }
]
```

> Project data is intentionally minimal. Add or remove projects by editing this file.

---

## 15. File Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout: fonts, metadata, global styles
│   ├── page.tsx                # Homepage: composes all sections
│   ├── opengraph-image.tsx     # Dynamic OG image generation
│   ├── actions.ts              # Server Actions (contact form submission)
│   └── globals.css             # Tailwind directives + CSS custom properties
├── components/
│   ├── boot-sequence.tsx       # Client: terminal boot overlay
│   ├── navbar.tsx              # Client: fixed nav with mobile overlay + scroll spy
│   ├── hero.tsx                # Server: hero layout
│   ├── hero-terminal.tsx       # Client: terminal with typewriter animation
│   ├── stats-bar.tsx           # Client: stats with count-up animation
│   ├── projects-section.tsx    # Server: projects grid
│   ├── project-card.tsx        # Server: individual project card
│   ├── skills-section.tsx      # Server: skills layout with tag clouds
│   ├── contact-section.tsx     # Server: contact layout (links + form)
│   ├── contact-form.tsx        # Client: form with submit handling
│   └── footer.tsx              # Server: footer
├── data/
│   └── projects.ts             # Project data definitions
└── lib/
    └── resend.ts               # Resend email client setup
```

### Component Boundary Rules

| Component           | Server/Client | Why                                         |
| ------------------- | ------------- | ------------------------------------------- |
| `boot-sequence`     | Client        | Manages overlay state, sessionStorage, timers |
| `navbar`            | Client        | Scroll spy, mobile overlay toggle, body scroll lock |
| `hero`              | Server        | Static content, no interactivity             |
| `hero-terminal`     | Client        | Typewriter animation with useEffect          |
| `stats-bar`         | Client        | Intersection Observer, count-up animation    |
| `projects-section`  | Server        | Reads from data file, renders grid           |
| `project-card`      | Server        | Static card, CSS-only hover effects          |
| `skills-section`    | Server        | Static content, no interactivity             |
| `contact-section`   | Server        | Layout wrapper                               |
| `contact-form`      | Client        | Form state, submission handling, useActionState |
| `footer`            | Server        | Static content, dynamic year via JS Date     |

---

## Summary of Key Decisions

| Decision                        | Choice                                                      |
| ------------------------------- | ----------------------------------------------------------- |
| Blog/writing section            | Removed                                                     |
| Career twin chat section        | Already implemented — excluded from this spec               |
| Page structure                  | Single page with anchor scroll                              |
| Project data source             | TypeScript data file (`src/data/projects.ts`)               |
| Project links                   | External URLs only, flexible array of labeled links         |
| Project card links              | Flexible array (demo, github, writeup, etc.)                |
| Skill display                   | Tag clouds grouped by category (uniform styling)            |
| Contact form                    | Name + Email + Message, sends via Resend, logs to console   |
| Resume                          | Static PDF in `/public`                                     |
| Stats                           | 3+ Years Coding, 10+ Ideas Prototyped, Full-Stack+AI, Always Building |
| Boot sequence                   | ~1.5s terminal boot, once per session, skippable            |
| Hero terminal animation         | Typewriter, fires once                                      |
| Mobile nav                      | Full-screen terminal overlay                                |
| Mobile hero                     | Terminal hidden, content only                               |
| Hero grid background            | 60px desktop, 36px mobile                                   |
| Scroll animations               | Key elements only (stats, project cards)                    |
| Border radius                   | 0px everywhere, increased touch target padding on mobile    |
| Scanlines                       | Global, disabled for prefers-reduced-motion                 |
| Scrollbar                       | Webkit-only green scrollbar, accept inconsistency           |
| OG image                        | Dynamic via Next.js ImageResponse                           |
| Fonts                           | Self-hosted via next/font                                   |
| Text contrast (--text-muted)    | Bumped to #5A5A75 for WCAG AA compliance                    |
| Footer                          | Auto year + source link to GitHub                           |
