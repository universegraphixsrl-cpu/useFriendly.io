import React, { useEffect, useRef, useState } from 'react';
import { UsersRoundIcon, ChevronDownIcon, CheckIcon } from 'lucide-react';
import { subAccounts, subAccountsTotal } from '../../data/subAccounts';

interface ListAccessProps {
  access: string[];
  onApply: (names: string[]) => void;
}

/** Meniul de acces la o listă de leaduri — se aplică doar la „Salvează accesul” */
export function ListAccess({ access, onApply }: ListAccessProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<string[]>(access);
  const containerRef = useRef<HTMLDivElement>(null);

  /** Click în afara meniului îl închide fără să aplice selecția */
  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setDraft(access);
      }
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        setDraft(access);
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open, access]);

  const toggle = (name: string) =>
  setDraft((current) =>
  current.includes(name) ?
  current.filter((item) => item !== name) :
  [...current, name]
  );

  const added = draft.filter((name) => !access.includes(name)).length;
  const removed = access.filter((name) => !draft.includes(name)).length;
  const changed = added > 0 || removed > 0;

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          setDraft(access);
          setOpen((value) => !value);
        }}
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-ink-700 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
        
        <UsersRoundIcon className="h-3.5 w-3.5" aria-hidden="true" />
        {access.length}/{subAccountsTotal} sub-accounts pot edita
        <ChevronDownIcon
          className={`h-3.5 w-3.5 transition-transform duration-150 ease-out ${open ? 'rotate-180' : ''}`}
          aria-hidden="true" />
        
      </button>

      {open &&
      <div
        className="absolute left-0 top-full z-30 mt-2 w-72"
        onClick={(event) => event.stopPropagation()}>
        
          <div className="max-h-80 overflow-y-auto rounded-xl border border-slate-200 bg-white p-3 shadow-2xl">
            <p className="pb-2 text-[11px] font-bold uppercase tracking-wide text-ink-500">
              Cine poate edita lista
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
              const selected = draft.includes(member);
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

          <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
            <button
            type="button"
            disabled={!changed}
            onClick={() => {
              onApply(draft);
              setOpen(false);
            }}
            className="rounded-lg bg-brand-500 px-2.5 py-1.5 text-xs font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600 disabled:bg-slate-200 disabled:text-ink-500">
            
              Salvează accesul
            </button>
            {changed &&
          <span className="text-[11px] font-semibold text-ink-500">
                {added > 0 && `+${added} adăugați`}
                {added > 0 && removed > 0 && ' · '}
                {removed > 0 && `−${removed} eliminați`}
              </span>
          }
          </div>
        </div>
      }
    </div>);

}