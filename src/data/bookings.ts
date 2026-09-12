export interface Booking {
  id: string;
  calendarId: string;
  /** Sub-accountul responsabil de întâlnire */
  owner: string;
  leadName: string;
  phone: string;
  email: string;
  /** Data programării, format ISO (YYYY-MM-DD) */
  date: string;
  time: string;
  /** Câmpuri suplimentare completate la rezervare */
  fields: {label: string;value: string;}[];
}

export const bookings: Booking[] = [
{
  id: 'bk-1',
  calendarId: 'personal',
  owner: 'Andreas Bălan',
  leadName: 'Cătălina Enea',
  phone: '+40 741 220 118',
  email: 'catalina@enea.ro',
  date: '2026-08-27',
  time: '10:00',
  fields: [
  { label: 'Sursă', value: 'Recomandare' },
  { label: 'Cifră lunară', value: '18.000 €' },
  { label: 'Subiect', value: 'Structurarea ofertei de mentorat' }]

},
{
  id: 'bk-2',
  calendarId: 'webinar',
  owner: 'Vlad Ionescu',
  leadName: 'Andrei Pavel',
  phone: '+40 722 431 909',
  email: 'andrei.pavel@gmail.com',
  date: '2026-08-27',
  time: '14:30',
  fields: [
  { label: 'Webinar', value: 'Sisteme de vânzare · 21 august' },
  { label: 'Buget declarat', value: '3.000 – 5.000 €' }]

},
{
  id: 'bk-3',
  calendarId: 'webinar',
  owner: 'Ana Dumitrescu',
  leadName: 'Elena Marinescu',
  phone: '+40 733 118 240',
  email: 'elena.marinescu@yahoo.com',
  date: '2026-08-28',
  time: '11:15',
  fields: [
  { label: 'Webinar', value: 'Sisteme de vânzare · 21 august' },
  { label: 'Rol', value: 'Fondator agenție' }]

},
{
  id: 'bk-4',
  calendarId: 'onboarding',
  owner: 'Larisa Neagu',
  leadName: 'Seeding English',
  phone: '+40 745 662 004',
  email: 'contact@seedingenglish.ro',
  date: '2026-08-28',
  time: '16:00',
  fields: [
  { label: 'Pachet', value: 'Growth · 4.800 €' },
  { label: 'Obiectiv 30 zile', value: 'Lansare funnel webinar' }]

},
{
  id: 'bk-5',
  calendarId: 'personal',
  owner: 'Andreas Bălan',
  leadName: 'Denisa Fitness',
  phone: '+40 756 900 312',
  email: 'denisa@denisafitness.ro',
  date: '2026-08-31',
  time: '09:30',
  fields: [
  { label: 'Sursă', value: 'Instagram' },
  { label: 'Subiect', value: 'Plan de scalare abonamente' }]

},
{
  id: 'bk-6',
  calendarId: 'webinar',
  owner: 'Sergiu Petrache',
  leadName: 'Mihai Dobre',
  phone: '+40 764 550 771',
  email: 'mihai.dobre@outlook.com',
  date: '2026-09-01',
  time: '12:00',
  fields: [
  { label: 'Webinar', value: 'Sisteme de vânzare · 28 august' },
  { label: 'Buget declarat', value: 'Sub 2.000 €' }]

},
{
  id: 'bk-7',
  calendarId: 'onboarding',
  owner: 'Cristian Barbu',
  leadName: 'Centrul Herghelia',
  phone: '+40 730 447 118',
  email: 'office@herghelia.ro',
  date: '2026-09-02',
  time: '11:00',
  fields: [
  { label: 'Pachet', value: 'Pro · 9.400 €' },
  { label: 'Echipă alocată', value: '2 closeri, 1 caller' }]

},
{
  id: 'bk-8',
  calendarId: 'audit',
  owner: 'Bianca Moldovan',
  leadName: 'Robert Anton',
  phone: '+40 758 221 640',
  email: 'robert.anton@gmail.com',
  date: '2026-09-03',
  time: '09:45',
  fields: [
  { label: 'Sursă', value: 'Meta Lead Ads' },
  { label: 'Nevoie', value: 'Calificare listă rece' }]

},
{
  id: 'bk-9',
  calendarId: 'personal',
  owner: 'Andreas Bălan',
  leadName: 'Georgiana Vasilescu',
  phone: '+40 726 334 887',
  email: 'georgiana@vasilescu.ro',
  date: '2026-08-24',
  time: '10:30',
  fields: [
  { label: 'Rezultat', value: 'Ofertă trimisă' },
  { label: 'Următorul pas', value: 'Follow-up pe 27 august' }]

},
{
  id: 'bk-10',
  calendarId: 'webinar',
  owner: 'Teodora Sava',
  leadName: 'Alexandru Rusu',
  phone: '+40 769 118 552',
  email: 'alex.rusu@gmail.com',
  date: '2026-08-24',
  time: '15:00',
  fields: [
  { label: 'Rezultat', value: 'No-show' },
  { label: 'Acțiune', value: 'Reprogramare automată trimisă' }]

},
{
  id: 'bk-11',
  calendarId: 'webinar',
  owner: 'Vlad Ionescu',
  leadName: 'Ioana Preda',
  phone: '+40 723 776 108',
  email: 'ioana.preda@gmail.com',
  date: '2026-08-21',
  time: '13:15',
  fields: [
  { label: 'Rezultat', value: 'Semnat · 3.000 €' },
  { label: 'Pachet', value: 'Growth' }]

},
{
  id: 'bk-12',
  calendarId: 'onboarding',
  owner: 'Larisa Neagu',
  leadName: 'English Hub',
  phone: '+40 748 220 913',
  email: 'hello@englishhub.ro',
  date: '2026-08-20',
  time: '11:00',
  fields: [
  { label: 'Rezultat', value: 'Kickoff realizat' },
  { label: 'Livrabile', value: 'Acces platformă, plan 30 zile' }]

},
{
  id: 'bk-13',
  calendarId: 'audit',
  owner: 'Rareș Ciobanu',
  leadName: 'Dana Roșu',
  phone: '+40 751 330 226',
  email: 'dana@danarosu.ro',
  date: '2026-08-19',
  time: '09:15',
  fields: [
  { label: 'Rezultat', value: 'Programat apel de strategie' },
  { label: 'Sursă', value: 'Google Ads' }]

},
{
  id: 'bk-14',
  calendarId: 'personal',
  owner: 'Andreas Bălan',
  leadName: 'AstraPulse',
  phone: '+40 729 664 402',
  email: 'team@astrapulse.io',
  date: '2026-08-18',
  time: '16:30',
  fields: [
  { label: 'Rezultat', value: 'Amânat de client' },
  { label: 'Următorul pas', value: 'Reprogramat pe 2 septembrie' }]

},
{
  id: 'bk-15',
  calendarId: 'mentorat',
  owner: 'Andreas Bălan',
  leadName: 'Roberta TheGerminds',
  phone: '+40 737 442 118',
  email: 'roberta@thegerminds.com',
  date: '2026-08-17',
  time: '14:00',
  fields: [
  { label: 'Rezultat', value: 'Sesiune realizată' },
  { label: 'Temă', value: 'Retenție și upsell' }]

},
{
  id: 'bk-16',
  calendarId: 'interviuri',
  owner: 'Cristian Barbu',
  leadName: 'Paul Grigore (candidat)',
  phone: '+40 762 118 003',
  email: 'paul.grigore@gmail.com',
  date: '2026-08-14',
  time: '10:00',
  fields: [
  { label: 'Rezultat', value: 'Angajat ca marketer' },
  { label: 'Scor probă', value: '8,5 / 10' }]

}];


const todayIso = '2026-08-26';

export const isUpcoming = (booking: Booking) => booking.date >= todayIso;

export function formatBookingDate(iso: string) {
  const months = [
  'ianuarie',
  'februarie',
  'martie',
  'aprilie',
  'mai',
  'iunie',
  'iulie',
  'august',
  'septembrie',
  'octombrie',
  'noiembrie',
  'decembrie'];

  const [year, month, day] = iso.split('-');
  return `${Number(day)} ${months[Number(month) - 1]} ${year}`;
}