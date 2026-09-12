import React, { useState } from 'react';
import {
  XIcon,
  UsersIcon,
  StoreIcon,
  FilterIcon,
  GlobeIcon } from
'lucide-react';
import { FunnelAccessPicker } from './FunnelAccessPicker';

export type FunnelGoal = 'audienta' | 'vanzare' | 'custom' | 'webinar';

interface FunnelCreateDialogProps {
  onClose: () => void;
  onCreate: (
  name: string,
  domain: string,
  goal: FunnelGoal,
  currency: string,
  access: string[])
  => void;
  /** Valori inițiale, când dialogul e folosit ca „Setări funnel” */
  initialName?: string;
  initialDomain?: string;
  initialAccess?: string[];
  title?: string;
  submitLabel?: string;
}

const goals: {
  id: FunnelGoal;
  label: string;
  description: string;
  icon: typeof UsersIcon;
}[] = [
{
  id: 'audienta',
  label: 'Lead Generation',
  description: 'Colectează adrese de email și crește-ți lista de contacte.',
  icon: UsersIcon
},
{
  id: 'vanzare',
  label: 'Sales',
  description: 'Vinde un produs sau un serviciu direct din funnel.',
  icon: StoreIcon
},
{
  id: 'custom',
  label: 'Personalizat',
  description: 'Construiește un funnel de la zero, pas cu pas.',
  icon: FilterIcon
},
{
  id: 'webinar',
  label: 'Website',
  description:
  'Construiește un site de prezentare cu pagini legate între ele.',
  icon: GlobeIcon
}];


const currencies = ['EUR — Euro', 'RON — Leu', 'USD — Dolar', 'GBP — Liră'];

/** Pop-up pentru crearea unui funnel nou */
export function FunnelCreateDialog({
  onClose,
  onCreate,
  initialName = '',
  initialDomain = 'friendly.ro',
  initialAccess = [],
  title = 'Creează funnel',
  submitLabel = 'Adaugă funnel'
}: FunnelCreateDialogProps) {
  const [name, setName] = useState(initialName);
  const [domain, setDomain] = useState(initialDomain);
  const [goal, setGoal] = useState<FunnelGoal | ''>('');
  const [currency, setCurrency] = useState(currencies[0]);
  const [access, setAccess] = useState<string[]>(initialAccess);

  // la editare (Setări funnel) obiectivul e deja stabilit, deci nu e obligatoriu
  const editing = initialName.trim().length > 0;
  // la editare butonul se activează doar dacă s-a schimbat efectiv ceva
  const dirty =
  name !== initialName ||
  domain !== initialDomain ||
  goal !== '' ||
  currency !== currencies[0] ||
  JSON.stringify(access) !== JSON.stringify(initialAccess);
  const valid =
  name.trim().length > 0 &&
  domain.trim().length > 0 && (
  editing ? dirty : goal !== '');

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="funnel-dialog-title"
      className="fixed inset-0 z-[120] flex items-start justify-center overflow-y-auto p-4 py-10">
      
      <button
        type="button"
        aria-label="Închide"
        onClick={onClose}
        className="fixed inset-0 cursor-default bg-ink/40" />
      

      <div className="menu-surface relative w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-7 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <h2
            id="funnel-dialog-title"
            className="font-display text-2xl font-extrabold tracking-tight text-ink">
            
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Închide"
            className="rounded-md p-1.5 text-ink-500 transition-colors duration-150 ease-out hover:bg-slate-50 hover:text-ink">
            
            <XIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-bold text-ink-700">
            Denumire<span className="text-red-500"> *</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={40}
              autoFocus
              placeholder="ex. Webinar septembrie"
              className="mt-2 w-full rounded-md border border-slate-200 px-3.5 py-3 text-base font-normal text-ink outline-none focus:border-brand-400" />
            
          </label>
          <label className="block text-sm font-bold text-ink-700">
            Domeniul funnelului<span className="text-red-500"> *</span>
            <input
              value={domain}
              onChange={(event) => setDomain(event.target.value)}
              placeholder="friendly.ro"
              className="mt-2 w-full rounded-md border border-slate-200 px-3.5 py-3 text-base font-normal text-ink outline-none focus:border-brand-400" />
            
          </label>
        </div>

        <p className="mt-6 text-sm font-bold text-ink-700">
          Obiectivul funnelului
          {!editing && <span className="text-red-500"> *</span>}
        </p>
        <div className="mt-2.5 grid gap-3 sm:grid-cols-2">
          {goals.map((option) => {
            const Icon = option.icon;
            const active = goal === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setGoal(option.id)}
                aria-pressed={active}
                className={`rounded-md border p-4 text-left transition-colors duration-150 ease-out ${
                active ?
                'border-brand-500 bg-brand-50' :
                'border-slate-200 hover:border-brand-200 hover:bg-slate-50'}`
                }>
                
                <Icon
                  className={`h-6 w-6 ${active ? 'text-brand-600' : 'text-ink-400'}`}
                  aria-hidden="true" />
                
                <span className="mt-3 block font-display text-base font-bold text-ink">
                  {option.label}
                </span>
                <span className="mt-1 block text-sm text-ink-500">
                  {option.description}
                </span>
              </button>);

          })}
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-bold text-ink-700">
            Moneda
            <select
              value={currency}
              onChange={(event) => setCurrency(event.target.value)}
              className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3.5 py-3 text-base font-normal text-ink outline-none focus:border-brand-400">
              
              {currencies.map((option) =>
              <option key={option}>{option}</option>
              )}
            </select>
          </label>
          <div className="text-sm font-bold text-ink-700">
            Acces la editare
            <div className="mt-2">
              <FunnelAccessPicker access={access} onChange={setAccess} />
            </div>
            <p className="mt-1.5 text-xs font-semibold text-ink-500">
              {access.length === 0 ?
              'Doar tu poți edita acest funnel.' :
              `${access.length} sub-accounts pot edita funnelul.`}
            </p>
          </div>
        </div>

        <div className="mt-7 flex justify-center">
          <button
            type="button"
            disabled={!valid}
            onClick={() =>
            valid &&
            onCreate(
              name.trim(),
              domain.trim(),
              (goal || 'custom') as FunnelGoal,
              currency.slice(0, 3),
              access
            )
            }
            className="rounded-md bg-brand-500 px-8 py-3 font-display text-[15px] font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-slate-300">
            
            {submitLabel}
          </button>
        </div>
      </div>
    </div>);

}