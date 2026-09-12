export interface Project {
  id: string;
  name: string;
  client: string;
  owner: string;
  stage: 'Ofertare' | 'Negociere' | 'Implementare' | 'Livrat';
  value: string;
  progress: number;
  due: string;
  tasks: string;
}

export const projects: Project[] = [
{
  id: 'PRJ-1042',
  name: 'Lansare curs „Scale Academy”',
  client: 'Andrei Munteanu',
  owner: 'Andreas B.',
  stage: 'Implementare',
  value: '48.500 €',
  progress: 72,
  due: '12 sep',
  tasks: '14/19 taskuri'
},
{
  id: 'PRJ-1039',
  name: 'Migrare pipeline vânzări',
  client: 'Nova Education',
  owner: 'Radu T.',
  stage: 'Negociere',
  value: '22.000 €',
  progress: 35,
  due: '3 sep',
  tasks: '6/17 taskuri'
},
{
  id: 'PRJ-1036',
  name: 'Campanie Ads Q4',
  client: 'Mentor Lab',
  owner: 'Alexandra V.',
  stage: 'Ofertare',
  value: '11.300 €',
  progress: 12,
  due: '29 aug',
  tasks: '2/11 taskuri'
},
{
  id: 'PRJ-1030',
  name: 'Onboarding echipă closeri',
  client: 'Cristina Dobre',
  owner: 'Mihai S.',
  stage: 'Implementare',
  value: '35.900 €',
  progress: 58,
  due: '18 sep',
  tasks: '9/16 taskuri'
},
{
  id: 'PRJ-1021',
  name: 'Program mentorat B2B',
  client: 'Grup Alpha',
  owner: 'Andreas B.',
  stage: 'Livrat',
  value: '64.200 €',
  progress: 100,
  due: 'Finalizat',
  tasks: '21/21 taskuri'
}];


export interface Automation {
  name: string;
  trigger: string;
  runs: string;
  active: boolean;
}

export const automations: Automation[] = [
{
  name: 'Follow-up după apel de descoperire',
  trigger: 'Lead marcat „Apel finalizat” → email + task la 24h',
  runs: '128 rulări luna aceasta',
  active: true
},
{
  name: 'Reminder factură neplătită',
  trigger: 'Factură scadentă → SMS + notificare owner',
  runs: '34 rulări luna aceasta',
  active: true
},
{
  name: 'Escaladare proiect blocat',
  trigger: 'Fără activitate 7 zile → alertă manager',
  runs: '9 rulări luna aceasta',
  active: false
}];


export interface Reminder {
  time: string;
  title: string;
  meta: string;
  channel: 'Email' | 'SMS' | 'WhatsApp' | 'Intern';
}

export const reminders: Reminder[] = [
{
  time: '09:30',
  title: 'Reminder ofertă — Nova Education',
  meta: 'Trimis automat către Radu T.',
  channel: 'Email'
},
{
  time: '11:00',
  title: 'Apel de reconfirmare, Mentor Lab',
  meta: 'Secvență: 2 din 3',
  channel: 'WhatsApp'
},
{
  time: '14:15',
  title: 'Semnare contract Grup Alpha',
  meta: 'Document trimis prin PandaDoc',
  channel: 'SMS'
},
{
  time: '17:00',
  title: 'Raport săptămânal către client',
  meta: 'Generat din Looker Studio',
  channel: 'Intern'
}];


export interface Integration {
  name: string;
  category: string;
  status: 'Conectat' | 'Disponibil' | 'Necesită atenție';
  detail: string;
}

export const integrations: Integration[] = [
{
  name: 'Gmail & Outlook',
  category: 'Email',
  status: 'Conectat',
  detail: 'Sincronizare bidirecțională a conversațiilor'
},
{
  name: 'Google Calendar',
  category: 'Programări',
  status: 'Conectat',
  detail: 'Sloturi de apel și rezervări automate'
},
{
  name: 'WhatsApp Business',
  category: 'Mesagerie',
  status: 'Conectat',
  detail: 'Șabloane de reminder și conversații live'
},
{
  name: 'Stripe',
  category: 'Facturare',
  status: 'Necesită atenție',
  detail: 'Reînnoiește tokenul de acces (expiră în 3 zile)'
},
{
  name: 'Slack',
  category: 'Notificări',
  status: 'Conectat',
  detail: 'Alerte pipeline pe canalul #vanzari'
},
{
  name: 'Meta Lead Ads',
  category: 'Achiziție',
  status: 'Disponibil',
  detail: 'Import automat de leaduri din campanii'
},
{
  name: 'Zapier & Make',
  category: 'Automatizări',
  status: 'Disponibil',
  detail: 'Peste 5.000 de aplicații conectabile'
},
{
  name: 'SmartBill',
  category: 'Contabilitate',
  status: 'Disponibil',
  detail: 'Emitere automată de facturi la semnare'
}];