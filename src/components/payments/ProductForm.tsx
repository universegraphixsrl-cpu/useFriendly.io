import React, { useState } from 'react';
import {
  currencies,
  intervalUnits,
  billingLabel,
  formatPrice,
  type IntervalUnit,
  type Product } from
'../../data/payments';
import { categoryColors } from '../../data/tasks';

interface ProductFormProps {
  onCreate: (product: Product) => void;
  onCancel: () => void;
}

const labelClass = 'text-xs font-bold uppercase tracking-wide text-ink-500';
const fieldClass =
'mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-ink placeholder:font-normal placeholder:text-ink-500 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100';

export function ProductForm({ onCreate, onCancel }: ProductFormProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('EUR');
  const [recurring, setRecurring] = useState(false);
  const [interval, setInterval] = useState('1');
  const [intervalUnit, setIntervalUnit] = useState<IntervalUnit>('luni');
  const [color, setColor] = useState(categoryColors[0]);

  const draft: Product = {
    id: 'draft',
    name,
    price: Number(price) || 0,
    currency,
    recurring,
    interval: Math.max(1, Number(interval) || 1),
    intervalUnit,
    color
  };

  const canSave = name.trim().length > 0 && Number(price) > 0;

  return (
    <section
      aria-labelledby="product-form-title"
      className="mt-5 rounded-2xl border border-brand-200 bg-white p-5 sm:p-6">
      
      <h2
        id="product-form-title"
        className="font-display text-lg font-extrabold tracking-tight text-ink">
        
        Creează produs
      </h2>
      <p className="text-xs text-ink-500">
        Produsele salvate pot fi refolosite pe orice link de plată.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="newProdName" className={labelClass}>
            Denumire produs
          </label>
          <input
            id="newProdName"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Mentorat 1-la-1 · 3 luni"
            className={fieldClass} />
          
        </div>
        <div>
          <label htmlFor="newProdPrice" className={labelClass}>
            Preț
          </label>
          <input
            id="newProdPrice"
            type="number"
            min={0}
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            placeholder="1500"
            className={fieldClass} />
          
        </div>
        <div>
          <label htmlFor="newProdCurrency" className={labelClass}>
            Monedă
          </label>
          <select
            id="newProdCurrency"
            value={currency}
            onChange={(event) => setCurrency(event.target.value)}
            className={fieldClass}>
            
            {currencies.map((item) =>
            <option key={item.code} value={item.code}>
                {item.code} · {item.label}
              </option>
            )}
          </select>
        </div>

        <div className="sm:col-span-2">
          <span className={labelClass}>Tip de plată</span>
          <div className="mt-1.5 flex gap-2">
            <button
              type="button"
              onClick={() => setRecurring(false)}
              aria-pressed={!recurring}
              className={`flex-1 rounded-lg border px-3 py-2 text-xs font-bold transition-colors duration-150 ease-out ${
              !recurring ?
              'border-brand-300 bg-brand-50 text-brand-700' :
              'border-slate-200 bg-white text-ink-700 hover:bg-slate-50'}`
              }>
              
              Plată unică
            </button>
            <button
              type="button"
              onClick={() => setRecurring(true)}
              aria-pressed={recurring}
              className={`flex-1 rounded-lg border px-3 py-2 text-xs font-bold transition-colors duration-150 ease-out ${
              recurring ?
              'border-brand-300 bg-brand-50 text-brand-700' :
              'border-slate-200 bg-white text-ink-700 hover:bg-slate-50'}`
              }>
              
              Recurent
            </button>
          </div>
        </div>

        {recurring &&
        <div className="grid gap-3 rounded-lg border border-brand-200 bg-slate-50 p-3 sm:col-span-2 sm:grid-cols-3">
            <div>
              <label htmlFor="newRecAmount" className={labelClass}>
                Suma per plată
              </label>
              <input
              id="newRecAmount"
              type="number"
              min={0}
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              className={fieldClass} />
            
            </div>
            <div>
              <label htmlFor="newRecInterval" className={labelClass}>
                La fiecare
              </label>
              <input
              id="newRecInterval"
              type="number"
              min={1}
              value={interval}
              onChange={(event) => setInterval(event.target.value)}
              className={fieldClass} />
            
            </div>
            <div>
              <label htmlFor="newRecUnit" className={labelClass}>
                Unitate
              </label>
              <select
              id="newRecUnit"
              value={intervalUnit}
              onChange={(event) =>
              setIntervalUnit(event.target.value as IntervalUnit)
              }
              className={fieldClass}>
              
                {intervalUnits.map((unit) =>
              <option key={unit} value={unit}>
                    {unit}
                  </option>
              )}
              </select>
            </div>
            <p className="text-[11px] font-semibold text-ink-500 sm:col-span-3">
              {billingLabel(draft)} · {formatPrice(draft.price, draft.currency)}{' '}
              la fiecare plată.
            </p>
          </div>
        }
      </div>

      <div className="mt-4 border-t border-slate-100 pt-4">
        <span className={labelClass}>Culoare de identificare</span>
        <p className="mt-0.5 text-[11px] text-ink-500">
          Vizibilă doar pentru tine, în CRM — clientul nu o vede pe pagina de
          plată.
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {categoryColors.map((option) =>
          <button
            key={option}
            type="button"
            onClick={() => setColor(option)}
            aria-label={`Culoare ${option}`}
            aria-pressed={color === option}
            className={`h-7 w-7 rounded-full transition-transform duration-150 ease-out hover:scale-110 ${
            color === option ?
            'ring-2 ring-ink ring-offset-2' :
            'ring-1 ring-slate-200'}`
            }
            style={{ backgroundColor: option }} />

          )}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
        <button
          type="button"
          disabled={!canSave}
          onClick={() => onCreate({ ...draft, id: `prod-${Date.now()}` })}
          className="rounded-lg bg-brand-500 px-3.5 py-2.5 font-display text-sm font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600 disabled:bg-slate-200 disabled:text-ink-500">
          
          Salvează produsul
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