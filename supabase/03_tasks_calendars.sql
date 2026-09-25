-- ============================================================
-- useFriendly.io — task-uri și calendare de programări
-- Se rulează în Supabase → SQL Editor → New query, după 01_schema.sql.
-- Poate fi rulat din nou fără probleme.
-- ============================================================

-- ------------------------------------------------------------
-- 1. CATEGORII DE TASK-URI
-- ------------------------------------------------------------

create table if not exists public.task_categories (
  id          text primary key,
  name        text not null,
  color       text not null default '#2f6bff',
  position    integer not null default 0,
  created_at  timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 2. TASK-URI
--    Câmpurile urmăresc interfața Task din src/data/tasks.ts.
-- ------------------------------------------------------------

create table if not exists public.tasks (
  id               text primary key,
  category_id      text references public.task_categories (id) on delete set null,
  title            text not null default '',
  detail           text not null default '',
  deadline         text not null default '',
  time             text not null default '',
  status           text not null default 'Urmează să înceapă',
  alarm            boolean not null default false,
  recurrence       text,
  recurrence_time  text not null default '',
  team             boolean not null default false,
  -- numele sub-accountului care și-a creat singur task-ul; gol = task de admin
  owner            text not null default '',
  assigned_today   boolean not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists tasks_owner_idx    on public.tasks (owner);
create index if not exists tasks_category_idx on public.tasks (category_id);
create index if not exists tasks_status_idx   on public.tasks (status);

drop trigger if exists tasks_touch_updated_at on public.tasks;
create trigger tasks_touch_updated_at
  before update on public.tasks
  for each row execute function public.touch_updated_at();

-- ------------------------------------------------------------
-- 3. CINE E ATRIBUIT PE TASK (task-uri de echipă)
-- ------------------------------------------------------------

create table if not exists public.task_assignees (
  task_id     text not null references public.tasks (id) on delete cascade,
  name        text not null,
  role        text not null default '',
  done        boolean not null default false,
  primary key (task_id, name)
);

create index if not exists task_assignees_name_idx on public.task_assignees (name);

-- ------------------------------------------------------------
-- 4. CALENDARE DE PROGRAMĂRI
-- ------------------------------------------------------------

create table if not exists public.booking_calendars (
  id          text primary key,
  name        text not null default '',
  purpose     text not null default '',
  duration    integer not null default 30,
  location    text not null default '',
  type        text not null default 'One-on-One',
  days        text not null default '',
  color       text not null default '#2f6bff',
  active      boolean not null default true,
  host        text not null default '',
  initials    text not null default '',
  owner       text not null default '',
  position    integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists booking_calendars_host_idx  on public.booking_calendars (host);
create index if not exists booking_calendars_owner_idx on public.booking_calendars (owner);

drop trigger if exists booking_calendars_touch_updated_at on public.booking_calendars;
create trigger booking_calendars_touch_updated_at
  before update on public.booking_calendars
  for each row execute function public.touch_updated_at();

create table if not exists public.calendar_members (
  calendar_id text not null references public.booking_calendars (id) on delete cascade,
  name        text not null,
  role        text not null default '',
  connected   boolean not null default false,
  primary key (calendar_id, name)
);

create index if not exists calendar_members_name_idx on public.calendar_members (name);

-- ------------------------------------------------------------
-- 5. DISPONIBILITATE (orele de lucru pe zile, per persoană)
-- ------------------------------------------------------------

create table if not exists public.availability (
  person   text not null,
  day      text not null,
  enabled  boolean not null default true,
  from_at  text not null default '09:00',
  to_at    text not null default '18:00',
  primary key (person, day)
);

-- ============================================================
-- 6. SECURITATE (RLS)
--
-- Funcțiile de mai jos sunt „security definer": ele citesc tabelele
-- ocolind RLS. Fără ele, politica de pe `tasks` ar întreba de
-- `task_assignees`, care ar întreba înapoi de `tasks` — și Postgres
-- ar intra în buclă.
-- ============================================================

create or replace function public.is_task_assignee(p_task_id text)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.task_assignees a
    where a.task_id = p_task_id and a.name = public.my_name()
  );
$$;

create or replace function public.task_owner_name(p_task_id text)
returns text
language sql stable security definer set search_path = public
as $$
  select owner from public.tasks where id = p_task_id;
$$;

create or replace function public.is_calendar_member(p_calendar_id text)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.calendar_members m
    where m.calendar_id = p_calendar_id and m.name = public.my_name()
  );
$$;

create or replace function public.calendar_people(p_calendar_id text)
returns table (host text, owner text)
language sql stable security definer set search_path = public
as $$
  select host, owner from public.booking_calendars where id = p_calendar_id;
$$;

alter table public.task_categories   enable row level security;
alter table public.tasks             enable row level security;
alter table public.task_assignees    enable row level security;
alter table public.booking_calendars enable row level security;
alter table public.calendar_members  enable row level security;
alter table public.availability      enable row level security;

-- --- categorii: toată lumea le vede, doar staff le schimbă ---
drop policy if exists "categories readable" on public.task_categories;
create policy "categories readable"
  on public.task_categories for select to authenticated using (true);

drop policy if exists "categories writable by staff" on public.task_categories;
create policy "categories writable by staff"
  on public.task_categories for all to authenticated
  using (public.is_staff()) with check (public.is_staff());

-- --- task-uri ---
-- Un agent vede task-urile pe care și le-a creat și pe cele de echipă
-- în care e trecut. Staff vede tot.
drop policy if exists "tasks visible to staff owner or assignee" on public.tasks;
create policy "tasks visible to staff owner or assignee"
  on public.tasks for select to authenticated
  using (
    public.is_staff()
    or owner = public.my_name()
    or public.is_task_assignee(id)
  );

drop policy if exists "tasks insertable" on public.tasks;
create policy "tasks insertable"
  on public.tasks for insert to authenticated
  with check (public.is_staff() or owner = public.my_name());

drop policy if exists "tasks updatable by staff owner or assignee" on public.tasks;
create policy "tasks updatable by staff owner or assignee"
  on public.tasks for update to authenticated
  using (
    public.is_staff()
    or owner = public.my_name()
    or public.is_task_assignee(id)
  )
  with check (
    public.is_staff()
    or owner = public.my_name()
    or public.is_task_assignee(id)
  );

drop policy if exists "tasks deletable by staff or owner" on public.tasks;
create policy "tasks deletable by staff or owner"
  on public.tasks for delete to authenticated
  using (public.is_staff() or owner = public.my_name());

-- --- persoanele atribuite ---
-- Fiecare își poate bifa propriul rând; staff și autorul task-ului văd tot.
drop policy if exists "assignees visible" on public.task_assignees;
create policy "assignees visible"
  on public.task_assignees for select to authenticated
  using (
    public.is_staff()
    or name = public.my_name()
    or public.task_owner_name(task_id) = public.my_name()
  );

drop policy if exists "assignees writable" on public.task_assignees;
create policy "assignees writable"
  on public.task_assignees for all to authenticated
  using (
    public.is_staff()
    or name = public.my_name()
    or public.task_owner_name(task_id) = public.my_name()
  )
  with check (
    public.is_staff()
    or name = public.my_name()
    or public.task_owner_name(task_id) = public.my_name()
  );

-- --- calendare ---
drop policy if exists "calendars visible" on public.booking_calendars;
create policy "calendars visible"
  on public.booking_calendars for select to authenticated
  using (
    public.is_staff()
    or host = public.my_name()
    or owner = public.my_name()
    or public.is_calendar_member(id)
  );

drop policy if exists "calendars writable by staff host or owner" on public.booking_calendars;
create policy "calendars writable by staff host or owner"
  on public.booking_calendars for all to authenticated
  using (public.is_staff() or host = public.my_name() or owner = public.my_name())
  with check (public.is_staff() or host = public.my_name() or owner = public.my_name());

drop policy if exists "calendar members visible" on public.calendar_members;
create policy "calendar members visible"
  on public.calendar_members for select to authenticated
  using (
    public.is_staff()
    or name = public.my_name()
    or exists (
      select 1 from public.calendar_people(calendar_id) p
      where p.host = public.my_name() or p.owner = public.my_name()
    )
  );

drop policy if exists "calendar members writable" on public.calendar_members;
create policy "calendar members writable"
  on public.calendar_members for all to authenticated
  using (
    public.is_staff()
    or name = public.my_name()
    or exists (
      select 1 from public.calendar_people(calendar_id) p
      where p.host = public.my_name() or p.owner = public.my_name()
    )
  )
  with check (
    public.is_staff()
    or name = public.my_name()
    or exists (
      select 1 from public.calendar_people(calendar_id) p
      where p.host = public.my_name() or p.owner = public.my_name()
    )
  );

-- --- disponibilitate: fiecare pe a lui, staff pe toate ---
drop policy if exists "availability visible" on public.availability;
create policy "availability visible"
  on public.availability for select to authenticated
  using (public.is_staff() or person = public.my_name());

drop policy if exists "availability writable" on public.availability;
create policy "availability writable"
  on public.availability for all to authenticated
  using (public.is_staff() or person = public.my_name())
  with check (public.is_staff() or person = public.my_name());

-- ============================================================
-- GATA. În Table Editor trebuie să apară 6 tabele noi, fiecare cu
-- eticheta verde "RLS enabled":
--   task_categories, tasks, task_assignees,
--   booking_calendars, calendar_members, availability
-- ============================================================
