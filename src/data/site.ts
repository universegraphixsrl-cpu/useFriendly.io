/** Conținutul site-ului public de prezentare Friendly */

export interface SiteFeature {
  title: string;
  description: string;
  /** Numele iconiței lucide folosite în card */
  icon:
  'layout' |
  'filter' |
  'mail' |
  'zap' |
  'users' |
  'calendar' |
  'card' |
  'book' |
  'chart';
}

export const siteFeatures: SiteFeature[] = [
{
  title: 'Web builder drag & drop',
  description:
  'Construiești landing pages, pagini de vânzare și pop-up-uri trăgând elemente pe pagină. Fără cod, fără developer.',
  icon: 'layout'
},
{
  title: 'Sales funnels complete',
  description:
  'Opt-in, pagină de vânzare, checkout, upsell și thank you — legate între ele, cu statistici pe fiecare pas.',
  icon: 'filter'
},
{
  title: 'Email & SMS marketing',
  description:
  'Scrii mailul în editorul nostru, alegi ora și publicul. SMS-urile pleacă din același flux, cu contor de caractere.',
  icon: 'mail'
},
{
  title: 'Automatizări vizuale',
  description:
  'Trigger → acțiune, pe pași. Atribuie taguri, înscrie în cursuri, mută contacte în pipeline, trimite webhook-uri.',
  icon: 'zap'
},
{
  title: 'CRM cu liste și statusuri',
  description:
  'Leaduri pe liste, statusuri colorate, responsabil și caller, documente atașate și sume încasate pe fiecare client.',
  icon: 'users'
},
{
  title: 'Calendare de programări',
  description:
  'Calendare individuale sau de echipă, sloturi de 15–60 de minute, buffer, sincronizare Google și link Zoom automat.',
  icon: 'calendar'
},
{
  title: 'Linkuri de plată',
  description:
  'Un link reutilizabil, checkout ca la Stripe, plată unică sau recurentă personalizată, în peste 20 de valute.',
  icon: 'card'
},
{
  title: 'Cursuri & proceduri',
  description:
  'Încarci video, suport scris și resurse, apoi dai acces pe echipă. Perfect pentru onboarding și SOP-uri interne.',
  icon: 'book'
},
{
  title: 'Rapoarte pe rol',
  description:
  'Sume colectate, comisioane, apeluri programate și ținute, performanță pe closeri și calleri, fără dublarea vânzărilor.',
  icon: 'chart'
}];


export const siteStats: Array<{value: string;label: string;}> = [
{ value: '9', label: 'module într-un singur cont' },
{ value: '1 tool', label: 'în locul a 6 abonamente' },
{ value: '11 min', label: 'până la primul funnel publicat' },
{ value: '14 zile', label: 'gratuit, fără card' }];


export const siteSteps: Array<{title: string;description: string;}> = [
{
  title: 'Îți faci contul',
  description:
  'Intri cu emailul, fără card și fără instalare. Contul e gata în mai puțin de un minut.'
},
{
  title: 'Alegi modulele de care ai nevoie',
  description:
  'Web builder, funnels, automatizări, CRM, calendare — adaugi doar ce folosești, restul rămâne ascuns.'
},
{
  title: 'Publici și urmărești rezultatele',
  description:
  'Pagina merge live, leadurile intră direct în liste, iar rapoartele arată exact ce a adus vânzarea.'
}];


export const siteComparison: {
  before: string[];
  after: string[];
} = {
  before: [
  'Șase abonamente separate și facturi lunare diferite',
  'Leadurile ajung în Sheets, apoi se pierd',
  'Paginile le face un freelancer, la fiecare modificare aștepți',
  'Nimeni nu știe cine a adus vânzarea',
  'Integrări care se rup între tool-uri'],

  after: [
  'Un singur cont, un singur abonament',
  'Leadurile intră direct în liste, cu responsabil și status',
  'Editezi pagina singur, în drag & drop, în două minute',
  'Rapoarte pe closer și caller, cu comisionul calculat',
  'Totul comunică nativ, plus Make conectat din start']

};

