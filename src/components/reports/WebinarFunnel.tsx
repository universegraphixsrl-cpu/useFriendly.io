import React from 'react';
import { webinarFunnel, webinarBookings } from '../../data/reports';

export function WebinarFunnel() {
  return (
    <section
      aria-labelledby="webinar-title"
      className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2
            id="webinar-title"
            className="font-display text-lg font-extrabold tracking-tight text-ink">
            
            De la webinar la contract
          </h2>
          <p className="text-sm text-ink-500">
            Cumulat pe cele 4 webinarii din august
          </p>
        </div>
        <div className="flex gap-6">
          <div>
            <p className="font-display text-2xl font-extrabold text-brand-600">
              36,5%
            </p>
            <p className="text-xs text-ink-500">Book-a-call rate mediu</p>
          </div>
          <div>
            <p className="font-display text-2xl font-extrabold text-ink">
              77,6%
            </p>
            <p className="text-xs text-ink-500">Show-up la apelurile booked</p>
          </div>
        </div>
      </div>

      <ol className="mt-6 space-y-2">
        {webinarFunnel.map((stage) =>
        <li key={stage.label} className="flex items-center gap-4">
            <span className="w-44 shrink-0 text-sm text-ink-700">
              {stage.label}
            </span>
            <div className="flex-1">
              <div
              className="flex h-9 items-center justify-end rounded-lg bg-brand-500 px-3"
              style={{
                width: `${Math.max(stage.percent, 12)}%`,
                opacity: 0.35 + stage.percent / 100 * 0.65
              }}>
              
                <span className="font-display text-xs font-bold text-white">
                  {stage.value.toLocaleString('ro-RO')}
                </span>
              </div>
            </div>
            <span className="w-12 shrink-0 text-right text-sm font-semibold text-ink">
              {stage.percent}%
            </span>
          </li>
        )}
      </ol>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left">
          <caption className="pb-3 text-left font-display text-sm font-bold text-ink">
            Rata de book a call, per webinar
          </caption>
          <thead>
            <tr className="text-xs font-bold uppercase tracking-wide text-ink-500">
              <th scope="col" className="py-2 pr-4 font-bold">
                Webinar
              </th>
              <th scope="col" className="py-2 pr-4 font-bold">
                Înscriși
              </th>
              <th scope="col" className="py-2 pr-4 font-bold">
                Prezenți
              </th>
              <th scope="col" className="py-2 pr-4 font-bold">
                Apeluri
              </th>
              <th scope="col" className="py-2 font-bold">
                Book rate
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {webinarBookings.map((item) =>
            <tr key={item.webinar}>
                <td className="py-3 pr-4">
                  <p className="text-sm font-semibold text-ink">
                    {item.webinar}
                  </p>
                  <p className="text-xs text-ink-500">{item.date}</p>
                </td>
                <td className="py-3 pr-4 text-sm text-ink-700">
                  {item.inscrisi}
                </td>
                <td className="py-3 pr-4 text-sm text-ink-700">
                  {item.prezenti}
                </td>
                <td className="py-3 pr-4 text-sm text-ink-700">
                  {item.apeluriRezervate}
                </td>
                <td className="py-3">
                  <span className="inline-flex rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-700">
                    {item.bookRate.toFixed(1)}%
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>);

}