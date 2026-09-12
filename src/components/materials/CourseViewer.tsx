import React, { useState } from 'react';
import {
  ChevronLeftIcon,
  PlayCircleIcon,
  FileTextIcon,
  LinkIcon,
  PaperclipIcon } from
'lucide-react';
import type { Course, Lesson } from '../../data/courses';

interface CourseViewerProps {
  course: Course;
  onBack: () => void;
}

/** Vizualizare read-only a unui curs, pentru sub-accounts */
export function CourseViewer({ course, onBack }: CourseViewerProps) {
  const firstLesson = course.modules[0]?.lessons[0] ?? null;
  const [openLesson, setOpenLesson] = useState<Lesson | null>(firstLesson);

  return (
    <>
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 transition-colors duration-150 ease-out hover:text-brand-600">
        
        <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
        Toate materialele
      </button>

      <h1 className="mt-2 flex items-center gap-2.5 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
        <span
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: course.color }}
          aria-hidden="true" />
        
        {course.title}
      </h1>
      <p className="mt-1 max-w-2xl text-sm text-ink-700">
        {course.description || 'Fără descriere'} · doar vizualizare
      </p>

      <div className="mt-6 grid gap-5 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <nav
          aria-label="Structura cursului"
          className="rounded-2xl border border-slate-200 bg-white p-4">
          
          {course.modules.map((module) =>
          <div key={module.id} className="mb-4 last:mb-0">
              <p className="text-[11px] font-bold uppercase tracking-wide text-ink-500">
                {module.title}
              </p>
              <ul className="mt-1.5 space-y-1">
                {module.lessons.map((lesson) =>
              <li key={lesson.id}>
                    <button
                  type="button"
                  onClick={() => setOpenLesson(lesson)}
                  aria-current={
                  openLesson?.id === lesson.id ? 'true' : undefined
                  }
                  className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm font-semibold transition-colors duration-150 ease-out ${
                  openLesson?.id === lesson.id ?
                  'bg-brand-50 text-brand-700' :
                  'text-ink-700 hover:bg-slate-50 hover:text-brand-600'}`
                  }>
                  
                      <PlayCircleIcon
                    className="h-4 w-4 shrink-0"
                    aria-hidden="true" />
                  
                      <span className="flex-1 truncate">{lesson.title}</span>
                    </button>
                  </li>
              )}
              </ul>
            </div>
          )}
        </nav>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          {openLesson ?
          <>
              <h2 className="font-display text-lg font-extrabold tracking-tight text-ink">
                {openLesson.title}
              </h2>

              <div className="mt-4 flex aspect-video items-center justify-center rounded-xl bg-ink text-white">
                <div className="text-center">
                  <PlayCircleIcon
                  className="mx-auto h-10 w-10"
                  aria-hidden="true" />
                
                  <p className="mt-2 text-sm font-semibold">
                    {openLesson.video ?? 'Fără video încărcat'}
                  </p>
                  {openLesson.duration &&
                <p className="text-xs text-white/60">
                      {openLesson.duration}
                    </p>
                }
                </div>
              </div>

              <h3 className="mt-5 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-ink-500">
                <FileTextIcon className="h-4 w-4" aria-hidden="true" />
                Suport scris
              </h3>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-700">
                {openLesson.notes || 'Fără suport scris pentru această lecție.'}
              </p>

              <h3 className="mt-5 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-ink-500">
                <PaperclipIcon className="h-4 w-4" aria-hidden="true" />
                Resurse
              </h3>
              {openLesson.resources.length > 0 ?
            <ul className="mt-2 space-y-1.5">
                  {openLesson.resources.map((resource) =>
              <li
                key={resource.id}
                className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-ink-700">
                
                      {resource.kind === 'link' ?
                <LinkIcon className="h-4 w-4" aria-hidden="true" /> :

                <PaperclipIcon className="h-4 w-4" aria-hidden="true" />
                }
                      <span className="truncate">{resource.name}</span>
                    </li>
              )}
                </ul> :

            <p className="mt-2 text-sm text-ink-500">Nicio resursă.</p>
            }
            </> :

          <p className="text-sm text-ink-500">
              Cursul nu are încă lecții încărcate.
            </p>
          }
        </div>
      </div>
    </>);

}