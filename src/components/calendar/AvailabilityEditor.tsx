import React, { useState } from 'react';
import { ClockIcon, CheckIcon } from 'lucide-react';
import {
  defaultAvailability,
  type DayAvailability } from
'../../contexts/WorkspaceContext';
import { timeSlots } from '../../data/tasks';

interface AvailabilityEditorProps {
  value: DayAvailability[] | undefined;
  onSave: (value: DayAvailability[]) => void;
  onCancel: () => void;
}

/** Disponibilitatea săptămânală a unui sub-account, preluată în team calendare */
export function AvailabilityEditor({
  value,
  onSave,
  onCancel
}: AvailabilityEditorProps) {
  const [draft, setDraft] = useState<DayAvailability[]>(
    value ?? defaultAvailability
  );

  const update = (day: string, patch: Partial<DayAvailability>) =>
  setDraft((current) =>
  current.map((item) => item.day === day ? { ...item, ...patch } : item)
  );

  return (
    <section
      aria-labelledby="availability-title"
      className="mt-5 rounded-2xl border border-brand-200 bg-white p-5 sm:p-6">
      
      <h2
        id="availability-title"
        className="flex items-center gap-2 font-display text-lg font-extrabold tracking-tight text-ink">
        
        <ClockIcon className="h-4 w-4" aria-hidden="true" />
        Disponibilitatea mea săptămânală
      </h2>
      <p className="text-xs text-ink-500">
        Intervalele bifate se preiau automat în calendarele de echipă create de
        admin.
      </p>

      <ul className="mt-4 space-y-2">
        {draft.map((item) =>
        <li
          key={item.day}
          className={`flex flex-wrap items-center gap-3 rounded-xl border px-3.5 py-2.5 ${
          item.enabled ?
          'border-brand-200 bg-brand-50' :
          'border-slate-200 bg-white'}`
          }>
          
            <label className="flex w-40 cursor-pointer items-center gap-2.5 text-sm font-bold text-ink">
              <input
              type="checkbox"
              checked={item.enabled}
              onChange={(event) =>
              update(item.day, { enabled: event.target.checked })
              }
              className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
            
              {item.day}
            </label>

            {item.enabled ?
          <div className="flex items-center gap-2">
                <select
              value={item.from}
              onChange={(event) =>
              update(item.day, { from: event.target.value })
              }
              aria-label={`Ora de început ${item.day}`}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-ink focus:border-brand-300 focus:outline-none">
              
                  {timeSlots.map((slot) =>
              <option key={slot} value={slot}>
                      {slot}
                    </option>
              )}
                </select>
                <span className="text-xs font-bold text-ink-500">–</span>
                <select
              value={item.to}
              onChange={(event) =>
              update(item.day, { to: event.target.value })
              }
              aria-label={`Ora de final ${item.day}`}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-ink focus:border-brand-300 focus:outline-none">
              
                  {timeSlots.map((slot) =>
              <option key={slot} value={slot}>
                      {slot}
                    </option>
              )}
                </select>
              </div> :

          <span className="text-xs font-semibold text-ink-500">
                Indisponibil
              </span>
          }
          </li>
        )}
      </ul>

      <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={() => onSave(draft)}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-3.5 py-2.5 font-display text-sm font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600">
          
          <CheckIcon className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
          Salvează disponibilitatea
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm font-semibold text-ink-500 underline-offset-4 hover:text-ink-700 hover:underline">
          
          Anulează
        </button>
      </div>
    </section>);

}