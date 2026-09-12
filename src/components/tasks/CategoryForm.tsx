import React, { useState } from 'react';
import { CheckIcon, XIcon } from 'lucide-react';
import { categoryColors } from '../../data/tasks';

interface CategoryFormProps {
  onCreate: (name: string, color: string) => void;
  onCancel: () => void;
}

export function CategoryForm({ onCreate, onCancel }: CategoryFormProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(categoryColors[0]);

  return (
    <div className="mt-5 rounded-2xl border border-brand-200 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-base font-extrabold tracking-tight text-ink">
            Categorie nouă de task-uri
          </h2>
          <p className="text-xs text-ink-500">
            Dă-i un nume și alege culoarea cu care apare în listă.
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

      <input
        type="text"
        autoFocus
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Ex.: Parteneriate, Produs, Legal…"
        aria-label="Numele categoriei"
        className="mt-4 w-full max-w-sm rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-ink placeholder:font-normal placeholder:text-ink-500 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100" />
      

      <p className="mt-4 text-[11px] font-bold uppercase tracking-wide text-ink-500">
        Culoare
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {categoryColors.map((option) =>
        <button
          key={option}
          type="button"
          onClick={() => setColor(option)}
          aria-pressed={color === option}
          aria-label={`Culoarea ${option}`}
          className={`flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-150 ease-out ${
          color === option ?
          'ring-2 ring-ink ring-offset-2' :
          'hover:scale-105'}`
          }
          style={{ backgroundColor: option }}>
          
            {color === option &&
          <CheckIcon
            className="h-4 w-4 text-white"
            strokeWidth={3}
            aria-hidden="true" />

          }
          </button>
        )}
      </div>

      <div className="mt-5 flex items-center gap-2">
        <button
          type="button"
          disabled={name.trim().length === 0}
          onClick={() => onCreate(name.trim(), color)}
          className="rounded-lg bg-brand-500 px-3.5 py-2.5 font-display text-sm font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600 disabled:bg-slate-200 disabled:text-ink-500">
          
          Creează categoria
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm font-semibold text-ink-500 underline-offset-4 hover:text-ink-700 hover:underline">
          
          Anulează
        </button>
      </div>
    </div>);

}