import { subAccounts } from './subAccounts';

export interface LeadList {
  id: string;
  name: string;
  detail: string;
  color: string;
  /** Sub-accounts care pot deschide și edita lista */
  access: string[];
  /** Lista indexată — ascunsă din grila principală */
  indexed?: boolean;
}

/** Statusurile presetate, plus cele adăugate de utilizator */
export type LeadStatus = string;

export interface CustomLeadStatus {
  name: string;
  color: string;
}

export const leadStatuses: LeadStatus[] = [
'Înscris webinar',
'Nu a răspuns',
'Programat apel',
'No-show',
'A zis „Nu”',
'Așteptăm răspuns',
'A zis da',
'Semnat'];


/** Clasele și stilurile pentru un status presetat sau personalizat */
export function statusVisuals(
status: string,
customStatuses: CustomLeadStatus[] = [])
{
  const custom = customStatuses.find((item) => item.name === status);
  if (custom) {
    return {
      badgeClass: 'border',
      rowClass: '',
      badgeStyle: {
        backgroundColor: `${custom.color}26`,
        borderColor: `${custom.color}59`,
        color: custom.color
      },
      rowStyle: { backgroundColor: `${custom.color}14` }
    };
  }
  return {
    badgeClass:
    leadStatusBadge[status] ?? 'bg-slate-100 text-ink-700 border-slate-200',
    rowClass: leadStatusRow[status] ?? 'bg-white',
    badgeStyle: undefined,
    rowStyle: undefined
  };
}

/** Fundalul rândului pentru fiecare status */
export const leadStatusRow: Record<string, string> = {
  'Înscris webinar': 'bg-white',
  'Nu a răspuns': 'bg-white',
  'Programat apel': 'bg-brand-50',
  'No-show': 'bg-red-100',
  'A zis „Nu”': 'bg-red-50',
  'Așteptăm răspuns': 'bg-amber-50',
  'A zis da': 'bg-emerald-50',
  Semnat: 'bg-emerald-100'
};

/** Badge-ul de status */
export const leadStatusBadge: Record<string, string> = {
  'Înscris webinar': 'bg-slate-100 text-ink-700 border-slate-200',
  'Nu a răspuns': 'bg-slate-100 text-ink-700 border-slate-200',
  'Programat apel': 'bg-brand-100 text-brand-700 border-brand-200',
  'No-show': 'bg-red-200 text-red-900 border-red-300',
  'A zis „Nu”': 'bg-red-100 text-red-700 border-red-200',
  'Așteptăm răspuns': 'bg-amber-100 text-amber-800 border-amber-200',
  'A zis da': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Semnat: 'bg-emerald-200 text-emerald-900 border-emerald-300'
};

export type LeadDocumentType =
'Factură' |
'Proformă' |
'Ordin de plată' |
'Foaie de analiză';

export const leadDocumentTypes: LeadDocumentType[] = [
'Factură',
'Proformă',
'Ordin de plată',
'Foaie de analiză'];


export interface LeadDocument {
  id: string;
  /** Numele fișierului exact cum a fost salvat pe laptop, ex. „e-factura 129845.pdf” */
  fileName: string;
  type: LeadDocumentType;
  addedOn: string;
  /** URL blob generat la încărcare, folosit pentru descărcare */
  url?: string;
}

const monthAbbr: Record<string, number> = {
  ian: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  mai: 5,
  iun: 6,
  iul: 7,
  aug: 8,
  sep: 9,
  sept: 9,
  oct: 10,
  noi: 11,
  nov: 11,
  dec: 12
};

