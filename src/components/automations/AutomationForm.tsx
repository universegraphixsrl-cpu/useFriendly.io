import React from 'react';
import { PlusIcon, XIcon, TrashIcon } from 'lucide-react';
import { leadStatuses, type LeadList } from '../../data/leads';
import type { SubAccountRole } from '../../data/subAccounts';
import {
  describeAction,
  type Automation,
  type AutomationAction,
  type ActionKind } from
'../../lib/automations';

interface AutomationFormProps {
  value: Automation;
  lists: LeadList[];
  groups: SubAccountRole[];
  saving: boolean;
  error: string;
  onChange: (next: Automation) => void;
  onSave: () => void;
  onCancel: () => void;
}

const label = 'text-xs font-bold uppercase tracking-wide text-ink-500';
const field =
'mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-ink focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100';

const ACTION_LABELS: Record<ActionKind, string> = {
  assign: 'Atribuie leadul cuiva',
  set_status: 'Schimbă statusul',
  move_list: 'Mută leadul în altă listă',
  create_task: 'Creează un task'
};

function newAction(kind: ActionKind): AutomationAction {
  if (kind === 'assign') {
    return { kind, field: 'caller', mode: 'balanced', role: 'caller' };
  }
  if (kind === 'set_status') return { kind, status: leadStatuses[0] };
  if (kind === 'move_list') return { kind, list_id: '' };
  return { kind, title: '', assignee: 'owner', due_days: 1 };
}

