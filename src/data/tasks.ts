export type TaskStatus =
'Finalizat' |
'În lucru' |
'Deadline ratat' |
'Urmează să înceapă';

export type Recurrence =
'Nu se repetă' |
'Zilnic' |
'Săptămânal' |
'La 2 săptămâni' |
'Lunar' |
'Trimestrial';

export interface TaskCategory {
  id: string;
  name: string;
  color: string;
}

export const categoryColors = [
'#2f6bff',
'#0ea5e9',
'#06b6d4',
'#14b8a6',
'#10b981',
'#22c55e',
'#84cc16',
'#eab308',
'#f59e0b',
'#f97316',
'#ef4444',
'#ec4899',
'#d946ef',
'#8b5cf6',
'#64748b'];


export const initialCategories: TaskCategory[] = [
{ id: 'cat-vanzari', name: 'Vânzări', color: '#2f6bff' },
{ id: 'cat-financiar', name: 'Financiar', color: '#f59e0b' },
{ id: 'cat-echipa', name: 'Echipă', color: '#10b981' },
{ id: 'cat-strategie', name: 'Strategie', color: '#8b5cf6' }];


export interface TaskAssignee {
  name: string;
  role: string;
  /** true = membrul a marcat task-ul ca executat din contul lui */
  done: boolean;
}

export interface Task {
  id: string;
  categoryId: string;
  title: string;
  detail: string;
  deadline: string;
  time: string;
  status: TaskStatus;
  alarm: boolean;
  /** null = utilizatorul nu a ales încă o recurență */
  recurrence: Recurrence | null;
  recurrenceTime: string;
  /** Task de echipă: statusul e controlat de fiecare sub-account */
  team?: boolean;
  assignees?: TaskAssignee[];
  /** Sub-accountul care și-a creat singur task-ul (invizibil pentru admin) */
  owner?: string;
  /** Task de echipă primit azi — apare la „Task-uri noi” */
  assignedToday?: boolean;
}

export const recurrenceOptions: Recurrence[] = [
'Nu se repetă',
'Zilnic',
'Săptămânal',
'La 2 săptămâni',
'Lunar',
'Trimestrial'];


export const timeSlots = [
'07:00',
'07:30',
'08:00',
'08:30',
'09:00',
'09:30',
'10:00',
'10:30',
'11:00',
'11:30',
'12:00',
'12:30',
'13:00',
'13:30',
'14:00',
'14:30',
'15:00',
'15:30',
'16:00',
'16:30',
'17:00',
'17:30',
'18:00',
'18:30',
'19:00',
'19:30',
'20:00'];


export const taskStatuses: TaskStatus[] = [
'Urmează să înceapă',
'În lucru',
'Finalizat',
'Deadline ratat'];


export const initialTasks: Task[] = [
{
  id: 'task-1',
  categoryId: 'cat-vanzari',
  title: 'Negociază contractul de parteneriat cu Seeding English',
  detail: 'Ultima rundă pe comision și exclusivitate teritorială',
  deadline: '26 august',
  time: '11:00',
  status: 'În lucru',
  alarm: true,
  recurrence: null,
  recurrenceTime: '09:00'
},
{
  id: 'task-2',
  categoryId: 'cat-financiar',
  title: 'Aprobă bugetul de Ads pentru septembrie',
  detail: '18.000 € împărțiți pe Meta, Google și YouTube',
  deadline: '28 august',
  time: '09:00',
  status: 'Urmează să înceapă',
  alarm: true,
  recurrence: 'Lunar',
  recurrenceTime: '09:00'
},
{
  id: 'task-3',
  categoryId: 'cat-echipa',
  title: 'Interviuri finale pentru 2 closeri seniori',
  detail: '4 candidați, probă de apel înregistrată',
  deadline: '25 august',
  time: '15:30',
  status: 'În lucru',
  alarm: false,
  recurrence: 'Nu se repetă',
  recurrenceTime: '09:00'
},
{
  id: 'task-4',
  categoryId: 'cat-financiar',
  title: 'Trimite raportul financiar către contabilitate',
  detail: 'Facturi, avansuri și rate încasate în august',
  deadline: '20 august',
  time: '18:00',
  status: 'Deadline ratat',
  alarm: true,
  recurrence: 'Lunar',
  recurrenceTime: '18:00'
},
{
  id: 'task-team-1',
  categoryId: 'cat-echipa',
  title: 'Completează raportul de apeluri din săptămâna curentă',
  detail:
  'Fiecare agent trece rezultatele apelurilor în CRM și marchează task-ul ca finalizat.',
  deadline: '27 august',
  time: '18:00',
  status: 'În lucru',
  alarm: true,
  recurrence: 'Săptămânal',
  recurrenceTime: '18:00',
  team: true,
  assignedToday: true,
  assignees: [
  { name: 'Vlad Ionescu', role: 'Closers', done: true },
  { name: 'Ana Dumitrescu', role: 'Closers', done: true },
  { name: 'Sergiu Petrache', role: 'Closers', done: false },
  { name: 'Bianca Moldovan', role: 'Callers', done: true },
  { name: 'Rareș Ciobanu', role: 'Callers', done: false },
  { name: 'Teodora Sava', role: 'Callers', done: true },
  { name: 'Cristian Barbu', role: 'Managers', done: false },
  { name: 'Larisa Neagu', role: 'Managers', done: false },
  { name: 'Paul Grigore', role: 'Marketers', done: false },
  { name: 'Miruna Oprea', role: 'Marketers', done: false }]

},
{
  id: 'task-5',
  categoryId: 'cat-strategie',
  title: 'Ședință de strategie cu echipa de vânzări',
  detail: 'Targeturi Q4 și noul script de closing',
  deadline: '19 august',
  time: '10:00',
  status: 'Finalizat',
  alarm: false,
  recurrence: 'Săptămânal',
  recurrenceTime: '10:00'
}];