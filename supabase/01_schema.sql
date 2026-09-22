-- ============================================================
-- useFriendly.io — schema de bază (profiluri, liste, leaduri)
-- Se rulează O SINGURĂ DATĂ, în Supabase → SQL Editor → New query.
-- Poate fi rulat din nou fără probleme: totul e "if not exists".
-- ============================================================

-- ------------------------------------------------------------
-- 1. PROFILURI
--    Fiecare cont creat în Supabase Auth primește automat un rând aici.
--    Rolul decide ce vede omul în CRM.
-- ------------------------------------------------------------

do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type user_role as enum (
      'admin',      -- tu: vede și schimbă tot
      'manager',    -- vede toate leadurile echipei
      'closer',
      'caller',
      'marketer'
    );
  end if;
end $$;

create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text not null,
  role        user_role not null default 'caller',
  color       text,
  created_at  timestamptz not null default now()
);

-- Numele complet e cheia de legătură cu restul aplicației:
-- în cod, leadurile sunt atribuite după nume ("Vlad Ionescu"), nu după id.
create unique index if not exists profiles_full_name_key
  on public.profiles (full_name);

-- La fiecare înregistrare nouă, creăm profilul automat.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    coalesce((new.raw_user_meta_data ->> 'role')::user_role, 'caller')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ------------------------------------------------------------
-- 2. FUNCȚII AJUTĂTOARE
--    Le folosim în politicile de securitate de mai jos.
--    Sunt "security definer" ca să nu intre în recursivitate cu RLS.
-- ------------------------------------------------------------

create or replace function public.my_role()
returns user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.my_name()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select full_name from public.profiles where id = auth.uid();
$$;

-- Admin și manager văd tot.
create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.my_role() in ('admin', 'manager'), false);
$$;

-- ------------------------------------------------------------
-- 3. LISTE DE LEADURI
-- ------------------------------------------------------------

