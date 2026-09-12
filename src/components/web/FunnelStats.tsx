import React, { useState } from 'react';
import type { FunnelStep } from '../../data/funnels';
import { DateFilter, type LeadDateFilter } from '../leads/DateFilter';

/** Cât din traficul total intră în perioada aleasă */
function periodShare(filter: LeadDateFilter): number {
  if (filter.kind === 'all') return 1;
  if (filter.kind === 'day') return 0.05;
  if (filter.kind === 'month') return 0.6;
  if (filter.kind === 'lastDays') return Math.min(1, filter.days / 45);
  const days =
  (new Date(filter.end).getTime() - new Date(filter.start).getTime()) /
  86_400_000 +
  1;
  return Math.min(1, days / 45);
}

interface FunnelStatsProps {
  steps: FunnelStep[];
}

/** Cifre stabile per pas, derivate din id — aceleași la fiecare randare */
function statsFor(step: FunnelStep) {
  const seed = step.id.
  split('').
  reduce((total, char) => total + char.charCodeAt(0), 0);
  const views = 20 + seed * 37 % 780;
  const rate = seed * 13 % 90 / 10; // 0 – 8,9%
  const optIns = Math.round(views * rate / 100);
  return {
    views,
    optIns,
    rate: views === 0 ? 0 : optIns / views * 100
  };
}

