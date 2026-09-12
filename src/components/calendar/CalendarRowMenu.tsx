import React, { useEffect, useRef, useState } from 'react';
import {
  MoreHorizontalIcon,
  PencilIcon,
  CopyIcon,
  Trash2Icon } from
'lucide-react';

interface CalendarRowMenuProps {
  calendarName: string;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export function CalendarRowMenu({
  calendarName,
  onEdit,
  onDuplicate,
  onDelete
}: CalendarRowMenuProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{top: number;left: number;} | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const place = () => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) setPos({ top: rect.bottom + 6, left: rect.right - 192 });
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
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-500 transition-colors duration-150 ease-out hover:bg-slate-50 hover:text-brand-600"
        aria-label={`Opțiuni pentru ${calendarName}`}>
        
        <MoreHorizontalIcon className="h-4 w-4" aria-hidden="true" />
      </button>

      {open && pos &&
      <div
        role="menu"
        className="fixed z-50 w-48"
        style={{ top: pos.top, left: pos.left }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}>
        
          <div className="rounded-xl border border-slate-200 bg-white py-1.5 shadow-2xl">
            <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm font-semibold text-ink-700 transition-colors duration-150 ease-out hover:bg-slate-50 hover:text-brand-700">
            
              <PencilIcon className="h-4 w-4" aria-hidden="true" />
              Editează
            </button>
            <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onDuplicate();
            }}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm font-semibold text-ink-700 transition-colors duration-150 ease-out hover:bg-slate-50 hover:text-brand-700">
            
              <CopyIcon className="h-4 w-4" aria-hidden="true" />
              Dublează
            </button>
            <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm font-semibold text-red-600 transition-colors duration-150 ease-out hover:bg-red-50">
            
              <Trash2Icon className="h-4 w-4" aria-hidden="true" />
              Șterge calendarul
            </button>
          </div>
        </div>
      }
    </div>);

}