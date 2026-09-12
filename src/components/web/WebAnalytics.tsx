import React from 'react';
import type { WebPage } from '../../data/webPages';
import type { Funnel } from '../../data/funnels';

interface WebAnalyticsProps {
  pages: WebPage[];
  funnels: Funnel[];
}

const formatNumber = (value: number) => value.toLocaleString('ro-RO');

/** Statistici agregate pentru paginile și funnelurile din Web builder */
export function WebAnalytics({ pages, funnels }: WebAnalyticsProps) {
  const visits = pages.reduce((sum, page) => sum + page.visits, 0);
  const conversions = pages.reduce((sum, page) => sum + page.conversions, 0);
  const rate = visits ? conversions / visits * 100 : 0;
  const published = pages.filter((page) => page.published).length;
  const activeFunnels = funnels.filter((funnel) => funnel.active).length;

  const ranked = [...pages].sort((a, b) => b.visits - a.visits);
  const best = ranked[0];

  const cards = [
  {
    label: 'Vizitatori totali',
    value: formatNumber(visits),
    note: `${published} din ${pages.length} pagini publicate`
  },
  {
    label: 'Conversii',
    value: formatNumber(conversions),
    note: best ? `cea mai bună: ${best.name}` : 'nicio pagină încă'
  },
  {
    label: 'Rată de conversie',
    value: `${rate.toFixed(1).replace('.', ',')}%`,
    note: 'medie pe toate paginile'
  },
  {
    label: 'Funnels active',
    value: `${activeFunnels}/${funnels.length}`,
    note: `${funnels.reduce((sum, item) => sum + item.steps.length, 0)} pagini în funnels`
  }];


  return (
    <div className="mt-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) =>
        <div
          key={card.label}
          className="rounded-lg border border-slate-200 bg-white p-5">
          
            <p className="text-sm font-bold text-ink-500">{card.label}</p>
            <p className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink">
              {card.value}
            </p>
            <p className="mt-1.5 text-sm text-ink-500">{card.note}</p>
          </div>
        )}
      </div>

      <div className="mt-5 overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="font-display text-lg font-bold text-ink">
            Performanța paginilor
          </h2>
        </div>
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wide text-ink-500">
              <th scope="col" className="px-6 py-3 font-bold">
                Pagină
              </th>
              <th scope="col" className="w-32 px-6 py-3 font-bold">
                Vizitatori
              </th>
              <th scope="col" className="w-32 px-6 py-3 font-bold">
                Conversii
              </th>
              <th scope="col" className="w-40 px-6 py-3 font-bold">
                Rată
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {ranked.map((page) => {
              const pageRate = page.visits ?
              page.conversions / page.visits * 100 :
              0;
              return (
                <tr key={page.id}>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-2.5">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: page.color }}
                        aria-hidden="true" />
                      
                      <span className="font-semibold text-ink">
                        {page.name}
                      </span>
                      <span className="text-xs text-ink-500">{page.kind}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-ink-700">
                    {formatNumber(page.visits)}
                  </td>
                  <td className="px-6 py-4 text-sm text-ink-700">
                    {formatNumber(page.conversions)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-2.5">
                      <span className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
                        <span
                          className="block h-full rounded-full bg-brand-500"
                          style={{ width: `${Math.min(pageRate * 3, 100)}%` }} />
                        
                      </span>
                      <span className="text-sm font-semibold text-ink">
                        {pageRate.toFixed(1).replace('.', ',')}%
                      </span>
                    </span>
                  </td>
                </tr>);

            })}
          </tbody>
        </table>
      </div>
    </div>);

}