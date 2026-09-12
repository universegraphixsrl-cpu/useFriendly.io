import React from 'react';
import {
  ClockIcon,
  VideoIcon,
  ChevronLeftIcon,
  InfoIcon,
  UsersIcon } from
'lucide-react';
import type { BookingCalendar } from '../../data/calendars';

interface EventDetailsProps {
  calendar: BookingCalendar;
  onBack: () => void;
}

export function EventDetails({ calendar, onBack }: EventDetailsProps) {
  return (
    <div className="flex flex-col border-b border-slate-200 p-6 lg:w-[340px] lg:shrink-0 lg:border-b-0 lg:border-r lg:p-8">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 flex h-9 w-9 items-center justify-center rounded-full text-ink-700 transition-colors duration-150 ease-out hover:bg-slate-100"
        aria-label="Înapoi la lista de calendare">
        
        <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
      </button>

      <div className="flex items-center gap-3">
        <span
          className="flex h-11 w-11 items-center justify-center rounded-full font-display text-sm font-extrabold text-white"
          style={{ backgroundColor: calendar.color }}>
          
          {calendar.initials}
        </span>
        <p className="text-sm font-semibold text-ink-500">{calendar.host}</p>
      </div>

      <h1 className="mt-4 font-display text-2xl font-extrabold leading-tight tracking-tight text-ink">
        {calendar.name}
      </h1>

      <ul className="mt-5 space-y-3 text-sm font-semibold text-ink-700">
        <li className="flex items-center gap-2.5">
          <ClockIcon
            className="h-[18px] w-[18px] text-ink-500"
            aria-hidden="true" />
          
          {calendar.duration} min
        </li>
        <li className="flex items-center gap-2.5">
          <VideoIcon
            className="h-[18px] w-[18px] text-ink-500"
            aria-hidden="true" />
          
          {calendar.location} — link trimis la confirmare
        </li>
        <li className="flex items-center gap-2.5">
          <UsersIcon
            className="h-[18px] w-[18px] text-ink-500"
            aria-hidden="true" />
          
          {calendar.type}
        </li>
      </ul>

      <p className="mt-5 text-sm leading-relaxed text-ink-500">
        {calendar.purpose}
      </p>

      <div className="mt-5 flex gap-2.5 rounded-xl bg-brand-50 p-4">
        <InfoIcon
          className="mt-0.5 h-4 w-4 shrink-0 text-brand-600"
          aria-hidden="true" />
        
        <p className="text-xs leading-relaxed text-ink-700">
          Disponibilitate: {calendar.days}. Reminder automat pe email și WhatsApp
          înainte de întâlnire.
        </p>
      </div>

      <div className="mt-auto hidden pt-8 lg:block">
        <button
          type="button"
          className="text-xs font-semibold text-ink-500 underline-offset-4 hover:underline">
          
          Setări cookie-uri
        </button>
      </div>
    </div>);

}