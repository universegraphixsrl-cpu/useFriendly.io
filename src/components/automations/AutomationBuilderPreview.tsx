import React from 'react';
import {
  PlayIcon,
  GitBranchIcon,
  MailIcon,
  CalendarClockIcon,
  BellRingIcon,
  PlusIcon,
  SlidersHorizontalIcon } from
'lucide-react';

const steps = [
{
  kind: 'Declanșator',
  title: 'Formular „Book a call” trimis',
  meta: 'Sursă: webinar · landing page',
  icon: PlayIcon
},
{
  kind: 'Condiție',
  title: 'Dacă bugetul declarat este peste 3.000 €',
  meta: 'Altfel → trimite către setter',
  icon: GitBranchIcon
},
{
  kind: 'Acțiune',
  title: 'Atribuie closerul cu cea mai mică încărcare',
  meta: 'Rotație echilibrată în echipa de vânzări',
  icon: CalendarClockIcon
},
{
  kind: 'Acțiune',
  title: 'Trimite confirmarea și linkul de calendar',
  meta: 'Email + WhatsApp, șablon „Confirmare apel”',
  icon: MailIcon
},
{
  kind: 'Acțiune',
  title: 'Reminder cu 1 oră înainte de apel',
  meta: 'SMS către lead, notificare către closer',
  icon: BellRingIcon
}];


export function AutomationBuilderPreview() {
  return (
    <section
      aria-labelledby="builder-title"
      className="rounded-2xl bg-ink p-6 text-white">
      
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-display text-xs font-bold uppercase tracking-wide text-brand-300">
            Constructor de flux
          </p>
          <h2
            id="builder-title"
            className="mt-2 font-display text-xl font-extrabold tracking-tight">
            
            Distribuie leadurile din webinar
          </h2>
          <p className="mt-1 text-sm text-slate-300">
            5 pași · rulată de 410 ori luna aceasta · 99% succes
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm font-semibold text-white transition-colors duration-150 ease-out hover:bg-white/10">
            
            <SlidersHorizontalIcon className="h-4 w-4" aria-hidden="true" />
            Testează fluxul
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-3 py-2 text-sm font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-400">
            
            <PlusIcon className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
            Adaugă pas
          </button>
        </div>
      </div>

      <ol className="mt-6 space-y-2">
        {steps.map((step, index) =>
        <li key={step.title}>
            <div className="flex items-center gap-4 rounded-xl bg-white/[0.06] px-4 py-3.5 ring-1 ring-white/10">
              <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
              step.kind === 'Declanșator' ?
              'bg-brand-500 text-white' :
              step.kind === 'Condiție' ?
              'bg-white/15 text-brand-200' :
              'bg-white/10 text-slate-200'}`
              }>
              
                <step.icon className="h-[18px] w-[18px]" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-wide text-brand-300">
                  {step.kind}
                </p>
                <p className="font-display text-sm font-bold">{step.title}</p>
                <p className="text-xs text-slate-400">{step.meta}</p>
              </div>
              <button
              type="button"
              className="hidden rounded-lg border border-white/15 px-2.5 py-1.5 text-xs font-semibold text-slate-200 transition-colors duration-150 ease-out hover:bg-white/10 sm:block">
              
                Editează
              </button>
            </div>
            {index !== steps.length - 1 &&
          <span
            className="ml-8 block h-3 w-px bg-white/20"
            aria-hidden="true" />

          }
          </li>
        )}
      </ol>
    </section>);

}