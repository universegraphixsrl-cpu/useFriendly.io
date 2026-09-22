import React, { useState } from 'react';
import { XIcon } from 'lucide-react';

export interface ActionField {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
}

type Modal =
{
  kind: 'form';
  title: string;
  description?: string;
  fields: ActionField[];
  submitLabel: string;
  onSubmit: (values: Record<string, string>) => void;
} |
{
  kind: 'confirm';
  title: string;
  description: string;
  confirmLabel: string;
  danger?: boolean;
  onConfirm: () => void;
} |
{
  kind: 'menu';
  title: string;
  description?: string;
  actions: Array<{label: string;danger?: boolean;onClick: () => void;}>;
};

interface ActionModalProps {
  modal: Modal;
  onClose: () => void;
}

export function ActionModal({ modal, onClose }: ActionModalProps) {
  const [values, setValues] = useState<Record<string, string>>({});

  return (
    <div
      data-ui-modal="true"
      className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/50 px-4"
      onClick={onClose}>
      
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="action-modal-title"
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}>
        
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2
              id="action-modal-title"
              className="font-display text-xl font-bold text-ink">
              
              {modal.title}
            </h2>
            {modal.description &&
            <p className="mt-1 text-sm text-ink-500">{modal.description}</p>
            }
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Închide"
            className="rounded-lg p-1.5 text-ink-500 transition-colors duration-150 ease-out hover:bg-slate-50 hover:text-ink">
            
            <XIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {modal.kind === 'form' &&
        <form
          className="mt-5 space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            modal.onSubmit(values);
          }}>
          
            {modal.fields.map((field) =>
          <label key={field.name} className="block text-sm font-semibold text-ink-700">
                {field.label}
                <input
              type={field.type ?? 'text'}
              value={values[field.name] ?? ''}
              placeholder={field.placeholder}
              onChange={(event) =>
              setValues((current) => ({
                ...current,
                [field.name]: event.target.value
              }))
              }
              className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-ink focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100" />
            
              </label>
          )}
            <div className="flex justify-end gap-2 pt-2">
              <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-slate-200 px-4 py-2.5 text-sm font-semibold text-ink-700 hover:bg-slate-50">
              
                Anulează
              </button>
              <button
              type="submit"
              className="rounded-md bg-brand-500 px-4 py-2.5 font-display text-sm font-bold text-white hover:bg-brand-600">
              
                {modal.submitLabel}
              </button>
            </div>
          </form>
        }

        {modal.kind === 'confirm' &&
        <div className="mt-6 flex justify-end gap-2">
            <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-200 px-4 py-2.5 text-sm font-semibold text-ink-700 hover:bg-slate-50">
            
              Anulează
            </button>
            <button
            type="button"
            onClick={modal.onConfirm}
            className={`rounded-md px-4 py-2.5 font-display text-sm font-bold text-white ${
            modal.danger ? 'bg-red-500 hover:bg-red-600' : 'bg-brand-500 hover:bg-brand-600'}`
            }>
            
              {modal.confirmLabel}
            </button>
          </div>
        }

        {modal.kind === 'menu' &&
        <div className="mt-4 space-y-1">
            {modal.actions.map((action) =>
          <button
            key={action.label}
            type="button"
            onClick={action.onClick}
            className={`flex w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition-colors duration-150 ease-out hover:bg-slate-50 ${
            action.danger ? 'text-red-600' : 'text-ink-700'}`
            }>
            
                {action.label}
              </button>
          )}
          </div>
        }
      </div>
    </div>);

}
