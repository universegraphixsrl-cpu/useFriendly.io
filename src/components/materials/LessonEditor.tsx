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
import { uploadFile, fileUrl, removeFile } from '../../lib/storage';

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
  const [draggingFile, setDraggingFile] = useState(false);
  const [linkName, setLinkName] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [uploading, setUploading] = useState(false);
  const [fileError, setFileError] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);

  const addResource = (
  name: string,
  kind: LessonResource['kind'],
  url?: string) =>
  onChange({
    resources: [
    ...lesson.resources,
    {
      id: `res-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name,
      kind,
      url
    }]

  });

  /** Urcă fișierele alese și abia apoi le trece în lista de resurse */
  const attachFiles = async (files: File[]) => {
    if (files.length === 0) return;
    setFileError('');
    setUploading(true);
    for (const file of files) {
      const { url, error } = await uploadFile(file, 'courses');
      if (error || !url) {
        setFileError(error ?? 'Încărcarea a eșuat.');
        continue;
      }
      addResource(file.name, 'file', url);
    }
    setUploading(false);
  };

  const openResource = async (resource: LessonResource) => {
    const address = await fileUrl(resource.url ?? '');
    if (!address) {
      setFileError('Fișierul nu mai poate fi deschis.');
      return;
    }
    window.open(address, '_blank', 'noopener');
  };

  const removeResource = (id: string) => {
    const resource = lesson.resources.find((item) => item.id === id);
    if (resource?.kind === 'file' && resource.url) void removeFile(resource.url);
    onChange({
      resources: lesson.resources.filter((item) => item.id !== id)
    });
  };

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
                <a
                href={lesson.video}
                target="_blank"
                rel="noopener noreferrer"
                className="block truncate text-sm font-semibold text-brand-600 hover:underline">
                
                  {lesson.video}
                </a>
                <span className="block text-[11px] font-semibold text-ink-500">
                  Video extern · {lesson.duration}
                </span>
              </span>
              <button
              type="button"
              onClick={() => onChange({ video: null, duration: '—' })}
              className="text-xs font-bold text-rose-600 hover:text-rose-700">
              
                Scoate
              </button>
            </div> :

          <div className="mt-1.5 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <label
              htmlFor={`video-${lesson.id}`}
              className="text-xs font-semibold text-ink-700">
              
                Linkul video (YouTube nelistat, Vimeo, Loom)
              </label>
              <div className="mt-1.5 flex flex-wrap gap-2">
                <input
                id={`video-${lesson.id}`}
                type="url"
                value={videoLink}
                onChange={(event) => setVideoLink(event.target.value)}
                placeholder="https://youtu.be/..."
                className="min-w-[200px] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-ink placeholder:font-normal placeholder:text-ink-500 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100" />
              
                <button
                type="button"
                disabled={!videoLink.trim().startsWith('http')}
                onClick={() => {
                  onChange({ video: videoLink.trim(), duration: '—' });
                  setVideoLink('');
                }}
                className="rounded-lg bg-brand-500 px-3 py-2 text-xs font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600 disabled:bg-slate-200 disabled:text-ink-500">
                
                  Adaugă
                </button>
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-ink-500">
                Video-urile stau pe YouTube sau Vimeo, nu aici: încărcate în
                platformă, câteva lecții ar consuma tot spațiul și ar face
                cursul greoi de deschis. Pe YouTube pune-le „nelistate" — se
                văd doar cu linkul, nu apar în căutări.
              </p>
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
                <button
              type="button"
              onClick={() =>
              resource.kind === 'link' ?
              window.open(resource.url ?? '#', '_blank', 'noopener') :
              void openResource(resource)
              }
              className="flex-1 truncate text-left text-xs font-semibold text-brand-600 hover:underline">
              
                  {resource.name}
                </button>
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
              addResource(linkName.trim(), 'link', linkName.trim());
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
              void attachFiles(Array.from(event.target.files ?? []));
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
            void attachFiles(Array.from(event.dataTransfer.files));
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
            {uploading ? 'Se încarcă…' : 'Trage aici fișierele PDF'}
          </p>
          {fileError &&
          <p className="mt-1.5 text-xs font-semibold text-red-600">{fileError}</p>
          }
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