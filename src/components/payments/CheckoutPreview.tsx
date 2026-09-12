import React, { useState } from 'react';
import { LockIcon, CreditCardIcon, RepeatIcon } from 'lucide-react';
import {
  intervalText,
  formatPrice,
  standardFields,
  companyFields,
  type Product } from
'../../data/payments';

interface CheckoutPreviewProps {
  product: Product;
  extraFields: string[];
  allowCompany: boolean;
  url: string;
}

export function CheckoutPreview({
  product,
  extraFields,
  allowCompany,
  url
}: CheckoutPreviewProps) {
  const [company, setCompany] = useState(false);
  const recurring = product.recurring;

  const fields = [
  ...standardFields,
  ...(allowCompany && company ? companyFields : []),
  ...extraFields];


  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-[11px] font-bold uppercase tracking-wide text-ink-500">
        Previzualizare link de plată
      </p>
      <p className="mt-1 truncate text-xs font-semibold text-brand-600">
        {url}
      </p>

      <div className="mt-4 rounded-xl border border-slate-200 p-4">
        <p className="text-xs font-semibold text-ink-500">
          {product.name || 'Produs fără denumire'}
        </p>
        <p className="mt-1 font-display text-3xl font-extrabold tracking-tight text-ink">
          {formatPrice(product.price, product.currency)}
        </p>
        {recurring ?
        <p className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-bold text-brand-700">
            <RepeatIcon className="h-3 w-3" aria-hidden="true" />
            Plată recurentă · se reînnoiește la fiecare{' '}
            {intervalText(product)}
          </p> :

        <p className="mt-1 text-[11px] font-semibold text-ink-500">
            Plată unică
          </p>
        }

        <div className="mt-4 space-y-2">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-ink px-3 py-2.5 text-sm font-bold text-white transition-colors duration-150 ease-out hover:bg-ink-700">
            
            <span aria-hidden="true"></span> Pay
          </button>
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-bold text-ink transition-colors duration-150 ease-out hover:bg-slate-50">
            
            <span aria-hidden="true">G</span> Pay
          </button>
        </div>

        <div className="my-4 flex items-center gap-3">
          <span className="h-px flex-1 bg-slate-200" aria-hidden="true" />
          <span className="text-[11px] font-bold uppercase text-ink-500">
            sau cu cardul
          </span>
          <span className="h-px flex-1 bg-slate-200" aria-hidden="true" />
        </div>

        {allowCompany &&
        <div className="mb-3 flex gap-1.5">
            <button
            type="button"
            onClick={() => setCompany(false)}
            aria-pressed={!company}
            className={`flex-1 rounded-lg border px-2 py-1.5 text-[11px] font-bold transition-colors duration-150 ease-out ${
            !company ?
            'border-brand-300 bg-brand-50 text-brand-700' :
            'border-slate-200 text-ink-700 hover:bg-slate-50'}`
            }>
            
              Persoană fizică
            </button>
            <button
            type="button"
            onClick={() => setCompany(true)}
            aria-pressed={company}
            className={`flex-1 rounded-lg border px-2 py-1.5 text-[11px] font-bold transition-colors duration-150 ease-out ${
            company ?
            'border-brand-300 bg-brand-50 text-brand-700' :
            'border-slate-200 text-ink-700 hover:bg-slate-50'}`
            }>
            
              Persoană juridică
            </button>
          </div>
        }

        <div className="space-y-2 text-xs">
          {fields.map((field) =>
          <p
            key={field}
            className="rounded-lg border border-slate-200 px-3 py-2 font-normal text-ink-500">
            
              {field}
            </p>
          )}
          <p className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 font-semibold text-ink-500">
            <CreditCardIcon className="h-4 w-4" aria-hidden="true" />
            1234 1234 1234 1234
          </p>
        </div>

        <button
          type="button"
          className="mt-4 w-full rounded-lg bg-brand-500 px-3 py-2.5 font-display text-sm font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600">
          
          {recurring ?
          `Abonează-te · ${formatPrice(product.price, product.currency)}/${intervalText(product)}` :
          `Plătește ${formatPrice(product.price, product.currency)}`}
        </button>

        <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-ink-500">
          <LockIcon className="h-3 w-3" aria-hidden="true" />
          Plată securizată
        </p>

        <div className="mt-2 flex items-center justify-center gap-3">
          <button
            type="button"
            className="text-[10px] font-semibold text-ink-500 underline-offset-2 hover:text-ink-700 hover:underline">
            
            Terms
          </button>
          <span className="text-[10px] text-ink-500" aria-hidden="true">
            ·
          </span>
          <button
            type="button"
            className="text-[10px] font-semibold text-ink-500 underline-offset-2 hover:text-ink-700 hover:underline">
            
            Privacy Policy
          </button>
        </div>
      </div>
    </div>);

}