import React, { useState } from 'react';
import {
  ZapIcon,
  PlusIcon,
  XIcon,
  ArrowRightIcon,
  CheckIcon } from
'lucide-react';
import type { FunnelStep } from '../../data/funnels';
import {
  triggerOptions,
  actionOptions,
  communityOptions,
  bundleOptions,
  pipelineStages,
  type ActionOption,
  type TriggerKind } from
'../../data/funnelAutomations';
import { Toast } from '../Toast';

interface SelectedAction {
  /** id unic al acțiunii adăugate (o acțiune poate fi adăugată de mai multe ori) */
  uid: string;
  option: ActionOption;
  value: string;
}

interface FunnelAutomationsProps {
  steps: FunnelStep[];
  /** Tagurile create în acest funnel (din fila „Atribuie Tag”) */
  tags: string[];
  campaigns: string[];
  courses: string[];
  /** Creează un tag nou direct din configurarea acțiunii */
  onAddTag?: (tag: string) => void;
}

/** Meniul plutitor de selecție (Adaugă trigger / Adaugă acțiune) */
function PickerDialog({
  title,
  hint,
  children,
  onClose





}: {title: string;hint?: string;children: React.ReactNode;onClose: () => void;}) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/40 p-6">
      <div className="mt-16 w-full max-w-xl rounded-lg border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div>
            <h3 className="font-display text-xl font-extrabold tracking-tight text-ink">
              {title}
            </h3>
            {hint && <p className="mt-1 text-sm text-ink-500">{hint}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Închide"
            className="rounded-md p-1.5 text-ink-500 transition-colors duration-150 ease-out hover:bg-slate-100 hover:text-ink">
            
            <XIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto">{children}</div>
      </div>
    </div>);

}

/** Selector simplu, cu mesaj când nu există opțiuni */
function ConfigSelect({
  label,
  options,
  emptyMessage,
  value,
  onChange,
  onCreate,
  createLabel









}: {label: string;options: string[];emptyMessage: string;value: string;onChange: (value: string) => void; /** Când e prezent, apare un buton mic de creare rapidă (ex. taguri) */onCreate?: (value: string) => void;createLabel?: string;}) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState('');

  const create = () => {
    const name = draft.trim();
    if (!name) return;
    onCreate?.(name);
    onChange(name);
    setDraft('');
    setAdding(false);
  };

  return (
    <div className="mt-4">
      <p className="text-sm font-bold text-ink-700">
        {label}
        <span className="text-red-500"> *</span>
      </p>
      {options.length === 0 ?
      <p className="mt-2 rounded-md border border-dashed border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-ink-500">
          {emptyMessage}
        </p> :

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={label}
        className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3.5 py-3 text-base font-semibold text-ink outline-none focus:border-brand-400">
        
          <option value="">Alege…</option>
          {options.map((option) =>
        <option key={option} value={option}>
              {option}
            </option>
        )}
        </select>
      }

      {onCreate && (
      adding ?
      <div className="mt-2 flex items-center gap-2">
            <input
          autoFocus
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              create();
            }
            if (event.key === 'Escape') setAdding(false);
          }}
          placeholder="Denumirea tagului"
          aria-label={createLabel ?? 'Adaugă'}
          className="flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-ink outline-none focus:border-brand-400" />
        
            <button
          type="button"
          onClick={create}
          disabled={draft.trim().length === 0}
          className="rounded-md bg-brand-500 px-3 py-2 text-sm font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-ink-400">
          
              Adaugă
            </button>
            <button
          type="button"
          onClick={() => setAdding(false)}
          className="rounded-md px-2 py-2 text-sm font-semibold text-ink-500 transition-colors duration-150 ease-out hover:bg-slate-100 hover:text-ink">
          
              Anulează
            </button>
          </div> :

      <button
        type="button"
        onClick={() => setAdding(true)}
        className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-ink-600 transition-colors duration-150 ease-out hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700">
        
            <PlusIcon className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
            {createLabel ?? 'Adaugă'}
          </button>)
      }
    </div>);

}

/** Starea completă a unei reguli, folosită și la editare */
interface RuleState {
  trigger: TriggerKind | null;
  triggerStep: string;
  triggerSource: 'submit' | 'form';
  actions: SelectedAction[];
}

