import React from 'react';
import { PlusIcon, BookOpenIcon, ActivityIcon } from 'lucide-react';
import { AutomationBuilderPreview } from '../components/automations/AutomationBuilderPreview';
import { AutomationRecipes } from '../components/automations/AutomationRecipes';
import { AutomationList } from '../components/automations/AutomationList';
import { AutomationActivity } from '../components/automations/AutomationActivity';

const stats = [
{
  label: 'Fluxuri active',
  value: '8',
  note: 'din 14 create în total'
},
{
  label: 'Acțiuni executate',
  value: '778',
  note: 'în ultimele 30 de zile'
},
{
  label: 'Ore economisite',
  value: '46 h',
  note: 'echivalent muncă manuală'
},
{
  label: 'Rată de succes',
  value: '96,4%',
  note: '1 flux necesită atenție'
}];


export function Automations() {
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Automatizări
          </h1>
          <p className="mt-1 text-sm text-ink-700">
            Declanșatori, condiții și acțiuni care duc leadul de la formular
            până la contract, fără intervenție manuală.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-ink-700 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
            
            <BookOpenIcon className="h-4 w-4" aria-hidden="true" />
            Bibliotecă de șabloane
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-ink-700 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
            
            <ActivityIcon className="h-4 w-4" aria-hidden="true" />
            Jurnal complet
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-3 py-2 text-sm font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600">
            
            <PlusIcon className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
            Automatizare nouă
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        <div className="grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) =>
          <div key={stat.label} className="bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-ink-500">
                {stat.label}
              </p>
              <p className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-ink-500">{stat.note}</p>
            </div>
          )}
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <AutomationBuilderPreview />
          </div>
          <AutomationActivity />
        </div>

        <AutomationRecipes />

        <AutomationList />
      </div>
    </>);

}