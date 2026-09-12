import React, { useState } from 'react';
import {
  UsersIcon,
  MailIcon,
  MessageSquareIcon,
  PlusIcon,
  Trash2Icon,
  ChevronDownIcon,
  CheckIcon,
  XIcon,
  FlagIcon } from
'lucide-react';
import {
  flowAudiences,
  emailTemplate,
  smsTemplate,
  type FlowStep,
  type FlowStepChannel,
  type MarketingFlow } from
'../../data/marketing';
import { StepEditor } from './StepEditor';

interface FlowBuilderProps {
  flow: MarketingFlow;
  onSave: (flow: MarketingFlow) => void;
  onCancel: () => void;
}

const newStep = (channel: FlowStepChannel): FlowStep => {
  const template = channel === 'email' ? emailTemplate : smsTemplate;
  return {
    id: `step-${Date.now()}`,
    channel,
    delayDays: 1,
    sendAt: '10:00',
    subject: template.subject,
    body: template.body
  };
};

const stepLabel = (step: FlowStep, index: number) => {
  if (index === 0 && step.delayDays === 0) {
    return 'Instant, când intră în flux';
  }
  const when =
  step.delayDays === 0 ?
  'în aceeași zi' :
  `după ${step.delayDays} ${step.delayDays === 1 ? 'zi' : 'zile'}`;
  return `${when} · ${step.sendAt}`;
};

