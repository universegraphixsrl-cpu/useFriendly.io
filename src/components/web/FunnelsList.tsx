import React, { useState } from 'react';
import {
  PlusIcon,
  SearchIcon,
  CheckIcon,
  XIcon } from
'lucide-react';
import { formatFunnelDate, type Funnel } from '../../data/funnels';
import { StepRowMenu } from './StepRowMenu';
import { FunnelCreateDialog } from './FunnelCreateDialog';
import { FunnelShareDialog } from './FunnelShareDialog';
import { FunnelDeleteDialog } from './FunnelDeleteDialog';
import { Toast } from '../Toast';

interface FunnelsListProps {
  funnels: Funnel[];
  onOpen: (funnel: Funnel) => void;
  onCreate: (name: string, domain: string) => void;
  onDuplicate: (funnel: Funnel) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  /** Salvează setările unui funnel existent */
  onUpdate: (id: string, name: string, domain: string) => void;
}

type StatusFilter = 'toate' | 'active' | 'inactive';

const statusLabels: Record<StatusFilter, string> = {
  toate: 'Toate',
  active: 'Active',
  inactive: 'Inactive'
};

/** Lista de sales funnels: căutare, filtru de status, dată de creare și acțiuni */
export function FunnelsList({
  funnels,
  onOpen,
  onCreate,
  onDuplicate,
  onDelete,
  onToggle,
  onUpdate
}: FunnelsListProps) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<StatusFilter>('toate');
  const [creating, setCreating] = useState(false);
  const [settingsFor, setSettingsFor] = useState<Funnel | null>(null);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [sharing, setSharing] = useState<Funnel | null>(null);
  const [deleting, setDeleting] = useState<Funnel | null>(null);
  const [help, setHelp] = useState(false);


  const visible = funnels.filter((funnel) => {
    const matchesSearch = funnel.name.
    toLowerCase().
    includes(search.trim().toLowerCase());
    const matchesStatus =
    status === 'toate' || (
    status === 'active' ? funnel.active : !funnel.active);
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex items-center gap-2.5">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink">
            {visible.length} funnels
          </h2>
          <button
            type="button"
            onClick={() => setHelp((current) => !current)}
            aria-expanded={help}
            aria-label="Ce este un funnel?"
            className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold transition-colors duration-150 ease-out ${
            help ?
            'bg-brand-500 text-white' :
            'bg-slate-200 text-white hover:bg-slate-300'}`
            }>
            
            ?
          </button>
          {help &&
          <button
            type="button"
            tabIndex={-1}
            aria-label="Închide explicația"
            onClick={() => setHelp(false)}
            className="fixed inset-0 z-30 cursor-default" />

          }
          {help &&
          <div
            role="dialog"
            aria-label="Ce este un funnel?"
            className="menu-surface absolute left-0 top-full z-40 mt-2 w-80 rounded-lg border border-slate-200 bg-white p-5 text-center shadow-xl">
            
              <p className="text-sm leading-relaxed text-ink-700">
                Un funnel este o succesiune de pași prin care trece un potențial
                client. În fiecare funnel poți crea mai multe pagini cu roluri
                diferite — captare, prezentare, checkout, mulțumire — legate
                într-un parcurs complet.
              </p>
            </div>
          }
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <SearchIcon
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
              aria-hidden="true" />
            
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Caută funnel…"
              aria-label="Caută funnel"
              className="w-56 rounded-md border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-[15px] text-ink outline-none placeholder:text-ink-400 focus:border-brand-400" />
            
          </div>
          <div className="flex rounded-md border border-slate-200 bg-white p-0.5">
            {(Object.keys(statusLabels) as StatusFilter[]).map((option) =>
            <button
              key={option}
              type="button"
              onClick={() => setStatus(option)}
              className={`rounded px-3 py-2 text-sm font-bold transition-colors duration-150 ease-out ${
              status === option ?
              'bg-brand-50 text-brand-700' :
              'text-ink-700 hover:bg-slate-50'}`
              }>
              
                {statusLabels[option]}
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-2 rounded-md bg-brand-500 px-4 py-2.5 font-display text-[15px] font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600">
            
            <PlusIcon className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
            Adaugă funnel
          </button>
        </div>
      </div>

      {creating &&
      <FunnelCreateDialog
        onClose={() => setCreating(false)}
        onCreate={(name, domain) => {
          onCreate(name, domain);
          setCreating(false);
        }} />

      }

      {settingsFor &&
      <FunnelCreateDialog
        title="Setări funnel"
        submitLabel="Salvează setările"
        initialName={settingsFor.name}
        initialDomain={settingsFor.domain}
        onClose={() => setSettingsFor(null)}
        onCreate={(name, domain) => {
          onUpdate(settingsFor.id, name, domain);
          setSettingsFor(null);
          setSettingsSaved(true);
          window.setTimeout(() => setSettingsSaved(false), 2500);
        }} />

      }

      {sharing &&
      <FunnelShareDialog
        funnelName={sharing.name}
        shareUrl={`https://friendly.ro/dashboard/share?funnel=${sharing.id}&hash=4712814fc3597a25d35c3e0f5d0e7c89`}
        onClose={() => setSharing(null)} />

      }

      {settingsSaved && <Toast message="Modificare salvată cu succes" />}

      {deleting &&
      <FunnelDeleteDialog
        funnelName={deleting.name}
        pageCount={deleting.steps.length}
        onKeep={() => setDeleting(null)}
        onDelete={() => {
          onDelete(deleting.id);
          setDeleting(null);
        }} />

      }

      <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 text-sm font-bold uppercase tracking-wide text-ink-500">
              <th scope="col" className="px-6 py-4 font-bold">
                Denumire
              </th>
              <th scope="col" className="w-32 px-6 py-4 font-bold">
                Status
              </th>
              <th scope="col" className="w-60 px-6 py-4 font-bold">
                Creat
              </th>
              <th scope="col" className="w-16 px-6 py-4">
                <span className="sr-only">Acțiuni</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visible.map((funnel) =>
            <tr
              key={funnel.id}
              className="transition-colors duration-150 ease-out hover:bg-slate-50">
              
                <td className="px-6 py-5">
                  <button
                  type="button"
                  onClick={() => onOpen(funnel)}
                  className="font-display text-base font-bold text-brand-600 underline-offset-4 hover:underline">
                  
                    {funnel.name}
                  </button>
                  <p className="text-sm text-ink-500">
                    {funnel.domain} · {funnel.steps.length} pași
                  </p>
                </td>
                <td className="px-6 py-5">
                  <button
                  type="button"
                  onClick={() => onToggle(funnel.id)}
                  aria-label={
                  funnel.active ?
                  `Dezactivează ${funnel.name}` :
                  `Activează ${funnel.name}`
                  }
                  className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors duration-150 ease-out ${
                  funnel.active ?
                  'bg-emerald-500 text-white hover:bg-emerald-600' :
                  'bg-slate-200 text-ink-500 hover:bg-slate-300'}`
                  }>
                  
                    {funnel.active ?
                  <CheckIcon
                    className="h-3.5 w-3.5"
                    strokeWidth={3}
                    aria-hidden="true" /> :


                  <XIcon
                    className="h-3.5 w-3.5"
                    strokeWidth={3}
                    aria-hidden="true" />

                  }
                  </button>
                </td>
                <td className="px-6 py-5 text-base text-ink-700">
                  {formatFunnelDate(funnel.createdAt)}
                </td>
                <td className="relative px-6 py-5">
                  <StepRowMenu
                  stepName={funnel.name}
                  deleteLabel="Șterge funnelul"
                  onEdit={() => onOpen(funnel)}
                  onDuplicate={() => onDuplicate(funnel)}
                  onSettings={() => setSettingsFor(funnel)}
                  onShare={() => setSharing(funnel)}
                  onToggleActive={() => onToggle(funnel.id)}
                  toggleLabel={
                  funnel.active ? 'Dezactivează' : 'Activează'
                  }
                  onDelete={() => setDeleting(funnel)} />
                
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {visible.length === 0 &&
        <p className="px-5 py-12 text-center text-sm text-ink-500">
            Niciun funnel pentru filtrele selectate.
          </p>
        }
      </div>
    </>);

}