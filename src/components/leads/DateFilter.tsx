import React, { useState } from 'react';
import { CalendarDaysIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

export type LeadDateFilter =
{kind: 'all';} |
{kind: 'day';iso: string;} |
{kind: 'month';year: number;month: number;} |
{kind: 'lastDays';days: number;} |
{kind: 'range';start: string;end: string;};

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

export function filterLabel(filter: LeadDateFilter) {
  if (filter.kind === 'all') return 'Toate datele';
  if (filter.kind === 'lastDays') return `Ultimele ${filter.days} zile`;
  if (filter.kind === 'month')
  return `${monthNames[filter.month]} ${filter.year}`;
  if (filter.kind === 'range')
  return `${shortDate(filter.start)} – ${shortDate(filter.end)}`;
  const [year, month, day] = filter.iso.split('-');
  return `${Number(day)} ${monthNames[Number(month) - 1]} ${year}`;
}

/** Formatează o dată ISO ca „21 aug.” */
function shortDate(iso: string) {
  const [, month, day] = iso.split('-');
  return `${Number(day)} ${monthNames[Number(month) - 1].slice(0, 3)}.`;
}

/** Verifică dacă data unui lead (ISO) intră în filtru */
export function matchesFilter(iso: string, filter: LeadDateFilter) {
  if (filter.kind === 'all') return true;
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return false;

  if (filter.kind === 'day') return iso === filter.iso;
  if (filter.kind === 'range')
  return iso >= filter.start && iso <= filter.end;
  if (filter.kind === 'month')
  return (
    date.getFullYear() === filter.year && date.getMonth() === filter.month);


  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setDate(start.getDate() - (filter.days - 1));
  return date >= start && date <= today;
}

interface DateFilterProps {
  filter: LeadDateFilter;
  onChange: (filter: LeadDateFilter) => void;
}

export function DateFilter({ filter, onChange }: DateFilterProps) {
  const [open, setOpen] = useState(false);
  const today = new Date();
  const [cursor, setCursor] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  // prima dată apăsată dintr-un interval, cât timp a doua nu e aleasă
  const [pendingStart, setPendingStart] = useState<string | null>(null);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

  const presets: {label: string;value: LeadDateFilter;}[] = [
  { label: 'Toate datele', value: { kind: 'all' } },
  { label: 'Astăzi', value: { kind: 'day', iso: toIso(today) } },
  { label: 'Ieri', value: { kind: 'day', iso: toIso(yesterday) } },
  { label: 'Ultimele 7 zile', value: { kind: 'lastDays', days: 7 } },
  { label: 'Ultimele 30 de zile', value: { kind: 'lastDays', days: 30 } },
  {
    label: `Luna aceasta (${monthNames[today.getMonth()]})`,
    value: {
      kind: 'month',
      year: today.getFullYear(),
      month: today.getMonth()
    }
  },
  {
    label: `Luna trecută (${monthNames[lastMonth.getMonth()]})`,
    value: {
      kind: 'month',
      year: lastMonth.getFullYear(),
      month: lastMonth.getMonth()
    }
  }];


  const firstDay = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const offset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(
    cursor.getFullYear(),
    cursor.getMonth() + 1,
    0
  ).getDate();

  const monthActive =
  filter.kind === 'month' &&
  filter.year === cursor.getFullYear() &&
  filter.month === cursor.getMonth();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold transition-colors duration-150 ease-out ${
        filter.kind === 'all' ?
        'border-slate-200 bg-white text-ink-700 hover:border-brand-200 hover:text-brand-700' :
        'border-brand-300 bg-brand-50 text-brand-700'}`
        }>
        
        <CalendarDaysIcon className="h-3.5 w-3.5" aria-hidden="true" />
        {filterLabel(filter)}
      </button>

      {open &&
      <>
          <button
          type="button"
          className="fixed inset-0 z-10 cursor-default"
          onClick={() => {
            setPendingStart(null);
            setOpen(false);
          }}
          tabIndex={-1}
          aria-label="Închide filtrul de dată" />
        
          <div className="absolute right-0 z-20 mt-2 w-[19rem] rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
            <div className="flex flex-wrap gap-1.5">
              {presets.map((preset) =>
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                onChange(preset.value);
                setPendingStart(null);
                setOpen(false);
              }}
              className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-bold text-ink-700 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
              
                  {preset.label}
                </button>
            )}
            </div>

            <div className="mt-3 border-t border-slate-100 pt-3">
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

              <p className="mt-1.5 text-center text-[11px] font-semibold text-ink-500">
                {pendingStart ?
              'Alege data de final a intervalului' :
              'Alege data de început a intervalului'}
              </p>

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
                const inRange =
                filter.kind === 'range' &&
                iso >= filter.start &&
                iso <= filter.end;
                const active =
                filter.kind === 'day' && filter.iso === iso ||
                inRange ||
                pendingStart === iso;
                return (
                  <button
                    key={iso}
                    type="button"
                    onClick={() => {
                      if (!pendingStart) {
                        // prima dată aleasă: așteptăm capătul intervalului
                        setPendingStart(iso);
                        return;
                      }
                      const start = pendingStart <= iso ? pendingStart : iso;
                      const end = pendingStart <= iso ? iso : pendingStart;
                      onChange(
                        start === end ?
                        { kind: 'day', iso: start } :
                        { kind: 'range', start, end }
                      );
                      setPendingStart(null);
                      setOpen(false);
                    }}
                    className={`flex h-8 items-center justify-center rounded-lg text-xs font-bold transition-colors duration-150 ease-out ${
                    active ?
                    'bg-brand-500 text-white' :
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
                  kind: 'month',
                  year: cursor.getFullYear(),
                  month: cursor.getMonth()
                });
                setPendingStart(null);
                setOpen(false);
              }}
              className={`mt-2 w-full rounded-lg border px-3 py-2 text-xs font-bold transition-colors duration-150 ease-out ${
              monthActive ?
              'border-brand-300 bg-brand-50 text-brand-700' :
              'border-slate-200 text-ink-700 hover:bg-slate-50'}`
              }>
              
                Toată luna {monthNames[cursor.getMonth()]}
              </button>
            </div>
          </div>
        </>
      }
    </div>);

}