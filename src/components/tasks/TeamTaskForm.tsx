import React, { useState } from 'react';
import { XIcon, CheckIcon, UsersRoundIcon, BellRingIcon } from 'lucide-react';
import { subAccounts } from '../../data/subAccounts';
import type { TaskAssignee, TaskCategory } from '../../data/tasks';

type Mode = 'all' | 'role' | 'manual';

interface TeamTaskFormProps {
  categories: TaskCategory[];
  onCreate: (draft: {
    title: string;
    detail: string;
    categoryId: string;
    assignees: TaskAssignee[];
  }) => void;
  onCancel: () => void;
}

const everyone: TaskAssignee[] = subAccounts.flatMap((group) =>
group.members.map((member) => ({
  name: member,
  role: group.role,
  done: false
}))
);

export function TeamTaskForm({
  categories,
  onCreate,
  onCancel
}: TeamTaskFormProps) {
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? '');
  const [mode, setMode] = useState<Mode>('all');
  const [role, setRole] = useState(subAccounts[0].role);
  const [manual, setManual] = useState<string[]>([]);

  const assignees: TaskAssignee[] =
  mode === 'all' ?
  everyone :
  mode === 'role' ?
  everyone.filter((member) => member.role === role) :
  everyone.filter((member) => manual.includes(member.name));

  const toggleManual = (name: string) =>
  setManual((current) =>
  current.includes(name) ?
  current.filter((item) => item !== name) :
  [...current, name]
  );

  const modes: {value: Mode;label: string;hint: string;}[] = [
  { value: 'all', label: 'Toată echipa', hint: `${everyone.length} membri` },
  { value: 'role', label: 'O categorie', hint: 'Ex.: doar Closers' },
  { value: 'manual', label: 'Selectare manuală', hint: 'Alegi persoanele' }];


  return (
    <section
      aria-labelledby="team-task-title"
      className="mt-6 rounded-2xl border border-brand-200 bg-white p-5 sm:p-6">
      
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2
            id="team-task-title"
            className="flex items-center gap-2 font-display text-base font-extrabold tracking-tight text-ink">
            
            <UsersRoundIcon className="h-4 w-4" aria-hidden="true" />
            Creează team task
          </h2>
          <p className="text-xs text-ink-500">
            Apare în task-urile fiecărui responsabil. Statusul îl schimbă doar
            el, tu vezi cine l-a finalizat.
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-500 transition-colors duration-150 ease-out hover:bg-slate-50 hover:text-ink"
          aria-label="Anulează">
          
          <XIcon className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div>
          <label
            htmlFor="teamTaskTitle"
            className="text-xs font-bold uppercase tracking-wide text-ink-500">
            
            Titlu task *
          </label>
          <input
            id="teamTaskTitle"
            type="text"
            autoFocus
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Ex.: Trimite follow-up către leadurile de ieri"
            className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold text-ink placeholder:font-normal placeholder:text-ink-500 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100" />
          
        </div>
        <div>
          <label
            htmlFor="teamTaskDetail"
            className="text-xs font-bold uppercase tracking-wide text-ink-500">
            
            Descriere
          </label>
          <textarea
            id="teamTaskDetail"
            rows={2}
            value={detail}
            onChange={(event) => setDetail(event.target.value)}
            placeholder="Ce trebuie făcut exact și până când?"
            className="mt-1.5 w-full resize-y rounded-lg border border-slate-200 px-3 py-2.5 text-sm leading-relaxed text-ink placeholder:text-ink-500 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100" />
          
        </div>
      </div>

      <div className="mt-4">
        <label
          htmlFor="teamTaskCategory"
          className="text-xs font-bold uppercase tracking-wide text-ink-500">
          
          Categorie
        </label>
        <select
          id="teamTaskCategory"
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
          className="mt-1.5 w-full max-w-sm rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-ink focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100">
          
          {categories.map((category) =>
          <option key={category.id} value={category.id}>
              {category.name}
            </option>
          )}
        </select>
      </div>

      <p className="mt-5 text-[11px] font-bold uppercase tracking-wide text-ink-500">
        Cui îi atribui task-ul?
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {modes.map((option) =>
        <button
          key={option.value}
          type="button"
          onClick={() => setMode(option.value)}
          aria-pressed={mode === option.value}
          className={`rounded-lg border px-3 py-2 text-left text-xs font-bold transition-colors duration-150 ease-out ${
          mode === option.value ?
          'border-brand-300 bg-brand-50 text-brand-700' :
          'border-slate-200 text-ink-700 hover:bg-slate-50'}`
          }>
          
            {option.label}
            <span className="mt-0.5 block text-[11px] font-semibold text-ink-500">
              {option.hint}
            </span>
          </button>
        )}
      </div>

      {mode === 'role' &&
      <div className="mt-3 flex flex-wrap gap-2">
          {subAccounts.map((group) =>
        <button
          key={group.role}
          type="button"
          onClick={() => setRole(group.role)}
          aria-pressed={role === group.role}
          className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors duration-150 ease-out ${
          role === group.role ?
          'border-brand-300 bg-brand-50 text-brand-700' :
          'border-slate-200 text-ink-700 hover:bg-slate-50'}`
          }>
          
              <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: group.color }}
            aria-hidden="true" />
          
              {group.role} · {group.members.length}
            </button>
        )}
        </div>
      }

      {mode === 'manual' &&
      <div className="mt-3 w-72 max-w-full">
          <div className="max-h-80 overflow-y-auto rounded-xl border border-slate-200 bg-white p-3 shadow-2xl">
            <p className="pb-2 text-[11px] font-bold uppercase tracking-wide text-ink-500">
              Sub-accounts active · {everyone.length}
            </p>
            {subAccounts.map((group) =>
          <div key={group.role} className="mb-3 last:mb-0">
                <p className="flex items-center gap-2 pb-1 text-[11px] font-bold uppercase tracking-wide text-ink-500">
                  <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: group.color }}
                aria-hidden="true" />
              
                  {group.role}
                </p>
                {group.members.map((member) => {
              const selected = manual.includes(member);
              return (
                <button
                  key={member}
                  type="button"
                  onClick={() => toggleManual(member)}
                  aria-pressed={selected}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left text-sm font-semibold transition-colors duration-150 ease-out ${
                  selected ?
                  'bg-brand-50 text-brand-700' :
                  'text-ink-700 hover:bg-slate-50 hover:text-brand-700'}`
                  }>
                  
                      <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: group.color }}
                    aria-hidden="true" />
                  
                      <span className="flex-1 truncate">{member}</span>
                      {selected &&
                  <CheckIcon
                    className="h-4 w-4 shrink-0"
                    strokeWidth={2.5}
                    aria-hidden="true" />

                  }
                    </button>);

            })}
              </div>
          )}
          </div>
        </div>
      }

      <p className="mt-4 flex items-center gap-1.5 text-xs text-ink-500">
        <BellRingIcon className="h-3.5 w-3.5" aria-hidden="true" />
        {assignees.length} responsabili vor primi notificare în CRM și pe email.
      </p>

      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          disabled={title.trim().length === 0 || assignees.length === 0}
          onClick={() =>
          onCreate({
            title: title.trim(),
            detail: detail.trim(),
            categoryId,
            assignees
          })
          }
          className="rounded-lg bg-brand-500 px-3.5 py-2.5 font-display text-sm font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600 disabled:bg-slate-200 disabled:text-ink-500">
          
          Trimite task-ul echipei
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm font-semibold text-ink-500 underline-offset-4 hover:text-ink-700 hover:underline">
          
          Anulează
        </button>
      </div>
    </section>);

}