/** Constructorul unei reguli: trigger → acțiuni */
function RuleBuilder({
  steps,
  tags,
  campaigns,
  courses,
  onAddTag,
  initial,
  onSave



}: FunnelAutomationsProps & {initial?: RuleState;onSave: (state: RuleState, summary: string) => void;}) {
  const [trigger, setTrigger] = useState<TriggerKind | null>(
    initial?.trigger ?? null
  );
  const [triggerStep, setTriggerStep] = useState(initial?.triggerStep ?? '');
  const [triggerSource, setTriggerSource] = useState<'submit' | 'form'>(
    initial?.triggerSource ?? 'submit'
  );
  const [actions, setActions] = useState<SelectedAction[]>(
    initial?.actions ?? []
  );
  const current: RuleState = { trigger, triggerStep, triggerSource, actions };
  const dirty = initial ?
  JSON.stringify(current) !== JSON.stringify(initial) :
  true;
  // regula e validă doar cu trigger, pas ales și toate acțiunile configurate
  const complete =
  trigger !== null &&
  triggerStep !== '' &&
  actions.length > 0 &&
  actions.every(
    (action) =>
    action.option.config === 'none' || action.value.trim().length > 0
  );
  const [pickingTrigger, setPickingTrigger] = useState(false);
  const [pickingAction, setPickingAction] = useState(false);

  // în această versiune niciun formular nu e atașat unui pas de funnel
  const attachedForms: string[] = [];

  const addAction = (option: ActionOption) => {
    setActions((current) => [
    ...current,
    { uid: `${option.id}-${Date.now()}`, option, value: '' }]
    );
    setPickingAction(false);
  };

  const optionsFor = (
  action: SelectedAction)
  : {label: string;options: string[];empty: string;} | null => {
    switch (action.option.config) {
      case 'campaign':
        return {
          label: 'Campanie',
          options: campaigns,
          empty: 'Nu există nicio campanie creată în secțiunea Marketing.'
        };
      case 'tag':
        return {
          label: 'Tag',
          options: tags,
          empty: 'Nu există niciun tag în acest funnel.'
        };
      case 'course':
        return {
          label: 'Curs',
          options: courses,
          empty: 'Nu există niciun curs disponibil.'
        };
      case 'bundle':
        return {
          label: 'Pachet de cursuri',
          options: bundleOptions,
          empty: 'Nu există niciun pachet disponibil.'
        };
      case 'community':
        return {
          label: 'Comunitate',
          options: communityOptions,
          empty: 'Nu există nicio comunitate disponibilă.'
        };
      case 'pipeline':
        return {
          label: 'Etapă de pipeline',
          options: pipelineStages,
          empty: 'Nu există nicio etapă disponibilă.'
        };
      default:
        return null;
    }
  };

  return (
    <div className="px-6 py-6">
      <div className="grid gap-0 rounded-lg border border-slate-200 lg:grid-cols-2">
        {/* Trigger */}
        <div className="border-b border-slate-200 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between gap-3 bg-slate-50 px-5 py-5">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 text-ink-500">
                <ZapIcon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-display text-lg font-extrabold tracking-tight text-ink">
                  Trigger
                </p>
                <p className="text-sm text-ink-500">Când asta se întâmplă..</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPickingTrigger(true)}
              aria-label="Adaugă trigger"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-white transition-colors duration-150 ease-out hover:bg-brand-600">
              
              <PlusIcon className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
            </button>
          </div>

          <div className="px-5 py-5">
            {!trigger ?
            <p className="py-8 text-center text-sm text-ink-500">
                Niciun trigger selectat. Apasă „+” pentru a alege evenimentul
                care pornește regula.
              </p> :

            <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-base font-bold text-ink">
                      {
                    triggerOptions.find((item) => item.kind === trigger)?.
                    label
                    }
                    </p>
                    <p className="mt-0.5 text-sm text-ink-500">
                      {
                    triggerOptions.find((item) => item.kind === trigger)?.
                    description
                    }
                    </p>
                  </div>
                  <button
                  type="button"
                  onClick={() => setTrigger(null)}
                  aria-label="Șterge triggerul"
                  className="rounded-md p-1 text-ink-400 transition-colors duration-150 ease-out hover:bg-slate-100 hover:text-ink">
                  
                    <XIcon className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>

                <label className="mt-4 block text-sm font-bold text-ink-700">
                  Funnel step<span className="text-red-500"> *</span>
                  <select
                  value={triggerStep}
                  onChange={(event) => setTriggerStep(event.target.value)}
                  className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3.5 py-3 text-base font-semibold text-ink outline-none focus:border-brand-400">
                  
                    <option value="">Alege pasul…</option>
                    {steps.map((item) =>
                  <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                  )}
                  </select>
                </label>

                {trigger === 'form' &&
              <div className="mt-4 overflow-hidden rounded-md border border-slate-200">
                    <div className="flex">
                      <button
                    type="button"
                    onClick={() => setTriggerSource('submit')}
                    className={`flex flex-1 items-center justify-center gap-2 px-3 py-3 text-[15px] font-semibold transition-colors duration-150 ease-out ${
                    triggerSource === 'submit' ?
                    'bg-brand-50 text-brand-700' :
                    'text-ink-500 hover:bg-slate-50'}`
                    }>
                    
                        <span
                      className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                      triggerSource === 'submit' ?
                      'border-emerald-500 bg-emerald-500 text-white' :
                      'border-slate-300'}`
                      }>
                      
                          {triggerSource === 'submit' &&
                      <CheckIcon
                        className="h-3 w-3"
                        strokeWidth={3}
                        aria-hidden="true" />

                      }
                        </span>
                        Buton submit
                      </button>
                      <button
                    type="button"
                    disabled={attachedForms.length === 0}
                    onClick={() => setTriggerSource('form')}
                    className={`flex flex-1 items-center justify-center gap-2 border-l border-slate-200 px-3 py-3 text-[15px] font-semibold transition-colors duration-150 ease-out disabled:cursor-not-allowed disabled:text-ink-400 ${
                    triggerSource === 'form' ?
                    'bg-brand-50 text-brand-700' :
                    'text-ink-500'}`
                    }>
                    
                        <span className="flex h-4 w-4 items-center justify-center rounded-full border border-slate-300" />
                        Formular atașat
                      </button>
                    </div>
                    <p className="border-t border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-ink-500">
                      {attachedForms.length === 0 ?
                  'Nu există niciun formular atașat în acest funnel.' :
                  'Se declanșează când contactul completează formularul atașat.'}
                    </p>
                  </div>
              }
              </div>
            }
          </div>
        </div>

        {/* Action */}
        <div className="relative">
          <span
            aria-hidden="true"
            className="absolute -left-4 top-11 hidden h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-ink-500 shadow-sm lg:flex">
            
            <ArrowRightIcon className="h-4 w-4" />
          </span>
          <div className="flex items-center justify-between gap-3 bg-slate-50 px-5 py-5">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 text-ink-500">
                <ZapIcon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-display text-lg font-extrabold tracking-tight text-ink">
                  Acțiune
                </p>
                <p className="text-sm text-ink-500">..fă asta</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPickingAction(true)}
              aria-label="Adaugă acțiune"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-white transition-colors duration-150 ease-out hover:bg-brand-600">
              
              <PlusIcon className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
            </button>
          </div>

          <div className="space-y-4 px-5 py-5">
            {actions.length === 0 ?
            <p className="py-8 text-center text-sm text-ink-500">
                Nicio acțiune selectată. Poți adăuga mai multe acțiuni pentru
                același trigger.
              </p> :

            actions.map((action) => {
              const config = optionsFor(action);
              return (
                <div
                  key={action.uid}
                  className="rounded-md border border-slate-200 p-4">
                  
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-display text-base font-bold text-ink">
                          {action.option.label}
                        </p>
                        <p className="mt-0.5 text-sm text-ink-500">
                          {action.option.description}
                        </p>
                      </div>
                      <button
                      type="button"
                      onClick={() =>
                      setActions((current) =>
                      current.filter((item) => item.uid !== action.uid)
                      )
                      }
                      aria-label={`Șterge acțiunea ${action.option.label}`}
                      className="rounded-md p-1 text-ink-400 transition-colors duration-150 ease-out hover:bg-slate-100 hover:text-ink">
                      
                        <XIcon className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>

                    {config &&
                  <ConfigSelect
                    label={config.label}
                    options={config.options}
                    emptyMessage={config.empty}
                    value={action.value}
                    onChange={(value) =>
                    setActions((current) =>
                    current.map((item) =>
                    item.uid === action.uid ?
                    { ...item, value } :
                    item
                    )
                    )
                    }
                    onCreate={
                    action.option.config === 'tag' && onAddTag ?
                    onAddTag :
                    undefined
                    }
                    createLabel="Adaugă tag" />

                  }

                    {action.option.config === 'emailAddress' &&
                  <input
                    value={action.value}
                    onChange={(event) =>
                    setActions((current) =>
                    current.map((item) =>
                    item.uid === action.uid ?
                    { ...item, value: event.target.value } :
                    item
                    )
                    )
                    }
                    placeholder="adresa@companie.ro"
                    aria-label="Adresa de email"
                    className="mt-4 w-full rounded-md border border-slate-200 px-3.5 py-3 text-base text-ink outline-none focus:border-brand-400" />

                  }

                    {action.option.config === 'webhook' &&
                  <input
                    value={action.value}
                    onChange={(event) =>
                    setActions((current) =>
                    current.map((item) =>
                    item.uid === action.uid ?
                    { ...item, value: event.target.value } :
                    item
                    )
                    )
                    }
                    placeholder="https://…"
                    aria-label="URL webhook"
                    className="mt-4 w-full rounded-md border border-slate-200 px-3.5 py-3 text-base text-ink outline-none focus:border-brand-400" />

                  }

                    {(action.option.config === 'email' ||
                  action.option.config === 'sms') &&
                  <textarea
                    value={action.value}
                    onChange={(event) =>
                    setActions((current) =>
                    current.map((item) =>
                    item.uid === action.uid ?
                    { ...item, value: event.target.value } :
                    item
                    )
                    )
                    }
                    rows={3}
                    placeholder={
                    action.option.config === 'sms' ?
                    'Textul SMS-ului…' :
                    'Conținutul emailului…'
                    }
                    aria-label="Conținutul mesajului"
                    className="mt-4 w-full resize-y rounded-md border border-slate-200 px-3.5 py-3 text-base text-ink outline-none focus:border-brand-400" />

                  }
                  </div>);

            })
            }
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-end gap-3">
        <p className="mr-auto text-sm text-ink-500">
          {!complete ?
          'Completează toate câmpurile obligatorii pentru a salva regula.' :
          initial && dirty ?
          'Ai modificări nesalvate.' :
          'Regula este completă și poate fi salvată.'}
        </p>
        <button
          type="button"
          disabled={!complete || !dirty}
          onClick={() =>
          onSave(
            current,
            `${
            triggerOptions.find((item) => item.kind === trigger)?.label ?? ''} → ${
            actions.map((item) => item.option.label).join(', ')}`
          )
          }
          className="rounded-md bg-brand-500 px-5 py-3 font-display text-[15px] font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-slate-300">
          
          {initial ? 'Salvează modificările' : 'Salvează regula'}
        </button>
      </div>

      {pickingTrigger &&
      <PickerDialog
        title="Adaugă trigger"
        onClose={() => setPickingTrigger(false)}>
        
          <ul className="divide-y divide-slate-100">
            {triggerOptions.map((option) =>
          <li key={option.kind}>
                <button
              type="button"
              onClick={() => {
                setTrigger(option.kind);
                setPickingTrigger(false);
              }}
              className="w-full px-6 py-4 text-left transition-colors duration-150 ease-out hover:bg-slate-50">
              
                  <p className="font-display text-base font-bold text-ink">
                    {option.label}
                  </p>
                  <p className="mt-0.5 text-sm text-ink-500">
                    {option.description}
                  </p>
                </button>
              </li>
          )}
          </ul>
        </PickerDialog>
      }

      {pickingAction &&
      <PickerDialog
        title="Adaugă acțiune"
        hint="Poți selecta mai multe acțiuni pentru același trigger."
        onClose={() => setPickingAction(false)}>
        
          <ul className="divide-y divide-slate-100">
            {actionOptions.map((option) =>
          <li key={option.id}>
                <button
              type="button"
              onClick={() => addAction(option)}
              className="w-full px-6 py-4 text-left transition-colors duration-150 ease-out hover:bg-slate-50">
              
                  <p className="font-display text-base font-bold text-ink">
                    {option.label}
                  </p>
                  <p className="mt-0.5 text-sm text-ink-500">
                    {option.description}
                  </p>
                </button>
              </li>
          )}
          </ul>
        </PickerDialog>
      }
    </div>);

}

interface SavedRule {
  id: string;
  summary: string;
  state: RuleState;
}

/** Fila „Reguli automatizare”: listă goală → constructor pe tot ecranul */
export function FunnelAutomations(props: FunnelAutomationsProps) {
  const [rules, setRules] = useState<SavedRule[]>([]);
  const [building, setBuilding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState('');
  const editing = rules.find((rule) => rule.id === editingId) ?? null;

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2500);
  };

  return (
    <>
      {rules.length === 0 ?
      <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-ink-400">
            <ZapIcon className="h-8 w-8" aria-hidden="true" />
          </span>
          <p className="mt-5 font-display text-xl font-extrabold tracking-tight text-ink">
            Nu ai nicio automatizare
          </p>
          <p className="mt-1 max-w-sm text-sm text-ink-500">
            Creează o regulă care pornește dintr-un eveniment din funnel și
            execută automat una sau mai multe acțiuni.
          </p>
          <button
          type="button"
          onClick={() => setBuilding(true)}
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-brand-500 px-5 py-3 font-display text-[15px] font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600">
          
            <PlusIcon className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
            Creează o automatizare
          </button>
        </div> :

      <div className="px-6 py-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-display text-lg font-extrabold tracking-tight text-ink">
              Reguli active · {rules.length}
            </h3>
            <button
            type="button"
            onClick={() => setBuilding(true)}
            className="inline-flex items-center gap-2 rounded-md bg-brand-500 px-4 py-2.5 font-display text-[15px] font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600">
            
              <PlusIcon
              className="h-4 w-4"
              strokeWidth={2.5}
              aria-hidden="true" />
            
              Creează o automatizare
            </button>
          </div>
          <ul className="mt-4 divide-y divide-slate-100 overflow-hidden rounded-md border border-slate-200">
            {rules.map((rule) =>
          <li
            key={rule.id}
            className="group flex items-center justify-between gap-3 transition-colors duration-150 ease-out hover:bg-brand-50">
            
                <button
              type="button"
              onClick={() => setEditingId(rule.id)}
              className="flex-1 px-4 py-4 text-left font-display text-[15px] font-bold text-ink transition-colors duration-150 ease-out group-hover:text-brand-600">
              
                  {rule.summary}
                </button>
                <button
              type="button"
              onClick={() => {
                setRules((current) =>
                current.filter((item) => item.id !== rule.id)
                );
                notify('Automatizare eliminată cu succes');
              }}
              aria-label="Șterge regula"
              className="mr-3 rounded-md p-1.5 text-ink-400 transition-colors duration-150 ease-out hover:bg-slate-100 hover:text-red-600">
              
                  <XIcon className="h-4 w-4" aria-hidden="true" />
                </button>
              </li>
          )}
          </ul>
        </div>
      }

      {(building || editing) &&
      <div className="fixed inset-0 z-40 overflow-y-auto bg-white">
          <div className="mx-auto max-w-6xl px-8 py-8">
            <div className="flex items-start justify-between gap-4">
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink">
                {editing ?
              'Editează regula de automatizare' :
              'Creează regulă de automatizare'}
              </h2>
              <button
              type="button"
              onClick={() => {
                setBuilding(false);
                setEditingId(null);
              }}
              aria-label="Închide"
              className="rounded-md p-2 text-ink-500 transition-colors duration-150 ease-out hover:bg-slate-100 hover:text-ink">
              
                <XIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="-mx-6 mt-4">
              <RuleBuilder
              key={editing?.id ?? 'new'}
              {...props}
              initial={editing?.state}
              onSave={(state, summary) => {
                if (editing) {
                  setRules((current) =>
                  current.map((item) =>
                  item.id === editing.id ?
                  { ...item, state, summary } :
                  item
                  )
                  );
                  setEditingId(null);
                  notify('Automatizare modificată cu succes');
                  return;
                }
                setRules((current) => [
                ...current,
                { id: `rule-${Date.now()}`, summary, state }]
                );
                setBuilding(false);
                notify('Automatizare adăugată cu succes');
              }} />
            
            </div>
          </div>
        </div>
      }

      {toast && <Toast message={toast} />}
    </>);

}