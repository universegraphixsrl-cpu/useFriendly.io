export interface SystemNotification {
  id: string;
  actor: string;
  action: string;
  time: string;
  /** null = vizibilă pentru admin; altfel numele sub-accountului */
  audience: string | null;
}

export interface TeamMessage {
  id: string;
  from: string;
  to: string[];
  text: string;
  time: string;
  /** Cine a deschis deja mesajul */
  readBy: string[];
}

export const systemNotifications: SystemNotification[] = [
{
  id: 'n1',
  actor: 'Vlad Ionescu',
  action: 'a mutat 3 leaduri în „Oferte trimise”',
  time: 'acum 8 min',
  audience: null
},
{
  id: 'n2',
  actor: 'Bianca Moldovan',
  action: 'a finalizat task-ul „Raport apeluri săptămânal”',
  time: 'acum 41 min',
  audience: null
},
{
  id: 'n3',
  actor: 'Ana Dumitrescu',
  action: 'a încasat 2.000 € de la Andrei Marinescu',
  time: 'acum 2 ore',
  audience: null
},
{
  id: 'n4',
  actor: 'Sistem',
  action: 'Factura FRD-2026-08 a fost emisă automat',
  time: 'ieri, 18:20',
  audience: null
},
{
  id: 'n5',
  actor: 'Teodora Sava',
  action: 'și-a conectat calendarul la „Calendar webinar”',
  time: 'ieri, 11:05',
  audience: null
}];


/** Notificări generice pe care le vede orice sub-account */
export const agentNotifications = (name: string): SystemNotification[] => [
{
  id: `${name}-a1`,
  actor: 'Andreas Bălan',
  action: 'ți-a atribuit task-ul „Raport apeluri săptămânal”',
  time: 'acum 20 min',
  audience: name
},
{
  id: `${name}-a2`,
  actor: 'Sistem',
  action: 'Ai primit acces la lista „Programați book-a-call”',
  time: 'acum 3 ore',
  audience: name
},
{
  id: `${name}-a3`,
  actor: 'Sistem',
  action: 'Un lead nou ți-a fost alocat din webinarul de marți',
  time: 'ieri, 16:40',
  audience: name
}];


export const initialMessages: TeamMessage[] = [
{
  id: 'm1',
  from: 'Vlad Ionescu',
  to: ['Andreas Bălan'],
  text: 'Am terminat apelurile de azi, 4 oferte trimise. Revin mâine cu follow-up.',
  time: 'acum 35 min',
  readBy: []
},
{
  id: 'm2',
  from: 'Andreas Bălan',
  to: ['Bianca Moldovan', 'Rareș Ciobanu'],
  text: 'Băieți, prioritate azi pe no-show-urile de la webinarul de marți.',
  time: 'ieri, 09:15',
  readBy: ['Bianca Moldovan', 'Rareș Ciobanu']
}];