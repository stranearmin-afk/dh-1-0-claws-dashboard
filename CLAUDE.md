# CLAUDE.md — AI Assistant Guide for dh-1-0-claws-dashboard

## Project Overview

**dh-1-0-claws-dashboard** is an Agent Command Center Dashboard — a real-time monitoring interface for AI agents, API connections, cron jobs, and token usage. It uses a hybrid architecture: a Next.js application with API routes backed by Supabase, alongside a standalone HTML dashboard (`/public/dashboard.html`) that is the primary UI.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS 3.4 (dark glassmorphic theme) |
| Database | Supabase (PostgreSQL) |
| Auth | Iron-session (encrypted cookie sessions) |
| Password | bcryptjs |
| Deployment | Vercel |

---

## Repository Structure

```
/
├── app/                        # Next.js App Router
│   ├── api/                    # API route handlers (serverless)
│   │   ├── auth/
│   │   │   ├── login/route.ts  # POST — authenticate, set session cookie
│   │   │   └── logout/route.ts # POST — destroy session
│   │   ├── agents/route.ts     # GET/POST — agent heartbeat data (Supabase)
│   │   ├── agents-real/route.ts
│   │   ├── connections/route.ts      # GET — API integration status (hardcoded)
│   │   ├── token-usage/route.ts      # GET — token cost tracking (mock)
│   │   ├── cron-jobs/route.ts        # GET/POST — scheduled job monitoring
│   │   ├── sheets/route.ts           # GET/POST — Google Sheets via Apps Script
│   │   ├── fetch-sheets/route.ts     # Fetch sheets data
│   │   ├── webhook/route.ts          # POST — Google Apps Script webhook receiver
│   │   ├── dashboard-trigger/route.ts
│   │   └── todos/route.js
│   ├── auth/login/page.tsx     # Login page (client component)
│   ├── dashboard/
│   │   ├── layout.tsx          # Dashboard shell (header, logout button)
│   │   └── page.tsx            # Redirects to /dashboard.html
│   ├── layout.tsx              # Root layout (dark theme, metadata)
│   └── page.tsx                # Root redirect → /dashboard
├── components/
│   ├── GlassCard.tsx           # Glass-morphism card wrapper
│   ├── StatusBadge.tsx         # Status pill (running/idle/error)
│   └── Icons.tsx               # Inline SVG icons
├── lib/
│   ├── session.ts              # Iron-session config (cookie options, secret)
│   ├── auth.ts                 # Password verification
│   └── supabase.ts             # Supabase client (anon + service role)
├── styles/
│   └── globals.css             # Global styles, animations, gradient background
├── public/
│   ├── dashboard.html          # PRIMARY UI — standalone HTML/JS dashboard (v1.1.0)
│   └── testing/dashboard.html  # Testing/staging version of dashboard
├── middleware.ts               # Route protection (currently permissive)
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── SCHEMA.md                   # Supabase database schema documentation
└── DEPLOYMENT.md               # Vercel deployment instructions
```

---

## Development Workflows

### Local Development

```bash
npm install
cp .env.local.example .env.local   # then fill in values
npm run dev                         # http://localhost:3000
```

### Available Scripts

```bash
npm run dev      # Next.js dev server (hot reload)
npm run build    # Production build
npm run start    # Run production build locally
npm run lint     # ESLint via Next.js
```

### Deployment

- Push to `main` → Vercel auto-deploys production
- Push to any branch → Vercel creates a preview deployment
- No GitHub Actions CI is configured — Vercel handles all builds
- All env vars must be set in the Vercel dashboard (not committed)

---

## Environment Variables

All must be set in `.env.local` (local) and Vercel dashboard (production):

| Variable | Purpose |
|----------|---------|
| `SESSION_SECRET` | Iron-session encryption key (min 32 chars) |
| `ADMIN_PASSWORD_HASH` | Bcrypt hash of admin password |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only) |
| `AGENT_SHARED_SECRET` | Shared secret for agent webhook authentication |

---

## Database Schema (Supabase)

See `SCHEMA.md` for full details. Three core tables:

### `agents`
- `id` (text PK), `name`, `status` (idle/running/error)
- `current_job`, `last_heartbeat` (timestamp), `config_json` (JSONB)

### `connections`
- `id` (UUID PK), `service_name`, `service_type`, `api_key_encrypted`
- `initial_balance`, `estimated_usage` (numeric), `status`, `metadata` (JSONB)

