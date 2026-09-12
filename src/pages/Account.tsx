import React, { useState } from 'react';
import { addDays, differenceInCalendarDays, format } from 'date-fns';
import { ro } from 'date-fns/locale';
import {
  LockIcon,
  InfoIcon,
  KeyRoundIcon,
  CheckIcon,
  ShieldCheckIcon,
  LogOutIcon,
  SunIcon,
  MoonIcon } from
'lucide-react';
import { ImageUploader } from '../components/account/ImageUploader';

const today = new Date(2026, 7, 24);
const NAME_LOCK_DAYS = 30;

interface AccountProps {
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
}

export function Account({ theme, onThemeChange }: AccountProps) {
  const [fullName, setFullName] = useState('Andreas Bălan');
  const [nameDraft, setNameDraft] = useState('Andreas Bălan');
  const [lastNameChange, setLastNameChange] = useState(new Date(2026, 7, 12));
  const [companyName, setCompanyName] = useState('EliteClosers România');
  const [email, setEmail] = useState('andreas@eliteclosers.ro');
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);

  const daysSinceChange = differenceInCalendarDays(today, lastNameChange);
  const nameLocked = daysSinceChange < NAME_LOCK_DAYS;
  const unlockDate = addDays(lastNameChange, NAME_LOCK_DAYS);
  const daysLeft = NAME_LOCK_DAYS - daysSinceChange;

  const saveName = () => {
    if (nameLocked) {
      setNotice(
        `Numele a fost modificat pe ${format(lastNameChange, 'd LLLL', { locale: ro })}. Îl poți schimba din nou pe ${format(unlockDate, 'd LLLL yyyy', { locale: ro })} (în ${daysLeft} zile).`
      );
      return;
    }
    setFullName(nameDraft.trim() || fullName);
    setLastNameChange(today);
    setNotice(
      'Numele a fost actualizat. Următoarea modificare va fi posibilă după 30 de zile.'
    );
  };

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Contul meu
          </h1>
          <p className="mt-1 text-sm text-ink-700">
            Datele tale, identitatea companiei și setările de securitate.
          </p>
        </div>
        {dirty &&
        <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-ink-500">
              Ai modificări nesalvate
            </span>
            <button
            type="button"
            onClick={() => {
              setDirty(false);
              setNotice('Modificările au fost salvate.');
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-3.5 py-2.5 font-display text-sm font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600">
            
              <CheckIcon
              className="h-4 w-4"
              strokeWidth={2.5}
              aria-hidden="true" />
            
              Salvează modificările
            </button>
          </div>
        }
      </div>

      {notice &&
      <div
        role="status"
        className="mt-5 flex items-start gap-2.5 rounded-xl border border-brand-200 bg-brand-50 p-4">
        
          <InfoIcon
          className="mt-0.5 h-4 w-4 shrink-0 text-brand-600"
          aria-hidden="true" />
        
          <p className="text-sm leading-relaxed text-ink-700">{notice}</p>
          <button
          type="button"
          onClick={() => setNotice(null)}
          className="ml-auto text-xs font-bold text-brand-700 underline-offset-4 hover:underline">
          
            Am înțeles
          </button>
        </div>
      }

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <section
            aria-labelledby="profile-title"
            className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            
            <h2
              id="profile-title"
              className="font-display text-base font-extrabold tracking-tight text-ink">
              
              Profilul tău
            </h2>
            <p className="text-xs text-ink-500">
              Apar în apeluri, oferte și pe pagina publică de rezervări.
            </p>

            <div className="mt-5">
              <ImageUploader
                label="Poză de profil"
                hint="JPG sau PNG, minim 400×400 px"
                fallback="AB"
                onChanged={() => setDirty(true)} />
              
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="fullName"
                  className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-ink-500">
                  
                  Nume complet
                  {nameLocked &&
                  <LockIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  }
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={nameDraft}
                  disabled={nameLocked}
                  onChange={(event) => {
                    setNameDraft(event.target.value);
                    setDirty(true);
                  }}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold text-ink focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100 disabled:bg-slate-50 disabled:text-ink-500" />
                
                <p className="mt-1.5 text-xs text-ink-500">
                  {nameLocked ?
                  `Blocat până pe ${format(unlockDate, 'd LLLL yyyy', { locale: ro })} · ${daysLeft} zile rămase` :
                  'Numele poate fi schimbat o dată la 30 de zile.'}
                </p>
                <button
                  type="button"
                  onClick={saveName}
                  className="mt-2 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-ink-700 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
                  
                  Actualizează numele
                </button>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="text-xs font-bold uppercase tracking-wide text-ink-500">
                  
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setDirty(true);
                  }}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold text-ink focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100" />
                
                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-emerald-700">
                  <ShieldCheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  Verificat
                </p>
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="text-xs font-bold uppercase tracking-wide text-ink-500">
                  
                  Telefon
                </label>
                <input
                  id="phone"
                  type="tel"
                  defaultValue="+40 741 220 118"
                  onChange={() => setDirty(true)}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold text-ink focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100" />
                
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="text-xs font-bold uppercase tracking-wide text-ink-500">
                  
                  Rol în echipă
                </label>
                <input
                  id="role"
                  type="text"
                  defaultValue="Fondator & Head of Sales"
                  onChange={() => setDirty(true)}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold text-ink focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100" />
                
              </div>
            </div>
          </section>

          <section
            aria-labelledby="company-title"
            className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            
            <h2
              id="company-title"
              className="font-display text-base font-extrabold tracking-tight text-ink">
              
              Companie
            </h2>
            <p className="text-xs text-ink-500">
              Logo-ul și denumirea apar pe facturi, oferte și rapoarte.
            </p>

            <div className="mt-5">
              <ImageUploader
                label="Logo companie"
                hint="PNG cu fundal transparent, minim 512×512 px"
                fallback="EC"
                shape="square"
                onChanged={() => setDirty(true)} />
              
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="company"
                  className="text-xs font-bold uppercase tracking-wide text-ink-500">
                  
                  Nume companie
                </label>
                <input
                  id="company"
                  type="text"
                  value={companyName}
                  onChange={(event) => {
                    setCompanyName(event.target.value);
                    setDirty(true);
                  }}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold text-ink focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100" />
                
              </div>
              <div>
                <label
                  htmlFor="cui"
                  className="text-xs font-bold uppercase tracking-wide text-ink-500">
                  
                  CUI / CIF
                </label>
                <input
                  id="cui"
                  type="text"
                  defaultValue="RO45120983"
                  onChange={() => setDirty(true)}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold text-ink focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100" />
                
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="address"
                  className="text-xs font-bold uppercase tracking-wide text-ink-500">
                  
                  Adresă de facturare
                </label>
                <input
                  id="address"
                  type="text"
                  defaultValue="Str. Mihai Viteazu 14, Cluj-Napoca"
                  onChange={() => setDirty(true)}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold text-ink focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100" />
                
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section
            aria-labelledby="appearance-title"
            className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            
            <h2
              id="appearance-title"
              className="font-display text-base font-extrabold tracking-tight text-ink">
              
              Aspect
            </h2>
            <p className="text-xs text-ink-500">
              Se aplică instant în tot CRM-ul, pe toate paginile.
            </p>

            <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2.5">
                {theme === 'dark' ?
                <MoonIcon
                  className="h-[18px] w-[18px] text-ink-700"
                  aria-hidden="true" /> :


                <SunIcon
                  className="h-[18px] w-[18px] text-ink-700"
                  aria-hidden="true" />

                }
                <div>
                  <p className="text-sm font-bold text-ink">Temă întunecată</p>
                  <p className="text-xs text-ink-500">
                    {theme === 'dark' ?
                    'Activă — interfața folosește paleta dark.' :
                    'Inactivă — interfața folosește paleta deschisă.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={theme === 'dark'}
                aria-label="Comută tema întunecată"
                onClick={() =>
                onThemeChange(theme === 'dark' ? 'light' : 'dark')
                }
                className={`flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors duration-150 ease-out ${
                theme === 'dark' ? 'bg-brand-500' : 'bg-slate-300'}`
                }>
                
                <span
                  className={`h-5 w-5 rounded-full bg-white transition-transform duration-150 ease-out ${
                  theme === 'dark' ? 'translate-x-5' : ''}`
                  } />
                
              </button>
            </div>
          </section>

          <section
            aria-labelledby="security-title"
            className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            
            <h2
              id="security-title"
              className="font-display text-base font-extrabold tracking-tight text-ink">
              
              Securitate
            </h2>

            <div className="mt-4">
              <label
                htmlFor="password"
                className="text-xs font-bold uppercase tracking-wide text-ink-500">
                
                Parolă
              </label>
              <input
                id="password"
                type="password"
                defaultValue="parolasecreta"
                readOnly
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-ink-500" />
              
              <p className="mt-1.5 text-xs text-ink-500">
                Schimbată acum 3 luni
              </p>
              <button
                type="button"
                onClick={() => setPasswordOpen((value) => !value)}
                aria-expanded={passwordOpen}
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-brand-500 px-3 py-2 text-sm font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600">
                
                <KeyRoundIcon className="h-4 w-4" aria-hidden="true" />
                Schimbă parola
              </button>
            </div>

            {passwordOpen &&
            <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
                {[
              { id: 'current', label: 'Parola actuală' },
              { id: 'new', label: 'Parola nouă' },
              { id: 'confirm', label: 'Confirmă parola nouă' }].
              map((field) =>
              <div key={field.id}>
                    <label
                  htmlFor={field.id}
                  className="text-xs font-bold uppercase tracking-wide text-ink-500">
                  
                      {field.label}
                    </label>
                    <input
                  id={field.id}
                  type="password"
                  placeholder="••••••••"
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-ink focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100" />
                
                  </div>
              )}
                <button
                type="button"
                className="w-full rounded-lg bg-ink px-3 py-2.5 text-sm font-bold text-white transition-colors duration-150 ease-out hover:bg-ink-700">
                
                  Confirmă parola nouă
                </button>
              </div>
            }

            <div className="mt-5 border-t border-slate-100 pt-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-ink">
                    Autentificare în 2 pași
                  </p>
                  <p className="text-xs text-ink-500">Prin aplicație SMS</p>
                </div>
                <span
                  className="flex h-6 w-11 items-center rounded-full bg-brand-500 px-0.5"
                  role="img"
                  aria-label="Activată">
                  
                  <span className="h-5 w-5 translate-x-5 rounded-full bg-white" />
                </span>
              </div>
            </div>
          </section>

          <section
            aria-labelledby="sessions-title"
            className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            
            <h2
              id="sessions-title"
              className="font-display text-base font-extrabold tracking-tight text-ink">
              
              Sesiuni active
            </h2>
            <ul className="mt-3 space-y-3 text-sm">
              {[
              { device: 'MacBook Pro · Cluj', meta: 'Sesiunea curentă' },
              { device: 'iPhone 16 · Cluj', meta: 'Acum 2 ore' },
              { device: 'Chrome · București', meta: 'Ieri, 21:14' }].
              map((session) =>
              <li
                key={session.device}
                className="flex items-center justify-between gap-3">
                
                  <div>
                    <p className="font-semibold text-ink">{session.device}</p>
                    <p className="text-xs text-ink-500">{session.meta}</p>
                  </div>
                  <button
                  type="button"
                  className="rounded-lg px-2 py-1 text-xs font-bold text-ink-500 transition-colors duration-150 ease-out hover:bg-red-50 hover:text-red-600">
                  
                    Deconectează
                  </button>
                </li>
              )}
            </ul>
            <button
              type="button"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-bold text-ink-700 transition-colors duration-150 ease-out hover:border-red-200 hover:bg-red-50 hover:text-red-600">
              
              <LogOutIcon className="h-4 w-4" aria-hidden="true" />
              Deconectează toate dispozitivele
            </button>
          </section>
        </div>
      </div>
    </>);

}