import React from 'react';
import { ArrowLeftIcon } from 'lucide-react';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  /** Lățimea coloanei de formular (sign-up are mai multe câmpuri) */
  wide?: boolean;
  onBackToSite: () => void;
  footer: React.ReactNode;
  children: React.ReactNode;
}

/** Cadrul comun pentru paginile de autentificare */
export function AuthLayout({
  title,
  subtitle,
  wide,
  onBackToSite,
  footer,
  children
}: AuthLayoutProps) {
  return (
    <div className="min-h-full w-full bg-slate-50 font-sans text-ink">
      <div
        className={`mx-auto px-5 py-10 lg:py-16 ${wide ? 'max-w-3xl' : 'max-w-md'}`}>
        
        <button
          type="button"
          onClick={onBackToSite}
          className="inline-flex items-center gap-2 text-sm font-semibold text-ink-500 transition-colors duration-150 ease-out hover:text-ink">
          
          <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
          Înapoi la site
        </button>

        <div className="mt-6 flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500 font-display text-xl font-extrabold text-white">
            F
          </span>
          <span className="font-display text-[24px] font-medium tracking-tight text-ink">
            Friendly
          </span>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">
            {title}
          </h1>
          <p className="mt-1.5 text-[15px] text-ink-500">{subtitle}</p>

          <div className="mt-7">{children}</div>
        </div>

        <p className="mt-6 text-center text-sm text-ink-500">{footer}</p>
      </div>
    </div>);

}

/** Butonul de autentificare cu Google, cu logo-ul oficial desenat în SVG */
export function GoogleButton({
  label,
  onClick



}: {label: string;onClick: () => void;}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white px-5 py-3.5 font-display text-[15px] font-bold text-ink transition-colors duration-150 ease-out hover:border-ink-500">
      
      <svg className="h-5 w-5" viewBox="0 0 18 18" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.71-1.57 2.68-3.89 2.68-6.62Z" />
        
        <path
          fill="#34A853"
          d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.34A8.99 8.99 0 0 0 9 18Z" />
        
        <path
          fill="#FBBC05"
          d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.94H.96a9 9 0 0 0 0 8.12l3.01-2.34Z" />
        
        <path
          fill="#EA4335"
          d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.59A8.99 8.99 0 0 0 .96 4.94l3.01 2.34C4.68 5.16 6.66 3.58 9 3.58Z" />
        
      </svg>
      {label}
    </button>);

}

/** Separatorul „sau” dintre Google și formularul clasic */
export function AuthDivider() {
  return (
    <div className="my-6 flex items-center gap-4">
      <span className="h-px flex-1 bg-slate-200" />
      <span className="text-xs font-bold uppercase tracking-wide text-ink-500">
        sau
      </span>
      <span className="h-px flex-1 bg-slate-200" />
    </div>);

}

/** Câmp de text etichetat, folosit în ambele formulare */
export function AuthField({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
  autoComplete,
  children










}: {label: string;type?: string;value: string;onChange: (value: string) => void;placeholder?: string;required?: boolean;autoComplete?: string; /** Buton opțional afișat în dreapta câmpului (ex. arată parola) */children?: React.ReactNode;}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-ink-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      <span className="relative mt-1.5 block">
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-[15px] font-semibold text-ink outline-none transition-colors duration-150 ease-out focus:border-brand-500 ${
          children ? 'pr-11' : ''}`
          } />
        
        {children}
      </span>
    </label>);

}