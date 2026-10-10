import React, { useEffect, useState } from 'react';
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
import { useAuth } from '../contexts/AuthContext';
import { supabase, supabaseConfigured } from '../lib/supabase';

const NAME_LOCK_DAYS = 30;

interface AccountProps {
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
}

export function Account({ theme, onThemeChange }: AccountProps) {
  const today = new Date();
  const { profile, session, signOut } = useAuth();

  const [fullName, setFullName] = useState('');
  const [nameDraft, setNameDraft] = useState('');
  const [lastNameChange, setLastNameChange] = useState<Date | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [vat, setVat] = useState('');
  const [address, setAddress] = useState('');
  const [avatar, setAvatar] = useState('');
  const [logo, setLogo] = useState('');
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [notice, setNotice] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  const email = session?.user?.email ?? '';

  /** Inițialele arătate cât timp nu e pusă o poză */
  const initialsOf = (text: string, fallback: string) => {
    const parts = text.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return fallback;
    return parts.
    slice(0, 2).
    map((part) => part[0].toUpperCase()).
    join('');
  };

  /**
   * Câmpurile pornesc de la profilul real, nu de la un om inventat.
   * Profilul se încarcă după ce pagina e deja pe ecran, deci îl
   * așteptăm — altfel câmpurile ar rămâne goale la nesfârșit.
   */
  useEffect(() => {
    if (!profile) return;
    setFullName(profile.full_name ?? '');
    setNameDraft(profile.full_name ?? '');
    setPhone((profile as any).phone ?? '');
    setCompanyName((profile as any).company_name ?? '');
    setVat((profile as any).company_vat ?? '');
    setAddress((profile as any).company_address ?? '');
    setAvatar((profile as any).avatar_url ?? '');
    setLogo((profile as any).company_logo_url ?? '');
  }, [profile]);

  /**
   * Regula „numele se schimbă o dată la 30 de zile” exista în prototip,
   * dar nu avem unde ține minte când a fost schimbat ultima oară. Până
   * atunci nu blocăm nimic — mai bine fără regulă decât cu una care se
   * preface.
   */
  const daysSinceChange = lastNameChange ?
  differenceInCalendarDays(today, lastNameChange) :
  NAME_LOCK_DAYS;
  const nameLocked = daysSinceChange < NAME_LOCK_DAYS;
  const unlockDate = addDays(lastNameChange ?? today, NAME_LOCK_DAYS);
  const daysLeft = NAME_LOCK_DAYS - daysSinceChange;

  /** Salvează în baza de date și spune cinstit dacă n-a mers */
  /**
   * Sesiuni active: o arătăm doar pe cea curentă, pentru că atât știm.
   * Înainte scriau aici trei dispozitive inventate, cu buton de
   * deconectare — adică o afirmație de securitate care nu era adevărată.
   */
  const activeSessions = session ?
  [
  {
    device: 'Acest dispozitiv',
    meta: 'Sesiunea curentă'
  }] :

  [];

  const saveProfile = async (patch: Record<string, string>, done: string) => {
    if (!supabaseConfigured || !profile) {
      setNotice('Fără baza de date conectată, modificările nu se salvează.');
      return;
    }
    setSaving(true);
    const { error } = await supabase.
    from('profiles').
    update(patch).
    eq('id', profile.id);
    setSaving(false);

    if (error) {
      setNotice(
        error.message.includes('column') ?
        'Baza de date nu are încă aceste câmpuri (rulează 06_account.sql).' :
        `Nu am putut salva: ${error.message}`
      );
      return;
    }
    setDirty(false);
    setNotice(done);
  };

  /** Schimbă parola prin Supabase. Parola nu trece niciodată prin codul nostru. */
  const changePassword = async () => {
    if (newPassword.length < 8) {
      setNotice('Parola nouă trebuie să aibă cel puțin 8 caractere.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setNotice('Cele două parole nu coincid.');
      return;
    }
    if (!supabaseConfigured) {
      setNotice('Fără baza de date conectată, parola nu se poate schimba.');
      return;
    }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSaving(false);
    if (error) {
      setNotice(`Nu am putut schimba parola: ${error.message}`);
      return;
    }
    setNewPassword('');
    setConfirmPassword('');
    setPasswordOpen(false);
    setNotice('Parola a fost schimbată.');
  };

  const saveName = () => {
    const next = nameDraft.trim();
    if (!next) {
      setNotice('Numele nu poate rămâne gol.');
      return;
    }
    if (nameLocked) {
      setNotice(
        `Numele a fost modificat pe ${format(lastNameChange ?? today, 'd LLLL', { locale: ro })}. Îl poți schimba din nou pe ${format(unlockDate, 'd LLLL yyyy', { locale: ro })} (în ${daysLeft} zile).`
      );
      return;
    }
    setFullName(next);
    setLastNameChange(today);
    void saveProfile({ full_name: next }, 'Numele a fost actualizat.');
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
            onClick={() =>
            void saveProfile(
              {
                phone,
                company_name: companyName,
                company_vat: vat,
                company_address: address
              },
              'Modificările au fost salvate.'
            )
            }
            disabled={saving}
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
                fallback={initialsOf(fullName, '—')}
                value={avatar}
                onSave={(url) => {
                  setAvatar(url);
                  void saveProfile({ avatar_url: url }, 'Poza a fost salvată.');
                }} />
              
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
                  readOnly
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-ink-700" />
                
                <p className="mt-1.5 text-xs text-ink-500">
                  Emailul e cel cu care intri în cont. Schimbarea lui cere
                  confirmare pe adresa nouă — o facem când activăm trimiterea
                  de emailuri.
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
                  value={phone}
                  placeholder="+40 7xx xxx xxx"
                  onChange={(event) => {
                    setPhone(event.target.value);
                    setDirty(true);
                  }}
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
                fallback={initialsOf(companyName, '—')}
                shape="square"
                value={logo}
                onSave={(url) => {
                  setLogo(url);
                  void saveProfile({ company_logo_url: url }, 'Logo-ul a fost salvat.');
                }} />
              
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
                  value={vat}
                  placeholder="RO12345678"
                  onChange={(event) => {
                    setVat(event.target.value);
                    setDirty(true);
                  }}
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
                  value={address}
                  placeholder="Strada, numărul, orașul"
                  onChange={(event) => {
                    setAddress(event.target.value);
                    setDirty(true);
                  }}
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
              <p className="mt-1.5 text-sm text-ink-700">
                Parola ta e cunoscută doar de tine — nici platforma nu o poate
                citi. Dacă vrei alta, o setezi mai jos.
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
                <div>
                  <label
                  htmlFor="newPassword"
                  className="text-xs font-bold uppercase tracking-wide text-ink-500">
                  
                    Parola nouă
                  </label>
                  <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder="minimum 8 caractere"
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-ink focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100" />
                
                </div>
                <div>
                  <label
                  htmlFor="confirmPassword"
                  className="text-xs font-bold uppercase tracking-wide text-ink-500">
                  
                    Confirmă parola nouă
                  </label>
                  <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="••••••••"
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-ink focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100" />
                
                </div>
                <button
                type="button"
                disabled={saving}
                onClick={() => void changePassword()}
                className="w-full rounded-lg bg-ink px-3 py-2.5 text-sm font-bold text-white transition-colors duration-150 ease-out hover:bg-ink-700 disabled:bg-slate-200 disabled:text-ink-500">
                
                  {saving ? 'Se salvează…' : 'Confirmă parola nouă'}
                </button>
              </div>
            }

            <div className="mt-5 border-t border-slate-100 pt-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-ink">
                    Autentificare în 2 pași
                  </p>
                  <p className="text-xs text-ink-500">
                    Nu e activată. Nu o putem activa încă — are nevoie de
                    trimitere de SMS-uri sau de o aplicație de coduri.
                  </p>
                </div>
                <span
                  className="flex h-6 w-11 items-center rounded-full bg-slate-200 px-0.5"
                  role="img"
                  aria-label="Dezactivată">
                  
                  <span className="h-5 w-5 rounded-full bg-white" />
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
              {activeSessions.length === 0 &&
              <li className="text-ink-500">Nicio sesiune activă.</li>
              }
              {activeSessions.map((item) =>
              <li
                key={item.device}
                className="flex items-center justify-between gap-3">
                
                  <div>
                    <p className="font-semibold text-ink">{item.device}</p>
                    <p className="text-xs text-ink-500">{item.meta}</p>
                  </div>
                  <button
                  type="button"
                  onClick={() => void signOut()}
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