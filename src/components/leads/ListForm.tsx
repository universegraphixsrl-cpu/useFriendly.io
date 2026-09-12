import React, { useState } from 'react';
import { CheckIcon, XIcon } from 'lucide-react';
import { categoryColors } from '../../data/tasks';
import { subAccounts } from '../../data/subAccounts';

interface ListFormProps {
  onCreate: (
  name: string,
  detail: string,
  color: string,
  access: string[])
  => void;
  onCancel: () => void;
}

export function ListForm({ onCreate, onCancel }: ListFormProps) {
  const [name, setName] = useState('');
  const [detail, setDetail] = useState('');
  const [color, setColor] = useState(categoryColors[0]);
  const [access, setAccess] = useState<string[]>([]);
  const allMembers = subAccounts.flatMap((group) => group.members);

  const toggleAccess = (member: string) =>
  setAccess((current) =>
  current.includes(member) ?
  current.filter((item) => item !== member) :
  [...current, member]
  );

  return (
    <section
      aria-labelledby="new-list-title"
      className="mt-6 rounded-2xl border border-brand-200 bg-white p-5 sm:p-6">
      
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2
            id="new-list-title"
            className="font-display text-base font-extrabold tracking-tight text-ink">
            
            Listă nouă de leaduri
          </h2>
          <p className="text-xs text-ink-500">
            Dă-i un nume și alege culoarea cu care apare în pagină.
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
            htmlFor="listName"
            className="text-xs font-bold uppercase tracking-wide text-ink-500">
            
            Nume listă *
          </label>
          <input
            id="listName"
            type="text"
            autoFocus
            maxLength={40}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ex.: No-show, Recomandări, Reactivare"
            className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold text-ink placeholder:font-normal placeholder:text-ink-500 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100" />
          
        </div>
        <div>
          <label
            htmlFor="listDetail"
            className="text-xs font-bold uppercase tracking-wide text-ink-500">
            
            Detalii (opțional)
          </label>
          <input
            id="listDetail"
            type="text"
            value={detail}
            onChange={(event) => setDetail(event.target.value)}
            placeholder="Ce leaduri intră în această listă?"
            className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-ink placeholder:text-ink-500 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100" />
          
        </div>
      </div>

      <p className="mt-4 text-[11px] font-bold uppercase tracking-wide text-ink-500">
        Culoare
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

      <p className="mt-5 text-[11px] font-bold uppercase tracking-wide text-ink-500">
        Cine poate edita lista
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setAccess(allMembers.every((m) => access.includes(m)) ? [] : allMembers)}
          className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-colors duration-150 ease-out ${
          allMembers.every((member) => access.includes(member)) ?
          'border-brand-500 bg-brand-500 text-white' :
          'border-slate-200 bg-white text-ink-700 hover:border-brand-200 hover:text-brand-700'}`
          }>
          
          Toate sub-accounts · {allMembers.length}
        </button>
        {subAccounts.map((group) => {
          const all = group.members.every((member) => access.includes(member));
          return (
            <button
              key={group.role}
              type="button"
              onClick={() =>
              setAccess((current) =>
              all ?
              current.filter((member) => !group.members.includes(member)) :
              Array.from(new Set([...current, ...group.members]))
              )
              }
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition-colors duration-150 ease-out ${
              all ?
              'border-brand-500 bg-brand-50 text-brand-700' :
              'border-slate-200 bg-white text-ink-700 hover:border-brand-200 hover:text-brand-700'}`
              }>
              
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: group.color }}
                aria-hidden="true" />
              
              {group.role} · {group.members.length}
            </button>);

        })}
      </div>

      <div className="mt-2 max-h-64 w-72 max-w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
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
            const selected = access.includes(member);
            return (
              <button
                key={member}
                type="button"
                onClick={() => toggleAccess(member)}
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
      <p className="mt-1.5 text-[11px] text-ink-500">
        {access.length} sub-accounts vor vedea lista în Leads &amp; Clients.
        Poți modifica oricând.
      </p>

      <div className="mt-5 flex items-center gap-2">
        <button
          type="button"
          disabled={name.trim().length === 0}
          onClick={() => onCreate(name.trim(), detail.trim(), color, access)}
          className="rounded-lg bg-brand-500 px-3.5 py-2.5 font-display text-sm font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600 disabled:bg-slate-200 disabled:text-ink-500">
          
          Creează lista
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