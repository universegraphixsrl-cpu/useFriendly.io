import React, { useState } from 'react';
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon } from
'lucide-react';

export interface ReportRange {
  /** Prima zi din interval (ISO) */
  start: string;
  /** Ultima zi din interval (ISO) */
  end: string;
  /** Granularitatea aleasă, folosită pentru eticheta din grafice */
  grain: 'zi' | 'săptămână' | 'lună' | 'interval';
}

const monthNames = [
'ianuarie',
'februarie',
'martie',
'aprilie',
'mai',
'iunie',
'iulie',
'august',
'septembrie',
'octombrie',
'noiembrie',
'decembrie'];


const weekDays = ['L', 'Ma', 'Mi', 'J', 'V', 'S', 'D'];

const toIso = (date: Date) =>
`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
  date.getDate()
).padStart(2, '0')}`;

const fromIso = (iso: string) => new Date(`${iso}T00:00:00`);

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

/** Luni ca prima zi a săptămânii */
const startOfWeek = (date: Date) => addDays(date, -((date.getDay() + 6) % 7));

export function formatRange(range: ReportRange) {
  const start = fromIso(range.start);
  const end = fromIso(range.end);

  if (range.start === range.end)
  return `${start.getDate()} ${monthNames[start.getMonth()]}`;

  if (start.getMonth() === end.getMonth())
  return `${start.getDate()} – ${end.getDate()} ${monthNames[end.getMonth()]}`;

  return `${start.getDate()} ${monthNames[start.getMonth()]} – ${end.getDate()} ${
  monthNames[end.getMonth()]}`;

}

export function rangeDays(range: ReportRange) {
  const diff =
  (fromIso(range.end).getTime() - fromIso(range.start).getTime()) /
  86_400_000;
  return Math.max(1, Math.round(diff) + 1);
}

const today = new Date();

export const defaultReportRange: ReportRange = {
  start: toIso(new Date(today.getFullYear(), today.getMonth(), 1)),
  end: toIso(today),
  grain: 'lună'
};

interface RangePickerProps {
  range: ReportRange;
  onChange: (range: ReportRange) => void;
}

