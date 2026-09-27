import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip } from
'recharts';
import { showUpTrend as demoTrend } from '../../data/reports';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { supabaseConfigured } from '../../lib/supabase';
import { showUpTrendFromLeads } from '../../lib/reportsFromLeads';

export function ShowUpTrendChart() {
  const { leads } = useWorkspace();
  const showUpTrend = supabaseConfigured ?
  showUpTrendFromLeads(leads) :
  demoTrend;

  return (
    <section
      aria-labelledby="showup-title"
      className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      
      <h2
        id="showup-title"
        className="font-display text-base font-extrabold tracking-tight text-ink">
        
        Show-up vs. book-a-call, pe săptămâni
      </h2>
      <p className="text-sm text-ink-500">
        Ultimele 8 săptămâni, media echipei
      </p>

      {showUpTrend.length === 0 ?
      <p className="mt-5 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-ink-500">
          Graficul se desenează singur pe măsură ce intră leaduri și le muți
          prin statusuri. Deocamdată nu e nimic de arătat.
        </p> :

      <div className="mt-5 h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={showUpTrend}
            margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
            
            <CartesianGrid vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="week"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }} />
            
            <YAxis
              domain={[0, 100]}
              tickFormatter={(value: number) => `${value}%`}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }} />
            
            <Tooltip
              formatter={(value: number, name: string) => [
              `${value}%`,
              name === 'showUp' ? 'Show-up rate' : 'Book-a-call rate']
              }
              contentStyle={{
                borderRadius: 12,
                border: '1px solid #e2e8f0',
                fontSize: 12,
                fontFamily: 'Inter, sans-serif'
              }} />
            
            <Line
              type="monotone"
              dataKey="showUp"
              stroke="#2f6bff"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#2f6bff', strokeWidth: 0 }} />
            
            <Line
              type="monotone"
              dataKey="bookRate"
              stroke="#0f1729"
              strokeWidth={2}
              dot={{ r: 3, fill: '#0f1729', strokeWidth: 0 }} />
            
          </LineChart>
        </ResponsiveContainer>
      </div>
      }

      <div className="mt-3 flex flex-wrap items-center gap-5 text-xs font-semibold text-ink-700">
        <span className="flex items-center gap-2">
          <span className="h-0.5 w-5 bg-brand-500" />
          Show-up rate agenți
        </span>
        <span className="flex items-center gap-2">
          <span className="h-0.5 w-5 bg-ink" />
          Book-a-call după webinar
        </span>
      </div>
    </section>);

}