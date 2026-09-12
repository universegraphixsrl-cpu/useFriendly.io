import React, { useState } from 'react';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isBefore,
  isSameDay,
  startOfDay,
  startOfMonth } from
'date-fns';
import { ro } from 'date-fns/locale';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  GlobeIcon,
  VideoIcon } from
'lucide-react';
import { bookingCalendars } from '../../data/calendars';
import { elementColorFields } from '../../data/editor';

const weekdayLabels = ['LUN', 'MAR', 'MIE', 'JOI', 'VIN', 'SÂM', 'DUM'];

function isAvailable(date: Date, today: Date) {
  const weekday = getDay(date);
  if (weekday === 0 || weekday === 6) return false;
  if (isBefore(startOfDay(date), startOfDay(today))) return false;
  return date.getDate() % 7 !== 3;
}

function buildSlots(duration: number) {
  const slots: string[] = [];
  for (let minutes = 10 * 60; minutes < 18 * 60; minutes += duration) {
    const hours = Math.floor(minutes / 60);
    slots.push(`${String(hours).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`);
  }
  return slots.slice(0, 8);
}

interface CalendarElementProps {
  calendarId: string | null;
  colors: Record<string, string>;
}

/** Randarea calendarului de booking în pagina construită, cu stilurile din setări */
export function CalendarElement({ calendarId, colors }: CalendarElementProps) {
  const fallback: Record<string, string> = {};
  elementColorFields.calendar.forEach((field) => {
    fallback[field.key] = field.value;
  });
  const props = {
    titlesColor: colors.titles ?? fallback.titles,
    textColor: colors.text ?? fallback.text,
    fieldTextColor: colors.fieldText ?? fallback.fieldText,
    fieldPlaceholderColor:
    colors.fieldPlaceholder ?? fallback.fieldPlaceholder,
    availableSlotColor: colors.availableSlot ?? fallback.availableSlot,
    selectedSlotColor: colors.selectedSlot ?? fallback.selectedSlot
  };
  const today = new Date();
  const calendar =
  bookingCalendars.find((item) => item.id === calendarId) ?? null;
  const [month, setMonth] = useState(startOfMonth(today));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const days = eachDayOfInterval({
    start: startOfMonth(month),
    end: endOfMonth(month)
  });
  const leadingBlanks = (getDay(startOfMonth(month)) + 6) % 7;
  const slots = buildSlots(calendar?.duration ?? 30);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 text-left">
      {!calendar &&
      <p className="mb-5 rounded-md bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700">
          Acesta e un calendar demonstrativ. Selectează un calendar activ din
          setările elementului pentru a-l publica.
        </p>
      }

      <div className="grid gap-8 lg:grid-cols-[240px_1fr_240px]">
        <div className="lg:border-r lg:border-slate-200 lg:pr-8">
          <span
            className="flex h-12 w-12 items-center justify-center rounded-full font-display text-base font-bold text-white"
            style={{ backgroundColor: calendar?.color ?? props.selectedSlotColor }}>
            
            {calendar?.initials ?? 'FR'}
          </span>
          <p
            className="mt-4 text-sm font-semibold"
            style={{ color: props.textColor }}>
            
            {calendar?.host ?? 'Gazda evenimentului'}
          </p>
          <h3
            className="mt-1 font-display text-xl font-bold"
            style={{ color: props.titlesColor }}>
            
            {calendar?.name ?? 'Eveniment demonstrativ'}
          </h3>
          <p
            className="mt-3 text-sm leading-relaxed"
            style={{ color: props.textColor }}>
            
            {calendar?.purpose ??
            'Selectează un calendar din setări pentru a prelua descrierea, durata și disponibilitatea reală.'}
          </p>
          <div className="mt-5 space-y-2.5 text-sm" style={{ color: props.textColor }}>
            <p className="flex items-center gap-2">
              <ClockIcon className="h-4 w-4" aria-hidden="true" />
              {calendar?.duration ?? 30} min
            </p>
            <p className="flex items-center gap-2">
              <VideoIcon className="h-4 w-4" aria-hidden="true" />
              {calendar?.location ?? 'Zoom'}
            </p>
            <p className="flex items-center gap-2">
              <GlobeIcon className="h-4 w-4" aria-hidden="true" />
              Europe/Bucharest
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <h4
              className="font-display text-base font-bold"
              style={{ color: props.titlesColor }}>
              
              {format(month, 'LLLL yyyy', { locale: ro }).replace(/^./, (c) =>
              c.toUpperCase()
              )}
            </h4>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setMonth(addMonths(month, -1))}
                disabled={isBefore(startOfMonth(month), startOfMonth(today))}
                aria-label="Luna anterioară"
                className="flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-150 ease-out hover:bg-slate-100 disabled:text-slate-300"
                style={{ color: props.selectedSlotColor }}>
                
                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setMonth(addMonths(month, 1))}
                aria-label="Luna următoare"
                className="flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-150 ease-out hover:bg-slate-100"
                style={{ color: props.selectedSlotColor }}>
                
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-7 gap-y-1 text-center">
            {weekdayLabels.map((label) =>
            <span
              key={label}
              className="pb-2 text-[11px] font-bold tracking-wide"
              style={{ color: props.textColor }}>
              
                {label}
              </span>
            )}
            {Array.from({ length: leadingBlanks }).map((_, index) =>
            <span key={`blank-${index}`} aria-hidden="true" />
            )}
            {days.map((day) => {
              const available = isAvailable(day, today);
              const selected = selectedDate ?
              isSameDay(day, selectedDate) :
              false;
              return (
                <div key={day.toISOString()} className="flex justify-center py-0.5">
                  <button
                    type="button"
                    disabled={!available}
                    onClick={() => {
                      setSelectedDate(day);
                      setSelectedSlot(null);
                    }}
                    aria-pressed={selected}
                    className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold transition-colors duration-150 ease-out"
                    style={{
                      backgroundColor: selected ?
                      props.selectedSlotColor :
                      available ?
                      props.availableSlotColor :
                      'transparent',
                      color: selected ?
                      '#ffffff' :
                      available ?
                      props.selectedSlotColor :
                      '#cbd5e1'
                    }}>
                    
                    {format(day, 'd')}
                  </button>
                </div>);

            })}
          </div>
        </div>

        <div>
          <p
            className="font-display text-sm font-bold"
            style={{ color: props.titlesColor }}>
            
            {selectedDate ?
            format(selectedDate, 'EEEE, d LLLL', { locale: ro }).replace(
              /^./,
              (c) => c.toUpperCase()
            ) :
            'Alege o zi'}
          </p>
          <div className="mt-4 space-y-2">
            {slots.map((slot) => {
              const selected = selectedSlot === slot;
              return (
                <div key={slot} className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedSlot(selected ? null : slot)}
                    aria-pressed={selected}
                    className="flex-1 rounded-lg border py-3 text-center font-display text-sm font-bold transition-colors duration-150 ease-out"
                    style={{
                      backgroundColor: selected ?
                      props.selectedSlotColor :
                      props.availableSlotColor,
                      borderColor: selected ?
                      props.selectedSlotColor :
                      'transparent',
                      color: selected ? '#ffffff' : props.fieldTextColor
                    }}>
                    
                    {slot}
                  </button>
                  {selected &&
                  <button
                    type="button"
                    className="flex-1 rounded-lg py-3 text-center font-display text-sm font-bold text-white"
                    style={{ backgroundColor: props.selectedSlotColor }}>
                    
                      Continuă
                    </button>
                  }
                </div>);

            })}
          </div>
          <p
            className="mt-4 text-xs"
            style={{ color: props.fieldPlaceholderColor }}>
            
            Toate orele sunt afișate în fusul tău orar.
          </p>
        </div>
      </div>
    </div>);

}