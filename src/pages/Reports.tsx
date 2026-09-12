import React, { useRef, useState } from 'react';
import { DownloadIcon, ShareIcon, XIcon } from 'lucide-react';
import { AddReportMenu } from '../components/reports/AddReportMenu';
import {
  extraMetrics,
  coreMetricIds } from
'../components/reports/extraMetrics';
import { RevenueTrend } from '../components/reports/RevenueTrend';
import { RevenueByAgent } from '../components/reports/RevenueByAgent';
import { RevenueBySource } from '../components/reports/RevenueBySource';
import { ShowUpTrendChart } from '../components/reports/ShowUpTrendChart';
import { AgentPerformanceTable } from '../components/reports/AgentPerformanceTable';
import { WebinarFunnel } from '../components/reports/WebinarFunnel';
import {
  RangePicker,
  defaultReportRange,
  formatRange,
  rangeDays,
  type ReportRange } from
'../components/reports/RangePicker';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { callerNames, leadDateIso } from '../data/leads';
import { exportReportPdf } from '../utils/exportReportPdf';
import { AgentFilter } from '../components/reports/AgentFilter';
import { CallerPerformanceTable } from '../components/reports/CallerPerformanceTable';

/** Indicatorii standard ai unui caller */
const callerMetricIds = [
'caller-leads',
'caller-signed',
'caller-collected',
'caller-commission',
'vocaroo-count',
'zoom-count'];


