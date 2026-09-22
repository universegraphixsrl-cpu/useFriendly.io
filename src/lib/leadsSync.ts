import { useEffect, useRef, useState } from 'react';
import { supabase, supabaseConfigured } from './supabase';
import type { Lead, LeadList, LeadDocument, LeadPayment } from '../data/leads';

/**
 * Legătura dintre starea aplicației și baza de date.
 *
 * Ideea: restul aplicației (cele 154 de fișiere) continuă să folosească
 * `leads` și `setLeads` din WorkspaceContext exact ca până acum. Hook-ul de
 * aici stă deasupra și face două lucruri:
 *
 *   1. la pornire încarcă listele și leadurile reale din Supabase;
 *   2. la fiecare modificare compară starea nouă cu ce e salvat și trimite
 *      spre bază doar ce s-a schimbat (adăugat / modificat / șters).
 *
 * Așa nu trebuie rescrisă nicio pagină existentă.
 */

type SyncStatus = 'idle' | 'loading' | 'ready' | 'error';

/** Rândul din tabelul `leads`, exact cum arată coloanele în Postgres */
interface LeadRow {
  id: string;
  list_id: string;
  owner: string;
  caller: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  details: string;
  vocaroo_link: string;
  zoom_link: string;
  status: string;
  added_on: string;
  paid_amount: number;
  generated_amount: number;
}

interface ListRow {
  id: string;
  name: string;
  detail: string;
  color: string;
  access: string[];
  indexed: boolean;
  position: number;
}

function toLeadRow(lead: Lead): LeadRow {
  return {
    id: lead.id,
    list_id: lead.listId,
    owner: lead.owner,
    caller: lead.caller,
    first_name: lead.firstName,
    last_name: lead.lastName,
    phone: lead.phone,
    email: lead.email,
    details: lead.details,
    vocaroo_link: lead.vocarooLink,
    zoom_link: lead.zoomLink,
    status: lead.status,
    added_on: lead.addedOn,
    paid_amount: Number(lead.paidAmount) || 0,
    generated_amount: Number(lead.generatedAmount) || 0
  };
}

function toListRow(list: LeadList, position: number): ListRow {
  return {
    id: list.id,
    name: list.name,
    detail: list.detail,
    color: list.color,
    access: list.access ?? [],
    indexed: Boolean(list.indexed),
    position
  };
}

/** Cheie de comparație: dacă textul diferă, rândul s-a schimbat. */
const fingerprint = (value: unknown) => JSON.stringify(value);

