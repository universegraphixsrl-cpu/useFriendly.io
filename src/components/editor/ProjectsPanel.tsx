import React, { useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon, XIcon } from 'lucide-react';
import { funnels } from '../../data/funnels';

interface ProjectsPanelProps {
  /** Pasul deschis acum în editor, ca să fie marcat în listă */
  currentStepId: string | null;
  onOpenStep: (stepId: string, label: string) => void;
  onClose: () => void;
}

/** Panou cu toate funnel-urile și paginile lor, deschis din bara editorului */
export function ProjectsPanel({
  currentStepId,
  onOpenStep,
  onClose
}: ProjectsPanelProps) {
  const [expanded, setExpanded] = useState<string[]>(() =>
  funnels.length > 0 ? [funnels[0].id] : []
  );

  const toggle = (id: string) =>
  setExpanded((current) =>
  current.includes(id) ?
  current.filter((value) => value !== id) :
  [...current, id]
  );

  return (
    <div className="absolute left-0 top-full z-40 mt-1 w-[340px] rounded-xl border border-slate-200 bg-white p-2 shadow-2xl">
      <div className="flex items-center justify-between px-2 py-1.5">
        <p className="font-display text-sm font-bold text-ink">
          Proiectele tale
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Închide lista de proiecte"
          className="rounded-md p-1 text-ink-400 transition-colors duration-150 ease-out hover:bg-slate-100">
          
          <XIcon className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="max-h-[420px] overflow-y-auto">
        {funnels.map((funnel) => {
          const open = expanded.includes(funnel.id);
          return (
            <div key={funnel.id} className="mt-1">
              <button
                type="button"
                onClick={() => toggle(funnel.id)}
                aria-expanded={open}
                className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left transition-colors duration-150 ease-out hover:bg-slate-50">
                
                {open ?
                <ChevronDownIcon
                  className="h-4 w-4 text-ink-400"
                  aria-hidden="true" /> :


                <ChevronRightIcon
                  className="h-4 w-4 text-ink-400"
                  aria-hidden="true" />

                }
                <span className="font-display text-sm font-bold text-ink">
                  {funnel.name}
                </span>
                <span className="ml-auto text-xs font-semibold text-ink-400">
                  {funnel.steps.length} pagini
                </span>
              </button>

              {open &&
              <ul className="ml-6 border-l border-slate-200 pl-2">
                  {funnel.steps.map((step) => {
                  const active = step.id === currentStepId;
                  return (
                    <li key={step.id}>
                        <button
                        type="button"
                        onClick={() =>
                        onOpenStep(
                          step.id,
                          `${funnel.name} · ${step.name}`
                        )
                        }
                        className={`flex w-full flex-col items-start rounded-md px-2 py-1.5 text-left transition-colors duration-150 ease-out ${
                        active ?
                        'bg-brand-50 text-brand-700' :
                        'text-ink-700 hover:bg-slate-50'}`
                        }>
                        
                          <span className="text-sm font-semibold">
                            {step.name}
                          </span>
                          <span className="text-xs text-ink-400">
                            {step.kind} · /{step.path}
                          </span>
                        </button>
                      </li>);

                })}
                </ul>
              }
            </div>);

        })}
      </div>
    </div>);

}