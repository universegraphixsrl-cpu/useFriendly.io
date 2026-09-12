import React, { useMemo, useState } from 'react';
import { addDays, startOfDay } from 'date-fns';
import {
  GlobeIcon,
  LinkIcon,
  PlusIcon,
  SettingsIcon,
  PowerIcon,
  ArrowRightIcon,
  AlertCircleIcon,

  ClipboardListIcon } from
'lucide-react';
import { EventDetails } from '../components/calendar/EventDetails';
import { MonthGrid, isAvailable } from '../components/calendar/MonthGrid';
import { TimeSlots } from '../components/calendar/TimeSlots';
import {
  CalendarForm,
  type CalendarDraft } from
'../components/calendar/CalendarForm';
import { CalendarTypeDialog } from '../components/calendar/CalendarTypeDialog';
import { CalendarRowMenu } from '../components/calendar/CalendarRowMenu';
import { CalendarEditRow } from '../components/calendar/CalendarEditRow';
import { CalendarMembers } from '../components/calendar/CalendarMembers';
import { BookingsView } from '../components/calendar/BookingsView';
import {
  slotsForDuration,
  type BookingCalendar } from
'../data/calendars';
import { AvailabilityEditor } from '../components/calendar/AvailabilityEditor';
import { useWorkspace } from '../contexts/WorkspaceContext';

const today = startOfDay(new Date(2026, 7, 24));

function firstAvailableDate() {
  let cursor = today;
  for (let index = 0; index < 40; index += 1) {
    if (isAvailable(cursor, today)) return cursor;
    cursor = addDays(cursor, 1);
  }
  return today;
}

