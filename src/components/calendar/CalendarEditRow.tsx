import React, { useState } from 'react';
import { CheckIcon } from 'lucide-react';
import { categoryColors } from '../../data/tasks';
import type { BookingCalendar } from '../../data/calendars';

const durations = [15, 30, 45, 60, 90];

interface CalendarEditRowProps {
  calendar: BookingCalendar;
  onSave: (patch: Partial<BookingCalendar>) => void;
  onCancel: () => void;
}

export function CalendarEditRow({
  calendar,
  onSave,
  onCancel
}: CalendarEditRowProps) {
  const [name, setName] = useState(calendar.name);
  const [purpose, setPurpose] = useState(calendar.purpose);
  const [color, setColor] = useState(calendar.color);
  const [duration, setDuration] = useState(calendar.duration);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label
            htmlFor={`name-${calendar.id}`}
            className="text-xs font-bold uppercase tracking-wide text-ink-500">
            
            Nume calendar
          </label>
          <input
            id={`name-${calendar.id}`}
            type="text"
            autoFocus
            maxLength={40}
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold text-ink focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100" />
          
        </div>
        <div>
          <label
            htmlFor={`purpose-${calendar.id}`}
            className="text-xs font-bold uppercase tracking-wide text-ink-500">
            
            Descriere
          </label>
          <textarea
            id={`purpose-${calendar.id}`}
            rows={2}
            value={purpose}
            onChange={(event) => setPurpose(event.target.value)}
            className="mt-1.5 w-full resize-y rounded-lg border border-slate-200 px-3 py-2.5 text-sm leading-relaxed text-ink focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100" />
          
        </div>
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-ink-500">
          Durata întâlnirii
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {durations.map((option) =>
          <button
            key={option}
            type="button"
            onClick={() => setDuration(option)}
            aria-pressed={duration === option}
            className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors duration-150 ease-out ${
            duration === option ?
            'border-brand-300 bg-brand-50 text-brand-700' :
            'border-slate-200 text-ink-700 hover:bg-slate-50'}`
            }>
            
              {option} min
            </button>
          )}
        </div>
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-ink-500">
          Culoare de referință
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {categoryColors.map((option) =>
          <button
            key={option}
            type="button"
            onClick={() => setColor(option)}
            aria-pressed={color === option}
            aria-label={`Culoarea ${option}`}
            className={`flex h-7 w-7 items-center justify-center rounded-full transition-transform duration-150 ease-out ${
            color === option ?
            'ring-2 ring-ink ring-offset-2' :
            'hover:scale-105'}`
            }
            style={{ backgroundColor: option }}>
            
              {color === option &&
            <CheckIcon
              className="h-3.5 w-3.5 text-white"
              strokeWidth={3}
              aria-hidden="true" />

            }
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={name.trim().length === 0}
          onClick={() =>
          onSave({
            name: name.trim(),
            purpose: purpose.trim() || 'Fără descriere',
            color,
            duration
          })
          }
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-3 py-2 text-xs font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600 disabled:bg-slate-200 disabled:text-ink-500">
          
          <CheckIcon className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
          Salvează
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-xs font-semibold text-ink-500 underline-offset-4 hover:text-ink-700 hover:underline">
          
          Anulează
        </button>
      </div>
    </div>);

}