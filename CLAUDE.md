# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is Sam Shulman's personal portfolio website, built with the "Void Terminal" design aesthetic: a dark, terminal-inspired UI with a deep void background (`#080810`), neon green (`#00E87A`) accents, monospace typography (Fragment Mono), and a hacker/developer visual identity.

### Key Sections
- **Hero** — Split layout with name/tagline on the left and an interactive terminal window (JSON career profile) on the right
- **AI Career Twin Chat** — Native chat UI backed by a Vercel AI + Gemini agent that knows Sam's full professional context and can send real email introductions
- **Projects** — Grid of selected work with tags and links
- **Writing/Blog** — Featured essay + secondary posts grid
- **Skills** — Two-column layout with skill groups and bar charts
- **Contact** — Links to email, LinkedIn, GitHub with a resume download

### Design System
- **Fonts:** Syne (headings, 800 weight), Fragment Mono (code/UI elements), DM Sans (body)
- **Colors:** Void `#080810`, Surface `#0F0F1A`, Green `#00E87A`, Purple `#9B7FD4`, Blue `#5B9CF6`
- **Style:** Sharp corners (no border-radius), 1px borders, scanline overlay, green glow effects, terminal aesthetics throughout

## Library Documentation

When working with any library or framework, **always use the most up-to-date documentation as of February 2026**. Do not rely on training data alone — verify APIs, signatures, and patterns using the lookup order below.

### Default Lookup Order
For most libraries (Tailwind v4, Zod, Shadcn, Vercel AI etc.):
1. **Context7 MCP** - Use the `resolve-library-id` and `query-docs` tools to fetch current documentation and code examples
2. **Web search** - Search the web for the latest docs, changelogs, and migration guides when Context7 doesn't have coverage


## Architecture Patterns

### Simplicity First
Prefer simple, straightforward solutions. Any added complexity must be justified—don't over-engineer or add abstractions "just in case." If a simple function solves the problem, don't wrap it in a class.

### Separation of Concerns
Follow Next.js App Router conventions to keep clear boundaries between layers:

- **Server Components for data, Client Components for interactivity.** Server Components own data fetching and static rendering. Client Components (`'use client'`) own browser APIs, event handlers, and state. Push `'use client'` as far down the component tree as possible — never mark an entire page as a Client Component just because one button needs `onClick`.
- **Fetch data in Server Components, pass it down as props.** Don't fetch data inside Client Components when a parent Server Component can do it and pass serializable props. This keeps data access on the server and avoids shipping fetch logic to the browser.
- **Server Actions go in dedicated files.** Place Server Actions in `actions.ts` files (with `'use server'` at the top), not inline in components. This keeps mutation logic separate from presentation and makes actions reusable across components.
- **Route-level files have single responsibilities.** `page.tsx` handles the page's data fetching and composition. `layout.tsx` handles shared UI shell. `loading.tsx` handles suspense states. Don't mix these concerns — a layout should never fetch page-specific data.
- **Colocate related files by feature/route.** Keep components, actions, and types used by a single route inside that route's directory. Only promote to shared locations (`src/components/`, `src/lib/`) when genuinely reused across multiple routes.

### Logging
Use uniform JSON logging throughout the application for traceability. All log output should be structured JSON to enable easy parsing and querying in log aggregation tools.


## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

### Tech Stack
- **Next.js 16** with App Router (`src/app/`)
- **React 19** with Server Components by default
- **Tailwind CSS v4** with `@tailwindcss/postcss`
- **shadcn/ui** for base components (customized to Void Terminal theme)
- **Vercel AI SDK** (`ai` + `@ai-sdk/google`) for the Career Twin chat — streaming, tool calling
- **Resend** for the AI email tool (send conversation notes/introductions)
- **TypeScript** with strict mode

### Environment Variables
```
GOOGLE_GENERATIVE_AI_API_KEY=   # Gemini API key (used by @ai-sdk/google)
RESEND_API_KEY=                 # Resend API key for email tool
```
