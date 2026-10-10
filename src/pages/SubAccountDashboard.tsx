import React from 'react';
import {
  PhoneCallIcon,
  CalendarCheckIcon,
  CheckSquareIcon,
  TrophyIcon,
  FlameIcon } from
'lucide-react';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { personStats } from '../lib/reportsFromLeads';


interface SubAccountDashboardProps {
  name: string;
  role: string;
}

const ICONS = {
  calls: PhoneCallIcon,
  bookings: CalendarCheckIcon,
  tasks: CheckSquareIcon,
  contracts: TrophyIcon
};

/** Data de azi, ca „2026-10-10” */
const todayIso = () => new Date().toISOString().slice(0, 10);

/** Luni-ul săptămânii curente și duminica ei, ca text ISO */
function weekBounds() {
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return {
    from: monday.toISOString().slice(0, 10),
    to: sunday.toISOString().slice(0, 10)
  };
}

export function SubAccountDashboard({ name, role }: SubAccountDashboardProps) {
  const {
    newTasksFor,
    lists,
    courses,
    calendars,
    leads,
    tasks,
    bookings,
    openTasksFor
  } = useWorkspace();
  const firstName = name.split(' ')[0];
  const newTasks = newTasksFor(name);
  const myLists = lists.filter(
    (list) => list.access.includes(name) && !list.indexed
  );
  const myCourses = courses.filter((course) => course.access.includes(name));
  const myCalendars = calendars.filter(
    (calendar) =>
    calendar.owner === name ||
    calendar.members?.some((member) => member.name === name)
  );

  /**
   * Toate cifrele de mai jos vin din ce există în cont. Pe un cont nou
   * sunt zero — și asta e informația corectă, nu „7 apeluri azi”.
   */
  const me = personStats(leads, name);
  const today = todayIso();
  const week = weekBounds();

  const myBookings = bookings.filter((booking) => booking.owner === name);
  const bookingsToday = myBookings.filter((booking) => booking.date === today);
  const bookingsThisWeek = myBookings.filter(
    (booking) => booking.date >= week.from && booking.date <= week.to
  );
  const openTasks = openTasksFor(name);
  const tasksToday = tasks.filter(
    (task) =>
    task.status !== 'Finalizat' && (
    task.owner === name ||
    task.assignees?.some((member) => member.name === name && !member.done))
  );

  /** Leaduri care îi revin și n-au fost încă atinse */
  const untouched = me.mine.filter(
    (lead) => lead.status === 'Înscris webinar' || lead.status === 'Nu a răspuns'
  );

  const stats = [
  {
    label: 'Programări azi',
    value: String(bookingsToday.length),
    icon: ICONS.calls,
    note: bookingsToday.length === 0 ? 'nimic programat azi' : 'în calendarul tău'
  },
  {
    label: 'Programări săptămâna asta',
    value: String(bookingsThisWeek.length),
    icon: ICONS.bookings,
    note: `${bookingsToday.length} dintre ele azi`
  },
  {
    label: 'Task-uri deschise',
    value: String(openTasks),
    icon: ICONS.tasks,
    note: openTasks === 0 ? 'nimic de făcut' : 'nefinalizate'
  },
  {
    label: 'Contracte luna asta',
    value: String(me.signedThisMonth.length),
    icon: ICONS.contracts,
    note:
    me.signed.length === me.signedThisMonth.length ?
    'de când ai cont' :
    `${me.signed.length} în total`
  }];


  return (
    <>
      <div>
        <p className="text-sm font-semibold text-brand-600">{role}</p>
        <h1 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          Salut, {firstName} 👋
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-ink-700">
          Cafeaua e băută, CRM-ul e deschis, scuzele s-au terminat. Hai să
          transformăm lista de mai jos în contracte.
        </p>
      </div>

      <dl className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) =>
        <div
          key={stat.label}
          className="rounded-2xl border border-slate-200 bg-white p-5">
          
            <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-ink-500">
              <stat.icon className="h-4 w-4" aria-hidden="true" />
              {stat.label}
            </dt>
            <dd className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink">
              {stat.value}
            </dd>
            <p className="mt-1 text-xs text-ink-500">{stat.note}</p>
          </div>
        )}
      </dl>

      <div className="mt-6 rounded-2xl bg-ink p-6 text-white sm:p-7">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-white/60">
          <FlameIcon className="h-4 w-4" aria-hidden="true" />
          Obiectivul zilei
        </p>
        <p className="mt-2 max-w-2xl font-display text-xl font-extrabold tracking-tight sm:text-2xl">
          {bookingsToday.length > 0 ?
          `${bookingsToday.length} ${bookingsToday.length === 1 ? 'programare' : 'programări'} azi și zero leaduri lăsate fără follow-up.` :
          untouched.length > 0 ?
          `${untouched.length} ${untouched.length === 1 ? 'lead' : 'leaduri'} care te așteaptă.` :
          'Nimic urgent azi.'}
        </p>
        <p className="mt-2 text-sm text-white/70">
          Ai {newTasks.length} task-uri noi primite azi, acces la{' '}
          {myLists.length} liste de leaduri, {myCalendars.length} calendare și{' '}
          {myCourses.length} materiale de studiu.
        </p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-display text-base font-extrabold tracking-tight text-ink">
            Ce te așteaptă azi
          </h2>
          <ul className="mt-3 space-y-2.5 text-sm text-ink-700">
            {bookingsToday.length === 0 &&
            tasksToday.length === 0 &&
            untouched.length === 0 &&
            <li className="text-ink-500">
                Nimic programat. Pe măsură ce primești leaduri, task-uri și
                programări, apar aici.
              </li>
            }
            {bookingsToday.map((booking) =>
            <li key={booking.id} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                Apel cu {booking.leadName || 'un lead'} la {booking.time}.
              </li>
            )}
            {untouched.length > 0 &&
            <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                {untouched.length}{' '}
                {untouched.length === 1 ? 'lead nu a fost sunat' : 'leaduri n-au fost sunate'}{' '}
                încă.
              </li>
            }
            {tasksToday.slice(0, 3).map((task) =>
            <li key={task.id} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                {task.title}
              </li>
            )}
          </ul>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-display text-base font-extrabold tracking-tight text-ink">
            Cifrele tale, pe scurt
          </h2>
          <ul className="mt-3 space-y-3 text-sm">
            <li className="flex items-center justify-between gap-3">
              <span className="text-ink-700">Show-up rate</span>
              <span className="font-display font-bold text-ink">
                {me.scheduled.length === 0 ? '—' : `${me.showUp}%`}
              </span>
            </li>
            <li className="flex items-center justify-between gap-3">
              <span className="text-ink-700">Rată de închidere</span>
              <span className="font-display font-bold text-ink">
                {me.attended.length === 0 ? '—' : `${me.closeRate}%`}
              </span>
            </li>
            <li className="flex items-center justify-between gap-3">
              <span className="text-ink-700">Încasat luna asta</span>
              <span className="font-display font-bold text-ink">
                {me.collectedThisMonth.toLocaleString('ro-RO')} €
              </span>
            </li>
            <li className="flex items-center justify-between gap-3">
              <span className="text-ink-700">Leaduri alocate</span>
              <span className="font-display font-bold text-ink">
                {me.mine.length}
              </span>
            </li>
            {me.scheduled.length === 0 &&
            <li className="pt-1 text-xs leading-relaxed text-ink-500">
                Procentele apar după primul apel programat. Până atunci n-ar
                avea din ce să fie calculate.
              </li>
            }
          </ul>
        </section>
      </div>
    </>);

}