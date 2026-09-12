import React, { useEffect, useRef, useState } from 'react';
import { UsersRoundIcon, ChevronDownIcon, CheckIcon } from 'lucide-react';
import { subAccounts, subAccountsTotal } from '../../data/subAccounts';

interface FunnelAccessPickerProps {
  access: string[];
  onChange: (names: string[]) => void;
}

/** Buton „Oferă acces la editare” cu meniu mic de selecție a sub-accounts */
export function FunnelAccessPicker({
  access,
  onChange
}: FunnelAccessPickerProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  /** Click în afara meniului sau Escape îl închide */
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

  const toggle = (name: string) =>
  onChange(
    access.includes(name) ?
    access.filter((item) => item !== name) :
    [...access, name]
  );

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className={`inline-flex w-full items-center justify-between gap-2 rounded-md border px-3.5 py-3 text-[15px] font-bold transition-colors duration-150 ease-out ${
        open ?
        'border-brand-400 bg-brand-50 text-brand-700' :
        'border-slate-200 bg-white text-ink-700 hover:border-brand-200 hover:bg-slate-50'}`
        }>
        
        <span className="inline-flex items-center gap-2">
          <UsersRoundIcon className="h-4 w-4" aria-hidden="true" />
          Oferă acces la editare
        </span>
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-ink-500">
          {access.length}/{subAccountsTotal}
          <ChevronDownIcon
            className={`h-4 w-4 transition-transform duration-150 ease-out ${open ? 'rotate-180' : ''}`}
            aria-hidden="true" />
          
        </span>
      </button>

      {open &&
      <div className="absolute left-0 top-full z-30 mt-2 max-h-72 w-72 overflow-y-auto rounded-xl border border-slate-200 bg-white p-3 shadow-2xl">
          <p className="pb-2 text-[11px] font-bold uppercase tracking-wide text-ink-500">
            Cine poate edita funnelul
          </p>
          {subAccounts.map((group) =>
        <div key={group.role} className="mb-3 last:mb-0">
              <p className="flex items-center gap-2 pb-1 text-[11px] font-bold uppercase tracking-wide text-ink-500">
                <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: group.color }}
              aria-hidden="true" />
            
                {group.role}
              </p>
              {group.members.map((member) => {
            const selected = access.includes(member);
            return (
              <button
                key={member}
                type="button"
                onClick={() => toggle(member)}
                aria-pressed={selected}
                className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left text-sm font-semibold transition-colors duration-150 ease-out ${
                selected ?
                'bg-brand-50 text-brand-700' :
                'text-ink-700 hover:bg-slate-50 hover:text-brand-700'}`
                }>
                
                    <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: group.color }}
                  aria-hidden="true" />
                
                    <span className="flex-1 truncate">{member}</span>
                    {selected &&
                <CheckIcon
                  className="h-4 w-4 shrink-0"
                  strokeWidth={2.5}
                  aria-hidden="true" />

                }
                  </button>);

          })}
            </div>
        )}
        </div>
      }
    </div>);

}