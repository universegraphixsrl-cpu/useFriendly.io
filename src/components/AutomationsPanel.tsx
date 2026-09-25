import React from 'react';
import { ZapIcon, PlusIcon, PlayIcon, PencilIcon } from 'lucide-react';
import { automations as demoAutomations } from '../data/crm';
import { supabaseConfigured } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useUiActions } from '../contexts/UiActionsContext';
import { viewPath } from '../appRoutes';

export function AutomationsPanel() {
  const navigate = useNavigate();
  const { runLabel, notify } = useUiActions();

  /**
   * Automatizările nu sunt încă salvate în baza de date, deci un cont
   * real pornește fără niciuna. Exemplele rămân doar la lucrul local,
   * pe date fictive.
   */
  const automations = supabaseConfigured ? [] : demoAutomations;

  return (
    <section
      aria-labelledby="automations-title"
      className="rounded-2xl border border-slate-200 bg-white">
      
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <ZapIcon className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
          <div>
            <h2
              id="automations-title"
              className="font-display text-base font-extrabold tracking-tight text-ink">
              
              Automatizări
            </h2>
            <p className="text-xs text-ink-500">8 active · 171 rulări</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate(viewPath.automations)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-ink-700 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
          
          <PlusIcon className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
          Nouă
        </button>
      </div>

      {automations.length === 0 &&
      <p className="px-5 py-6 text-sm text-ink-500">
          Nicio automatizare încă. Apasă pe „Nouă” ca să construiești prima:
          alegi un declanșator și ce se întâmplă după el.
        </p>
      }

      <ul className="divide-y divide-slate-100">
        {automations.map((automation) =>
        <li key={automation.name} className="px-5 py-4">
            <div className="flex items-start justify-between gap-3">
              <p className="font-display text-sm font-bold text-ink">
                {automation.name}
              </p>
              <span
              className={`mt-0.5 flex h-5 w-9 shrink-0 items-center rounded-full px-0.5 ${
              automation.active ? 'bg-brand-500' : 'bg-slate-200'}`
              }
              role="img"
              aria-label={automation.active ? 'Activă' : 'Oprită'}>
              
                <span
                className={`h-4 w-4 rounded-full bg-white transition-transform duration-150 ease-out ${
                automation.active ? 'translate-x-4' : 'translate-x-0'}`
                } />
              
              </span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-ink-500">
              {automation.trigger}
            </p>
            <div className="mt-2.5 flex items-center gap-2">
              <button
              type="button"
              onClick={() => runLabel('Editează automatizare', automation.name)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-ink-700 transition-colors duration-150 ease-out hover:bg-brand-50 hover:text-brand-700">
              
                <PencilIcon className="h-3.5 w-3.5" aria-hidden="true" />
                Editează
              </button>
              <button
              type="button"
              onClick={() => notify(`${automation.name} a pornit`)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-ink-700 transition-colors duration-150 ease-out hover:bg-brand-50 hover:text-brand-700">
              
                <PlayIcon className="h-3.5 w-3.5" aria-hidden="true" />
                Rulează acum
              </button>
              <span className="ml-auto text-[11px] text-ink-500">
                {automation.runs}
              </span>
            </div>
          </li>
        )}
      </ul>
    </section>);

}