import React, { useState } from 'react';
import { ChevronDownIcon, SearchIcon, InboxIcon } from 'lucide-react';
import {
  DateFilter,
  filterLabel,
  type LeadDateFilter } from
'../leads/DateFilter';

interface FormSubmissionsProps {
  /** Formularele disponibile; momentan lista e goală */
  forms: {id: string;name: string;}[];
}

/** Tabelul de completări de formular, cu filtre de formular și dată */
export function FormSubmissions({ forms }: FormSubmissionsProps) {
  const [dateFilter, setDateFilter] = useState<LeadDateFilter>({ kind: 'all' });
  const [formFilter, setFormFilter] = useState<string>('toate');
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState('');

  const activeForm = forms.find((form) => form.id === formFilter);

  return (
    <div className="mt-6 rounded-lg border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
        <div
          className="relative"
          onMouseEnter={() => setMenu(true)}
          onMouseLeave={() => setMenu(false)}>
          
          <button
            type="button"
            onClick={() => setMenu((current) => !current)}
            aria-expanded={menu}
            className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3.5 py-2.5 text-sm font-semibold text-ink-700 transition-colors duration-150 ease-out hover:bg-slate-50">
            
            {activeForm ? activeForm.name : 'Toate formularele'}
            <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
          </button>
          {menu &&
          <div className="menu-surface absolute left-0 top-full z-30 mt-1 w-60 rounded-md border border-slate-200 bg-white py-1 shadow-xl">
              {forms.length === 0 ?
            <p className="px-4 py-3 text-sm text-ink-500">
                  Niciun formular activ
                </p> :

            <>
                  <button
                type="button"
                onClick={() => {
                  setFormFilter('toate');
                  setMenu(false);
                }}
                className="flex w-full px-4 py-2.5 text-left text-sm font-semibold text-ink-700 hover:bg-slate-50">
                
                    Toate formularele
                  </button>
                  {forms.map((form) =>
              <button
                key={form.id}
                type="button"
                onClick={() => {
                  setFormFilter(form.id);
                  setMenu(false);
                }}
                className="flex w-full px-4 py-2.5 text-left text-sm font-semibold text-ink-700 hover:bg-slate-50">
                
                      {form.name}
                    </button>
              )}
                </>
            }
            </div>
          }
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="relative">
            <span className="sr-only">Caută în completări</span>
            <SearchIcon
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
              aria-hidden="true" />
            
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Caută…"
              className="w-52 rounded-md border border-slate-200 py-2.5 pl-9 pr-3 text-sm text-ink outline-none focus:border-brand-400" />
            
          </label>
          <DateFilter filter={dateFilter} onChange={setDateFilter} />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
        <h2 className="font-display text-lg font-bold text-ink">
          Toate completările
        </h2>
        <p className="text-sm text-ink-500">{filterLabel(dateFilter)}</p>
      </div>

      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-y border-slate-100 bg-slate-50/60 text-xs font-bold uppercase tracking-wide text-ink-500">
            <th scope="col" className="px-6 py-3 font-bold">
              Contact
            </th>
            <th scope="col" className="px-6 py-3 font-bold">
              Nume
            </th>
            <th scope="col" className="px-6 py-3 font-bold">
              Email
            </th>
            <th scope="col" className="px-6 py-3 font-bold">
              Formular
            </th>
            <th scope="col" className="w-52 px-6 py-3 font-bold">
              Data completării
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={5} className="px-6 py-20 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-slate-100 text-ink-400">
                <InboxIcon className="h-6 w-6" aria-hidden="true" />
              </span>
              <p className="mt-4 font-display text-lg font-bold text-ink">
                Nicio completare de formular pentru perioada selectată
              </p>
              <p className="mt-1.5 text-sm text-ink-500">
                Completările apar aici imediat ce cineva îți trimite un
                formular.
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>);

}