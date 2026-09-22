import React from 'react';
import { PlusIcon, PlayCircleIcon, ArrowRightIcon } from 'lucide-react';

interface WelcomeDashboardProps {
  /** Prenumele celui care s-a înscris */
  name: string;
  /** Deschide lista completă de module */
  onOpenModules: () => void;
  onOpenTutorials: () => void;
}

/** Panoul general al unui cont nou: gol, cu invitația de a adăuga module */
export function WelcomeDashboard({
  name,
  onOpenModules,
  onOpenTutorials
}: WelcomeDashboardProps) {
  return (
    <div className="mx-auto max-w-3xl py-10 text-center">
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        Bun venit în Friendly{name ? `, ${name}` : ''}
      </h1>
      <p className="mx-auto mt-3 max-w-xl text-lg leading-relaxed text-ink-500">
        Contul tău e gol, exact cum trebuie. Alege primele module de lucru —
        leaduri, calendare, automatizări, web builder — și meniul din stânga se
        construiește în jurul lor.
      </p>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onOpenModules}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3.5 font-display text-[15px] font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600">
          
          <PlusIcon className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
          Proiect nou
        </button>
        <button
          type="button"
          onClick={onOpenTutorials}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 font-display text-[15px] font-bold text-ink transition-colors duration-150 ease-out hover:border-ink-500">
          
          <PlayCircleIcon className="h-4 w-4" aria-hidden="true" />
          Vezi tutorialele
        </button>
      </div>

      <button
        type="button"
        onClick={onOpenModules}
        className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition-colors duration-150 ease-out hover:text-brand-700">
        
        Alege-ți primele meniuri de lucru
        <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>);

}