# AGENTS.md

## Overview
GIGWORK SITE is a client-only Vite + React 19 + Tailwind 4 single-page app, originally exported from Google AI Studio and deployed as a static site on Netlify.

## Structure
- `index.html`: entry HTML with SEO meta and JSON-LD
- `src/main.tsx`, `src/App.tsx`: bootstrapping and top-level view switching (views are state-driven, not URL routes)
- `src/context/AppContext.tsx`: global app state (services, jobs, courses, orders, memberships, gateway settings)
- `src/data/mockData.ts`: all seed/demo data; swap this out when adding real persistence
- `src/types/index.ts`: shared types
- `src/components/`: feature screens and modals (Hero, JobBoard, Academy, Memberships, AffiliateProgram, Dashboard, AdminPortal, checkout, posting modals)
- `public/`: static assets, sitemap, robots, manifest, `_redirects`

## Conventions and notes
- Tailwind utility classes only; theme in `src/index.css`.
- `@/` aliases the project root.
- No server code exists yet. `express`, `dotenv`, and `@google/genai` are in package.json from the AI Studio export but are unused. If server logic is added, use Netlify primitives (Netlify Functions/Server, Netlify Database, AI Gateway) rather than an Express server.
- SPA fallback is configured in both `netlify.toml` and `public/_redirects`.
- The Apache `.htaccess` from the export was dropped because Netlify doesn't use it.
