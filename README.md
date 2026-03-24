# Agent Command Center v1.0

Full-stack Next.js 14 dashboard for monitoring OpenClaw agents, API connections, and balances.

## Tech Stack
- Next.js 14 (App Router, TypeScript)
- Supabase (PostgreSQL)
- Tailwind CSS
- Iron-session (auth)

## Setup

1. **Clone & Install**
   ```bash
   git clone https://github.com/stranearmin-afk/dh-1-0-claws-dashboard.git
   cd dh-1-0-claws-dashboard
   npm install
   ```

2. **Supabase Setup**
   - Create project at supabase.com
   - Run SQL schema (see SCHEMA.md)
   - Copy API keys to .env.local

3. **Environment Variables**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your keys
   ```

4. **Development**
   ```bash
   npm run dev
   ```

5. **Deploy to Vercel**
   - Push to GitHub
   - Connect to Vercel
   - Add environment variables
   - Deploy!

## Default Login
- Password: `admin`

## API Endpoints
- `GET /api/agents` - List agents
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/connections` - List API connections

## Documentation
See `SCHEMA.md` for database schema and `DEPLOYMENT.md` for Vercel setup.
