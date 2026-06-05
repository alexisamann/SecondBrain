-- Initial Supabase schema for the Second Brain MVP.
-- Run this in the Supabase SQL Editor for the target project.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  email text
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (id = auth.uid());

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update
  set email = excluded.email;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create table if not exists public.thoughts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  transcript text not null,
  summary text,
  primary_topic text,
  explicit_topic text,
  inferred_topics text[] not null default '{}',
  type text,
  importance text,
  emotion text,
  key_points jsonb not null default '[]'::jsonb,
  people text[] not null default '{}',
  projects text[] not null default '{}',
  memory_worthy boolean not null default true,
  possible_future_reminder text,
  audio_url text,
  constraint thoughts_type_check
    check (type is null or type in ('thought', 'task', 'decision', 'question', 'idea', 'reminder', 'goal', 'reflection', 'other')),
  constraint thoughts_importance_check
    check (importance is null or importance in ('low', 'medium', 'high')),
  constraint thoughts_emotion_check
    check (emotion is null or emotion in ('positive', 'neutral', 'negative', 'mixed'))
);

drop trigger if exists set_thoughts_updated_at on public.thoughts;
create trigger set_thoughts_updated_at
before update on public.thoughts
for each row execute function public.set_updated_at();

alter table public.thoughts enable row level security;

drop policy if exists "thoughts_select_own" on public.thoughts;
create policy "thoughts_select_own"
on public.thoughts
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "thoughts_insert_own" on public.thoughts;
create policy "thoughts_insert_own"
on public.thoughts
for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "thoughts_update_own" on public.thoughts;
create policy "thoughts_update_own"
on public.thoughts
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "thoughts_delete_own" on public.thoughts;
create policy "thoughts_delete_own"
on public.thoughts
for delete
to authenticated
using (user_id = auth.uid());

create index if not exists thoughts_user_id_created_at_idx
on public.thoughts (user_id, created_at desc);

create index if not exists thoughts_user_id_primary_topic_idx
on public.thoughts (user_id, primary_topic);

create table if not exists public.extracted_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  thought_id uuid references public.thoughts(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  item_type text not null,
  title text not null,
  description text,
  status text not null default 'open',
  priority text,
  constraint extracted_items_item_type_check
    check (item_type in ('task', 'decision', 'question', 'idea', 'reminder', 'goal')),
  constraint extracted_items_status_check
    check (status in ('open', 'done', 'dismissed')),
  constraint extracted_items_priority_check
    check (priority is null or priority in ('low', 'medium', 'high'))
);

create or replace function public.validate_extracted_item_thought_owner()
returns trigger
language plpgsql
as $$
begin
  if new.thought_id is not null and not exists (
    select 1
    from public.thoughts
    where id = new.thought_id
      and user_id = new.user_id
  ) then
    raise exception 'thought_id must belong to the same user_id';
  end if;

  return new;
end;
$$;

drop trigger if exists validate_extracted_item_thought_owner on public.extracted_items;
create trigger validate_extracted_item_thought_owner
before insert or update on public.extracted_items
for each row execute function public.validate_extracted_item_thought_owner();

drop trigger if exists set_extracted_items_updated_at on public.extracted_items;
create trigger set_extracted_items_updated_at
before update on public.extracted_items
for each row execute function public.set_updated_at();

alter table public.extracted_items enable row level security;

drop policy if exists "extracted_items_select_own" on public.extracted_items;
create policy "extracted_items_select_own"
on public.extracted_items
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "extracted_items_insert_own" on public.extracted_items;
create policy "extracted_items_insert_own"
on public.extracted_items
for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "extracted_items_update_own" on public.extracted_items;
create policy "extracted_items_update_own"
on public.extracted_items
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "extracted_items_delete_own" on public.extracted_items;
create policy "extracted_items_delete_own"
on public.extracted_items
for delete
to authenticated
using (user_id = auth.uid());

create index if not exists extracted_items_user_id_status_idx
on public.extracted_items (user_id, status);

create index if not exists extracted_items_user_id_item_type_idx
on public.extracted_items (user_id, item_type);

create table if not exists public.weekly_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  week_start date not null,
  week_end date not null,
  summary text,
  recurring_topics jsonb not null default '[]'::jsonb,
  open_loops jsonb not null default '[]'::jsonb,
  next_steps jsonb not null default '[]'::jsonb,
  raw_result jsonb not null default '{}'::jsonb,
  constraint weekly_reviews_week_range_check
    check (week_end >= week_start)
);

alter table public.weekly_reviews enable row level security;

drop policy if exists "weekly_reviews_select_own" on public.weekly_reviews;
create policy "weekly_reviews_select_own"
on public.weekly_reviews
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "weekly_reviews_insert_own" on public.weekly_reviews;
create policy "weekly_reviews_insert_own"
on public.weekly_reviews
for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "weekly_reviews_update_own" on public.weekly_reviews;
create policy "weekly_reviews_update_own"
on public.weekly_reviews
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "weekly_reviews_delete_own" on public.weekly_reviews;
create policy "weekly_reviews_delete_own"
on public.weekly_reviews
for delete
to authenticated
using (user_id = auth.uid());

create index if not exists weekly_reviews_user_id_week_range_idx
on public.weekly_reviews (user_id, week_start, week_end);
