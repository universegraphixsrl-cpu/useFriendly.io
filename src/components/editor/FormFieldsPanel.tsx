import React, { useState } from "react";
import { AtSignIcon, BanIcon, Building2Icon, ChevronLeftIcon, GlobeIcon, GripVerticalIcon, HashIcon, HomeIcon, MailIcon, MapPinIcon, MapPinnedIcon, MinusIcon, PhoneIcon, PlusIcon, SendIcon, SquareCheckIcon, Trash2Icon, UserRoundIcon, BoxIcon } from "lucide-react";
import { createFormField, formFieldCatalog, formFieldMeta, FormField, FormFieldKind } from "../../data/editor";
/** Iconița afișată în dreptul fiecărui tip de câmp */
export const fieldIcons: Record<FormFieldKind, typeof UserRoundIcon> = {
  firstName: UserRoundIcon,
  lastName: UserRoundIcon,
  email: AtSignIcon,
  phone: PhoneIcon,
  company: Building2Icon,
  country: GlobeIcon,
  state: MapPinIcon,
  city: MapPinnedIcon,
  neighborhood: HomeIcon,
  street: MapPinnedIcon,
  streetNumber: HashIcon,
  postalCode: MailIcon,
  taxNumber: BoxIcon,
  checkbox: SquareCheckIcon
};

/** Iconițele pe care le poate afișa un câmp în pagină */
const iconChoices = [{
  key: '',
  label: 'Fără iconiță'
}, {
  key: 'user',
  label: 'Persoană'
}, {
  key: 'mail',
  label: 'Plic'
}, {
  key: 'phone',
  label: 'Telefon'
}, {
  key: 'building',
  label: 'Clădire'
}, {
  key: 'pin',
  label: 'Locație'
}];
interface FormFieldsPanelProps {
  fields: FormField[];
  onChange: (fields: FormField[]) => void;
  /** Setările butonului de trimitere */
  button: {
    text: string;
    subtext: string;
    icon: string;
  };
  onButtonChange: (patch: {
    formButtonText?: string;
    formButtonSubtext?: string;
    formButtonIcon?: string;
  }) => void;
}