export function Calendar() {
  const {
    activeUser,
    calendars: allCalendars,
    setCalendars,
    availability,
    setAvailability
  } = useWorkspace();
  const isSub = activeUser !== null;
  const [availabilityOpen, setAvailabilityOpen] = useState(false);

  /** Sub-accountul vede calendarele lui și pe cele de echipă la care e invitat */
  const calendars = isSub ?
  allCalendars.filter(
    (item) =>
    item.owner === activeUser ||
    item.members?.some((member) => member.name === activeUser)
  ) :
  allCalendars.filter((item) => !item.owner);

  const [openId, setOpenId] = useState<string | null>(null);
  const [month, setMonth] = useState<Date>(today);
  const [selectedDate, setSelectedDate] = useState<Date>(firstAvailableDate());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [hourFormat, setHourFormat] = useState<'12h' | '24h'>('24h');
  const [formMode, setFormMode] = useState<'solo' | 'team' | null>(null);
  const [typeDialog, setTypeDialog] = useState(false);
  const [bookingsFor, setBookingsFor] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const duplicateCalendar = (id: string) =>
  setCalendars((current) => {
    const index = current.findIndex((item) => item.id === id);
    if (index === -1) return current;
    const source = current[index];
    const copy: BookingCalendar = {
      ...source,
      id: `${source.id}-copy-${Date.now()}`,
      name: `${source.name} (copie)`,
      active: false
    };
    return [
    ...current.slice(0, index + 1),
    copy,
    ...current.slice(index + 1)];

  });

  const deleteCalendar = (id: string) => {
    setCalendars((current) => current.filter((item) => item.id !== id));
    if (openId === id) setOpenId(null);
    if (editingId === id) setEditingId(null);
  };

  const createCalendar = (draft: CalendarDraft) => {
    const buffer =
    draft.bufferBefore || draft.bufferAfter ?
    ` · buffer ${draft.bufferBefore}/${draft.bufferAfter} min` :
    '';
    const isTeam = draft.members.length > 0;
    setCalendars((current) => [
    ...current,
    {
      id: `cal-${Date.now()}`,
      name: draft.name,
      purpose: draft.purpose || 'Fără descriere',
      duration: draft.duration,
      location: draft.addMeetLink ? 'Zoom' : 'Fără link video',
      type: isTeam ? 'Colectiv' : 'One-on-One',
      days: `Lun – Vin · 09:00 – 18:00${buffer} · Google: ${draft.googleCalendar}`,
      color: draft.color,
      active: true,
      host: isTeam ? 'Echipa invitată' : activeUser ?? 'Andreas Bălan',
      initials: isTeam ?
      'EI' :
      (activeUser ?? 'Andreas Bălan').
      split(' ').
      map((part) => part[0]).
      join('').
      slice(0, 2),
      members: isTeam ? draft.members : undefined,
      owner: activeUser ?? undefined
    }]
    );
    setFormMode(null);
  };

  const openCalendar = calendars.find((item) => item.id === openId) ?? null;
  const activeCount = calendars.filter((item) => item.active).length;

  const slots = useMemo(
    () => openCalendar ? slotsForDuration(openCalendar.duration) : [],
    [openCalendar]
  );

  const toggleActive = (id: string) =>
  setCalendars((current) =>
  current.map((item) =>
  item.id === id ? { ...item, active: !item.active } : item
  )
  );

  if (bookingsFor) {
    return (
      <BookingsView
        calendars={calendars}
        calendarId={bookingsFor === 'all' ? undefined : bookingsFor}
        onBack={() => setBookingsFor(null)} />);


  }

  if (openCalendar) {
    return (
      <>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col lg:flex-row">
            <EventDetails
              calendar={openCalendar}
              onBack={() => {
                setOpenId(null);
                setSelectedSlot(null);
              }} />
            

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

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Calendar
          </h1>
          <p className="mt-1 text-sm text-ink-700">
            {isSub ?
            `${activeCount} calendare active din ${calendars.length}. Setează-ți disponibilitatea — se preia automat în calendarele de echipă.` :
            `${activeCount} calendare active din ${calendars.length}. Fiecare are propriul link public de rezervare.`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setTypeDialog(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-3 py-2 text-sm font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600">
            
            <PlusIcon className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
            Calendar nou
          </button>
          <button
            type="button"
            onClick={() => setAvailabilityOpen((value) => !value)}
            aria-expanded={availabilityOpen}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-ink-700 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
            
            <SettingsIcon className="h-4 w-4" aria-hidden="true" />
            Disponibilitate
          </button>
          <button
            type="button"
            onClick={() => setBookingsFor('all')}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-ink-700 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
            
            <ClipboardListIcon className="h-4 w-4" aria-hidden="true" />
            Vezi toate programările
          </button>
        </div>
      </div>

      {typeDialog &&
      <CalendarTypeDialog
        allowTeam={!isSub}
        onChoose={(type) => {
          setTypeDialog(false);
          setFormMode(type);
        }}
        onClose={() => setTypeDialog(false)} />

      }

      {availabilityOpen &&
      <AvailabilityEditor
        value={availability[activeUser ?? 'admin']}
        onSave={(value) => {
          setAvailability((current) => ({
            ...current,
            [activeUser ?? 'admin']: value
          }));
          setAvailabilityOpen(false);
        }}
        onCancel={() => setAvailabilityOpen(false)} />

      }

      {formMode &&
      <CalendarForm
        key={formMode}
        team={formMode === 'team'}
        onCreate={createCalendar}
        onCancel={() => setFormMode(null)} />

      }

      <ul className="mt-6 space-y-3">
        {calendars.map((calendar) =>
        <li
          key={calendar.id}
          className={`rounded-2xl border border-l-4 p-4 sm:p-5 ${
          calendar.active ?
          'border-slate-200 bg-white' :
          'border-slate-200 bg-slate-100/70'}`
          }
          style={{
            borderLeftColor: calendar.active ? calendar.color : '#cbd5e1'
          }}>
          
            {editingId === calendar.id ?
          <CalendarEditRow
            calendar={calendar}
            onSave={(patch) => {
              setCalendars((current) =>
              current.map((item) =>
              item.id === calendar.id ? { ...item, ...patch } : item
              )
              );
              setEditingId(null);
            }}
            onCancel={() => setEditingId(null)} /> :


          <div className="flex flex-wrap items-start gap-4">
              <div className="min-w-[240px] flex-1">
                <div className="flex items-center gap-2">
                  <h2
                  className={`font-display text-sm font-bold ${calendar.active ? 'text-ink' : 'text-ink-500'}`}>
                  
                    {calendar.name}
                  </h2>
                  {!calendar.active &&
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700">
                      <AlertCircleIcon
                    className="h-3 w-3"
                    aria-hidden="true" />
                  
                      Inactiv
                    </span>
                }
                </div>
                <p className="mt-0.5 text-xs font-semibold text-ink-500">
                  {calendar.duration} min · {calendar.location} ·{' '}
                  {calendar.type}
                </p>
                <p className="mt-1 text-xs text-ink-500">{calendar.purpose}</p>
                <p className="mt-1 text-xs text-ink-500">{calendar.days}</p>
                {calendar.members && calendar.members.length > 0 &&
              <CalendarMembers members={calendar.members} />
              }
              </div>

              {calendar.active ?
            <div className="flex flex-wrap items-center gap-2">
                  <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-ink-700 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
                
                    <LinkIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    Copiază linkul
                  </button>
                  <button
                type="button"
                onClick={() => setBookingsFor(calendar.id)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-ink-700 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
                
                    <ClipboardListIcon
                  className="h-3.5 w-3.5"
                  aria-hidden="true" />
                
                    Programări
                  </button>
                  <button
                type="button"
                onClick={() => {
                  setOpenId(calendar.id);
                  setSelectedSlot(null);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-2.5 py-1.5 text-xs font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600">
                
                    Deschide calendarul
                    <ArrowRightIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                  <button
                type="button"
                onClick={() => toggleActive(calendar.id)}
                className="rounded-lg px-2.5 py-1.5 text-xs font-bold text-ink-500 transition-colors duration-150 ease-out hover:bg-slate-50 hover:text-ink-700">
                
                    Dezactivează
                  </button>
                  {(!isSub || calendar.owner === activeUser) &&
              <CalendarRowMenu
                calendarName={calendar.name}
                onEdit={() => setEditingId(calendar.id)}
                onDuplicate={() => duplicateCalendar(calendar.id)}
                onDelete={() => deleteCalendar(calendar.id)} />

              }
                </div> :

            <div className="flex items-center gap-2">
                  <button
                type="button"
                onClick={() => setBookingsFor(calendar.id)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-ink-700 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
                
                    <ClipboardListIcon
                  className="h-3.5 w-3.5"
                  aria-hidden="true" />
                
                    Programări
                  </button>
                  <button
                type="button"
                onClick={() => toggleActive(calendar.id)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-ink-700 transition-colors duration-150 ease-out hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700">
                
                    <PowerIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    Activează
                  </button>
                  {(!isSub || calendar.owner === activeUser) &&
              <CalendarRowMenu
                calendarName={calendar.name}
                onEdit={() => setEditingId(calendar.id)}
                onDuplicate={() => duplicateCalendar(calendar.id)}
                onDelete={() => deleteCalendar(calendar.id)} />

              }
                </div>
            }
            </div>
          }
          </li>
        )}
      </ul>
    </>);

}