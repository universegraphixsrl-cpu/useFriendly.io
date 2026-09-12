import React, { useEffect, useState } from 'react';
import {
  ArrowLeftIcon,
  ClockIcon,
  MailIcon,
  PhoneIcon,
  UserIcon,
  ChevronDownIcon,
  CheckIcon } from
'lucide-react';
import {
  bookings as allBookings,
  formatBookingDate,
  isUpcoming,
  type Booking } from
'../../data/bookings';
import type { BookingCalendar } from '../../data/calendars';
import {
  DateFilter,
  matchesFilter,
  type LeadDateFilter } from
'../leads/DateFilter';
import { BookingDetail, type BookingContact } from './BookingDetail';
import { Toast } from '../Toast';

/** Construiește fișa programării pornind de la rezervare */
function bookingToContact(booking: Booking): BookingContact {
  const [firstName, ...rest] = booking.leadName.split(' ');
  return {
    firstName,
    lastName: rest.join(' '),
    email: booking.email,
    owner: booking.owner,
    details: booking.fields.
    map((field) => `${field.label}: ${field.value}`).
    join('\n')
  };
}

interface BookingsViewProps {
  calendars: BookingCalendar[];
  /** Când e setat, se afișează doar programările acestui calendar */
  calendarId?: string;
  onBack: () => void;
}

type Timeline = 'all' | 'upcoming' | 'past';

const timelines: {value: Timeline;label: string;}[] = [
{ value: 'all', label: 'Toate' },
{ value: 'upcoming', label: 'Active' },
{ value: 'past', label: 'Trecute' }];


