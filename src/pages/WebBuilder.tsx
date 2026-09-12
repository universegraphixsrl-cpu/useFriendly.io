import React, { useState } from 'react';
import {
  PlusIcon,
  ExternalLinkIcon,
  CopyIcon,
  PencilIcon,
  ClipboardListIcon,
  NewspaperIcon } from
'lucide-react';
import { EmptyCollection } from '../components/web/EmptyCollection';
import { WebAnalytics } from '../components/web/WebAnalytics';
import { FormSubmissions } from '../components/web/FormSubmissions';
import { FormAnalytics } from '../components/web/FormAnalytics';
import {
  webPages,
  pageColors,
  blockDefaults,
  type WebPage } from
'../data/webPages';
import { PageEditor } from '../components/web/PageEditor';
import { FunnelsList } from '../components/web/FunnelsList';
import { FunnelDetail } from '../components/web/FunnelDetail';
import { funnels, type Funnel, type FunnelStep } from '../data/funnels';
import { Toast } from '../components/Toast';

const blankPage = (): WebPage => ({
  id: `page-${Date.now()}`,
  name: '',
  kind: 'Landing page',
  slug: '',
  color: pageColors[0],
  published: false,
  visits: 0,
  conversions: 0,
  blocks: [
  { id: `block-${Date.now()}`, type: 'hero', ...blockDefaults.hero },
  { id: `block-${Date.now() + 1}`, type: 'form', ...blockDefaults.form }]

});

