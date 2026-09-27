-- ============================================================
-- 05 — Restul modulelor, salvate în baza de date
--
-- Ce rezolvă: până acum rezervările, mesajele, materialele,
-- paginile, funnel-urile, fluxurile de marketing, produsele,
-- linkurile de plată și automatizările trăiau doar în memoria
-- browserului. Adică: le construiai, dădeai refresh, dispăreau.
--
-- Două forme de stocare, alese pe bune, nu la întâmplare:
--
--  1. Tabele normale (bookings, team_messages) — pentru lucrurile
--     pe care le căutăm, le filtrăm și le numărăm: „ce programări
--     am săptămâna asta", „ce mesaje necitite are Ana".
--
--  2. O singură masă de documente (collections) — pentru lucrurile
--     pe care doar le deschizi și le editezi ca pe un fișier: o
--     pagină din web builder, un funnel, un flux de email, un curs.
--     Structura lor e adâncă (o pagină are secțiuni, care au
--     row-uri, care au elemente, fiecare cu zeci de setări de
--     stil). Normalizată, ar însemna vreo 20 de tabele și o grămadă
--     de cod care nu ne aduce nimic: nu interogăm niciodată „toate
--     butoanele roșii din toate paginile". Așa că le ținem întregi,
--     ca jsonb, cu un `kind` care spune ce fel de document e.
--
-- De rulat în Supabase → SQL Editor, o singură dată.
-- Se poate rula de mai multe ori fără să strice nimic.
-- ============================================================

