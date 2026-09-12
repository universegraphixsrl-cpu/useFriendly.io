import React from 'react';
import { callerNames, type Lead } from '../../data/leads';
import { formatEur, formatPercent } from '../../data/kpis';

interface CallerPerformanceTableProps {
  /** Leadurile din perioada selectată, la nivel de echipă */
  leads: Lead[];
  /** Dacă e setat, se afișează doar rândul acelui caller */
  activeCaller: string | null;
  period: string;
}

/** Performanța callerilor: leaduri alocate, Vocaroo și înregistrări video */
export function CallerPerformanceTable({
  leads,
  activeCaller,
  period
}: CallerPerformanceTableProps) {
  const rows = callerNames.
  filter((name) => !activeCaller || name === activeCaller).
  map((name) => {
    const own = leads.filter((lead) => lead.caller === name);
    const vocaroo = own.filter((lead) => lead.vocarooLink.trim()).length;
    const video = own.filter((lead) => lead.zoomLink.trim()).length;
    const collected = own.reduce((sum, lead) => sum + lead.paidAmount, 0);
    return {
      name,
      allocated: own.length,
      vocaroo,
      video,
      signed: own.filter((lead) => lead.status === 'Semnat').length,
      collected,
      commission: Math.round(collected * 0.03)
    };
  });

  const totals = rows.reduce(
    (sum, row) => ({
      allocated: sum.allocated + row.allocated,
      vocaroo: sum.vocaroo + row.vocaroo,
      video: sum.video + row.video,
      signed: sum.signed + row.signed,
      collected: sum.collected + row.collected,
      commission: sum.commission + row.commission
    }),
    {
      allocated: 0,
      vocaroo: 0,
      video: 0,
      signed: 0,
      collected: 0,
      commission: 0
    }
  );

  if (rows.length === 0) return null;

  return (
    <section
      aria-labelledby="callers-title"
      className="rounded-2xl border border-slate-200 bg-white">
      
      <div className="border-b border-slate-100 px-5 py-4">
        <h2
          id="callers-title"
          className="font-display text-lg font-extrabold tracking-tight text-ink">
          
          Performanța callerilor
        </h2>
        <p className="text-sm text-ink-500">
          Lead-uri alocate, Vocaroo-uri, înregistrări video și comision 3% ·{' '}
          {period}
        </p>
        <p className="mt-1 text-xs text-ink-500">
          Sumele colectate apar aici doar informativ — ele sunt deja numărate la
          closeri, deci nu se adună a doua oară în totalurile echipei.
        </p>
      </div>

      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="text-xs font-bold uppercase tracking-wide text-ink-500">
            <th scope="col" className="px-5 py-3 font-bold">
              Caller
            </th>
            <th scope="col" className="px-5 py-3 font-bold">
              Lead-uri alocate
            </th>
            <th scope="col" className="px-5 py-3 font-bold">
              Vocaroo-uri încărcate
            </th>
            <th scope="col" className="px-5 py-3 font-bold">
              Înreg. video încărcate
            </th>
            <th scope="col" className="px-5 py-3 font-bold">
              Clienți noi semnați
            </th>
            <th scope="col" className="px-5 py-3 font-bold">
              Sumă colectată
            </th>
            <th scope="col" className="px-5 py-3 font-bold">
              Comision 3%
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row) =>
          <tr key={row.name}>
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 font-display text-[11px] font-bold text-amber-700">
                    {row.name.
                  split(' ').
                  map((part) => part[0]).
                  join('')}
                  </span>
                  <div>
                    <p className="font-display text-sm font-bold text-ink">
                      {row.name}
                    </p>
                    <p className="text-xs text-ink-500">Caller</p>
                  </div>
                </div>
              </td>
              <td className="px-5 py-4">
                <p className="text-sm font-semibold text-ink">
                  {row.allocated}
                </p>
                <p className="text-xs text-ink-500">
                  {formatPercent(
                  totals.allocated ?
                  row.allocated / totals.allocated * 100 :
                  0
                )}{' '}
                  din leadurile alocate
                </p>
              </td>
              <td className="px-5 py-4">
                <p className="text-sm font-semibold text-ink">{row.vocaroo}</p>
                <p className="text-xs text-ink-500">
                  {formatPercent(
                  row.allocated ? row.vocaroo / row.allocated * 100 : 0
                )}{' '}
                  din leadurile lui
                </p>
              </td>
              <td className="px-5 py-4">
                <p className="text-sm font-semibold text-ink">{row.video}</p>
                <p className="text-xs text-ink-500">apeluri înregistrate</p>
              </td>
              <td className="px-5 py-4 text-sm font-semibold text-ink">
                {row.signed}
              </td>
              <td className="px-5 py-4 text-sm font-semibold text-ink">
                {formatEur(row.collected)}
              </td>
              <td className="px-5 py-4 text-sm font-bold text-brand-600">
                {formatEur(row.commission)}
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr className="border-t border-slate-200 bg-slate-50 text-sm font-bold text-ink">
            <td className="px-5 py-3">Total echipă</td>
            <td className="px-5 py-3">{totals.allocated}</td>
            <td className="px-5 py-3">{totals.vocaroo}</td>
            <td className="px-5 py-3">{totals.video}</td>
            <td className="px-5 py-3">{totals.signed}</td>
            <td className="px-5 py-3">{formatEur(totals.collected)}</td>
            <td className="px-5 py-3 text-brand-600">
              {formatEur(totals.commission)}
            </td>
          </tr>
        </tfoot>
      </table>
    </section>);

}