/** Constructorul unei automatizări: când se întâmplă, și ce se face */
export function AutomationForm({
  value,
  lists,
  groups,
  saving,
  error,
  onChange,
  onSave,
  onCancel
}: AutomationFormProps) {
  const people = groups.flatMap((group) => group.members);
  const listName = (id: string) =>
  lists.find((item) => item.id === id)?.name ?? 'lista ștearsă';

  const patch = (changes: Partial<Automation>) =>
  onChange({ ...value, ...changes });

  const patchAction = (index: number, changes: Partial<AutomationAction>) =>
  onChange({
    ...value,
    actions: value.actions.map((action, position) =>
    position === index ? { ...action, ...changes } : action
    )
  });

  const addAction = (kind: ActionKind) =>
  onChange({ ...value, actions: [...value.actions, newAction(kind)] });

  const removeAction = (index: number) =>
  onChange({
    ...value,
    actions: value.actions.filter((_, position) => position !== index)
  });

  return (
    <section
      aria-labelledby="automation-form-title"
      className="mt-6 rounded-2xl border border-brand-200 bg-white p-5 sm:p-6">

      <div className="flex items-start justify-between gap-3">
        <div>
          <h2
            id="automation-form-title"
            className="font-display text-base font-extrabold tracking-tight text-ink">

            {value.name ? `Editezi „${value.name}"` : 'Automatizare nouă'}
          </h2>
          <p className="text-xs text-ink-500">
            Alege când pornește și ce face. Rulează pe serverele bazei de date,
            deci se întâmplă și când nu ești logat.
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Închide"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-500 transition-colors duration-150 ease-out hover:bg-slate-50 hover:text-ink">

          <XIcon className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-4">
        <label htmlFor="autoName" className={label}>
          Numele automatizării *
        </label>
        <input
          id="autoName"
          type="text"
          value={value.name}
          onChange={(event) => patch({ name: event.target.value })}
          placeholder="Ex.: Împarte leadurile din webinar"
          className={field} />

      </div>

      {/* --- Declanșatorul --- */}
      <p className="mt-5 text-[11px] font-bold uppercase tracking-wide text-brand-600">
        Când pornește
      </p>
      <div className="mt-2 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => patch({ triggerKind: 'lead_added_to_list' })}
          aria-pressed={value.triggerKind === 'lead_added_to_list'}
          className={`rounded-xl border p-4 text-left transition-colors duration-150 ease-out ${
          value.triggerKind === 'lead_added_to_list' ?
          'border-brand-300 bg-brand-50' :
          'border-slate-200 hover:border-brand-200'}`
          }>

          <p className="font-display text-sm font-bold text-ink">
            Intră un lead nou într-o listă
          </p>
          <p className="mt-1 text-xs leading-relaxed text-ink-500">
            Se întâmplă imediat, la adăugare sau la mutarea în listă.
          </p>
        </button>

        <button
          type="button"
          onClick={() => patch({ triggerKind: 'lead_idle' })}
          aria-pressed={value.triggerKind === 'lead_idle'}
          className={`rounded-xl border p-4 text-left transition-colors duration-150 ease-out ${
          value.triggerKind === 'lead_idle' ?
          'border-brand-300 bg-brand-50' :
          'border-slate-200 hover:border-brand-200'}`
          }>

          <p className="font-display text-sm font-bold text-ink">
            Un lead stă pe loc
          </p>
          <p className="mt-1 text-xs leading-relaxed text-ink-500">
            Verificat din 15 în 15 minute. Pornește o singură dată per lead.
          </p>
        </button>
      </div>

      {value.triggerKind === 'lead_added_to_list' ?
      <div className="mt-3">
          <label htmlFor="autoList" className={label}>
            În ce listă
          </label>
          <select
          id="autoList"
          value={value.triggerListId}
          onChange={(event) => patch({ triggerListId: event.target.value })}
          className={field}>

            <option value="">Orice listă</option>
            {lists.map((list) =>
          <option key={list.id} value={list.id}>
                {list.name}
              </option>
          )}
          </select>
        </div> :

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="autoDays" className={label}>
              După câte zile fără mișcare
            </label>
            <input
            id="autoDays"
            type="number"
            min={1}
            max={365}
            value={value.triggerDays}
            onChange={(event) =>
            patch({ triggerDays: Math.max(1, Number(event.target.value) || 1) })
            }
            className={field} />

          </div>
          <div>
            <label htmlFor="autoStatus" className={label}>
              Doar pentru leadurile în statusul
            </label>
            <select
            id="autoStatus"
            value={value.triggerStatus}
            onChange={(event) => patch({ triggerStatus: event.target.value })}
            className={field}>

              <option value="">Orice status</option>
              {leadStatuses.map((status) =>
            <option key={status} value={status}>
                  {status}
                </option>
            )}
            </select>
          </div>
        </div>
      }

      {/* --- Acțiunile --- */}
      <p className="mt-6 text-[11px] font-bold uppercase tracking-wide text-brand-600">
        Ce se întâmplă, în ordine
      </p>

      {value.actions.length === 0 &&
      <p className="mt-2 rounded-xl border border-dashed border-slate-300 p-4 text-center text-sm text-ink-500">
          Nicio acțiune încă. Alege una de mai jos.
        </p>
      }

      <ol className="mt-2 space-y-3">
        {value.actions.map((action, index) =>
        <li
          key={index}
          className="rounded-xl border border-slate-200 bg-slate-50 p-4">

            <div className="flex items-start justify-between gap-3">
              <p className="font-display text-sm font-bold text-ink">
                {index + 1}. {ACTION_LABELS[action.kind]}
              </p>
              <button
              type="button"
              onClick={() => removeAction(index)}
              aria-label="Șterge acțiunea"
              className="text-ink-500 transition-colors duration-150 ease-out hover:text-red-600">

                <TrashIcon className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {action.kind === 'assign' &&
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <div>
                  <label className={label}>Pe ce câmp</label>
                  <select
                value={action.field ?? 'owner'}
                onChange={(event) =>
                patchAction(index, {
                  field: event.target.value as 'owner' | 'caller'
                })
                }
                className={field}>

                    <option value="owner">Responsabil</option>
                    <option value="caller">Caller</option>
                  </select>
                </div>
                <div>
                  <label className={label}>Cum se alege</label>
                  <select
                value={action.mode ?? 'balanced'}
                onChange={(event) =>
                patchAction(index, {
                  mode: event.target.value as 'person' | 'balanced'
                })
                }
                className={field}>

                    <option value="balanced">Cel mai puțin încărcat</option>
                    <option value="person">O persoană anume</option>
                  </select>
                </div>
                <div>
                  {action.mode === 'person' ?
              <>
                      <label className={label}>Cine</label>
                      <select
                  value={action.name ?? ''}
                  onChange={(event) =>
                  patchAction(index, { name: event.target.value })
                  }
                  className={field}>

                        <option value="">Alege un om</option>
                        {people.map((person) =>
                  <option key={person} value={person}>
                            {person}
                          </option>
                  )}
                      </select>
                    </> :

              <>
                      <label className={label}>Din ce rol</label>
                      <select
                  value={action.role ?? 'caller'}
                  onChange={(event) =>
                  patchAction(index, { role: event.target.value as any })
                  }
                  className={field}>

                        <option value="caller">Calleri</option>
                        <option value="closer">Closeri</option>
                        <option value="marketer">Marketeri</option>
                        <option value="manager">Manageri</option>
                      </select>
                    </>
              }
                </div>
              </div>
          }

            {action.kind === 'set_status' &&
          <div className="mt-3">
                <label className={label}>Noul status</label>
                <select
              value={action.status ?? ''}
              onChange={(event) =>
              patchAction(index, { status: event.target.value })
              }
              className={field}>

                  {leadStatuses.map((status) =>
              <option key={status} value={status}>
                      {status}
                    </option>
              )}
                </select>
              </div>
          }

            {action.kind === 'move_list' &&
          <div className="mt-3">
                <label className={label}>În ce listă</label>
                <select
              value={action.list_id ?? ''}
              onChange={(event) =>
              patchAction(index, { list_id: event.target.value })
              }
              className={field}>

                  <option value="">Alege lista</option>
                  {lists.map((list) =>
              <option key={list.id} value={list.id}>
                      {list.name}
                    </option>
              )}
                </select>
              </div>
          }

            {action.kind === 'create_task' &&
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <div className="sm:col-span-3">
                  <label className={label}>Titlul task-ului</label>
                  <input
                type="text"
                value={action.title ?? ''}
                onChange={(event) =>
                patchAction(index, { title: event.target.value })
                }
                placeholder="Ex.: Sună leadul din nou"
                className={field} />

                </div>
                <div className="sm:col-span-2">
                  <label className={label}>Pentru cine</label>
                  <select
                value={action.assignee ?? 'owner'}
                onChange={(event) =>
                patchAction(index, { assignee: event.target.value })
                }
                className={field}>

                    <option value="owner">Responsabilul leadului</option>
                    <option value="caller">Callerul leadului</option>
                    {people.map((person) =>
                <option key={person} value={person}>
                        {person}
                      </option>
                )}
                  </select>
                </div>
                <div>
                  <label className={label}>Termen, peste</label>
                  <input
                type="number"
                min={0}
                max={365}
                value={action.due_days ?? 1}
                onChange={(event) =>
                patchAction(index, {
                  due_days: Math.max(0, Number(event.target.value) || 0)
                })
                }
                className={field} />

                  <p className="mt-1 text-[11px] text-ink-500">zile</p>
                </div>
              </div>
          }

            <p className="mt-3 border-l-2 border-slate-300 pl-3 text-xs text-ink-500">
              {describeAction(action, listName)}
            </p>
          </li>
        )}
      </ol>

      <div className="mt-3 flex flex-wrap gap-2">
        {(Object.keys(ACTION_LABELS) as ActionKind[]).map((kind) =>
        <button
          key={kind}
          type="button"
          onClick={() => addAction(kind)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-ink-700 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">

            <PlusIcon className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
            {ACTION_LABELS[kind]}
          </button>
        )}
      </div>

      {error &&
      <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
          {error}
        </p>
      }

      <div className="mt-5 flex items-center gap-2">
        <button
          type="button"
          onClick={onSave}
          disabled={saving || !value.name.trim() || value.actions.length === 0}
          className="rounded-lg bg-brand-500 px-3.5 py-2.5 font-display text-sm font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600 disabled:bg-slate-200 disabled:text-ink-500">

          {saving ? 'Se salvează…' : 'Salvează automatizarea'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm font-semibold text-ink-500 underline-offset-4 hover:text-ink-700 hover:underline">

          Anulează
        </button>
        {value.actions.length === 0 &&
        <span className="text-xs text-ink-500">
            Adaugă cel puțin o acțiune.
          </span>
        }
      </div>
    </section>);

}
