-- ============================================================
-- Empire Logic — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- ── 1. PROFILES (extends auth.users) ────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url  text,
  energy_level int default 3 check (energy_level between 1 and 5),
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── 2. VAULT DOCUMENTS ──────────────────────────────────────
create table if not exists public.vault_documents (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  category    text not null check (category in ('legal', 'brand', 'financial', 'operations')),
  file_url    text,
  file_size   bigint,
  mime_type   text,
  notes       text,
  is_complete boolean default false,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create index if not exists vault_documents_user_id_idx on public.vault_documents(user_id);
create index if not exists vault_documents_category_idx on public.vault_documents(category);

-- ── 3. SOCIAL STUDIO DRAFTS ─────────────────────────────────
create table if not exists public.social_drafts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  platform    text not null check (platform in ('instagram', 'linkedin', 'twitter', 'tiktok', 'email')),
  tone        text not null,
  goal        text not null,
  prompt      text,
  content     text not null,
  energy_level int default 3,
  is_published boolean default false,
  published_at timestamptz,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create index if not exists social_drafts_user_id_idx on public.social_drafts(user_id);
create index if not exists social_drafts_platform_idx on public.social_drafts(platform);

-- ── 4. STRIPE BILLING STATE ─────────────────────────────────
create table if not exists public.billing (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null unique references auth.users(id) on delete cascade,
  stripe_customer_id  text unique,
  stripe_subscription_id text unique,
  plan_tier           text default 'free' check (plan_tier in ('free', 'founder', 'empire')),
  status              text default 'inactive' check (status in ('active', 'inactive', 'trialing', 'past_due', 'canceled')),
  current_period_end  timestamptz,
  cancel_at_period_end boolean default false,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

create index if not exists billing_user_id_idx on public.billing(user_id);
create index if not exists billing_stripe_customer_id_idx on public.billing(stripe_customer_id);

-- ── 5. ROW LEVEL SECURITY ───────────────────────────────────
alter table public.profiles          enable row level security;
alter table public.vault_documents   enable row level security;
alter table public.social_drafts     enable row level security;
alter table public.billing           enable row level security;

-- Profiles: users can only see/edit their own
create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Vault: users can CRUD their own documents
create policy "Users can view own vault docs"
  on public.vault_documents for select using (auth.uid() = user_id);
create policy "Users can insert own vault docs"
  on public.vault_documents for insert with check (auth.uid() = user_id);
create policy "Users can update own vault docs"
  on public.vault_documents for update using (auth.uid() = user_id);
create policy "Users can delete own vault docs"
  on public.vault_documents for delete using (auth.uid() = user_id);

-- Social drafts: users can CRUD their own
create policy "Users can view own drafts"
  on public.social_drafts for select using (auth.uid() = user_id);
create policy "Users can insert own drafts"
  on public.social_drafts for insert with check (auth.uid() = user_id);
create policy "Users can update own drafts"
  on public.social_drafts for update using (auth.uid() = user_id);
create policy "Users can delete own drafts"
  on public.social_drafts for delete using (auth.uid() = user_id);

-- Billing: users can view their own, only service role can write
create policy "Users can view own billing"
  on public.billing for select using (auth.uid() = user_id);

-- ── 6. STORAGE BUCKET for Vault uploads ─────────────────────
insert into storage.buckets (id, name, public)
values ('vault', 'vault', false)
on conflict do nothing;

create policy "Users can upload their own vault files"
  on storage.objects for insert
  with check (bucket_id = 'vault' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can read their own vault files"
  on storage.objects for select
  using (bucket_id = 'vault' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can delete their own vault files"
  on storage.objects for delete
  using (bucket_id = 'vault' and auth.uid()::text = (storage.foldername(name))[1]);
