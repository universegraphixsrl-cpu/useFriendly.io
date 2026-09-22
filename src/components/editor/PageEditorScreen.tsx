import React, { useRef, useState } from 'react';
import {
  SmartphoneIcon,
  PlayIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UndoIcon,
  RedoIcon,
  SettingsIcon,
  XIcon } from
'lucide-react';
import {
  containsId,
  duplicateById,
  findNode,
  hasUnconfiguredCalendar,
  moveById,
  updateContainerStyle,
  updateElementStyle,
  insertInCell,
  insertRow,
  insertSection,
  payloadToCellNode,
  payloadToRow,
  payloadToSection,
  positionInCell,
  removeNode,
  defaultPopupStyle,
  defaultPopupSections,
  defaultPageSections,
  shadowOptions,
  type DragPayload,
  type PopupStyle,
  type SectionNode } from
'../../data/editor';
import { PopupSettings } from './PopupSettings';
import { EditorPalette } from './EditorPalette';
import { ElementSettings } from './ElementSettings';
import { ContainerSettings } from './ContainerSettings';
import { DropZone, SectionView, type NodeHandlers } from './EditorCanvas';
import { ProjectsPanel } from './ProjectsPanel';
import { eliteClosersSections } from '../../data/eliteClosersPage';

/** Pagini salvate permanent, deschise ca atare din panoul „Projects” */
const savedPages: Record<string, () => SectionNode[]> = {
  'step-ec-1': eliteClosersSections
};

/** Starea completă a editorului, folosită de undo/redo */
interface Snapshot {
  page: SectionNode[];
  popup: SectionNode[];
}

/** Bordura ferestrei de pop-up, în funcție de tipul ales */
const popupBorder = (style: PopupStyle): React.CSSProperties => {
  if (style.borderMode === 'none') return {};
  const line = `${style.borderWidth}px ${style.borderStyle} ${style.borderColor}`;
  if (style.borderMode === 'full') return { border: line };
  if (style.borderMode === 'bottom') return { borderBottom: line };
  if (style.borderMode === 'top') return { borderTop: line };
  return { borderTop: line, borderBottom: line };
};

interface PageEditorScreenProps {
  pageName: string;
  onExit: () => void;
  onSave: () => void;
}

