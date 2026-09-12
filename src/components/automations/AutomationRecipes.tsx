import React from 'react';
import { SparklesIcon, ArrowRightIcon } from 'lucide-react';
import { automationRecipes } from '../../data/automations';

export function AutomationRecipes() {
  return (
    <section
      aria-labelledby="recipes-title"
      className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <SparklesIcon className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
          <div>
            <h2
              id="recipes-title"
              className="font-display text-base font-extrabold tracking-tight text-ink">
              
              Șabloane gata de pornit
            </h2>
            <p className="text-xs text-ink-500">
              Activezi într-un click, apoi ajustezi pașii
            </p>
          </div>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 underline-offset-4 hover:underline">
          
          Vezi toate cele 42 de șabloane
          <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <ul className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {automationRecipes.map((recipe) =>
        <li key={recipe.title} className="flex">
            <button
            type="button"
            className="flex w-full flex-col rounded-xl border border-slate-200 p-4 text-left transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50">
            
              <span className="text-[11px] font-bold uppercase tracking-wide text-ink-500">
                {recipe.badge}
              </span>
              <span className="mt-1.5 font-display text-sm font-bold leading-snug text-ink">
                {recipe.title}
              </span>
              <span className="mt-1 text-xs leading-relaxed text-ink-500">
                {recipe.description}
              </span>
              <span className="mt-auto pt-3 text-xs font-bold text-brand-600">
                Folosește șablonul →
              </span>
            </button>
          </li>
        )}
      </ul>
    </section>);

}