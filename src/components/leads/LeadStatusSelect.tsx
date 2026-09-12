import React, { useState } from 'react';
import { ChevronDownIcon, CheckIcon, PlusIcon } from 'lucide-react';
import { statusVisuals, type CustomLeadStatus } from '../../data/leads';
import { categoryColors } from '../../data/tasks';

interface LeadStatusSelectProps {
  status: string;
  statuses: string[];
  customStatuses: CustomLeadStatus[];
  onChange: (status: string) => void;
  onCreateStatus: (name: string, color: string) => void;
}

export function LeadStatusSelect({
  status,
  statuses,
  customStatuses,
  onChange,
  onCreateStatus
}: LeadStatusSelectProps) {
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [color, setColor] = useState(categoryColors[0]);

  const current = statusVisuals(status, customStatuses);

  const closeAll = () => {
    setOpen(false);
    setCreating(false);
    setName('');
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="listbox"
        aria-expanded={open}
        style={current.badgeStyle}
        className={`inline-flex w-full items-center justify-between gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold transition-colors duration-150 ease-out ${current.badgeClass}`}>
        
        <span className="whitespace-nowrap">{status}</span>
        <ChevronDownIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      </button>

      {open &&
      <>
          <button
          type="button"
          className="fixed inset-0 z-10 cursor-default"
          onClick={closeAll}
          tabIndex={-1}
          aria-label="Închide lista de statusuri" />
        
          <div className="absolute left-0 z-20 mt-1.5 w-56 rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl">
            <ul role="listbox" aria-label="Alege statusul">
              {statuses.map((option) => {
              const custom = customStatuses.find(
                (item) => item.name === option
              );
              return (
                <li key={option}>
                    <button
                    type="button"
                    role="option"
                    aria-selected={status === option}
                    onClick={() => {
                      onChange(option);
                      closeAll();
                    }}
                    className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-semibold transition-colors duration-150 ease-out ${
                    status === option ?
                    'bg-brand-50 text-brand-700' :
                    'text-ink-700 hover:bg-slate-50'}`
                    }>
                    
                      {custom &&
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: custom.color }}
                      aria-hidden="true" />

                    }
                      <span className="flex-1">{option}</span>
                      {status === option &&
                    <CheckIcon
                      className="h-4 w-4 text-brand-600"
                      aria-hidden="true" />

                    }
                    </button>
                  </li>);

            })}
            </ul>

            <div className="mt-1 border-t border-slate-100 pt-1.5">
              {creating ?
            <div className="px-3 py-1.5">
                  <input
                type="text"
                autoFocus
                maxLength={24}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Nume status nou"
                aria-label="Nume status nou"
                className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm font-semibold text-ink focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100" />
              
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {categoryColors.map((option) =>
                <button
                  key={option}
                  type="button"
                  onClick={() => setColor(option)}
                  aria-label={`Culoare ${option}`}
                  aria-pressed={color === option}
                  className={`h-5 w-5 rounded-full transition-transform duration-150 ease-out ${
                  color === option ?
                  'ring-2 ring-ink ring-offset-1' :
                  'hover:scale-110'}`
                  }
                  style={{ backgroundColor: option }} />

                )}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                  type="button"
                  disabled={name.trim().length === 0}
                  onClick={() => {
                    const trimmed = name.trim();
                    onCreateStatus(trimmed, color);
                    onChange(trimmed);
                    closeAll();
                  }}
                  className="rounded-lg bg-brand-500 px-2.5 py-1.5 text-xs font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600 disabled:bg-slate-200 disabled:text-ink-500">
                  
                      Adaugă status
                    </button>
                    <button
                  type="button"
                  onClick={() => {
                    setCreating(false);
                    setName('');
                  }}
                  className="text-xs font-semibold text-ink-500 hover:text-ink-700">
                  
                      Anulează
                    </button>
                  </div>
                </div> :

            <button
              type="button"
              onClick={() => setCreating(true)}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-bold text-brand-600 transition-colors duration-150 ease-out hover:bg-brand-50">
              
                  <PlusIcon
                className="h-4 w-4"
                strokeWidth={2.5}
                aria-hidden="true" />
              
                  Adaugă status nou
                </button>
            }
            </div>
          </div>
        </>
      }
    </div>);

}