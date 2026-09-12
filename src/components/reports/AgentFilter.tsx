import React, { useEffect, useRef, useState } from 'react';
import { ChevronDownIcon, CheckIcon } from 'lucide-react';
import { subAccounts } from '../../data/subAccounts';

interface AgentFilterProps {
  /** null = toată echipa */
  value: string | null;
  onChange: (value: string | null) => void;
  /** Câte leaduri are fiecare agent în perioada selectată */
  counts: Record<string, number>;
  total: number;
}

export function AgentFilter({
  value,
  onChange,
  counts,
  total
}: AgentFilterProps) {
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
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors duration-150 ease-out ${
        value ?
        'border-brand-200 bg-brand-50 text-brand-700' :
        'border-slate-200 bg-white text-ink-700 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700'}`
        }>
        
        {value ?? 'Toată echipa'}
        <ChevronDownIcon className="h-3.5 w-3.5" aria-hidden="true" />
      </button>

      {open &&
      <div
        role="listbox"
        aria-label="Alege agentul"
        className="absolute left-0 top-full z-40 mt-1.5 max-h-80 w-64 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-2xl">
        
          <button
          type="button"
          role="option"
          aria-selected={value === null}
          onClick={() => {
            onChange(null);
            setOpen(false);
          }}
          className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm font-bold transition-colors duration-150 ease-out ${
          value === null ?
          'bg-brand-50 text-brand-700' :
          'text-ink hover:bg-slate-50'}`
          }>
          
            <span className="flex-1">Toată echipa</span>
            <span className="text-xs font-semibold text-ink-500">{total}</span>
            {value === null &&
          <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
          }
          </button>

          {subAccounts.map((group) =>
        <div key={group.role} className="mt-1">
              <p className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-ink-500">
                <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: group.color }}
              aria-hidden="true" />
            
                {group.role}
              </p>
              {group.members.map((member) =>
          <button
            key={member}
            type="button"
            role="option"
            aria-selected={value === member}
            onClick={() => {
              onChange(member);
              setOpen(false);
            }}
            className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors duration-150 ease-out ${
            value === member ?
            'bg-brand-50 font-bold text-brand-700' :
            'font-semibold text-ink-700 hover:bg-slate-50'}`
            }>
            
                  <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: group.color }}
              aria-hidden="true" />
            
                  <span className="flex-1 truncate">{member}</span>
                  <span className="text-xs font-semibold text-ink-500">
                    {counts[member] ?? 0}
                  </span>
                  {value === member &&
            <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
            }
                </button>
          )}
            </div>
        )}
        </div>
      }
    </div>);

}