export function useLeadsSync(options: {
  enabled: boolean;
  lists: LeadList[];
  leads: Lead[];
  setLists: React.Dispatch<React.SetStateAction<LeadList[]>>;
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
}) {
  const { enabled, lists, leads, setLists, setLeads } = options;
  const [status, setStatus] = useState<SyncStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  /** Ce e deja salvat în bază, ca să știm ce s-a schimbat */
  const savedLeads = useRef(new Map<string, string>());
  const savedLists = useRef(new Map<string, string>());
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ---------- 1. Încărcarea inițială ----------
  useEffect(() => {
    if (!enabled || !supabaseConfigured) return;

    let active = true;
    setStatus('loading');

    (async () => {
      const [listsResult, leadsResult, paymentsResult, documentsResult] =
      await Promise.all([
      supabase.
      from('lead_lists').
      select('id, name, detail, color, access, indexed, position').
      order('position', { ascending: true }),
      supabase.
      from('leads').
      select('*').
      order('created_at', { ascending: false }),
      supabase.from('lead_payments').select('*'),
      supabase.from('lead_documents').select('*')]
      );

      if (!active) return;

      const failure =
      listsResult.error ??
      leadsResult.error ??
      paymentsResult.error ??
      documentsResult.error;

      if (failure) {
        console.error('[Supabase] Încărcarea leadurilor a eșuat:', failure.message);
        setError(failure.message);
        setStatus('error');
        return;
      }

      const paymentsByLead = new Map<string, LeadPayment[]>();
      (paymentsResult.data ?? []).forEach((row: any) => {
        const bucket = paymentsByLead.get(row.lead_id) ?? [];
        bucket.push({
          id: row.id,
          amount: Number(row.amount) || 0,
          addedOn: row.added_on ?? ''
        });
        paymentsByLead.set(row.lead_id, bucket);
      });

      const documentsByLead = new Map<string, LeadDocument[]>();
      (documentsResult.data ?? []).forEach((row: any) => {
        const bucket = documentsByLead.get(row.lead_id) ?? [];
        bucket.push({
          id: row.id,
          fileName: row.file_name,
          type: row.type,
          addedOn: row.added_on ?? '',
          url: row.url ?? undefined
        });
        documentsByLead.set(row.lead_id, bucket);
      });

      const nextLists: LeadList[] = (listsResult.data ?? []).map((row: any) => ({
        id: row.id,
        name: row.name,
        detail: row.detail ?? '',
        color: row.color ?? '#2f6bff',
        access: row.access ?? [],
        indexed: Boolean(row.indexed)
      }));

      const nextLeads: Lead[] = (leadsResult.data ?? []).map((row: any) => ({
        id: row.id,
        listId: row.list_id,
        owner: row.owner ?? 'Neatribuit',
        caller: row.caller ?? '',
        firstName: row.first_name ?? '',
        lastName: row.last_name ?? '',
        phone: row.phone ?? '',
        email: row.email ?? '',
        details: row.details ?? '',
        vocarooLink: row.vocaroo_link ?? '',
        zoomLink: row.zoom_link ?? '',
        status: row.status ?? 'Înscris webinar',
        addedOn: row.added_on ?? '',
        paidAmount: Number(row.paid_amount) || 0,
        generatedAmount: Number(row.generated_amount) || 0,
        payments: paymentsByLead.get(row.id) ?? [],
        documents: documentsByLead.get(row.id) ?? []
      }));

      // Reținem ce am încărcat, ca prima sincronizare să nu retrimită tot.
      savedLists.current = new Map(
        nextLists.map((list, index) => [
        list.id,
        fingerprint(toListRow(list, index))]
        )
      );
      savedLeads.current = new Map(
        nextLeads.map((lead) => [lead.id, fingerprint(toLeadRow(lead))])
      );

      setLists(nextLists);
      setLeads(nextLeads);
      setStatus('ready');
    })();

    return () => {
      active = false;
    };
  }, [enabled]);

  // ---------- 2. Salvarea modificărilor ----------
  useEffect(() => {
    if (status !== 'ready') return;

    if (saveTimer.current) clearTimeout(saveTimer.current);
    // Așteptăm o clipă: dacă omul tastează într-un câmp, salvăm o dată la final.
    saveTimer.current = setTimeout(() => {
      void pushChanges();
    }, 600);

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leads, lists, status]);

  async function pushChanges() {
    // --- liste ---
    const listRows = lists.map((list, index) => toListRow(list, index));
    const changedLists = listRows.filter(
      (row) => savedLists.current.get(row.id) !== fingerprint(row)
    );
    const removedListIds = [...savedLists.current.keys()].filter(
      (id) => !listRows.some((row) => row.id === id)
    );

    if (changedLists.length) {
      const { error: listError } = await supabase.
      from('lead_lists').
      upsert(changedLists);
      if (listError) {
        console.error('[Supabase] Salvarea listelor a eșuat:', listError.message);
        setError(listError.message);
        return;
      }
    }
    if (removedListIds.length) {
      await supabase.from('lead_lists').delete().in('id', removedListIds);
    }

    // --- leaduri ---
    const leadRows = leads.map(toLeadRow);
    const changedLeads = leadRows.filter(
      (row) => savedLeads.current.get(row.id) !== fingerprint(row)
    );
    const removedLeadIds = [...savedLeads.current.keys()].filter(
      (id) => !leadRows.some((row) => row.id === id)
    );

    if (changedLeads.length) {
      // Trimitem în pachete, ca să nu depășim limita unei singure cereri.
      for (let index = 0; index < changedLeads.length; index += 200) {
        const batch = changedLeads.slice(index, index + 200);
        const { error: leadError } = await supabase.from('leads').upsert(batch);
        if (leadError) {
          console.error('[Supabase] Salvarea leadurilor a eșuat:', leadError.message);
          setError(leadError.message);
          return;
        }
      }
    }
    if (removedLeadIds.length) {
      await supabase.from('leads').delete().in('id', removedLeadIds);
    }

    // --- plăți și documente ---
    const paymentRows = leads.flatMap((lead) =>
    (lead.payments ?? []).map((payment) => ({
      id: payment.id,
      lead_id: lead.id,
      amount: Number(payment.amount) || 0,
      added_on: payment.addedOn ?? ''
    }))
    );
    if (paymentRows.length) {
      await supabase.from('lead_payments').upsert(paymentRows);
    }

    const documentRows = leads.flatMap((lead) =>
    (lead.documents ?? []).map((document) => ({
      id: document.id,
      lead_id: lead.id,
      file_name: document.fileName,
      type: document.type,
      added_on: document.addedOn ?? '',
      // Atenție: `url` e un link temporar din browser (blob:) și moare la refresh.
      // Fișierele propriu-zise vor avea nevoie de Supabase Storage — pas separat.
      url: document.url?.startsWith('blob:') ? null : document.url ?? null
    }))
    );
    if (documentRows.length) {
      await supabase.from('lead_documents').upsert(documentRows);
    }

    // Marcăm noua stare ca salvată.
    savedLists.current = new Map(
      listRows.map((row) => [row.id, fingerprint(row)])
    );
    savedLeads.current = new Map(
      leadRows.map((row) => [row.id, fingerprint(row)])
    );
    setError(null);
  }

  return { status, error };
}
