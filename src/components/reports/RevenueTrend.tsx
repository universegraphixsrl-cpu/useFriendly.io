import React, { useEffect, useRef, useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell } from
'recharts';
import { ChevronDownIcon, CheckIcon } from 'lucide-react';
import { useWorkspace } from '../../contexts/WorkspaceContext';

type MetricId =
'collected' |
'generated' |
'signed' |
'booked' |
'held' |
'commission';

interface Metric {
  id: MetricId;
  label: string;
  /** Valori în euro sau simple numere */
  unit: 'eur' | 'count';
}

const metrics: Metric[] = [
{ id: 'collected', label: 'Sumă totală colectată', unit: 'eur' },
{ id: 'generated', label: 'Sumă totală generată', unit: 'eur' },
{ id: 'signed', label: 'Clienți noi semnați', unit: 'count' },
{ id: 'booked', label: 'Apeluri totale programate', unit: 'count' },
{ id: 'held', label: 'Apeluri totale ținute', unit: 'count' },
{ id: 'commission', label: 'Comision', unit: 'eur' }];


/** Lunile anterioare variază cu maximum ±30% față de august */
const monthFactors: {month: string;factor: number;}[] = [
{ month: 'Ian', factor: 0.74 },
{ month: 'Feb', factor: 0.83 },
{ month: 'Mar', factor: 0.91 },
{ month: 'Apr', factor: 0.78 },
{ month: 'Mai', factor: 1.12 },
{ month: 'Iun', factor: 0.96 },
{ month: 'Iul', factor: 1.24 },
{ month: 'Aug', factor: 1 }];


export function RevenueTrend() {
  const { leads, activeUser } = useWorkspace();
  const [metricId, setMetricId] = useState<MetricId>('collected');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  // Cifrele lunii curente, calculate din leadurile agentului sau ale întregii echipe
  const scoped = activeUser ?
  leads.filter((lead) => lead.owner === activeUser) :
  leads;
  const collected = scoped.reduce((sum, lead) => sum + lead.paidAmount, 0);
  const generated = scoped.reduce((sum, lead) => sum + lead.generatedAmount, 0);
  const signed = scoped.filter((lead) => lead.status === 'Semnat').length;
  const held = scoped.filter(
    (lead) => lead.listId === 'list-offers' || lead.listId === 'list-clients'
  ).length;
  const booked =
  scoped.filter((lead) => lead.listId === 'list-calls').length + held;

  const currentValues: Record<MetricId, number> = {
    collected,
    generated,
    signed,
    booked,
    held,
    commission: Math.round(collected * 0.1)
  };

  const metric = metrics.find((item) => item.id === metricId) ?? metrics[0];
  const current = currentValues[metric.id];

  const data = monthFactors.map(({ month, factor }) => ({
    month,
    value: Math.round(current * factor)
  }));

  const latest = data[data.length - 1];
  const previous = data[data.length - 2];
  const delta = previous.value ?
  (latest.value - previous.value) / previous.value * 100 :
  0;

  const format = (value: number) =>
  metric.unit === 'eur' ?
  `${value.toLocaleString('ro-RO')} €` :
  value.toLocaleString('ro-RO');
  const formatAxis = (value: number) =>
  metric.unit === 'eur' && value >= 1000 ?
  `${Math.round(value / 1000)}k` :
  `${value}`;

  /** Tooltip: valoarea lunii și diferența față de luna curentă (august) */
  const renderTooltip = ({
    active,
    payload



  }: {active?: boolean;payload?: {payload: {month: string;value: number;};}[];}) => {
    if (!active || !payload?.length) return null;
    const entry = payload[0].payload;
    const diff = entry.value - current;
    const percent = current ? diff / current * 100 : 0;
    const isCurrent = entry.month === 'Aug';

    return (
      <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-lg">
        <p className="font-display text-xs font-bold text-ink">{entry.month}</p>
        <p className="mt-0.5 text-sm font-bold text-ink">{format(entry.value)}</p>
        {isCurrent ?
        <p className="mt-0.5 text-[11px] font-semibold text-ink-500">
            Luna curentă
          </p> :

        <p
          className={`mt-0.5 text-[11px] font-bold ${
          diff > 0 ? 'text-red-600' : 'text-emerald-600'}`
          }>
          
            {diff > 0 ? '+' : '−'}
            {format(Math.abs(diff))} ({diff > 0 ? '+' : '−'}
            {Math.abs(percent).toFixed(1).replace('.', ',')}%) față de august
          </p>
        }
      </div>);

  };

  return (
    <section
      aria-labelledby="revenue-trend-title"
      className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2
            id="revenue-trend-title"
            className="font-display text-lg font-extrabold tracking-tight text-ink">
            
            {metric.label} · evoluție lunară
          </h2>
          <p className="text-sm text-ink-500">
            Ultimele 8 luni ·{' '}
            {activeUser ? 'evoluția ta' : 'totalul echipei'}, calculat din liste
          </p>
        </div>

        <div className="flex items-end gap-6">
          <div>
            <p className="font-display text-2xl font-extrabold text-ink">
              {format(latest.value)}
            </p>
            <p className="text-xs text-ink-500">August</p>
          </div>
          <div>
            <p
              className={`font-display text-2xl font-extrabold ${
              delta >= 0 ? 'text-brand-600' : 'text-red-600'}`
              }>
              
              {delta > 0 ? '+' : ''}
              {delta.toFixed(1).replace('.', ',')}%
            </p>
            <p className="text-xs text-ink-500">Față de iulie</p>
          </div>

          <div className="relative" ref={containerRef}>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-haspopup="listbox"
              aria-expanded={open}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-ink-700 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
              
              Indicator
              <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
            </button>

            {open &&
            <ul
              role="listbox"
              aria-label="Alege indicatorul"
              className="absolute right-0 top-full z-30 mt-1.5 w-60 rounded-xl border border-slate-200 bg-white py-1.5 shadow-2xl">
              
                {metrics.map((option) =>
              <li key={option.id}>
                    <button
                  type="button"
                  role="option"
                  aria-selected={option.id === metric.id}
                  onClick={() => {
                    setMetricId(option.id);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-semibold transition-colors duration-150 ease-out ${
                  option.id === metric.id ?
                  'bg-brand-50 text-brand-700' :
                  'text-ink-700 hover:bg-slate-50'}`
                  }>
                  
                      <span className="flex-1">{option.label}</span>
                      {option.id === metric.id &&
                  <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  }
                    </button>
                  </li>
              )}
              </ul>
            }
          </div>
        </div>
      </div>

      <div className="mt-6 h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
            
            <CartesianGrid vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }} />
            
            <YAxis
              tickFormatter={formatAxis}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }} />
            
            <Tooltip cursor={{ fill: '#eef4ff' }} content={renderTooltip} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={38}>
              {data.map((entry) =>
              <Cell
                key={entry.month}
                fill={entry.month === 'Aug' ? '#2f6bff' : '#bdd1ff'} />

              )}
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-5 text-xs font-semibold text-ink-700">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-brand-500" />
          Luna curentă
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-brand-200" />
          Luni anterioare
        </span>
        <span className="ml-auto text-ink-500">
          Treci cu cursorul peste o lună pentru diferența față de august
        </span>
      </div>
    </section>);

}