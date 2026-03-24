# Vercel Deployment

## Steps

1. Push to GitHub
2. Go to vercel.com and connect your GitHub
3. Select this repository
4. Add Environment Variables:
   - ADMIN_PASSWORD_HASH
   - SESSION_SECRET
   - SUPABASE_URL
   - SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
   - AGENT_SHARED_SECRET

5. Deploy!

Your dashboard will be live at: `https://dh-1-0-claws-dashboard.vercel.app` (or your custom domain)

## Custom Domain
In Vercel dashboard > Settings > Domains, add your domain.
