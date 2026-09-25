import type { Lead, LeadList } from '../data/leads';
import { leadDateIso } from '../data/leads';
import type { PipelineData } from '../data/pipelines';

/**
 * Calculează pâlnia de vânzări din leadurile reale, în loc de cifre scrise
 * în cod. Un cont nou are zero leaduri, deci arată zero peste tot — și
 * crește singur pe măsură ce intră leaduri.
 *
 * Cum sunt citite statusurile:
 *   Înscriși webinar   — toate leadurile intrate
 *   Apeluri programate — cele care au ajuns cel puțin la „Programat apel”
 *   Prezenți la apel    — cele care chiar au ajuns la discuție (fără no-show)
 *   Vânzări noi         — cele cu contract semnat
 */

/** Statusuri care înseamnă că s-a programat un apel (sau s-a trecut de el) */
const SCHEDULED = new Set([
'Programat apel',
'No-show',
'A zis „Nu”',
'Așteptăm răspuns',
'A zis da',
'Semnat']);


/** Statusuri care înseamnă că omul a fost prezent la apel */
const ATTENDED = new Set([
'A zis „Nu”',
'Așteptăm răspuns',
'A zis da',
'Semnat']);


const SIGNED = 'Semnat';

/** Luna unui lead, din „18 aug 2026” → „2026-08”; gol dacă data lipsește */
function leadMonth(lead: Lead) {
  const iso = leadDateIso(lead.addedOn ?? '');
  return iso ? iso.slice(0, 7) : '';
}

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function summarize(leads: Lead[], id: string, name: string): PipelineData {
  const now = new Date();
  const thisMonth = monthKey(now);
  const lastMonth = monthKey(
    new Date(now.getFullYear(), now.getMonth() - 1, 1)
  );

  const signed = leads.filter((lead) => lead.status === SIGNED);

  /** Valoarea contractelor semnate; dacă lipsește, cât s-a încasat */
  const valueOf = (list: Lead[]) =>
  list.reduce(
    (total, lead) =>
    total + (Number(lead.generatedAmount) || Number(lead.paidAmount) || 0),
    0
  );

  const value = valueOf(signed);
  const valueThisMonth = valueOf(
    signed.filter((lead) => leadMonth(lead) === thisMonth)
  );
  const valueLastMonth = valueOf(
    signed.filter((lead) => leadMonth(lead) === lastMonth)
  );

  // Creșterea față de luna trecută are sens doar dacă luna trecută a existat.
  const delta =
  valueLastMonth > 0 ?
  (valueThisMonth - valueLastMonth) / valueLastMonth * 100 :
  0;

  // Cum a fost încasat fiecare contract semnat
  let integrale = 0;
  let rate = 0;
  let avansuri = 0;
  signed.forEach((lead) => {
    const paid = Number(lead.paidAmount) || 0;
    const total = Number(lead.generatedAmount) || 0;
    const installments = (lead.payments ?? []).length;
    if (total > 0 && paid >= total) integrale += 1;else
    if (installments >= 2) rate += 1;else
    if (paid > 0) avansuri += 1;
  });

  return {
    id,
    name,
    value,
    delta,
    inscrisiWebinar: leads.length,
    apeluriProgramate: leads.filter((lead) => SCHEDULED.has(lead.status)).length,
    prezentiApel: leads.filter((lead) => ATTENDED.has(lead.status)).length,
    vanzariNoi: signed.length,
    integrale,
    rate,
    avansuri
  };
}

/**
 * Opțiunile din selectorul de pipeline: întâi totalul, apoi câte una
 * pentru fiecare listă de leaduri.
 */
export function pipelinesFromLeads(
leads: Lead[],
lists: LeadList[])
: PipelineData[] {
  const all = summarize(leads, 'toate', 'Toate leadurile');
  const perList = lists.map((list) =>
  summarize(
    leads.filter((lead) => lead.listId === list.id),
    list.id,
    list.name
  )
  );
  return [all, ...perList];
}

/** Împărțire care nu produce „NaN%” când numitorul e zero */
export function safePercent(part: number, total: number) {
  if (!total) return 0;
  return part / total * 100;
}
