import type { Lead } from '../data/leads';
import { leadDateIso, UNASSIGNED } from '../data/leads';
import type { SubAccountRole } from '../data/subAccounts';
import type {
  AgentPerformance,
  FunnelStage,
  ShowUpPoint } from
'../data/reports';

/**
 * Rapoartele, calculate din leadurile reale.
 *
 * Ce se poate calcula onest din ce știe CRM-ul, se calculează. Ce ar cere
 * date pe care CRM-ul nu le are (câți au stat live la un webinar, de pildă)
 * nu se inventează — se lasă gol, cu o explicație pe ecran.
 */

const SCHEDULED = new Set([
'Programat apel',
'No-show',
'A zis „Nu”',
'Așteptăm răspuns',
'A zis da',
'Semnat']);


const ATTENDED = new Set([
'A zis „Nu”',
'Așteptăm răspuns',
'A zis da',
'Semnat']);


const SIGNED = 'Semnat';

const pct = (part: number, total: number) =>
total ? Math.round(part / total * 100) : 0;

/** Suma încasată, în euro */
function collected(leads: Lead[]) {
  return leads.reduce((total, lead) => total + (Number(lead.paidAmount) || 0), 0);
}

/**
 * Performanța fiecărui om din echipă, din leadurile în care e responsabil.
 * Trendul cere istoric pe luni, deci rămâne 0 până avem destule date.
 */
export function agentPerformanceFromLeads(
leads: Lead[],
groups: SubAccountRole[])
: AgentPerformance[] {
  const roleLabel: Record<string, string> = {
    Closers: 'Closer',
    Callers: 'Caller',
    Managers: 'Manager',
    Marketers: 'Marketer'
  };

  const people = groups.flatMap((group) =>
  group.members.map((name) => ({ name, role: roleLabel[group.role] ?? 'Agent' }))
  );

  return people.
  map((person) => {
    const mine = leads.filter(
      (lead) => lead.owner === person.name && lead.owner !== UNASSIGNED
    );
    const scheduled = mine.filter((lead) => SCHEDULED.has(lead.status));
    const attended = mine.filter((lead) => ATTENDED.has(lead.status));
    const signed = mine.filter((lead) => lead.status === SIGNED);

    return {
      name: person.name,
      role: person.role,
      showUp: pct(attended.length, scheduled.length),
      closeRate: pct(signed.length, attended.length),
      calls: scheduled.length,
      revenue: `${collected(signed).toLocaleString('ro-RO')} €`,
      trend: 0
    };
  }).
  // Oamenii fără niciun lead alocat nu aglomerează tabelul
  filter((row) => row.calls > 0 || row.revenue !== '0 €');
}

/**
 * Pâlnia: doar etapele pe care CRM-ul le cunoaște cu adevărat.
 * „Participanți live” și „au rămas la ofertă” ar veni din platforma de
 * webinar, care nu e conectată — de aceea lipsesc, în loc să fie inventate.
 */
export function funnelFromLeads(leads: Lead[]): FunnelStage[] {
  const total = leads.length;
  const scheduled = leads.filter((lead) => SCHEDULED.has(lead.status)).length;
  const attended = leads.filter((lead) => ATTENDED.has(lead.status)).length;
  const signed = leads.filter((lead) => lead.status === SIGNED).length;

  return [
  { label: 'Leaduri intrate', value: total, percent: 100 },
  { label: 'Apeluri programate', value: scheduled, percent: pct(scheduled, total) },
  { label: 'Prezenți la apel', value: attended, percent: pct(attended, total) },
  { label: 'Contracte semnate', value: signed, percent: pct(signed, total) }];

}

const MONTH_NAMES = [
'Ian',
'Feb',
'Mar',
'Apr',
'Mai',
'Iun',
'Iul',
'Aug',
'Sep',
'Oct',
'Noi',
'Dec'];


export interface MonthBucket {
  /** Numele scurt al lunii, pentru axa graficului */
  month: string;
  /** Leadurile adăugate în luna respectivă */
  leads: Lead[];
}

/**
 * Leadurile grupate pe ultimele luni calendaristice, terminate cu luna
 * curentă. Lunile fără nimic rămân la zero — asta e realitatea unui cont
 * nou, și e mai cinstit decât un istoric inventat.
 */
export function leadsByMonth(leads: Lead[], count = 8): MonthBucket[] {
  const now = new Date();
  const buckets: {month: string;key: string;leads: Lead[];}[] = [];

  for (let back = count - 1; back >= 0; back--) {
    const date = new Date(now.getFullYear(), now.getMonth() - back, 1);
    buckets.push({
      month: MONTH_NAMES[date.getMonth()],
      key:
      date.getFullYear() +
      '-' +
      String(date.getMonth() + 1).padStart(2, '0'),
      leads: []
    });
  }

  const byKey = new Map(buckets.map((bucket) => [bucket.key, bucket]));

  leads.forEach((lead) => {
    const iso = leadDateIso(lead.addedOn ?? '');
    if (!iso) return;
    byKey.get(iso.slice(0, 7))?.leads.push(lead);
  });

  return buckets.map(({ month, leads: group }) => ({ month, leads: group }));
}

/** Luni-ul săptămânii unei date, ca text „2026-09-21” */
function weekStart(iso: string) {
  if (!iso) return '';
  const date = new Date(iso + 'T00:00:00');
  if (Number.isNaN(date.getTime())) return '';
  const day = (date.getDay() + 6) % 7; // luni = 0
  date.setDate(date.getDate() - day);
  return date.toISOString().slice(0, 10);
}

/**
 * Evoluția pe ultimele 8 săptămâni: cât din cei programați chiar au venit,
 * și cât din leadurile intrate au ajuns să programeze un apel.
 */
export function showUpTrendFromLeads(leads: Lead[]): ShowUpPoint[] {
  const byWeek = new Map<string, Lead[]>();

  leads.forEach((lead) => {
    const week = weekStart(leadDateIso(lead.addedOn ?? ''));
    if (!week) return;
    const bucket = byWeek.get(week) ?? [];
    bucket.push(lead);
    byWeek.set(week, bucket);
  });

  const weeks = [...byWeek.keys()].sort().slice(-8);

  return weeks.map((week, index) => {
    const bucket = byWeek.get(week) ?? [];
    const scheduled = bucket.filter((lead) => SCHEDULED.has(lead.status)).length;
    const attended = bucket.filter((lead) => ATTENDED.has(lead.status)).length;
    return {
      week: `S${index + 1}`,
      showUp: pct(attended, scheduled),
      bookRate: pct(scheduled, bucket.length)
    };
  });
}
