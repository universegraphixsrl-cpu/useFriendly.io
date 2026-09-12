import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  MoreHorizontalIcon,
  PencilIcon,
  CopyIcon,
  Trash2Icon,
  MoveRightIcon,
  ChevronDownIcon,
  SettingsIcon,
  Share2Icon,
  PowerIcon } from
'lucide-react';

interface StepRowMenuProps {
  stepName: string;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  /** Textul acțiunii de ștergere (implicit „Șterge pasul”) */
  deleteLabel?: string;
  /** Când e setat, prima acțiune devine „Mută” cu lista de funneluri țintă */
  moveTargets?: {id: string;name: string;}[];
  onMove?: (targetId: string) => void;
  /** Acțiuni suplimentare, afișate înainte de ștergere */
  onSettings?: () => void;
  onShare?: () => void;
  /** Comută funnelul între activ și inactiv */
  onToggleActive?: () => void;
  toggleLabel?: string;
}

const MENU_WIDTH = 192;

/**
 * Meniul de acțiuni al unui pas de funnel. Se deschide la click și se
 * randează într-un layer fix, complet opac, peste tot conținutul paginii.
 */
export function StepRowMenu({
  stepName,
  onEdit,
  onDuplicate,
  onDelete,
  deleteLabel = 'Șterge pasul',
  moveTargets,
  onMove,
  onSettings,
  onShare,
  onToggleActive,
  toggleLabel = 'Dezactivează'
}: StepRowMenuProps) {
  const [movePanel, setMovePanel] = useState(false);
  const [pos, setPos] = useState<{top: number;left: number;} | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const open = pos !== null;

  const closeTimer = useRef<number | null>(null);

  const cancelClose = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const show = () => {
    cancelClose();
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    // deschide la stânga butonului, ca în referință
    setPos({
      top: rect.top,
      left: Math.max(12, rect.left - MENU_WIDTH - 8)
    });
  };

  /** mică întârziere, ca mouse-ul să poată trece de la buton la meniu */
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => {
      setPos(null);
      setMovePanel(false);
    }, 180);
  };

  const toggle = () => {
    if (open) {
      setPos(null);
      return;
    }
    show();
  };

  useEffect(() => cancelClose, []);

  useEffect(() => {
    if (!open) return;
    const close = (event: Event) => {
      const target = event.target as Node;
      if (
      menuRef.current?.contains(target) ||
      buttonRef.current?.contains(target))

      return;
      setPos(null);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPos(null);
    };
    document.addEventListener('mousedown', close);
    window.addEventListener('scroll', () => setPos(null), true);
    window.addEventListener('resize', () => setPos(null));
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const item =
  'flex w-full items-center gap-2.5 px-4 py-3 text-left text-sm font-semibold transition-colors duration-150 ease-out';

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        onMouseEnter={show}
        onMouseLeave={scheduleClose}
        onFocus={show}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Acțiuni pentru ${stepName}`}
        className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-150 ease-out ${
        open ?
        'bg-brand-500 text-white' :
        'text-ink-500 hover:bg-white hover:text-ink'}`
        }>
        
        <MoreHorizontalIcon className="h-4 w-4" aria-hidden="true" />
      </button>

      {open &&
      pos &&
      createPortal(
        <div
          ref={menuRef}
          role="menu"
          className="menu-surface fixed z-[100] w-48 overflow-hidden rounded-md border border-slate-200 bg-white shadow-2xl"
          style={{ top: pos.top, left: pos.left }}
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}>
          
          {moveTargets && onMove ?
          <>
              <button
              type="button"
              role="menuitem"
              onClick={() => setMovePanel((current) => !current)}
              aria-expanded={movePanel}
              className={`${item} justify-between text-ink-700 hover:bg-slate-50 hover:text-brand-700`}>
              
                <span className="flex items-center gap-2.5">
                  <MoveRightIcon className="h-4 w-4" aria-hidden="true" />
                  Mută
                </span>
                <ChevronDownIcon
                className={`h-4 w-4 transition-transform duration-150 ease-out ${
                movePanel ? 'rotate-180' : ''}`
                }
                aria-hidden="true" />
              
              </button>
              {movePanel &&
            <div className="border-t border-slate-100 bg-slate-50/60 py-1">
                  {moveTargets.length === 0 ?
              <p className="px-4 py-2 text-xs text-ink-500">
                      Nu există alt funnel.
                    </p> :

              moveTargets.map((target) =>
              <button
                key={target.id}
                type="button"
                onClick={() => {
                  setPos(null);
                  setMovePanel(false);
                  onMove(target.id);
                }}
                className="flex w-full items-center px-4 py-2.5 text-left text-sm font-semibold text-ink-700 transition-colors duration-150 ease-out hover:bg-white hover:text-brand-700">
                
                        {target.name}
                      </button>
              )
              }
                </div>
            }
            </> :

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setPos(null);
              onEdit();
            }}
            className={`${item} text-ink-700 hover:bg-slate-50 hover:text-brand-700`}>
            
              <PencilIcon className="h-4 w-4" aria-hidden="true" />
              Editează
            </button>
          }
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setPos(null);
              onDuplicate();
            }}
            className={`${item} border-t border-slate-100 text-ink-700 hover:bg-slate-50 hover:text-brand-700`}>
            
            <CopyIcon className="h-4 w-4" aria-hidden="true" />
            Dublează
          </button>
          {onSettings &&
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setPos(null);
              onSettings();
            }}
            className={`${item} border-t border-slate-100 text-ink-700 hover:bg-slate-50 hover:text-brand-700`}>
            
              <SettingsIcon className="h-4 w-4" aria-hidden="true" />
              Setări
            </button>
          }
          {onShare &&
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setPos(null);
              onShare();
            }}
            className={`${item} border-t border-slate-100 text-ink-700 hover:bg-slate-50 hover:text-brand-700`}>
            
              <Share2Icon className="h-4 w-4" aria-hidden="true" />
              Distribuie
            </button>
          }
          {onToggleActive &&
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setPos(null);
              onToggleActive();
            }}
            className={`${item} border-t border-slate-100 text-ink-700 hover:bg-slate-50 hover:text-brand-700`}>
            
              <PowerIcon className="h-4 w-4" aria-hidden="true" />
              {toggleLabel}
            </button>
          }
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setPos(null);
              onDelete();
            }}
            className={`${item} border-t border-slate-100 text-red-600 hover:bg-red-50`}>
            
            <Trash2Icon className="h-4 w-4" aria-hidden="true" />
            {deleteLabel}
          </button>
        </div>,
        // ancorăm în rădăcina temei, ca meniul să respecte tema activă
        document.querySelector('.theme-dark') ?? document.body
      )}
    </>);

}