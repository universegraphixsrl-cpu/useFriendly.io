import React, { useState } from 'react';
import {
  PlusIcon,
  CopyIcon,
  RepeatIcon,
  PackagePlusIcon } from
'lucide-react';
import {
  billingLabel,
  formatPrice,
  initialPaymentLinks,
  initialProducts,
  type PaymentLink,
  type Product } from
'../data/payments';
import { PaymentLinkForm } from '../components/payments/PaymentLinkForm';
import { LinkRowMenu } from '../components/payments/LinkRowMenu';
import { ProductForm } from '../components/payments/ProductForm';
import { Toast } from '../components/Toast';

const randomCode = () => Math.random().toString(36).slice(2, 8).toUpperCase();

export function PaymentLinks() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [links, setLinks] = useState<PaymentLink[]>(initialPaymentLinks);
  const [creating, setCreating] = useState(false);
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2500);
  };

  const productFor = (link: PaymentLink) =>
  products.find((item) => item.id === link.productId);

  const editingLink = links.find((link) => link.id === editingId);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Linkuri de plată
          </h1>
          <p className="mt-1 text-sm text-ink-700">
            {links.length} linkuri · fiecare poate fi folosit de oricâți
            clienți, cu Apple Pay, Google Pay și card.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setCreating(false);
              setProductFormOpen((value) => !value);
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-ink-700 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
            
            <PackagePlusIcon className="h-4 w-4" aria-hidden="true" />
            Creează produs
          </button>
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setProductFormOpen(false);
              setCreating((value) => !value);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-3.5 py-2.5 font-display text-sm font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600">
            
            <PlusIcon
              className="h-4 w-4"
              strokeWidth={2.5}
              aria-hidden="true" />
            
            Creează link de plată
          </button>
        </div>
      </div>

      {productFormOpen &&
      <ProductForm
        onCreate={(product) => {
          setProducts((current) => [...current, product]);
          setProductFormOpen(false);
          showToast('Produs creat cu succes');
        }}
        onCancel={() => setProductFormOpen(false)} />

      }

      {creating &&
      <PaymentLinkForm
        products={products}
        onCreateProduct={(product) =>
        setProducts((current) => [...current, product])
        }
        onUpdateProduct={(product) =>
        setProducts((current) =>
        current.map((item) =>
        item.id === product.id ? product : item
        )
        )
        }
        onSubmit={(draft) => {
          setLinks((current) => [
          {
            id: `pay-${Date.now()}`,
            ...draft,
            url: `https://pay.friendly.ro/l/${randomCode()}`,
            createdOn: new Date().toLocaleDateString('ro-RO', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            }),
            active: true
          },
          ...current]
          );
          setCreating(false);
          showToast('Link de plată generat cu succes');
        }}
        onCancel={() => setCreating(false)} />

      }

      {editingLink &&
      <PaymentLinkForm
        key={editingLink.id}
        products={products}
        link={editingLink}
        onCreateProduct={(product) =>
        setProducts((current) => [...current, product])
        }
        onUpdateProduct={(product) =>
        setProducts((current) =>
        current.map((item) =>
        item.id === product.id ? product : item
        )
        )
        }
        onSubmit={(draft) => {
          setLinks((current) =>
          current.map((item) =>
          item.id === editingLink.id ? { ...item, ...draft } : item
          )
          );
          setEditingId(null);
          showToast('Link actualizat cu succes');
        }}
        onCancel={() => setEditingId(null)} />

      }

      <ul className="mt-6 space-y-3">
        {links.map((link) => {
          const product = productFor(link);
          return (
            <li key={link.id}>
              <div
                role="button"
                tabIndex={0}
                onClick={() => {
                  setCreating(false);
                  setProductFormOpen(false);
                  setEditingId(link.id);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setCreating(false);
                    setProductFormOpen(false);
                    setEditingId(link.id);
                  }
                }}
                style={{ borderLeftColor: product?.color ?? '#cbd5e1' }}
                className={`flex cursor-pointer flex-wrap items-center justify-between gap-3 overflow-hidden rounded-2xl border border-l-4 p-4 transition-colors duration-150 ease-out sm:p-5 ${
                link.active ? 'bg-white' : 'bg-slate-50'} ${

                editingId === link.id ?
                'border-brand-300 bg-brand-50' :
                'border-slate-200 hover:border-brand-200 hover:bg-brand-50'}`
                }>
                
                <div className="flex min-w-0 items-center gap-2">
                  <div onClick={(event) => event.stopPropagation()}>
                  <LinkRowMenu
                      active={link.active}
                      onEdit={() => {
                        setCreating(false);
                        setEditingId(link.id);
                      }}
                      onToggle={() =>
                      setLinks((current) =>
                      current.map((item) =>
                      item.id === link.id ?
                      { ...item, active: !item.active } :
                      item
                      )
                      )
                      }
                      onDelete={() =>
                      setLinks((current) =>
                      current.filter((item) => item.id !== link.id)
                      )
                      } />
                    
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-display text-sm font-bold text-ink">
                        {product?.name ?? 'Produs șters'}
                      </h2>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[11px] font-bold ${
                        link.active ?
                        'border-emerald-200 bg-emerald-50 text-emerald-700' :
                        'border-slate-200 bg-slate-100 text-ink-500'}`
                        }>
                        
                        {link.active ? 'Activ' : 'Dezactivat'}
                      </span>
                      {product?.recurring &&
                      <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-bold text-brand-700">
                          <RepeatIcon className="h-3 w-3" aria-hidden="true" />
                          {billingLabel(product)}
                        </span>
                      }
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setCreating(false);
                        setEditingId(link.id);
                      }}
                      className="mt-1 block max-w-full truncate text-xs font-semibold text-brand-600 underline-offset-4 hover:underline">
                      
                      {link.url}
                    </button>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <span className="font-display text-base font-extrabold text-ink">
                    {product ?
                    formatPrice(product.price, product.currency) :
                    '—'}
                  </span>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      showToast('Link copiat în clipboard');
                    }}
                    aria-label="Copiază linkul"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-ink-500 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
                    
                    <CopyIcon className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </li>);

        })}
      </ul>

      {toast && <Toast message={toast} />}
    </>);

}