/** Lista de câmpuri a formularului: reordonare, editare, adăugare */
export function FormFieldsPanel({
  fields,
  onChange,
  button,
  onButtonChange
}: FormFieldsPanelProps) {
  const [view, setView] = useState<'list' | 'add' | string>('list');
  const [dragId, setDragId] = useState<string | null>(null);
  const editing = fields.find((field) => field.id === view);
  const patch = (id: string, next: Partial<FormField>) => onChange(fields.map((field) => field.id === id ? {
    ...field,
    ...next
  } : field));
  const remove = (id: string) => {
    onChange(fields.filter((field) => field.id !== id));
    setView('list');
  };
  const reorder = (from: string, to: string) => {
    if (from === to) return;
    const next = [...fields];
    const fromIndex = next.findIndex((field) => field.id === from);
    const toIndex = next.findIndex((field) => field.id === to);
    if (fromIndex === -1 || toIndex === -1) return;
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    onChange(next);
  };
  const checkboxCount = fields.filter((field) => field.kind === 'checkbox').length;
  const toggleKind = (kind: FormFieldKind, on: boolean) => {
    if (on) {
      onChange([...fields, createFormField(kind)]);
      return;
    }
    onChange(fields.filter((field) => field.kind !== kind));
  };
  if (editing) {
    const meta = formFieldMeta(editing.kind);
    return <section className="mt-6">
        <button type="button" onClick={() => setView('list')} className="flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-2 text-sm font-bold text-ink transition-colors duration-150 ease-out hover:bg-slate-50">
          <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
          Înapoi
        </button>

        <h3 className="mt-5 font-display text-xl font-bold text-ink">
          {meta.label}
        </h3>

        <label className="mt-4 block">
          <span className="text-sm font-semibold text-ink-500">
            Text sugestie (placeholder)
          </span>
          <input type="text" value={editing.placeholder} onChange={(event) => patch(editing.id, {
          placeholder: event.target.value
        })} className="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm text-ink focus:border-brand-500 focus:outline-none" />
        </label>

        <label className="mt-4 flex cursor-pointer items-center gap-3 text-sm font-semibold text-ink">
          <input type="checkbox" checked={editing.optional} onChange={(event) => patch(editing.id, {
          optional: event.target.checked
        })} className="h-5 w-5 rounded border-slate-300 accent-brand-500" />
          Opțional
          <span title="Câmpurile opționale nu blochează trimiterea formularului" className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-ink-500">
            ?
          </span>
        </label>

        {editing.kind !== 'checkbox' && <div className="mt-4">
            <p className="text-sm font-semibold text-ink-500">
              Selector iconiță
            </p>
            <div className="mt-1.5 flex items-center gap-3">
              <select value={editing.icon} onChange={(event) => patch(editing.id, {
            icon: event.target.value
          })} aria-label="Iconița câmpului" className="flex-1 rounded-md border border-slate-200 px-3 py-2.5 text-sm font-semibold text-ink focus:border-brand-500 focus:outline-none">
                {iconChoices.map((choice) => <option key={choice.key} value={choice.key}>
                    {choice.label}
                  </option>)}
              </select>
              <button type="button" onClick={() => patch(editing.id, {
            icon: ''
          })} aria-label="Fără iconiță" className="rounded-md p-2 text-ink-500 transition-colors duration-150 ease-out hover:bg-slate-100">
                <BanIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>}

        <button type="button" onClick={() => remove(editing.id)} className="mt-6 flex items-center gap-2 text-sm font-bold text-red-500 transition-colors duration-150 ease-out hover:text-red-600">
          <Trash2Icon className="h-4 w-4" aria-hidden="true" />
          Șterge câmpul
        </button>
      </section>;
  }
  if (view === 'submit') {
    return (
      <section className="mt-6">
        <button
          type="button"
          onClick={() => setView('list')}
          className="flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-2 text-sm font-bold text-ink transition-colors duration-150 ease-out hover:bg-slate-50">
          
          <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
          Înapoi
        </button>

        <h3 className="mt-5 font-display text-xl font-bold text-ink">
          Buton de trimitere
        </h3>

        <label className="mt-4 block">
          <span className="text-sm font-semibold text-ink-500">
            Text pe buton
          </span>
          <input
            type="text"
            value={button.text}
            onChange={(event) =>
            onButtonChange({ formButtonText: event.target.value })
            }
            className="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm text-ink focus:border-brand-500 focus:outline-none" />
          
        </label>

        <label className="mt-4 block">
          <span className="text-sm font-semibold text-ink-500">
            Text secundar (subtext)
          </span>
          <input
            type="text"
            value={button.subtext}
            onChange={(event) =>
            onButtonChange({ formButtonSubtext: event.target.value })
            }
            className="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm text-ink focus:border-brand-500 focus:outline-none" />
          
        </label>

        <div className="mt-4">
          <p className="text-sm font-semibold text-ink-500">
            Selector iconiță (înainte de text)
          </p>
          <div className="mt-1.5 flex items-center gap-3">
            <select
              value={button.icon}
              onChange={(event) =>
              onButtonChange({ formButtonIcon: event.target.value })
              }
              aria-label="Iconița butonului"
              className="flex-1 rounded-md border border-slate-200 px-3 py-2.5 text-sm font-semibold text-ink focus:border-brand-500 focus:outline-none">
              
              {iconChoices.map((choice) =>
              <option key={choice.key} value={choice.key}>
                  {choice.label}
                </option>
              )}
            </select>
            <button
              type="button"
              onClick={() => onButtonChange({ formButtonIcon: '' })}
              aria-label="Fără iconiță"
              className="rounded-md p-2 text-ink-500 transition-colors duration-150 ease-out hover:bg-slate-100">
              
              <BanIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>);

  }

  if (view === 'add') {
    const groups: Array<{
      key: string;
      kinds: FormFieldKind[];
    }> = [{
      key: 'name',
      kinds: ['firstName', 'lastName']
    }, {
      key: 'contact',
      kinds: ['email', 'phone', 'company', 'country']
    }, {
      key: 'address',
      kinds: ['state', 'city', 'neighborhood', 'street', 'streetNumber', 'postalCode', 'taxNumber']
    }];
    return <section className="mt-6">
        <button type="button" onClick={() => setView('list')} className="flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-2 text-sm font-bold text-ink transition-colors duration-150 ease-out hover:bg-slate-50">
          <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
          Înapoi
        </button>

        <h3 className="mt-5 font-display text-xl font-bold text-ink">
          Adaugă un câmp nou
        </h3>

        {groups.map((group) => <div key={group.key} className="mt-4 space-y-1 border-t border-slate-200 pt-4 first:border-0 first:pt-0">
            {group.kinds.map((kind) => {
          const meta = formFieldMeta(kind);
          const Icon = fieldIcons[kind];
          const active = fields.some((field) => field.kind === kind);
          return <div key={kind} className="flex items-center gap-3 rounded-md py-1.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-100 text-ink-700">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="flex-1 text-sm font-semibold text-ink">
                    {meta.label}
                  </span>
                  <button type="button" role="switch" aria-checked={active} aria-label={meta.label} onClick={() => toggleKind(kind, !active)} className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-150 ease-out ${active ? 'bg-brand-500' : 'bg-slate-200'}`}>
                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-150 ease-out ${active ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
                  </button>
                </div>;
        })}
          </div>)}

        <div className="mt-4 flex items-center gap-3 border-t border-slate-200 pt-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-100 text-ink-700">
            <SquareCheckIcon className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="flex-1 text-sm font-semibold text-ink">Checkbox</span>
          <div className="flex items-center gap-2">
            <button type="button" aria-label="Scade numărul de checkbox-uri" onClick={() => {
            const last = [...fields].reverse().find((field) => field.kind === 'checkbox');
            if (last) onChange(fields.filter((f) => f.id !== last.id));
          }} className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-ink-700 transition-colors duration-150 ease-out hover:bg-slate-200">
              <MinusIcon className="h-4 w-4" aria-hidden="true" />
            </button>
            <span className="w-4 text-center text-sm font-bold text-ink">
              {checkboxCount}
            </span>
            <button type="button" aria-label="Adaugă un checkbox" onClick={() => onChange([...fields, createFormField('checkbox')])} className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-ink-700 transition-colors duration-150 ease-out hover:bg-slate-200">
              <PlusIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>;
  }
  return <section className="mt-6">
      <h3 className="font-display text-base font-bold text-ink">Câmpuri</h3>
      <div className="mt-3 space-y-1">
        {fields.map((field) => {
        const meta = formFieldMeta(field.kind);
        const Icon = fieldIcons[field.kind];
        return <div key={field.id} draggable onDragStart={() => setDragId(field.id)} onDragOver={(event) => event.preventDefault()} onDrop={() => {
          if (dragId) reorder(dragId, field.id);
          setDragId(null);
        }} className="group flex items-center gap-2 rounded-md py-1 transition-colors duration-150 ease-out hover:bg-slate-100">
              <GripVerticalIcon className="h-4 w-4 shrink-0 cursor-grab text-ink-400" aria-hidden="true" />
              <button type="button" onClick={() => setView(field.id)} className="flex min-w-0 flex-1 items-center gap-3 py-1 text-left">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-100 text-ink-700">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="truncate text-sm font-semibold text-ink">
                  {meta.label}
                </span>
              </button>
              <button type="button" onClick={() => remove(field.id)} aria-label={`Șterge ${meta.label}`} className="mr-2 hidden rounded p-1 text-red-500 transition-colors duration-150 ease-out hover:text-red-600 group-hover:block">
                <Trash2Icon className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>;
      })}

        <button
        type="button"
        onClick={() => setView('submit')}
        className="flex w-full items-center gap-3 rounded-md py-1 pl-6 text-left transition-colors duration-150 ease-out hover:bg-slate-100">
        
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-100 text-ink-700">
            <SendIcon className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold text-ink">
            Buton de trimitere
          </span>
        </button>
      </div>

      <button type="button" onClick={() => setView('add')} className="mt-4 flex w-full items-center justify-between border-t border-slate-200 pt-4 text-sm font-bold text-ink transition-colors duration-150 ease-out hover:text-brand-600">
        Adaugă un câmp nou
        <PlusIcon className="h-4 w-4" aria-hidden="true" />
      </button>
    </section>;
}