export function RangePicker({ range, onChange }: RangePickerProps) {
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [customStart, setCustomStart] = useState<string | null>(null);

  const yesterday = addDays(today, -1);
  const weekStart = startOfWeek(today);
  const lastWeekStart = addDays(weekStart, -7);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

  const presets: {label: string;value: ReportRange;}[] = [
  {
    label: 'Astăzi',
    value: { start: toIso(today), end: toIso(today), grain: 'zi' }
  },
  {
    label: 'Ieri',
    value: { start: toIso(yesterday), end: toIso(yesterday), grain: 'zi' }
  },
  {
    label: 'Ultimele 7 zile',
    value: {
      start: toIso(addDays(today, -6)),
      end: toIso(today),
      grain: 'zi'
    }
  },
  {
    label: 'Săptămâna aceasta',
    value: {
      start: toIso(weekStart),
      end: toIso(today),
      grain: 'săptămână'
    }
  },
  {
    label: 'Săptămâna trecută',
    value: {
      start: toIso(lastWeekStart),
      end: toIso(addDays(lastWeekStart, 6)),
      grain: 'săptămână'
    }
  },
  {
    label: 'Ultimele 4 săptămâni',
    value: {
      start: toIso(addDays(weekStart, -21)),
      end: toIso(today),
      grain: 'săptămână'
    }
  },
  {
    label: 'Luna aceasta',
    value: { start: toIso(monthStart), end: toIso(today), grain: 'lună' }
  },
  {
    label: 'Luna trecută',
    value: {
      start: toIso(lastMonthStart),
      end: toIso(lastMonthEnd),
      grain: 'lună'
    }
  }];


  const firstDay = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const offset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(
    cursor.getFullYear(),
    cursor.getMonth() + 1,
    0
  ).getDate();

  const pickCustom = (iso: string) => {
    if (!customStart || customStart && iso < customStart) {
      setCustomStart(iso);
      return;
    }
    onChange({ start: customStart, end: iso, grain: 'interval' });
    setCustomStart(null);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-lg border border-brand-300 bg-brand-50 px-3 py-2 text-sm font-semibold text-brand-700 transition-colors duration-150 ease-out hover:bg-brand-100">
        
        <CalendarIcon className="h-4 w-4" aria-hidden="true" />
        {formatRange(range)}
      </button>

      {open &&
      <>
          <button
          type="button"
          className="fixed inset-0 z-10 cursor-default"
          onClick={() => {
            setOpen(false);
            setCustomStart(null);
          }}
          tabIndex={-1}
          aria-label="Închide selectorul de perioadă" />
        
          <div className="absolute right-0 z-20 mt-2 w-[20rem] rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
            <p className="pb-2 text-[11px] font-bold uppercase tracking-wide text-ink-500">
              Perioade rapide
            </p>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((preset) => {
              const active =
              preset.value.start === range.start &&
              preset.value.end === range.end;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    onChange(preset.value);
                    setOpen(false);
                    setCustomStart(null);
                  }}
                  className={`rounded-lg border px-2.5 py-1.5 text-[11px] font-bold transition-colors duration-150 ease-out ${
                  active ?
                  'border-brand-300 bg-brand-50 text-brand-700' :
                  'border-slate-200 text-ink-700 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700'}`
                  }>
                  
                    {preset.label}
                  </button>);

            })}
            </div>

            <div className="mt-3 border-t border-slate-100 pt-3">
              <p className="pb-2 text-[11px] font-bold uppercase tracking-wide text-ink-500">
                Interval personalizat
              </p>
              <p className="pb-2 text-[11px] font-semibold text-ink-500">
                {customStart ?
              `Început: ${formatRange({ start: customStart, end: customStart, grain: 'zi' })} · alege data de final` :
              'Alege data de început, apoi data de final'}
              </p>

              <div className="flex items-center justify-between">
                <button
                type="button"
                onClick={() =>
                setCursor(
                  new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1)
                )
                }
                className="flex h-7 w-7 items-center justify-center rounded-lg text-ink-500 transition-colors duration-150 ease-out hover:bg-slate-50 hover:text-ink"
                aria-label="Luna anterioară">
                
                  <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
                </button>
                <p className="font-display text-sm font-bold text-ink">
                  {monthNames[cursor.getMonth()]} {cursor.getFullYear()}
                </p>
                <button
                type="button"
                onClick={() =>
                setCursor(
                  new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1)
                )
                }
                className="flex h-7 w-7 items-center justify-center rounded-lg text-ink-500 transition-colors duration-150 ease-out hover:bg-slate-50 hover:text-ink"
                aria-label="Luna următoare">
                
                  <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <div className="mt-2 grid grid-cols-7 gap-1 text-center">
                {weekDays.map((day) =>
              <span
                key={day}
                className="text-[10px] font-bold uppercase text-ink-500">
                
                    {day}
                  </span>
              )}
                {Array.from({ length: offset }).map((_, index) =>
              <span key={`empty-${index}`} />
              )}
                {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;
                const iso = toIso(
                  new Date(cursor.getFullYear(), cursor.getMonth(), day)
                );
                const inRange = iso >= range.start && iso <= range.end;
                const isStart = customStart === iso;
                return (
                  <button
                    key={iso}
                    type="button"
                    onClick={() => pickCustom(iso)}
                    className={`flex h-8 items-center justify-center rounded-lg text-xs font-bold transition-colors duration-150 ease-out ${
                    isStart ?
                    'bg-brand-500 text-white' :
                    inRange ?
                    'bg-brand-50 text-brand-700' :
                    'text-ink-700 hover:bg-brand-50 hover:text-brand-700'}`
                    }>
                    
                      {day}
                    </button>);

              })}
              </div>

              <button
              type="button"
              onClick={() => {
                onChange({
                  start: toIso(
                    new Date(cursor.getFullYear(), cursor.getMonth(), 1)
                  ),
                  end: toIso(
                    new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0)
                  ),
                  grain: 'lună'
                });
                setCustomStart(null);
                setOpen(false);
              }}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-ink-700 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
              
                Toată luna {monthNames[cursor.getMonth()]}
              </button>
            </div>
          </div>
        </>
      }
    </div>);

}