export function Reports() {
  const { leads, activeUser } = useWorkspace();
  const [range, setRange] = useState<ReportRange>(defaultReportRange);
  // Cei 6 indicatori principali sunt pre-selectați, dar pot fi scoși.
  // Un caller pornește și cu indicatorii lui specifici.
  const [metricIds, setMetricIds] = useState<string[]>(() =>
  activeUser && callerNames.includes(activeUser) ?
  callerMetricIds :
  coreMetricIds
  );
  const [exporting, setExporting] = useState(false);
  // La admin se pot vedea cifrele unui singur agent
  const [agentFilter, setAgentFilter] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const days = rangeDays(range);
  // Indicatorii reflectă strict perioada selectată în calendar
  const teamLeads = leads.filter((lead) => {
    const iso = leadDateIso(lead.addedOn);
    return iso >= range.start && iso <= range.end;
  });
  // Într-un sub-account se însumează exclusiv leadurile lui;
  // la admin, cele ale agentului selectat din filtru
  const scopedUser = activeUser ?? agentFilter;
  const rangeLeads = scopedUser ?
  teamLeads.filter((lead) => lead.owner === scopedUser) :
  teamLeads;
  // Sumele colectate de callers se arată doar când raportul e restrâns la ei,
  // ca să nu fie numărate a doua oară în totalurile echipei
  const isCallerScope = scopedUser !== null && callerNames.includes(scopedUser);
  // Indicatorii de caller se raportează la callerul alocat, nu la responsabil
  const callerLeads = scopedUser ?
  teamLeads.filter((lead) => lead.caller === scopedUser) :
  teamLeads;
  const metricLeads = (metric: (typeof extraMetrics)[number]) =>
  metric.scope === 'caller' ? callerLeads : rangeLeads;
  const agentCounts = teamLeads.reduce<Record<string, number>>(
    (counts, lead) => {
      counts[lead.owner] = (counts[lead.owner] ?? 0) + 1;
      return counts;
    },
    {}
  );
  const periodLabel = `${formatRange(range)} 2026`;
  const scopedLeadCount = isCallerScope ? callerLeads.length : rangeLeads.length;

  /** Exportă raportul păstrând grafica din aplicație */
  const handleExport = async () => {
    if (!contentRef.current || exporting) return;
    setExporting(true);
    try {
      await exportReportPdf({
        element: contentRef.current,
        title: 'Raport vânzări',
        period: periodLabel,
        owner:
        scopedUser ??
        'Andreas Bălan · cont principal',
        subtitle: `${days} ${
        days === 1 ? 'zi' : 'zile'} · ${
        scopedLeadCount} leaduri · ${selectedMetrics.length} indicatori`
      });
    } finally {
      setExporting(false);
    }
  };

  // La admin se evidențiază suma colectată; în sub-cont, comisionul agentului
  const accentedMetricId = activeUser ? 'commission' : 'collected';
  // Când raportul e restrâns la un caller, se arată setul lui de indicatori
  const visibleIds = isCallerScope ?
  Array.from(new Set([...callerMetricIds, ...metricIds])) :
  metricIds;
  const selectedMetrics = visibleIds.
  map((id) => extraMetrics.find((metric) => metric.id === id)).
  filter((metric): metric is (typeof extraMetrics)[number] =>
  Boolean(
    metric && (
    !metric.callerOnly || isCallerScope) && (
    !metric.closerOnly || !isCallerScope)
  )
  );

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Rapoarte vânzări
          </h1>
          <p className="mt-1 text-sm text-ink-700">
            {formatRange(range)} 2026 · {days}{' '}
            {days === 1 ? 'zi' : 'zile'} · grupare pe {range.grain} ·{' '}
            {activeUser ?
            `cifrele tale din perioada selectată (${scopedLeadCount} leaduri)` :
            agentFilter ?
            `cifrele lui ${agentFilter} (${scopedLeadCount} leaduri)` :
            `cifre din perioada selectată (${scopedLeadCount} leaduri)`}
            .
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <RangePicker range={range} onChange={setRange} />
          <AddReportMenu
            callerScope={isCallerScope}
            selected={metricIds}
            onToggle={(id) =>
            setMetricIds((current) =>
            current.includes(id) ?
            current.filter((item) => item !== id) :
            [...current, id]
            )
            } />
          
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-ink-700 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
            
            <ShareIcon className="h-4 w-4" aria-hidden="true" />
            Trimite raportul
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={selectedMetrics.length === 0 || exporting}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-3 py-2 text-sm font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-slate-300">
            
            <DownloadIcon className="h-4 w-4" aria-hidden="true" />
            {exporting ? 'Se pregătește…' : 'Export PDF'}
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {!activeUser &&
        <AgentFilter
          value={agentFilter}
          onChange={setAgentFilter}
          counts={agentCounts}
          total={teamLeads.length} />

        }
        <button
          type="button"
          className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-ink-700 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
          
          Toate sursele
        </button>
      </div>

      <div className="mt-6 space-y-6" ref={contentRef}>
        {selectedMetrics.length === 0 ?
        <p className="rounded-2xl border border-dashed border-slate-300 px-4 py-10 text-center text-sm text-ink-500">
            Niciun indicator afișat. Adaugă-i din butonul „Adaugă raport”.
          </p> :

        <div className="grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-2 xl:grid-cols-3">
            {selectedMetrics.map((metric) =>
          <div
            key={metric.id}
            className="group relative flex flex-col bg-white p-5">
            
                <button
              type="button"
              onClick={() =>
              setMetricIds((current) =>
              current.filter((item) => item !== metric.id)
              )
              }
              aria-label={`Scoate raportul ${metric.label}`}
              className="absolute right-3 top-3 rounded-md p-1 text-ink-500 opacity-0 transition-opacity duration-150 ease-out hover:bg-slate-100 hover:text-ink focus:opacity-100 group-hover:opacity-100">
              
                  <XIcon className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
                <p className="pr-6 text-xs font-bold uppercase tracking-wide text-ink-500">
                  {metric.id === 'commission' && activeUser ?
              'Comisionul tău' :
              metric.label}
                </p>
                <p
              className={`mt-2 font-display text-3xl font-extrabold tracking-tight ${
              accentedMetricId === metric.id ?
              'text-brand-600' :
              'text-ink'}`
              }>
              
                  {metric.value(metricLeads(metric))}
                </p>
                <p className="mt-auto pt-3 text-xs leading-relaxed text-ink-500">
                  {metric.note(metricLeads(metric))}
                </p>
              </div>
          )}
          </div>
        }

        <div className="grid gap-6 lg:grid-cols-2">
          <RevenueByAgent />
          <RevenueBySource />
        </div>

        <RevenueTrend />

        <AgentPerformanceTable />

        <CallerPerformanceTable
          leads={teamLeads}
          activeCaller={scopedUser}
          period={formatRange(range)} />
        

        <div className="grid gap-6 xl:grid-cols-2">
          <WebinarFunnel />
          <ShowUpTrendChart />
        </div>
      </div>
    </>);

}