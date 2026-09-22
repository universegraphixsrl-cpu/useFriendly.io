-- ============================================================
-- Date de pornire: cele 4 liste + 24 de leaduri demo.
-- Opțional — rulează-l doar dacă vrei să vezi CRM-ul cu date în el
-- înainte să intre leadurile reale. Se poate rula de mai multe ori.
--
-- Ca să ștergi leadurile demo mai târziu:
--   delete from public.leads where id like 'demo-%';
-- ============================================================

insert into public.lead_lists (id, name, detail, color, access, position) values
  ('list-webinar', 'Înscriși webinar',      'Leaduri venite din formularele de înscriere la webinar.', '#2f6bff', '{}', 1),
  ('list-calls',   'Programați book-a-call','Au rezervat un slot și au primit linkul de Zoom.',        '#f97316', '{}', 2),
  ('list-offers',  'Apeluri ținute',        'Au fost prezenți la apel, dar nu au semnat încă.',        '#eab308', '{}', 3),
  ('list-clients', 'Clienți plătitori',     'Contract semnat și plată încasată integral sau în rate.', '#10b981', '{}', 4)
on conflict (id) do update
  set name   = excluded.name,
      detail = excluded.detail,
      color  = excluded.color;

-- 24 de leaduri demo, împărțite pe cele 4 liste.
insert into public.leads
  (id, list_id, owner, caller, first_name, last_name, phone, email, status, added_on, paid_amount, generated_amount)
select
  'demo-' || g,
  case
    when g <= 10 then 'list-webinar'
    when g <= 16 then 'list-calls'
    when g <= 20 then 'list-offers'
    else 'list-clients'
  end,
  'Neatribuit',
  '',
  (array['Ana','Mihai','Ioana','Andrei','Maria','Vlad','Elena','Cristian',
         'Daniela','Alexandru','Roxana','Cristina','Robert','Alina','Sebastian',
         'Larisa','Dragoș','Otilia','Emil','Bogdan','Simona','Radu','Camelia','Paul'])[g],
  (array['Popescu','Ionescu','Georgescu','Dumitrescu','Stoica','Matei',
         'Constantin','Șerban','Vasile','Toma','Rusu','Moraru','Diaconu',
         'Ene','Filip','Andronic','Cîrstea','Băluță','Pavel','Zaharia',
         'Marinescu','Nistor','Olaru','Munteanu'])[g],
  '+40 7' || lpad((20 + g)::text, 2, '0') || ' ' || (100 + g)::text || ' ' || (400 + g * 7)::text,
  'demo' || g || '@example.com',
  case
    when g <= 6  then 'Înscris webinar'
    when g <= 10 then 'Nu a răspuns'
    when g <= 14 then 'Programat apel'
    when g <= 16 then 'No-show'
    when g <= 18 then 'Așteptăm răspuns'
    when g <= 20 then 'A zis da'
    else 'Semnat'
  end,
  (1 + g) || ' sep 2026',
  case when g > 20 then 1000 else 0 end,
  case when g > 20 then 2000 else 0 end
from generate_series(1, 24) as g
on conflict (id) do nothing;
