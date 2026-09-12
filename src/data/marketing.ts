export type FlowStepChannel = 'email' | 'sms';

export interface FlowStep {
  id: string;
  channel: FlowStepChannel;
  /** Câte zile după pasul anterior se trimite */
  delayDays: number;
  /** Ora exactă de trimitere, format 24h */
  sendAt: string;
  subject: string;
  body: string;
}

export interface MarketingFlow {
  id: string;
  name: string;
  audience: string;
  steps: FlowStep[];
  active: boolean;
  sent: number;
  openRate: number;
}

/** Audiențele disponibile ca punct de start al fluxului */
export const flowAudiences = [
'Înscriși webinar',
'Programați book-a-call',
'Oferte trimise',
'Clienți plătitori',
'No-show la apel',
'Toată baza de contacte'];


export const sendHours = [
'07:00',
'08:00',
'09:00',
'10:00',
'11:00',
'12:00',
'14:00',
'16:00',
'18:00',
'19:00',
'20:00',
'21:00'];


export const delayOptions = [
{ value: 0, label: 'Imediat' },
{ value: 1, label: 'După 1 zi' },
{ value: 2, label: 'După 2 zile' },
{ value: 3, label: 'După 3 zile' },
{ value: 5, label: 'După 5 zile' },
{ value: 7, label: 'După 7 zile' },
{ value: 14, label: 'După 14 zile' }];


export const emailTemplate = {
  subject: 'Ce urmează după webinar',
  body: `Salut {{prenume}},

Mulțumesc că ai fost prezent la webinar. Am pregătit pentru tine un plan concret de implementare pentru următoarele 30 de zile.

Dacă vrei să-l parcurgem împreună, rezervă un apel de 30 de minute din linkul de mai jos.

{{link_calendar}}

Andreas Bălan
Friendly`
};

export const smsTemplate = {
  subject: 'Reminder apel',
  body: 'Salut {{prenume}}, apelul nostru e mâine la {{ora}}. Confirmi prezența? {{link_calendar}}'
};

export const marketingFlows: MarketingFlow[] = [
{
  id: 'flow-webinar',
  name: 'Follow-up webinar → book a call',
  audience: 'Înscriși webinar',
  active: true,
  sent: 3450,
  openRate: 47,
  steps: [
  {
    id: 'flow-webinar-1',
    channel: 'email',
    delayDays: 0,
    sendAt: '19:00',
    subject: 'Înregistrarea webinarului + planul de 30 de zile',
    body: 'Salut {{prenume}}, îți las aici înregistrarea și planul discutat.'
  },
  {
    id: 'flow-webinar-2',
    channel: 'sms',
    delayDays: 1,
    sendAt: '11:00',
    subject: 'Reminder apel gratuit',
    body: 'Mai sunt 4 locuri pentru apelurile de strategie de săptămâna asta: {{link_calendar}}'
  },
  {
    id: 'flow-webinar-3',
    channel: 'email',
    delayDays: 3,
    sendAt: '09:00',
    subject: 'Studiu de caz: de la 12k la 46k în 60 de zile',
    body: 'Salut {{prenume}}, uite cum a implementat un client sistemul.'
  }]

},
{
  id: 'flow-noshow',
  name: 'Recuperare no-show',
  audience: 'No-show la apel',
  active: true,
  sent: 283,
  openRate: 61,
  steps: [
  {
    id: 'flow-noshow-1',
    channel: 'sms',
    delayDays: 0,
    sendAt: '18:00',
    subject: 'Ne-am ratat la apel',
    body: 'Salut {{prenume}}, ne-am ratat azi. Reprogramăm? {{link_calendar}}'
  },
  {
    id: 'flow-noshow-2',
    channel: 'email',
    delayDays: 2,
    sendAt: '10:00',
    subject: 'Îți mai țin locul până vineri',
    body: 'Salut {{prenume}}, îți păstrez slotul până vineri.'
  }]

},
{
  id: 'flow-oferta',
  name: 'Ofertă trimisă → 3 remindere',
  audience: 'Oferte trimise',
  active: false,
  sent: 512,
  openRate: 54,
  steps: [
  {
    id: 'flow-oferta-1',
    channel: 'email',
    delayDays: 1,
    sendAt: '09:00',
    subject: 'Ai avut timp să vezi oferta?',
    body: 'Salut {{prenume}}, rămân la dispoziție pentru orice întrebare.'
  },
  {
    id: 'flow-oferta-2',
    channel: 'sms',
    delayDays: 3,
    sendAt: '12:00',
    subject: 'Ultima zi la prețul discutat',
    body: 'Salut {{prenume}}, oferta expiră mâine la ora 18:00.'
  }]

}];