-- ------------------------------------------------------------
-- 1. Rezervările din calendare
-- ------------------------------------------------------------
create table if not exists public.bookings (
  id           text primary key,
  calendar_id  text not null references public.booking_calendars (id) on delete cascade,
  -- Numele omului din echipă care ține întâlnirea
  owner        text not null default '',
  lead_name    text not null default '',
  phone        text not null default '',
  email        text not null default '',
  -- Data, ca „2026-09-27”, ca să se poată sorta și filtra
  booking_date date,
  booking_time text not null default '',
  -- Răspunsurile la întrebările puse la rezervare
  fields       jsonb not null default '[]'::jsonb,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists bookings_calendar_idx on public.bookings (calendar_id);
create index if not exists bookings_date_idx on public.bookings (booking_date);

drop trigger if exists bookings_touch on public.bookings;
create trigger bookings_touch
before update on public.bookings
for each row execute function public.touch_updated_at();

-- ------------------------------------------------------------
-- 2. Mesajele dintre oamenii din echipă
--
-- `recipients` și `read_by` sunt liste de nume, ca în restul
-- aplicației. Un mesaj e „citit” pentru cine apare în read_by.
-- ------------------------------------------------------------
create table if not exists public.team_messages (
  id          text primary key,
  sender      text not null default '',
  recipients  text[] not null default '{}',
  body        text not null default '',
  -- Ora afișată în interfață, exact cum a fost scrisă
  sent_label  text not null default '',
  read_by     text[] not null default '{}',
  created_at  timestamptz not null default now()
);

create index if not exists team_messages_created_idx
  on public.team_messages (created_at desc);

-- ------------------------------------------------------------
-- 3. Documentele modulelor (pagini, funnel-uri, fluxuri, cursuri…)
-- ------------------------------------------------------------
create table if not exists public.collections (
  id         text primary key,
  -- 'web_page' | 'funnel' | 'marketing_flow' | 'product'
  -- | 'payment_link' | 'automation' | 'course'
  kind       text not null,
  -- Cine l-a creat; gol = al contului, nu al unei persoane anume
  owner      text not null default '',
  -- Documentul întreg, exact în forma pe care o folosește aplicația
  data       jsonb not null default '{}'::jsonb,
  -- Ordinea în listă, ca să nu se amestece la fiecare încărcare
  position   integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists collections_kind_idx on public.collections (kind, position);

drop trigger if exists collections_touch on public.collections;
create trigger collections_touch
before update on public.collections
for each row execute function public.touch_updated_at();

-- ------------------------------------------------------------
-- 4. Cine are voie la ce
--
-- Regula, pe scurt: trebuie să ai cont ca să vezi ceva. Peste asta,
-- adminii și managerii („staff”) pot modifica orice; ceilalți pot
-- modifica doar ce îi privește.
-- ------------------------------------------------------------
alter table public.bookings       enable row level security;
alter table public.team_messages  enable row level security;
alter table public.collections    enable row level security;

-- --- Rezervări: staff vede tot; un agent vede ce ține el sau ce e
-- --- pe un calendar din care face parte.
drop policy if exists "bookings visible to staff or owner" on public.bookings;
create policy "bookings visible to staff or owner"
on public.bookings for select
to authenticated
using (
  public.is_staff()
  or owner = public.my_name()
  or public.is_calendar_member(calendar_id)
);

drop policy if exists "bookings writable by staff or owner" on public.bookings;
create policy "bookings writable by staff or owner"
on public.bookings for insert
to authenticated
with check (
  public.is_staff()
  or owner = public.my_name()
  or public.is_calendar_member(calendar_id)
);

drop policy if exists "bookings updatable by staff or owner" on public.bookings;
create policy "bookings updatable by staff or owner"
on public.bookings for update
to authenticated
using (
  public.is_staff()
  or owner = public.my_name()
  or public.is_calendar_member(calendar_id)
)
with check (
  public.is_staff()
  or owner = public.my_name()
  or public.is_calendar_member(calendar_id)
);

drop policy if exists "bookings deletable by staff" on public.bookings;
create policy "bookings deletable by staff"
on public.bookings for delete
to authenticated
using (public.is_staff() or owner = public.my_name());

-- --- Mesaje: le vezi dacă le-ai trimis tu sau dacă ești printre
-- --- destinatari. Staff-ul le vede pe toate.
drop policy if exists "messages visible to sender or recipient" on public.team_messages;
create policy "messages visible to sender or recipient"
on public.team_messages for select
to authenticated
using (
  public.is_staff()
  or sender = public.my_name()
  or public.my_name() = any (recipients)
);

drop policy if exists "messages insertable by sender" on public.team_messages;
create policy "messages insertable by sender"
on public.team_messages for insert
to authenticated
with check (public.is_staff() or sender = public.my_name());

-- Un destinatar are voie să marcheze mesajul ca citit — adică să
-- schimbe read_by. Restul câmpurilor nu se modifică din aplicație.
drop policy if exists "messages updatable by participants" on public.team_messages;
create policy "messages updatable by participants"
on public.team_messages for update
to authenticated
using (
  public.is_staff()
  or sender = public.my_name()
  or public.my_name() = any (recipients)
)
with check (
  public.is_staff()
  or sender = public.my_name()
  or public.my_name() = any (recipients)
);

drop policy if exists "messages deletable by staff" on public.team_messages;
create policy "messages deletable by staff"
on public.team_messages for delete
to authenticated
using (public.is_staff() or sender = public.my_name());

-- --- Documentele modulelor: oricine are cont le citește (accesul
-- --- fin, de pildă cine vede un curs, se face în aplicație pe baza
-- --- listei de acces din document). Scrie doar staff-ul sau cel
-- --- care l-a creat.
drop policy if exists "collections readable by authenticated" on public.collections;
create policy "collections readable by authenticated"
on public.collections for select
to authenticated
using (true);

drop policy if exists "collections insertable by staff or owner" on public.collections;
create policy "collections insertable by staff or owner"
on public.collections for insert
to authenticated
with check (public.is_staff() or owner = public.my_name());

drop policy if exists "collections updatable by staff or owner" on public.collections;
create policy "collections updatable by staff or owner"
on public.collections for update
to authenticated
using (public.is_staff() or owner = public.my_name())
with check (public.is_staff() or owner = public.my_name());

drop policy if exists "collections deletable by staff or owner" on public.collections;
create policy "collections deletable by staff or owner"
on public.collections for delete
to authenticated
using (public.is_staff() or owner = public.my_name());

-- ------------------------------------------------------------
-- 5. Fișiere: documentele de la leaduri și resursele de curs
--
-- Până acum se salva doar numele fișierului — fișierul în sine se
-- pierdea. Bucket-ul de mai jos e privat: nimeni nu ajunge la el
-- cu un link ghicit, doar prin aplicație, logat.
--
-- Video-urile de curs NU intră aici: stau pe YouTube nelistat sau
-- Vimeo. Un singur video de curs ar consuma tot spațiul gratuit.
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit)
values ('documents', 'documents', false, 26214400)
on conflict (id) do update
  set public = false,
      file_size_limit = 26214400;

drop policy if exists "documents readable by authenticated" on storage.objects;
create policy "documents readable by authenticated"
on storage.objects for select
to authenticated
using (bucket_id = 'documents');

drop policy if exists "documents uploadable by authenticated" on storage.objects;
create policy "documents uploadable by authenticated"
on storage.objects for insert
to authenticated
with check (bucket_id = 'documents');

drop policy if exists "documents replaceable by authenticated" on storage.objects;
create policy "documents replaceable by authenticated"
on storage.objects for update
to authenticated
using (bucket_id = 'documents')
with check (bucket_id = 'documents');

drop policy if exists "documents deletable by staff" on storage.objects;
create policy "documents deletable by staff"
on storage.objects for delete
to authenticated
using (bucket_id = 'documents' and public.is_staff());

-- ------------------------------------------------------------
-- 6. Verificare: ce s-a creat
-- ------------------------------------------------------------
select
  c.relname as tabel,
  c.relrowsecurity as are_rls,
  (select count(*) from pg_policies p
    where p.schemaname = 'public' and p.tablename = c.relname) as politici
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relkind = 'r'
  and c.relname in ('bookings', 'team_messages', 'collections')
order by c.relname;
