export interface BookingCalendar {
  id: string;
  name: string;
  purpose: string;
  duration: number;
  location: string;
  type: 'One-on-One' | 'Grup' | 'Colectiv';
  days: string;
  color: string;
  active: boolean;
  host: string;
  initials: string;
  /** Membrii din sub-accounts invitați într-un team calendar */
  members?: CalendarMember[];
  /** Sub-accountul care și-a creat singur calendarul */
  owner?: string;
}

export interface CalendarMember {
  name: string;
  role: string;
  /** True dacă membrul și-a conectat calendarul */
  connected: boolean;
}

export const bookingCalendars: BookingCalendar[] = [
{
  id: 'personal',
  name: 'Calendar personal — Andreas B.',
  purpose:
  'Apeluri de strategie 1-la-1 cu autori și mentori care au deja o ofertă validată.',
  duration: 30,
  location: 'Google Meet',
  type: 'One-on-One',
  days: 'Lun, Mar, Mie, Vin · ore variabile',
  color: '#2f6bff',
  active: true,
  host: 'Andreas Bălan',
  initials: 'AB'
},
{
  id: 'webinar',
  name: 'Calendar webinar — apeluri post-prezentare',
  purpose:
  'Sloturi rezervate participanților la webinar, distribuite automat între closeri.',
  duration: 45,
  location: 'Zoom',
  type: 'Colectiv',
  days: 'Lun – Vin · 10:00 – 18:00',
  color: '#f97316',
  active: true,
  host: 'Echipa de vânzări',
  initials: 'EV',
  members: [
  { name: 'Vlad Ionescu', role: 'Closers', connected: true },
  { name: 'Ana Dumitrescu', role: 'Closers', connected: true },
  { name: 'Sergiu Petrache', role: 'Closers', connected: false },
  { name: 'Bianca Moldovan', role: 'Callers', connected: true },
  { name: 'Rareș Ciobanu', role: 'Callers', connected: false },
  { name: 'Teodora Sava', role: 'Callers', connected: true }]

},
{
  id: 'onboarding',
  name: 'Onboarding clienți noi',
  purpose:
  'Kickoff după semnarea contractului: acces, obiective și plan pe 30 de zile.',
  duration: 60,
  location: 'Google Meet',
  type: 'Grup',
  days: 'Mar, Joi · 11:00 – 16:00',
  color: '#10b981',
  active: true,
  host: 'Departament livrare',
  initials: 'DL'
},
{
  id: 'interviuri',
  name: 'Interviuri closeri & setteri',
  purpose:
  'Probe de apel pentru candidați, cu grilă de evaluare completată live.',
  duration: 30,
  location: 'Zoom',
  type: 'One-on-One',
  days: 'Mie, Joi · 09:00 – 13:00',
  color: '#8b5cf6',
  active: false,
  host: 'Recrutare',
  initials: 'RC'
},
{
  id: 'mentorat',
  name: 'Sesiuni de mentorat lunar',
  purpose:
  'Follow-up recurent cu clienții din programul de mentorat, o dată pe lună.',
  duration: 45,
  location: 'Google Meet',
  type: 'One-on-One',
  days: 'Lun, Vin · 14:00 – 18:00',
  color: '#eab308',
  active: false,
  host: 'Andreas Bălan',
  initials: 'AB'
},
{
  id: 'audit',
  name: 'Audit gratuit de pipeline',
  purpose:
  'Sesiune scurtă de calificare pentru leadurile venite din Ads și recomandări.',
  duration: 15,
  location: 'Telefon',
  type: 'One-on-One',
  days: 'Lun – Vin · 09:00 – 12:00',
  color: '#06b6d4',
  active: false,
  host: 'Echipa de setteri',
  initials: 'ES'
}];


export function slotsForDuration(duration: number) {
  const step = duration <= 15 ? 15 : duration <= 30 ? 30 : 60;
  const slots: string[] = [];
  for (let minutes = 9 * 60; minutes + step <= 18 * 60; minutes += step) {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    slots.push(
      `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
    );
  }
  return slots;
}