import React, { useState } from 'react';
import { CheckIcon } from 'lucide-react';
import { categoryColors } from '../../data/tasks';
import { subAccounts, subAccountsTotal } from '../../data/subAccounts';

const TITLE_LIMIT = 40;

interface CourseFormProps {
  onCreate: (draft: {
    title: string;
    description: string;
    color: string;
    access: string[];
  }) => void;
  onCancel: () => void;
}

export function CourseForm({ onCreate, onCancel }: CourseFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(categoryColors[0]);
  const [access, setAccess] = useState<string[]>([]);

  const toggleAccess = (name: string) =>
  setAccess((current) =>
  current.includes(name) ?
  current.filter((item) => item !== name) :
  [...current, name]
  );

  return (
    <section
      aria-labelledby="new-course-title"
      className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      
      <h2
        id="new-course-title"
        className="font-display text-base font-extrabold tracking-tight text-ink">
        
        Curs sau procedură nouă
      </h2>
      <p className="text-xs text-ink-500">
        Numele este obligatoriu, maximum {TITLE_LIMIT} de caractere.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="courseTitle"
            className="text-[11px] font-bold uppercase tracking-wide text-ink-500">
            
            Denumire
          </label>
          <input
            id="courseTitle"
            type="text"
            autoFocus
            maxLength={TITLE_LIMIT}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="ex. Onboarding closeri"
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-ink focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100" />
          
          <p className="mt-1 text-[11px] font-semibold text-ink-500">
            {title.length}/{TITLE_LIMIT} caractere
          </p>
        </div>

        <div>
          <label
            htmlFor="courseDescription"
            className="text-[11px] font-bold uppercase tracking-wide text-ink-500">
            
            Descriere (opțional)
          </label>
          <textarea
            id="courseDescription"
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Ce învață echipa din acest material?"
            className="mt-1 w-full resize-y rounded-lg border border-slate-200 px-3 py-2 text-sm text-ink focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100" />
          
        </div>
      </div>

      <div className="mt-4">
        <p className="text-[11px] font-bold uppercase tracking-wide text-ink-500">
          Culoare de referință
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {categoryColors.map((option) =>
          <button
            key={option}
            type="button"
            onClick={() => setColor(option)}
            aria-label={`Culoare ${option}`}
            aria-pressed={color === option}
            className={`h-6 w-6 rounded-full transition-transform duration-150 ease-out ${
            color === option ?
            'ring-2 ring-ink ring-offset-2' :
            'hover:scale-110'}`
            }
            style={{ backgroundColor: option }} />

          )}
        </div>
      </div>

      <div className="mt-5 border-t border-slate-100 pt-4">
        <p className="text-[11px] font-bold uppercase tracking-wide text-ink-500">
          Cine primește cursul
        </p>
        <div className="mt-2 w-72 max-w-full">
          <div className="max-h-80 overflow-y-auto rounded-xl border border-slate-200 bg-white p-3 shadow-2xl">
            <p className="pb-2 text-[11px] font-bold uppercase tracking-wide text-ink-500">
              Sub-accounts active · {subAccountsTotal}
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
                const selected = access.includes(member);
                return (
                  <button
                    key={member}
                    type="button"
                    onClick={() => toggleAccess(member)}
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
        <p className="mt-2 text-xs text-ink-500">
          {access.length} sub-accounts vor primi acces la material. Poți adăuga
          persoane și ulterior.
        </p>
      </div>

      <div className="mt-5 flex items-center gap-2">
        <button
          type="button"
          disabled={title.trim().length === 0}
          onClick={() =>
          onCreate({
            title: title.trim(),
            description: description.trim(),
            color,
            access
          })
          }
          className="rounded-lg bg-brand-500 px-3.5 py-2.5 font-display text-sm font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600 disabled:bg-slate-200 disabled:text-ink-500">
          
          Creează cursul
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