/** Transformă „18 aug 2026” sau „18 aug. 2026” în „2026-08-18” */
export function leadDateIso(addedOn: string) {
  const parts = addedOn.replace(/\./g, '').trim().split(/\s+/);
  if (parts.length < 3) return '';
  const day = Number(parts[0]);
  const month =
  monthAbbr[parts[1].toLowerCase().slice(0, 4)] ??
  monthAbbr[parts[1].toLowerCase().slice(0, 3)];
  const year = Number(parts[2]);
  if (!day || !month || !year) return '';
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export interface LeadPayment {
  id: string;
  amount: number;
  addedOn: string;
}

export interface Lead {
  id: string;
  listId: string;
  owner: string;
  /** Callerul care a lucrat leadul */
  caller: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  details: string;
  vocarooLink: string;
  zoomLink: string;
  status: LeadStatus;
  addedOn: string;
  /** Suma TOTALĂ încasată în euro; 0 dacă nu s-a încasat nimic */
  paidAmount: number;
  /** Valoarea totală a contractului, în euro */
  generatedAmount: number;
  /** Plățile adăugate ulterior de responsabil */
  payments: LeadPayment[];
  documents: LeadDocument[];
}

/** Leadurile proaspăt intrate nu au încă responsabil */
export const UNASSIGNED = 'Neatribuit';

export const closerNames = ['Vlad Ionescu', 'Ana Dumitrescu', 'Sergiu Petrache'];
export const callerNames = ['Bianca Moldovan', 'Rareș Ciobanu', 'Teodora Sava'];

export const leadOwners = [
UNASSIGNED,
'Andreas Bălan',
...closerNames,
...callerNames];


const allSubAccountNames = subAccounts.flatMap((group) => group.members);

export const initialLeadLists: LeadList[] = [
{
  id: 'list-webinar',
  name: 'Înscriși webinar',
  detail: 'Leaduri venite din formularele de înscriere la webinar.',
  color: '#2f6bff',
  // Lista de înscriși e deschisă întregii echipe
  access: allSubAccountNames
},
{
  id: 'list-calls',
  name: 'Programați book-a-call',
  detail: 'Au rezervat un slot și au primit linkul de Zoom.',
  color: '#f97316',
  access: allSubAccountNames
},
{
  id: 'list-offers',
  name: 'Apeluri ținute',
  detail: 'Au fost prezenți la apel, dar nu au semnat încă.',
  color: '#eab308',
  access: allSubAccountNames
},
{
  id: 'list-clients',
  name: 'Clienți plătitori',
  detail: 'Contract semnat și plată încasată integral sau în rate.',
  color: '#10b981',
  access: allSubAccountNames
}];


interface LeadSeed {
  listId: string;
  firstName: string;
  lastName: string;
  owner: string;
  caller: string;
  status: LeadStatus;
  addedOn: string;
  paidAmount: number;
  generatedAmount: number;
}

/** Prenume și nume folosite pentru a genera contacte unice în toate listele */
const firstNames = [
'Ana', 'Mihai', 'Ioana', 'Andrei', 'Maria', 'Vlad', 'Elena', 'Cristian',
'Daniela', 'Alexandru', 'Roxana', 'George', 'Cristina', 'Robert', 'Alina',
'Sebastian', 'Larisa', 'Dragoș', 'Otilia', 'Emil', 'Bogdan', 'Simona',
'Radu', 'Camelia', 'Ionuț', 'Raluca', 'Paul', 'Diana', 'Tudor', 'Monica'];


const lastNames = [
'Popescu', 'Ionescu', 'Georgescu', 'Dumitrescu', 'Stoica', 'Matei',
'Constantin', 'Șerban', 'Vasile', 'Toma', 'Rusu', 'Moraru', 'Diaconu',
'Ene', 'Filip', 'Andronic', 'Cîrstea', 'Băluță', 'Pavel', 'Zaharia',
'Marinescu', 'Nistor', 'Olaru', 'Munteanu', 'Predescu', 'Voicu', 'Mocanu',
'Iordache', 'Chiriac', 'Zamfir'];


/** Contacte unice: 30 x 30 combinații, fiecare folosită o singură dată */
let nameCursor = 0;
function nextName() {
  const firstName = firstNames[nameCursor % firstNames.length];
  const lastName =
  lastNames[Math.floor(nameCursor / firstNames.length) % lastNames.length];
  nameCursor += 1;
  return { firstName, lastName };
}

const day = (index: number, span = 27) => `${1 + index % span} aug 2026`;

const seeds: LeadSeed[] = [];

// 1. Înscriși webinar — 300 de leaduri
for (let index = 0; index < 300; index += 1) {
  const caller = callerNames[index % callerNames.length];
  const bucket = index % 4;
  // Jumătate rămân doar înscriși și neatribuiți, restul au fost sunați de calleri
  const status = bucket <= 1 ? 'Înscris webinar' : 'Nu a răspuns';
  seeds.push({
    listId: 'list-webinar',
    ...nextName(),
    owner: bucket <= 1 ? UNASSIGNED : caller,
    caller: bucket <= 1 ? '' : caller,
    status,
    addedOn: day(index, 12),
    paidAmount: 0,
    generatedAmount: 0
  });
}

// 2. Programați book-a-call — 120 (90 programate, 30 no-show)
for (let index = 0; index < 120; index += 1) {
  seeds.push({
    listId: 'list-calls',
    ...nextName(),
    owner: closerNames[(index * 2 + 1) % closerNames.length],
    caller: callerNames[index % callerNames.length],
    status: index < 90 ? 'Programat apel' : 'No-show',
    addedOn: day(index, 14),
    paidAmount: 0,
    generatedAmount: 0
  });
}

// 3. Apeluri ținute — 70 de leaduri prezente la apel, fără contract semnat
const heldStatuses = ['A zis da', 'A zis „Nu”', 'Așteptăm răspuns'];
for (let index = 0; index < 70; index += 1) {
  seeds.push({
    listId: 'list-offers',
    ...nextName(),
    owner: closerNames[(index * 2 + 2) % closerNames.length],
    caller: callerNames[index % callerNames.length],
    status: heldStatuses[index % heldStatuses.length],
    addedOn: day(index, 18),
    paidAmount: 0,
    generatedAmount: 0
  });
}

// 4. Clienți plătitori — 32 de contracte semnate
const paidTiers = [500, 1000, 1200, 1500, 2000];
for (let index = 0; index < 32; index += 1) {
  const paidAmount = paidTiers[index % paidTiers.length];
  seeds.push({
    listId: 'list-clients',
    ...nextName(),
    owner: closerNames[(index * 2 + 3) % closerNames.length],
    caller: callerNames[index % callerNames.length],
    status: 'Semnat',
    addedOn: day(index, 24),
    paidAmount,
    // Valoarea contractului: 2.000 €, iar la plățile de 1.200 € contractul e 2.400 €
    generatedAmount: paidAmount === 1200 ? 2400 : 2000
  });
}

export const initialLeads: Lead[] = seeds.map((seed, index) => ({
  id: `${seed.listId}-${index}`,
  listId: seed.listId,
  owner: seed.owner,
  caller: seed.caller,
  firstName: seed.firstName,
  lastName: seed.lastName,
  phone: `+40 7${(21 + index % 60).toString().padStart(2, '0')} ${(
  100 + index).
  toString()} ${(400 + index * 7).toString().slice(0, 3)}`,
  email: `${seed.firstName.toLowerCase().replace(/[ăâîșț]/g, 'a')}.${seed.lastName.
  toLowerCase().
  replace(/[ăâîșț]/g, 'a')}${index}@gmail.com`,
  details: '',
  // Pe fiecare listă: 3 doar Vocaroo, 3 doar Zoom, 2 cu ambele, 2 fără nimic
  vocarooLink:
  index % 10 <= 2 || index % 10 === 6 || index % 10 === 7 ?
  'https://vocaroo.com/1kQ8pLm2xYz' :
  '',
  zoomLink:
  index % 10 >= 3 && index % 10 <= 5 || index % 10 === 6 || index % 10 === 7 ?
  'https://zoom.us/j/9182736450' :
  '',
  status: seed.status,
  addedOn: seed.addedOn,
  paidAmount: seed.paidAmount,
  generatedAmount: seed.generatedAmount,
  payments: [],
  documents:
  seed.listId === 'list-clients' && index % 2 === 0 ?
  [
  {
    id: `${seed.listId}-${index}-doc-1`,
    fileName: `e-factura ${129845 + index}.pdf`,
    type: 'Factură' as const,
    addedOn: seed.addedOn
  }] :

  []
}));