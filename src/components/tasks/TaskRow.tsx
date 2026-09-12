import React, { useState } from 'react';
import {
  BellIcon,
  BellOffIcon,
  ChevronDownIcon,
  Trash2Icon,
  CheckIcon,
  LockIcon,
  UsersRoundIcon } from
'lucide-react';
import { taskStatuses, type Task, type TaskStatus } from '../../data/tasks';
import { DeadlinePicker } from './DeadlinePicker';
import { RecurrencePicker } from './RecurrencePicker';

const statusStyles: Record<TaskStatus, string> = {
  Finalizat: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'În lucru': 'bg-brand-50 text-brand-700 border-brand-200',
  'Deadline ratat': 'bg-red-50 text-red-700 border-red-200',
  'Urmează să înceapă': 'bg-slate-100 text-ink-700 border-slate-200'
};

interface TaskRowProps {
  task: Task;
  /** Culoarea categoriei, folosită pe marginea din stânga a cardului */
  accentColor: string;
  editing: boolean;
  onEdit: () => void;
  onStopEditing: () => void;
  onUpdate: (patch: Partial<Task>) => void;
  /** Lipsește când utilizatorul nu are dreptul să șteargă task-ul */
  onDelete?: () => void;
  /** Sub-accountul care privește task-ul */
  viewerName?: string;
  /** Marchează task-ul de echipă ca executat, doar pentru viewer */
  onToggleMine?: () => void;
}

