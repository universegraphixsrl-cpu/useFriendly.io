import React from 'react';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isSameDay,
  isBefore,
  startOfMonth,
  startOfDay } from
'date-fns';
import { ro } from 'date-fns/locale';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

interface MonthGridProps {
  month: Date;
  selectedDate: Date | null;
  today: Date;
  onMonthChange: (month: Date) => void;
  onSelectDate: (date: Date) => void;
}

const weekdayLabels = ['LUN', 'MAR', 'MIE', 'JOI', 'VIN', 'SÂM', 'DUM'];

export function isAvailable(date: Date, today: Date) {
  const weekday = getDay(date);
  if (weekday === 0 || weekday === 6) return false;
  if (isBefore(startOfDay(date), startOfDay(today))) return false;
  return date.getDate() % 7 !== 3;
}

export function MonthGrid({
  month,
  selectedDate,
  today,
  onMonthChange,
  onSelectDate
}: MonthGridProps) {
  const days = eachDayOfInterval({
    start: startOfMonth(month),
    end: endOfMonth(month)
  });
  const leadingBlanks = (getDay(startOfMonth(month)) + 6) % 7;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-base font-bold text-ink">
          {format(month, 'LLLL yyyy', { locale: ro }).replace(/^./, (c) =>
          c.toUpperCase()
          )}
        </h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onMonthChange(addMonths(month, -1))}
            className="flex h-9 w-9 items-center justify-center rounded-full text-brand-600 transition-colors duration-150 ease-out hover:bg-brand-50 disabled:text-slate-300 disabled:hover:bg-transparent"
            disabled={isBefore(startOfMonth(month), startOfMonth(today))}
            aria-label="Luna anterioară">
            
            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onMonthChange(addMonths(month, 1))}
            className="flex h-9 w-9 items-center justify-center rounded-full text-brand-600 transition-colors duration-150 ease-out hover:bg-brand-50"
            aria-label="Luna următoare">
            
            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-7 gap-y-1 text-center">
        {weekdayLabels.map((label) =>
        <span
          key={label}
          className="pb-2 text-[11px] font-bold tracking-wide text-ink-500">
          
            {label}
          </span>
        )}

        {Array.from({ length: leadingBlanks }).map((_, index) =>
        <span key={`blank-${index}`} aria-hidden="true" />
        )}

        {days.map((day) => {
          const available = isAvailable(day, today);
          const selected = selectedDate ? isSameDay(day, selectedDate) : false;
          const isToday = isSameDay(day, today);

          return (
            <div key={day.toISOString()} className="flex justify-center py-0.5">
              <button
                type="button"
                disabled={!available}
                onClick={() => onSelectDate(day)}
                aria-pressed={selected}
                aria-label={format(day, "d LLLL yyyy", { locale: ro })}
                className={`relative flex h-11 w-11 items-center justify-center rounded-full text-sm transition-colors duration-150 ease-out ${
                selected ?
                'bg-brand-500 font-bold text-white' :
                available ?
                'bg-brand-50 font-bold text-brand-600 hover:bg-brand-100' :
                'font-normal text-slate-300'}`
                }>
                
                {format(day, 'd')}
                {isToday &&
                <span
                  className={`absolute bottom-1.5 h-1 w-1 rounded-full ${selected ? 'bg-white' : 'bg-brand-500'}`}
                  aria-hidden="true" />

                }
              </button>
            </div>);

        })}
      </div>
    </div>);

}