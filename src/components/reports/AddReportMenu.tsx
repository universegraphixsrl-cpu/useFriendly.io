import React, { useEffect, useRef, useState } from 'react';
import { PlusIcon, CheckIcon } from 'lucide-react';
import { extraMetrics } from './extraMetrics';

interface AddReportMenuProps {
  selected: string[];
  onToggle: (id: string) => void;
  /** true = raportul e restrâns la un caller: se arată doar indicatorii lui */
  callerScope?: boolean;
}

export function AddReportMenu({
  selected,
  onToggle,
  callerScope = false
}: AddReportMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-ink-700 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
        
        <PlusIcon className="h-4 w-4" aria-hidden="true" />
        Adaugă raport
      </button>

      {open &&
      <div
        role="listbox"
        aria-label="Alege indicatorii de urmărit"
        className="absolute right-0 top-full z-40 mt-1.5 w-80 rounded-xl border border-slate-200 bg-white p-2 shadow-2xl">
        
          <p className="px-2 py-1.5 text-xs font-bold uppercase tracking-wide text-ink-500">
            Indicatori disponibili
          </p>
          <ul className="max-h-80 space-y-0.5 overflow-y-auto">
            {extraMetrics.
          filter(
            (metric) =>
            (!metric.callerOnly || callerScope) && (
            !metric.closerOnly || !callerScope)
          ).
          map((metric) => {
            const active = selected.includes(metric.id);
            return (
              <li key={metric.id}>
                  <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => onToggle(metric.id)}
                  className={`flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors duration-150 ease-out ${
                  active ? 'bg-brand-50' : 'hover:bg-slate-50'}`
                  }>
                  
                    <span
                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                    active ?
                    'border-brand-500 bg-brand-500 text-white' :
                    'border-slate-300 bg-white'}`
                    }
                    aria-hidden="true">
                    
                      {active && <CheckIcon className="h-3 w-3" />}
                    </span>
                    <span className="min-w-0">
                      <span
                      className={`block text-sm font-bold ${
                      active ? 'text-brand-700' : 'text-ink'}`
                      }>
                      
                        {metric.label}
                      </span>
                      <span className="block text-xs leading-snug text-ink-500">
                        {metric.description}
                      </span>
                    </span>
                  </button>
                </li>);

          })}
          </ul>
        </div>
      }
    </div>);

}