export function TaskRow({
  task,
  accentColor,
  editing,
  onEdit,
  onStopEditing,
  onUpdate,
  onDelete,
  viewerName,
  onToggleMine
}: TaskRowProps) {
  const [statusOpen, setStatusOpen] = useState(false);
  const [assigneesOpen, setAssigneesOpen] = useState(false);
  const doneCount = task.assignees?.filter((item) => item.done).length ?? 0;
  const myDone = Boolean(
    task.assignees?.find((item) => item.name === viewerName)?.done
  );
  const recurring =
  task.recurrence !== null && task.recurrence !== 'Nu se repetă';

  return (
    <li
      className="rounded-2xl border border-l-4 border-slate-200 bg-white p-4 sm:p-5"
      style={{ borderLeftColor: accentColor }}>
      
      <div className="flex flex-wrap items-start gap-4">
        <div className="min-w-[240px] flex-1">
          {editing ?
          <div className="space-y-2">
              <input
              type="text"
              autoFocus
              value={task.title}
              onChange={(event) => onUpdate({ title: event.target.value })}
              placeholder="Titlul task-ului"
              aria-label="Titlul task-ului"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 font-display text-sm font-bold text-ink placeholder:font-normal placeholder:text-ink-500 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100" />
            
              <textarea
              rows={2}
              value={task.detail}
              onChange={(event) => onUpdate({ detail: event.target.value })}
              placeholder="Descriere: context, cifre, cine e implicat…"
              aria-label="Descrierea task-ului"
              className="w-full resize-y rounded-lg border border-slate-200 px-3 py-2 text-xs leading-relaxed text-ink-700 placeholder:text-ink-500 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100" />
            
              <button
              type="button"
              onClick={onStopEditing}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-2.5 py-1.5 text-xs font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600">
              
                <CheckIcon
                className="h-3.5 w-3.5"
                strokeWidth={2.5}
                aria-hidden="true" />
              
                Salvează
              </button>
            </div> :

          <button
            type="button"
            onClick={onEdit}
            className="w-full rounded-lg text-left">
            
              <span
              className={`block font-display text-sm font-bold ${
              task.status === 'Finalizat' ?
              'text-ink-500 line-through' :
              'text-ink'}`
              }>
              
                {task.title || 'Task fără titlu'}
              </span>
              {task.team &&
            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-bold text-brand-700">
                  <UsersRoundIcon className="h-3 w-3" aria-hidden="true" />
                  Team task
                </span>
            }
              <span className="mt-0.5 block whitespace-pre-line text-xs text-ink-500">
                {task.detail || 'Adaugă o descriere'}
              </span>
            </button>
          }
        </div>

        {!recurring &&
        <DeadlinePicker
          deadline={task.deadline}
          time={task.time}
          overdue={task.status === 'Deadline ratat'}
          onChange={(deadline, time) => onUpdate({ deadline, time })} />

        }

        <RecurrencePicker
          recurrence={task.recurrence}
          recurrenceTime={task.recurrenceTime}
          onChange={(recurrence, recurrenceTime) =>
          onUpdate({ recurrence, recurrenceTime })
          } />
        

        <button
          type="button"
          onClick={() => onUpdate({ alarm: !task.alarm })}
          aria-pressed={task.alarm}
          aria-label={task.alarm ? 'Dezactivează alarma' : 'Activează alarma'}
          className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold transition-colors duration-150 ease-out ${
          task.alarm ?
          'border-brand-200 bg-brand-50 text-brand-700 hover:bg-brand-100' :
          'border-slate-200 text-ink-500 hover:bg-slate-50'}`
          }>
          
          {task.alarm ?
          <BellIcon className="h-4 w-4" aria-hidden="true" /> :

          <BellOffIcon className="h-4 w-4" aria-hidden="true" />
          }
          {task.alarm ? 'Alarmă activă' : 'Alarmă inactivă'}
        </button>

        {task.team && onToggleMine ?
        <button
          type="button"
          onClick={onToggleMine}
          aria-pressed={myDone}
          className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold transition-colors duration-150 ease-out ${
          myDone ?
          'border-emerald-200 bg-emerald-50 text-emerald-700' :
          'border-slate-200 bg-white text-ink-700 hover:bg-slate-50'}`
          }>
          
            <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
            {myDone ? 'Finalizat de tine' : 'Marchează ca finalizat'}
          </button> :
        task.team ?
        <span
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-ink-500"
          title="Statusul poate fi schimbat doar de fiecare responsabil">
          
            <LockIcon className="h-3.5 w-3.5" aria-hidden="true" />
            Status setat de agenți
          </span> :

        <div className="relative">
          <button
            type="button"
            onClick={() => setStatusOpen((value) => !value)}
            aria-haspopup="listbox"
            aria-expanded={statusOpen}
            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold transition-colors duration-150 ease-out ${statusStyles[task.status]}`}>
            
            {task.status}
            <ChevronDownIcon className="h-3.5 w-3.5" aria-hidden="true" />
          </button>

          {statusOpen &&
          <>
              <button
              type="button"
              className="fixed inset-0 z-10 cursor-default"
              onClick={() => setStatusOpen(false)}
              tabIndex={-1}
              aria-label="Închide lista de statusuri" />
            
              <ul
              role="listbox"
              aria-label="Alege statusul"
              className="absolute right-0 z-20 mt-2 w-52 rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl">
              
                {taskStatuses.map((status) =>
              <li key={status}>
                    <button
                  type="button"
                  role="option"
                  aria-selected={task.status === status}
                  onClick={() => {
                    onUpdate({ status });
                    setStatusOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm font-semibold transition-colors duration-150 ease-out ${
                  task.status === status ?
                  'bg-brand-50 text-brand-700' :
                  'text-ink-700 hover:bg-slate-50'}`
                  }>
                  
                      <span className="flex-1">{status}</span>
                      {task.status === status &&
                  <CheckIcon
                    className="h-4 w-4 text-brand-600"
                    aria-hidden="true" />

                  }
                    </button>
                  </li>
              )}
              </ul>
            </>
          }
        </div>
        }

        {onDelete &&
        <button
          type="button"
          onClick={onDelete}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-500 transition-colors duration-150 ease-out hover:bg-red-50 hover:text-red-600"
          aria-label={`Șterge task-ul ${task.title || 'nou'}`}>
          
            <Trash2Icon className="h-4 w-4" aria-hidden="true" />
          </button>
        }
      </div>

      {task.team && task.assignees &&
      <div className="mt-3 border-t border-slate-100 pt-3">
          <button
          type="button"
          onClick={() => setAssigneesOpen((value) => !value)}
          aria-expanded={assigneesOpen}
          className="inline-flex items-center gap-2 text-xs font-bold text-ink-700 transition-colors duration-150 ease-out hover:text-brand-600">
          
            <UsersRoundIcon className="h-3.5 w-3.5" aria-hidden="true" />
            Responsabili · {doneCount}/{task.assignees.length} au finalizat
            <ChevronDownIcon
            className={`h-3.5 w-3.5 transition-transform duration-150 ease-out ${assigneesOpen ? 'rotate-180' : ''}`}
            aria-hidden="true" />
          
          </button>

          {assigneesOpen &&
        <ul className="mt-2 grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
              {task.assignees.map((assignee) =>
          <li
            key={assignee.name}
            className="flex items-center gap-2 rounded-lg bg-slate-50 px-2.5 py-1.5">
            
                  <span
              className={`h-2 w-2 shrink-0 rounded-full ${assignee.done ? 'bg-emerald-500' : 'bg-slate-300'}`}
              aria-hidden="true" />
            
                  <span className="flex-1 truncate text-xs font-semibold text-ink-700">
                    {assignee.name}
                  </span>
                  <span className="text-[11px] font-semibold text-ink-500">
                    {assignee.done ? 'Finalizat' : 'În lucru'}
                  </span>
                </li>
          )}
            </ul>
        }
        </div>
      }
    </li>);

}