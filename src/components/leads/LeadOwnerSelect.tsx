import React, { useEffect, useRef, useState } from 'react';
import { ChevronDownIcon, CheckIcon, LockIcon } from 'lucide-react';
import {
  leadOwners,
  statusVisuals,
  UNASSIGNED,
  type CustomLeadStatus } from
'../../data/leads';

interface LeadOwnerSelectProps {
  owner: string;
  /** Statusul leadului — dă culoarea pastilei */
  status: string;
  customStatuses: CustomLeadStatus[];
  /** Când e blocat, doar responsabilul sau adminul pot schimba */
  locked: boolean;
  /** null = admin (poate atribui oricui); altfel agentul se poate atribui doar pe sine */
  viewer: string | null;
  onChange: (owner: string) => void;
}

/** Selectorul de responsabil din tabelul de leaduri */
export function LeadOwnerSelect({
  owner,
  status,
  customStatuses,
  locked,
  viewer,
  onChange
}: LeadOwnerSelectProps) {
  const options =
  viewer === null ? leadOwners : [UNASSIGNED, viewer];
  const [open, setOpen] = useState(false);
  const visuals = statusVisuals(status, customStatuses);
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

  if (locked) {
    return (
      <span
        style={visuals.badgeStyle}
        className={`inline-flex w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${visuals.badgeClass}`}
        title={`Doar ${owner} sau adminul pot modifica acest lead`}>
        
        <LockIcon className="h-3 w-3 shrink-0" aria-hidden="true" />
        <span className="truncate">{owner}</span>
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
        className={`inline-flex w-full items-center justify-between gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold transition-colors duration-150 ease-out ${visuals.badgeClass} ${
        owner === UNASSIGNED ? 'border-dashed' : ''}`
        }>
        
        <span className="min-w-0 flex-1 whitespace-nowrap text-left">
          {owner}
        </span>
        <ChevronDownIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      </button>

      {open &&
      <ul
        role="listbox"
        className="absolute left-0 top-full z-30 mt-1 max-h-64 w-52 overflow-y-auto rounded-xl border border-slate-200 bg-white py-1.5 shadow-2xl">
        
          {options.map((option) =>
        <li key={option}>
              <button
            type="button"
            role="option"
            aria-selected={option === owner}
            onClick={() => {
              onChange(option);
              setOpen(false);
            }}
            className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-semibold transition-colors duration-150 ease-out ${
            option === owner ?
            'bg-brand-50 text-brand-700' :
            'text-ink-700 hover:bg-slate-50'}`
            }>
            
                <span className="flex-1 truncate">{option}</span>
                {option === owner &&
            <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
            }
              </button>
            </li>
        )}
        </ul>
      }
    </div>);

}