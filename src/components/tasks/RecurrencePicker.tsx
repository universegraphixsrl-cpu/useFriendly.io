import React, { useState } from 'react';
import { RepeatIcon, CheckIcon } from 'lucide-react';
import {
  recurrenceOptions,
  timeSlots,
  type Recurrence } from
'../../data/tasks';

interface RecurrencePickerProps {
  recurrence: Recurrence | null;
  recurrenceTime: string;
  onChange: (recurrence: Recurrence, recurrenceTime: string) => void;
}

export function RecurrencePicker({
  recurrence,
  recurrenceTime,
  onChange
}: RecurrencePickerProps) {
  const [open, setOpen] = useState(false);
  const recurring = recurrence !== null && recurrence !== 'Nu se repetă';
  const label = recurring ?
  `${recurrence} · ${recurrenceTime}` :
  recurrence === 'Nu se repetă' ?
  'Nu se repetă' :
  'Alege recurența';

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold transition-colors duration-150 ease-out ${
        recurring ?
        'border-brand-200 bg-brand-50 text-brand-700 hover:bg-brand-100' :
        'border-slate-200 text-ink-500 hover:bg-slate-50'}`
        }>
        
        <RepeatIcon className="h-4 w-4" aria-hidden="true" />
        {label}
      </button>

      {open &&
      <>
          <button
          type="button"
          className="fixed inset-0 z-10 cursor-default"
          onClick={() => setOpen(false)}
          tabIndex={-1}
          aria-label="Închide opțiunile de recurență" />
        
          <div
          role="dialog"
          aria-label="Setează recurența"
          className="absolute right-0 z-20 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
          
            <p className="text-[10px] font-bold uppercase tracking-wide text-ink-500">
              Cât de des se repetă
            </p>
            <div className="mt-1.5 space-y-1">
              {recurrenceOptions.map((option) =>
            <button
              key={option}
              type="button"
              onClick={() => onChange(option, recurrenceTime)}
              aria-pressed={recurrence === option}
              className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm font-semibold transition-colors duration-150 ease-out ${
              recurrence === option ?
              'bg-brand-50 text-brand-700' :
              'text-ink-700 hover:bg-slate-50'}`
              }>
              
                  <span className="flex-1">{option}</span>
                  {recurrence === option &&
              <CheckIcon
                className="h-4 w-4 text-brand-600"
                aria-hidden="true" />

              }
                </button>
            )}
            </div>

            {recurring &&
          <div className="mt-3 border-t border-slate-100 pt-3">
                <p className="text-[10px] font-bold uppercase tracking-wide text-ink-500">
                  La ce oră
                </p>
                <div className="mt-1.5 grid max-h-40 grid-cols-4 gap-1 overflow-y-auto pr-1">
                  {timeSlots.map((slot) =>
              <button
                key={slot}
                type="button"
                onClick={() => onChange(recurrence, slot)}
                aria-pressed={recurrenceTime === slot}
                className={`rounded-md px-1 py-1 text-xs font-semibold transition-colors duration-150 ease-out ${
                recurrenceTime === slot ?
                'bg-ink text-white' :
                'text-ink-700 hover:bg-slate-100'}`
                }>
                
                      {slot}
                    </button>
              )}
                </div>
              </div>
          }
          </div>
        </>
      }
    </div>);

}