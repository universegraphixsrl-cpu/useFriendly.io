import React from 'react';
import { PlayIcon, PlusIcon, XIcon, ClockIcon } from 'lucide-react';
import type { CrmModule } from '../data/modules';

interface ModuleWorkspaceProps {
  module: CrmModule;
  showTutorial: boolean;
  onDismissTutorial: () => void;
}

export function ModuleWorkspace({
  module,
  showTutorial,
  onDismissTutorial
}: ModuleWorkspaceProps) {
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-xl ring-1 ring-slate-200"
            aria-hidden="true">
            
            {module.emoji}
          </span>
          <div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              {module.name}
            </h1>
            <p className="mt-0.5 text-sm text-ink-700">{module.description}</p>
          </div>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-3.5 py-2.5 font-display text-sm font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600">
          
          <PlusIcon className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
          Creează funcție nouă
        </button>
      </div>

      {showTutorial &&
      <section
        aria-labelledby="tutorial-title"
        className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        
          <div className="flex flex-col lg:flex-row">
            <div className="relative flex aspect-video items-center justify-center bg-ink lg:aspect-auto lg:w-[420px] lg:shrink-0">
              <div
              className="dot-grid absolute inset-0 text-white/10"
              aria-hidden="true" />
            
              <button
              type="button"
              className="relative flex h-16 w-16 items-center justify-center rounded-full bg-brand-500 text-white transition-colors duration-150 ease-out hover:bg-brand-400"
              aria-label={`Redă tutorialul pentru ${module.name}`}>
              
                <PlayIcon className="h-6 w-6" aria-hidden="true" />
              </button>
              <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 text-xs font-semibold text-white">
                <ClockIcon className="h-3.5 w-3.5" aria-hidden="true" />
                2:14
              </span>
            </div>

            <div className="flex flex-1 flex-col p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-xs font-bold uppercase tracking-wide text-brand-600">
                    Tutorial
                  </p>
                  <h2
                  id="tutorial-title"
                  className="mt-1.5 font-display text-xl font-extrabold tracking-tight text-ink">
                  
                    Ce poți face aici
                  </h2>
                </div>
                <button
                type="button"
                onClick={onDismissTutorial}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-500 transition-colors duration-150 ease-out hover:bg-slate-50 hover:text-ink"
                aria-label="Închide tutorialul">
                
                  <XIcon className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-700">
                În 2 minute vezi cum se configurează modulul „{module.name}”: ce
                declanșatori are, cum îl conectezi la pipeline și ce rapoarte
                generează pentru echipă. Poți începe de la zero sau dintr-un
                șablon.
              </p>

              <div className="mt-auto flex flex-wrap items-center gap-3 pt-5">
                <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-3.5 py-2.5 font-display text-sm font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600">
                
                  <PlusIcon
                  className="h-4 w-4"
                  strokeWidth={2.5}
                  aria-hidden="true" />
                
                  Creează funcție nouă
                </button>
                <button
                type="button"
                onClick={onDismissTutorial}
                className="text-xs font-semibold text-ink-500 underline-offset-4 transition-colors duration-150 ease-out hover:text-ink-700 hover:underline">
                
                  Nu mai afișa tutorialul
                </button>
              </div>
            </div>
          </div>
        </section>
      }

      <section
        aria-labelledby="empty-title"
        className="mt-6 flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
        
        <span
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-xl"
          aria-hidden="true">
          
          {module.emoji}
        </span>
        <h2
          id="empty-title"
          className="mt-4 font-display text-lg font-extrabold tracking-tight text-ink">
          
          Nicio funcție configurată încă
        </h2>
        <p className="mt-1.5 max-w-md text-sm leading-relaxed text-ink-500">
          Modulul este activ în meniu, dar gol. Creează prima funcție ca să
          începi să colectezi date din pipeline.
        </p>
        <button
          type="button"
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 font-display text-sm font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600">
          
          <PlusIcon className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
          Creează funcție nouă
        </button>
      </section>
    </>);

}