export function BookingsView({
  calendars,
  calendarId,
  onBack
}: BookingsViewProps) {
  const [dateFilter, setDateFilter] = useState<LeadDateFilter>({ kind: 'all' });
  const [timeline, setTimeline] = useState<Timeline>('all');
  const [owner, setOwner] = useState<string | null>(null);
  const [calendarFilter, setCalendarFilter] = useState<string | null>(
    calendarId ?? null
  );
  const [calendarMenuOpen, setCalendarMenuOpen] = useState(false);
  const [ownerMenuOpen, setOwnerMenuOpen] = useState(false);
  const [openBookingId, setOpenBookingId] = useState<string | null>(null);
  const [contacts, setContacts] = useState<Record<string, BookingContact>>({});
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const calendar = calendarId ?
  calendars.find((item) => item.id === calendarId) :
  undefined;

  const visibleSource = allBookings;

  const scoped = allBookings.filter((booking) =>
  calendarId ? booking.calendarId === calendarId : true
  );

  const owners = Array.from(
    new Set(scoped.map((booking) => booking.owner))
  ).sort();

  const visible = scoped.
  filter((booking) =>
  calendarId || !calendarFilter ?
  true :
  booking.calendarId === calendarFilter
  ).
  filter((booking) => owner ? booking.owner === owner : true).
  filter((booking) => matchesFilter(booking.date, dateFilter)).
  filter((booking) =>
  timeline === 'all' ?
  true :
  timeline === 'upcoming' ?
  isUpcoming(booking) :
  !isUpcoming(booking)
  ).
  sort((a, b) => a.date + a.time < b.date + b.time ? 1 : -1);

  const leadFor = (booking: Booking) =>
  contacts[booking.id] ?? bookingToContact(booking);

  const openBooking = visibleSource.find(
    (booking) => booking.id === openBookingId
  );

  const colorFor = (booking: Booking) =>
  calendars.find((item) => item.id === booking.calendarId)?.color ?? '#94a3b8';
  const nameFor = (booking: Booking) =>
  calendars.find((item) => item.id === booking.calendarId)?.name ??
  'Calendar șters';

  return (
    <>
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 transition-colors duration-150 ease-out hover:text-brand-600">
        
        <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
        Toate calendarele
      </button>

      <div className="mt-4">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          {calendar ? `Programări · ${calendar.name}` : 'Toate programările'}
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          {visible.length} programări afișate din {scoped.length} ·{' '}
          {scoped.filter(isUpcoming).length} active,{' '}
          {scoped.filter((booking) => !isUpcoming(booking)).length} trecute.
        </p>
      </div>

      {openBooking &&
      <BookingDetail
        key={openBooking.id}
        contact={leadFor(openBooking)}
        when={`${formatBookingDate(openBooking.date)} · ${openBooking.time}`}
        onSave={(updated) => {
          setContacts((current) => ({
            ...current,
            [openBooking.id]: updated
          }));
          setOpenBookingId(null);
          setToast('Acțiune modificată cu succes');
        }}
        onClose={() => setOpenBookingId(null)} />

      }

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <DateFilter filter={dateFilter} onChange={setDateFilter} />

        {!calendarId &&
        <div className="relative">
            <button
            type="button"
            onClick={() => setCalendarMenuOpen((value) => !value)}
            aria-expanded={calendarMenuOpen}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-ink-700 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
            
              {calendarFilter ?
            calendars.find((item) => item.id === calendarFilter)?.name :
            'Toate calendarele'}
              <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
            </button>
            {calendarMenuOpen &&
          <>
                <button
              type="button"
              className="fixed inset-0 z-10 cursor-default"
              onClick={() => setCalendarMenuOpen(false)}
              tabIndex={-1}
              aria-label="Închide lista de calendare" />
            
                <div className="absolute left-0 z-20 mt-1.5 w-72 rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl">
                  <button
                type="button"
                onClick={() => {
                  setCalendarFilter(null);
                  setCalendarMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-semibold text-ink-700 transition-colors duration-150 ease-out hover:bg-slate-50">
                
                    <span className="flex-1">Toate calendarele</span>
                    {!calendarFilter &&
                <CheckIcon
                  className="h-4 w-4 text-brand-600"
                  aria-hidden="true" />

                }
                  </button>
                  {calendars.map((item) =>
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setCalendarFilter(item.id);
                  setCalendarMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-semibold text-ink-700 transition-colors duration-150 ease-out hover:bg-slate-50">
                
                      <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: item.color }}
                  aria-hidden="true" />
                
                      <span className="flex-1 truncate">{item.name}</span>
                      {calendarFilter === item.id &&
                <CheckIcon
                  className="h-4 w-4 text-brand-600"
                  aria-hidden="true" />

                }
                    </button>
              )}
                </div>
              </>
          }
          </div>
        }

        <div className="relative">
          <button
            type="button"
            onClick={() => setOwnerMenuOpen((value) => !value)}
            aria-expanded={ownerMenuOpen}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-ink-700 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
            
            <UserIcon className="h-4 w-4" aria-hidden="true" />
            {owner ?? 'Toate sub-accounts'}
            <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
          </button>
          {ownerMenuOpen &&
          <>
              <button
              type="button"
              className="fixed inset-0 z-10 cursor-default"
              onClick={() => setOwnerMenuOpen(false)}
              tabIndex={-1}
              aria-label="Închide lista de sub-accounts" />
            
              <div className="absolute left-0 z-20 mt-1.5 max-h-72 w-60 overflow-y-auto rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl">
                <button
                type="button"
                onClick={() => {
                  setOwner(null);
                  setOwnerMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-semibold text-ink-700 transition-colors duration-150 ease-out hover:bg-slate-50">
                
                  <span className="flex-1">Toate sub-accounts</span>
                  {!owner &&
                <CheckIcon
                  className="h-4 w-4 text-brand-600"
                  aria-hidden="true" />

                }
                </button>
                {owners.map((name) =>
              <button
                key={name}
                type="button"
                onClick={() => {
                  setOwner(name);
                  setOwnerMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-semibold text-ink-700 transition-colors duration-150 ease-out hover:bg-slate-50">
                
                    <span className="flex-1 truncate">{name}</span>
                    {owner === name &&
                <CheckIcon
                  className="h-4 w-4 text-brand-600"
                  aria-hidden="true" />

                }
                  </button>
              )}
              </div>
            </>
          }
        </div>

        <span className="h-5 w-px bg-slate-200" aria-hidden="true" />

        {timelines.map((option) =>
        <button
          key={option.value}
          type="button"
          onClick={() => setTimeline(option.value)}
          aria-pressed={timeline === option.value}
          className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-colors duration-150 ease-out ${
          timeline === option.value ?
          'border-brand-300 bg-brand-50 text-brand-700' :
          'border-slate-200 bg-white text-ink-700 hover:bg-slate-50'}`
          }>
          
            {option.label}
          </button>
        )}
      </div>

      {visible.length === 0 ?
      <p className="mt-6 rounded-2xl border border-slate-200 bg-white px-4 py-8 text-center text-sm font-semibold text-ink-500">
          Nicio programare pentru filtrele selectate.
        </p> :

      <ul className="mt-5 space-y-3">
          {visible.map((booking) => {
          const upcoming = isUpcoming(booking);
          return (
            <li
              key={booking.id}
              className={`rounded-2xl border border-l-4 border-slate-200 p-4 sm:p-5 ${
              upcoming ? 'bg-white' : 'bg-slate-50'}`
              }
              style={{ borderLeftColor: colorFor(booking) }}>
              
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-[220px]">
                    <div className="flex items-center gap-2">
                      <button
                      type="button"
                      onClick={() => setOpenBookingId(booking.id)}
                      className="font-display text-sm font-bold text-ink underline-offset-4 transition-colors duration-150 ease-out hover:text-brand-600 hover:underline">
                      
                        {leadFor(booking).firstName}{' '}
                        {leadFor(booking).lastName}
                      </button>
                      <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                      upcoming ?
                      'bg-emerald-50 text-emerald-700' :
                      'bg-slate-200 text-ink-700'}`
                      }>
                      
                        {upcoming ? 'Activă' : 'Trecută'}
                      </span>
                    </div>
                    {!calendarId &&
                  <p className="mt-0.5 text-xs font-semibold text-ink-500">
                        {nameFor(booking)}
                      </p>
                  }
                    <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-500">
                      <span className="inline-flex items-center gap-1.5">
                        <PhoneIcon className="h-3.5 w-3.5" aria-hidden="true" />
                        {booking.phone}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <MailIcon className="h-3.5 w-3.5" aria-hidden="true" />
                        {leadFor(booking).email}
                      </span>
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="inline-flex items-center gap-1.5 font-display text-sm font-bold text-ink">
                      <ClockIcon className="h-4 w-4" aria-hidden="true" />
                      {formatBookingDate(booking.date)} · {booking.time}
                    </p>
                    <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-ink-500">
                      <UserIcon className="h-3.5 w-3.5" aria-hidden="true" />
                      Programat cu: {leadFor(booking).owner}
                    </p>
                  </div>
                </div>

              </li>);

        })}
        </ul>
      }

      {toast && <Toast message={toast} />}
    </>);

}