export interface SitePlan {
  name: string;
  price: number;
  tagline: string;
  features: string[];
  recommended?: boolean;
  cta: string;
  /** Câte sub-accounts sunt incluse în preț */
  includedSeats: number;
}

/** Prețul lunar al unui sub-account peste cele incluse în pachet */
export const extraSeatPrice = 20;

export const sitePlans: SitePlan[] = [
{
  name: 'Start',
  price: 47,
  tagline: 'Pentru antreprenorii care abia își lansează oferta.',
  cta: 'Începe cu Start',
  includedSeats: 1,
  features: [
  '1 sub-account inclus în preț',
  'Web builder + 3 funnels',
  'Email marketing, 5.000 de trimiteri/lună',
  '1 calendar de programări',
  'CRM cu 2 liste de leaduri',
  'Linkuri de plată nelimitate']

},
{
  name: 'Pro',
  price: 97,
  tagline: 'Pentru echipele mici care vând constant, cu closeri și calleri.',
  cta: 'Alege Pro',
  recommended: true,
  includedSeats: 3,
  features: [
  '3 sub-accounts incluse în preț',
  'Funnels și pagini nelimitate',
  'Email & SMS, 50.000 de trimiteri/lună',
  'Automatizări vizuale nelimitate',
  'Calendare de echipă + sincronizare Google',
  'Rapoarte pe closeri și calleri, cu comision',
  'Cursuri & proceduri cu acces pe echipă']

},
{
  name: 'Scale',
  price: 297,
  tagline: 'Pentru agenții și companii cu mai multe branduri în același cont.',
  cta: 'Discută pentru Scale',
  includedSeats: 5,
  features: [
  '5 sub-accounts incluse + roluri personalizate',
  'Branduri și domenii multiple',
  'Email & SMS, 250.000 de trimiteri/lună',
  'A/B test pe pașii de funnel',
  'Suport prioritar, cu apel pe Zoom în 24h',
  'Onboarding asistat pentru echipa ta']

}];


export const siteTestimonials: Array<{
  quote: string;
  name: string;
  role: string;
}> = [
{
  quote:
  'Am renunțat la patru abonamente în prima lună. Paginile, mailurile și leadurile stau în același loc, iar echipa nu mai pierde nimic pe drum.',
  name: 'Andrei Marinescu',
  role: 'Fondator, academie de business'
},
{
  quote:
  'Primul funnel l-am publicat singur, într-o seară. Înainte așteptam o săptămână după freelancer pentru fiecare modificare de text.',
  name: 'Ioana Dobre',
  role: 'Marketing manager, curs online'
},
{
  quote:
  'Rapoartele pe closeri și calleri au rezolvat cea mai veche discuție din echipă: cine a adus vânzarea și cât comision se plătește.',
  name: 'Radu Enache',
  role: 'Head of sales, agenție de consultanță'
}];


export const siteFaq: Array<{question: string;answer: string;}> = [
{
  question: 'Chiar pot renunța la celelalte tool-uri?',
  answer:
  'Da. Friendly acoperă paginile, funnelurile, emailul și SMS-ul, automatizările, CRM-ul, calendarele, linkurile de plată și cursurile. Dacă folosești ceva în plus, îl conectezi prin Make, care e activ din start.'
},
{
  question: 'Am nevoie de cunoștințe tehnice?',
  answer:
  'Nu. Tot ce construiești se face prin drag & drop, iar fiecare element are propriul panou de setări: culori, spațiere, fonturi, vizibilitate pe desktop și mobil.'
},
{
  question: 'Pot lucra cu echipa în același cont?',
  answer:
  'Da. Creezi sub-accounts pe categorii — closeri, calleri, manageri, marketeri — și decizi exact ce liste, calendare, task-uri și materiale vede fiecare.'
},
{
  question: 'Ce se întâmplă cu datele mele dacă renunț?',
  answer:
  'Îți exporți leadurile, documentele și rapoartele oricând, în format standard. Nu blocăm contul și nu îți ținem datele ostatice.'
},
{
  question: 'Pot schimba pachetul mai târziu?',
  answer:
  'Oricând, în ambele direcții. Diferența se calculează proporțional, iar modulele pe care nu le mai folosești dispar din meniu.'
}];