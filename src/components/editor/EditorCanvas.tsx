import React, { useState } from 'react';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  SettingsIcon,
  CopyIcon,
  SaveIcon,
  Trash2Icon } from
'lucide-react';
import {
  defaultContainerStyle,
  defaultStyle,
  H_MARGIN_SCALE,
  V_PADDING_SCALE,
  elementLabels,
  shadowOptions,
  type ContainerStyle,
  type DragPayload,
  type ElementNode,
  type ElementStyle,
  type RowNode,
  type SectionNode } from
'../../data/editor';
import { readDrag, endDrag, startDrag } from './dragPayload';
import { ElementPreview } from './ElementPreview';

type Level = 'section' | 'row' | 'element';

/**
 * Învelișul unui copil dintr-o celulă: jumătatea de sus inserează deasupra,
 * jumătatea de jos inserează dedesubt, cu o bară fină albastră ca indiciu.
 */
function CellSlot({
  children,
  onDropAt



}: {children: React.ReactNode;onDropAt: (payload: DragPayload, position: 'before' | 'after') => void;}) {
  const [edge, setEdge] = useState<'before' | 'after' | null>(null);
  return (
    <div
      className={`relative transition-colors duration-150 ease-out ${
      edge ? 'bg-brand-50' : ''}`
      }
      onDragOver={(event) => {
        event.preventDefault();
        event.stopPropagation();
        const rect = event.currentTarget.getBoundingClientRect();
        setEdge(
          event.clientY < rect.top + rect.height / 2 ? 'before' : 'after'
        );
      }}
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node))
        setEdge(null);
      }}
      onDrop={(event) => {
        event.preventDefault();
        event.stopPropagation();
        const payload = readDrag(event);
        const position = edge ?? 'after';
        setEdge(null);
        endDrag();
        if (payload) onDropAt(payload, position);
      }}>
      
      {edge &&
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 z-20 h-1 rounded-full bg-brand-400 ${
        edge === 'before' ? '-top-0.5' : '-bottom-0.5'}`
        } />

      }
      {children}
    </div>);

}

/** Eticheta roșie afișată când nodul e ascuns pe mobil */
function DesktopOnlyBadge({ shifted }: {shifted: boolean;}) {
  return (
    <span
      className="pointer-events-none absolute -top-px z-30 bg-red-500 px-2 py-1 text-xs font-bold uppercase tracking-wide text-white"
      style={{ right: shifted ? 132 : 0 }}>
      
      Desktop only
    </span>);

}

/** Traduce stilul unei secțiuni/row în CSS */
function containerCss(style: ContainerStyle): React.CSSProperties {
  const shadow =
  shadowOptions.find((option) => option.key === style.shadow) ??
  shadowOptions[0];
  return {
    // flow-root oprește colapsarea marginilor copiilor în afara containerului
    display: 'flow-root',
    backgroundColor: style.bgColor,
    backgroundImage: style.bgImage ? `url(${style.bgImage})` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    boxShadow: shadow.css === 'none' ? undefined : shadow.css,
    // padding-ul negativ nu există în CSS; se aplică pe conținutul din interior (vezi innerCss)
    paddingTop: Math.max(0, style.padTop) * V_PADDING_SCALE,
    paddingBottom: Math.max(0, style.padBottom) * V_PADDING_SCALE,
    paddingLeft: Math.max(0, style.padLeft),
    paddingRight: Math.max(0, style.padRight),
    marginTop: style.marTop,
    marginBottom: style.marBottom,
    marginLeft: style.marLeft * H_MARGIN_SCALE,
    marginRight: style.marRight * H_MARGIN_SCALE,
    // rotunjirea colțurilor e independentă de contur
    borderRadius: style.borderRadius ?? 0,
    overflow: style.borderRadius ? 'hidden' : undefined,
    ...(() => {
      if (!style.borderMode || style.borderMode === 'none') return {};
      const line = `${style.borderWidth ?? 1}px ${
      style.borderStyle ?? 'solid'} ${

      style.borderColor && style.borderColor !== 'transparent' ?
      style.borderColor :
      '#0f1729'}`;

      const sides =
      style.borderMode === 'full' ?
      { border: line } :
      style.borderMode === 'bottom' ?
      { borderBottom: line } :
      style.borderMode === 'top' ?
      { borderTop: line } :
      { borderTop: line, borderBottom: line };
      return { ...sides, borderRadius: style.borderRadius ?? 0 };
    })()
  };
}

/** Padding-ul negativ strânge conținutul din interiorul containerului */
function innerCss(style: ContainerStyle): React.CSSProperties {
  return {
    marginTop: Math.min(0, style.padTop) * V_PADDING_SCALE,
    marginBottom: Math.min(0, style.padBottom) * V_PADDING_SCALE,
    marginLeft: Math.min(0, style.padLeft),
    marginRight: Math.min(0, style.padRight)
  };
}

const levelStyles: Record<
  Level,
  {ring: string;label: string;toolbar: string;}> =
{
  section: {
    ring: 'ring-2 ring-emerald-400',
    label: 'bg-emerald-400 text-white',
    toolbar: 'bg-emerald-400 text-white'
  },
  row: {
    // conturul row-ului stă mai în exterior, ca să nu se suprapună peste
    // conturul portocaliu al elementului dinăuntru
    ring: 'ring-2 ring-brand-500 ring-offset-[14px] ring-offset-transparent',
    label: 'bg-brand-500 text-white',
    toolbar: 'bg-brand-500 text-white'
  },
  element: {
    ring: 'ring-2 ring-orange-500',
    label: 'bg-orange-500 text-white',
    toolbar: 'bg-orange-500 text-white'
  }
};

interface NodeChromeProps {
  level: Level;
  label: string;
  active: boolean;
  onDuplicate: () => void;
  onDelete: () => void;
  onMove: (direction: 'up' | 'down') => void;
  /** „above” așază eticheta deasupra nodului, ca să nu acopere conținutul */
  placement?: 'over' | 'above';
  /** Menține nodul „activ” cât timp cursorul e pe etichetă sau pe bara de acțiuni */
  onKeepActive?: () => void;
  /** Selectează containerul părinte (row-ul), din bara elementului */
  onSelectParent?: () => void;
}

/** Eticheta și bara de acțiuni afișate la hover pe un nod */
function NodeChrome({
  level,
  label,
  active,
  onDuplicate,
  onDelete,
  onMove,
  placement = 'over',
  onKeepActive,
  onSelectParent
}: NodeChromeProps) {
  if (!active) return null;
  const styles = levelStyles[level];
  const anchor = placement === 'above' ? 'bottom-full' : '-top-px';
  // cât timp cursorul e pe etichetă sau pe bara de acțiuni, nodul rămâne activ
  const keep = (event: React.MouseEvent) => {
    event.stopPropagation();
    onKeepActive?.();
  };
  return (
    <>
      <span
        onMouseMove={keep}
        onMouseOver={keep}
        className={`absolute ${anchor} left-0 z-30 px-2.5 py-1 text-xs font-bold ${styles.label}`}>
        
        {label}
        <button
          type="button"
          aria-label="Mută mai jos"
          className="pointer-events-auto ml-2 align-middle"
          onClick={(event) => {
            event.stopPropagation();
            onMove('down');
          }}>
          
          <ArrowDownIcon className="inline h-3.5 w-3.5" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Mută mai sus"
          className="pointer-events-auto ml-1.5 align-middle"
          onClick={(event) => {
            event.stopPropagation();
            onMove('up');
          }}>
          
          <ArrowUpIcon className="inline h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </span>
      <div
        onMouseMove={keep}
        onMouseOver={keep}
        className={`absolute ${anchor} right-0 z-30 flex items-center gap-1 px-2 py-1 ${styles.toolbar}`}>
        
        {onSelectParent &&
        <button
          type="button"
          aria-label="Selectează row-ul"
          title="Selectează row-ul"
          className="pointer-events-auto mr-1 rounded bg-brand-500 px-1.5 py-0.5 text-[11px] font-bold text-white"
          onClick={(event) => {
            event.stopPropagation();
            onSelectParent();
          }}>
          
            Row
          </button>
        }
        <button
          type="button"
          aria-label="Setări"
          className="pointer-events-auto p-1">
          
          <SettingsIcon className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Dublează"
          className="pointer-events-auto p-1"
          onClick={(event) => {
            event.stopPropagation();
            onDuplicate();
          }}>
          
          <CopyIcon className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Salvează"
          className="pointer-events-auto p-1">
          
          <SaveIcon className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Șterge"
          className="pointer-events-auto p-1"
          onClick={(event) => {
            event.stopPropagation();
            onDelete();
          }}>
          
          <Trash2Icon className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </>);

}

interface DropZoneProps {
  onDrop: (payload: DragPayload) => void;
  label?: string;
  tall?: boolean;
  /** Varianta mare, pentru pagina goală */
  hero?: boolean;
  /** Zonă goală mai înaltă, pentru o secțiune nouă */
  tallHeight?: boolean;
}

/** Zonă de drop între noduri; se evidențiază când tragi ceva peste ea */
export function DropZone({
  onDrop,
  label,
  tall,
  hero,
  tallHeight
}: DropZoneProps) {
  const [over, setOver] = useState(false);

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const payload = readDrag(event);
    setOver(false);
    endDrag();
    if (payload) onDrop(payload);
  };

  // varianta „lipită”: nu ocupă spațiu în layout, dar rămâne zonă de drop
  if (!hero && !tall) {
    return (
      <div className="relative h-0">
        <div
          onDragOver={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setOver(true);
          }}
          onDragLeave={() => setOver(false)}
          onDrop={handleDrop}
          className={`absolute inset-x-0 -top-2 z-10 flex h-4 items-center justify-center transition-colors duration-150 ease-out ${
          over ? 'h-8 -top-4 bg-brand-50 ring-2 ring-brand-500' : ''}`
          }>
          
          {over &&
          <span className="text-xs font-bold text-brand-600">
              Plasează aici
            </span>
          }
        </div>
      </div>);

  }

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        event.stopPropagation();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(event) => {
        event.preventDefault();
        event.stopPropagation();
        const payload = readDrag(event);
        setOver(false);
        endDrag();
        if (payload) onDrop(payload);
      }}
      className={`flex items-center justify-center rounded transition-colors duration-150 ease-out ${
      hero ?
      'min-h-[280px]' :
      tall ?
      tallHeight ?
      'min-h-[176px]' :
      'min-h-[72px]' :
      over ?
      'min-h-[40px]' :
      'min-h-[6px]'} ${

      over ?
      `border-2 border-dashed border-brand-500 bg-brand-50 font-bold text-brand-600 ${hero ? 'text-2xl' : 'text-sm'}` :
      hero ?
      'border-2 border-dashed border-brand-200 bg-brand-50/40 font-display text-2xl font-bold text-brand-600' :
      tall ?
      'border-2 border-dashed border-slate-200 text-sm font-semibold text-ink-400' :
      ''}`
      }>
      
      {over ? 'Plasează aici' : hero || tall ? label : null}
    </div>);

}

interface NodeHandlers {
  hovered: string | null;
  setHovered: (id: string | null) => void;
  selected: string | null;
  onSelect: (id: string) => void;
  device: 'desktop' | 'mobile';
  onElementChange: (id: string, patch: Partial<ElementStyle>) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, direction: 'up' | 'down') => void;
  onDropInCell: (
  rowId: string,
  cellIndex: number,
  payload: DragPayload,
  at?: number)
  => void;
  onDropInSection: (
  sectionId: string,
  index: number,
  payload: DragPayload)
  => void;
}

function ElementView({
  node,
  handlers,
  parentId





}: {node: ElementNode;handlers: NodeHandlers; /** Row-ul care conține elementul, ca să poată fi selectat direct din bara lui */parentId?: string;}) {
  const active = handlers.hovered === node.id || handlers.selected === node.id;
  const style = { ...defaultStyle(node.kind), ...node.style };
  const hiddenHere =
  handlers.device === 'mobile' ?
  node.style?.visibleMobile === false :
  node.style?.visibleDesktop === false;
  return (
    <div
      draggable
      onDragStart={(event) => {
        event.stopPropagation();
        startDrag(event, { kind: 'move', node });
      }}
      onDragEnd={endDrag}
      onClick={(event) => {
        event.stopPropagation();
        handlers.onSelect(node.id);
      }}
      onMouseMove={(event) => {
        event.stopPropagation();
        handlers.setHovered(node.id);
      }}
      onMouseOver={(event) => {
        event.stopPropagation();
        handlers.setHovered(node.id);
      }}
      // elementele foarte subțiri (linie, spațiu, bara de progres) primesc o zonă
      // de hover utilizabilă, ca să poată fi selectate ușor peste row și secțiune
      className={`relative z-[1] min-w-0 cursor-grab break-words active:cursor-grabbing ${
      node.kind === 'divider' ||
      node.kind === 'spacer' ||
      node.kind === 'progress' ?
      'flex min-h-[26px] flex-col justify-center' :
      ''} ${
      active ? levelStyles.element.ring : 'ring-1 ring-transparent'} ${hiddenHere ? 'opacity-40' : ''}`}
      style={{
        marginTop: style.marTop,
        marginBottom: style.marBottom,
        marginLeft: style.marLeft * H_MARGIN_SCALE,
        marginRight: style.marRight * H_MARGIN_SCALE
      }}>
      
      {node.style?.visibleMobile === false &&
      <DesktopOnlyBadge shifted={active} />
      }
      <NodeChrome
        level="element"
        label={elementLabels[node.kind]}
        placement="above"
        active={active}
        onKeepActive={() => handlers.setHovered(node.id)}
        onSelectParent={
        parentId ?
        () => {
          handlers.setHovered(parentId);
          handlers.onSelect(parentId);
        } :
        undefined
        }
        onDuplicate={() => handlers.onDuplicate(node.id)}
        onDelete={() => handlers.onDelete(node.id)}
        onMove={(direction) => handlers.onMove(node.id, direction)} />
      
      <ElementPreview
        node={node}
        device={handlers.device}
        onChange={(patch) => handlers.onElementChange(node.id, patch)} />
      
    </div>);

}

function RowView({
  node,
  handlers



}: {node: RowNode;handlers: NodeHandlers;}) {
  const active = handlers.hovered === node.id || handlers.selected === node.id;
  const style = { ...defaultContainerStyle('row'), ...node.style };
  const hiddenHere =
  handlers.device === 'mobile' ? !style.visibleMobile : !style.visibleDesktop;
  const gridCols =
  node.columns === 1 ?
  'grid-cols-1' :
  node.columns === 2 ?
  'grid-cols-2' :
  node.columns === 3 || node.columns === 6 ?
  'grid-cols-3' :
  'grid-cols-4';

  return (
    <div
      draggable
      onDragStart={(event) => {
        event.stopPropagation();
        startDrag(event, { kind: 'move', node });
      }}
      onDragEnd={endDrag}
      onClick={(event) => {
        event.stopPropagation();
        handlers.onSelect(node.id);
      }}
      onMouseMove={(event) => {
        event.stopPropagation();
        handlers.setHovered(node.id);
      }}
      onMouseOver={(event) => {
        event.stopPropagation();
        handlers.setHovered(node.id);
      }}
      // conturul rămâne vizibil și când cursorul e pe un element din interior;
      // outline-offset îl desenează în afara elementului, ca să nu se suprapună
      className={`relative min-w-0 cursor-grab active:cursor-grabbing hover:outline hover:outline-2 hover:outline-offset-4 hover:outline-brand-400 ${active ? levelStyles.row.ring : 'ring-1 ring-transparent'} ${hiddenHere ? 'opacity-40' : ''}`}
      style={containerCss(style)}>
      
      {style.bgVideo &&
      <video
        src={style.bgVideo}
        muted
        loop
        autoPlay
        playsInline
        className="pointer-events-none absolute inset-0 h-full w-full object-cover" />

      }
      <div className="relative" style={innerCss(style)}>
      {style.visibleMobile === false && <DesktopOnlyBadge shifted={active} />}
      <NodeChrome
          level="row"
          label="Row"
          active={active}
          onKeepActive={() => handlers.setHovered(node.id)}
          onDuplicate={() => handlers.onDuplicate(node.id)}
          onDelete={() => handlers.onDelete(node.id)}
          onMove={(direction) => handlers.onMove(node.id, direction)} />
        
      <div className={`grid gap-6 ${gridCols}`}>
        {node.cells.map((cell, index) =>
          // min-w-0 lasă conținutul lung să se rupă, iar justify-center îl ține centrat pe verticală
          <div
            key={index}
            // celula goală păstrează zona de drop; cea plină se strânge pe conținut
            className={`flex min-w-0 flex-col justify-center [overflow-wrap:anywhere] ${
            cell.length === 0 ? 'min-h-[72px]' : ''}`
            }>
            
            {cell.map((child, childIndex) =>
            <CellSlot
              key={child.id}
              onDropAt={(payload, position) =>
              handlers.onDropInCell(
                node.id,
                index,
                payload,
                position === 'before' ? childIndex : childIndex + 1
              )
              }>
              
                {child.type === 'row' ?
              <RowView node={child} handlers={handlers} /> :

              <ElementView
                node={child}
                handlers={handlers}
                parentId={node.id} />

              }
              </CellSlot>
            )}
            <DropZone
              tall={cell.length === 0}
              label="Trage un element aici"
              onDrop={(payload) =>
              handlers.onDropInCell(node.id, index, payload)
              } />
            
          </div>
          )}
        </div>
      </div>
    </div>);

}

export function SectionView({
  node,
  handlers



}: {node: SectionNode;handlers: NodeHandlers;}) {
  const active = handlers.hovered === node.id || handlers.selected === node.id;
  const style = { ...defaultContainerStyle('section'), ...node.style };
  const hiddenHere =
  handlers.device === 'mobile' ? !style.visibleMobile : !style.visibleDesktop;
  return (
    <section
      draggable
      onDragStart={(event) => {
        event.stopPropagation();
        startDrag(event, { kind: 'move', node });
      }}
      onDragEnd={endDrag}
      onClick={(event) => {
        event.stopPropagation();
        handlers.onSelect(node.id);
      }}
      onMouseOver={(event) => {
        event.stopPropagation();
        handlers.setHovered(node.id);
      }}
      className={`relative w-full hover:outline hover:outline-2 hover:-outline-offset-2 hover:outline-emerald-400 ${active ? levelStyles.section.ring : 'ring-1 ring-transparent'} ${hiddenHere ? 'opacity-40' : ''}`}
      style={containerCss(style)}>
      
      {style.bgVideo &&
      <video
        src={style.bgVideo}
        muted
        loop
        autoPlay
        playsInline
        className="pointer-events-none absolute inset-0 h-full w-full object-cover" />

      }
      {style.visibleMobile === false && <DesktopOnlyBadge shifted={active} />}
      <NodeChrome
        level="section"
        label="Section"
        active={active}
        onKeepActive={() => handlers.setHovered(node.id)}
        onDuplicate={() => handlers.onDuplicate(node.id)}
        onDelete={() => handlers.onDelete(node.id)}
        onMove={(direction) => handlers.onMove(node.id, direction)} />
      
      <div className="relative space-y-0" style={innerCss(style)}>
        {node.children.length === 0 &&
        <DropZone
          tall
          tallHeight
          label="Trage un row sau un element în această secțiune"
          onDrop={(payload) => handlers.onDropInSection(node.id, 0, payload)} />

        }
        {node.children.map((row, index) =>
        <React.Fragment key={row.id}>
            <DropZone
            onDrop={(payload) =>
            handlers.onDropInSection(node.id, index, payload)
            } />
          
            <RowView node={row} handlers={handlers} />
          </React.Fragment>
        )}
        {node.children.length > 0 &&
        <DropZone
          onDrop={(payload) =>
          handlers.onDropInSection(node.id, node.children.length, payload)
          } />

        }
      </div>
    </section>);

}

export type { NodeHandlers };