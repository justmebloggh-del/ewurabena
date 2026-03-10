# Ewura Abena Music + Portfolio App

Production-ready foundation for Ewura Abena's global gospel music and ministry platform.

## Stack

- Next.js (App Router, TypeScript)
- Supabase (Postgres, Auth, Storage, RLS)
- Vercel deployment target
- Formspree (contact message delivery)
- Vitest + Playwright test setup

## Features Implemented

- Public pages: Home, About, Albums, Playlists, Portfolio, Contact
- Fan features: email/password signup/login, favorites, private playlists, in-app notifications
- Admin dashboard: profile/music/portfolio/social/donation/announcement/contact management forms
- Public and protected API routes for content, fan actions, and admin actions
- Supabase SQL schema with policies for fan/admin role control
- Contact form delivery via Formspree + optional Supabase inbox backup
- Global artist image banner visible on every page

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment template:

```bash
cp .env.example .env.local
```

3. Fill `.env.local` values:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY` (server-only)
- `FORMSPREE_ENDPOINT` (required for live contact submissions)

Legacy fallback variables are also supported:
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

4. Run database schema in Supabase SQL editor:

- `supabase/schema.sql`

5. Start development server:

```bash
npm run dev
```

## Scripts

- `npm run dev` - local development
- `npm run build` - production build
- `npm run lint` - linting
- `npm run test` - unit/integration tests
- `npm run test:coverage` - unit/integration tests with coverage
- `npm run test:e2e` - Playwright smoke test

## Deployment

Deploy to Vercel and set all environment variables in the project settings.