export function FlowBuilder({ flow, onSave, onCancel }: FlowBuilderProps) {
  const [draft, setDraft] = useState<MarketingFlow>(flow);
  const [openStep, setOpenStep] = useState<string | null>(
    flow.steps[0]?.id ?? null
  );

  const patchStep = (id: string, patch: Partial<FlowStep>) =>
  setDraft((current) => ({
    ...current,
    steps: current.steps.map((step) =>
    step.id === id ? { ...step, ...patch } : step
    )
  }));

  const addStep = (channel: FlowStepChannel) => {
    const step = newStep(channel);
    setDraft((current) => ({ ...current, steps: [...current.steps, step] }));
    setOpenStep(step.id);
  };

  const removeStep = (id: string) =>
  setDraft((current) => ({
    ...current,
    steps: current.steps.filter((step) => step.id !== id)
  }));

  return (
    <section
      aria-labelledby="flow-builder-title"
      className="mt-6 rounded-2xl border border-brand-200 bg-white p-5 sm:p-6">
      
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2
            id="flow-builder-title"
            className="font-display text-lg font-extrabold tracking-tight text-ink">
            
            Constructor de flux
          </h2>
          <p className="text-xs text-ink-500">
            Fiecare pas trimite un email sau un SMS la ora stabilită. Poți
            adăuga oricâți pași.
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-500 transition-colors duration-150 ease-out hover:bg-slate-50 hover:text-ink"
          aria-label="Închide constructorul">
          
          <XIcon className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="flowName"
            className="text-[11px] font-bold uppercase tracking-wide text-ink-500">
            
            Numele fluxului *
          </label>
          <input
            id="flowName"
            type="text"
            value={draft.name}
            autoFocus
            onChange={(event) =>
            setDraft((current) => ({ ...current, name: event.target.value }))
            }
            placeholder="Ex.: Follow-up webinar → book a call"
            className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold text-ink placeholder:font-normal placeholder:text-ink-500 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100" />
          
        </div>
        <div>
          <label
            htmlFor="flowAudience"
            className="text-[11px] font-bold uppercase tracking-wide text-ink-500">
            
            Cine primește mesajele
          </label>
          <select
            id="flowAudience"
            value={draft.audience}
            onChange={(event) =>
            setDraft((current) => ({
              ...current,
              audience: event.target.value
            }))
            }
            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-ink focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100">
            
            {flowAudiences.map((audience) =>
            <option key={audience} value={audience}>
                {audience}
              </option>
            )}
          </select>
        </div>
      </div>

      {/* Funnel liniar */}
      <ol className="mt-6 space-y-0">
        <li>
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-white">
              <UsersIcon className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-[11px] font-bold uppercase tracking-wide text-ink-500">
                Punct de intrare
              </span>
              <span className="block truncate font-display text-sm font-bold text-ink">
                {draft.audience}
              </span>
            </span>
          </div>
        </li>

        {draft.steps.map((step, index) => {
          const expanded = openStep === step.id;
          const Icon = step.channel === 'email' ? MailIcon : MessageSquareIcon;
          return (
            <li key={step.id}>
              <span
                className="ml-[1.375rem] block h-6 w-px bg-slate-300"
                aria-hidden="true" />
              
              <div
                className={`rounded-xl border bg-white ${
                expanded ? 'border-brand-300' : 'border-slate-200'}`
                }>
                
                <div className="flex items-center gap-3 px-4 py-3.5">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${
                    step.channel === 'email' ?
                    'bg-brand-50 text-brand-700' :
                    'bg-amber-50 text-amber-700'}`
                    }>
                    
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <button
                    type="button"
                    onClick={() => setOpenStep(expanded ? null : step.id)}
                    aria-expanded={expanded}
                    className="min-w-0 flex-1 text-left">
                    
                    <span className="block text-[11px] font-bold uppercase tracking-wide text-ink-500">
                      Pasul {index + 1} ·{' '}
                      {step.channel === 'email' ? 'Email' : 'SMS'}
                    </span>
                    <span className="block truncate font-display text-sm font-bold text-ink">
                      {step.subject || 'Fără subiect'}
                    </span>
                    <span className="block text-xs text-ink-500">
                      {stepLabel(step, index)}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => removeStep(step.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-500 transition-colors duration-150 ease-out hover:bg-red-50 hover:text-red-600"
                    aria-label={`Șterge pasul ${index + 1}`}>
                    
                    <Trash2Icon className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpenStep(expanded ? null : step.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-500 transition-colors duration-150 ease-out hover:bg-slate-50 hover:text-ink"
                    aria-label={expanded ? 'Închide pasul' : 'Editează pasul'}>
                    
                    <ChevronDownIcon
                      className={`h-4 w-4 transition-transform duration-150 ease-out ${expanded ? 'rotate-180' : ''}`}
                      aria-hidden="true" />
                    
                  </button>
                </div>

                {expanded &&
                <StepEditor
                  step={step}
                  index={index}
                  onChange={(patch) => patchStep(step.id, patch)} />

                }
              </div>
            </li>);

        })}

        <li>
          <span
            className="ml-[1.375rem] block h-6 w-px bg-slate-300"
            aria-hidden="true" />
          
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-3.5">
            <span className="mr-1 text-[11px] font-bold uppercase tracking-wide text-ink-500">
              Adaugă pasul {draft.steps.length + 1}
            </span>
            <button
              type="button"
              onClick={() => addStep('email')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-ink-700 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
              
              <PlusIcon className="h-3.5 w-3.5" aria-hidden="true" />
              <MailIcon className="h-3.5 w-3.5" aria-hidden="true" />
              Email
            </button>
            <button
              type="button"
              onClick={() => addStep('sms')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-ink-700 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
              
              <PlusIcon className="h-3.5 w-3.5" aria-hidden="true" />
              <MessageSquareIcon className="h-3.5 w-3.5" aria-hidden="true" />
              SMS
            </button>
          </div>
        </li>

        <li>
          <span
            className="ml-[1.375rem] block h-6 w-px bg-slate-300"
            aria-hidden="true" />
          
          <div className="flex items-center gap-3 rounded-xl bg-ink px-4 py-3.5 text-white">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
              <FlagIcon className="h-4 w-4" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-[11px] font-bold uppercase tracking-wide text-white/60">
                Final
              </span>
              <span className="block font-display text-sm font-bold">
                Contactul iese din flux după {draft.steps.length}{' '}
                {draft.steps.length === 1 ? 'mesaj' : 'mesaje'}
              </span>
            </span>
          </div>
        </li>
      </ol>

      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
        <button
          type="button"
          disabled={draft.name.trim().length === 0 || draft.steps.length === 0}
          onClick={() => onSave({ ...draft, name: draft.name.trim() })}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-3.5 py-2.5 font-display text-sm font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600 disabled:bg-slate-200 disabled:text-ink-500">
          
          <CheckIcon className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
          Salvează fluxul
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm font-semibold text-ink-500 underline-offset-4 hover:text-ink-700 hover:underline">
          
          Anulează
        </button>
      </div>
    </section>);

}