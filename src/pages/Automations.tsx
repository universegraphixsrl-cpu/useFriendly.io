import React, { useState } from 'react';
import {
  PlusIcon,
  ZapIcon,
  ActivityIcon,
  PencilIcon,
  TrashIcon,
  AlertTriangleIcon } from
'lucide-react';
import { AutomationForm } from '../components/automations/AutomationForm';
import { NotConnectedNotice } from '../components/NotConnectedNotice';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { useTeam } from '../lib/team';
import {
  useAutomations,
  blankAutomation,
  describeTrigger,
  describeAction,
  testAutomation,
  type Automation } from
'../lib/automations';

/** Cât de demult, scris scurt: „acum 4 min", „acum 2 ore", „ieri" */
function ago(iso: string) {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const minutes = Math.round((Date.now() - then) / 60000);
  if (minutes < 1) return 'chiar acum';
  if (minutes < 60) return `acum ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `acum ${hours} ${hours === 1 ? 'oră' : 'ore'}`;
  const days = Math.round(hours / 24);
  return days === 1 ? 'ieri' : `acum ${days} zile`;
}

export function Automations() {
  const { lists, leads } = useWorkspace();
  const { groups } = useTeam();
  const { items, runs, loading, error, save, remove } = useAutomations();

  const [editing, setEditing] = useState<Automation | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  /** Proba: ce regulă se testează, pe ce lead, și ce a ieșit */
  const [testing, setTesting] = useState<string | null>(null);
  const [testLead, setTestLead] = useState('');
  const [testResult, setTestResult] = useState('');
  const [testRunning, setTestRunning] = useState(false);

  const listName = (id: string) =>
  lists.find((item) => item.id === id)?.name ?? 'lista ștearsă';

  const active = items.filter((item) => item.active).length;
  const lastDay = runs.filter(
    (run) => Date.now() - new Date(run.ranAt).getTime() < 86_400_000
  ).length;

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    const message = await save(editing);
    setSaving(false);
    if (message) {
      setFormError(message);
      return;
    }
    setFormError('');
    setEditing(null);
  };

  const toggle = async (item: Automation) => {
    await save({ ...item, active: !item.active });
  };

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Automatizări
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-700">
            Reguli care lucrează singure: împart leadurile noi și prind leadurile
            uitate. Rulează pe serverele bazei de date, deci se întâmplă și
            noaptea, chiar dacă nu e nimeni logat.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setFormError('');
            setEditing(blankAutomation());
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-3.5 py-2.5 font-display text-sm font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600">

          <PlusIcon className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
          Creează automatizare
        </button>
      </div>

      <NotConnectedNotice title="Ce pot și ce nu pot face automatizările">
        Pot atribui leaduri, schimba statusuri, muta leaduri între liste și crea
        task-uri — toate se întâmplă cu adevărat. <strong>Nu pot încă trimite
        emailuri sau SMS-uri</strong>, pentru că nu avem conectat un serviciu de
        trimitere.
      </NotConnectedNotice>

      {error &&
      <p className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-700">
          <AlertTriangleIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      }

      <dl className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
        { label: 'Automatizări active', value: String(active), note: `din ${items.length} create` },
        { label: 'Acțiuni în ultimele 24h', value: String(lastDay), note: 'înregistrate în jurnal' },
        { label: 'Verificare leaduri uitate', value: '15 min', note: 'cât de des rulează ceasul' }].
        map((stat) =>
        <div
          key={stat.label}
          className="rounded-2xl border border-slate-200 bg-white p-5">

            <dt className="text-xs font-bold uppercase tracking-wide text-ink-500">
              {stat.label}
            </dt>
            <dd className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink">
              {stat.value}
            </dd>
            <p className="mt-1 text-xs text-ink-500">{stat.note}</p>
          </div>
        )}
      </dl>

      {editing &&
      <AutomationForm
        value={editing}
        lists={lists}
        groups={groups}
        saving={saving}
        error={formError}
        onChange={setEditing}
        onSave={() => void handleSave()}
        onCancel={() => {
          setEditing(null);
          setFormError('');
        }} />

      }

      <section
        aria-labelledby="rules-title"
        className="mt-6 rounded-2xl border border-slate-200 bg-white">

        <div className="border-b border-slate-100 px-5 py-4">
          <h2
            id="rules-title"
            className="font-display text-base font-extrabold tracking-tight text-ink">

            Regulile tale
          </h2>
          <p className="text-xs text-ink-500">
            O regulă oprită rămâne salvată, dar nu se mai execută.
          </p>
        </div>

        {loading ?
        <p className="px-5 py-8 text-center text-sm text-ink-500">Se încarcă…</p> :
        items.length === 0 ?
        <p className="px-5 py-10 text-center text-sm text-ink-500">
            Nicio automatizare încă. Cel mai util prim exemplu: „când intră un
            lead nou în lista de înscriși, atribuie-l callerului cu cele mai
            puține leaduri".
          </p> :

        <ul className="divide-y divide-slate-100">
            {items.map((item) =>
          <li key={item.id} className="px-5 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-[220px] flex-1">
                    <p className="flex items-center gap-2 font-display text-sm font-bold text-ink">
                      <ZapIcon
                    className={`h-4 w-4 ${item.active ? 'text-brand-500' : 'text-ink-500'}`}
                    aria-hidden="true" />

                      {item.name}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-ink-700">
                      {describeTrigger(item, listName)}
                    </p>
                    <ul className="mt-2 space-y-1">
                      {item.actions.map((action, index) =>
                  <li
                    key={index}
                    className="flex items-start gap-2 text-xs text-ink-500">

                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-400" />
                          {describeAction(action, listName)}
                        </li>
                  )}
                    </ul>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                  type="button"
                  onClick={() => void toggle(item)}
                  aria-pressed={item.active}
                  className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                  item.active ?
                  'bg-emerald-100 text-emerald-800' :
                  'bg-slate-100 text-ink-500'}`
                  }>

                      {item.active ? 'Activă' : 'Oprită'}
                    </button>
                    <button
                  type="button"
                  onClick={() => {
                    setTestResult('');
                    setTestLead('');
                    setTesting(testing === item.id ? null : item.id);
                  }}
                  className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-ink-700 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
                  
                      Testează
                    </button>
                    <button
                  type="button"
                  onClick={() => {
                    setFormError('');
                    setEditing(item);
                  }}
                  aria-label={`Editează ${item.name}`}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-500 transition-colors duration-150 ease-out hover:bg-slate-50 hover:text-ink">

                      <PencilIcon className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                  type="button"
                  onClick={() => setConfirmDelete(item.id)}
                  aria-label={`Șterge ${item.name}`}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-500 transition-colors duration-150 ease-out hover:bg-red-50 hover:text-red-600">

                      <TrashIcon className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {testing === item.id &&
            <div className="mt-3 rounded-lg border border-brand-200 bg-brand-50 p-3">
                    <p className="text-xs leading-relaxed text-ink-700">
                      Alege un lead și regula se execută pe el <strong>acum</strong>,
                      fără să aștepți. Modificările sunt reale — alege un lead de
                      test, nu unul adevărat.
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <select
                  value={testLead}
                  onChange={(event) => setTestLead(event.target.value)}
                  className="min-w-[200px] flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-ink">
                  
                        <option value="">Alege un lead</option>
                        {leads.map((lead) =>
                  <option key={lead.id} value={lead.id}>
                            {lead.firstName} {lead.lastName} — {lead.status}
                          </option>
                  )}
                      </select>
                      <button
                  type="button"
                  disabled={!testLead || testRunning}
                  onClick={async () => {
                    setTestRunning(true);
                    const message = await testAutomation(item.id, testLead);
                    setTestRunning(false);
                    setTestResult(message);
                  }}
                  className="rounded-lg bg-brand-500 px-3 py-2 text-xs font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600 disabled:bg-slate-200 disabled:text-ink-500">
                  
                        {testRunning ? 'Rulează…' : 'Rulează proba'}
                      </button>
                    </div>
                    {testResult &&
                <p className="mt-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-ink">
                        {testResult}
                      </p>
                }
                  </div>
            }

                {confirmDelete === item.id &&
            <div className="mt-3 flex flex-wrap items-center gap-3 rounded-lg bg-red-50 px-3 py-2.5">
                    <p className="text-sm font-semibold text-red-800">
                      Ștergi „{item.name}"? Nu se mai poate recupera.
                    </p>
                    <button
                type="button"
                onClick={() => {
                  void remove(item.id);
                  setConfirmDelete(null);
                }}
                className="rounded-lg bg-red-600 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-red-700">

                      Șterge
                    </button>
                    <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                className="text-xs font-bold text-ink-700 underline-offset-4 hover:underline">

                      Renunță
                    </button>
                  </div>
            }
              </li>
          )}
          </ul>
        }
      </section>

      <section
        aria-labelledby="activity-title"
        className="mt-6 rounded-2xl border border-slate-200 bg-white">

        <div className="flex items-center gap-2.5 border-b border-slate-100 px-5 py-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <ActivityIcon className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
          <div>
            <h2
              id="activity-title"
              className="font-display text-base font-extrabold tracking-tight text-ink">

              Ce s-a întâmplat
            </h2>
            <p className="text-xs text-ink-500">
              Fiecare acțiune executată, cu ora ei. Aici verifici că o regulă
              chiar a făcut ce trebuia.
            </p>
          </div>
        </div>

        {runs.length === 0 ?
        <p className="px-5 py-10 text-center text-sm text-ink-500">
            Nimic încă. După ce creezi o regulă și adaugi un lead care o
            declanșează, apare aici în câteva secunde.
          </p> :

        <ul className="divide-y divide-slate-100">
            {runs.map((run) => {
            const rule = items.find((item) => item.id === run.automationId);
            return (
              <li
                key={run.id}
                className="flex flex-wrap items-start justify-between gap-3 px-5 py-3">

                  <div className="min-w-[200px] flex-1">
                    <p className="text-sm text-ink-700">
                      <span className="font-semibold text-ink">
                        {rule?.name ?? 'Automatizare ștearsă'}
                      </span>{' '}
                      — {run.summary}
                    </p>
                    {run.detail &&
                  <p className="mt-0.5 text-xs text-red-700">{run.detail}</p>
                  }
                  </div>
                  <div className="flex items-center gap-2">
                    {run.status !== 'ok' &&
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-bold text-red-800">
                        eroare
                      </span>
                  }
                    <span className="text-xs text-ink-500">{ago(run.ranAt)}</span>
                  </div>
                </li>);

          })}
          </ul>
        }
      </section>
    </>);

}
