import React, { useEffect, useRef, useState } from 'react';
import { ChevronDownIcon, CheckIcon } from 'lucide-react';
import { callerNames, statusVisuals, type CustomLeadStatus } from '../../data/leads';

interface LeadCallerSelectProps {
  caller: string;
  /** Statusul leadului — dă culoarea pastilei, ca la responsabil */
  status: string;
  customStatuses: CustomLeadStatus[];
  /** null = admin; un agent își poate aloca doar propriul nume */
  viewer: string | null;
  onChange: (caller: string) => void;
}

const NONE = 'Fără caller';

/** Selectorul de caller din tabelul de leaduri */
export function LeadCallerSelect({
  caller,
  status,
  customStatuses,
  viewer,
  onChange
}: LeadCallerSelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const visuals = statusVisuals(status, customStatuses);

  // Un caller se poate aloca doar pe sine; ceilalți agenți nu pot schimba nimic
  const options =
  viewer === null ?
  [NONE, ...callerNames] :
  callerNames.includes(viewer) ?
  [NONE, viewer] :
  [];

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

  if (options.length === 0) {
    return (
      <span className="block truncate text-sm font-semibold text-ink-700">
        {caller || '—'}
      </span>);

  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="listbox"
        aria-expanded={open}
        style={visuals.badgeStyle}
        className={`inline-flex w-full items-center justify-between gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold transition-colors duration-150 ease-out ${
        visuals.badgeClass} ${
        caller ? '' : 'border-dashed'}`}>
        
        <span className="min-w-0 flex-1 whitespace-nowrap text-left">
          {caller || NONE}
        </span>
        <ChevronDownIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      </button>

      {open &&
      <ul
        role="listbox"
        className="absolute left-0 top-full z-30 mt-1 max-h-64 w-52 overflow-y-auto rounded-xl border border-slate-200 bg-white py-1.5 shadow-2xl">
        
          {options.map((option) => {
          const active = option === NONE ? caller === '' : option === caller;
          return (
            <li key={option}>
                <button
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => {
                  onChange(option === NONE ? '' : option);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-semibold transition-colors duration-150 ease-out ${
                active ?
                'bg-brand-50 text-brand-700' :
                'text-ink-700 hover:bg-slate-50'}`
                }>
                
                  <span className="flex-1 truncate">{option}</span>
                  {active &&
                <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
                }
                </button>
              </li>);

        })}
        </ul>
      }
    </div>);

}