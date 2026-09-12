import React, { useState } from 'react';
import { XIcon } from 'lucide-react';
import { leadOwners } from '../../data/leads';

export interface BookingContact {
  firstName: string;
  lastName: string;
  email: string;
  owner: string;
  details: string;
}

interface BookingDetailProps {
  contact: BookingContact;
  /** Data și ora programării, doar pentru context */
  when: string;
  onSave: (contact: BookingContact) => void;
  onClose: () => void;
}

const labelClass = 'text-xs font-bold uppercase tracking-wide text-ink-500';
const fieldClass =
'mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold text-ink placeholder:font-normal placeholder:text-ink-500 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100';

export function BookingDetail({
  contact,
  when,
  onSave,
  onClose
}: BookingDetailProps) {
  const [draft, setDraft] = useState<BookingContact>(contact);

  const patch = (changes: Partial<BookingContact>) =>
  setDraft((current) => ({ ...current, ...changes }));

  const dirty = JSON.stringify(draft) !== JSON.stringify(contact);

  return (
    <section
      aria-labelledby="booking-detail-title"
      className="mt-4 rounded-2xl border border-brand-200 bg-white p-5 sm:p-6">
      
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2
            id="booking-detail-title"
            className="font-display text-lg font-extrabold tracking-tight text-ink">
            
            Fișa programării · {draft.firstName} {draft.lastName}
          </h2>
          <p className="text-xs text-ink-500">
            {when} · modificările se aplică doar după ce apeși „Salvează”.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Închide fișa"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-500 transition-colors duration-150 ease-out hover:bg-slate-50 hover:text-ink">
          
          <XIcon className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="bookingOwner" className={labelClass}>
            Programat cu
          </label>
          <select
            id="bookingOwner"
            value={draft.owner}
            onChange={(event) => patch({ owner: event.target.value })}
            className={fieldClass}>
            
            {[draft.owner, ...leadOwners.filter((n) => n !== draft.owner)].map(
              (name) =>
              <option key={name} value={name}>
                  {name}
                </option>

            )}
          </select>
        </div>

        <div>
          <label htmlFor="bookingEmail" className={labelClass}>
            Email
          </label>
          <input
            id="bookingEmail"
            type="email"
            value={draft.email}
            onChange={(event) => patch({ email: event.target.value })}
            className={fieldClass} />
          
        </div>

        <div>
          <label htmlFor="bookingFirstName" className={labelClass}>
            Prenume
          </label>
          <input
            id="bookingFirstName"
            type="text"
            value={draft.firstName}
            onChange={(event) => patch({ firstName: event.target.value })}
            className={fieldClass} />
          
        </div>

        <div>
          <label htmlFor="bookingLastName" className={labelClass}>
            Nume
          </label>
          <input
            id="bookingLastName"
            type="text"
            value={draft.lastName}
            onChange={(event) => patch({ lastName: event.target.value })}
            className={fieldClass} />
          
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="bookingDetails" className={labelClass}>
            Detalii
          </label>
          <textarea
            id="bookingDetails"
            rows={5}
            value={draft.details}
            onChange={(event) => patch({ details: event.target.value })}
            placeholder="Context, răspunsurile din formular, notițe de pe apel…"
            className={`${fieldClass} resize-y font-normal`} />
          
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
        <button
          type="button"
          disabled={!dirty}
          onClick={() => onSave(draft)}
          className="rounded-lg bg-brand-500 px-3.5 py-2.5 font-display text-sm font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600 disabled:bg-slate-200 disabled:text-ink-500">
          
          Salvează
        </button>
        <button
          type="button"
          onClick={onClose}
          className="text-sm font-semibold text-ink-500 underline-offset-4 hover:text-ink-700 hover:underline">
          
          Anulează
        </button>
        {dirty &&
        <span className="text-xs font-semibold text-amber-700">
            Ai modificări nesalvate
          </span>
        }
      </div>
    </section>);

}