### `usage_logs`
- `id` (UUID PK), `connection_id` (FK), `request_type`
- `input_tokens`, `output_tokens`, `cost_usd`, `timestamp`

> **Note:** RLS policies are currently set to allow all access. Tighten before production use.

---

## Authentication

- Session stored in an encrypted HTTP-only cookie (`iron-session`)
- Cookie max age: 24 hours
- Login route: `POST /api/auth/login`
- Logout route: `POST /api/auth/logout`
- `lib/session.ts` — session shape: `{ isLoggedIn: boolean }`
- `lib/auth.ts` — password verification logic
- `middleware.ts` — public paths: `/auth/**`, `/api/auth/**`; everything else requires session

> **Security note:** The current `lib/auth.ts` compares passwords in plaintext. It should use `bcryptjs.compare()` against `ADMIN_PASSWORD_HASH`.

---

## Architecture Patterns

### Hybrid UI Approach
The primary user-facing dashboard is `/public/dashboard.html` — a self-contained HTML/JS file that fetches data from the Next.js API routes. The Next.js React components (`/app/dashboard/`) currently redirect users to this static HTML file.

### Data Flow
1. AI agents POST heartbeats to `POST /api/agents` (authenticated via `AGENT_SHARED_SECRET`)
2. Google Apps Script POSTs to `POST /api/webhook` or `GET /api/sheets`
3. The HTML dashboard fetches from API routes (`/api/agents`, `/api/connections`, etc.)
4. API routes read from Supabase and return JSON

### Styling Conventions
- **Dark glassmorphic theme**: `bg-black/0a0a0a`, `backdrop-blur`, semi-transparent backgrounds
- Tailwind utility classes only — no CSS modules or styled-components
- Custom color `dark: '#0a0a0a'` defined in `tailwind.config.js`
- Animation: `pulse-ring` keyframe in `globals.css`
- Path alias `@/` maps to the repo root (e.g., `@/lib/session`)

### Component Conventions
- All React components are functional with hooks
- Client components must have `'use client'` directive at the top
- Server components (default in App Router) have no directive
- Reusable components live in `/components/`; page-specific logic stays in `/app/`

### API Route Conventions
- Files named `route.ts` (or `.js` for legacy)
- Export named functions: `GET`, `POST`, etc.
- Use `NextResponse.json()` for all responses
- Auth check: call `getIronSession()` at the start of protected routes and return 401 if `!session.isLoggedIn`

---

## Key Files to Know

| File | Purpose |
|------|---------|
| `public/dashboard.html` | Primary dashboard UI — most changes happen here |
| `app/api/agents/route.ts` | Agent heartbeat ingestion + Supabase reads |
| `app/api/sheets/route.ts` | Google Sheets proxy endpoint |
| `lib/session.ts` | Session configuration (change cookie name/TTL here) |
| `lib/supabase.ts` | Supabase client setup |
| `middleware.ts` | Route protection rules |
| `SCHEMA.md` | Database schema reference |
| `DEPLOYMENT.md` | Vercel deployment checklist |

---

## Known Issues / Technical Debt

1. **Plaintext password comparison** in `lib/auth.ts` — should use `bcryptjs.compare()`
2. **Hardcoded data** in `/api/connections/route.ts` and `/api/token-usage/route.ts` — not database-driven
3. **Permissive RLS policies** in Supabase — all tables allow all operations
4. **Middleware doesn't enforce auth** — session validation is present in route handlers but middleware is permissive
5. **No test suite** — no Jest, Vitest, or Cypress configured
6. **Mock data** in several API endpoints — not production-ready

---

## Git Conventions

- Branch: `main` is production
- Version tags follow `v1.x.y` semver (currently at v1.1.0)
- Commit message format: `<type>: <description> (vX.Y.Z)` — e.g., `feat: Add expandable rows (v1.0.27)`
- Types used: `feat`, `fix`, `revert`, `chore`

---

## Working on This Codebase

- **Most UI changes** go in `public/dashboard.html` (standalone HTML with inline JS)
- **API changes** go in `app/api/*/route.ts`
- **New reusable React components** go in `components/`
- **Library/utility changes** go in `lib/`
- After changes, run `npm run lint` and `npm run build` to verify no errors
- There is no test suite — verify changes manually via `npm run dev`
