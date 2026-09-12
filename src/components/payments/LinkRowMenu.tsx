import React, { useEffect, useRef, useState } from 'react';
import {
  MoreVerticalIcon,
  PencilIcon,
  PowerIcon,
  Trash2Icon } from
'lucide-react';

interface LinkRowMenuProps {
  active: boolean;
  onEdit: () => void;
  onToggle: () => void;
  onDelete: () => void;
}

export function LinkRowMenu({
  active,
  onEdit,
  onToggle,
  onDelete
}: LinkRowMenuProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{top: number;left: number;} | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const place = () => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) setPos({ top: rect.bottom + 6, left: rect.left });
  };

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [open]);

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        place();
        setOpen(true);
      }}
      onMouseLeave={() => setOpen(false)}>
      
      <button
        ref={buttonRef}
        type="button"
        onFocus={() => {
          place();
          setOpen(true);
        }}
        onClick={(event) => {
          event.stopPropagation();
          place();
          setOpen((value) => !value);
        }}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Acțiuni pentru link"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-500 transition-colors duration-150 ease-out hover:bg-slate-50 hover:text-ink">
        
        <MoreVerticalIcon className="h-4 w-4" aria-hidden="true" />
      </button>

      {open && pos &&
      <div
        role="menu"
        className="fixed z-50 w-52 rounded-xl border border-slate-200 bg-white py-1.5 shadow-2xl"
        style={{ top: pos.top, left: pos.left }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}>
        
          <button
          type="button"
          role="menuitem"
          onClick={() => {
            setOpen(false);
            onEdit();
          }}
          className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm font-semibold text-ink-700 transition-colors duration-150 ease-out hover:bg-slate-50">
          
            <PencilIcon className="h-4 w-4" aria-hidden="true" />
            Editează
          </button>
          <button
          type="button"
          role="menuitem"
          onClick={() => {
            setOpen(false);
            onToggle();
          }}
          className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm font-semibold text-ink-700 transition-colors duration-150 ease-out hover:bg-slate-50">
          
            <PowerIcon className="h-4 w-4" aria-hidden="true" />
            {active ? 'Dezactivează' : 'Activează'}
          </button>
          <button
          type="button"
          role="menuitem"
          onClick={() => {
            setOpen(false);
            onDelete();
          }}
          className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm font-semibold text-red-600 transition-colors duration-150 ease-out hover:bg-red-50">
          
            <Trash2Icon className="h-4 w-4" aria-hidden="true" />
            Șterge
          </button>
        </div>
      }
    </div>);

}