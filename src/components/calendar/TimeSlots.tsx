import React from 'react';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';

interface TimeSlotsProps {
  date: Date;
  slots: string[];
  selectedSlot: string | null;
  hourFormat: '12h' | '24h';
  onHourFormatChange: (value: '12h' | '24h') => void;
  onSelectSlot: (slot: string | null) => void;
}

function toDisplay(slot: string, hourFormat: '12h' | '24h') {
  if (hourFormat === '24h') return slot;
  const [hours, minutes] = slot.split(':').map(Number);
  const suffix = hours >= 12 ? 'pm' : 'am';
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHour}:${String(minutes).padStart(2, '0')}${suffix}`;
}

export function TimeSlots({
  date,
  slots,
  selectedSlot,
  hourFormat,
  onHourFormatChange,
  onSelectSlot
}: TimeSlotsProps) {
  return (
    <div className="flex min-w-0 flex-col lg:w-[260px] lg:shrink-0">
      <div className="flex items-center justify-between gap-3">
        <p className="font-display text-sm font-bold text-ink">
          {format(date, 'EEEE, d LLLL', { locale: ro }).replace(/^./, (c) =>
          c.toUpperCase()
          )}
        </p>
        <div className="flex rounded-lg bg-slate-100 p-0.5">
          {(['12h', '24h'] as const).map((value) =>
          <button
            key={value}
            type="button"
            onClick={() => onHourFormatChange(value)}
            aria-pressed={hourFormat === value}
            className={`rounded-md px-2.5 py-1 text-xs font-bold transition-colors duration-150 ease-out ${
            hourFormat === value ?
            'bg-white text-ink shadow-sm' :
            'text-ink-500'}`
            }>
            
              {value}
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 max-h-[420px] space-y-2 overflow-y-auto pr-1">
        {slots.map((slot) => {
          const selected = selectedSlot === slot;
          return (
            <div key={slot} className="flex gap-2">
              <button
                type="button"
                onClick={() => onSelectSlot(selected ? null : slot)}
                aria-pressed={selected}
                className={`flex-1 rounded-lg border py-3 text-center font-display text-sm font-bold transition-colors duration-150 ease-out ${
                selected ?
                'border-ink bg-ink text-white' :
                'border-brand-200 text-brand-600 hover:border-brand-500 hover:bg-brand-50'}`
                }>
                
                {toDisplay(slot, hourFormat)}
              </button>
              {selected &&
              <button
                type="button"
                className="flex-1 rounded-lg bg-brand-500 py-3 text-center font-display text-sm font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600">
                
                  Continuă
                </button>
              }
            </div>);

        })}

        {slots.length === 0 &&
        <p className="rounded-lg bg-slate-50 px-3 py-6 text-center text-sm text-ink-500">
            Nu mai sunt intervale libere în această zi.
          </p>
        }
      </div>
    </div>);

}