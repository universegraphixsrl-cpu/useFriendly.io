import React, { useRef, useState } from 'react';
import {
  UploadCloudIcon,
  PlayIcon,
  Trash2Icon,
  LinkIcon,
  PaperclipIcon,
  PlusIcon } from
'lucide-react';
import type { Lesson, LessonResource } from '../../data/courses';

interface LessonEditorProps {
  lesson: Lesson;
  onChange: (patch: Partial<Lesson>) => void;
  onDelete: () => void;
}

export function LessonEditor({
  lesson,
  onChange,
  onDelete
}: LessonEditorProps) {
  const [dragging, setDragging] = useState(false);
  const [draggingFile, setDraggingFile] = useState(false);
  const [linkName, setLinkName] = useState('');
  const videoInput = useRef<HTMLInputElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const addResource = (name: string, kind: LessonResource['kind']) =>
  onChange({
    resources: [
    ...lesson.resources,
    { id: `res-${Date.now()}`, name, kind }]

  });

  const removeResource = (id: string) =>
  onChange({
    resources: lesson.resources.filter((item) => item.id !== id)
  });

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-start gap-3">
        <input
          type="text"
          value={lesson.title}
          onChange={(event) => onChange({ title: event.target.value })}
          placeholder="Titlul lecției"
          aria-label="Titlul lecției"
          className="min-w-[220px] flex-1 rounded-lg border border-slate-200 px-3 py-2 font-display text-sm font-bold text-ink focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100" />
        
        <button
          type="button"
          onClick={onDelete}
          aria-label={`Șterge lecția ${lesson.title || 'fără titlu'}`}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-500 transition-colors duration-150 ease-out hover:bg-rose-50 hover:text-rose-600">
          
          <Trash2Icon className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-3 grid gap-4 lg:grid-cols-2">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-ink-500">
            Lecție video
          </p>
          {lesson.video ?
          <div className="mt-1.5 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ink text-white">
                <PlayIcon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-ink">
                  {lesson.video}
                </span>
                <span className="block text-[11px] font-semibold text-ink-500">
                  Încărcat · {lesson.duration}
                </span>
              </span>
              <button
              type="button"
              onClick={() => onChange({ video: null, duration: '—' })}
              className="text-xs font-bold text-rose-600 hover:text-rose-700">
              
                Șterge
              </button>
            </div> :

          <div
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(false);
              const file = event.dataTransfer.files[0];
              if (file) onChange({ video: file.name, duration: '00:00' });
            }}
            className={`mt-1.5 rounded-xl border-2 border-dashed p-4 text-center transition-colors duration-150 ease-out ${
            dragging ?
            'border-brand-400 bg-brand-50' :
            'border-slate-200 bg-slate-50'}`
            }>
            
              <UploadCloudIcon
              className="mx-auto h-5 w-5 text-ink-500"
              aria-hidden="true" />
            
              <p className="mt-1.5 text-xs font-semibold text-ink-700">
                Trage fișierul video aici
              </p>
              <button
              type="button"
              onClick={() => videoInput.current?.click()}
              className="mt-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-ink-700 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
              
                Alege din calculator
              </button>
              <input
              ref={videoInput}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) onChange({ video: file.name, duration: '00:00' });
                event.target.value = '';
              }} />
            
            </div>
          }
        </div>

        <div>
          <label
            htmlFor={`notes-${lesson.id}`}
            className="text-[11px] font-bold uppercase tracking-wide text-ink-500">
            
            Suport scris
          </label>
          <textarea
            id={`notes-${lesson.id}`}
            rows={6}
            value={lesson.notes}
            onChange={(event) => onChange({ notes: event.target.value })}
            placeholder="Scrie explicațiile, scriptul sau pașii procedurii…"
            className="mt-1.5 w-full resize-y rounded-lg border border-slate-200 px-3 py-2 text-sm text-ink focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100" />
          
        </div>
      </div>

      <div className="mt-4 border-t border-slate-100 pt-3">
        <p className="text-[11px] font-bold uppercase tracking-wide text-ink-500">
          Resurse adiționale
        </p>

        {lesson.resources.length > 0 &&
        <ul className="mt-2 space-y-1.5">
            {lesson.resources.map((resource) =>
          <li
            key={resource.id}
            className="flex items-center gap-2 rounded-lg bg-slate-50 px-2.5 py-1.5">
            
                {resource.kind === 'link' ?
            <LinkIcon
              className="h-3.5 w-3.5 shrink-0 text-brand-600"
              aria-hidden="true" /> :


            <PaperclipIcon
              className="h-3.5 w-3.5 shrink-0 text-ink-500"
              aria-hidden="true" />

            }
                <span className="flex-1 truncate text-xs font-semibold text-ink-700">
                  {resource.name}
                </span>
                <span className="text-[11px] font-semibold text-ink-500">
                  {resource.kind === 'link' ? 'Link' : 'Fișier'}
                </span>
                <button
              type="button"
              onClick={() => removeResource(resource.id)}
              aria-label={`Șterge ${resource.name}`}
              className="text-ink-500 transition-colors duration-150 ease-out hover:text-rose-600">
              
                  <Trash2Icon className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </li>
          )}
          </ul>
        }

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={linkName}
            onChange={(event) => setLinkName(event.target.value)}
            placeholder="Adaugă link (ex. înregistrare apel)"
            aria-label="Link adițional"
            className="min-w-[200px] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-ink focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100" />
          
          <button
            type="button"
            disabled={linkName.trim().length === 0}
            onClick={() => {
              addResource(linkName.trim(), 'link');
              setLinkName('');
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-2 text-xs font-bold text-ink-700 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 disabled:text-ink-500 disabled:hover:bg-white">
            
            <PlusIcon className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
            Adaugă link
          </button>
          <input
            ref={fileInput}
            type="file"
            accept=".pdf,.doc,.docx,.xlsx"
            className="hidden"
            onChange={(event) => {
              const files = Array.from(event.target.files ?? []);
              files.forEach((file) => addResource(file.name, 'file'));
              event.target.value = '';
            }} />
          
        </div>

        <div
          onDragOver={(event) => {
            event.preventDefault();
            setDraggingFile(true);
          }}
          onDragLeave={() => setDraggingFile(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDraggingFile(false);
            Array.from(event.dataTransfer.files).forEach((file) =>
            addResource(file.name, 'file')
            );
          }}
          className={`mt-2 rounded-xl border-2 border-dashed p-4 text-center transition-colors duration-150 ease-out ${
          draggingFile ?
          'border-brand-400 bg-brand-50' :
          'border-slate-200 bg-slate-50'}`
          }>
          
          <PaperclipIcon
            className="mx-auto h-5 w-5 text-ink-500"
            aria-hidden="true" />
          
          <p className="mt-1.5 text-xs font-semibold text-ink-700">
            Trage aici fișierele PDF
          </p>
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className="mt-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-ink-700 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
            
            Alege din calculator
          </button>
        </div>
      </div>
    </div>);

}