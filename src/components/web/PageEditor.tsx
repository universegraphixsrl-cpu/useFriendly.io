import React, { useState } from 'react';
import {
  ArrowLeftIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  Trash2Icon,
  PlusIcon,
  MonitorIcon,
  SmartphoneIcon } from
'lucide-react';
import {
  blockLibrary,
  blockDefaults,
  pageColors,
  pageKinds,
  type BlockType,
  type PageBlock,
  type WebPage } from
'../../data/webPages';
import { BlockPreview } from './BlockPreview';

interface PageEditorProps {
  page: WebPage;
  onBack: () => void;
  onSave: (page: WebPage) => void;
}

/** Builder rudimentar: paletă de blocuri, canvas și panou de setări */
export function PageEditor({ page, onBack, onSave }: PageEditorProps) {
  const [draft, setDraft] = useState<WebPage>(page);
  const [selectedId, setSelectedId] = useState<string | null>(
    page.blocks[0]?.id ?? null
  );
  const [device, setDevice] = useState<'desktop' | 'mobil'>('desktop');

  const dirty = JSON.stringify(draft) !== JSON.stringify(page);
  const selected = draft.blocks.find((block) => block.id === selectedId) ?? null;

  const addBlock = (type: BlockType) => {
    const block: PageBlock = {
      id: `block-${Date.now()}`,
      type,
      ...blockDefaults[type]
    };
    setDraft((current) => ({ ...current, blocks: [...current.blocks, block] }));
    setSelectedId(block.id);
  };

  const updateBlock = (id: string, patch: Partial<PageBlock>) =>
  setDraft((current) => ({
    ...current,
    blocks: current.blocks.map((block) =>
    block.id === id ? { ...block, ...patch } : block
    )
  }));

  const moveBlock = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= draft.blocks.length) return;
    const blocks = [...draft.blocks];
    [blocks[index], blocks[target]] = [blocks[target], blocks[index]];
    setDraft((current) => ({ ...current, blocks }));
  };

  const removeBlock = (id: string) =>
  setDraft((current) => ({
    ...current,
    blocks: current.blocks.filter((block) => block.id !== id)
  }));

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-700 transition-colors duration-150 ease-out hover:text-brand-600">
            
            <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
            Înapoi la pagini
          </button>
          <h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            {draft.name || 'Pagină fără titlu'}
          </h1>
          <p className="mt-1 text-sm text-ink-700">
            friendly.ro/{draft.slug || 'pagina-mea'} · {draft.blocks.length}{' '}
            blocuri · {draft.published ? 'publicată' : 'draft'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg border border-slate-200 bg-white p-0.5">
            {(['desktop', 'mobil'] as const).map((option) =>
            <button
              key={option}
              type="button"
              onClick={() => setDevice(option)}
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-bold transition-colors duration-150 ease-out ${
              device === option ?
              'bg-brand-50 text-brand-700' :
              'text-ink-700 hover:bg-slate-50'}`
              }>
              
                {option === 'desktop' ?
              <MonitorIcon className="h-3.5 w-3.5" aria-hidden="true" /> :

              <SmartphoneIcon className="h-3.5 w-3.5" aria-hidden="true" />
              }
                {option === 'desktop' ? 'Desktop' : 'Mobil'}
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => onSave(draft)}
            disabled={!dirty || draft.name.trim().length === 0}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-3.5 py-2.5 font-display text-sm font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-slate-300">
            
            Salvează pagina
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[220px_minmax(0,1fr)_280px]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-3">
          <p className="px-1 text-xs font-bold uppercase tracking-wide text-ink-500">
            Blocuri
          </p>
          <ul className="mt-2 space-y-1">
            {blockLibrary.map((item) =>
            <li key={item.type}>
                <button
                type="button"
                onClick={() => addBlock(item.type)}
                className="flex w-full items-start gap-2 rounded-lg px-2 py-2 text-left transition-colors duration-150 ease-out hover:bg-slate-50">
                
                  <span aria-hidden="true">{item.emoji}</span>
                  <span className="min-w-0">
                    <span className="block text-sm font-bold text-ink">
                      {item.label}
                    </span>
                    <span className="block text-xs leading-snug text-ink-500">
                      {item.hint}
                    </span>
                  </span>
                  <PlusIcon
                  className="ml-auto mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-500"
                  aria-hidden="true" />
                
                </button>
              </li>
            )}
          </ul>
        </aside>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          {draft.blocks.length === 0 ?
          <p className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-12 text-center text-sm text-ink-500">
              Pagina e goală. Adaugă un bloc din stânga.
            </p> :

          <div
            className={`mx-auto space-y-3 ${
            device === 'mobil' ? 'max-w-sm' : 'max-w-2xl'}`
            }>
            
              {draft.blocks.map((block, index) =>
            <div key={block.id} className="group relative">
                  <button
                type="button"
                onClick={() => setSelectedId(block.id)}
                className={`block w-full rounded-xl text-left transition-shadow duration-150 ease-out ${
                selectedId === block.id ?
                'ring-2 ring-brand-400' :
                'hover:ring-2 hover:ring-slate-200'}`
                }>
                
                    <BlockPreview block={block} color={draft.color} />
                  </button>
                  <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity duration-150 ease-out group-hover:opacity-100">
                    <button
                  type="button"
                  onClick={() => moveBlock(index, -1)}
                  aria-label="Mută blocul mai sus"
                  className="rounded-md bg-white/90 p-1 text-ink-700 shadow-sm hover:text-brand-600">
                  
                      <ArrowUpIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                    <button
                  type="button"
                  onClick={() => moveBlock(index, 1)}
                  aria-label="Mută blocul mai jos"
                  className="rounded-md bg-white/90 p-1 text-ink-700 shadow-sm hover:text-brand-600">
                  
                      <ArrowDownIcon
                    className="h-3.5 w-3.5"
                    aria-hidden="true" />
                  
                    </button>
                    <button
                  type="button"
                  onClick={() => removeBlock(block.id)}
                  aria-label="Șterge blocul"
                  className="rounded-md bg-white/90 p-1 text-red-600 shadow-sm hover:text-red-700">
                  
                      <Trash2Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
            )}
            </div>
          }
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-ink-500">
              Setările paginii
            </p>
            <label className="mt-3 block text-xs font-bold text-ink-700">
              Denumire
              <input
                value={draft.name}
                onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  name: event.target.value
                }))
                }
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-ink outline-none focus:border-brand-400" />
              
            </label>
            <label className="mt-3 block text-xs font-bold text-ink-700">
              Link
              <input
                value={draft.slug}
                onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  slug: event.target.value
                }))
                }
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-ink outline-none focus:border-brand-400" />
              
            </label>
            <label className="mt-3 block text-xs font-bold text-ink-700">
              Tip
              <select
                value={draft.kind}
                onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  kind: event.target.value as WebPage['kind']
                }))
                }
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-ink outline-none focus:border-brand-400">
                
                {pageKinds.map((kind) =>
                <option key={kind}>{kind}</option>
                )}
              </select>
            </label>
            <p className="mt-3 text-xs font-bold text-ink-700">Culoare accent</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {pageColors.map((color) =>
              <button
                key={color}
                type="button"
                onClick={() => setDraft((current) => ({ ...current, color }))}
                aria-label={`Alege culoarea ${color}`}
                className={`h-6 w-6 rounded-full transition-transform duration-150 ease-out ${
                draft.color === color ?
                'ring-2 ring-ink ring-offset-2' :
                'hover:scale-110'}`
                }
                style={{ backgroundColor: color }} />

              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-ink-500">
              Blocul selectat
            </p>
            {selected ?
            <>
                <p className="mt-2 font-display text-sm font-bold text-ink">
                  {
                blockLibrary.find((item) => item.type === selected.type)?.
                label
                }
                </p>
                <label className="mt-3 block text-xs font-bold text-ink-700">
                  Titlu
                  <input
                  value={selected.heading}
                  onChange={(event) =>
                  updateBlock(selected.id, { heading: event.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-ink outline-none focus:border-brand-400" />
                
                </label>
                <label className="mt-3 block text-xs font-bold text-ink-700">
                  Text
                  <textarea
                  value={selected.body}
                  onChange={(event) =>
                  updateBlock(selected.id, { body: event.target.value })
                  }
                  rows={4}
                  className="mt-1 w-full resize-y rounded-lg border border-slate-200 px-3 py-2 text-sm leading-relaxed text-ink outline-none focus:border-brand-400" />
                
                </label>
                <label className="mt-3 block text-xs font-bold text-ink-700">
                  Buton
                  <input
                  value={selected.action}
                  onChange={(event) =>
                  updateBlock(selected.id, { action: event.target.value })
                  }
                  placeholder="Lasă gol pentru a ascunde butonul"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-ink outline-none focus:border-brand-400" />
                
                </label>
              </> :

            <p className="mt-2 text-sm text-ink-500">
                Alege un bloc din canvas ca să-i editezi conținutul.
              </p>
            }
          </div>
        </aside>
      </div>
    </>);

}