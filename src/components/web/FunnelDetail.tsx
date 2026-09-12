import React, { useState } from 'react';
import {
  ChevronRightIcon,
  EyeIcon,
  SettingsIcon,
  PlusIcon,
  PencilIcon,
  SlidersHorizontalIcon,
  ZapIcon,
  GitBranchIcon,
  BarChart3Icon,
  UsersIcon,
  BanknoteIcon,
  TagIcon,
  LayoutTemplateIcon,
  LinkIcon,
  CheckCircle2Icon,
  CreditCardIcon,
  TrendingUpIcon,
  VideoIcon } from
'lucide-react';
import {
  type Funnel,
  type FunnelStep,
  type FunnelStepKind } from
'../../data/funnels';
import { StepRowMenu } from './StepRowMenu';
import { StepCreateDialog } from './StepCreateDialog';
import { FunnelStats } from './FunnelStats';
import { FunnelAutomations } from './FunnelAutomations';
import { FunnelTags } from './FunnelTags';
import { marketingFlows } from '../../data/marketing';
import { courses } from '../../data/courses';
import { StepMoveDialog } from './StepMoveDialog';
import { FunnelCreateDialog } from './FunnelCreateDialog';
import { PageEditorScreen } from '../editor/PageEditorScreen';
import { Toast } from '../Toast';

/** Iconița fiecărui tip de pas, în locul emoji-urilor */
const stepIcons: Record<FunnelStepKind, typeof EyeIcon> = {
  'Sales page': BanknoteIcon,
  'Opt-in page': UsersIcon,
  'Opt-in thank you': CheckCircle2Icon,
  Checkout: CreditCardIcon,
  'Order bump': CreditCardIcon,
  Upsell: TrendingUpIcon,
  Downsell: TrendingUpIcon,
  Webinar: VideoIcon,
  'Webinar replay': VideoIcon,
  'Thank you page': CheckCircle2Icon,
  'Info page': LayoutTemplateIcon,
  'VSL page': VideoIcon
};

interface FunnelDetailProps {
  funnel: Funnel;
  onBack: () => void;
  onSave: (funnel: Funnel) => void;
  /** Celelalte funneluri, ca destinații pentru mutarea unei pagini */
  otherFunnels: {id: string;name: string;}[];
  /** Mută pasul în alt funnel, ca ultimă pagină */
  onMoveStep: (step: FunnelStep, targetFunnelId: string) => void;
}

const tabs = [
{ id: 'config', label: 'Configurație', icon: SlidersHorizontalIcon },
{ id: 'automations', label: 'Reguli automatizare', icon: ZapIcon },
{ id: 'abtest', label: 'A/B test', icon: GitBranchIcon },
{ id: 'stats', label: 'Statistici', icon: BarChart3Icon },
{ id: 'leads', label: 'Leaduri', icon: UsersIcon },
{ id: 'sales', label: 'Vânzări', icon: BanknoteIcon },
{ id: 'tags', label: 'Tags', icon: TagIcon }];


