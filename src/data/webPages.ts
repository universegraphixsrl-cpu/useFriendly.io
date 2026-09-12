/** Tipurile de blocuri disponibile în web builder */
export type BlockType =
'hero' |
'text' |
'form' |
'video' |
'testimonials' |
'pricing' |
'faq' |
'cta' |
'footer';

export interface PageBlock {
  id: string;
  type: BlockType;
  /** Titlul afișat în bloc */
  heading: string;
  /** Textul secundar */
  body: string;
  /** Textul butonului, unde are sens */
  action: string;
}

export type PageKind = 'Landing page' | 'Funnel' | 'Thank you' | 'Webinar';

export interface WebPage {
  id: string;
  name: string;
  kind: PageKind;
  slug: string;
  color: string;
  published: boolean;
  visits: number;
  conversions: number;
  blocks: PageBlock[];
}

/** Descrierea fiecărui tip de bloc, folosită în paleta din builder */
export const blockLibrary: {
  type: BlockType;
  label: string;
  hint: string;
  emoji: string;
}[] = [
{ type: 'hero', label: 'Hero', hint: 'Titlu mare + buton principal', emoji: '🎯' },
{ type: 'text', label: 'Text', hint: 'Paragraf sau descriere', emoji: '📝' },
{ type: 'form', label: 'Formular lead', hint: 'Nume, email, telefon', emoji: '🧲' },
{ type: 'video', label: 'Video', hint: 'Prezentare sau webinar', emoji: '🎬' },
{
  type: 'testimonials',
  label: 'Testimoniale',
  hint: 'Rezultate de la clienți',
  emoji: '💬'
},
{ type: 'pricing', label: 'Prețuri', hint: 'Pachete și tarife', emoji: '💳' },
{ type: 'faq', label: 'Întrebări frecvente', hint: 'Obiecții rezolvate', emoji: '❓' },
{ type: 'cta', label: 'Call to action', hint: 'Ultimul îndemn', emoji: '🚀' },
{ type: 'footer', label: 'Footer', hint: 'Termeni și contact', emoji: '⚓' }];


/** Conținutul implicit cu care intră un bloc nou în pagină */
export const blockDefaults: Record<BlockType, Omit<PageBlock, 'id' | 'type'>> = {
  hero: {
    heading: 'Programează un apel de strategie gratuit',
    body: 'Vezi exact ce blochează vânzările echipei tale și ce schimbăm în primele 30 de zile.',
    action: 'Rezervă apelul'
  },
  text: {
    heading: 'Pentru cine este',
    body: 'Antreprenori cu o echipă de vânzări formată, care vor un proces predictibil, nu doar mai multe leaduri.',
    action: ''
  },
  form: {
    heading: 'Lasă-ți datele',
    body: 'Prenume, nume, email și telefon. Te contactăm în maximum 24 de ore.',
    action: 'Trimite datele'
  },
  video: {
    heading: 'Cum funcționează procesul',
    body: 'Prezentare de 12 minute cu structura completă a sistemului de vânzări.',
    action: 'Pornește video'
  },
  testimonials: {
    heading: 'Rezultate reale',
    body: '„Am trecut de la 4 la 11 contracte pe lună cu aceeași echipă.” — client Friendly',
    action: ''
  },
  pricing: {
    heading: 'Pachete',
    body: 'Growth 198 €/lună · Pro 349 €/lună. Fără contract pe termen lung.',
    action: 'Alege pachetul'
  },
  faq: {
    heading: 'Întrebări frecvente',
    body: 'Cât durează implementarea? Ce se întâmplă dacă nu am încă echipă? Cum se face raportarea?',
    action: ''
  },
  cta: {
    heading: 'Gata să începi?',
    body: 'Locurile pentru luna aceasta sunt limitate la 8 companii.',
    action: 'Vreau apelul'
  },
  footer: {
    heading: 'Friendly',
    body: 'Termeni și condiții · Politica de confidențialitate · contact@friendly.ro',
    action: ''
  }
};

export const pageKinds: PageKind[] = [
'Landing page',
'Funnel',
'Thank you',
'Webinar'];


/** Cele 15 culori standard din aplicație */
export const pageColors = [
'#2f6bff',
'#1d4ed8',
'#0ea5e9',
'#06b6d4',
'#10b981',
'#22c55e',
'#84cc16',
'#eab308',
'#f59e0b',
'#f97316',
'#ef4444',
'#ec4899',
'#a855f7',
'#6366f1',
'#64748b'];


const block = (
type: BlockType,
index: number,
overrides: Partial<PageBlock> = {})
: PageBlock => ({
  id: `block-${type}-${index}`,
  type,
  ...blockDefaults[type],
  ...overrides
});

export const webPages: WebPage[] = [
{
  id: 'page-webinar',
  name: 'Înscriere webinar — Sisteme de vânzări',
  kind: 'Webinar',
  slug: 'webinar-sisteme-vanzari',
  color: '#2f6bff',
  published: true,
  visits: 4820,
  conversions: 1142,
  blocks: [
  block('hero', 1, {
    heading: 'Webinar gratuit: cum construiești o echipă de vânzări predictibilă',
    action: 'Mă înscriu la webinar'
  }),
  block('form', 2, { heading: 'Rezervă-ți locul' }),
  block('testimonials', 3),
  block('faq', 4),
  block('footer', 5)]

},
{
  id: 'page-book-call',
  name: 'Funnel book-a-call',
  kind: 'Funnel',
  slug: 'apel-strategie',
  color: '#f59e0b',
  published: true,
  visits: 2310,
  conversions: 388,
  blocks: [
  block('hero', 6),
  block('video', 7),
  block('pricing', 8),
  block('cta', 9),
  block('footer', 10)]

},
{
  id: 'page-thanks',
  name: 'Pagină de mulțumire',
  kind: 'Thank you',
  slug: 'mulțumim',
  color: '#10b981',
  published: false,
  visits: 0,
  conversions: 0,
  blocks: [
  block('hero', 11, {
    heading: 'Înscrierea ta e confirmată',
    body: 'Ți-am trimis pe email linkul de acces și un reminder cu o oră înainte.',
    action: 'Adaugă în calendar'
  }),
  block('text', 12, { heading: 'Ce urmează' }),
  block('footer', 13)]

}];