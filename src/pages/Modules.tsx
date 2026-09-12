import React, { useMemo, useState } from 'react';
import {
  SearchIcon,
  PlusIcon,
  SparklesIcon,
  EyeIcon,
  CheckIcon } from
'lucide-react';
import { crmModules, type CrmModule } from '../data/modules';

type Filter = 'Toate' | CrmModule['category'];

const filters: Filter[] = [
'Toate',
'Vânzări',
'Marketing',
'Livrare',
'Financiar',
'Echipă',
'Date'];


interface ModulesProps {
  addedModules: CrmModule[];
  onAddModule: (module: CrmModule) => void;
  onPreviewModule: (module: CrmModule) => void;
}

export function Modules({
  addedModules,
  onAddModule,
  onPreviewModule
}: ModulesProps) {
  const [filter, setFilter] = useState<Filter>('Toate');
  const addedNames = addedModules.map((module) => module.name);

  const visibleModules = useMemo(
    () =>
    filter === 'Toate' ?
    crmModules :
    crmModules.filter((module) => module.category === filter),
    [filter]
  );

  return (
    <>
      <div className="max-w-2xl">
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3.5 py-1.5 font-display text-xs font-bold uppercase tracking-wide text-brand-600">
          <SparklesIcon className="h-3.5 w-3.5" aria-hidden="true" />
          {crmModules.length} module disponibile
        </span>
        <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
          Alege-ți proiectul potrivit pentru tine
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-700">
          Fiecare modul se adaugă în meniul din stânga, lângă Calendar,
          Automatizări și Rapoarte. Poți porni cu unul singur și extinde pe
          măsură ce crește echipa.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-xs">
          <SearchIcon
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500"
            aria-hidden="true" />
          
          <input
            type="search"
            placeholder="Caută un modul…"
            aria-label="Caută un modul"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-ink placeholder:text-ink-500 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100" />
          
        </div>

        <div className="flex flex-wrap gap-2">
          {filters.map((item) =>
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            aria-pressed={filter === item}
            className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors duration-150 ease-out ${
            filter === item ?
            'bg-ink text-white' :
            'border border-slate-200 bg-white text-ink-700 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700'}`
            }>
            
              {item}
            </button>
          )}
        </div>
      </div>

      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visibleModules.map((module) =>
        <li key={module.name} className="flex">
            <div className="flex w-full flex-col rounded-2xl border border-slate-200 bg-white p-4 transition-colors duration-150 ease-out hover:border-brand-300">
              <div className="flex items-start justify-between gap-2">
                <span
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-lg"
                aria-hidden="true">
                
                  {module.emoji}
                </span>
                {module.badge &&
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                module.badge === 'Nou' ?
                'bg-emerald-50 text-emerald-700' :
                'bg-brand-100 text-brand-700'}`
                }>
                
                    {module.badge}
                  </span>
              }
              </div>

              <h2 className="mt-3 font-display text-sm font-bold leading-snug text-ink">
                {module.name}
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-ink-500">
                {module.description}
              </p>

              <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
                {addedNames.includes(module.name) ?
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-700">
                    <CheckIcon
                  className="h-3.5 w-3.5"
                  strokeWidth={2.5}
                  aria-hidden="true" />
                
                    În meniu
                  </span> :

              <button
                type="button"
                onClick={() => onAddModule(module)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-2.5 py-1.5 text-xs font-bold text-brand-700 transition-colors duration-150 ease-out hover:bg-brand-100">
                
                    <PlusIcon
                  className="h-3.5 w-3.5"
                  strokeWidth={2.5}
                  aria-hidden="true" />
                
                    Adaugă în meniu
                  </button>
              }
                <button
                type="button"
                onClick={() => onPreviewModule(module)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-ink-700 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
                
                  <EyeIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  Vezi utilitatea
                </button>
              </div>
            </div>
          </li>
        )}
      </ul>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-ink px-6 py-6 text-white">
        <div>
          <p className="font-display text-lg font-extrabold tracking-tight">
            Nu găsești modulul de care ai nevoie?
          </p>
          <p className="mt-1 text-sm text-slate-300">
            Îl construim pe procesul tău, folosind aceleași date din pipeline.
          </p>
        </div>
        <button
          type="button"
          className="rounded-lg bg-brand-500 px-4 py-2.5 font-display text-sm font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-400">
          
          Cere un modul personalizat
        </button>
      </div>
    </>);

}