/** Ecranul unui funnel: pașii în stânga, configurația pasului selectat în dreapta */
export function FunnelDetail({
  funnel,
  onBack,
  onSave,
  otherFunnels,
  onMoveStep
}: FunnelDetailProps) {
  const [moving, setMoving] = useState<{
    step: FunnelStep;
    targetId: string;
  } | null>(null);
  const [draft, setDraft] = useState<Funnel>(funnel);
  const [activeStepId, setActiveStepId] = useState(funnel.steps[0]?.id ?? '');
  const [activeTab, setActiveTab] = useState('config');
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [access, setAccess] = useState<string[]>([]);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [editorOpen, setEditorOpen] = useState(true);

  /** Copiază linkul complet al paginii în clipboard */
  const copyLink = (path: string) => {
    const url = `https://${draft.domain}/${path}`;
    navigator.clipboard?.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2500);
  };

  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);


  const dirty = JSON.stringify(draft) !== JSON.stringify(funnel);
  const step = draft.steps.find((item) => item.id === activeStepId) ?? null;

  const updateStep = (id: string, patch: Partial<FunnelStep>) =>
  setDraft((current) => ({
    ...current,
    steps: current.steps.map((item) =>
    item.id === id ? { ...item, ...patch } : item
    )
  }));

  const addStep = (name: string, kind: FunnelStepKind) => {
    const newStep: FunnelStep = {
      id: `step-${Date.now()}`,
      name,
      kind,
      path: name.
      toLowerCase().
      normalize('NFD').
      replace(/[\u0300-\u036f]/g, '').
      replace(/[^a-z0-9]+/g, '-').
      replace(/^-|-$/g, '')
    };
    setDraft((current) => ({ ...current, steps: [...current.steps, newStep] }));
    setActiveStepId(newStep.id);
    setCreating(false);
  };

  const duplicateStep = (item: FunnelStep) => {
    const copy: FunnelStep = {
      ...item,
      id: `step-${Date.now()}`,
      name: `${item.name} (copie)`,
      path: `${item.path}-copie`
    };
    setDraft((current) => {
      const index = current.steps.findIndex((entry) => entry.id === item.id);
      const steps = [...current.steps];
      steps.splice(index + 1, 0, copy);
      return { ...current, steps };
    });
    setActiveStepId(copy.id);
  };

  /** Reordonare prin drag & drop în lista de pași */
  const moveStep = (fromId: string, toId: string) => {
    if (fromId === toId) return;
    setDraft((current) => {
      const steps = [...current.steps];
      const from = steps.findIndex((item) => item.id === fromId);
      const to = steps.findIndex((item) => item.id === toId);
      if (from === -1 || to === -1) return current;
      const [moved] = steps.splice(from, 1);
      steps.splice(to, 0, moved);
      return { ...current, steps };
    });
  };

  const removeStep = (id: string) => {
    setDraft((current) => {
      const steps = current.steps.filter((item) => item.id !== id);
      if (id === activeStepId) setActiveStepId(steps[0]?.id ?? '');
      return { ...current, steps };
    });
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav
          aria-label="Navigare funnel"
          className="flex items-center gap-2 font-display text-xl font-extrabold tracking-tight">
          
          <button
            type="button"
            onClick={onBack}
            className="text-ink-500 transition-colors duration-150 ease-out hover:text-brand-600">
            
            Lista de funnels
          </button>
          <ChevronRightIcon
            className="h-4 w-4 text-ink-400"
            aria-hidden="true" />
          
          <span className="text-ink-500">{draft.name}</span>
          {step &&
          <>
              <ChevronRightIcon
              className="h-4 w-4 text-ink-400"
              aria-hidden="true" />
            
              <span className="text-ink">{step.name}</span>
            </>
          }
        </nav>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3.5 py-2.5 text-[15px] font-semibold text-ink-700 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
            
            <EyeIcon className="h-4 w-4" aria-hidden="true" />
            Vezi funnelul
          </button>
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3.5 py-2.5 text-[15px] font-semibold text-ink-700 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
            
            <SettingsIcon className="h-4 w-4" aria-hidden="true" />
            Setări funnel
          </button>
          <button
            type="button"
            onClick={() => onSave(draft)}
            disabled={!dirty}
            className="inline-flex items-center gap-2 rounded-md bg-brand-500 px-4 py-2.5 font-display text-[15px] font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-slate-300">
            
            Salvează
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start">
        <aside className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <ul className="max-h-[620px] divide-y divide-slate-100 overflow-y-auto">
            {draft.steps.map((item) => {
              const StepIcon = stepIcons[item.kind];
              return (
                <li
                  key={item.id}
                  draggable
                  onDragStart={(event) => {
                    setDragId(item.id);
                    event.dataTransfer.effectAllowed = 'move';
                  }}
                  onDragOver={(event) => {
                    event.preventDefault();
                    event.dataTransfer.dropEffect = 'move';
                    if (overId !== item.id) setOverId(item.id);
                  }}
                  onDrop={(event) => {
                    event.preventDefault();
                    if (dragId) moveStep(dragId, item.id);
                    setDragId(null);
                    setOverId(null);
                  }}
                  onDragEnd={() => {
                    setDragId(null);
                    setOverId(null);
                  }}
                  className={`relative transition-opacity duration-150 ease-out ${
                  dragId === item.id ? 'opacity-40' : ''} ${

                  overId === item.id && dragId && dragId !== item.id ?
                  'ring-2 ring-inset ring-brand-400' :
                  ''}`
                  }>
                  
                <button
                    type="button"
                    onClick={() => setActiveStepId(item.id)}
                    className={`flex w-full cursor-grab items-center gap-3 border-l-2 px-4 py-4 pr-12 text-left transition-colors duration-150 ease-out active:cursor-grabbing ${
                    activeStepId === item.id ?
                    'border-brand-500 bg-brand-50' :
                    'border-transparent hover:bg-slate-50'}`
                    }>
                    
                  <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${
                      activeStepId === item.id ?
                      'bg-brand-100 text-brand-700' :
                      'bg-slate-100 text-ink-700'}`
                      }>
                      
                    <StepIcon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-base font-bold text-ink">
                      {item.name}
                    </span>
                    <span className="block text-sm text-ink-500">
                      {item.kind}
                    </span>
                  </span>
                </button>
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <StepRowMenu
                      stepName={item.name}
                      moveTargets={otherFunnels}
                      onMove={(targetId) =>
                      setMoving({ step: item, targetId })
                      }
                      onEdit={() => setActiveStepId(item.id)}
                      onDuplicate={() => duplicateStep(item)}
                      onDelete={() => removeStep(item.id)} />
                    
                </div>
              </li>);

            })}
          </ul>
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="flex w-full items-center justify-center gap-2 border-t border-slate-100 px-4 py-4 font-display text-base font-bold text-brand-600 transition-colors duration-150 ease-out hover:bg-brand-50">
            
            <PlusIcon className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
            Adaugă pas
          </button>
        </aside>

        <section className="rounded-lg border border-slate-200 bg-white">
          <div className="flex gap-1 overflow-x-auto border-b border-slate-100 px-3">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex shrink-0 items-center gap-2 border-b-2 px-3.5 py-4 font-display text-[15px] font-bold transition-colors duration-150 ease-out ${
                  activeTab === tab.id ?
                  'border-brand-500 text-brand-600' :
                  'border-transparent text-ink-500 hover:text-ink'}`
                  }>
                  
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {tab.label}
                </button>);

            })}
          </div>

          {!step ?
          <p className="px-6 py-16 text-center text-sm text-ink-500">
              Funnelul nu are pași. Adaugă primul pas din stânga.
            </p> :
          activeTab === 'config' ?
          <div className="grid gap-6 px-6 py-6 lg:grid-cols-[minmax(0,1fr)_220px]">
              <div>
                <label className="block text-sm font-bold text-ink-700">
                  Denumire<span className="text-red-500"> *</span>
                  <input
                  value={step.name}
                  onChange={(event) =>
                  updateStep(step.id, { name: event.target.value })
                  }
                  className="mt-2 w-full rounded-md border border-slate-200 px-3.5 py-3 text-base font-semibold text-ink outline-none focus:border-brand-400" />
                
                </label>

                <p className="mt-5 text-sm font-bold text-ink-700">
                  Calea URL<span className="text-red-500"> *</span>
                </p>
                <div className="mt-2 flex overflow-hidden rounded-md border border-slate-200 focus-within:border-brand-400">
                  <span className="shrink-0 bg-slate-50 px-3.5 py-3 text-base text-ink-500">
                    https://{draft.domain}/
                  </span>
                  <input
                  value={step.path}
                  onChange={(event) =>
                  updateStep(step.id, { path: event.target.value })
                  }
                  aria-label="Calea URL a paginii"
                  className="w-full px-3.5 py-3 text-base text-ink outline-none" />
                
                  <button
                  type="button"
                  onClick={() => copyLink(step.path)}
                  aria-label="Copiază linkul paginii"
                  title="Copiază linkul"
                  className="shrink-0 border-l border-slate-200 px-4 text-ink-500 transition-colors duration-150 ease-out hover:bg-slate-50 hover:text-brand-600">
                  
                    <LinkIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="space-y-2.5">
                <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-500 px-3.5 py-3 font-display text-[15px] font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600">
                
                  <EyeIcon className="h-4 w-4" aria-hidden="true" />
                  Vezi pasul
                </button>
                <button
                type="button"
                onClick={() => setEditorOpen(true)}
                className="flex w-full items-center justify-center gap-2 rounded-md border border-brand-300 bg-brand-50 px-3.5 py-3 text-[15px] font-bold text-brand-700 transition-colors duration-150 ease-out hover:border-brand-500 hover:bg-brand-100">
                
                  <PencilIcon className="h-4 w-4" aria-hidden="true" />
                  Editează pagina
                </button>
              </div>
            </div> :
          activeTab === 'stats' ?
          <FunnelStats steps={draft.steps} /> :
          activeTab === 'automations' ?
          <FunnelAutomations
            steps={draft.steps}
            tags={tags}
            campaigns={marketingFlows.map((flow) => flow.name)}
            courses={courses.map((course) => course.title)}
            onAddTag={(tag) =>
            setTags((current) =>
            current.includes(tag) ? current : [...current, tag]
            )
            } /> :

          activeTab === 'tags' ?
          <FunnelTags tags={tags} onChange={setTags} /> :

          <p className="px-6 py-16 text-center text-sm text-ink-500">
              {tabs.find((tab) => tab.id === activeTab)?.label} pentru „
              {step.name}” — secțiune în lucru.
            </p>
          }
        </section>
      </div>

      {copied && <Toast message="Link copiat în clipboard" />}

      {moving &&
      <StepMoveDialog
        stepName={moving.step.name}
        targetName={
        otherFunnels.find((item) => item.id === moving.targetId)?.name ?? ''
        }
        onCancel={() => setMoving(null)}
        onConfirm={() => {
          // scoatem pasul din funnelul curent și îl trimitem în cel ales
          const steps = draft.steps.filter(
            (item) => item.id !== moving.step.id
          );
          const next = { ...draft, steps };
          setDraft(next);
          if (moving.step.id === activeStepId)
          setActiveStepId(steps[0]?.id ?? '');
          onSave(next);
          onMoveStep(moving.step, moving.targetId);
          setMoving(null);
        }} />

      }

      {creating &&
      <StepCreateDialog
        onClose={() => setCreating(false)}
        onCreate={(name, kind) => addStep(name, kind)} />

      }

      {settingsOpen &&
      <FunnelCreateDialog
        title="Setări funnel"
        submitLabel="Salvează setările"
        initialName={draft.name}
        initialDomain={draft.domain}
        initialAccess={access}
        onClose={() => setSettingsOpen(false)}
        onCreate={(name, domain, _goal, _currency, nextAccess) => {
          setDraft((current) => ({ ...current, name, domain }));
          setAccess(nextAccess);
          setSettingsOpen(false);
          setSettingsSaved(true);
          window.setTimeout(() => setSettingsSaved(false), 2500);
        }} />

      }

      {settingsSaved && <Toast message="Modificare salvată cu succes" />}

      {editorOpen &&
      <PageEditorScreen
        pageName={step ? `${draft.name} · ${step.name}` : draft.name}
        onExit={() => setEditorOpen(false)}
        onSave={() => {
          setEditorOpen(false);
          setSettingsSaved(true);
          window.setTimeout(() => setSettingsSaved(false), 2500);
        }} />

      }
    </>);

}