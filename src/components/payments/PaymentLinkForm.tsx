import React, { useState } from 'react';
import { PackagePlusIcon, CheckIcon, Building2Icon } from 'lucide-react';
import {
  currencies,
  formatPrice,
  billingLabel,
  intervalUnits,
  standardFields,
  optionalFields,
  companyFields,
  type IntervalUnit,
  type PaymentLink,
  type Product } from
'../../data/payments';
import { categoryColors } from '../../data/tasks';
import { CheckoutPreview } from './CheckoutPreview';

interface PaymentLinkFormProps {
  products: Product[];
  /** Linkul editat; lipsește la creare */
  link?: PaymentLink;
  onCreateProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onSubmit: (draft: {
    productId: string;
    extraFields: string[];
    allowCompany: boolean;
  }) => void;
  onCancel: () => void;
}

const labelClass = 'text-xs font-bold uppercase tracking-wide text-ink-500';
const fieldClass =
'mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold text-ink placeholder:font-normal placeholder:text-ink-500 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100';

export function PaymentLinkForm({
  products,
  link,
  onCreateProduct,
  onUpdateProduct,
  onSubmit,
  onCancel
}: PaymentLinkFormProps) {
  const editing = Boolean(link);
  const [productId, setProductId] = useState(
    link?.productId ?? products[0]?.id ?? 'new'
  );
  const [newOpen, setNewOpen] = useState(!editing && products.length === 0);
  const [extraFields, setExtraFields] = useState<string[]>(
    link?.extraFields ?? []
  );
  /** Orice link acceptă atât persoane fizice, cât și juridice */
  const allowCompany = true;

  const existing = products.find((item) => item.id === productId);

  const [name, setName] = useState(editing ? existing?.name ?? '' : '');
  const [price, setPrice] = useState(
    editing ? String(existing?.price ?? '') : ''
  );
  const [currency, setCurrency] = useState(existing?.currency ?? 'EUR');
  const [recurring, setRecurring] = useState(existing?.recurring ?? false);
  const [interval, setInterval] = useState(String(existing?.interval ?? 1));
  const [intervalUnit, setIntervalUnit] = useState<IntervalUnit>(
    existing?.intervalUnit ?? 'luni'
  );
  const [color, setColor] = useState(existing?.color ?? categoryColors[0]);

  const [productEditOpen, setProductEditOpen] = useState(false);
  const productEditing = newOpen || productEditOpen;

  /** Selectează un produs deja creat și îi încarcă valorile în editor */
  const selectProduct = (product: Product) => {
    setProductId(product.id);
    setNewOpen(false);
    setProductEditOpen(false);
    setName(product.name);
    setPrice(String(product.price));
    setCurrency(product.currency);
    setRecurring(product.recurring);
    setInterval(String(product.interval));
    setIntervalUnit(product.intervalUnit);
    setColor(product.color);
  };

  const draftProduct: Product = productEditing ?
  {
    id: existing?.id ?? 'draft',
    name,
    price: Number(price) || 0,
    currency,
    recurring,
    interval: Math.max(1, Number(interval) || 1),
    intervalUnit,
    color
  } :
  existing ?? {
    id: 'draft',
    name: '',
    price: 0,
    currency: 'EUR',
    recurring: false,
    interval: 1,
    intervalUnit: 'luni',
    color: categoryColors[0]
  };

  const toggleField = (field: string) =>
  setExtraFields((current) =>
  current.includes(field) ?
  current.filter((item) => item !== field) :
  [...current, field]
  );

  const canSave = productEditing ?
  name.trim().length > 0 && Number(price) > 0 :
  Boolean(existing);

  const submit = () => {
    let id = productId;
    if (productEditOpen && existing) {
      onUpdateProduct({ ...draftProduct, id: existing.id });
      id = existing.id;
    } else if (newOpen) {
      id = `prod-${Date.now()}`;
      onCreateProduct({ ...draftProduct, id });
    }
    onSubmit({ productId: id, extraFields, allowCompany });
  };

  return (
    <section
      aria-labelledby="payment-form-title"
      className="mt-5 rounded-2xl border border-brand-200 bg-white p-5 sm:p-6">
      
      <h2
        id="payment-form-title"
        className="font-display text-lg font-extrabold tracking-tight text-ink">
        
        {editing ? 'Editează linkul de plată' : 'Creează link de plată'}
      </h2>
      <p className="text-xs text-ink-500">
        Linkul poate fi folosit de oricâți clienți — fiecare își completează
        singur datele la checkout.
      </p>

      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-5">
          <div>
            <p className={labelClass}>Produs</p>
            {
            <div className="mt-2 space-y-2">
                {products.map((product) =>
              <button
                key={product.id}
                type="button"
                onClick={() => selectProduct(product)}
                aria-pressed={!newOpen && productId === product.id}
                className={`flex w-full items-center justify-between gap-3 overflow-hidden rounded-xl border border-l-4 px-3.5 py-3 text-left transition-colors duration-150 ease-out ${
                !newOpen && productId === product.id ?
                'border-brand-300 bg-brand-50' :
                'border-slate-200 hover:border-brand-200 hover:bg-slate-50'}`
                }
                style={{ borderLeftColor: product.color }}>
                
                    <span className="min-w-0">
                      <span className="block truncate font-display text-sm font-bold text-ink">
                        {product.name}
                      </span>
                      <span className="text-[11px] font-semibold text-ink-500">
                        {billingLabel(product)}
                      </span>
                    </span>
                    <span className="shrink-0 font-display text-sm font-bold text-ink">
                      {formatPrice(product.price, product.currency)}
                    </span>
                  </button>
              )}

                <button
                type="button"
                onClick={() => setNewOpen(true)}
                aria-pressed={newOpen}
                className={`flex w-full items-center gap-2 rounded-xl border border-dashed px-3.5 py-3 text-sm font-bold transition-colors duration-150 ease-out ${
                newOpen ?
                'border-brand-300 bg-brand-50 text-brand-700' :
                'border-slate-300 text-ink-700 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700'}`
                }>
                
                  <PackagePlusIcon className="h-4 w-4" aria-hidden="true" />
                  Creează un produs nou
                </button>

                {!newOpen && existing &&
              <button
                type="button"
                onClick={() => setProductEditOpen((value) => !value)}
                className="text-xs font-bold text-brand-600 underline-offset-4 hover:underline">
                
                    {productEditOpen ?
                'Ascunde editarea produsului' :
                'Editează produsul selectat'}
                  </button>
              }
              </div>
            }

            {productEditing &&
            <div className="mt-3 grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="prodName" className={labelClass}>
                    Denumire produs
                  </label>
                  <input
                  id="prodName"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Mentorat 1-la-1 · 3 luni"
                  className={`${fieldClass} bg-white`} />
                
                </div>
                <div>
                  <label htmlFor="prodPrice" className={labelClass}>
                    Preț
                  </label>
                  <input
                  id="prodPrice"
                  type="number"
                  min={0}
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  placeholder="1500"
                  className={`${fieldClass} bg-white`} />
                
                </div>
                <div>
                  <label htmlFor="prodCurrency" className={labelClass}>
                    Monedă
                  </label>
                  <select
                  id="prodCurrency"
                  value={currency}
                  onChange={(event) => setCurrency(event.target.value)}
                  className={`${fieldClass} bg-white`}>
                  
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

                <div className="sm:col-span-2">
                  <span className={labelClass}>Culoare de identificare</span>
                  <p className="mt-0.5 text-[11px] text-ink-500">
                    Vizibilă doar pentru tine, în CRM.
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

                {recurring &&
              <div className="grid gap-3 rounded-lg border border-brand-200 bg-white p-3 sm:col-span-2 sm:grid-cols-3">
                    <div>
                      <label htmlFor="recAmount" className={labelClass}>
                        Suma per plată
                      </label>
                      <input
                    id="recAmount"
                    type="number"
                    min={0}
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                    placeholder="249"
                    className={fieldClass} />
                  
                    </div>
                    <div>
                      <label htmlFor="recInterval" className={labelClass}>
                        La fiecare
                      </label>
                      <input
                    id="recInterval"
                    type="number"
                    min={1}
                    value={interval}
                    onChange={(event) => setInterval(event.target.value)}
                    className={fieldClass} />
                  
                    </div>
                    <div>
                      <label htmlFor="recUnit" className={labelClass}>
                        Unitate
                      </label>
                      <select
                    id="recUnit"
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
                      {billingLabel(draftProduct)} ·{' '}
                      {formatPrice(draftProduct.price, draftProduct.currency)}{' '}
                      la fiecare plată.
                    </p>
                  </div>
              }
              </div>
            }
          </div>

          <div className="border-t border-slate-100 pt-5">
            <p className={labelClass}>Câmpuri completate de client</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {standardFields.map((field) =>
              <span
                key={field}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] font-bold text-ink-700">
                
                  <CheckIcon className="h-3 w-3" aria-hidden="true" />
                  {field}
                </span>
              )}
            </div>
            <p className="mt-1.5 text-[11px] text-ink-500">
              Câmpurile standard apar mereu pe link.
            </p>

            <p className={`${labelClass} mt-4 block`}>Adaugă câmpuri</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {optionalFields.map((field) => {
                const active = extraFields.includes(field);
                return (
                  <button
                    key={field}
                    type="button"
                    onClick={() => toggleField(field)}
                    aria-pressed={active}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[11px] font-bold transition-colors duration-150 ease-out ${
                    active ?
                    'border-brand-300 bg-brand-50 text-brand-700' :
                    'border-slate-200 bg-white text-ink-700 hover:border-brand-200 hover:bg-slate-50'}`
                    }>
                    
                    {active && <CheckIcon className="h-3 w-3" aria-hidden="true" />}
                    {field}
                  </button>);

              })}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-5">
            <p className="flex items-center gap-1.5 font-display text-sm font-bold text-ink">
              <Building2Icon className="h-4 w-4" aria-hidden="true" />
              Persoane fizice și juridice
            </p>
            <p className="mt-0.5 text-[11px] text-ink-500">
              Orice link acceptă ambele. Clientul comută pe firmă la checkout și
              completează: {companyFields.join(', ')}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              disabled={!canSave}
              onClick={submit}
              className="rounded-lg bg-brand-500 px-3.5 py-2.5 font-display text-sm font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600 disabled:bg-slate-200 disabled:text-ink-500">
              
              {editing ? 'Salvează modificările' : 'Generează linkul'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="text-sm font-semibold text-ink-500 underline-offset-4 hover:text-ink-700 hover:underline">
              
              Anulează
            </button>
          </div>
        </div>

        <CheckoutPreview
          product={draftProduct}
          extraFields={extraFields}
          allowCompany={allowCompany}
          url={link?.url ?? 'https://pay.friendly.ro/l/XXXXXX'} />
        
      </div>
    </section>);

}