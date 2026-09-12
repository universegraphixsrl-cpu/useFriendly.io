import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useWorkspace } from '../../contexts/WorkspaceContext';

/** Paleta folosită pentru feliile de contribuție, în ordinea valorii */
const palette = [
'#2f6bff',
'#5b85ff',
'#8aa9ff',
'#b4c8ff',
'#d6e0ff',
'#0f1729',
'#3d4a63',
'#6b7688'];


export function RevenueByAgent() {
  const { leads } = useWorkspace();

  // Contribuția reală: suma încasată pe fiecare responsabil, din leadurile curente
  const byOwner = new Map<string, number>();
  leads.forEach((lead) => {
    if (lead.paidAmount <= 0) return;
    byOwner.set(lead.owner, (byOwner.get(lead.owner) ?? 0) + lead.paidAmount);
  });

  const agents = Array.from(byOwner.entries()).
  map(([name, amount]) => ({ name, amount })).
  sort((a, b) => b.amount - a.amount).
  map((agent, index) => ({
    ...agent,
    color: palette[index % palette.length]
  }));

  const total = agents.reduce((sum, agent) => sum + agent.amount, 0);

  return (
    <section
      aria-labelledby="revenue-agent-title"
      className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      
      <h2
        id="revenue-agent-title"
        className="font-display text-base font-extrabold tracking-tight text-ink">
        
        Contribuția la încasări
      </h2>
      <p className="text-sm text-ink-500">
        Procent din total încasat, pe closer · calculat din liste
      </p>

      {total === 0 ?
      <p className="mt-6 rounded-xl border border-dashed border-slate-300 px-4 py-10 text-center text-sm text-ink-500">
          Nicio sumă încasată încă. Cifrele apar imediat ce un closer
          înregistrează o plată.
        </p> :

      <>
          <div className="relative mt-4 h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                data={agents}
                dataKey="amount"
                nameKey="name"
                innerRadius={62}
                outerRadius={92}
                paddingAngle={2}
                stroke="none">
                
                  {agents.map((agent) =>
                <Cell key={agent.name} fill={agent.color} />
                )}
                </Pie>
                <Tooltip
                formatter={(value: number, name: string) => [
                `${value.toLocaleString('ro-RO')} € · ${Math.round(
                  value / total * 100
                )}%`,
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
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-xl font-extrabold text-ink">
                {total.toLocaleString('ro-RO')} €
              </span>
              <span className="text-xs text-ink-500">încasat total</span>
            </div>
          </div>

          <ul className="mt-4 space-y-2.5">
            {agents.map((agent) =>
          <li key={agent.name} className="flex items-center gap-3 text-sm">
                <span
              className="h-2.5 w-2.5 shrink-0 rounded-sm"
              style={{ backgroundColor: agent.color }} />
            
                <span className="flex-1 truncate text-ink-700">
                  {agent.name}
                </span>
                <span className="font-semibold text-ink">
                  {(agent.amount / total * 100).
              toFixed(1).
              replace('.', ',')}
                  %
                </span>
                <span className="w-24 text-right text-ink-500">
                  {agent.amount.toLocaleString('ro-RO')} €
                </span>
              </li>
          )}
          </ul>
        </>
      }
    </section>);

}