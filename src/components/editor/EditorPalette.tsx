import React, { useState } from "react";
import { TypeIcon, HeadingIcon, ListIcon, CreditCardIcon, ImageIcon, FilmIcon, Volume2Icon, GalleryHorizontalIcon, Columns4Icon, Columns3Icon, Columns2Icon, RectangleHorizontalIcon, LayoutTemplateIcon, CopyIcon, FormInputIcon, MousePointerClickIcon, SquareCheckIcon, RefreshCwIcon, CalendarIcon, MinusIcon, TimerIcon, MoveVerticalIcon, StarIcon, BarChart3Icon, ShareIcon, MenuIcon, SquareArrowOutUpRightIcon, BoxIcon } from "lucide-react";
import { DragPayload, ElementKind, RowNode } from "../../data/editor";
import { startDrag, endDrag } from "./dragPayload";
interface PaletteItem {
  label: string;
  icon: BoxIcon;
  payload: DragPayload;
}
const element = (label: string, icon: BoxIcon, kind: ElementKind): PaletteItem => ({
  label,
  icon,
  payload: {
    kind: 'element',
    element: kind
  }
});
const row = (label: string, icon: BoxIcon, columns: RowNode['columns']): PaletteItem => ({
  label,
  icon,
  payload: {
    kind: 'row',
    columns
  }
});
const groups: Array<{
  title: string;
  items: PaletteItem[];
}> = [{
  title: 'Text',
  items: [element('Text', TypeIcon, 'text'), element('Headline', HeadingIcon, 'headline'), element('Bulleted list', ListIcon, 'bulleted'), element('Content box', CreditCardIcon, 'contentBox')]
}, {
  title: 'Media',
  items: [element('Image', ImageIcon, 'image'), element('Video', FilmIcon, 'video'), element('Audio', Volume2Icon, 'audio'), element('Carousel', GalleryHorizontalIcon, 'carousel')]
}, {
  title: 'Column layout',
  items: [{
    label: 'Section',
    icon: LayoutTemplateIcon,
    payload: {
      kind: 'section'
    }
  }, row('Row', RectangleHorizontalIcon, 1), row('2 columns', Columns2Icon, 2), row('3 columns', Columns3Icon, 3), row('4 columns', Columns4Icon, 4), row('6 columns', CopyIcon, 6), row('8 columns', CopyIcon, 8)]
}, {
  title: 'Form',
  items: [element('Form', CopyIcon, 'form'), element('Form input', FormInputIcon, 'formInput'), element('Button', MousePointerClickIcon, 'button'), element('Checkbox', SquareCheckIcon, 'checkbox'), element('reCAPTCHA', RefreshCwIcon, 'recaptcha'), element('Calendar', CalendarIcon, 'calendar')]
}, {
  title: 'Altele',
  items: [element('Meniu', MenuIcon, 'menu'), element('Linie', MinusIcon, 'divider'), element('Timer', TimerIcon, 'timer'), element('Spațiu', MoveVerticalIcon, 'spacer'), element('Icon', StarIcon, 'icon'), element('Progress bar', BarChart3Icon, 'progress'), element('Social', ShareIcon, 'social'), element('Pop-up', SquareArrowOutUpRightIcon, 'popup')]
}];

interface EditorPaletteProps {
  /** Click simplu pe un item: îl adaugă la finalul paginii */
  onAdd: (payload: DragPayload) => void;
}

/** Paleta din stânga editorului: elemente, layout și form, cu drag & drop sau click */
export function EditorPalette({
  onAdd
}: EditorPaletteProps) {
  const [tab, setTab] = useState<'elements' | 'blocks'>('elements');
  return <aside className="flex h-full w-[340px] shrink-0 flex-col overflow-y-auto border-r border-slate-200 bg-white px-6 py-6">
      <div className="grid grid-cols-2 gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
        {(['elements', 'blocks'] as const).map((value) => <button key={value} type="button" onClick={() => setTab(value)} className={`relative rounded-md px-3 py-2.5 text-[15px] font-bold transition-colors duration-150 ease-out ${tab === value ? 'bg-white text-ink shadow-sm' : 'text-ink-500 hover:text-ink-700'}`}>
            {value === 'elements' ? 'Elements' : 'Blocks'}
            {value === 'blocks' && <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-emerald-700">
                Beta
              </span>}
          </button>)}
      </div>

      {tab === 'blocks' ? <div className="mt-8 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm font-semibold leading-relaxed text-emerald-800">
            Funcția de blocks pre-create e în faza Beta. Deocamdată folosește
            tab-ul Elements pentru a construi pagina.
          </p>
        </div> : groups.map((group) => <section key={group.title} className="mt-8">
            <h3 className="font-display text-lg font-bold text-ink">
              {group.title}
            </h3>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {group.items.map((item) => <div key={item.label} draggable role="button" tabIndex={0} onClick={() => onAdd(item.payload)} onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onAdd(item.payload);
          }
        }} onDragStart={(event) => startDrag(event, item.payload)} onDragEnd={endDrag} className="flex cursor-grab flex-col items-center gap-2.5 rounded-lg bg-slate-100 px-2 py-4 text-center transition-colors duration-150 ease-out hover:bg-slate-200 active:cursor-grabbing">
                  <span className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-200/80 text-ink-700">
                    <item.icon className="h-4.5 w-4.5" aria-hidden="true" />
                  </span>
                  <span className="text-[13px] font-semibold leading-tight text-ink-700">
                    {item.label}
                  </span>
                </div>)}
            </div>
          </section>)}
    </aside>;
}