export function WebBuilder() {
  const [pages, setPages] = useState<WebPage[]>(webPages);
  const [editing, setEditing] = useState<WebPage | null>(null);
  const [toast, setToast] = useState(false);
  const [tab, setTab] = useState<
    'pagini' | 'funnels' | 'formulare' | 'blogs' | 'analytics'>(
    'funnels');
  const [formsTab, setFormsTab] = useState<
    'lista' | 'submissions' | 'statistici'>(
    'lista');
  const [funnelList, setFunnelList] = useState<Funnel[]>(funnels);
  // la refresh pornim în primul funnel, fără overlay-ul de editor peste CRM
  const [openFunnel, setOpenFunnel] = useState<Funnel | null>(funnels[0] ?? null);

  const confirm = () => {
    setToast(true);
    window.setTimeout(() => setToast(false), 2500);
  };

  const savePage = (page: WebPage) => {
    setPages((current) =>
    current.some((item) => item.id === page.id) ?
    current.map((item) => item.id === page.id ? page : item) :
    [page, ...current]
    );
    setEditing(null);
    confirm();
  };

  const togglePublish = (id: string) => {
    setPages((current) =>
    current.map((page) =>
    page.id === id ? { ...page, published: !page.published } : page
    )
    );
    confirm();
  };

  const duplicatePage = (page: WebPage) => {
    setPages((current) => {
      const index = current.findIndex((item) => item.id === page.id);
      const copy: WebPage = {
        ...page,
        id: `page-${Date.now()}`,
        name: `${page.name} (copie)`,
        slug: `${page.slug}-copie`,
        published: false,
        visits: 0,
        conversions: 0
      };
      const next = [...current];
      next.splice(index + 1, 0, copy);
      return next;
    });
    confirm();
  };

  const saveFunnel = (funnel: Funnel) => {
    setFunnelList((current) =>
    current.map((item) => item.id === funnel.id ? funnel : item)
    );
    setOpenFunnel(funnel);
    confirm();
  };

  /** Mută un pas ca ultimă pagină din funnelul ales */
  const moveStepToFunnel = (step: FunnelStep, targetFunnelId: string) => {
    setFunnelList((current) =>
    current.map((item) =>
    item.id === targetFunnelId ?
    { ...item, steps: [...item.steps, step] } :
    item
    )
    );
    confirm();
  };

  const createFunnel = (name: string, domain: string) => {
    const funnel: Funnel = {
      id: `funnel-${Date.now()}`,
      name,
      domain,
      active: true,
      createdAt: new Date().toISOString(),
      steps: [
      {
        id: `step-${Date.now()}`,
        name: 'Pagină de vânzare',
        kind: 'Sales page',
        path: 'oferta'
      }]

    };
    setFunnelList((current) => [funnel, ...current]);
    confirm();
  };

  const duplicateFunnel = (funnel: Funnel) => {
    setFunnelList((current) => {
      const index = current.findIndex((item) => item.id === funnel.id);
      const copy: Funnel = {
        ...funnel,
        id: `funnel-${Date.now()}`,
        name: `${funnel.name} (copie)`,
        active: false,
        createdAt: new Date().toISOString()
      };
      const next = [...current];
      next.splice(index + 1, 0, copy);
      return next;
    });
    confirm();
  };

  if (editing) {
    return (
      <PageEditor
        page={editing}
        onBack={() => setEditing(null)}
        onSave={savePage} />);


  }

  if (openFunnel) {
    return (
      <>
        <FunnelDetail
          funnel={openFunnel}
          onBack={() => setOpenFunnel(null)}
          onSave={saveFunnel}
          otherFunnels={funnelList.
          filter((item) => item.id !== openFunnel.id).
          map((item) => ({ id: item.id, name: item.name }))}
          onMoveStep={moveStepToFunnel} />
        
        {toast && <Toast message="Acțiune modificată cu succes" />}
      </>);

  }

  const published = pages.filter((page) => page.published).length;
  const totalVisits = pages.reduce((sum, page) => sum + page.visits, 0);
  const totalConversions = pages.reduce(
    (sum, page) => sum + page.conversions,
    0
  );

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Web builder
          </h1>
          <p className="mt-1 text-sm text-ink-700">
            {tab === 'pagini' || tab === 'analytics' ?
            `${pages.length} pagini (${published} publicate) · ${totalVisits} vizitatori și ${totalConversions} conversii în total.` :
            tab === 'formulare' ?
            'Formulare care trimit leaduri direct în listele tale.' :
            tab === 'blogs' ?
            'Articole publicate pe domeniul tău.' :
            `${funnelList.length} funnels · pagini legate într-un parcurs complet de vânzare.`}
          </p>
        </div>
        {tab === 'pagini' &&
        <button
          type="button"
          onClick={() => setEditing(blankPage())}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-3.5 py-2.5 font-display text-sm font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600">
          
            <PlusIcon
            className="h-4 w-4"
            strokeWidth={2.5}
            aria-hidden="true" />
          
            Pagină nouă
          </button>
        }
      </div>

      <div className="mt-5 flex gap-1 border-b border-slate-200">
        {(
        [
        { id: 'funnels', label: 'Funnels' },
        { id: 'pagini', label: 'Pagini' },
        { id: 'formulare', label: 'Formulare' },
        { id: 'blogs', label: 'Blogs' },
        { id: 'analytics', label: 'Analytics' }] as
        const).
        map((item) =>
        <button
          key={item.id}
          type="button"
          onClick={() => setTab(item.id)}
          className={`border-b-2 px-3 py-2.5 font-display text-sm font-bold transition-colors duration-150 ease-out ${
          tab === item.id ?
          'border-brand-500 text-brand-600' :
          'border-transparent text-ink-500 hover:text-ink'}`
          }>
          
            {item.label}
          </button>
        )}
      </div>

      {tab === 'funnels' &&
      <div className="mt-5">
          <FunnelsList
          funnels={funnelList}
          onOpen={setOpenFunnel}
          onCreate={createFunnel}
          onDuplicate={duplicateFunnel}
          onDelete={(id) => {
            setFunnelList((current) =>
            current.filter((item) => item.id !== id)
            );
            confirm();
          }}
          onToggle={(id) =>
          setFunnelList((current) =>
          current.map((item) =>
          item.id === id ? { ...item, active: !item.active } : item
          )
          )
          }
          onUpdate={(id, name, domain) => {
            setFunnelList((current) =>
            current.map((item) =>
            item.id === id ? { ...item, name, domain } : item
            )
            );
            confirm();
          }} />
        
        </div>
      }

      {tab === 'formulare' &&
      <>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-1">
            {(
            [
            { id: 'lista', label: 'Toate formularele' },
            { id: 'submissions', label: 'Submissions' },
            { id: 'statistici', label: 'Analytics' }] as
            const).
            map((item) =>
            <button
              key={item.id}
              type="button"
              onClick={() => setFormsTab(item.id)}
              className={`rounded-md px-3.5 py-2 font-display text-sm font-bold transition-colors duration-150 ease-out ${
              formsTab === item.id ?
              'bg-brand-50 text-brand-700' :
              'text-ink-500 hover:bg-slate-50 hover:text-ink'}`
              }>
              
                {item.label}
              </button>
            )}
            </div>

            {formsTab !== 'lista' &&
          <button
            type="button"
            onClick={confirm}
            className="inline-flex items-center gap-2 rounded-md bg-brand-500 px-3.5 py-2.5 font-display text-sm font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600">
            
                <PlusIcon
              className="h-4 w-4"
              strokeWidth={2.5}
              aria-hidden="true" />
            
                Adaugă formular
              </button>
          }
          </div>

          {formsTab === 'lista' &&
        <EmptyCollection
          icon={ClipboardListIcon}
          title="Nu ai niciun formular momentan"
          description="Creează un formular și colectează leaduri direct în listele din Leads & Clients."
          actionLabel="Creează formular"
          onAction={confirm} />

        }
          {formsTab === 'submissions' && <FormSubmissions forms={[]} />}
          {formsTab === 'statistici' && <FormAnalytics forms={[]} />}
        </>
      }

      {tab === 'blogs' &&
      <EmptyCollection
        icon={NewspaperIcon}
        title="Nu ai niciun blog momentan"
        description="Publică articole pe domeniul tău și adu trafic organic către funnels."
        actionLabel="Creează blog"
        onAction={confirm} />

      }

      {tab === 'analytics' &&
      <WebAnalytics pages={pages} funnels={funnelList} />
      }

      <ul
        className={`mt-6 space-y-3 ${tab === 'pagini' ? '' : 'hidden'}`}>
        
        {pages.map((page) => {
          const rate = page.visits ?
          (page.conversions / page.visits * 100).toFixed(1) :
          '0,0';
          return (
            <li
              key={page.id}
              className="flex flex-wrap items-center gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 pl-0">
              
              <span
                className="h-16 w-1.5 shrink-0 rounded-r-full"
                style={{ backgroundColor: page.color }}
                aria-hidden="true" />
              
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditing(page)}
                    className="font-display text-base font-bold text-ink underline-offset-4 hover:text-brand-600 hover:underline">
                    
                    {page.name}
                  </button>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-ink-700">
                    {page.kind}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                    page.published ?
                    'bg-emerald-50 text-emerald-700' :
                    'bg-amber-50 text-amber-700'}`
                    }>
                    
                    {page.published ? 'Publicată' : 'Draft'}
                  </span>
                </div>
                <p className="mt-1 truncate text-xs text-ink-500">
                  friendly.ro/{page.slug} · {page.blocks.length} blocuri ·{' '}
                  {page.visits} vizitatori · {page.conversions} conversii (
                  {rate}%)
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => togglePublish(page.id)}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-bold transition-colors duration-150 ease-out ${
                  page.published ?
                  'border-slate-200 text-ink-700 hover:bg-slate-50' :
                  'border-brand-200 bg-brand-50 text-brand-700 hover:bg-brand-100'}`
                  }>
                  
                  {page.published ? 'Retrage' : 'Publică'}
                </button>
                <button
                  type="button"
                  onClick={() => duplicatePage(page)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-ink-700 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
                  
                  <CopyIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  Dublează
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(page)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-ink-700 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
                  
                  <PencilIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  Editează
                </button>
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-ink-500">
                  <ExternalLinkIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  Previzualizare
                </span>
              </div>
            </li>);

        })}
      </ul>

      {toast && <Toast message="Acțiune modificată cu succes" />}
    </>);

}