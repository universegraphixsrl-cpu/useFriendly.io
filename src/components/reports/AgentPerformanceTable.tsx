import React from 'react';
import { TrendingUpIcon, TrendingDownIcon, DownloadIcon } from 'lucide-react';
import { agentPerformance } from '../../data/reports';

export function AgentPerformanceTable() {
  return (
    <section
      aria-labelledby="agents-title"
      className="rounded-2xl border border-slate-200 bg-white">
      
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div>
          <h2
            id="agents-title"
            className="font-display text-lg font-extrabold tracking-tight text-ink">
            
            Performanța agenților
          </h2>
          <p className="text-sm text-ink-500">
            Show-up rate, rată de închidere și încasări · august
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-ink-700 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
          
          <DownloadIcon className="h-4 w-4" aria-hidden="true" />
          Exportă CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr className="text-xs font-bold uppercase tracking-wide text-ink-500">
              <th scope="col" className="px-5 py-3 font-bold">
                Agent
              </th>
              <th scope="col" className="px-5 py-3 font-bold">
                Show-up rate
              </th>
              <th scope="col" className="px-5 py-3 font-bold">
                Rată închidere
              </th>
              <th scope="col" className="px-5 py-3 font-bold">
                Apeluri
              </th>
              <th scope="col" className="px-5 py-3 font-bold">
                Încasat
              </th>
              <th scope="col" className="px-5 py-3 font-bold">
                Evoluție
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {agentPerformance.map((agent) =>
            <tr key={agent.name}>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 font-display text-[11px] font-bold text-brand-700">
                      {agent.name.
                    split(' ').
                    map((part) => part[0]).
                    join('')}
                    </span>
                    <div>
                      <p className="font-display text-sm font-bold text-ink">
                        {agent.name}
                      </p>
                      <p className="text-xs text-ink-500">{agent.role}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex w-36 items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div
                      className={`h-full rounded-full ${agent.showUp >= 75 ? 'bg-brand-500' : 'bg-amber-400'}`}
                      style={{ width: `${agent.showUp}%` }} />
                    
                    </div>
                    <span className="w-9 text-sm font-semibold text-ink">
                      {agent.showUp}%
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm font-semibold text-ink">
                  {agent.closeRate}%
                </td>
                <td className="px-5 py-4 text-sm text-ink-700">
                  {agent.calls}
                </td>
                <td className="px-5 py-4 text-sm font-semibold text-ink">
                  {agent.revenue}
                </td>
                <td className="px-5 py-4">
                  <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
                  agent.trend >= 0 ?
                  'bg-emerald-50 text-emerald-700' :
                  'bg-red-50 text-red-700'}`
                  }>
                  
                    {agent.trend >= 0 ?
                  <TrendingUpIcon className="h-3.5 w-3.5" aria-hidden="true" /> :

                  <TrendingDownIcon
                    className="h-3.5 w-3.5"
                    aria-hidden="true" />

                  }
                    {agent.trend > 0 ? '+' : ''}
                    {agent.trend}%
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>);

}