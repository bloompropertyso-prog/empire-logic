# Empire Logic — Full Setup Guide
## GitHub → Supabase → Stripe → Vercel

---

## STEP 1 — Install dependencies & wire components

Open your terminal, `cd` into your project folder, then run:

```bash
npm install
```

Move your 4 component files into the right folder:

```bash
mkdir -p src/components
mv EmpireLogicShell.jsx src/components/
mv TheVault.jsx        src/components/
mv SocialStudio.jsx    src/components/
mv FounderPerks.jsx    src/components/
```

Test locally:

```bash
npm run dev
# → open http://localhost:3000
```

---

## STEP 2 — Environment variables

Copy the example file and fill in your keys:

```bash
cp .env.example .env
```

Then open `.env` in your editor and paste in your keys (see Step 3 & 4 for where to find them).

---

## STEP 3 — Supabase

### 3a. Run the schema

1. Go to **Supabase Dashboard** → your project → **SQL Editor** → **New query**
2. Open `supabase/schema.sql` from this folder
3. Paste the entire file → click **Run**

That creates: `profiles`, `vault_documents`, `social_drafts`, `billing` tables + RLS policies + storage bucket.

### 3b. Enable Google OAuth (optional)

1. Supabase Dashboard → **Authentication** → **Providers** → **Google**
2. Enable it and paste your Google OAuth client ID & secret
3. Add `https://your-project-ref.supabase.co/auth/v1/callback` as an authorized redirect URI in Google Cloud Console

### 3c. Copy your keys into `.env`

- **VITE_SUPABASE_URL** & **VITE_SUPABASE_ANON_KEY** → Supabase Dashboard → **Project Settings** → **API**
- **SUPABASE_SERVICE_ROLE_KEY** → same page (keep this secret, server-side only)

---

## STEP 4 — Stripe

### 4a. Create your products

1. Stripe Dashboard → **Products** → **Add product**
2. Create two plans: **Founder** and **Empire**
3. Add a recurring price to each
4. Copy the **Price ID** (starts with `price_...`) for each into `.env`

### 4b. Copy your API keys

- **VITE_STRIPE_PUBLISHABLE_KEY** → Stripe Dashboard → **Developers** → **API Keys** → Publishable key
- **STRIPE_SECRET_KEY** → same page → Secret key (reveal it)

### 4c. Set up the webhook (after Vercel deploy in Step 6)

1. Stripe Dashboard → **Developers** → **Webhooks** → **Add endpoint**
2. URL: `https://your-app.vercel.app/api/stripe-webhook`
3. Events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. Click **Add endpoint** → copy the **Signing secret** (starts with `whsec_...`) → paste into `.env` as `STRIPE_WEBHOOK_SECRET`

### 4d. Test locally with Stripe CLI

```bash
# Install Stripe CLI (Mac)
brew install stripe/stripe-cli/stripe

# Log in
stripe login

# Forward webhooks to your local server
stripe listen --forward-to localhost:3000/api/stripe-webhook

# In another terminal, trigger a test event
stripe trigger checkout.session.completed
```

---

## STEP 5 — GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# First commit
git commit -m "feat: initial Empire Logic setup with Supabase + Stripe + Vercel"

# Add your GitHub remote (replace with your actual repo URL)
git remote add origin https://github.com/YOUR_USERNAME/empire-logic.git

# Push
git push -u origin main
```

---

## STEP 6 — Vercel

### 6a. Install Vercel CLI

```bash
npm install -g vercel
```

### 6b. Deploy

```bash
vercel
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → your account
- **Link to existing project?** → No (create new)
- **Project name?** → empire-logic
- **In which directory is your code located?** → ./
- **Want to override settings?** → No

### 6c. Add environment variables to Vercel

```bash
# Run this for each variable in your .env file
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add SUPABASE_URL
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add VITE_STRIPE_PUBLISHABLE_KEY
vercel env add STRIPE_SECRET_KEY
vercel env add STRIPE_WEBHOOK_SECRET
vercel env add STRIPE_PRICE_FOUNDER
vercel env add STRIPE_PRICE_EMPIRE
vercel env add NEXT_PUBLIC_APP_URL
```

Or add them all at once in Vercel Dashboard → your project → **Settings** → **Environment Variables**.

### 6d. Deploy to production

```bash
vercel --prod
```

### 6e. Connect GitHub for auto-deploys

1. Vercel Dashboard → your project → **Settings** → **Git**
2. Connect to your GitHub repo
3. Every push to `main` will now auto-deploy ✓

---

## STEP 7 — Verify everything works

```bash
# Check your production deployment
vercel logs

# Check Supabase is receiving auth events
# → Supabase Dashboard → Authentication → Users

# Test a Stripe checkout
# → use card number 4242 4242 4242 4242, any future date, any CVC
```

---

## Quick reference — useful commands

| Command | What it does |
|---|---|
| `npm run dev` | Start local dev server |
| `npm run build` | Build for production |
| `vercel` | Deploy preview |
| `vercel --prod` | Deploy to production |
| `stripe listen --forward-to localhost:3000/api/stripe-webhook` | Forward Stripe webhooks locally |
| `git push origin main` | Push to GitHub (triggers Vercel auto-deploy) |