create table if not exists public.lead_lists (
  id          text primary key,
  name        text not null,
  detail      text not null default '',
  color       text not null default '#2f6bff',
  access      text[] not null default '{}',   -- nume complete care au acces
  indexed     boolean not null default false,
  position    integer not null default 0,
  created_at  timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 4. LEADURI
--    Câmpurile urmăresc exact interfața Lead din src/data/leads.ts,
--    ca să nu fie nevoie de modificări în cele 154 de fișiere existente.
-- ------------------------------------------------------------

create table if not exists public.leads (
  id                text primary key,
  list_id           text not null references public.lead_lists (id) on delete cascade,
  owner             text not null default 'Neatribuit',
  caller            text not null default '',
  first_name        text not null default '',
  last_name         text not null default '',
  phone             text not null default '',
  email             text not null default '',
  details           text not null default '',
  vocaroo_link      text not null default '',
  zoom_link         text not null default '',
  status            text not null default 'Înscris webinar',
  added_on          text not null default '',
  paid_amount       numeric not null default 0,
  generated_amount  numeric not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists leads_list_id_idx on public.leads (list_id);
create index if not exists leads_owner_idx   on public.leads (owner);
create index if not exists leads_caller_idx  on public.leads (caller);
create index if not exists leads_status_idx  on public.leads (status);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists leads_touch_updated_at on public.leads;
create trigger leads_touch_updated_at
  before update on public.leads
  for each row execute function public.touch_updated_at();

-- ------------------------------------------------------------
-- 5. PLĂȚI ȘI DOCUMENTE
-- ------------------------------------------------------------

create table if not exists public.lead_payments (
  id          text primary key,
  lead_id     text not null references public.leads (id) on delete cascade,
  amount      numeric not null default 0,
  added_on    text not null default '',
  created_at  timestamptz not null default now()
);

create index if not exists lead_payments_lead_id_idx on public.lead_payments (lead_id);

create table if not exists public.lead_documents (
  id          text primary key,
  lead_id     text not null references public.leads (id) on delete cascade,
  file_name   text not null,
  type        text not null,
  added_on    text not null default '',
  url         text,
  created_at  timestamptz not null default now()
);

create index if not exists lead_documents_lead_id_idx on public.lead_documents (lead_id);

-- ============================================================
-- 6. SECURITATE (RLS)
--    FĂRĂ partea asta, oricine deschide consola browserului
--    poate citi toată baza de date cu cheia publică anon.
-- ============================================================

alter table public.profiles       enable row level security;
alter table public.lead_lists     enable row level security;
alter table public.leads          enable row level security;
alter table public.lead_payments  enable row level security;
alter table public.lead_documents enable row level security;

-- --- profiles -------------------------------------------------
drop policy if exists "profiles readable by authenticated" on public.profiles;
create policy "profiles readable by authenticated"
  on public.profiles for select
  to authenticated
  using (true);

drop policy if exists "profiles updatable by self or staff" on public.profiles;
create policy "profiles updatable by self or staff"
  on public.profiles for update
  to authenticated
  using (id = auth.uid() or public.is_staff())
  with check (id = auth.uid() or public.is_staff());

drop policy if exists "profiles insertable by staff" on public.profiles;
create policy "profiles insertable by staff"
  on public.profiles for insert
  to authenticated
  with check (public.is_staff());

-- --- lead_lists -----------------------------------------------
-- Staff vede toate listele; restul doar listele în care sunt trecuți la "access".
drop policy if exists "lists visible to staff or members" on public.lead_lists;
create policy "lists visible to staff or members"
  on public.lead_lists for select
  to authenticated
  using (public.is_staff() or public.my_name() = any (access));

drop policy if exists "lists writable by staff" on public.lead_lists;
create policy "lists writable by staff"
  on public.lead_lists for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

-- --- leads ----------------------------------------------------
-- Un agent vede doar leadurile lui (ca owner sau ca caller).
drop policy if exists "leads visible to staff or assignee" on public.leads;
create policy "leads visible to staff or assignee"
  on public.leads for select
  to authenticated
  using (
    public.is_staff()
    or owner  = public.my_name()
    or caller = public.my_name()
  );

drop policy if exists "leads insertable by staff or assignee" on public.leads;
create policy "leads insertable by staff or assignee"
  on public.leads for insert
  to authenticated
  with check (
    public.is_staff()
    or owner  = public.my_name()
    or caller = public.my_name()
  );

drop policy if exists "leads updatable by staff or assignee" on public.leads;
create policy "leads updatable by staff or assignee"
  on public.leads for update
  to authenticated
  using (
    public.is_staff()
    or owner  = public.my_name()
    or caller = public.my_name()
  )
  with check (
    public.is_staff()
    or owner  = public.my_name()
    or caller = public.my_name()
  );

-- Ștergerea rămâne doar la admin și manager.
drop policy if exists "leads deletable by staff" on public.leads;
create policy "leads deletable by staff"
  on public.leads for delete
  to authenticated
  using (public.is_staff());

-- --- lead_payments și lead_documents --------------------------
-- Urmează accesul la leadul părinte.
drop policy if exists "payments follow lead access" on public.lead_payments;
create policy "payments follow lead access"
  on public.lead_payments for all
  to authenticated
  using (
    exists (
      select 1 from public.leads l
      where l.id = lead_id
        and (public.is_staff() or l.owner = public.my_name() or l.caller = public.my_name())
    )
  )
  with check (
    exists (
      select 1 from public.leads l
      where l.id = lead_id
        and (public.is_staff() or l.owner = public.my_name() or l.caller = public.my_name())
    )
  );

drop policy if exists "documents follow lead access" on public.lead_documents;
create policy "documents follow lead access"
  on public.lead_documents for all
  to authenticated
  using (
    exists (
      select 1 from public.leads l
      where l.id = lead_id
        and (public.is_staff() or l.owner = public.my_name() or l.caller = public.my_name())
    )
  )
  with check (
    exists (
      select 1 from public.leads l
      where l.id = lead_id
        and (public.is_staff() or l.owner = public.my_name() or l.caller = public.my_name())
    )
  );

-- ============================================================
-- GATA. Verifică în Supabase → Table Editor că apar cele 5 tabele
-- și că fiecare are eticheta verde "RLS enabled".
-- ============================================================
