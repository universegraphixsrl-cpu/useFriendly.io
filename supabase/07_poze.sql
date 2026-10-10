-- ============================================================
-- 07 — Poza de profil și logo-ul companiei
--
-- Ce rezolvă: butonul „Încarcă imagine" din „Contul meu" făcea doar o
-- previzualizare în browser (`URL.createObjectURL`). Puneai poza, o
-- vedeai, dădeai refresh și dispărea — exact bug-ul pe care l-am
-- reparat la documentele de pe leaduri.
--
-- Fișierele urcă în bucket-ul privat `documents`, creat la pasul 05.
-- Aici păstrăm doar calea către ele.
--
-- De rulat în Supabase → SQL Editor, o singură dată.
-- Se poate rula de mai multe ori fără să strice nimic.
-- ============================================================

alter table public.profiles
  add column if not exists avatar_url        text not null default '',
  add column if not exists company_logo_url  text not null default '';

-- Politicile existente pe `profiles` acoperă deja coloanele noi.

-- ------------------------------------------------------------
-- Verificare
-- ------------------------------------------------------------
select column_name as coloana, data_type as tip
from information_schema.columns
where table_schema = 'public'
  and table_name = 'profiles'
order by ordinal_position;
