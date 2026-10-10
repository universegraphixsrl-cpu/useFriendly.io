-- ============================================================
-- 06 — Datele din „Contul meu”
--
-- Ce rezolvă: pagina „Contul meu” avea telefon, CUI și adresă de
-- facturare scrise în cod (un CUI inventat, o adresă din Cluj).
-- Arătau ca niște câmpuri editabile, dar nu aveau unde să se
-- salveze: le schimbai, dădeai refresh, reveneau.
--
-- Aici le dăm un loc, pe profilul fiecărui om.
--
-- De rulat în Supabase → SQL Editor, o singură dată.
-- Se poate rula de mai multe ori fără să strice nimic.
-- ============================================================

alter table public.profiles
  add column if not exists phone            text not null default '',
  add column if not exists company_name     text not null default '',
  add column if not exists company_vat      text not null default '',
  add column if not exists company_address  text not null default '';

-- Politicile existente pe `profiles` acoperă deja coloanele noi:
-- „profiles updatable by self or staff” permite fiecăruia să-și
-- modifice propriul profil, și nimănui altcuiva în afară de
-- administratori și manageri. Nu e nevoie de reguli în plus.

-- ------------------------------------------------------------
-- Verificare
-- ------------------------------------------------------------
select column_name as coloana, data_type as tip
from information_schema.columns
where table_schema = 'public'
  and table_name = 'profiles'
order by ordinal_position;
