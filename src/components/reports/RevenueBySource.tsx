import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useWorkspace } from '../../contexts/WorkspaceContext';

/** Culoarea feliei pentru fiecare status presetat */
const statusColors: Record<string, string> = {
  'Înscris webinar': '#94a3b8',
  'Nu a răspuns': '#cbd5e1',
  'Programat apel': '#2f6bff',
  'No-show': '#b91c1c',
  'A zis „Nu”': '#f87171',
  'Așteptăm răspuns': '#eab308',
  'A zis da': '#34d399',
  Semnat: '#059669'
};

const fallback = ['#8aa9ff', '#0f1729', '#6b7688', '#b4c8ff'];

export function RevenueBySource() {
  const { leads, activeUser } = useWorkspace();

  // Într-un sub-account se iau în calcul doar leadurile lui
  const scoped = activeUser ?
  leads.filter((lead) => lead.owner === activeUser) :
  leads;

  // Distribuția leadurilor pe status
  const byStatus = new Map<string, number>();
  scoped.forEach((lead) => {
    byStatus.set(lead.status, (byStatus.get(lead.status) ?? 0) + 1);
  });

  const total = scoped.length;
  const segments = Array.from(byStatus.entries()).
  map(([name, count], index) => {
    return {
      name,
      count,
      color: statusColors[name] ?? fallback[index % fallback.length]
    };
  }).
  sort((a, b) => b.count - a.count);

  return (
    <section
      aria-labelledby="revenue-source-title"
      className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      
      <h2
        id="revenue-source-title"
        className="font-display text-base font-extrabold tracking-tight text-ink">
        
        Distribuția leadurilor pe status
      </h2>
      <p className="text-sm text-ink-500">
        {activeUser ?
        `Din cele ${total.toLocaleString('ro-RO')} leaduri atribuite ție` :
        `Din totalul de ${total.toLocaleString('ro-RO')} leaduri din cele 4 liste`}
      </p>

      {total === 0 ?
      <p className="mt-6 rounded-xl border border-dashed border-slate-300 px-4 py-10 text-center text-sm text-ink-500">
          {activeUser ?
        'Nu ai încă leaduri atribuite.' :
        'Nu există încă leaduri în liste.'}
        </p> :

      <>
          <div className="mt-4 h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                data={segments}
                dataKey="count"
                nameKey="name"
                outerRadius={92}
                paddingAngle={1}
                stroke="#ffffff">
                
                  {segments.map((segment) =>
                <Cell key={segment.name} fill={segment.color} />
                )}
                </Pie>
                <Tooltip
                formatter={(value: number, name: string) => [
                `${value} leaduri · ${(value / total * 100).
                toFixed(1).
                replace('.', ',')}%`,
                name]
                }
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid #e2e8f0',
                  fontSize: 12,
                  fontFamily: 'Inter, sans-serif'
                }} />
              
              </PieChart>
            </ResponsiveContainer>
          </div>

          <ul className="mt-4 space-y-2.5">
            {segments.map((segment) =>
          <li
            key={segment.name}
            className="flex items-center gap-3 text-sm">
            
                <span
              className="h-2.5 w-2.5 shrink-0 rounded-sm"
              style={{ backgroundColor: segment.color }} />
            
                <span className="flex-1 truncate text-ink-700">
                  {segment.name}
                </span>
                <span className="w-20 text-right text-ink-500">
                  {segment.count} leaduri
                </span>
                <span className="w-14 text-right font-semibold text-ink">
                  {(segment.count / total * 100).toFixed(1).replace('.', ',')}%
                </span>
              </li>
          )}
          </ul>
        </>
      }
    </section>);

}