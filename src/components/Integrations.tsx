import React from 'react';
import {
  MailIcon,
  CalendarIcon,
  MessageCircleIcon,
  CreditCardIcon,
  HashIcon,
  MegaphoneIcon,
  WorkflowIcon,
  FileSpreadsheetIcon,
  PlugIcon,
  ArrowRightIcon } from
'lucide-react';
import { integrations, type Integration } from '../data/crm';

const icons = [
MailIcon,
CalendarIcon,
MessageCircleIcon,
CreditCardIcon,
HashIcon,
MegaphoneIcon,
WorkflowIcon,
FileSpreadsheetIcon];


const statusStyles: Record<Integration['status'], string> = {
  Conectat: 'bg-emerald-50 text-emerald-700',
  Disponibil: 'bg-slate-100 text-ink-700',
  'Necesită atenție': 'bg-amber-50 text-amber-700'
};

export function Integrations() {
  return (
    <section
      aria-labelledby="integrations-title"
      className="rounded-2xl border border-slate-200 bg-white">
      
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <PlugIcon className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
          <div>
            <h2
              id="integrations-title"
              className="font-display text-base font-extrabold tracking-tight text-ink">
              
              Integrări
            </h2>
            <p className="text-xs text-ink-500">
              5 conectate · 1 necesită atenție
            </p>
          </div>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-ink-700 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
          
          Explorează catalogul
          <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <ul className="grid gap-px bg-slate-100 sm:grid-cols-2 xl:grid-cols-4">
        {integrations.map((integration, index) => {
          const Icon = icons[index % icons.length];
          const connected = integration.status === 'Conectat';
          return (
            <li key={integration.name} className="flex bg-white p-5">
              <div className="flex w-full flex-col">
                <div className="flex items-start justify-between gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-ink-700">
                    <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${statusStyles[integration.status]}`}>
                    
                    {integration.status}
                  </span>
                </div>
                <p className="mt-3 font-display text-sm font-bold text-ink">
                  {integration.name}
                </p>
                <p className="text-xs text-ink-500">{integration.category}</p>
                <p className="mt-2 text-xs leading-relaxed text-ink-500">
                  {integration.detail}
                </p>
                <button
                  type="button"
                  className={`mt-auto pt-4 text-left text-sm font-bold underline-offset-4 hover:underline ${
                  connected ? 'text-ink-700' : 'text-brand-600'}`
                  }>
                  
                  {connected ? 'Configurează' : 'Conectează'} →
                </button>
              </div>
            </li>);

        })}
      </ul>
    </section>);

}