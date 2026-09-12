import React, { useMemo, useState } from 'react';
import { addDays, getDay, startOfDay } from 'date-fns';
import {
  GlobeIcon,
  ChevronLeftIcon,
  ClockIcon,
  VideoIcon,
  InfoIcon } from
'lucide-react';
import { MonthGrid, isAvailable } from '../components/calendar/MonthGrid';
import { TimeSlots } from '../components/calendar/TimeSlots';

const today = startOfDay(new Date(2026, 7, 24));

const morningSlots = [
'09:00',
'09:15',
'09:30',
'09:45',
'10:00',
'10:15',
'10:30',
'11:00',
'11:15',
'11:30'];


const afternoonSlots = [
'13:00',
'13:15',
'13:30',
'14:00',
'14:15',
'14:30',
'15:00',
'15:15',
'16:00',
'16:15',
'16:30',
'16:45'];


function firstAvailableDate() {
  let cursor = today;
  for (let index = 0; index < 40; index += 1) {
    if (isAvailable(cursor, today)) return cursor;
    cursor = addDays(cursor, 1);
  }
  return today;
}

interface SupportCallProps {
  onBack: () => void;
}

export function SupportCall({ onBack }: SupportCallProps) {
  const [month, setMonth] = useState<Date>(today);
  const [selectedDate, setSelectedDate] = useState<Date>(firstAvailableDate());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [hourFormat, setHourFormat] = useState<'12h' | '24h'>('24h');

  const slots = useMemo(() => {
    const weekday = getDay(selectedDate);
    if (weekday === 1) return afternoonSlots;
    if (weekday === 5) return morningSlots;
    return [...morningSlots, ...afternoonSlots];
  }, [selectedDate]);

  return (
    <>
      <div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 transition-colors duration-150 ease-out hover:text-brand-600">
          
          <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
          Înapoi la opțiunile de suport
        </button>
        <h1 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          Programează apelul de suport
        </h1>
        <p className="mt-1 text-sm text-ink-700">
          Sloturi de 15 minute cu un consultant Friendly, pe Zoom.
        </p>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col lg:flex-row">
          <div className="flex flex-col border-b border-slate-200 p-6 lg:w-[340px] lg:shrink-0 lg:border-b-0 lg:border-r lg:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink font-display text-sm font-extrabold text-white">
                F
              </span>
              <p className="text-sm font-semibold text-ink-500">
                Echipa de suport Friendly
              </p>
            </div>

            <h2 className="mt-4 font-display text-2xl font-extrabold leading-tight tracking-tight text-ink">
              Apel de suport tehnic
            </h2>

            <ul className="mt-5 space-y-3 text-sm font-semibold text-ink-700">
              <li className="flex items-center gap-2.5">
                <ClockIcon
                  className="h-[18px] w-[18px] text-ink-500"
                  aria-hidden="true" />
                
                15 min
              </li>
              <li className="flex items-center gap-2.5">
                <VideoIcon
                  className="h-[18px] w-[18px] text-ink-500"
                  aria-hidden="true" />
                
                Zoom — linkul vine la confirmare
              </li>
            </ul>

            <p className="mt-5 text-sm leading-relaxed text-ink-500">
              Consultantul intră cu contextul contului tău deja deschis:
              pipeline, automatizări și integrări. Spune-ne pe scurt problema la
              pasul următor ca să pregătim soluția înainte de apel.
            </p>

            <div className="mt-5 flex gap-2.5 rounded-xl bg-brand-50 p-4">
              <InfoIcon
                className="mt-0.5 h-4 w-4 shrink-0 text-brand-600"
                aria-hidden="true" />
              
              <p className="text-xs leading-relaxed text-ink-700">
                Dacă problema se rezolvă între timp prin chat, apelul se anulează
                automat și slotul se eliberează.
              </p>
            </div>
          </div>

          <div className="flex-1 p-6 lg:p-8">
            <p className="font-display text-lg font-extrabold tracking-tight text-ink">
              Alege data și ora
            </p>

            <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:gap-10">
              <div className="min-w-0 flex-1">
                <MonthGrid
                  month={month}
                  selectedDate={selectedDate}
                  today={today}
                  onMonthChange={setMonth}
                  onSelectDate={(date) => {
                    setSelectedDate(date);
                    setSelectedSlot(null);
                  }} />
                

                <div className="mt-8">
                  <p className="text-xs font-bold uppercase tracking-wide text-ink-500">
                    Fus orar
                  </p>
                  <button
                    type="button"
                    className="mt-2 inline-flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-semibold text-ink-700 transition-colors duration-150 ease-out hover:bg-slate-50">
                    
                    <GlobeIcon
                      className="h-4 w-4 text-ink-500"
                      aria-hidden="true" />
                    
                    Ora României (14:20)
                  </button>
                </div>
              </div>

              <TimeSlots
                date={selectedDate}
                slots={slots}
                selectedSlot={selectedSlot}
                hourFormat={hourFormat}
                onHourFormatChange={setHourFormat}
                onSelectSlot={setSelectedSlot} />
              
            </div>
          </div>
        </div>
      </div>
    </>);

}