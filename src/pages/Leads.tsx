import React, { useState } from 'react';
import {
  PlusIcon,
  FolderPlusIcon,
  ChevronLeftIcon,
  ArrowRightIcon,
  UsersIcon,
  UserSearchIcon,
  ChevronDownIcon,
  ArchiveIcon,
  ArchiveRestoreIcon } from
'lucide-react';
import {
  leadStatuses,
  statusVisuals,
  leadDateIso,
  UNASSIGNED,
  type CustomLeadStatus,
  type Lead,
  type LeadStatus } from
'../data/leads';
import { ListForm } from '../components/leads/ListForm';
import { LeadForm } from '../components/leads/LeadForm';
import { LeadTable } from '../components/leads/LeadTable';
import { LeadDetail } from '../components/leads/LeadDetail';
import { ListAccess } from '../components/leads/ListAccess';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { Toast } from '../components/Toast';
import {
  DateFilter,
  matchesFilter,
  type LeadDateFilter } from
'../components/leads/DateFilter';

export function Leads() {
  const { activeUser, lists, setLists, leads, setLeads } = useWorkspace();
  const isSub = activeUser !== null;
  const [showIndexed, setShowIndexed] = useState(false);
  const [listFormOpen, setListFormOpen] = useState(false);
  const [leadFormOpen, setLeadFormOpen] = useState(false);
  const [openListId, setOpenListId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<LeadStatus | null>(null);
  const [openLeadId, setOpenLeadId] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<LeadDateFilter>({ kind: 'all' });
  const [ownerFilter, setOwnerFilter] = useState<string>('all');
  const [customStatuses, setCustomStatuses] = useState<CustomLeadStatus[]>([]);

  const allStatuses = [
  ...leadStatuses,
  ...customStatuses.map((status) => status.name)];


  const createStatus = (name: string, color: string) =>
  setCustomStatuses((current) =>
  current.some((status) => status.name === name) ?
  current :
  [...current, { name, color }]
  );
  const [toast, setToast] = useState<{
    message: string;
    variant: 'success' | 'warning';
  } | null>(null);

  /** Sub-accountul vede doar listele la care are acces și care nu sunt indexate */
  const visibleLists = isSub ?
  lists.filter(
    (list) => list.access.includes(activeUser) && !list.indexed
  ) :
  lists.filter((list) => Boolean(list.indexed) === showIndexed);
  const indexedCount = lists.filter((list) => list.indexed).length;

  const toggleIndexed = (listId: string) => {
    setLists((current) =>
    current.map((list) =>
    list.id === listId ? { ...list, indexed: !list.indexed } : list
    )
    );
    setOpenListId(null);
    showToast('Lista a fost mutată');
  };

  const openList = visibleLists.find((list) => list.id === openListId) ?? null;
  const openLead = leads.find((lead) => lead.id === openLeadId) ?? null;

  const createList = (
  name: string,
  detail: string,
  color: string,
  access: string[]) =>
  {
    setLists((current) => [
    ...current,
    { id: `list-${Date.now()}`, name, detail, color, access }]
    );
    setListFormOpen(false);
    showToast(
      access.length > 0 ?
      `Lista a fost creată · ${access.length} sub-accounts au acces` :
      'Lista a fost creată'
    );
  };

  const applyAccess = (listId: string, access: string[]) => {
    setLists((current) =>
    current.map((list) => list.id === listId ? { ...list, access } : list)
    );
    showToast('Accesul la listă a fost actualizat');
  };

  const createLead = (
  lead: Omit<Lead, 'id' | 'documents' | 'payments'>) =>
  {
    setLeads((current) => [
    ...current,
    {
      documents: [],
      paidAmount: 0,
      generatedAmount: 0,
      caller: '',
      payments: [],
      ...lead,
      id: `lead-${Date.now()}`
    }]
    );
    setLeadFormOpen(false);
  };

  const changeStatus = (id: string, status: LeadStatus) => {
    const lead = leads.find((item) => item.id === id);
    // Clientul nu poate fi marcat ca plătitor fără suma încasată
    if (status === 'Semnat' && lead && lead.paidAmount <= 0) {
      setOpenLeadId(id);
      showToast('Completează suma plătită înainte de statusul „Semnat”', 'warning');
      return;
    }
    setLeads((current) =>
    current.map((item) => item.id === id ? { ...item, status } : item)
    );
  };

  const showToast = (
  message = 'Acțiune modificată cu succes',
  variant: 'success' | 'warning' = 'success') =>
  {
    setToast({ message, variant });
    window.setTimeout(() => setToast(null), 2500);
  };

  const updateLead = (id: string, patch: Partial<Lead>) =>
  setLeads((current) =>
  current.map((lead) => lead.id === id ? { ...lead, ...patch } : lead)
  );

  const deleteLead = (id: string) =>
  setLeads((current) => current.filter((lead) => lead.id !== id));

  const actions =
  <div className="flex flex-wrap items-center gap-2">
      {!isSub &&
    <>
          <button
        type="button"
        onClick={() => {
          setShowIndexed((value) => !value);
          setOpenListId(null);
        }}
        aria-pressed={showIndexed}
        className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-2.5 text-sm font-semibold transition-colors duration-150 ease-out ${
        showIndexed ?
        'border-brand-300 bg-brand-50 text-brand-700' :
        'border-slate-200 bg-white text-ink-700 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700'}`
        }>
        
            <ArchiveIcon className="h-4 w-4" aria-hidden="true" />
            Liste indexate · {indexedCount}
          </button>
          <button
        type="button"
        onClick={() => {
          setListFormOpen(true);
          setLeadFormOpen(false);
        }}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-ink-700 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
        
            <FolderPlusIcon className="h-4 w-4" aria-hidden="true" />
            Creează listă nouă
          </button>
        </>
    }
      <button
      type="button"
      onClick={() => {
        setLeadFormOpen(true);
        setListFormOpen(false);
      }}
      className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-3.5 py-2.5 font-display text-sm font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600">
      
        <PlusIcon className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
        Adaugă lead
      </button>
    </div>;


  const forms =
  <>
      {listFormOpen &&
    <ListForm
      onCreate={createList}
      onCancel={() => setListFormOpen(false)} />

    }
      {leadFormOpen &&
    <LeadForm
      lists={visibleLists}
      defaultListId={openListId ?? lists[0]?.id ?? ''}
      statuses={allStatuses}
      onCreate={createLead}
      onCreateList={
      isSub ?
      undefined :
      () => {
        setLeadFormOpen(false);
        setListFormOpen(true);
      }
      }
      onCancel={() => setLeadFormOpen(false)}
      viewer={activeUser} />

    }
    </>;


  if (openList) {
    const allListLeads = leads.filter((lead) => lead.listId === openList.id);
    const owners = Array.from(
      new Set(allListLeads.map((lead) => lead.owner))
    ).sort((a, b) => a.localeCompare(b, 'ro'));
    const listLeads = allListLeads.
    filter((lead) => matchesFilter(leadDateIso(lead.addedOn), dateFilter)).
    filter((lead) => ownerFilter === 'all' || lead.owner === ownerFilter);
    const visibleLeads = statusFilter ?
    listLeads.filter((lead) => lead.status === statusFilter) :
    listLeads;
    return (
      <>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <button
              type="button"
              onClick={() => setOpenListId(null)}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 transition-colors duration-150 ease-out hover:text-brand-600">
              
              <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
              Toate listele
            </button>
            <h1 className="mt-2 flex items-center gap-2.5 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: openList.color }}
                aria-hidden="true" />
              
              {openList.name}
            </h1>
            <p className="mt-1 text-sm text-ink-700">
              {listLeads.length} leaduri · {openList.detail}
            </p>
            {!isSub &&
            <div className="mt-3">
                <ListAccess
                access={openList.access}
                onApply={(names) => applyAccess(openList.id, names)} />
              
              </div>
            }
          </div>
          {actions}
        </div>

        {forms}

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <DateFilter filter={dateFilter} onChange={setDateFilter} />
          <label htmlFor="ownerFilter" className="sr-only">
            Filtrează după responsabil
          </label>
          <div className="relative">
            <UserSearchIcon
              className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500"
              aria-hidden="true" />
            
            <select
              id="ownerFilter"
              value={ownerFilter}
              onChange={(event) => setOwnerFilter(event.target.value)}
              className={`appearance-none rounded-full border py-1.5 pl-8 pr-7 text-xs font-bold transition-colors duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-brand-100 ${
              ownerFilter === 'all' ?
              'border-slate-200 bg-white text-ink-700' :
              'border-brand-300 bg-brand-50 text-brand-700'}`
              }>
              
              <option value="all">Toți responsabilii</option>
              {owners.map((owner) =>
              <option key={owner} value={owner}>
                  {owner} ·{' '}
                  {allListLeads.filter((lead) => lead.owner === owner).length}
                </option>
              )}
            </select>
            <ChevronDownIcon
              className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-500"
              aria-hidden="true" />
            
          </div>
          <span className="h-5 w-px bg-slate-200" aria-hidden="true" />
          <button
            type="button"
            onClick={() => setStatusFilter(null)}
            aria-pressed={statusFilter === null}
            className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-colors duration-150 ease-out ${
            statusFilter === null ?
            'border-ink bg-ink text-white' :
            'border-slate-200 bg-white text-ink-700 hover:bg-slate-50'}`
            }>
            
            Toate · {listLeads.length}
          </button>
          {allStatuses.map((status) => {
            const total = listLeads.filter(
              (lead) => lead.status === status
            ).length;
            const selected = statusFilter === status;
            const visuals = statusVisuals(status, customStatuses);
            return (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(selected ? null : status)}
                aria-pressed={selected}
                style={visuals.badgeStyle}
                className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-colors duration-150 ease-out hover:brightness-95 ${visuals.badgeClass} ${
                selected ? 'ring-2 ring-ink ring-offset-1' : ''}`
                }>
                
                {status} · {total}
              </button>);

          })}
        </div>

        {openLead &&
        <LeadDetail
          key={openLead.id}
          lead={openLead}
          lists={visibleLists}
          statuses={allStatuses}
          onSave={(updated) => {
            updateLead(updated.id, updated);
            setOpenLeadId(null);
            showToast();
          }}
          onClose={() => setOpenLeadId(null)}
          viewer={activeUser}
          readOnly={
          activeUser !== null &&
          openLead.owner !== UNASSIGNED &&
          openLead.owner !== activeUser
          } />

        }

        <div className="mt-4">
          {visibleLeads.length > 0 ?
          <LeadTable
            leads={visibleLeads}
            statuses={allStatuses}
            customStatuses={customStatuses}
            onStatusChange={changeStatus}
            onOwnerChange={(id, owner) => updateLead(id, { owner })}
            onCallerChange={(id, caller) => updateLead(id, { caller })}
            onCreateStatus={createStatus}
            onDelete={deleteLead}
            viewer={activeUser}
            onOpen={(id) =>
            setOpenLeadId((current) => current === id ? null : id)
            } /> :


          <p className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-10 text-center text-sm text-ink-500">
              {statusFilter ?
            `Niciun lead cu statusul „${statusFilter}” în această listă.` :
            'Niciun lead în această listă.'}
            </p>
          }
        </div>

        {toast && <Toast message={toast.message} variant={toast.variant} />}
      </>);

  }

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Leads &amp; Clients
          </h1>
          <p className="mt-1 text-sm text-ink-700">
            {isSub ?
            `Ai acces la ${visibleLists.length} liste partajate de admin.` :
            showIndexed ?
            `${indexedCount} liste indexate, ascunse din grila principală.` :
            `${leads.length} leaduri în ${visibleLists.length} liste. Deschide o listă ca să vezi responsabilul, statusul și data adăugării.`}
          </p>
          {showIndexed &&
          <button
            type="button"
            onClick={() => {
              setShowIndexed(false);
              setOpenListId(null);
            }}
            className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 transition-colors duration-150 ease-out hover:text-brand-600">
            
              <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
              Înapoi la toate listele
            </button>
          }
        </div>
        {actions}
      </div>

      {forms}

      <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {visibleLists.map((list) => {
          const listLeads = leads.filter((lead) => lead.listId === list.id);
          const signed = listLeads.filter(
            (lead) => lead.status === 'Semnat' || lead.status === 'A zis da'
          ).length;
          return (
            <li key={list.id} className="flex">
              <div
                role="button"
                tabIndex={0}
                onClick={() => {
                  setOpenListId(list.id);
                  setStatusFilter(null);
                  setOwnerFilter('all');
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setOpenListId(list.id);
                    setStatusFilter(null);
                  }
                }}
                className="flex w-full cursor-pointer flex-col rounded-2xl border border-t-4 border-slate-200 bg-white p-5 text-left transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50"
                style={{ borderTopColor: list.color }}>
                
                <span className="flex items-center gap-2 font-display text-base font-extrabold tracking-tight text-ink">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: list.color }}
                    aria-hidden="true" />
                  
                  {list.name}
                </span>
                <span className="mt-1.5 text-xs leading-relaxed text-ink-500">
                  {list.detail || 'Fără detalii'}
                </span>
                <span className="mt-4 flex items-center gap-1.5 text-xs font-bold text-ink-500">
                  <UsersIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  {listLeads.length} leaduri · {signed} pozitive
                </span>
                {!isSub &&
                <span className="mt-3 flex flex-wrap items-center gap-2">
                    <ListAccess
                    access={list.access}
                    onApply={(names) => applyAccess(list.id, names)} />
                  
                    <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleIndexed(list.id);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-ink-700 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
                    
                      {list.indexed ?
                    <>
                          <ArchiveRestoreIcon
                        className="h-3.5 w-3.5"
                        aria-hidden="true" />
                      
                          Scoate din index
                        </> :

                    <>
                          <ArchiveIcon
                        className="h-3.5 w-3.5"
                        aria-hidden="true" />
                      
                          Indexează
                        </>
                    }
                    </button>
                  </span>
                }
                <span className="mt-auto flex items-center gap-1.5 pt-4 text-sm font-bold text-brand-600">
                  Deschide lista
                  <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
                </span>
              </div>
            </li>);

        })}
      </ul>

      {visibleLists.length === 0 &&
      <p className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-10 text-center text-sm text-ink-500">
          {showIndexed ?
        'Nicio listă indexată deocamdată.' :
        isSub ?
        'Nu ai încă acces la nicio listă.' :
        'Nicio listă activă.'}
        </p>
      }

      {toast && <Toast message={toast.message} variant={toast.variant} />}
    </>);

}