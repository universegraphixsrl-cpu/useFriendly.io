export type IntegrationStatus =
'Conectat' |
'Disponibil' |
'Necesită atenție';

export interface CatalogIntegration {
  name: string;
  category: string;
  detail: string;
  status: IntegrationStatus;
  /** Integrare standard, conectată din start și care nu poate fi deconectată */
  standard?: boolean;
}

export const integrationCatalog: CatalogIntegration[] = [
{
  name: 'Make',
  category: 'Automatizări',
  detail:
  'Integrare standard, activă din start: fiecare scenariu din CRM rulează prin Make.',
  status: 'Conectat',
  standard: true
},
{
  name: 'Gmail & Outlook',
  category: 'Email',
  detail: 'Sincronizare bidirecțională a conversațiilor cu leadurile.',
  status: 'Conectat'
},
{
  name: 'Google Calendar',
  category: 'Programări',
  detail: 'Sloturi de apel și rezervări automate în calendarul echipei.',
  status: 'Conectat'
},
{
  name: 'WhatsApp Business',
  category: 'Mesagerie',
  detail: 'Șabloane de reminder și conversații live din fișa contactului.',
  status: 'Conectat'
},
{
  name: 'Slack',
  category: 'Notificări',
  detail: 'Alerte de pipeline și vânzări noi pe canalul #vanzari.',
  status: 'Conectat'
},
{
  name: 'Stripe',
  category: 'Plăți',
  detail: 'Reînnoiește tokenul de acces (expiră în 3 zile).',
  status: 'Necesită atenție'
},
{
  name: 'Zoom',
  category: 'Apeluri video',
  detail: 'Link generat automat pentru fiecare programare confirmată.',
  status: 'Conectat'
},
{
  name: 'Meta Lead Ads',
  category: 'Achiziție',
  detail: 'Import automat de leaduri din campaniile Facebook și Instagram.',
  status: 'Disponibil'
},
{
  name: 'Google Ads',
  category: 'Achiziție',
  detail: 'Trimite conversiile offline înapoi în campanii.',
  status: 'Disponibil'
},
{
  name: 'TikTok Lead Gen',
  category: 'Achiziție',
  detail: 'Formulare TikTok conectate direct la pipeline.',
  status: 'Disponibil'
},
{
  name: 'SmartBill',
  category: 'Contabilitate',
  detail: 'Emitere automată de facturi la semnarea contractului.',
  status: 'Disponibil'
},
{
  name: 'Oblio',
  category: 'Contabilitate',
  detail: 'Alternativă de facturare, sincronizată cu încasările.',
  status: 'Disponibil'
},
{
  name: 'Zapier',
  category: 'Automatizări',
  detail: 'Peste 5.000 de aplicații conectabile fără cod.',
  status: 'Disponibil'
},
{
  name: 'Twilio',
  category: 'Telefonie',
  detail: 'Apeluri și SMS-uri din CRM, cu înregistrare atașată la lead.',
  status: 'Disponibil'
},
{
  name: 'ActiveCampaign',
  category: 'Email marketing',
  detail: 'Secvențe de nurturing declanșate de stadiul din pipeline.',
  status: 'Disponibil'
},
{
  name: 'Mailchimp',
  category: 'Email marketing',
  detail: 'Sincronizare de audiențe și campanii pentru liste segmentate.',
  status: 'Disponibil'
},
{
  name: 'Google Sheets',
  category: 'Date',
  detail: 'Export live al rapoartelor de vânzări într-un spreadsheet.',
  status: 'Disponibil'
},
{
  name: 'Notion',
  category: 'Documentație',
  detail: 'Fișe de client și procese sincronizate cu baza de cunoștințe.',
  status: 'Disponibil'
},
{
  name: 'Google Drive',
  category: 'Fișiere',
  detail: 'Contracte și materiale atașate automat la fiecare proiect.',
  status: 'Disponibil'
},
{
  name: 'Looker Studio',
  category: 'Raportare',
  detail: 'Dashboarduri externe alimentate cu datele din CRM.',
  status: 'Disponibil'
}];