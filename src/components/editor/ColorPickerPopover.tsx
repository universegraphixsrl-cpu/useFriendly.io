import React, { useEffect, useRef, useState } from 'react';

import { XIcon, PipetteIcon, RotateCcwIcon } from 'lucide-react';

interface ColorPickerPopoverProps {
  value: string;
  onChange: (hex: string) => void;
  onClose: () => void;
}

/** 14 culori de bază, două rânduri simetrice de câte 7 */
const savedColors = [
'#ffffff',
'#000000',
'#94a3b8',
'transparent',
'#2f6bff',
'#e5342f',
'#f5c542',
'#f97316',
'#22c55e',
'#d946ef',
'#14b8a6',
'#7c3aed',
'#ec4899',
'#0f1729'];


const clamp = (value: number, min = 0, max = 1) =>
Math.min(max, Math.max(min, value));

function hexToHsv(hex: string) {
  const clean = /^#[0-9a-fA-F]{6}$/.test(hex) ? hex : '#2f6bff';
  const r = parseInt(clean.slice(1, 3), 16) / 255;
  const g = parseInt(clean.slice(3, 5), 16) / 255;
  const b = parseInt(clean.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let h = 0;
  if (delta !== 0) {
    if (max === r) h = (g - b) / delta % 6;else
    if (max === g) h = (b - r) / delta + 2;else
    h = (r - g) / delta + 4;
  }
  h = Math.round(h * 60);
  if (h < 0) h += 360;
  return { h, s: max === 0 ? 0 : delta / max, v: max };
}

function hsvToHex(h: number, s: number, v: number) {
  const c = v * s;
  const x = c * (1 - Math.abs(h / 60 % 2 - 1));
  const m = v - c;
  const [r, g, b] =
  h < 60 ?
  [c, x, 0] :
  h < 120 ?
  [x, c, 0] :
  h < 180 ?
  [0, c, x] :
  h < 240 ?
  [0, x, c] :
  h < 300 ?
  [x, 0, c] :
  [c, 0, x];
  const toHex = (channel: number) =>
  Math.round((channel + m) * 255).
  toString(16).
  padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/** Selector de culoare: zonă saturație/luminozitate, hue, opacitate, HEX și culori salvate */
/** Desparte o valoare CSS în hex + opacitate */
function parseValue(value: string) {
  if (value === 'transparent') return { hex: '#ffffff', alpha: 0 };
  const rgba = value.match(
    /rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)(?:[,\s/]+([\d.]+))?\s*\)/i
  );
  if (rgba) {
    const toHex = (channel: string) =>
    Number(channel).toString(16).padStart(2, '0');
    return {
      hex: `#${toHex(rgba[1])}${toHex(rgba[2])}${toHex(rgba[3])}`,
      alpha: Math.round((rgba[4] ? Number(rgba[4]) : 1) * 100)
    };
  }
  return { hex: /^#[0-9a-fA-F]{6}$/.test(value) ? value : '#2f6bff', alpha: 100 };
}

/** Recompune valoarea CSS din hex + opacitate */
function composeValue(hex: string, alpha: number) {
  if (alpha >= 100) return hex;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${(alpha / 100).toFixed(2)})`;
}

export function ColorPickerPopover({
  value,
  onChange,
  onClose
}: ColorPickerPopoverProps) {
  const parsed = parseValue(value);
  const hsv = hexToHsv(parsed.hex);
  const initial = useRef(value);
  const [hue, setHue] = useState(hsv.h);
  const [alpha, setAlpha] = useState(parsed.alpha);
  const [hexDraft, setHexDraft] = useState(parsed.hex.replace('#', ''));

  const emit = (hex: string, nextAlpha?: number) => {
    // dacă fundalul era transparent, alegerea manuală a unei culori îl face opac
    const applied = nextAlpha ?? (alpha === 0 ? 100 : alpha);
    if (applied !== alpha) setAlpha(applied);
    onChange(composeValue(hex, applied));
  };

  /** Pipetă: preia culoarea de oriunde de pe ecran */
  const pickFromScreen = async () => {
    const EyeDropperCtor = (
    window as unknown as {EyeDropper?: new () => {open: () => Promise<{sRGBHex: string;}>;};}).
    EyeDropper;
    if (!EyeDropperCtor) return;
    try {
      const result = await new EyeDropperCtor().open();
      const hex = result.sRGBHex;
      setHexDraft(hex.replace('#', ''));
      setHue(hexToHsv(hex).h);
      emit(hex);
    } catch {

      // utilizatorul a anulat selecția
    }};
  const areaRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const applyFromArea = (event: React.MouseEvent | MouseEvent) => {
    const rect = areaRef.current?.getBoundingClientRect();
    if (!rect) return;
    const s = clamp((event.clientX - rect.left) / rect.width);
    const v = 1 - clamp((event.clientY - rect.top) / rect.height);
    const hex = hsvToHex(hue, s, v);
    setHexDraft(hex.replace('#', ''));
    emit(hex);
  };

  const startDrag = (event: React.MouseEvent) => {
    dragging.current = true;
    applyFromArea(event);
    const move = (moveEvent: MouseEvent) => {
      if (dragging.current) applyFromArea(moveEvent);
    };
    const up = () => {
      dragging.current = false;
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  const current = hexToHsv(parsed.hex);
  const rootRef = useRef<HTMLDivElement>(null);

  // închide selectorul la click în afara lui sau la Escape
  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest('[data-color-trigger]')) return;
      if (!rootRef.current?.contains(target)) onClose();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div
      ref={rootRef}
      className="w-[300px] rounded-xl border border-slate-200 bg-white p-4 shadow-2xl">
      
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onClose}
          aria-label="Închide selectorul de culoare"
          className="rounded-md border border-slate-200 p-1.5 text-ink-500 transition-colors duration-150 ease-out hover:bg-slate-50">
          
          <XIcon className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div
        ref={areaRef}
        onMouseDown={startDrag}
        role="presentation"
        className="relative mt-2 h-40 cursor-crosshair rounded-lg"
        style={{
          background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, ${hsvToHex(hue, 1, 1)})`
        }}>
        
        <span
          className="pointer-events-none absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow"
          style={{
            left: `${current.s * 100}%`,
            top: `${(1 - current.v) * 100}%`,
            backgroundColor: parsed.hex
          }} />
        
      </div>

      <input
        type="range"
        min={0}
        max={359}
        value={hue}
        aria-label="Nuanță"
        onChange={(event) => {
          const next = Number(event.target.value);
          setHue(next);
          const hex = hsvToHex(next, current.s || 1, current.v || 1);
          setHexDraft(hex.replace('#', ''));
          emit(hex);
        }}
        className="mt-4 h-2.5 w-full cursor-pointer appearance-none rounded-full"
        style={{
          background:
          'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)'
        }} />
      

      <input
        type="range"
        min={0}
        max={100}
        value={alpha}
        aria-label="Opacitate"
        onChange={(event) => {
          const next = Number(event.target.value);
          setAlpha(next);
          emit(parsed.hex, next);
        }}
        className="mt-3 h-2.5 w-full cursor-pointer appearance-none rounded-full accent-brand-500"
        style={{
          background: `linear-gradient(to right, transparent, ${parsed.hex}), repeating-conic-gradient(#e2e8f0 0% 25%, #ffffff 0% 50%) 0 0/10px 10px`
        }} />
      

      <div className="mt-4 flex items-center gap-2">
        <div className="flex flex-1 items-center rounded-md border border-slate-200 px-3 py-2">
          <span className="text-sm font-semibold text-ink-400">#</span>
          <input
            type="text"
            value={hexDraft}
            maxLength={6}
            spellCheck={false}
            aria-label="Cod HEX"
            onChange={(event) => {
              const next = event.target.value.replace(/[^0-9a-fA-F]/g, '');
              setHexDraft(next);
              if (next.length === 6) {
                emit(`#${next}`);
                setHue(hexToHsv(`#${next}`).h);
              }
            }}
            className="w-full bg-transparent pl-2 font-mono text-sm font-semibold text-ink focus:outline-none" />
          
        </div>
        <div className="flex w-[86px] items-center rounded-md border border-slate-200 px-3 py-2">
          <input
            type="number"
            min={0}
            max={100}
            value={alpha}
            aria-label="Opacitate în procente"
            onChange={(event) => {
              const next = clamp(Number(event.target.value), 0, 100);
              setAlpha(next);
              emit(parsed.hex, next);
            }}
            className="w-full bg-transparent text-sm font-semibold text-ink focus:outline-none" />
          
          <span className="text-sm font-semibold text-ink-400">%</span>
        </div>
        <button
          type="button"
          aria-label="Revino la culoarea dinainte de ultima salvare"
          title="Revino la culoarea dinainte de ultima salvare"
          onClick={() => {
            const restored = parseValue(initial.current);
            setAlpha(restored.alpha);
            setHexDraft(restored.hex.replace('#', ''));
            setHue(hexToHsv(restored.hex).h);
            onChange(initial.current);
          }}
          className="rounded-md p-1.5 text-ink-500 transition-colors duration-150 ease-out hover:bg-slate-100">
          
          <RotateCcwIcon className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm font-semibold text-ink-700">Culori de bază</p>
        <button
          type="button"
          onClick={pickFromScreen}
          aria-label="Preia o culoare de pe ecran"
          title="Preia o culoare de pe ecran"
          className="rounded-md p-1.5 text-ink-500 transition-colors duration-150 ease-out hover:bg-slate-100 hover:text-brand-600">
          
          <PipetteIcon className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <div className="mt-2 grid grid-cols-7 gap-2">
        {savedColors.map((color) =>
        <button
          key={color}
          type="button"
          aria-label={
          color === 'transparent' ? 'Fundal transparent' : `Alege ${color}`
          }
          onClick={() => {
            if (color === 'transparent') {
              onChange('transparent');
              return;
            }
            emit(color);
            setHexDraft(color.replace('#', ''));
            setHue(hexToHsv(color).h);
          }}
          className={`relative h-7 w-7 overflow-hidden rounded-full border transition-transform duration-150 ease-out hover:scale-110 ${
          value === color ? 'border-brand-500 ring-2 ring-brand-200' : 'border-slate-200'}`
          }
          style={{
            backgroundColor: color === 'transparent' ? '#ffffff' : color
          }}>
          
            {color === 'transparent' &&
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 h-px w-9 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-red-400" />

          }
          </button>
        )}
      </div>
    </div>);

}