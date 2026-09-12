import React, { useState } from 'react';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isSameDay,
  startOfMonth,
  startOfDay } from
'date-fns';
import { ro } from 'date-fns/locale';
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon } from
'lucide-react';
import { timeSlots } from '../../data/tasks';

interface DeadlinePickerProps {
  deadline: string;
  time: string;
  overdue?: boolean;
  onChange: (deadline: string, time: string) => void;
}

const weekdayLabels = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const today = startOfDay(new Date(2026, 7, 24));

export function DeadlinePicker({
  deadline,
  time,
  overdue = false,
  onChange
}: DeadlinePickerProps) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(today);

  const days = eachDayOfInterval({
    start: startOfMonth(month),
    end: endOfMonth(month)
  });
  const leadingBlanks = (getDay(startOfMonth(month)) + 6) % 7;

  const selectDay = (day: Date) => {
    onChange(format(day, 'd LLLL', { locale: ro }), time || '09:00');
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors duration-150 ease-out ${
        overdue ?
        'border-red-200 bg-red-50 text-red-700 hover:bg-red-100' :
        'border-slate-200 bg-slate-50 text-ink-700 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700'}`
        }>
        
        <CalendarIcon className="h-4 w-4" aria-hidden="true" />
        {deadline ? `${deadline}${time ? `, ${time}` : ''}` : 'Alege deadline'}
      </button>

      {open &&
      <>
          <button
          type="button"
          className="fixed inset-0 z-10 cursor-default"
          onClick={() => setOpen(false)}
          tabIndex={-1}
          aria-label="Închide calendarul" />
        
          <div
          role="dialog"
          aria-label="Alege data și ora"
          className="absolute right-0 z-20 mt-2 flex w-[320px] gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
          
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <p className="font-display text-xs font-bold text-ink">
                  {format(month, 'LLLL yyyy', { locale: ro }).replace(
                  /^./,
                  (character) => character.toUpperCase()
                )}
                </p>
                <div className="flex">
                  <button
                  type="button"
                  onClick={() => setMonth(addMonths(month, -1))}
                  className="flex h-6 w-6 items-center justify-center rounded-md text-brand-600 transition-colors duration-150 ease-out hover:bg-brand-50"
                  aria-label="Luna anterioară">
                  
                    <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                  type="button"
                  onClick={() => setMonth(addMonths(month, 1))}
                  className="flex h-6 w-6 items-center justify-center rounded-md text-brand-600 transition-colors duration-150 ease-out hover:bg-brand-50"
                  aria-label="Luna următoare">
                  
                    <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="mt-2 grid grid-cols-7 gap-0.5 text-center">
                {weekdayLabels.map((label, index) =>
              <span
                key={`${label}-${index}`}
                className="pb-1 text-[10px] font-bold text-ink-500">
                
                    {label}
                  </span>
              )}
                {Array.from({ length: leadingBlanks }).map((_, index) =>
              <span key={`blank-${index}`} aria-hidden="true" />
              )}
                {days.map((day) => {
                const label = format(day, 'd LLLL', { locale: ro });
                const selected = deadline === label;
                const isToday = isSameDay(day, today);
                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    onClick={() => selectDay(day)}
                    aria-pressed={selected}
                    className={`flex h-7 w-7 items-center justify-center rounded-md text-xs font-semibold transition-colors duration-150 ease-out ${
                    selected ?
                    'bg-brand-500 text-white' :
                    isToday ?
                    'bg-brand-50 text-brand-700' :
                    'text-ink-700 hover:bg-slate-100'}`
                    }>
                    
                      {format(day, 'd')}
                    </button>);

              })}
              </div>
            </div>

            <div className="w-20 shrink-0 border-l border-slate-100 pl-2">
              <p className="pb-1 text-[10px] font-bold uppercase tracking-wide text-ink-500">
                Ora
              </p>
              <div className="max-h-52 space-y-1 overflow-y-auto pr-1">
                {timeSlots.map((slot) =>
              <button
                key={slot}
                type="button"
                onClick={() => onChange(deadline, slot)}
                aria-pressed={time === slot}
                className={`w-full rounded-md px-1.5 py-1 text-xs font-semibold transition-colors duration-150 ease-out ${
                time === slot ?
                'bg-ink text-white' :
                'text-ink-700 hover:bg-slate-100'}`
                }>
                
                    {slot}
                  </button>
              )}
              </div>
            </div>
          </div>
        </>
      }
    </div>);

}