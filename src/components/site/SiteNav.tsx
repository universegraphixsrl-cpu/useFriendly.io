import React, { useState } from 'react';
import { MenuIcon, XIcon } from 'lucide-react';

interface SiteNavProps {
  onLogin: () => void;
  onSignup: () => void;
}

const links = [
{ label: 'Funcții', href: '#functii' },
{ label: 'Web builder', href: '#builder' },
{ label: 'Automatizări', href: '#automatizari' },
{ label: 'Prețuri', href: '#preturi' },
{ label: 'Întrebări', href: '#intrebari' }];


/** Bara de anunț + navigația site-ului public */
export function SiteNav({ onLogin, onSignup }: SiteNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40">
      <p className="bg-brand-500 px-4 py-2.5 text-center text-sm font-bold text-white">
        14 zile gratuit, fără card — toate modulele incluse de la prima zi.
      </p>

      <nav
        aria-label="Navigație principală"
        className="border-b border-slate-200 bg-white/95 backdrop-blur">
        
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-5 py-4 lg:px-8">
          <a href="#top" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 font-display text-lg font-extrabold text-white">
              F
            </span>
            <span className="font-display text-[22px] font-medium tracking-tight text-ink">
              Friendly
            </span>
          </a>

          <div className="ml-4 hidden items-center gap-7 lg:flex">
            {links.map((link) =>
            <a
              key={link.href}
              href={link.href}
              className="text-[15px] font-semibold text-ink-700 transition-colors duration-150 ease-out hover:text-brand-600">
              
                {link.label}
              </a>
            )}
          </div>

          <div className="ml-auto hidden items-center gap-3 lg:flex">
            <button
              type="button"
              onClick={onLogin}
              className="rounded-lg border border-slate-200 px-4 py-2.5 font-display text-[15px] font-bold text-ink transition-colors duration-150 ease-out hover:border-ink-500">
              
              Log in
            </button>
            <button
              type="button"
              onClick={onSignup}
              className="rounded-lg bg-brand-500 px-5 py-2.5 font-display text-[15px] font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600">
              
              Sign up
            </button>
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? 'Închide meniul' : 'Deschide meniul'}
            aria-expanded={open}
            className="ml-auto rounded-lg border border-slate-200 p-2 text-ink transition-colors duration-150 ease-out hover:border-ink-500 lg:hidden">
            
            {open ?
            <XIcon className="h-5 w-5" aria-hidden="true" /> :

            <MenuIcon className="h-5 w-5" aria-hidden="true" />
            }
          </button>
        </div>

        {open &&
        <div className="border-t border-slate-200 bg-white px-5 py-4 lg:hidden">
            <div className="flex flex-col gap-3">
              {links.map((link) =>
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-[15px] font-semibold text-ink-700">
              
                  {link.label}
                </a>
            )}
            </div>
            <div className="mt-4 flex gap-3">
              <button
              type="button"
              onClick={onLogin}
              className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 font-display text-[15px] font-bold text-ink">
              
                Log in
              </button>
              <button
              type="button"
              onClick={onSignup}
              className="flex-1 rounded-lg bg-brand-500 px-4 py-2.5 font-display text-[15px] font-bold text-white">
              
                Sign up
              </button>
            </div>
          </div>
        }
      </nav>
    </header>);

}