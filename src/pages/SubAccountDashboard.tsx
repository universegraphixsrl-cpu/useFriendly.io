import React from 'react';
import {
  PhoneCallIcon,
  CalendarCheckIcon,
  CheckSquareIcon,
  TrophyIcon,
  FlameIcon } from
'lucide-react';
import { useWorkspace } from '../contexts/WorkspaceContext';

interface SubAccountDashboardProps {
  name: string;
  role: string;
}

const stats = [
{ label: 'Apeluri azi', value: '7', icon: PhoneCallIcon, note: '2 rămase' },
{
  label: 'Programări săptămâna asta',
  value: '14',
  icon: CalendarCheckIcon,
  note: '3 confirmate azi'
},
{
  label: 'Task-uri deschise',
  value: '4',
  icon: CheckSquareIcon,
  note: '1 cu deadline azi'
},
{
  label: 'Contracte luna asta',
  value: '6',
  icon: TrophyIcon,
  note: 'record personal: 8'
}];


export function SubAccountDashboard({ name, role }: SubAccountDashboardProps) {
  const { newTasksFor, lists, courses, calendars } = useWorkspace();
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
          3 apeluri de închidere și zero leaduri lăsate fără follow-up.
        </p>
        <p className="mt-2 text-sm text-white/70">
          Ai {newTasks.length} task-uri noi primite azi de la Andreas, acces la{' '}
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
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
              Apel de închidere cu Cătălina Enea la 11:00 — a cerut plata în 2
              rate.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
              4 leaduri din webinarul de ieri n-au fost sunate încă.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              Trimite recapitularea către clienții semnați săptămâna trecută.
            </li>
          </ul>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-display text-base font-extrabold tracking-tight text-ink">
            Cifrele tale, pe scurt
          </h2>
          <ul className="mt-3 space-y-3 text-sm">
            <li className="flex items-center justify-between gap-3">
              <span className="text-ink-700">Show-up rate</span>
              <span className="font-display font-bold text-ink">72%</span>
            </li>
            <li className="flex items-center justify-between gap-3">
              <span className="text-ink-700">Rată de închidere</span>
              <span className="font-display font-bold text-ink">31%</span>
            </li>
            <li className="flex items-center justify-between gap-3">
              <span className="text-ink-700">Încasat luna asta</span>
              <span className="font-display font-bold text-ink">18.400 €</span>
            </li>
            <li className="flex items-center justify-between gap-3">
              <span className="text-ink-700">Loc în echipă</span>
              <span className="font-display font-bold text-ink">#3 din 10</span>
            </li>
          </ul>
        </section>
      </div>
    </>);

}