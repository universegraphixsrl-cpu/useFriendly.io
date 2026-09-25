import type { Task } from '../data/tasks';
import type { Reminder } from '../data/crm';

/**
 * Reminderele de azi nu sunt o listă separată: sunt pur și simplu
 * task-urile cu termen azi, ordonate după oră. Un cont nou nu are
 * niciunul, iar lista se umple singură pe măsură ce se programează
 * task-uri.
 */

/** Ziua de azi în formatul „2026-09-25” */
function todayIso() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

const MONTHS: Record<string, number> = {
  ian: 1, feb: 2, mar: 3, apr: 4, mai: 5, iun: 6,
  iul: 7, aug: 8, sep: 9, sept: 9, oct: 10, noi: 11, nov: 11, dec: 12
};

/**
 * Deadline-urile sunt scrise de mână, în mai multe forme („2026-09-25”,
 * „25 sep 2026”, „25.09.2026”). Le aducem pe toate la același format.
 */
function deadlineIso(deadline: string) {
  const value = (deadline ?? '').trim();
  if (!value) return '';

  if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);

  const dotted = value.match(/^(\d{1,2})[.\/](\d{1,2})[.\/](\d{4})$/);
  if (dotted) {
    const [, day, month, year] = dotted;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  const parts = value.replace(/\./g, '').split(/\s+/);
  if (parts.length >= 3) {
    const day = Number(parts[0]);
    const month =
    MONTHS[parts[1].toLowerCase().slice(0, 4)] ??
    MONTHS[parts[1].toLowerCase().slice(0, 3)];
    const year = Number(parts[2]);
    if (day && month && year) {
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
  }
  return '';
}

export function remindersFromTasks(tasks: Task[]): Reminder[] {
  const today = todayIso();

  return tasks.
  filter(
    (task) =>
    task.status !== 'Finalizat' && deadlineIso(task.deadline) === today
  ).
  sort((a, b) => (a.time ?? '').localeCompare(b.time ?? '')).
  map((task) => {
    const people = (task.assignees ?? []).map((person) => person.name);
    const waiting =
    task.team && (task.assignees ?? []).some((person) => !person.done);

    return {
      time: task.time || '—',
      title: task.title,
      meta: waiting ?
      `În așteptare · ${people.join(', ')}` :
      people.length ?
      `Alocat către ${people.join(', ')}` :
      task.detail || 'Task personal',
      channel: 'Intern' as const
    };
  });
}
