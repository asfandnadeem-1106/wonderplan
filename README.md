# WonderPlan

WonderPlan is a responsive, installable family activity planner for parents. The frontend includes the responsive app foundation, a mock-data Home screen at `/home`, activity details at `/activities/[id]`, and a mock itinerary planner at `/plan`. Recommendations are illustrative UI data, not verified local event listings.

## Run locally

1. Install Node.js 20 or newer.
2. Run `npm install` and `npm run dev`.
3. Open the local URL Vite prints.

## Frontend foundation

- `src/components/AppShell.ts` renders the responsive shell and navigation landmarks.
- `src/pages/HomeScreen.ts` composes the `/home` experience from reusable components and mock data.
- `src/components/ActivityDetailScreen.ts` renders `/activities/[id]` using the `Activity` domain model.
- `src/services/mockActivityService.ts` adapts Home preview recommendations into mock `Activity` records. It does not call a backend.
- `src/pages/PlannerScreen.ts` and `src/services/mockPlannerService.ts` build structured sample itineraries without an LLM or external activity search.
- `src/components/` contains reusable shell, recommendation, carousel, and activity-detail components.
- `src/style.css` defines design tokens, typography, responsive layout and interaction styles.
- `docs/DESIGN-SYSTEM.md` and `docs/UI-UX-SPEC.md` document the current foundation.
- `public/manifest.webmanifest` and `public/sw.js` provide the installable web app shell and basic same-origin offline caching.

The service worker is registered only in production. Build with `npm run build`; the static output is written to `dist/`.

## Backend foundation

A Supabase schema migration is in [`supabase/migrations/202609270001_wonderplan.sql`](supabase/migrations/202609270001_wonderplan.sql) and has been applied to the configured Supabase project. The current frontend reads published, verified activity listings from Supabase and keeps clearly labeled sample ideas available while that table is empty. Authentication, family profiles, saved activities and planner persistence are not wired into the UI yet. Never put a Supabase service-role key in browser code.

## Deployment

The Vite app is deployed on Vercel. `vercel.json` rewrites app routes to `index.html` so direct links to `/home`, `/plan`, and `/activities/[id]` work. Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel for production and preview builds; these are public client settings, not service-role credentials.
