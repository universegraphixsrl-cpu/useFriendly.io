import React, { useState } from 'react';
import { PlusIcon, TagIcon, XIcon } from 'lucide-react';
import { Toast } from '../Toast';

interface FunnelTagsProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

/** Tagurile funnelului, folosite apoi în acțiunile de automatizare */
export function FunnelTags({ tags, onChange }: FunnelTagsProps) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [toast, setToast] = useState('');

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2500);
  };

  const save = () => {
    const value = name.trim();
    if (!value || tags.includes(value)) return;
    onChange([...tags, value]);
    setName('');
    setAdding(false);
    notify('Tag adăugat cu succes');
  };

  return (
    <div className="px-6 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-extrabold tracking-tight text-ink">
            Taguri
          </h3>
          <p className="mt-0.5 text-sm text-ink-500">
            Tagurile create aici pot fi atribuite din regulile de automatizare.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="inline-flex items-center gap-2 rounded-md bg-brand-500 px-4 py-2.5 font-display text-[15px] font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600">
          
          <PlusIcon className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
          Adaugă tag
        </button>
      </div>

      {adding &&
      <div className="mt-4 flex flex-wrap items-center gap-2 rounded-md border border-slate-200 bg-slate-50 p-4">
          <input
          autoFocus
          value={name}
          onChange={(event) => setName(event.target.value)}
          onKeyDown={(event) => event.key === 'Enter' && save()}
          placeholder="Denumirea tagului"
          aria-label="Denumirea tagului"
          className="min-w-[220px] flex-1 rounded-md border border-slate-200 px-3.5 py-2.5 text-base text-ink outline-none focus:border-brand-400" />
        
          <button
          type="button"
          onClick={save}
          disabled={!name.trim()}
          className="rounded-md bg-brand-500 px-4 py-2.5 font-display text-[15px] font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-slate-300">
          
            Salvează
          </button>
          <button
          type="button"
          onClick={() => {
            setAdding(false);
            setName('');
          }}
          className="rounded-md border border-slate-200 bg-white px-4 py-2.5 text-[15px] font-semibold text-ink-700 transition-colors duration-150 ease-out hover:bg-slate-50">
          
            Anulează
          </button>
        </div>
      }

      {tags.length === 0 ?
      <p className="mt-6 rounded-md border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-ink-500">
          Nu există niciun tag în acest funnel.
        </p> :

      <ul className="mt-5 flex flex-wrap gap-2">
          {tags.map((tag) =>
        <li
          key={tag}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-ink-700">
          
              <TagIcon className="h-4 w-4 text-ink-400" aria-hidden="true" />
              {tag}
              <button
            type="button"
            onClick={() => {
              onChange(tags.filter((item) => item !== tag));
              notify('Tag eliminat cu succes');
            }}
            aria-label={`Șterge tagul ${tag}`}
            className="rounded-full p-0.5 text-ink-400 transition-colors duration-150 ease-out hover:bg-slate-100 hover:text-ink">
            
                <XIcon className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </li>
        )}
        </ul>
      }

      {toast && <Toast message={toast} />}
    </div>);

}