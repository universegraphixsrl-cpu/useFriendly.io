import React, { useState } from 'react';
import { XIcon, MicIcon, VideoIcon, CheckIcon, PlusIcon } from 'lucide-react';
import {
  callerNames,
  leadOwners,
  UNASSIGNED,
  type Lead,
  type LeadList,
  type LeadStatus } from
'../../data/leads';
import { LeadDocuments } from './LeadDocuments';

interface LeadDetailProps {
  lead: Lead;
  lists: LeadList[];
  statuses: string[];
  onSave: (lead: Lead) => void;
  onClose: () => void;
  /** Fișă blocată: leadul aparține altui responsabil */
  readOnly?: boolean;
  /** null = admin; altfel numele sub-accountului */
  viewer?: string | null;
}

const labelClass = 'text-xs font-bold uppercase tracking-wide text-ink-500';
const fieldClass =
'mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold text-ink placeholder:font-normal placeholder:text-ink-500 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100';

export function LeadDetail({
  lead,
  lists,
  statuses,
  onSave,
  onClose,
  readOnly = false,
  viewer = null
}: LeadDetailProps) {
  const [draft, setDraft] = useState<Lead>(lead);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [autoInvoice, setAutoInvoice] = useState(true);
  const [newPayment, setNewPayment] = useState('');

  const patch = (changes: Partial<Lead>) =>
  setDraft((current) => ({ ...current, ...changes }));

  const dirty = !readOnly && JSON.stringify(draft) !== JSON.stringify(lead);
  // Un sub-account își poate atribui leadul doar sieși
  const ownerOptions =
  viewer === null ?
  leadOwners :
  Array.from(new Set([UNASSIGNED, viewer, lead.owner]));
  const needsAmount = draft.status === 'Semnat' && draft.paidAmount <= 0;

  return (
    <section
      aria-labelledby="lead-detail-title"
      className="mt-4 rounded-2xl border border-brand-200 bg-white p-5 sm:p-6">
      
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2
            id="lead-detail-title"
            className="font-display text-lg font-extrabold tracking-tight text-ink">
            
            Fișa clientului · {draft.firstName} {draft.lastName}
          </h2>
          <p className="text-xs text-ink-500">
            {readOnly ?
            `Leadul este atribuit lui ${lead.owner}. Doar el sau adminul îl pot modifica.` :
            'Modificările se aplică doar după ce apeși „Salvează”.'}{' '}
            Adăugat pe {lead.addedOn}.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-500 transition-colors duration-150 ease-out hover:bg-slate-50 hover:text-ink"
          aria-label="Închide fișa clientului fără să salvezi">
          
          <XIcon className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <fieldset disabled={readOnly} className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_1fr] disabled:opacity-70">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="detailOwner" className={labelClass}>
              Responsabil
            </label>
            <select
              id="detailOwner"
              value={draft.owner}
              onChange={(event) => patch({ owner: event.target.value })}
              className={fieldClass}>
              
              {ownerOptions.map((owner) =>
              <option key={owner} value={owner}>
                  {owner}
                </option>
              )}
            </select>
          </div>

          <div>
            <label htmlFor="detailCaller" className={labelClass}>
              Caller
            </label>
            <select
              id="detailCaller"
              value={draft.caller}
              onChange={(event) => patch({ caller: event.target.value })}
              className={fieldClass}>
              
              <option value="">Fără caller</option>
              {callerNames.map((caller) =>
              <option key={caller} value={caller}>
                  {caller}
                </option>
              )}
            </select>
          </div>

          <div>
            <label htmlFor="detailStatus" className={labelClass}>
              Status
            </label>
            <select
              id="detailStatus"
              value={draft.status}
              onChange={(event) =>
              patch({ status: event.target.value as LeadStatus })
              }
              className={fieldClass}>
              
              {statuses.map((status) =>
              <option key={status} value={status}>
                  {status}
                </option>
              )}
            </select>
          </div>

          <div>
            <label htmlFor="detailFirstName" className={labelClass}>
              Prenume
            </label>
            <input
              id="detailFirstName"
              type="text"
              value={draft.firstName}
              onChange={(event) => patch({ firstName: event.target.value })}
              className={fieldClass} />
            
          </div>

          <div>
            <label htmlFor="detailLastName" className={labelClass}>
              Nume
            </label>
            <input
              id="detailLastName"
              type="text"
              value={draft.lastName}
              onChange={(event) => patch({ lastName: event.target.value })}
              className={fieldClass} />
            
          </div>

          <div>
            <label htmlFor="detailPhone" className={labelClass}>
              Telefon
            </label>
            <input
              id="detailPhone"
              type="tel"
              value={draft.phone}
              onChange={(event) => patch({ phone: event.target.value })}
              className={fieldClass} />
            
          </div>

          <div>
            <label htmlFor="detailEmail" className={labelClass}>
              Email
            </label>
            <input
              id="detailEmail"
              type="email"
              value={draft.email}
              onChange={(event) => patch({ email: event.target.value })}
              className={fieldClass} />
            
          </div>

          <div>
            <label htmlFor="detailPaid" className={labelClass}>
              Suma plătită — total (€)
            </label>
            <input
              id="detailPaid"
              type="number"
              min={0}
              step={100}
              value={draft.paidAmount === 0 ? '' : draft.paidAmount}
              placeholder="0"
              onChange={(event) =>
              patch({ paidAmount: Number(event.target.value) || 0 })
              }
              className={fieldClass} />
            
            {needsAmount &&
            <p className="mt-1.5 text-[11px] font-bold text-amber-700">
                Completează suma încasată pentru a marca clientul ca „Semnat”.
              </p>
            }

            {draft.status === 'Semnat' &&
            <div className="mt-4">
                <label htmlFor="detailGenerated" className={labelClass}>
                  Suma generată — valoare contract (€)
                </label>
                <input
                id="detailGenerated"
                type="number"
                min={0}
                step={100}
                value={draft.generatedAmount === 0 ? '' : draft.generatedAmount}
                placeholder="0"
                onChange={(event) =>
                patch({ generatedAmount: Number(event.target.value) || 0 })
                }
                className={fieldClass} />
              
              </div>
            }

            {draft.payments.length > 0 &&
            <ul className="mt-2 space-y-1">
                {draft.payments.map((payment) =>
              <li
                key={payment.id}
                className="flex items-center justify-between gap-2 text-[11px] font-semibold text-ink-500">
                
                    <span>
                      + {payment.amount.toLocaleString('ro-RO')} € ·{' '}
                      {payment.addedOn}
                    </span>
                    <button
                  type="button"
                  onClick={() =>
                  patch({
                    paidAmount: Math.max(
                      0,
                      draft.paidAmount - payment.amount
                    ),
                    payments: draft.payments.filter(
                      (item) => item.id !== payment.id
                    )
                  })
                  }
                  className="text-ink-500 underline-offset-4 hover:text-red-600 hover:underline">
                  
                      Șterge
                    </button>
                  </li>
              )}
              </ul>
            }

            {paymentOpen ?
            <div className="mt-2 flex items-center gap-2">
                <input
                type="number"
                min={0}
                step={100}
                autoFocus
                value={newPayment}
                onChange={(event) => setNewPayment(event.target.value)}
                placeholder="Sumă nouă"
                aria-label="Sumă plată nouă"
                className="w-28 rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm font-semibold text-ink focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100" />
              
                <button
                type="button"
                disabled={(Number(newPayment) || 0) <= 0}
                onClick={() => {
                  const amount = Number(newPayment) || 0;
                  patch({
                    paidAmount: draft.paidAmount + amount,
                    payments: [
                    ...draft.payments,
                    {
                      id: `pay-${Date.now()}`,
                      amount,
                      addedOn: new Date().toLocaleDateString('ro-RO', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })
                    }]

                  });
                  setNewPayment('');
                  setPaymentOpen(false);
                }}
                className="rounded-lg bg-brand-500 px-2.5 py-1.5 text-xs font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600 disabled:bg-slate-200 disabled:text-ink-500">
                
                  Adaugă
                </button>
                <button
                type="button"
                onClick={() => {
                  setNewPayment('');
                  setPaymentOpen(false);
                }}
                className="text-xs font-semibold text-ink-500 hover:text-ink-700">
                
                  Anulează
                </button>
              </div> :

            <button
              type="button"
              onClick={() => setPaymentOpen(true)}
              className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-brand-600 underline-offset-4 hover:underline">
              
                <PlusIcon
                className="h-3.5 w-3.5"
                strokeWidth={2.5}
                aria-hidden="true" />
              
                Adaugă plată
              </button>
            }
          </div>

          <div>
            <label htmlFor="detailList" className={labelClass}>
              Listă
            </label>
            <select
              id="detailList"
              value={draft.listId}
              onChange={(event) => patch({ listId: event.target.value })}
              className={fieldClass}>
              
              {lists.map((list) =>
              <option key={list.id} value={list.id}>
                  {list.name}
                </option>
              )}
            </select>
          </div>

          {draft.status === 'Semnat' &&
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 sm:col-span-2">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                type="checkbox"
                checked={autoInvoice}
                onChange={(event) => setAutoInvoice(event.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500" />
              
                <span className="text-xs leading-relaxed text-emerald-900">
                  {autoInvoice ?
                'Se va emite factura automat pentru suma menționată. Asigură-te că suma și datele de facturare sunt corecte. Debifează căsuța dacă vrei să emiți factura manual.' :
                'Factura nu se emite automat. Va trebui să o emiți manual pentru acest client.'}
                </span>
              </label>
            </div>
          }

          <div>
            <label htmlFor="detailVocaroo" className={labelClass}>
              <span className="inline-flex items-center gap-1.5">
                <MicIcon className="h-3.5 w-3.5" aria-hidden="true" />
                Link Vocaroo
              </span>
            </label>
            <input
              id="detailVocaroo"
              type="url"
              value={draft.vocarooLink}
              placeholder="https://vocaroo.com/…"
              onChange={(event) => patch({ vocarooLink: event.target.value })}
              className={fieldClass} />
            
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="detailZoom" className={labelClass}>
              <span className="inline-flex items-center gap-1.5">
                <VideoIcon className="h-3.5 w-3.5" aria-hidden="true" />
                Link Zoom
              </span>
            </label>
            <input
              id="detailZoom"
              type="url"
              value={draft.zoomLink}
              placeholder="https://zoom.us/j/…"
              onChange={(event) => patch({ zoomLink: event.target.value })}
              className={fieldClass} />
            
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="detailNotes" className={labelClass}>
              Detalii
            </label>
            <textarea
              id="detailNotes"
              rows={3}
              value={draft.details}
              placeholder="Context, obiecții, buget, ce s-a discutat la apel…"
              onChange={(event) => patch({ details: event.target.value })}
              className={`${fieldClass} resize-y font-normal leading-relaxed`} />
            
          </div>
        </div>

        <LeadDocuments
          documents={draft.documents}
          onAdd={(document) =>
          patch({ documents: [...draft.documents, document] })
          }
          onRemove={(id) =>
          patch({
            documents: draft.documents.filter((doc) => doc.id !== id)
          })
          } />
        
      </fieldset>

      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
        {!readOnly &&
        <button
          type="button"
          disabled={!dirty || needsAmount}
          onClick={() => onSave(draft)}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-3.5 py-2.5 font-display text-sm font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600 disabled:bg-slate-200 disabled:text-ink-500">
          
          <CheckIcon className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
          Salvează
        </button>
        }
        <button
          type="button"
          onClick={onClose}
          className="text-sm font-semibold text-ink-500 underline-offset-4 hover:text-ink-700 hover:underline">
          
          {readOnly ? 'Închide' : 'Anulează'}
        </button>
        {dirty &&
        <span className="text-xs font-bold text-amber-700">
            Ai modificări nesalvate
          </span>
        }
      </div>
    </section>);

}