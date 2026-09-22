# Pașii pentru a lega CRM-ul de baza de date

Ordinea contează. Fiecare pas are un mod de verificare — nu trece mai departe
până nu vezi ce scrie la „Cum verifici".

---

## Pasul 1 — Creează proiectul în Supabase

1. Intră pe [supabase.com](https://supabase.com) și apasă **New project**.
2. Completează:
   - **Name:** `usefriendly`
   - **Database Password:** apasă *Generate a password* și **salvează-o** într-un loc sigur (nu o mai poți vedea după).
   - **Region:** `Central EU (Frankfurt)` — cel mai aproape de România și în UE, pentru datele personale.
3. Apasă **Create new project** și așteaptă ~2 minute.

**Cum verifici:** ai ajuns în panoul proiectului și în stânga vezi meniul cu
*Table Editor*, *SQL Editor*, *Authentication*.

---

## Pasul 2 — Creează tabelele

1. În stânga, apasă pe **SQL Editor** → **New query**.
2. Deschide fișierul `supabase/01_schema.sql` din proiect, copiază **tot**
   conținutul și lipește-l în fereastra din Supabase.
3. Apasă **Run** (sau Ctrl + Enter).

**Cum verifici:** mergi la **Table Editor**. Trebuie să vezi 5 tabele —
`profiles`, `lead_lists`, `leads`, `lead_payments`, `lead_documents` — și
fiecare să aibă eticheta verde **RLS enabled**. Dacă un tabel nu are eticheta
aceea, datele sunt expuse public: oprește-te și spune-mi.

*(Opțional)* Dacă vrei să vezi CRM-ul cu date în el înainte să intre leadurile
reale, rulează la fel și `supabase/02_seed_demo.sql` — adaugă 4 liste și 24 de
leaduri demo, pe care le poți șterge oricând.

---

## Pasul 3 — Ia cheile și pune-le în proiect

1. În Supabase: **Project Settings** (roata dințată) → **API**.
2. Copiază:
   - **Project URL** (arată ca `https://abcdxyz.supabase.co`)
   - **anon / public** key (un text lung care începe cu `eyJ...`)
3. În Cursor, în rădăcina proiectului (lângă `package.json`), creează un fișier
   nou numit exact `.env.local` — cu punct la început — și pune în el cele două
   linii, înlocuind valorile cu ale tale:

```
VITE_SUPABASE_URL=https://abcdxyz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

   Fișierul ăsta nu ajunge pe GitHub — regula `*.local` din `.gitignore` îl
   ține deoparte, ceea ce e corect: cheile stau în Vercel, nu în cod.

> Cheia `anon` e publică prin design — ajunge oricum în browserul fiecărui
> vizitator. Datele sunt protejate de regulile RLS din Pasul 2, nu de secretul
> cheii. **Cheia `service_role` de pe aceeași pagină nu are voie să ajungă
> niciodată în proiect** — aia ocolește toate regulile de securitate.

**Cum verifici:** în Cursor, în terminal, rulează `npm install` și apoi
`npm run dev`. Deschizi `localhost:5173` și trebuie să apară **pagina de
login**, nu CRM-ul. Dacă apare CRM-ul direct, înseamnă că `.env.local` nu e
citit — verifică numele fișierului și că e în rădăcina proiectului.

---

## Pasul 4 — Fă-ți primul cont (al tău, de admin)

1. În Supabase: **Authentication** → **Users** → **Add user** → **Create new user**.
2. Pune emailul tău și o parolă. Bifează **Auto Confirm User** (altfel trebuie
   confirmare pe email).
3. Mergi la **SQL Editor** → **New query** și rulează, înlocuind cu emailul tău:

```sql
update public.profiles
set full_name = 'George Popescu',   -- numele tău, așa cum vrei să apară în CRM
    role = 'admin'
where id = (select id from auth.users where email = 'emailul-tau@gmail.com');
```

**Cum verifici:** în **Table Editor** → `profiles` apare un rând cu numele tău
și `role = admin`. Apoi, pe `localhost:5173`, te loghezi cu emailul și parola —
trebuie să intri în CRM.

---

## Pasul 5 — Pune cheile și pe site-ul live

1. Intră pe [vercel.com](https://vercel.com), deschide proiectul `useFriendly.io`.
2. **Settings** → **Environment Variables**.
3. Adaugă cele două variabile, una câte una, cu aceleași valori ca în `.env.local`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

   Lasă bifate toate cele trei medii (Production, Preview, Development).

**Cum verifici:** după următorul push, intri pe `usefriendly.io` și trebuie să
apară pagina de login. Asta înseamnă că site-ul nu mai e deschis oricui.

---

## Pasul 6 — Trimite totul live

În terminalul din Cursor:

```
git add .
git commit -m "Autentificare si baza de date Supabase pentru leaduri"
git push
```

Vercel construiește singur noua versiune în ~40 de secunde.

**Cum verifici:** deschizi `usefriendly.io` într-o fereastră incognito → apare
login-ul. Te loghezi → intri în CRM. Adaugi un lead, dai refresh cu Ctrl+F5 →
leadul e tot acolo. Ăsta e momentul în care CRM-ul devine real.

---

## Ce urmează după asta

- **Conturile pentru echipă.** Fiecare om primește cont din Supabase →
  Authentication → Add user, apoi îi setezi numele și rolul în `profiles`.
  Rolurile sunt: `admin`, `manager`, `closer`, `caller`, `marketer`. Numele din
  `profiles.full_name` trebuie să fie exact numele cu care apare în CRM la
  „responsabil" — pe el se face legătura.
- **Restul modulelor.** Task-urile, calendarele, cursurile și funnel-urile merg
  în continuare pe date fictive, în memorie. Le mutăm pe același tipar, pe rând.
- **Fișierele atașate la leaduri.** Documentele se salvează acum doar ca nume și
  tip. Ca să se salveze fișierul în sine, e nevoie de Supabase Storage — pas separat.
- **Pagina de login de la Andreas.** Când vine designul, se schimbă doar
  înfățișarea din `src/pages/Login.tsx`. Logica rămâne — designul nou trebuie
  doar să lege cele două câmpuri și butonul.
