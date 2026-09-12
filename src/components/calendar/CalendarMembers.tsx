import React, { useState } from 'react';
import { UsersRoundIcon, ChevronDownIcon } from 'lucide-react';
import type { CalendarMember } from '../../data/calendars';

interface CalendarMembersProps {
  members: CalendarMember[];
}

export function CalendarMembers({ members }: CalendarMembersProps) {
  const [open, setOpen] = useState(false);
  const connected = members.filter((member) => member.connected).length;

  return (
    <div className="mt-3 border-t border-slate-100 pt-3">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="inline-flex items-center gap-2 text-xs font-bold text-ink-700 transition-colors duration-150 ease-out hover:text-brand-600">
        
        <UsersRoundIcon className="h-3.5 w-3.5" aria-hidden="true" />
        Membri · {connected}/{members.length} s-au conectat
        <ChevronDownIcon
          className={`h-3.5 w-3.5 transition-transform duration-150 ease-out ${open ? 'rotate-180' : ''}`}
          aria-hidden="true" />
        
      </button>

      {open &&
      <ul className="mt-2 grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) =>
        <li
          key={member.name}
          className="flex items-center gap-2 rounded-lg bg-slate-50 px-2.5 py-1.5">
          
              <span
            className={`h-2 w-2 shrink-0 rounded-full ${member.connected ? 'bg-emerald-500' : 'bg-slate-300'}`}
            aria-hidden="true" />
          
              <span className="flex-1 truncate text-xs font-semibold text-ink-700">
                {member.name}
              </span>
              <span className="text-[11px] font-semibold text-ink-500">
                {member.connected ? 'Conectat' : 'În așteptare'}
              </span>
            </li>
        )}
        </ul>
      }
    </div>);

}