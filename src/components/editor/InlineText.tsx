import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  Trash2Icon } from
'lucide-react';
import type { ElementStyle } from '../../data/editor';
import { ColorPickerPopover } from './ColorPickerPopover';

interface InlineTextProps {
  value: string;
  style: ElementStyle;
  colorKey: string;
  as?: 'h2' | 'p' | 'span';
  className?: string;
  cssStyle?: React.CSSProperties;
  onChange: (patch: Partial<ElementStyle>) => void;
}

/** Text editabil direct în pagină, cu bară de formatare flotantă */
export function InlineText({
  value,
  style,
  colorKey,
  as = 'p',
  className = '',
  cssStyle,
  onChange
}: InlineTextProps) {
  const ref = useRef<HTMLElement>(null);
  const [editing, setEditing] = useState(false);
  const [toolbar, setToolbar] = useState({ top: 0, left: 0 });
  const [colorOpen, setColorOpen] = useState(false);

  useEffect(() => {
    if (editing || !ref.current) return;
    const html = style.html;
    if (html) {
      if (ref.current.innerHTML !== html) ref.current.innerHTML = html;
    } else if (ref.current.innerText !== value) {
      ref.current.innerText = value;
    }
  }, [value, style.html, editing]);

  const persist = () => {
    if (!ref.current) return;
    onChange({
      text: ref.current.innerText,
      html: ref.current.innerHTML
    });
  };

  /** True dacă utilizatorul are selectată o bucată de text din acest element */
  const hasSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || selection.rangeCount === 0)
    return false;
    return ref.current?.contains(selection.anchorNode) ?? false;
  };

  const applyFormat = (command: string, key: keyof ElementStyle) => {
    if (hasSelection()) {
      document.execCommand(command);
      persist();
      return;
    }
    onChange({ [key]: !style[key] } as Partial<ElementStyle>);
  };

  const applyColor = (hex: string) => {
    if (hasSelection()) {
      document.execCommand('foreColor', false, hex);
      persist();
      return;
    }
    onChange({ colors: { [colorKey]: hex } });
  };

  useEffect(() => {
    if (!editing) return;
    const close = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest('[data-inline-toolbar]')) return;
      if (ref.current?.contains(target)) return;
      setEditing(false);
      setColorOpen(false);
    };
    window.addEventListener('mousedown', close);
    return () => window.removeEventListener('mousedown', close);
  }, [editing]);

  // la scroll, bara urmărește elementul; dacă acesta iese din ecran, se închide
  useEffect(() => {
    if (!editing) return;
    const sync = () => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      const visible = rect.bottom > 0 && rect.top < window.innerHeight;
      if (!visible) {
        setEditing(false);
        setColorOpen(false);
        return;
      }
      setToolbar({ top: rect.bottom + 8, left: rect.left + rect.width / 2 });
    };
    window.addEventListener('scroll', sync, true);
    window.addEventListener('resize', sync);
    return () => {
      window.removeEventListener('scroll', sync, true);
      window.removeEventListener('resize', sync);
    };
  }, [editing]);

  const openToolbar = () => {
    const rect = ref.current?.getBoundingClientRect();
    if (rect)
    setToolbar({ top: rect.bottom + 8, left: rect.left + rect.width / 2 });
    setEditing(true);
  };

  const Tag = as as keyof JSX.IntrinsicElements;

  const decoration = [
  style.underline ? 'underline' : '',
  style.strike ? 'line-through' : ''].

  filter(Boolean).
  join(' ');

  const buttons = [
  { key: 'bold' as const, command: 'bold', label: 'Bold', icon: BoldIcon },
  {
    key: 'italic' as const,
    command: 'italic',
    label: 'Italic',
    icon: ItalicIcon
  },
  {
    key: 'underline' as const,
    command: 'underline',
    label: 'Subliniat',
    icon: UnderlineIcon
  },
  {
    key: 'strike' as const,
    command: 'strikeThrough',
    label: 'Tăiat',
    icon: StrikethroughIcon
  }];


  return (
    <>
      <Tag
        ref={ref as never}
        contentEditable
        suppressContentEditableWarning
        spellCheck={false}
        onMouseDown={(event: React.MouseEvent) => event.stopPropagation()}
        onClick={() => {
          // clickul urcă mai departe, ca elementul să fie selectat
          // și panoul de setări din stânga să se deschidă
          openToolbar();
        }}
        onFocus={openToolbar}
        onInput={persist}
        className={`${className} outline-none ${editing ? 'cursor-text ring-2 ring-brand-500' : ''}`}
        style={{
          ...cssStyle,
          // bold/italic din bara flotantă suprascriu doar când sunt active;
          // altfel rămâne stilul ales din „Font style”
          ...(style.bold ? { fontWeight: 700 } : {}),
          ...(style.italic ? { fontStyle: 'italic' } : {}),
          textDecoration: decoration || 'none'
        }} />
      

      {editing &&
      createPortal(
        <div
          data-inline-toolbar
          className="fixed z-[80] flex -translate-x-1/2 items-center gap-1 rounded-xl border border-slate-200 bg-white px-2 py-1.5 shadow-2xl"
          style={{ top: toolbar.top, left: toolbar.left }}>
          
            {buttons.map((button) =>
          <button
            key={button.key}
            type="button"
            aria-label={button.label}
            aria-pressed={style[button.key]}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => applyFormat(button.command, button.key)}
            className={`rounded-md p-2 transition-colors duration-150 ease-out hover:bg-slate-100 ${
            style[button.key] ? 'bg-brand-50 text-brand-600' : 'text-ink-600'}`
            }>
            
                <button.icon className="h-4 w-4" aria-hidden="true" />
              </button>
          )}

            <span className="mx-1 h-5 w-px bg-slate-200" />

            <button
            type="button"
            data-color-trigger
            aria-label="Culoarea textului"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => setColorOpen((open) => !open)}
            className="h-6 w-6 rounded-full border border-slate-200 shadow-sm"
            style={{ backgroundColor: style.colors[colorKey] }} />
          

            <button
            type="button"
            aria-label="Șterge textul"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              if (hasSelection()) {
                document.execCommand('delete');
                persist();
                return;
              }
              onChange({ text: '', html: '' });
              if (ref.current) ref.current.innerText = '';
            }}
            className="rounded-md p-2 text-red-500 transition-colors duration-150 ease-out hover:bg-red-50">
            
              <Trash2Icon className="h-4 w-4" aria-hidden="true" />
            </button>

          </div>,
        document.body
      )}

      {colorOpen &&
      createPortal(
        // ancorat mereu în aceeași zonă a ecranului, ca să fie vizibil complet
        <div className="fixed right-6 top-1/2 z-[80] -translate-y-1/2">
            <ColorPickerPopover
            value={style.colors[colorKey]}
            onChange={applyColor}
            onClose={() => setColorOpen(false)} />
          
          </div>,
        document.body
      )}
    </>);

}