-- ============================================================
-- 08 — Automatizări care chiar rulează
--
-- Până acum modulul „Automatizări" era o machetă: arăta fluxuri,
-- cifre și activitate, dar nu salva nimic și nu executa nimic.
--
-- De ce logica stă aici, în baza de date, și nu în aplicație:
-- o automatizare trebuie să se întâmple și la 3 noaptea, când nu e
-- nimeni logat. Dacă ar rula în browser, s-ar executa doar cât timp
-- cineva ține pagina deschisă — și de două ori dacă o țin doi oameni.
--
-- Două feluri de declanșatori:
--   1. „a intrat un lead nou în lista X" — imediat, printr-un trigger
--      pe tabelul de leaduri
--   2. „un lead stă de N zile fără mișcare" — verificat periodic de
--      pg_cron, ceasul din Postgres
--
-- De rulat în Supabase → SQL Editor, o singură dată.
-- Se poate rula de mai multe ori fără să strice nimic.
-- ============================================================

-- ------------------------------------------------------------
-- 1. Regulile
-- ------------------------------------------------------------
create table if not exists public.automations (
  id            text primary key,
  name          text not null default '',
  active        boolean not null default true,

  -- 'lead_added_to_list' | 'lead_idle'
  trigger_kind  text not null,

  -- pentru 'lead_added_to_list': lista urmărită (gol = orice listă)
  trigger_list_id text not null default '',

  -- pentru 'lead_idle': după câte zile fără nicio modificare,
  -- și opțional doar pentru leadurile aflate într-un anumit status
  trigger_days    integer not null default 3,
  trigger_status  text not null default '',

  -- Ce se întâmplă, în ordine. Fiecare element are forma:
  --   {"kind":"assign","field":"owner"|"caller",
  --    "mode":"person"|"balanced","name":"Ion Pop","role":"caller"}
  --   {"kind":"set_status","status":"Programat apel"}
  --   {"kind":"move_list","list_id":"list-..."}
  --   {"kind":"create_task","title":"...","assignee":"owner"|"caller"|"<nume>",
  --    "due_days":2}
  actions       jsonb not null default '[]'::jsonb,

  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

drop trigger if exists automations_touch on public.automations;
create trigger automations_touch
before update on public.automations
for each row execute function public.touch_updated_at();

-- ------------------------------------------------------------
-- 2. Jurnalul: ce a rulat, când și cu ce rezultat
--
-- Fără el, o automatizare e o cutie neagră: nu poți ști dacă a mers,
-- dacă a sărit peste ceva sau dacă a stricat ceva. Tot el ține minte
-- ce lead a fost deja prelucrat, ca o regulă de tip „stă de 3 zile"
-- să nu se declanșeze din oră în oră pe același lead.
-- ------------------------------------------------------------
create table if not exists public.automation_runs (
  id            bigserial primary key,
  automation_id text not null,
  lead_id       text not null default '',
  -- Ce s-a făcut, scris pe înțelesul omului
  summary       text not null default '',
  status        text not null default 'ok',   -- 'ok' | 'eroare'
  detail        text not null default '',
  ran_at        timestamptz not null default now()
);

create index if not exists automation_runs_recent_idx
  on public.automation_runs (ran_at desc);
create index if not exists automation_runs_pair_idx
  on public.automation_runs (automation_id, lead_id, ran_at desc);

-- ------------------------------------------------------------
-- 3. Ajutoare
-- ------------------------------------------------------------

/* Data în forma folosită în interfață: „13 oct 2026” */
create or replace function public.ro_date(d date)
returns text
language sql
immutable
as $$
  select (extract(day from d)::int)::text || ' ' ||
         (array['ian','feb','mar','apr','mai','iun',
                'iul','aug','sep','oct','noi','dec'])[extract(month from d)::int]
         || ' ' || (extract(year from d)::int)::text;
$$;

/*
 * Omul cu cele mai puține leaduri dintr-un rol dat — așa se împart
 * echilibrat, fără să ținem un contor care se poate desincroniza.
 * `p_field` e 'owner' sau 'caller'.
 */
create or replace function public.least_loaded_person(p_role text, p_field text)
returns text
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  winner text;
begin
  if p_field = 'caller' then
    select p.full_name into winner
    from public.profiles p
    left join public.leads l on l.caller = p.full_name
    where p.role::text = p_role
    group by p.full_name
    order by count(l.id) asc, p.full_name asc
    limit 1;
  else
    select p.full_name into winner
    from public.profiles p
    left join public.leads l on l.owner = p.full_name
    where p.role::text = p_role
    group by p.full_name
    order by count(l.id) asc, p.full_name asc
    limit 1;
  end if;

  return winner;
end;
$$;

-- ------------------------------------------------------------
-- 4. Executarea acțiunilor
--
-- `app.automation` e steagul care oprește reacțiile în lanț: dacă o
-- acțiune mută leadul în altă listă, trigger-ul de „lead nou în listă"
-- nu trebuie să pornească o a doua rundă.
-- ------------------------------------------------------------
create or replace function public.apply_automation(
  p_automation public.automations,
  p_lead_id text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  -- `done` adună ce s-a făcut, pentru jurnal. Mesajele fixe se adaugă
  -- cu ::text explicit: fără el, Postgres crede că adaugi o listă la o
  -- listă și dă „malformed array literal".
  act        jsonb;
  lead_row   public.leads;
  done       text[] := '{}';
  person     text;
  field      text;
  new_task   text;
  assignee   text;
  due        text;
begin
  select * into lead_row from public.leads where id = p_lead_id;
  if not found then
    return;
  end if;

  perform set_config('app.automation', 'on', true);

  for act in select * from jsonb_array_elements(p_automation.actions)
  loop
    begin
      case act->>'kind'

      when 'assign' then
        field := coalesce(act->>'field', 'owner');
        if coalesce(act->>'mode', 'person') = 'balanced' then
          person := public.least_loaded_person(
            coalesce(act->>'role', 'caller'), field);
        else
          person := act->>'name';
        end if;

        if person is null or person = '' then
          done := done || 'n-am găsit pe cine să atribui'::text;
        elsif field = 'caller' then
          update public.leads set caller = person where id = p_lead_id;
          done := done || ('caller: ' || person);
        else
          update public.leads set owner = person where id = p_lead_id;
          done := done || ('responsabil: ' || person);
        end if;

      when 'set_status' then
        if coalesce(act->>'status', '') <> '' then
          update public.leads set status = act->>'status' where id = p_lead_id;
          done := done || ('status: ' || (act->>'status'));
        end if;

      when 'move_list' then
        if exists (select 1 from public.lead_lists where id = act->>'list_id') then
          update public.leads set list_id = act->>'list_id' where id = p_lead_id;
          done := done || ('mutat în: ' ||
            (select name from public.lead_lists where id = act->>'list_id'));
        else
          done := done || 'lista nu mai există'::text;
        end if;

      when 'create_task' then
        -- Responsabilul task-ului: omul leadului, sau un nume fix
        select owner, caller into lead_row.owner, lead_row.caller
        from public.leads where id = p_lead_id;

        assignee := case act->>'assignee'
          when 'owner'  then lead_row.owner
          when 'caller' then lead_row.caller
          else act->>'assignee'
        end;

        if assignee is null or assignee = '' or assignee = 'Neatribuit' then
          done := done || 'task nefăcut: leadul n-are responsabil'::text;
        else
          new_task := 'task-' || replace(gen_random_uuid()::text, '-', '');
          due := public.ro_date(
            (now() + make_interval(days => coalesce((act->>'due_days')::int, 0)))::date);

          insert into public.tasks (id, title, detail, deadline, status, team, assigned_today)
          values (
            new_task,
            coalesce(act->>'title', 'Task automat'),
            'Creat automat de „' || p_automation.name || '" pentru ' ||
              coalesce(lead_row.first_name, '') || ' ' || coalesce(lead_row.last_name, ''),
            due,
            'Urmează să înceapă',
            true,
            true
          );

          insert into public.task_assignees (task_id, name, role, done)
          values (new_task, assignee, '', false)
          on conflict do nothing;

          done := done || ('task pentru ' || assignee || ', termen ' || due);
        end if;

      else
        done := done || ('acțiune necunoscută: ' || coalesce(act->>'kind', '?'));
      end case;

    exception when others then
      insert into public.automation_runs (automation_id, lead_id, summary, status, detail)
      values (p_automation.id, p_lead_id,
              'Acțiunea „' || coalesce(act->>'kind', '?') || '" a eșuat',
              'eroare', sqlerrm);
    end;
  end loop;

  perform set_config('app.automation', 'off', true);

  if array_length(done, 1) > 0 then
    insert into public.automation_runs (automation_id, lead_id, summary, status)
    values (p_automation.id, p_lead_id, array_to_string(done, ' · '), 'ok');
  end if;
end;
$$;

-- ------------------------------------------------------------
-- 5. Declanșator 1: a intrat un lead nou într-o listă
-- ------------------------------------------------------------
create or replace function public.on_lead_enters_list()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  rule public.automations;
begin
  -- Nu reacționăm la propriile noastre modificări
  if coalesce(current_setting('app.automation', true), 'off') = 'on' then
    return new;
  end if;

  -- La UPDATE ne interesează doar schimbarea de listă
  if tg_op = 'UPDATE' and new.list_id is not distinct from old.list_id then
    return new;
  end if;

  for rule in
    select * from public.automations
    where active
      and trigger_kind = 'lead_added_to_list'
      and (trigger_list_id = '' or trigger_list_id = new.list_id)
  loop
    perform public.apply_automation(rule, new.id);
  end loop;

  return new;
end;
$$;

drop trigger if exists leads_automation_insert on public.leads;
create trigger leads_automation_insert
after insert on public.leads
for each row execute function public.on_lead_enters_list();

drop trigger if exists leads_automation_move on public.leads;
create trigger leads_automation_move
after update of list_id on public.leads
for each row execute function public.on_lead_enters_list();

-- ------------------------------------------------------------
-- 6. Declanșator 2: leaduri care stau pe loc
--
-- Rulează periodic. Un lead e „uitat" dacă nu s-a atins nimic la el
-- de N zile. Ca să nu primești același task din oră în oră, sărim
-- peste leadurile pentru care regula a rulat deja de la ultima lor
-- modificare încoace.
-- ------------------------------------------------------------
create or replace function public.run_idle_automations()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  rule       public.automations;
  v_lead_id  text;
  total      integer := 0;
begin
  for rule in
    select * from public.automations where active and trigger_kind = 'lead_idle'
  loop
    for v_lead_id in
      select l.id
      from public.leads l
      where l.updated_at < now() - make_interval(days => greatest(rule.trigger_days, 1))
        and (rule.trigger_status = '' or l.status = rule.trigger_status)
        and not exists (
          select 1 from public.automation_runs r
          where r.automation_id = rule.id
            and r.lead_id = l.id
            and r.ran_at > l.updated_at
        )
      limit 500
    loop
      perform public.apply_automation(rule, v_lead_id);
      total := total + 1;
    end loop;
  end loop;

  return total;
end;
$$;

-- ------------------------------------------------------------
-- 7. Ceasul
--
-- pg_cron e planificatorul din Postgres. Verificăm la fiecare 15
-- minute — destul de des ca „3 zile" să însemne 3 zile, destul de rar
-- ca să nu încarce baza.
-- ------------------------------------------------------------
-- Izolat într-un bloc cu prindere de erori: dacă pg_cron nu e disponibil,
-- restul automatizărilor rămâne instalat și funcțional. Doar declanșatorul
-- „stă de N zile" n-ar mai porni singur, iar verificarea de la final o
-- semnalează clar.
do $$
begin
  create extension if not exists pg_cron;

  begin
    perform cron.unschedule('automatizari-leaduri-uitate');
  exception when others then
    null;  -- nu era programat încă, e în regulă
  end;

  perform cron.schedule(
    'automatizari-leaduri-uitate',
    '*/15 * * * *',
    'select public.run_idle_automations();'
  );
exception when others then
  raise notice 'pg_cron nu a putut fi pornit: %. Declansatorul pe timp ramane neprogramat.', sqlerrm;
end;
$$;

-- ------------------------------------------------------------
-- 8. Cine are voie la ce
-- ------------------------------------------------------------
alter table public.automations     enable row level security;
alter table public.automation_runs enable row level security;

drop policy if exists "automations readable by authenticated" on public.automations;
create policy "automations readable by authenticated"
on public.automations for select to authenticated using (true);

drop policy if exists "automations writable by staff" on public.automations;
create policy "automations writable by staff"
on public.automations for all to authenticated
using (public.is_staff()) with check (public.is_staff());

drop policy if exists "runs readable by authenticated" on public.automation_runs;
create policy "runs readable by authenticated"
on public.automation_runs for select to authenticated using (true);

drop policy if exists "runs writable by staff" on public.automation_runs;
create policy "runs writable by staff"
on public.automation_runs for all to authenticated
using (public.is_staff()) with check (public.is_staff());

-- ------------------------------------------------------------
-- 8b. Proba manuală
--
-- O regulă de tip „stă de 3 zile" nu se poate verifica altfel decât
-- așteptând 3 zile — ceea ce face testarea imposibilă în practică.
-- Funcția asta aplică o regulă pe un lead ales de tine, imediat,
-- ignorând condiția de vechime. Restul (acțiunile, jurnalul) merge
-- exact ca în execuția automată, deci ce vezi e ce se va întâmpla.
-- ------------------------------------------------------------
create or replace function public.test_automation(
  p_automation_id text,
  p_lead_id text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  rule   public.automations;
  result text;
begin
  if not public.is_staff() then
    return 'Doar un administrator sau manager poate rula o probă.';
  end if;

  select * into rule from public.automations where id = p_automation_id;
  if not found then
    return 'Automatizarea nu mai există.';
  end if;
  if not exists (select 1 from public.leads where id = p_lead_id) then
    return 'Leadul nu mai există.';
  end if;

  perform public.apply_automation(rule, p_lead_id);

  select summary into result
  from public.automation_runs
  where automation_id = p_automation_id and lead_id = p_lead_id
  order by ran_at desc
  limit 1;

  return coalesce(result, 'Regula a rulat, dar n-a avut nimic de făcut.');
end;
$$;

grant execute on function public.test_automation(text, text) to authenticated;

-- ------------------------------------------------------------
-- 9. Verificare
--
-- `cron_status` e întrebată prin SQL dinamic: dacă pg_cron nu există,
-- o interogare obișnuită către cron.job ar da eroare chiar la citire,
-- și ai crede că nu s-a instalat nimic — deși totul e pe loc.
-- ------------------------------------------------------------
create or replace function public.cron_status()
returns text
language plpgsql
stable
as $$
declare
  s text;
begin
  execute 'select schedule from cron.job where jobname = ''automatizari-leaduri-uitate''' into s;
  return coalesce(s, 'NEPROGRAMAT — declansatorul pe timp nu va porni singur');
exception when others then
  return 'pg_cron indisponibil — declansatorul pe timp nu va porni singur';
end;
$$;

select 'tabele' as ce,
       (select count(*)::text from pg_class c join pg_namespace n on n.oid = c.relnamespace
        where n.nspname = 'public' and c.relname in ('automations','automation_runs')) as rezultat
union all
select 'triggere pe leaduri',
       (select count(*)::text from pg_trigger
        where tgname in ('leads_automation_insert','leads_automation_move'))
union all
select 'ceas pg_cron', public.cron_status();
