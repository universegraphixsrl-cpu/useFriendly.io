import React, { useState } from 'react';
import { PlayIcon, ClockIcon, XIcon, SearchIcon } from 'lucide-react';
import { tutorials, tutorialCategories, type Tutorial } from '../data/tutorials';

const levelStyle: Record<Tutorial['level'], string> = {
  Începător: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Intermediar: 'bg-amber-50 text-amber-700 border-amber-200',
  Avansat: 'bg-brand-50 text-brand-700 border-brand-200'
};

/** Biblioteca video Friendly — vizibilă doar în contul de admin */
export function Tutorials() {
  const [category, setCategory] = useState<string>('Toate');
  const [query, setQuery] = useState('');
  const [playing, setPlaying] = useState<Tutorial | null>(null);

  const terms = query.
  toLowerCase().
  split(/\s+/).
  filter((word) => word.length > 0);

  const matches = (tutorial: Tutorial) =>
  terms.every((term) =>
  `${tutorial.title} ${tutorial.description} ${tutorial.category} ${tutorial.level}`.
  toLowerCase().
  includes(term)
  );

  const visible = tutorials.
  filter((item) => category === 'Toate' || item.category === category).
  filter(matches);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">
          Tutoriale Friendly
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          {tutorials.length} clipuri scurte care acoperă fiecare secțiune din
          CRM, de la primii pași la permisiuni avansate.
        </p>
      </div>

      <div className="relative max-w-sm">
        <SearchIcon
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500"
          aria-hidden="true" />
        
        <label htmlFor="tutorialSearch" className="sr-only">
          Caută tutorial
        </label>
        <input
          id="tutorialSearch"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Caută tutorial…"
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-9 text-sm text-ink placeholder:text-ink-500 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100" />
        
        {query.length > 0 &&
        <button
          type="button"
          onClick={() => setQuery('')}
          className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-ink-500 transition-colors duration-150 ease-out hover:bg-slate-100 hover:text-ink"
          aria-label="Șterge căutarea">
          
            <XIcon className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        }
      </div>

      <div className="flex flex-wrap gap-2">
        {['Toate', ...tutorialCategories].map((item) => {
          const active = category === item;
          const count = tutorials.
          filter((tutorial) => item === 'Toate' || tutorial.category === item).
          filter(matches).length;
          return (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              aria-pressed={active}
              className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-colors duration-150 ease-out ${
              active ?
              'border-brand-500 bg-brand-500 text-white' :
              'border-slate-200 bg-white text-ink-700 hover:border-brand-200 hover:text-brand-700'}`
              }>
              
              {item} · {count}
            </button>);

        })}
      </div>

      {playing &&
      <section
        className="overflow-hidden rounded-2xl border border-slate-200 bg-ink"
        aria-label={`Player: ${playing.title}`}>
        
          <div className="relative flex aspect-video w-full items-center justify-center bg-ink">
            <button
            type="button"
            onClick={() => setPlaying(null)}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white transition-colors duration-150 ease-out hover:bg-white/20"
            aria-label="Închide player-ul">
            
              <XIcon className="h-4 w-4" aria-hidden="true" />
            </button>
            <div className="flex flex-col items-center gap-3 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-500 text-white">
                <PlayIcon className="h-7 w-7" aria-hidden="true" />
              </span>
              <p className="font-display text-lg font-bold text-white">
                {playing.title}
              </p>
              <p className="max-w-md text-sm text-white/70">
                {playing.description}
              </p>
              <p className="text-xs text-white/50">{playing.duration}</p>
            </div>
          </div>
        </section>
      }

      {visible.length === 0 &&
      <p className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-10 text-center text-sm text-ink-500">
          Niciun tutorial pentru „{query}”. Încearcă alt cuvânt cheie.
        </p>
      }

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {visible.map((tutorial) =>
        <article
          key={tutorial.id}
          className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-colors duration-150 ease-out hover:border-brand-200">
          
            <button
            type="button"
            onClick={() => setPlaying(tutorial)}
            className="group relative flex aspect-video w-full items-center justify-center bg-ink"
            aria-label={`Redă ${tutorial.title}`}>
            
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-150 ease-out group-hover:bg-brand-500">
                <PlayIcon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-white">
                <ClockIcon className="h-3 w-3" aria-hidden="true" />
                {tutorial.duration}
              </span>
            </button>

            <div className="flex flex-1 flex-col p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink-500">
                  {tutorial.category}
                </span>
                <span
                className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${levelStyle[tutorial.level]}`}>
                
                  {tutorial.level}
                </span>
              </div>
              <h2 className="mt-2 font-display text-sm font-bold text-ink">
                {tutorial.title}
              </h2>
              <p className="mt-1 text-xs text-ink-500">{tutorial.description}</p>
              <button
              type="button"
              onClick={() => setPlaying(tutorial)}
              className="mt-auto pt-3 text-left text-xs font-bold text-brand-600 transition-colors duration-150 ease-out hover:text-brand-700">
              
                Vezi tutorialul →
              </button>
            </div>
          </article>
        )}
      </div>
    </div>);

}