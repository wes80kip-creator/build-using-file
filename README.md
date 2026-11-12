# GIGWORK SITE

A freelance marketplace and digital academy: freelance services, a remote jobs board, an online course academy, memberships, an affiliate program, a user dashboard, and an admin portal. It is a single-page React app with demo data.

## Tech

- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4
- Motion (animations) and lucide-react (icons)
- Hosted on Netlify as a static site

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

Or use `netlify dev` to run it with Netlify's local emulation.

## Deploy

Netlify runs `npm run build` and publishes `dist/` (see `netlify.toml`). All routes fall back to `index.html`.

## Roadmap

Listings, orders, payments, and accounts currently use the demo data in `src/data/mockData.ts` and in-browser state in `src/context/AppContext.tsx`. Next steps are persisting data (Netlify Database), adding real user accounts, and connecting payment gateways on the server.
