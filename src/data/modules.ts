export interface CrmModule {
  emoji: string;
  name: string;
  description: string;
  category: 'Vânzări' | 'Marketing' | 'Livrare' | 'Financiar' | 'Echipă' | 'Date';
  badge?: 'Popular' | 'Nou';
}

export const crmModules: CrmModule[] = [
{
  emoji: '📅',
  name: 'Calendar & rezervări',
  description: 'Pagină publică de booking, sloturi și reprogramări.',
  category: 'Vânzări',
  badge: 'Popular'
},
{
  emoji: '⚡',
  name: 'Automatizări',
  description: 'Declanșatori, condiții și acțiuni pe fiecare etapă.',
  category: 'Vânzări',
  badge: 'Popular'
},
{
  emoji: '📊',
  name: 'Rapoarte vânzări',
  description: 'Încasări, closing rate și performanța agenților.',
  category: 'Date',
  badge: 'Popular'
},
{
  emoji: '🔔',
  name: 'Centru de remindere',
  description: 'Secvențe pe email, SMS și WhatsApp.',
  category: 'Vânzări'
},
{
  emoji: '📞',
  name: 'Dialer & jurnal apeluri',
  description: 'Sună din CRM, cu notițe și înregistrare.',
  category: 'Vânzări'
},
{
  emoji: '🎯',
  name: 'Scoring leaduri',
  description: 'Punctaj automat după buget, sursă și implicare.',
  category: 'Vânzări'
},
{
  emoji: '🧲',
  name: 'Captare leaduri',
  description: 'Formulare și landing pages conectate la pipeline.',
  category: 'Marketing'
},
{
  emoji: '🎥',
  name: 'Webinarii',
  description: 'Înscrieri, prezență și book-a-call rate.',
  category: 'Marketing',
  badge: 'Popular'
},
{
  emoji: '📨',
  name: 'Email marketing',
  description: 'Campanii, segmente și A/B testing pe subiect.',
  category: 'Marketing'
},
{
  emoji: '💬',
  name: 'Inbox WhatsApp',
  description: 'Conversații live, șabloane și atribuire pe agent.',
  category: 'Marketing'
},
{
  emoji: '📲',
  name: 'Campanii SMS',
  description: 'Trimiteri în masă și răspunsuri automate.',
  category: 'Marketing'
},
{
  emoji: '🧮',
  name: 'Configurator de ofertă',
  description: 'Construiește pachete și prețuri în timpul apelului.',
  category: 'Vânzări'
},
{
  emoji: '✍️',
  name: 'Semnături electronice',
  description: 'Contracte trimise și semnate direct din CRM.',
  category: 'Financiar'
},
{
  emoji: '🧾',
  name: 'Facturare automată',
  description: 'Emitere la semnare, cu serii și TVA corect.',
  category: 'Financiar'
},
{
  emoji: '💳',
  name: 'Plăți & rate',
  description: 'Linkuri de plată, avansuri și grafice de rate.',
  category: 'Financiar',
  badge: 'Popular'
},
{
  emoji: '⏰',
  name: 'Recuperare restanțe',
  description: 'Secvență pe 3 pași pentru facturi neîncasate.',
  category: 'Financiar'
},
{
  emoji: '📈',
  name: 'Prognoză venituri',
  description: 'Estimări pe baza pipeline-ului și a ratei de închidere.',
  category: 'Date'
},
{
  emoji: '🧭',
  name: 'Pipeline multiplu',
  description: 'Fluxuri separate pentru fiecare linie de business.',
  category: 'Vânzări'
},
{
  emoji: '🗂️',
  name: 'Șabloane de proiect',
  description: 'Deschide proiecte noi cu taskuri prestabilite.',
  category: 'Livrare'
},
{
  emoji: '✅',
  name: 'Taskuri & checklist',
  description: 'Responsabili, termene și dependențe între pași.',
  category: 'Livrare'
},
{
  emoji: '🚀',
  name: 'Onboarding clienți',
  description: 'Kickoff, formulare de brief și acces la resurse.',
  category: 'Livrare',
  badge: 'Popular'
},
{
  emoji: '🎓',
  name: 'Acces la cursuri',
  description: 'Livrare automată a modulelor după plată.',
  category: 'Livrare'
},
{
  emoji: '🧑‍🏫',
  name: 'Sesiuni de mentorat',
  description: 'Programare recurentă și istoric pe fiecare client.',
  category: 'Livrare'
},
{
  emoji: '📝',
  name: 'Notițe de apel cu AI',
  description: 'Transcriere, rezumat și pașii următori.',
  category: 'Vânzări',
  badge: 'Nou'
},
{
  emoji: '🎧',
  name: 'Audit apeluri',
  description: 'Grilă de evaluare și feedback pentru closeri.',
  category: 'Echipă'
},
{
  emoji: '🏆',
  name: 'Clasament echipă',
  description: 'Leaderboard live pe încasări și show-up rate.',
  category: 'Echipă'
},
{
  emoji: '💰',
  name: 'Comisioane',
  description: 'Calcul automat pe praguri și tipuri de plată.',
  category: 'Echipă',
  badge: 'Popular'
},
{
  emoji: '📋',
  name: 'Obiective & KPI',
  description: 'Targeturi lunare pe agent, cu urmărire zilnică.',
  category: 'Echipă'
},
{
  emoji: '🧑‍💼',
  name: 'Recrutare closeri',
  description: 'Pipeline de candidați, probe și interviuri.',
  category: 'Echipă'
},
{
  emoji: '🕹️',
  name: 'Simulator de obiecții',
  description: 'Antrenament pe scenarii reale, cu scor.',
  category: 'Echipă',
  badge: 'Nou'
},
{
  emoji: '📚',
  name: 'Bibliotecă de scripturi',
  description: 'Scripturi de apel versionate, pe ofertă.',
  category: 'Echipă'
},
{
  emoji: '🔄',
  name: 'Reactivare leaduri reci',
  description: 'Readuce în pipeline contactele fără răspuns.',
  category: 'Marketing'
},
{
  emoji: '🎁',
  name: 'Program de recomandări',
  description: 'Linkuri, recompense și urmărirea referralurilor.',
  category: 'Marketing'
},
{
  emoji: '⭐',
  name: 'Testimoniale',
  description: 'Cere recenzii automat după livrare.',
  category: 'Livrare'
},
{
  emoji: '🧠',
  name: 'Asistent AI de vânzări',
  description: 'Sugerează următoarea acțiune pe fiecare lead.',
  category: 'Vânzări',
  badge: 'Nou'
},
{
  emoji: '🔍',
  name: 'Deduplicare contacte',
  description: 'Curăță baza și unifică fișele duplicate.',
  category: 'Date'
},
{
  emoji: '🏷️',
  name: 'Etichete & segmente',
  description: 'Grupează contactele după comportament.',
  category: 'Date'
},
{
  emoji: '📥',
  name: 'Import & export',
  description: 'CSV, Google Sheets și mapare de câmpuri.',
  category: 'Date'
},
{
  emoji: '🔗',
  name: 'Webhooks & API',
  description: 'Conectează orice aplicație externă.',
  category: 'Date'
},
{
  emoji: '🧩',
  name: 'Câmpuri personalizate',
  description: 'Adaptează fișele de lead la procesul tău.',
  category: 'Date'
},
{
  emoji: '📡',
  name: 'Atribuire surse',
  description: 'Vezi ce campanie a generat fiecare vânzare.',
  category: 'Marketing'
},
{
  emoji: '🧪',
  name: 'A/B testing oferte',
  description: 'Compară prețuri și pachete pe grupuri egale.',
  category: 'Marketing'
},
{
  emoji: '🗓️',
  name: 'Disponibilitate echipă',
  description: 'Rotație de sloturi și distribuție echilibrată.',
  category: 'Vânzări'
},
{
  emoji: '🚨',
  name: 'Alerte no-show',
  description: 'Reprogramare automată după apelurile ratate.',
  category: 'Vânzări'
},
{
  emoji: '🔐',
  name: 'Roluri & permisiuni',
  description: 'Cine vede ce, pe echipe și pe proiecte.',
  category: 'Echipă'
},
{
  emoji: '🧯',
  name: 'Escaladări',
  description: 'Semnalează proiectele blocate către manageri.',
  category: 'Livrare'
},
{
  emoji: '🗒️',
  name: 'Rapoarte pentru client',
  description: 'Raport săptămânal generat și trimis automat.',
  category: 'Date'
},
{
  emoji: '📦',
  name: 'Abonamente & reînnoiri',
  description: 'Urmărește retenția și facturarea recurentă.',
  category: 'Financiar'
},
{
  emoji: '🌍',
  name: 'Facturare multi-valută',
  description: 'EUR, RON și USD, cu cursuri actualizate.',
  category: 'Financiar'
},
{
  emoji: '🛡️',
  name: 'Conformitate GDPR',
  description: 'Consimțăminte, retenție și ștergere la cerere.',
  category: 'Date'
}];