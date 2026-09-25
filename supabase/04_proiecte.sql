-- ============================================================
-- useFriendly.io — proiectele din tabelul de pe panoul general
-- Se rulează după 01 și 03. Poate fi rulat de mai multe ori.
-- ============================================================

create table if not exists public.projects (
  id          text primary key,
  name        text not null default '',
  client      text not null default '',
  owner       text not null default '',
  stage       text not null default 'Ofertare',
  value       text not null default '',
  progress    integer not null default 0,
  due         text not null default '',
  tasks       text not null default '',
  position    integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists projects_owner_idx on public.projects (owner);
create index if not exists projects_stage_idx on public.projects (stage);

drop trigger if exists projects_touch_updated_at on public.projects;
create trigger projects_touch_updated_at
  before update on public.projects
  for each row execute function public.touch_updated_at();

alter table public.projects enable row level security;

-- Staff vede toate proiectele; un agent le vede pe cele unde e responsabil.
drop policy if exists "projects visible" on public.projects;
create policy "projects visible"
  on public.projects for select to authenticated
  using (public.is_staff() or owner = public.my_name());

drop policy if exists "projects writable" on public.projects;
create policy "projects writable"
  on public.projects for all to authenticated
  using (public.is_staff() or owner = public.my_name())
  with check (public.is_staff() or owner = public.my_name());

-- ============================================================
-- GATA. În Table Editor trebuie să apară tabelul `projects`
-- cu eticheta verde "RLS enabled".
-- ============================================================
