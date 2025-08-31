// =============================================================
// File: /db/journal.sql (optional helper – run once)
// Purpose: Minimal schema + RLS
// =============================================================
/*
create table if not exists public.journal (
id uuid primary key default gen_random_uuid(),
user_id uuid not null references auth.users(id) on delete cascade,
content text not null,
created_at timestamptz not null default now()
);


alter table public.journal enable row level security;


create policy "journal owners can read" on public.journal
for select using ( auth.uid() = user_id );


create policy "journal owners can insert" on public.journal
for insert with check ( auth.uid() = user_id );
*/