import React, { useState } from 'react';
import {
  CheckIcon,
  XIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CheckCircle2Icon,
  UsersRoundIcon,
  BellRingIcon } from
'lucide-react';
import { categoryColors } from '../../data/tasks';
import { subAccounts } from '../../data/subAccounts';
import type { CalendarMember } from '../../data/calendars';

const NAME_LIMIT = 40;

const durations = [15, 30, 45, 60, 90];
const buffers = [0, 5, 10, 15, 30];

const googleCalendars = [
'andreas@eliteclosers.ro (principal)',
'Vânzări — echipa',
'Webinarii & evenimente',
'Personal'];


export interface CalendarDraft {
  name: string;
  purpose: string;
  color: string;
  duration: number;
  bufferBefore: number;
  bufferAfter: number;
  googleCalendar: string;
  addMeetLink: boolean;
  members: CalendarMember[];
}

interface CalendarFormProps {
  team?: boolean;
  onCreate: (draft: CalendarDraft) => void;
  onCancel: () => void;
}

const everyone = subAccounts.flatMap((group) =>
group.members.map((member) => ({ name: member, role: group.role }))
);

export function CalendarForm({
  team = false,
  onCreate,
  onCancel
}: CalendarFormProps) {
  const [members, setMembers] = useState<string[]>([]);

  const toggleMember = (name: string) =>
  setMembers((current) =>
  current.includes(name) ?
  current.filter((item) => item !== name) :
  [...current, name]
  );

  const [name, setName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [color, setColor] = useState(categoryColors[0]);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [duration, setDuration] = useState(30);
  const [bufferBefore, setBufferBefore] = useState(0);
  const [bufferAfter, setBufferAfter] = useState(10);
  const [googleCalendar, setGoogleCalendar] = useState(googleCalendars[0]);
  const [addMeetLink, setAddMeetLink] = useState(true);

  return (
    <section
      aria-labelledby="new-calendar-title"
      className="mt-6 rounded-2xl border border-brand-200 bg-white p-5 sm:p-6">
      
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2
            id="new-calendar-title"
            className="flex items-center gap-2 font-display text-base font-extrabold tracking-tight text-ink">
            
            {team && <UsersRoundIcon className="h-4 w-4" aria-hidden="true" />}
            {team ? 'Team calendar nou' : 'Calendar nou de rezervări'}
          </h2>
          <p className="text-xs text-ink-500">
            {team ?
            'Sloturile se distribuie între membrii invitați din sub-accounts.' :
            `Numele este obligatoriu, maximum ${NAME_LIMIT} de caractere.`}
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-500 transition-colors duration-150 ease-out hover:bg-slate-50 hover:text-ink"
          aria-label="Anulează">
          
          <XIcon className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div>
          <label
            htmlFor="calendarName"
            className="text-xs font-bold uppercase tracking-wide text-ink-500">
            
            Nume calendar *
          </label>
          <input
            id="calendarName"
            type="text"
            autoFocus
            maxLength={NAME_LIMIT}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ex.: Calendar parteneriate"
            className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold text-ink placeholder:font-normal placeholder:text-ink-500 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100" />
          
          <p className="mt-1.5 text-xs text-ink-500">
            {name.length}/{NAME_LIMIT} caractere
          </p>
        </div>

        <div>
          <label
            htmlFor="calendarPurpose"
            className="text-xs font-bold uppercase tracking-wide text-ink-500">
            
            Descriere (opțional)
          </label>
          <textarea
            id="calendarPurpose"
            rows={3}
            value={purpose}
            onChange={(event) => setPurpose(event.target.value)}
            placeholder="Pentru ce există acest calendar și cine îl rezervă?"
            className="mt-1.5 w-full resize-y rounded-lg border border-slate-200 px-3 py-2.5 text-sm leading-relaxed text-ink placeholder:text-ink-500 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100" />
          
        </div>
      </div>

      <p className="mt-4 text-[11px] font-bold uppercase tracking-wide text-ink-500">
        Culoare de referință
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {categoryColors.map((option) =>
        <button
          key={option}
          type="button"
          onClick={() => setColor(option)}
          aria-pressed={color === option}
          aria-label={`Culoarea ${option}`}
          className={`flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-150 ease-out ${
          color === option ?
          'ring-2 ring-ink ring-offset-2' :
          'hover:scale-105'}`
          }
          style={{ backgroundColor: option }}>
          
            {color === option &&
          <CheckIcon
            className="h-4 w-4 text-white"
            strokeWidth={3}
            aria-hidden="true" />

          }
          </button>
        )}
      </div>

      {team &&
      <div className="mt-5 border-t border-slate-100 pt-4">
          <p className="text-[11px] font-bold uppercase tracking-wide text-ink-500">
            Invită membri din sub-accounts
          </p>
          <div className="mt-2 w-72 max-w-full">
            <div className="max-h-80 overflow-y-auto rounded-xl border border-slate-200 bg-white p-3 shadow-2xl">
              <p className="pb-2 text-[11px] font-bold uppercase tracking-wide text-ink-500">
                Sub-accounts active · {everyone.length}
              </p>
              {subAccounts.map((group) =>
            <div key={group.role} className="mb-3 last:mb-0">
                  <p className="flex items-center gap-2 pb-1 text-[11px] font-bold uppercase tracking-wide text-ink-500">
                    <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: group.color }}
                  aria-hidden="true" />
                
                    {group.role}
                  </p>
                  {group.members.map((member) => {
                const selected = members.includes(member);
                return (
                  <button
                    key={member}
                    type="button"
                    onClick={() => toggleMember(member)}
                    aria-pressed={selected}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left text-sm font-semibold transition-colors duration-150 ease-out ${
                    selected ?
                    'bg-brand-50 text-brand-700' :
                    'text-ink-700 hover:bg-slate-50 hover:text-brand-700'}`
                    }>
                    
                        <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: group.color }}
                      aria-hidden="true" />
                    
                        <span className="flex-1 truncate">{member}</span>
                        {selected &&
                    <CheckIcon
                      className="h-4 w-4 shrink-0"
                      strokeWidth={2.5}
                      aria-hidden="true" />

                    }
                      </button>);

              })}
                </div>
            )}
            </div>
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-xs text-ink-500">
            <BellRingIcon className="h-3.5 w-3.5" aria-hidden="true" />
            {members.length} membri invitați vor primi notificare în CRM și pe
            email.
          </p>
        </div>
      }

      <div className="mt-5 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={() => setAdvancedOpen((value) => !value)}
          aria-expanded={advancedOpen}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 underline-offset-4 hover:underline">
          
          Setări avansate
          {advancedOpen ?
          <ChevronUpIcon className="h-4 w-4" aria-hidden="true" /> :

          <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
          }
        </button>

        {advancedOpen &&
        <div className="mt-4 space-y-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-ink-500">
                Durata întâlnirii
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {durations.map((option) =>
              <button
                key={option}
                type="button"
                onClick={() => setDuration(option)}
                aria-pressed={duration === option}
                className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors duration-150 ease-out ${
                duration === option ?
                'border-brand-300 bg-brand-50 text-brand-700' :
                'border-slate-200 text-ink-700 hover:bg-slate-50'}`
                }>
                
                    {option} min
                  </button>
              )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-ink-500">
                  Buffer înainte
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {buffers.map((option) =>
                <button
                  key={option}
                  type="button"
                  onClick={() => setBufferBefore(option)}
                  aria-pressed={bufferBefore === option}
                  className={`rounded-lg border px-2.5 py-1.5 text-xs font-bold transition-colors duration-150 ease-out ${
                  bufferBefore === option ?
                  'border-brand-300 bg-brand-50 text-brand-700' :
                  'border-slate-200 text-ink-700 hover:bg-slate-50'}`
                  }>
                  
                      {option === 0 ? 'Fără' : `${option} min`}
                    </button>
                )}
                </div>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-ink-500">
                  Buffer după
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {buffers.map((option) =>
                <button
                  key={option}
                  type="button"
                  onClick={() => setBufferAfter(option)}
                  aria-pressed={bufferAfter === option}
                  className={`rounded-lg border px-2.5 py-1.5 text-xs font-bold transition-colors duration-150 ease-out ${
                  bufferAfter === option ?
                  'border-brand-300 bg-brand-50 text-brand-700' :
                  'border-slate-200 text-ink-700 hover:bg-slate-50'}`
                  }>
                  
                      {option === 0 ? 'Fără' : `${option} min`}
                    </button>
                )}
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2Icon
                className="h-4 w-4 text-emerald-600"
                aria-hidden="true" />
              
                <p className="text-sm font-bold text-ink">
                  Google Calendar conectat
                </p>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                  andreas@eliteclosers.ro
                </span>
              </div>

              <label
              htmlFor="googleCalendar"
              className="mt-4 block text-xs font-bold uppercase tracking-wide text-ink-500">
              
                În ce calendar Google se adaugă programările?
              </label>
              <select
              id="googleCalendar"
              value={googleCalendar}
              onChange={(event) => setGoogleCalendar(event.target.value)}
              className="mt-1.5 w-full max-w-sm rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-ink focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100">
              
                {googleCalendars.map((option) =>
              <option key={option} value={option}>
                    {option}
                  </option>
              )}
              </select>

              <button
              type="button"
              onClick={() => setAddMeetLink((value) => !value)}
              aria-pressed={addMeetLink}
              className="mt-4 flex items-center gap-2.5 text-left">
              
                <span
                className={`flex h-5 w-9 items-center rounded-full p-0.5 transition-colors duration-150 ease-out ${addMeetLink ? 'bg-brand-500' : 'bg-slate-300'}`}>
                
                  <span
                  className={`h-4 w-4 rounded-full bg-white transition-transform duration-150 ease-out ${addMeetLink ? 'translate-x-4' : ''}`} />
                
                </span>
                <span className="text-sm font-semibold text-ink-700">
                  Generează automat link Zoom
                </span>
              </button>
            </div>
          </div>
        }
      </div>

      <div className="mt-5 flex items-center gap-2">
        <button
          type="button"
          disabled={
          name.trim().length === 0 || team && members.length === 0
          }
          onClick={() =>
          onCreate({
            name: name.trim(),
            purpose: purpose.trim(),
            color,
            duration,
            bufferBefore,
            bufferAfter,
            googleCalendar,
            addMeetLink,
            members: everyone.
            filter((member) => members.includes(member.name)).
            map((member) => ({ ...member, connected: false }))
          })
          }
          className="rounded-lg bg-brand-500 px-3.5 py-2.5 font-display text-sm font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600 disabled:bg-slate-200 disabled:text-ink-500">
          
          {team ? 'Creează team calendarul' : 'Creează calendarul'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm font-semibold text-ink-500 underline-offset-4 hover:text-ink-700 hover:underline">
          
          Anulează
        </button>
      </div>
    </section>);

}