/** Editorul de pagini pe ecran complet: paletă + canvas cu Section › Row › Element */
export function PageEditorScreen({
  pageName,
  onExit,
  onSave
}: PageEditorScreenProps) {
  const [sections, setSections] = useState<SectionNode[]>(() =>
  defaultPageSections()
  );
  const [dirty, setDirty] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [confirmExit, setConfirmExit] = useState(false);
  // navigarea între paginile altor funnels, fără a ieși din editor
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(pageName);
  const [currentStepId, setCurrentStepId] = useState<string | null>(null);
  const [pendingStep, setPendingStep] = useState<{
    id: string;
    label: string;
  } | null>(null);
  const [savedNotice, setSavedNotice] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const canvasRef = useRef<HTMLElement>(null);
  const [past, setPast] = useState<Snapshot[]>([]);
  const [future, setFuture] = useState<Snapshot[]>([]);

  // layerul de pop-up: propriul arbore de secțiuni, editat peste pagină
  const [popupSections, setPopupSections] = useState<SectionNode[]>([]);
  const [popupStyle, setPopupStyle] = useState<PopupStyle>(defaultPopupStyle());
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupSettings, setPopupSettings] = useState(false);

  const tree = popupOpen ? popupSections : sections;
  const setTree = popupOpen ? setPopupSections : setSections;

  const selectedNode = selectedId ? findNode(tree, selectedId) : null;
  const selectedElement =
  selectedNode && selectedNode.type === 'element' ? selectedNode : null;
  const selectedContainer =
  selectedNode && selectedNode.type !== 'element' ? selectedNode : null;
  const calendarIncomplete =
  hasUnconfiguredCalendar(sections) || hasUnconfiguredCalendar(popupSections);

  const snapshot = (): Snapshot => ({ page: sections, popup: popupSections });

  const update = (next: SectionNode[]) => {
    setPast((history) => [...history, snapshot()]);
    setFuture([]);
    setTree(next);
    setDirty(true);
  };

  const restore = (state: Snapshot) => {
    setSections(state.page);
    setPopupSections(state.popup);
  };

  /** Undo / redo, disponibile doar cât timp există modificări nesalvate */
  const undo = () => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    setPast(past.slice(0, -1));
    setFuture([snapshot(), ...future]);
    restore(previous);
  };

  const redo = () => {
    if (future.length === 0) return;
    const next = future[0];
    setFuture(future.slice(1));
    setPast([...past, snapshot()]);
    restore(next);
  };

  const commitSave = (keepOpen = false) => {
    setDirty(false);
    setPast([]);
    setFuture([]);
    // la trecerea între pagini salvăm fără să închidem editorul
    if (keepOpen) {
      setSavedNotice(true);
      window.setTimeout(() => setSavedNotice(false), 2500);
      return;
    }
    onSave();
  };

  /** La mutare scoatem întâi nodul din arbore, apoi îl inserăm în noua poziție */
  const baseFor = (payload: DragPayload) =>
  payload.kind === 'move' ? removeNode(tree, payload.node.id) : tree;

  /** Nu se poate muta un nod în interiorul lui însuși */
  const invalidTarget = (payload: DragPayload, targetId: string) =>
  payload.kind === 'move' && containsId(payload.node, targetId);

  const isSectionPayload = (payload: DragPayload) =>
  payload.kind === 'section' ||
  payload.kind === 'move' && payload.node.type === 'section';

  /** Meniul se adaugă mereu ca prim element al paginii, indiferent unde e lăsat */
  const isMenuPayload = (payload: DragPayload) =>
  payload.kind === 'element' && payload.element === 'menu';

  /** Pop-up-ul nu intră în arbore: deschide layerul lui de editare */
  const isPopupPayload = (payload: DragPayload) =>
  payload.kind === 'element' && payload.element === 'popup';

  const openPopupLayer = () => {
    // prima deschidere pornește de la șablonul de abonare
    if (popupSections.length === 0) {
      setPopupSections(defaultPopupSections());
      setDirty(true);
    }
    setPopupOpen(true);
    setSelectedId(null);
    // deschidem paleta, ca elementele să poată fi trase direct în pop-up
    setPopupSettings(false);
    setPaletteOpen(true);
  };

  const addMenuAtTop = () => {
    update(
      insertSection(
        tree,
        0,
        payloadToSection({ kind: 'element', element: 'menu' })
      )
    );
    requestAnimationFrame(() =>
    canvasRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    );
  };

  /** Drop la nivel de pagină: orice se trage aici primește section (+ row) automat */
  const dropAtRoot = (index: number, payload: DragPayload) => {
    if (isPopupPayload(payload)) {
      openPopupLayer();
      return;
    }
    if (isMenuPayload(payload)) {
      addMenuAtTop();
      return;
    }
    const base = baseFor(payload);
    let at = index;
    if (payload.kind === 'move' && payload.node.type === 'section') {
      const from = tree.findIndex(
        (section) => section.id === payload.node.id
      );
      if (from !== -1 && from < index) at -= 1;
    }
    update(insertSection(base, at, payloadToSection(payload)));
  };

  /** Click simplu în paletă: adaugă la finalul paginii, în ultimul spațiu liber */
  const addAtEnd = (payload: DragPayload) => {
    if (isPopupPayload(payload)) {
      openPopupLayer();
      return;
    }
    if (isMenuPayload(payload)) {
      addMenuAtTop();
      return;
    }
    const last = tree[tree.length - 1];
    if (isSectionPayload(payload) || !last) {
      update(insertSection(tree, tree.length, payloadToSection(payload)));
    } else {
      update(
        insertRow(
          tree,
          last.id,
          last.children.length,
          payloadToRow(payload)
        )
      );
    }
    // aducem în vizor zona nou adăugată, la finalul paginii
    requestAnimationFrame(() => {
      const canvas = canvasRef.current;
      if (canvas)
      canvas.scrollTo({ top: canvas.scrollHeight, behavior: 'smooth' });
    });
  };

  const handlers: NodeHandlers = {
    hovered,
    setHovered,
    selected: selectedId,
    onSelect: (id: string) => {
      // selectarea unui nod deschide automat panoul de editare din stânga
      setSelectedId(id);
      setPopupSettings(false);
      setPaletteOpen(true);
    },
    device,
    onElementChange: (id, patch) =>
    update(updateElementStyle(tree, id, patch)),

    onDuplicate: (id) => update(duplicateById(tree, id)),
    onDelete: (id) => setDeletingId(id),
    onMove: (id, direction) => update(moveById(tree, id, direction)),
    onDropInCell: (rowId, cellIndex, payload, at) => {
      if (isPopupPayload(payload)) {
        openPopupLayer();
        return;
      }
      if (isMenuPayload(payload)) {
        addMenuAtTop();
        return;
      }
      if (invalidTarget(payload, rowId)) return;
      const base = baseFor(payload);
      if (isSectionPayload(payload)) {
        // o secțiune nu poate intra într-un row: o adăugăm la finalul paginii
        update(insertSection(base, base.length, payloadToSection(payload)));
        return;
      }
      // la mutarea în aceeași celulă, scoaterea nodului decalează pozițiile
      let target = at;
      if (payload.kind === 'move' && typeof at === 'number') {
        const from = positionInCell(
          tree,
          rowId,
          cellIndex,
          payload.node.id
        );
        if (from !== -1 && from < at) target = at - 1;
      }
      update(
        insertInCell(
          base,
          rowId,
          cellIndex,
          payloadToCellNode(payload),
          target
        )
      );
    },
    onDropInSection: (sectionId, index, payload) => {
      if (isPopupPayload(payload)) {
        openPopupLayer();
        return;
      }
      if (isMenuPayload(payload)) {
        addMenuAtTop();
        return;
      }
      if (invalidTarget(payload, sectionId)) return;
      const base = baseFor(payload);
      if (isSectionPayload(payload)) {
        const at = base.findIndex((section) => section.id === sectionId);
        update(insertSection(base, at + 1, payloadToSection(payload)));
        return;
      }
      update(insertRow(base, sectionId, index, payloadToRow(payload)));
    }
  };

  const handleExit = () => {
    if (dirty) setConfirmExit(true);else
    onExit();
  };

  /** Deschide altă pagină în editor; cere salvarea dacă există modificări */
  const openStep = (id: string, label: string) => {
    setProjectsOpen(false);
    if (dirty) {
      setPendingStep({ id, label });
      return;
    }
    loadStep(id, label);
  };

  const loadStep = (id: string, label: string) => {
    setCurrentStepId(id);
    setCurrentPage(label);
    setSections(savedPages[id] ? savedPages[id]() : []);
    setPopupSections([]);
    setPopupOpen(false);
    setSelectedId(null);
    setPast([]);
    setFuture([]);
    setDirty(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      <header className="flex shrink-0 items-center gap-4 border-b border-slate-200 px-6 py-1.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-500 font-display text-sm font-bold text-white">
          F
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={undo}
            disabled={past.length === 0}
            aria-label="Anulează ultima modificare"
            className="rounded-md p-1.5 text-ink transition-colors duration-150 ease-out hover:bg-slate-100 disabled:text-slate-300 disabled:hover:bg-transparent">
            
            <UndoIcon className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={redo}
            disabled={future.length === 0}
            aria-label="Refă modificarea"
            className="rounded-md p-1.5 text-ink transition-colors duration-150 ease-out hover:bg-slate-100 disabled:text-slate-300 disabled:hover:bg-transparent">
            
            <RedoIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setProjectsOpen((open) => !open)}
            aria-expanded={projectsOpen}
            className={`rounded-md border px-3 py-1.5 font-display text-sm font-bold transition-colors duration-150 ease-out ${
            projectsOpen ?
            'border-brand-300 bg-brand-50 text-brand-700' :
            'border-slate-200 text-ink hover:bg-slate-50'}`
            }>
            
            Projects
          </button>
          {projectsOpen &&
          <ProjectsPanel
            currentStepId={currentStepId}
            onOpenStep={openStep}
            onClose={() => setProjectsOpen(false)} />

          }
        </div>
        <p className="font-display text-[15px] font-semibold tracking-tight text-ink">
          {currentPage}
        </p>
        {calendarIncomplete &&
        <p className="ml-4 text-xs font-bold text-red-500">
            Selectează un calendar activ în setările elementului Calendar ca să
            poți salva.
          </p>
        }
        <div className="ml-auto flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
            setDevice(device === 'mobile' ? 'desktop' : 'mobile')
            }
            aria-pressed={device === 'mobile'}
            aria-label="Editare pentru mobil"
            className={`rounded-md p-1.5 transition-colors duration-150 ease-out hover:bg-slate-100 ${
            device === 'mobile' ?
            'bg-brand-50 text-brand-600' :
            'text-ink-500'}`
            }>
            
            <SmartphoneIcon className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Previzualizare"
            className="rounded-md p-1.5 text-ink-500 transition-colors duration-150 ease-out hover:bg-slate-100">
            
            <PlayIcon className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={commitSave}
            disabled={!dirty || calendarIncomplete}
            title={
            calendarIncomplete ?
            'Selectează un calendar activ pentru elementul Calendar' :
            undefined
            }
            className="rounded-md border border-brand-300 bg-brand-50 px-4 py-1.5 text-sm font-bold text-brand-700 transition-colors duration-150 ease-out hover:border-brand-500 hover:bg-brand-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-ink-400">
            
            Salvează
          </button>
          <button
            type="button"
            onClick={handleExit}
            className="rounded-md bg-brand-500 px-4 py-1.5 font-display text-sm font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600">
            
            Ieși
          </button>
        </div>
      </header>

      <div className="relative flex min-h-0 flex-1">
        {paletteOpen && (
        popupSettings && !selectedElement && !selectedContainer ?
        <PopupSettings
          style={popupStyle}
          onChange={(patch) => {
            setPopupStyle((current) => ({ ...current, ...patch }));
            setDirty(true);
          }}
          onClose={() => setPopupSettings(false)} /> :

        selectedElement ?
        <ElementSettings
          node={selectedElement}
          device={device}
          onChange={(patch) =>
          update(updateElementStyle(tree, selectedElement.id, patch))
          }
          onClose={() => setSelectedId(null)} /> :

        selectedContainer ?
        <ContainerSettings
          node={selectedContainer}
          onChange={(patch) =>
          update(updateContainerStyle(tree, selectedContainer.id, patch))
          }
          onClose={() => setSelectedId(null)} /> :


        <EditorPalette onAdd={addAtEnd} />)
        }

        <button
          type="button"
          onClick={() => setPaletteOpen((value) => !value)}
          aria-label={paletteOpen ? 'Ascunde meniul' : 'Arată meniul'}
          className="absolute top-1/2 z-30 flex h-14 w-7 -translate-y-1/2 items-center justify-center rounded-r-xl border border-l-0 border-slate-200 bg-slate-100 text-ink-500 shadow-sm transition-colors duration-150 ease-out hover:bg-slate-200"
          style={{ left: paletteOpen ? 340 : 0 }}>
          
          {paletteOpen ?
          <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" /> :

          <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
          }
        </button>

        <main
          ref={canvasRef}
          className="relative flex-1 overflow-y-auto bg-slate-50"
          onMouseLeave={() => setHovered(null)}
          onClick={() => setSelectedId(null)}>
          
          {sections.length === 0 ?
          <div className="w-full p-6">
              <DropZoneEmpty onDrop={(payload) => dropAtRoot(0, payload)} />
            </div> :

          <div className="w-full space-y-0">
              <DropZone onDrop={(payload) => dropAtRoot(0, payload)} />
              {sections.map((section, index) =>
            <React.Fragment key={section.id}>
                  <SectionView node={section} handlers={handlers} />
                  <DropZone
                onDrop={(payload) => dropAtRoot(index + 1, payload)} />
              
                </React.Fragment>
            )}
            </div>
          }

          {popupOpen &&
          <div
            className="absolute inset-0 z-40 flex items-start justify-center overflow-y-auto bg-ink/45 px-6 py-16"
            onClick={(event) => {
              // click pe fundal: revenim la paletă, fără să închidem layerul
              event.stopPropagation();
              setSelectedId(null);
              setPopupSettings(false);
            }}>
            
              <div className="w-full" style={{ maxWidth: popupStyle.width }}>
                <div className="mb-3 flex justify-center gap-2">
                  <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setSelectedId(null);
                    setPopupSettings(true);
                    setPaletteOpen(true);
                  }}
                  className="flex items-center gap-2 rounded-md bg-brand-500 px-4 py-2 font-display text-[13px] font-bold uppercase tracking-wide text-white transition-colors duration-150 ease-out hover:bg-brand-600">
                  
                    <SettingsIcon className="h-4 w-4" aria-hidden="true" />
                    Editează setările pop-up-ului
                  </button>
                  <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setPopupOpen(false);
                    setPopupSettings(false);
                    setSelectedId(null);
                  }}
                  aria-label="Închide layerul de pop-up"
                  className="rounded-md bg-white px-3 py-2 text-ink-500 shadow-sm transition-colors duration-150 ease-out hover:text-ink">
                  
                    <XIcon className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>

                <div
                className="relative"
                style={{
                  backgroundColor: popupStyle.bgColor,
                  paddingTop: popupStyle.padY,
                  paddingBottom: popupStyle.padY,
                  paddingLeft: popupStyle.padX,
                  paddingRight: popupStyle.padX,
                  borderRadius: popupStyle.radius,
                  boxShadow:
                  shadowOptions.find(
                    (option) => option.key === popupStyle.shadow
                  )?.css ?? 'none',
                  ...popupBorder(popupStyle)
                }}>
                
                  {popupStyle.showClose &&
                <span className="absolute right-3 top-3 text-ink-400">
                      <XIcon className="h-5 w-5" aria-hidden="true" />
                    </span>
                }

                  {popupSections.length === 0 ?
                <DropZoneEmpty onDrop={(payload) => dropAtRoot(0, payload)} /> :

                <div className="w-full space-y-0">
                      <DropZone onDrop={(payload) => dropAtRoot(0, payload)} />
                      {popupSections.map((section, index) =>
                  <React.Fragment key={section.id}>
                          <SectionView node={section} handlers={handlers} />
                          <DropZone
                      onDrop={(payload) => dropAtRoot(index + 1, payload)} />
                    
                        </React.Fragment>
                  )}
                    </div>
                }
                </div>
              </div>
            </div>
          }
        </main>
      </div>

      {deletingId &&
      <div className="fixed inset-x-0 top-6 z-[60] flex justify-center px-6">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-2xl">
            <p className="font-display text-lg font-bold text-ink">
              Vrei să ștergi acest item?
            </p>
            <div className="mt-4 flex justify-end gap-3">
              <button
              type="button"
              onClick={() => setDeletingId(null)}
              className="rounded-md border border-slate-200 bg-white px-4 py-2.5 text-[15px] font-semibold text-ink-700 transition-colors duration-150 ease-out hover:bg-slate-50">
              
                Cancel
              </button>
              <button
              type="button"
              onClick={() => {
                update(removeNode(tree, deletingId));
                setDeletingId(null);
              }}
              className="rounded-md bg-red-500 px-4 py-2.5 font-display text-[15px] font-bold text-white transition-colors duration-150 ease-out hover:bg-red-600">
              
                Șterge
              </button>
            </div>
          </div>
        </div>
      }

      {savedNotice &&
      <div className="fixed bottom-6 left-1/2 z-[130] -translate-x-1/2 rounded-lg bg-emerald-100 px-4 py-2.5 text-sm font-semibold text-emerald-800 shadow-lg">
          Pagina a fost salvată
        </div>
      }

      {pendingStep &&
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/50 px-6">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <h2 className="font-display text-xl font-bold text-ink">
              Ai modificări nesalvate, salvează acum
            </h2>
            <p className="mt-2 text-sm text-ink-500">
              Dacă treci la „{pendingStep.label}” acum, tot ce ai construit în
              această pagină se pierde.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
              type="button"
              onClick={() => {
                loadStep(pendingStep.id, pendingStep.label);
                setPendingStep(null);
              }}
              className="rounded-md border border-slate-200 bg-white px-4 py-2.5 text-[15px] font-semibold text-ink-700 transition-colors duration-150 ease-out hover:bg-slate-50">
              
                Continuă fără a salva
              </button>
              <button
              type="button"
              onClick={() => {
                commitSave(true);
                loadStep(pendingStep.id, pendingStep.label);
                setPendingStep(null);
              }}
              className="rounded-md bg-brand-500 px-4 py-2.5 font-display text-[15px] font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600">
              
                Salvează și continuă
              </button>
            </div>
          </div>
        </div>
      }

      {confirmExit &&
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/50 px-6">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <h2 className="font-display text-xl font-bold text-ink">
              Ai modificări nesalvate, salvează acum
            </h2>
            <p className="mt-2 text-sm text-ink-500">
              Dacă ieși acum, tot ce ai construit în această pagină se pierde.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
              type="button"
              onClick={onExit}
              className="rounded-md border border-slate-200 bg-white px-4 py-2.5 text-[15px] font-semibold text-ink-700 transition-colors duration-150 ease-out hover:bg-slate-50">
              
                Ieși fără a salva
              </button>
              <button
              type="button"
              onClick={() => {
                setConfirmExit(false);
                commitSave();
              }}
              className="rounded-md bg-brand-500 px-4 py-2.5 font-display text-[15px] font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600">
              
                Salvează
              </button>
            </div>
          </div>
        </div>
      }
    </div>);

}

/** Layout-ul gol al unei pagini noi */
function DropZoneEmpty({ onDrop }: {onDrop: (payload: DragPayload) => void;}) {
  return (
    <div className="rounded-xl bg-white p-4">
      <DropZone hero label="Adaugă primul tău element aici" onDrop={onDrop} />
    </div>);

}