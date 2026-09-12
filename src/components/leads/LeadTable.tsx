import React from 'react';
import { MicIcon, VideoIcon, Trash2Icon, FileTextIcon } from 'lucide-react';
import {
  statusVisuals,
  UNASSIGNED,
  type CustomLeadStatus,
  type Lead,
  type LeadStatus } from
'../../data/leads';
import { LeadStatusSelect } from './LeadStatusSelect';
import { LeadOwnerSelect } from './LeadOwnerSelect';
import { LeadCallerSelect } from './LeadCallerSelect';

/** Primele 10 caractere din numele fișierului, fără extensie */
function shortName(fileName: string) {
  const base = fileName.replace(/\.pdf$/i, '');
  return base.length > 10 ? `${base.slice(0, 10)}…` : base;
}

interface LeadTableProps {
  leads: Lead[];
  statuses: string[];
  customStatuses: CustomLeadStatus[];
  onStatusChange: (id: string, status: LeadStatus) => void;
  onOwnerChange: (id: string, owner: string) => void;
  onCallerChange: (id: string, caller: string) => void;
  onCreateStatus: (name: string, color: string) => void;
  onDelete: (id: string) => void;
  onOpen: (id: string) => void;
  /** null = admin; altfel numele sub-accountului care privește lista */
  viewer: string | null;
}

export function LeadTable({
  leads,
  statuses,
  customStatuses,
  onStatusChange,
  onOwnerChange,
  onCallerChange,
  onCreateStatus,
  onDelete,
  onOpen,
  viewer
}: LeadTableProps) {
  /** Adminul poate mereu; un agent doar dacă leadul e neatribuit sau al lui */
  const canEdit = (lead: Lead) =>
  viewer === null || lead.owner === UNASSIGNED || lead.owner === viewer;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <table className="w-full table-fixed border-collapse text-left">
        <thead>
          <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wide text-ink-500">
            <th scope="col" className="w-[19%] px-4 py-3 font-bold">
              Contact
            </th>
            <th scope="col" className="w-[14%] px-3 py-3 font-bold">
              Responsabil
            </th>
            <th scope="col" className="w-[12%] px-3 py-3 font-bold">
              Caller
            </th>
            <th scope="col" className="w-[14%] px-3 py-3 font-bold">
              Status
            </th>
            <th scope="col" className="w-[8%] px-3 py-3 font-bold">
              Adăugat
            </th>
            <th scope="col" className="w-[9%] px-3 py-3 font-bold">
              Sumă plătită
            </th>
            <th scope="col" className="w-[10%] px-3 py-3 font-bold">
              Documente
            </th>
            <th scope="col" className="w-[14%] px-4 py-3 text-right font-bold">
              Înregistrări
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {leads.map((lead) => {
            const visuals = statusVisuals(lead.status, customStatuses);
            return (
              <tr
                key={lead.id}
                className={visuals.rowClass}
                style={visuals.rowStyle}>
                
              <td className="px-4 py-3.5">
                <button
                    type="button"
                    onClick={() => onOpen(lead.id)}
                    className="block w-full min-w-0 text-left">
                    
                  <span className="block truncate font-display text-sm font-bold text-ink underline-offset-4 hover:text-brand-600 hover:underline">
                    {lead.firstName} {lead.lastName}
                  </span>
                  <span className="block truncate text-xs text-ink-500">
                    {lead.phone}
                  </span>
                  <span className="block truncate text-xs text-ink-500">
                    {lead.email}
                  </span>
                </button>
              </td>
              <td className="px-3 py-3.5">
                <LeadOwnerSelect
                    owner={lead.owner}
                    status={lead.status}
                    customStatuses={customStatuses}
                    viewer={viewer}
                    locked={!canEdit(lead)}
                    onChange={(owner) => onOwnerChange(lead.id, owner)} />
                  
              </td>
              <td className="px-3 py-3.5">
                <LeadCallerSelect
                    caller={lead.caller}
                    status={lead.status}
                    customStatuses={customStatuses}
                    viewer={viewer}
                    onChange={(caller) => onCallerChange(lead.id, caller)} />
                  
              </td>
              <td className="px-3 py-3.5">
                {canEdit(lead) ?
                  <LeadStatusSelect
                    status={lead.status}
                    statuses={statuses}
                    customStatuses={customStatuses}
                    onChange={(status) => onStatusChange(lead.id, status)}
                    onCreateStatus={onCreateStatus} /> :


                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold ${visuals.badgeClass}`}
                    style={visuals.badgeStyle}>
                    
                    {lead.status}
                  </span>
                  }
              </td>
              <td className="px-3 py-3.5 text-sm text-ink-700">
                {lead.addedOn}
              </td>
              <td className="px-3 py-3.5">
                {lead.paidAmount > 0 &&
                  <>
                    <span className="block font-display text-sm font-bold text-emerald-700">
                      {lead.paidAmount.toLocaleString('ro-RO')} €
                    </span>
                    {lead.payments.length > 0 &&
                    <span className="block text-[11px] font-semibold text-ink-500">
                        {lead.payments.length + 1} plăți
                      </span>
                    }
                  </>
                  }
              </td>
              <td className="px-3 py-3.5">
                {lead.documents.length > 0 ?
                  <ul className="space-y-0.5">
                    {lead.documents.map((document) =>
                    <li key={document.id}>
                        <button
                        type="button"
                        onClick={() => onOpen(lead.id)}
                        title={document.fileName}
                        className="flex w-full items-center gap-1.5 text-xs font-semibold text-ink-700 transition-colors duration-150 ease-out hover:text-brand-600">
                        
                          <FileTextIcon
                          className="h-3.5 w-3.5 shrink-0 text-ink-500"
                          aria-hidden="true" />
                        
                          <span className="truncate">
                            {shortName(document.fileName)}
                          </span>
                        </button>
                      </li>
                    )}
                  </ul> :

                  <button
                    type="button"
                    onClick={() => onOpen(lead.id)}
                    className="text-left text-xs font-semibold text-ink-500 underline-offset-4 hover:text-brand-600 hover:underline">
                    
                    Niciun document atașat
                  </button>
                  }
              </td>
              <td className="px-4 py-3.5">
                <div className="flex flex-wrap items-center justify-end gap-1.5">
                  {lead.vocarooLink &&
                    <a
                      href={lead.vocarooLink}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[11px] font-bold text-ink-700 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
                      
                      <MicIcon className="h-3.5 w-3.5" aria-hidden="true" />
                      Vocaroo
                    </a>
                    }
                  {lead.zoomLink &&
                    <a
                      href={lead.zoomLink}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[11px] font-bold text-ink-700 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
                      
                      <VideoIcon className="h-3.5 w-3.5" aria-hidden="true" />
                      Zoom
                    </a>
                    }
                  {canEdit(lead) &&
                    <button
                      type="button"
                      onClick={() => onDelete(lead.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-500 transition-colors duration-150 ease-out hover:bg-red-50 hover:text-red-600"
                      aria-label={`Șterge leadul ${lead.firstName} ${lead.lastName}`}>
                      
                      <Trash2Icon className="h-4 w-4" aria-hidden="true" />
                    </button>
                    }
                </div>
              </td>
            </tr>);

          })}
        </tbody>
      </table>
    </div>);

}