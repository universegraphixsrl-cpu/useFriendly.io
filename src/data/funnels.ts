/** Tipurile de pași dintr-un funnel */
export type FunnelStepKind =
'Sales page' |
'Opt-in page' |
'Opt-in thank you' |
'Checkout' |
'Upsell' |
'Downsell' |
'Order bump' |
'Webinar' |
'Webinar replay' |
'Thank you page' |
'Info page' |
'VSL page';

export interface FunnelStep {
  id: string;
  name: string;
  kind: FunnelStepKind;
  /** Calea relativă a paginii, fără domeniu */
  path: string;
}

export interface Funnel {
  id: string;
  name: string;
  domain: string;
  active: boolean;
  /** Data creării, în format ISO */
  createdAt: string;
  steps: FunnelStep[];
}

/** Cele 12 tipuri de pagini disponibile la crearea unui pas */
export const funnelStepKinds: FunnelStepKind[] = [
'Webinar',
'Webinar replay',
'Opt-in page',
'Opt-in thank you',
'Sales page',
'VSL page',
'Checkout',
'Order bump',
'Upsell',
'Downsell',
'Thank you page',
'Info page'];


export const funnels: Funnel[] = [
{
  id: 'funnel-english-hub',
  name: 'English Hub',
  domain: 'english-hub.ro',
  active: true,
  createdAt: '2026-02-10T12:50:00',
  steps: [
  { id: 'step-eh-1', name: 'English Hub', kind: 'Sales page', path: 'oferta' },
  {
    id: 'step-eh-2',
    name: 'English Hub MASTERCLASS',
    kind: 'Sales page',
    path: 'masterclass'
  },
  { id: 'step-eh-3', name: 'BASIC English', kind: 'Sales page', path: 'basic' },
  { id: 'step-eh-4', name: 'EPIC English', kind: 'Sales page', path: 'epic' },
  { id: 'step-eh-5', name: 'Pagină opt-in', kind: 'Opt-in page', path: 'inscriere' },
  {
    id: 'step-eh-6',
    name: 'Confirmare apel',
    kind: 'Opt-in thank you',
    path: 'confirmare-apel'
  },
  {
    id: 'step-eh-7',
    name: 'Profesori confirmare apel',
    kind: 'Opt-in thank you',
    path: 'profesori-confirmare'
  }]

},
{
  id: 'funnel-elite-closers',
  name: 'EliteClosers',
  domain: 'eliteclosers.ro',
  active: true,
  createdAt: '2024-11-19T13:59:00',
  steps: [
  { id: 'step-ec-1', name: 'Webinar live', kind: 'Webinar', path: 'webinar' },
  { id: 'step-ec-2', name: 'Înscriere webinar', kind: 'Opt-in page', path: 'inscriere' },
  {
    id: 'step-ec-3',
    name: 'Confirmare înscriere',
    kind: 'Opt-in thank you',
    path: 'confirmare'
  },
  { id: 'step-ec-4', name: 'Ofertă mentorat', kind: 'Sales page', path: 'mentorat' },
  { id: 'step-ec-5', name: 'Checkout mentorat', kind: 'Checkout', path: 'checkout' }]

},
{
  id: 'funnel-ads',
  name: 'Ads & Funnels',
  domain: 'ads-funnels.ro',
  active: false,
  createdAt: '2024-02-11T19:17:00',
  steps: [
  { id: 'step-af-1', name: 'Landing ads', kind: 'Opt-in page', path: 'landing' },
  { id: 'step-af-2', name: 'Ofertă audit', kind: 'Sales page', path: 'audit' },
  { id: 'step-af-3', name: 'Upsell implementare', kind: 'Upsell', path: 'upsell' }]

}];


/** Formatare identică cu restul aplicației: 10.02.2026, 12:50 */
export function formatFunnelDate(iso: string): string {
  const date = new Date(iso);
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}, ${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}