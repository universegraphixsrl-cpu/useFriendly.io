import React from 'react';
import { CheckIcon, LoaderIcon, AlertTriangleIcon } from 'lucide-react';
import { automationRuns, type AutomationRun } from '../../data/automations';

const statusConfig: Record<
  AutomationRun['status'],
  {icon: typeof CheckIcon;className: string;}> =
{
  Succes: { icon: CheckIcon, className: 'bg-emerald-50 text-emerald-700' },
  'În curs': { icon: LoaderIcon, className: 'bg-brand-50 text-brand-700' },
  Eroare: { icon: AlertTriangleIcon, className: 'bg-red-50 text-red-700' }
};

export function AutomationActivity() {
  return (
    <section
      aria-labelledby="activity-title"
      className="rounded-2xl border border-slate-200 bg-white">
      
      <div className="border-b border-slate-100 px-5 py-4">
        <h2
          id="activity-title"
          className="font-display text-base font-extrabold tracking-tight text-ink">
          
          Jurnal de rulări
        </h2>
        <p className="text-xs text-ink-500">Astăzi · 312 acțiuni executate</p>
      </div>

      <ul className="divide-y divide-slate-100">
        {automationRuns.map((run) => {
          const config = statusConfig[run.status];
          return (
            <li key={`${run.time}-${run.detail}`} className="flex gap-3 px-5 py-4">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${config.className}`}>
                
                <config.icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <p className="truncate font-display text-sm font-bold text-ink">
                    {run.rule}
                  </p>
                  <span className="ml-auto shrink-0 text-xs text-ink-500">
                    {run.time}
                  </span>
                </div>
                <p className="mt-0.5 text-xs leading-relaxed text-ink-500">
                  {run.detail}
                </p>
                {run.status === 'Eroare' &&
                <button
                  type="button"
                  className="mt-2 rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-bold text-red-700 transition-colors duration-150 ease-out hover:bg-red-100">
                  
                    Reconectează Stripe
                  </button>
                }
              </div>
            </li>);

        })}
      </ul>

      <div className="border-t border-slate-100 px-5 py-3">
        <button
          type="button"
          className="text-sm font-bold text-brand-600 underline-offset-4 hover:underline">
          
          Vezi tot jurnalul →
        </button>
      </div>
    </section>);

}