/** Tabelul de statistici pe pașii unui funnel: vizualizări, opt-ins, conversie */
export function FunnelStats({ steps }: FunnelStatsProps) {
  const [help, setHelp] = useState(false);
  const [rateHelp, setRateHelp] = useState(false);
  const [dateFilter, setDateFilter] = useState<LeadDateFilter>({ kind: 'all' });

  // perioada mai scurtă înseamnă proporțional mai puțin trafic
  const share = periodShare(dateFilter);
  const rows = steps.map((step, index) => {
    const base = statsFor(step);
    const views = Math.round(base.views * share);
    const optIns = Math.round(base.optIns * share);
    // add to cart apare abia de la a 4-a pagină, vânzările de la a 5-a
    const addToCart = index >= 3 ? Math.max(1, Math.round(views * 0.14)) : 0;
    const orders = index >= 4 ? Math.max(1, Math.round(addToCart * 0.42)) : 0;
    return {
      step,
      views,
      optIns,
      rate: views === 0 ? 0 : optIns / views * 100,
      addToCart,
      orders,
      revenue: orders * 780
    };
  });
  const totalViews = rows.reduce((total, row) => total + row.views, 0);
  const totalOptIns = rows.reduce((total, row) => total + row.optIns, 0);
  const totalRate = totalViews === 0 ? 0 : totalOptIns / totalViews * 100;
  const totalCarts = rows.reduce((total, row) => total + row.addToCart, 0);
  const sales = rows.reduce((total, row) => total + row.orders, 0);
  const revenue = rows.reduce((total, row) => total + row.revenue, 0);
  const averageCart = sales === 0 ? 0 : Math.round(revenue / sales);

  return (
    <div className="px-6 py-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-wrap gap-10">
          <div>
            <p className="text-sm font-bold text-ink-500">Vânzări totale</p>
            <p className="mt-1 font-display text-3xl font-extrabold tracking-tight text-ink">
              {revenue.toLocaleString('ro-RO')} €
            </p>
            <p className="mt-0.5 text-xs text-ink-500">
              {sales} comenzi în perioada selectată
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-ink-500">Valoare medie coș</p>
            <p className="mt-1 font-display text-3xl font-extrabold tracking-tight text-ink">
              {averageCart.toLocaleString('ro-RO')} €
            </p>
          </div>
        </div>
        <DateFilter filter={dateFilter} onChange={setDateFilter} />
      </div>

      <div className="mt-6 flex flex-wrap gap-10">
        <div>
          <p className="text-sm font-bold text-ink-500">Vizualizări totale</p>
          <p className="mt-1 font-display text-3xl font-extrabold tracking-tight text-ink">
            {totalViews}
          </p>
        </div>
        <div>
          <p className="text-sm font-bold text-ink-500">Opt-ins totale</p>
          <p className="mt-1 font-display text-3xl font-extrabold tracking-tight text-ink">
            {totalOptIns}
          </p>
        </div>
        <div>
          <p className="text-sm font-bold text-ink-500">Conversie medie</p>
          <p className="mt-1 font-display text-3xl font-extrabold tracking-tight text-brand-600">
            {totalRate.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-md border border-slate-200">
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-ink-500">
                Pagina
              </th>
              <th className="w-28 px-3 py-3 text-center text-xs font-bold uppercase tracking-wide text-ink-500">
                Vizualizări
              </th>
              <th className="w-28 px-3 py-3 text-center text-xs font-bold uppercase tracking-wide text-ink-500">
                <span className="relative inline-flex items-center gap-1.5">
                  Opt-ins
                  <button
                    type="button"
                    onClick={() => setHelp((current) => !current)}
                    aria-expanded={help}
                    aria-label="Ce înseamnă opt-in?"
                    className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold transition-colors duration-150 ease-out ${
                    help ?
                    'bg-brand-500 text-white' :
                    'bg-slate-300 text-white hover:bg-slate-400'}`
                    }>
                    
                    ?
                  </button>
                  {help &&
                  <>
                      <button
                      type="button"
                      tabIndex={-1}
                      aria-label="Închide explicația"
                      onClick={() => setHelp(false)}
                      className="fixed inset-0 z-30 cursor-default" />
                    
                      <span className="menu-surface absolute right-0 top-full z-40 mt-2 w-72 rounded-lg border border-slate-200 bg-white p-4 text-center text-xs font-normal normal-case leading-relaxed tracking-normal text-ink-700 shadow-xl">
                        Ca și opt-in luăm în calcul o adresă de email nouă. Dacă
                        adresa a fost deja folosită, ea nu intră la calcul încă
                        o dată.
                      </span>
                    </>
                  }
                </span>
              </th>
              <th className="w-32 px-3 py-3 text-center text-xs font-bold uppercase tracking-wide text-ink-500">
                <span className="relative inline-flex items-center gap-1.5">
                  Conversie opt-in
                  <button
                    type="button"
                    onClick={() => setRateHelp((current) => !current)}
                    aria-expanded={rateHelp}
                    aria-label="Cum se calculează conversia opt-in?"
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-colors duration-150 ease-out ${
                    rateHelp ?
                    'bg-brand-500 text-white' :
                    'bg-slate-300 text-white hover:bg-slate-400'}`
                    }>
                    
                    ?
                  </button>
                  {rateHelp &&
                  <>
                      <button
                      type="button"
                      tabIndex={-1}
                      aria-label="Închide explicația"
                      onClick={() => setRateHelp(false)}
                      className="fixed inset-0 z-30 cursor-default" />
                    
                      <span className="menu-surface absolute right-0 top-full z-40 mt-2 w-72 rounded-lg border border-slate-200 bg-white p-4 text-center text-xs font-normal normal-case leading-relaxed tracking-normal text-ink-700 shadow-xl">
                        Procentul de conversii ale paginii, raportat la
                        accesările unice.
                      </span>
                    </>
                  }
                </span>
              </th>
              <th className="w-28 px-3 py-3 text-center text-xs font-bold uppercase tracking-wide text-ink-500">
                Add to cart
              </th>
              <th className="w-28 px-3 py-3 text-center text-xs font-bold uppercase tracking-wide text-ink-500">
                Nr. comenzi
              </th>
              <th className="w-36 px-3 py-3 text-center text-xs font-bold uppercase tracking-wide text-ink-500">
                Sumă colectată
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ step, views, optIns, rate, addToCart, orders, revenue: rowRevenue }) =>
            <tr key={step.id} className="border-t border-slate-200">
                <td className="px-4 py-3.5">
                  <p className="font-display text-[15px] font-bold text-ink">
                    {step.name}
                  </p>
                  <p className="mt-0.5 text-sm text-ink-500">{step.kind}</p>
                </td>
                <td className="px-3 py-3.5 text-center text-[15px] font-semibold text-ink-700">
                  {views}
                </td>
                <td className="px-3 py-3.5 text-center text-[15px] font-semibold text-ink-700">
                  {optIns}
                </td>
                <td className="px-3 py-3.5 text-center text-[15px] font-bold text-brand-600">
                  {rate.toFixed(2)}%
                </td>
                <td
                className={`px-3 py-3.5 text-center text-[15px] font-semibold ${
                addToCart === 0 ? 'text-ink-400' : 'text-ink-700'}`
                }>
                
                  {addToCart}
                </td>
                <td
                className={`px-3 py-3.5 text-center text-[15px] font-semibold ${
                orders === 0 ? 'text-ink-400' : 'text-ink-700'}`
                }>
                
                  {orders}
                </td>
                <td
                className={`whitespace-nowrap px-3 py-3.5 text-center text-[15px] font-bold ${
                rowRevenue === 0 ? 'text-ink-400' : 'text-emerald-600'}`
                }>
                
                  {rowRevenue.toLocaleString('ro-RO')} €
                </td>
              </tr>
            )}
            <tr className="border-t border-slate-200 bg-slate-50">
              <td className="px-4 py-3.5 font-display text-[15px] font-bold text-ink">
                Total funnel
              </td>
              <td className="px-3 py-3.5 text-center text-[15px] font-bold text-ink">
                {totalViews}
              </td>
              <td className="px-3 py-3.5 text-center text-[15px] font-bold text-ink">
                {totalOptIns}
              </td>
              <td className="px-3 py-3.5 text-center text-[15px] font-bold text-brand-600">
                {totalRate.toFixed(2)}%
              </td>
              <td className="px-3 py-3.5 text-center text-[15px] font-bold text-ink">
                {totalCarts}
              </td>
              <td className="px-3 py-3.5 text-center text-[15px] font-bold text-ink">
                {sales}
              </td>
              <td className="whitespace-nowrap px-3 py-3.5 text-center text-[15px] font-bold text-emerald-600">
                {revenue.toLocaleString('ro-RO')} €
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>);

}