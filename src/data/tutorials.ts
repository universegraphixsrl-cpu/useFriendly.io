export interface Tutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  level: 'Începător' | 'Intermediar' | 'Avansat';
}

export const tutorialCategories = [
'Primii pași',
'Leads & Clients',
'Calendar',
'Task-uri',
'Automatizări',
'Marketing',
'Plăți',
'Echipă',
'Rapoarte'] as
const;

export const tutorials: Tutorial[] = [
{
  id: 't1',
  title: 'Bun venit în Friendly',
  description:
  'Tur complet al interfeței: meniul din stânga, panoul general și bara de sus.',
  duration: '3:41',
  category: 'Primii pași',
  level: 'Începător'
},
{
  id: 't2',
  title: 'Cum îți configurezi contul și compania',
  description:
  'Poză de profil, logo, date de facturare și regula de schimbare a numelui.',
  duration: '4:12',
  category: 'Primii pași',
  level: 'Începător'
},
{
  id: 't3',
  title: 'Adaugă module noi în meniu',
  description:
  'Catalogul cu 50 de module și cum alegi doar ce ai nevoie pentru echipa ta.',
  duration: '2:58',
  category: 'Primii pași',
  level: 'Începător'
},
{
  id: 't4',
  title: 'Tema întunecată și personalizarea interfeței',
  description: 'Comută pe dark mode și adaptează CRM-ul la modul tău de lucru.',
  duration: '1:47',
  category: 'Primii pași',
  level: 'Începător'
},
{
  id: 't5',
  title: 'Creează prima listă de leaduri',
  description: 'Nume, descriere, culoare și cine din echipă are acces la ea.',
  duration: '5:03',
  category: 'Leads & Clients',
  level: 'Începător'
},
{
  id: 't6',
  title: 'Fișa completă a clientului',
  description:
  'Responsabil, status, telefon, email, linkuri Vocaroo și Zoom, detalii.',
  duration: '6:24',
  category: 'Leads & Clients',
  level: 'Intermediar'
},
{
  id: 't7',
  title: 'Statusuri personalizate pentru leaduri',
  description:
  'Adaugă statusuri proprii peste cele presetate și filtrează instant după ele.',
  duration: '3:16',
  category: 'Leads & Clients',
  level: 'Intermediar'
},
{
  id: 't8',
  title: 'Documente atașate și facturare automată',
  description:
  'Încarcă PDF-uri prin drag & drop și emite factura automat la statusul Semnat.',
  duration: '4:39',
  category: 'Leads & Clients',
  level: 'Intermediar'
},
{
  id: 't9',
  title: 'Plăți parțiale și suma totală încasată',
  description: 'Adaugă tranșe pe același client și urmărește totalul în tabel.',
  duration: '3:52',
  category: 'Leads & Clients',
  level: 'Intermediar'
},
{
  id: 't10',
  title: 'Indexează listele pe care nu le mai folosești',
  description:
  'Curăță spațiul de lucru fără să pierzi datele și ce văd agenții după indexare.',
  duration: '2:29',
  category: 'Leads & Clients',
  level: 'Avansat'
},
{
  id: 't11',
  title: 'Primul tău calendar de rezervări',
  description: 'Durată, buffer, culoare și pagina publică de booking.',
  duration: '5:47',
  category: 'Calendar',
  level: 'Începător'
},
{
  id: 't12',
  title: 'Team calendar pentru toată echipa',
  description:
  'Invită sub-accounts, vezi cine s-a conectat și distribuie apelurile.',
  duration: '6:08',
  category: 'Calendar',
  level: 'Intermediar'
},
{
  id: 't13',
  title: 'Setează disponibilitatea pe zile și ore',
  description:
  'Cum se preia disponibilitatea agenților în calendarele de echipă.',
  duration: '4:20',
  category: 'Calendar',
  level: 'Intermediar'
},
{
  id: 't14',
  title: 'Sincronizarea cu Google Calendar și Zoom',
  description:
  'Alege în ce calendar Google intră programările și generează linkul de Zoom.',
  duration: '3:34',
  category: 'Calendar',
  level: 'Intermediar'
},
{
  id: 't15',
  title: 'Vezi toate programările într-un singur loc',
  description:
  'Filtrează pe zi, pe sub-account sau pe calendar și deschide fișa clientului.',
  duration: '4:55',
  category: 'Calendar',
  level: 'Avansat'
},
{
  id: 't16',
  title: 'Task-uri cu deadline și alarmă',
  description: 'Mini-calendarul de deadline, ora și clopoțelul de reminder.',
  duration: '3:27',
  category: 'Task-uri',
  level: 'Începător'
},
{
  id: 't17',
  title: 'Task-uri recurente, corect configurate',
  description: 'Zilnic, săptămânal sau lunar — și de ce dispare deadline-ul.',
  duration: '2:51',
  category: 'Task-uri',
  level: 'Începător'
},
{
  id: 't18',
  title: 'Categorii de task-uri și codul de culori',
  description: 'Organizează munca echipei pe categorii cu bandă colorată.',
  duration: '3:09',
  category: 'Task-uri',
  level: 'Intermediar'
},
{
  id: 't19',
  title: 'Team task: atribuie muncă întregii echipe',
  description:
  'Trimite un task către o categorie sau persoane alese și vezi cine l-a finalizat.',
  duration: '5:31',
  category: 'Task-uri',
  level: 'Avansat'
},
{
  id: 't20',
  title: 'Primul flux de automatizare',
  description: 'Declanșator, condiție și acțiuni — logica din spatele fluxului.',
  duration: '7:02',
  category: 'Automatizări',
  level: 'Începător'
},
{
  id: 't21',
  title: 'Șabloane gata de pornit',
  description:
  'Lead nou → apel în 15 minute, no-show → reprogramare, plată → factură.',
  duration: '4:44',
  category: 'Automatizări',
  level: 'Intermediar'
},
{
  id: 't22',
  title: 'Citește jurnalul de rulări și repară erorile',
  description: 'Cum interpretezi stările succes, în curs și eroare.',
  duration: '3:58',
  category: 'Automatizări',
  level: 'Avansat'
},
{
  id: 't23',
  title: 'Construiește un funnel de marketing',
  description: 'Audiență, pași de email și SMS, întârzieri și ore de trimitere.',
  duration: '8:15',
  category: 'Marketing',
  level: 'Începător'
},
{
  id: 't24',
  title: 'Scrie emailuri care se deschid',
  description: 'Subiect, structură și variabile dinamice în editorul de mesaje.',
  duration: '6:37',
  category: 'Marketing',
  level: 'Intermediar'
},
{
  id: 't25',
  title: 'SMS-uri scurte cu rată mare de răspuns',
  description: 'Limita de 160 de caractere și momentul potrivit al trimiterii.',
  duration: '3:22',
  category: 'Marketing',
  level: 'Intermediar'
},
{
  id: 't26',
  title: 'Creează un link de plată reutilizabil',
  description: 'Produs, preț, monedă și câmpurile completate de client.',
  duration: '5:12',
  category: 'Plăți',
  level: 'Începător'
},
{
  id: 't27',
  title: 'Plăți recurente personalizate',
  description: 'Sumă, frecvență și unitate: zile, săptămâni sau luni.',
  duration: '4:06',
  category: 'Plăți',
  level: 'Intermediar'
},
{
  id: 't28',
  title: 'Produse și codul lor de culoare',
  description: 'Creează produse o singură dată și refolosește-le pe orice link.',
  duration: '3:44',
  category: 'Plăți',
  level: 'Intermediar'
},
{
  id: 't29',
  title: 'Creează și gestionează sub-accounts',
  description: 'Categorii, invitații, status Pending și limita pachetului tău.',
  duration: '6:49',
  category: 'Echipă',
  level: 'Începător'
},
{
  id: 't30',
  title: 'Permisiuni: cine ce poate vedea și edita',
  description: 'Acces pe liste, calendare și materiale — și ce se întâmplă la retragere.',
  duration: '7:26',
  category: 'Echipă',
  level: 'Avansat'
},
{
  id: 't31',
  title: 'Materiale & proceduri pentru onboarding',
  description: 'Module, lecții video, suport scris și resurse atașate.',
  duration: '6:03',
  category: 'Echipă',
  level: 'Intermediar'
},
{
  id: 't32',
  title: 'Citește corect rapoartele de vânzări',
  description:
  'Sumă încasată, closing rate, show-up rate și comparația cu luna trecută.',
  duration: '7:58',
  category: 'Rapoarte',
  level: 'Intermediar'
},
{
  id: 't33',
  title: 'Perioade personalizate în rapoarte',
  description: 'Zile, săptămâni sau interval custom, cu gruparea potrivită.',
  duration: '3:31',
  category: 'Rapoarte',
  level: 'Avansat'
}];