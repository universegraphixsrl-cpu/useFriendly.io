import React from 'react';
import { ArrowRightIcon } from 'lucide-react';

interface SiteFooterProps {
  onEnterApp: () => void;
}

const columns: Array<{title: string;links: string[];}> = [
{
  title: 'Produs',
  links: [
  'Web builder',
  'Sales funnels',
  'Email & SMS',
  'Automatizări',
  'Linkuri de plată']

},
{
  title: 'Echipă',
  links: ['CRM & liste', 'Sub-accounts', 'Task-uri', 'Calendare', 'Rapoarte']
},
{
  title: 'Resurse',
  links: ['Tutoriale', 'Integrări', 'Suport', 'Status', 'Contact']
}];


/** CTA final + footer */
export function SiteFooter({ onEnterApp }: SiteFooterProps) {
  return (
    <>
      <section className="bg-brand-500 py-20 lg:py-24">
        <div className="mx-auto max-w-3xl px-5 text-center lg:px-8">
          <h2 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
            Mută tot marketingul într-un singur loc
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-brand-50">
            14 zile gratuit, toate modulele deblocate, fără card la înscriere.
            Dacă nu îți place, îți iei datele și pleci.
          </p>
          <button
            type="button"
            onClick={onEnterApp}
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-7 py-4 font-display text-base font-bold text-brand-700 transition-colors duration-150 ease-out hover:bg-brand-50">
            
            Creează contul gratuit
            <ArrowRightIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </section>

      <footer className="bg-ink py-14">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-4 lg:px-8">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 font-display text-lg font-extrabold text-white">
                F
              </span>
              <span className="font-display text-[22px] font-medium tracking-tight text-white">
                Friendly
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
              Tool-ul all-in-one de marketing și vânzări pentru antreprenori și
              echipe mici din România.
            </p>
          </div>

          {columns.map((column) =>
          <nav key={column.title} aria-label={column.title}>
              <h3 className="font-display text-sm font-bold uppercase tracking-wide text-white">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) =>
              <li key={link}>
                    <a
                  href="#top"
                  className="text-sm text-slate-400 transition-colors duration-150 ease-out hover:text-white">
                  
                      {link}
                    </a>
                  </li>
              )}
              </ul>
            </nav>
          )}
        </div>

        <div className="mx-auto mt-12 flex max-w-6xl flex-col gap-3 px-5 pt-8 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>© {new Date().getFullYear()} Friendly. Toate drepturile rezervate.</p>
          <p className="flex gap-5">
            <a
              href="#top"
              className="transition-colors duration-150 ease-out hover:text-white">
              
              Termeni și condiții
            </a>
            <a
              href="#top"
              className="transition-colors duration-150 ease-out hover:text-white">
              
              Politica de confidențialitate
            </a>
          </p>
        </div>
      </footer>
    </>);

}