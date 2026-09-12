import React from 'react';
import {
  PlayIcon,
  GitBranchIcon,
  CornerDownRightIcon,
  CopyIcon,
  PencilIcon,
  HistoryIcon } from
'lucide-react';
import { automationRules, type AutomationRule } from '../../data/automations';

const categoryStyles: Record<AutomationRule['category'], string> = {
  Vânzări: 'bg-brand-50 text-brand-700',
  Facturare: 'bg-amber-50 text-amber-700',
  Onboarding: 'bg-emerald-50 text-emerald-700',
  Marketing: 'bg-violet-50 text-violet-700',
  Intern: 'bg-slate-100 text-ink-700'
};

export function AutomationList() {
  return (
    <section
      aria-labelledby="rules-title"
      className="rounded-2xl border border-slate-200 bg-white">
      
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div>
          <h2
            id="rules-title"
            className="font-display text-lg font-extrabold tracking-tight text-ink">
            
            Automatizările tale
          </h2>
          <p className="text-sm text-ink-500">
            6 fluxuri · 4 active · sortate după numărul de rulări
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {['Toate', 'Active', 'Oprite', 'Cu erori'].map((filter, index) =>
          <button
            key={filter}
            type="button"
            className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors duration-150 ease-out ${
            index === 0 ?
            'bg-ink text-white' :
            'border border-slate-200 text-ink-700 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700'}`
            }>
            
              {filter}
            </button>
          )}
        </div>
      </div>

      <ul className="divide-y divide-slate-100">
        {automationRules.map((rule) =>
        <li key={rule.name} className="px-5 py-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-base font-bold text-ink">
                    {rule.name}
                  </h3>
                  <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${categoryStyles[rule.category]}`}>
                  
                    {rule.category}
                  </span>
                </div>
                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-500">
                  {rule.description}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-ink-500">
                  {rule.active ? 'Activă' : 'Oprită'}
                </span>
                <span
                className={`flex h-6 w-11 items-center rounded-full px-0.5 ${
                rule.active ? 'bg-brand-500' : 'bg-slate-200'}`
                }
                role="img"
                aria-label={rule.active ? 'Activă' : 'Oprită'}>
                
                  <span
                  className={`h-5 w-5 rounded-full bg-white transition-transform duration-150 ease-out ${
                  rule.active ? 'translate-x-5' : 'translate-x-0'}`
                  } />
                
                </span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-2.5 py-1.5 font-semibold text-brand-700">
                <PlayIcon className="h-3.5 w-3.5" aria-hidden="true" />
                {rule.trigger}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5 font-semibold text-ink-700">
                <GitBranchIcon className="h-3.5 w-3.5" aria-hidden="true" />
                {rule.condition}
              </span>
              {rule.actions.map((action) =>
            <span
              key={action}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5 font-semibold text-ink-700">
              
                  <CornerDownRightIcon
                className="h-3.5 w-3.5 text-ink-500"
                aria-hidden="true" />
              
                  {action}
                </span>
            )}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ink-500">
              <span>
                <strong className="font-semibold text-ink">{rule.runs}</strong>{' '}
                rulări luna aceasta
              </span>
              <span>
                <strong className="font-semibold text-ink">
                  {rule.successRate}%
                </strong>{' '}
                rată de succes
              </span>
              <span>Ultima rulare: {rule.lastRun}</span>

              <div className="ml-auto flex items-center gap-2">
                <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 font-semibold text-ink-700 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
                
                  <PencilIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  Editează
                </button>
                <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 font-semibold text-ink-700 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
                
                  <CopyIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  Duplică
                </button>
                <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 font-semibold text-ink-700 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
                
                  <HistoryIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  Istoric
                </button>
              </div>
            </div>
          </li>
        )}
      </ul>
    </section>);

}