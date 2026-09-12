import React, { useState } from 'react';
import { XIcon, MicIcon, VideoIcon, SparklesIcon } from 'lucide-react';
import {
  callerNames,
  leadOwners,
  UNASSIGNED,
  type Lead,
  type LeadList,
  type LeadStatus } from
'../../data/leads';

interface LeadFormProps {
  lists: LeadList[];
  defaultListId: string;
  statuses: string[];
  onCreate: (lead: Omit<Lead, 'id' | 'documents' | 'payments'>) => void;
  /** Lipsește pentru sub-accounts, care nu pot crea liste */
  onCreateList?: () => void;
  onCancel: () => void;
  /** null = admin; altfel numele sub-accountului */
  viewer?: string | null;
}

export function LeadForm({
  lists,
  defaultListId,
  statuses,
  onCreate,
  onCreateList,
  onCancel,
  viewer = null
}: LeadFormProps) {
  // Un sub-account poate atribui leadul doar sieși
  const ownerOptions = viewer === null ? leadOwners : [UNASSIGNED, viewer];
  const [owner, setOwner] = useState(ownerOptions[0]);
  const [caller, setCaller] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [details, setDetails] = useState('');
  const [vocarooLink, setVocarooLink] = useState('');
  const [zoomLink, setZoomLink] = useState('');
  const [listId, setListId] = useState(defaultListId);
  const [status, setStatus] = useState<LeadStatus>('Nu a răspuns');

  const [paidAmount, setPaidAmount] = useState('');

  const amount = Number(paidAmount) || 0;
  const needsAmount = status === 'Semnat' && amount <= 0;

  const inputClass =
  'mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold text-ink placeholder:font-normal placeholder:text-ink-500 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100';
  const labelClass =
  'text-xs font-bold uppercase tracking-wide text-ink-500';

  return (
    <section
      aria-labelledby="new-lead-title"
      className="mt-6 rounded-2xl border border-brand-200 bg-white p-5 sm:p-6">
      
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2
            id="new-lead-title"
            className="font-display text-base font-extrabold tracking-tight text-ink">
            
            Fișa clientului
          </h2>
          <p className="text-xs text-ink-500">
            Responsabilul primește leadul imediat după salvare.
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

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div>
          <label htmlFor="leadOwner" className={labelClass}>
            Responsabil *
          </label>
          <select
            id="leadOwner"
            value={owner}
            onChange={(event) => setOwner(event.target.value)}
            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-ink focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100">
            
            {ownerOptions.map((option) =>
            <option key={option} value={option}>
                {option}
              </option>
            )}
          </select>
        </div>

        <div>
          <label htmlFor="leadCaller" className={labelClass}>
            Caller
          </label>
          <select
            id="leadCaller"
            value={caller}
            onChange={(event) => setCaller(event.target.value)}
            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-ink focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100">
            
            <option value="">Fără caller</option>
            {callerNames.map((option) =>
            <option key={option} value={option}>
                {option}
              </option>
            )}
          </select>
        </div>

        <div>
          <label htmlFor="leadFirstName" className={labelClass}>
            Prenume *
          </label>
          <input
            id="leadFirstName"
            type="text"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            placeholder="Ex.: Andrei"
            className={inputClass} />
          
        </div>

        <div>
          <label htmlFor="leadLastName" className={labelClass}>
            Nume *
          </label>
          <input
            id="leadLastName"
            type="text"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            placeholder="Ex.: Popescu"
            className={inputClass} />
          
        </div>

        <div>
          <label htmlFor="leadPhone" className={labelClass}>
            Telefon
          </label>
          <input
            id="leadPhone"
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="+40 7.. ... ..."
            className={inputClass} />
          
        </div>

        <div>
          <label htmlFor="leadEmail" className={labelClass}>
            Email
          </label>
          <input
            id="leadEmail"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="nume@email.com"
            className={inputClass} />
          
        </div>

        <div>
          <label htmlFor="leadStatus" className={labelClass}>
            Status
          </label>
          <select
            id="leadStatus"
            value={status}
            onChange={(event) => setStatus(event.target.value as LeadStatus)}
            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-ink focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100">
            
            {statuses.map((option) =>
            <option key={option} value={option}>
                {option}
              </option>
            )}
          </select>
        </div>

        <div>
          <label htmlFor="leadPaid" className={labelClass}>
            Suma plătită (€)
          </label>
          <input
            id="leadPaid"
            type="number"
            min={0}
            step={100}
            value={paidAmount}
            onChange={(event) => setPaidAmount(event.target.value)}
            placeholder="0"
            className={inputClass} />
          
          {needsAmount &&
          <p className="mt-1.5 text-[11px] font-bold text-amber-700">
              Statusul „Semnat” cere suma încasată.
            </p>
          }
        </div>

        <div>
          <label htmlFor="leadList" className={labelClass}>
            Listă
          </label>
          <select
            id="leadList"
            value={listId}
            onChange={(event) => setListId(event.target.value)}
            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-ink focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100">
            
            {lists.map((list) =>
            <option key={list.id} value={list.id}>
                {list.name}
              </option>
            )}
          </select>
          {onCreateList &&
          <button
            type="button"
            onClick={onCreateList}
            className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 underline-offset-4 hover:underline">
            
              <SparklesIcon className="h-3.5 w-3.5" aria-hidden="true" />
              Creează o listă nouă
            </button>
          }
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="leadDetails" className={labelClass}>
          Detalii
        </label>
        <textarea
          id="leadDetails"
          rows={3}
          value={details}
          onChange={(event) => setDetails(event.target.value)}
          placeholder="Context, buget, obiecții, ce s-a discutat la apel…"
          className="mt-1.5 w-full resize-y rounded-lg border border-slate-200 px-3 py-2.5 text-sm leading-relaxed text-ink placeholder:text-ink-500 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100" />
        
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="leadVocaroo"
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-ink-500">
            
            <MicIcon className="h-3.5 w-3.5" aria-hidden="true" />
            Link Vocaroo
          </label>
          <input
            id="leadVocaroo"
            type="url"
            value={vocarooLink}
            onChange={(event) => setVocarooLink(event.target.value)}
            placeholder="https://vocaroo.com/..."
            className={inputClass} />
          
        </div>
        <div>
          <label
            htmlFor="leadZoom"
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-ink-500">
            
            <VideoIcon className="h-3.5 w-3.5" aria-hidden="true" />
            Link Zoom
          </label>
          <input
            id="leadZoom"
            type="url"
            value={zoomLink}
            onChange={(event) => setZoomLink(event.target.value)}
            placeholder="https://zoom.us/j/..."
            className={inputClass} />
          
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2">
        <button
          type="button"
          disabled={
          firstName.trim().length === 0 ||
          lastName.trim().length === 0 ||
          needsAmount
          }
          onClick={() =>
          onCreate({
            listId,
            owner,
            caller,
            generatedAmount: 0,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            phone: phone.trim(),
            email: email.trim(),
            details: details.trim(),
            vocarooLink: vocarooLink.trim(),
            zoomLink: zoomLink.trim(),
            paidAmount: amount,
            status,
            addedOn: new Date().toLocaleDateString('ro-RO', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })
          })
          }
          className="rounded-lg bg-brand-500 px-3.5 py-2.5 font-display text-sm font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600 disabled:bg-slate-200 disabled:text-ink-500">
          
          Salvează leadul
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