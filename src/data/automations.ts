export interface AutomationRule {
  name: string;
  description: string;
  trigger: string;
  condition: string;
  actions: string[];
  runs: number;
  successRate: number;
  lastRun: string;
  category: 'Vânzări' | 'Facturare' | 'Onboarding' | 'Marketing' | 'Intern';
  active: boolean;
}

export const automationRules: AutomationRule[] = [
{
  name: 'Follow-up automat după apelul de descoperire',
  description:
  'Trimite rezumatul apelului, oferta și un task de recontactare la 24 de ore.',
  trigger: 'Apel marcat „Finalizat”',
  condition: 'Dacă statusul lead-ului este „Interesat”',
  actions: ['Trimite email cu oferta', 'Creează task la 24h', 'Notifică closerul'],
  runs: 128,
  successRate: 97,
  lastRun: 'acum 12 min',
  category: 'Vânzări',
  active: true
},
{
  name: 'Reminder factură neîncasată',
  description:
  'Secvență pe 3 pași: reminder amabil, atenționare, escaladare către manager.',
  trigger: 'Factură scadentă de 3 zile',
  condition: 'Dacă plata nu apare în Stripe',
  actions: ['SMS către client', 'Email cu link de plată', 'Alertă în Slack'],
  runs: 34,
  successRate: 91,
  lastRun: 'acum 2 ore',
  category: 'Facturare',
  active: true
},
{
  name: 'Distribuie leadurile din webinar',
  description:
  'Împarte automat participanții către closeri, echilibrat după încărcare.',
  trigger: 'Formular „Book a call” trimis',
  condition: 'Dacă sursa este un webinar din ultimele 7 zile',
  actions: [
  'Atribuie closerul cu cea mai mică încărcare',
  'Programează apel în calendar',
  'Trimite confirmare pe WhatsApp'],

  runs: 410,
  successRate: 99,
  lastRun: 'acum 40 min',
  category: 'Marketing',
  active: true
},
{
  name: 'Onboarding client nou',
  description:
  'Creează proiectul din șablon, invită clientul și pornește checklistul de kickoff.',
  trigger: 'Contract semnat în PandaDoc',
  condition: 'Dacă valoarea contractului depășește 5.000 €',
  actions: [
  'Deschide proiect din șablon',
  'Trimite emailul de bun venit',
  'Programează kickoff la 48h'],

  runs: 21,
  successRate: 100,
  lastRun: 'ieri, 16:20',
  category: 'Onboarding',
  active: true
},
{
  name: 'Escaladare proiect blocat',
  description:
  'Semnalează proiectele fără activitate și cere un plan de deblocare.',
  trigger: 'Fără activitate 7 zile',
  condition: 'Dacă proiectul este în etapa „Implementare”',
  actions: ['Alertă către manager', 'Task de deblocare pentru owner'],
  runs: 9,
  successRate: 88,
  lastRun: 'acum 3 zile',
  category: 'Intern',
  active: false
},
{
  name: 'Reactivare leaduri reci',
  description:
  'Reintroduce în pipeline contactele fără răspuns de peste 30 de zile.',
  trigger: 'Lead inactiv 30 de zile',
  condition: 'Dacă a participat la cel puțin un webinar',
  actions: ['Adaugă în secvența de reactivare', 'Marchează pentru retargeting'],
  runs: 176,
  successRate: 84,
  lastRun: 'acum 5 ore',
  category: 'Marketing',
  active: false
}];


export interface AutomationRecipe {
  title: string;
  description: string;
  badge: string;
}

export const automationRecipes: AutomationRecipe[] = [
{
  title: 'Lead nou → apel programat în 15 minute',
  description: 'Răspuns rapid la formularele de pe landing page.',
  badge: 'Vânzări'
},
{
  title: 'No-show → reprogramare automată',
  description: 'Două încercări de reprogramare, apoi trecere la setter.',
  badge: 'Show-up'
},
{
  title: 'Ofertă trimisă → 3 remindere',
  description: 'La 1, 3 și 7 zile, oprite automat la semnare.',
  badge: 'Follow-up'
},
{
  title: 'Plată încasată → factură + acces curs',
  description: 'Emitere SmartBill și livrare acces în platformă.',
  badge: 'Facturare'
},
{
  title: 'Recenzie după livrare',
  description: 'Cere testimonial la 7 zile de la finalizarea proiectului.',
  badge: 'Retenție'
},
{
  title: 'Raport săptămânal către client',
  description: 'Generează și trimite raportul în fiecare vineri la 17:00.',
  badge: 'Raportare'
}];


export interface AutomationRun {
  time: string;
  rule: string;
  detail: string;
  status: 'Succes' | 'În curs' | 'Eroare';
}

export const automationRuns: AutomationRun[] = [
{
  time: '10:42',
  rule: 'Distribuie leadurile din webinar',
  detail: 'Lead „Alina Marcu” atribuit lui Radu T. · apel pe 26 aug, 11:00',
  status: 'Succes'
},
{
  time: '10:31',
  rule: 'Follow-up după apelul de descoperire',
  detail: 'Email trimis către Mentor Lab · task creat pentru mâine',
  status: 'Succes'
},
{
  time: '09:58',
  rule: 'Reminder factură neîncasată',
  detail: 'SMS către Grup Alpha · plată în așteptare',
  status: 'În curs'
},
{
  time: '09:12',
  rule: 'Onboarding client nou',
  detail: 'Proiect PRJ-1044 creat din șablonul „Lansare curs”',
  status: 'Succes'
},
{
  time: '08:47',
  rule: 'Reminder factură neîncasată',
  detail: 'Tokenul Stripe a expirat · reconectează integrarea',
  status: 'Eroare'
}];