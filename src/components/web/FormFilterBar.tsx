import React, { useState } from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { DateFilter, type LeadDateFilter } from '../leads/DateFilter';

interface FormFilterBarProps {
  forms: {id: string;name: string;}[];
  selectedFormId: string;
  onSelectForm: (id: string) => void;
  dateFilter: LeadDateFilter;
  onDateChange: (filter: LeadDateFilter) => void;
  /** Conținut suplimentar între cele două filtre (ex. căutare) */
  children?: React.ReactNode;
}

/** Bara de filtre comună pentru completările și statisticile formularelor */
export function FormFilterBar({
  forms,
  selectedFormId,
  onSelectForm,
  dateFilter,
  onDateChange,
  children
}: FormFilterBarProps) {
  const [menu, setMenu] = useState(false);
  const activeForm = forms.find((form) => form.id === selectedFormId);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div
        className="relative"
        onMouseEnter={() => setMenu(true)}
        onMouseLeave={() => setMenu(false)}>
        
        <button
          type="button"
          onClick={() => setMenu((current) => !current)}
          aria-expanded={menu}
          className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-ink-700 transition-colors duration-150 ease-out hover:bg-slate-50">
          
          {activeForm ? activeForm.name : 'Toate formularele'}
          <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
        </button>
        {menu &&
        <div className="menu-surface absolute left-0 top-full z-30 mt-1 w-60 rounded-md border border-slate-200 bg-white py-1 shadow-xl">
            {forms.length === 0 ?
          <p className="px-4 py-3 text-sm text-ink-500">
                Niciun formular activ
              </p> :

          <>
                <button
              type="button"
              onClick={() => {
                onSelectForm('toate');
                setMenu(false);
              }}
              className="flex w-full px-4 py-2.5 text-left text-sm font-semibold text-ink-700 hover:bg-slate-50">
              
                  Toate formularele
                </button>
                {forms.map((form) =>
            <button
              key={form.id}
              type="button"
              onClick={() => {
                onSelectForm(form.id);
                setMenu(false);
              }}
              className="flex w-full px-4 py-2.5 text-left text-sm font-semibold text-ink-700 hover:bg-slate-50">
              
                    {form.name}
                  </button>
            )}
              </>
          }
          </div>
        }
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {children}
        <DateFilter filter={dateFilter} onChange={onDateChange} />
      </div>
    </div>);

}