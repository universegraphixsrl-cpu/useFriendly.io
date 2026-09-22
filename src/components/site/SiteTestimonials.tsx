import React from 'react';
import { siteTestimonials } from '../../data/site';

const initials = (name: string) =>
name.
split(' ').
map((part) => part[0]).
slice(0, 2).
join('');

/** Ce spun cei care au mutat tot stack-ul în Friendly */
export function SiteTestimonials() {
  return (
    <section className="bg-slate-50 py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <h2 className="max-w-2xl font-display text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
          Echipe care au renunțat la jumătate din tool-uri
        </h2>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {siteTestimonials.map((item) =>
          <figure
            key={item.name}
            className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-7">
            
              <blockquote className="text-[15px] leading-relaxed text-ink-700">
                „{item.quote}”
              </blockquote>
              <figcaption className="mt-auto flex items-center gap-3 pt-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 font-display text-sm font-extrabold text-brand-700">
                  {initials(item.name)}
                </span>
                <span>
                  <span className="block font-display text-[15px] font-bold text-ink">
                    {item.name}
                  </span>
                  <span className="block text-xs font-semibold text-ink-500">
                    {item.role}
                  </span>
                </span>
              </figcaption>
            </figure>
          )}
        </div>
      </div>
    </section>);

}