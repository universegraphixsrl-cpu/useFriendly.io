import React, { useEffect, useState } from 'react';
import {
  ArrowLeftIcon,
  PlusIcon,
  PlayIcon,
  FileTextIcon,
  ChevronDownIcon,
  Trash2Icon } from
'lucide-react';
import { courseStats, type Course, type Lesson } from '../../data/courses';
import { CourseAccess } from './CourseAccess';
import { LessonEditor } from './LessonEditor';
import { Toast } from '../Toast';

interface CourseDetailProps {
  course: Course;
  onChange: (course: Course) => void;
  onBack: () => void;
}

export function CourseDetail({ course, onChange, onBack }: CourseDetailProps) {
  const [openLessonId, setOpenLessonId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Course>(course);
  const [toast, setToast] = useState<string | null>(null);

  const stats = courseStats(draft);
  const dirty = JSON.stringify(draft) !== JSON.stringify(course);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const addModule = () =>
  setDraft((current) => ({
    ...current,
    modules: [
    ...current.modules,
    {
      id: `mod-${Date.now()}`,
      title: `Modul ${current.modules.length + 1} · Fără titlu`,
      lessons: []
    }]

  }));

  const patchModule = (
  moduleId: string,
  patch: Partial<Course['modules'][number]>) =>

  setDraft((current) => ({
    ...current,
    modules: current.modules.map((module) =>
    module.id === moduleId ? { ...module, ...patch } : module
    )
  }));

  const deleteModule = (moduleId: string) =>
  setDraft((current) => ({
    ...current,
    modules: current.modules.filter((module) => module.id !== moduleId)
  }));

  const addLesson = (moduleId: string) => {
    const id = `les-${Date.now()}`;
    const lesson: Lesson = {
      id,
      title: '',
      video: null,
      duration: '—',
      notes: '',
      resources: []
    };
    setDraft((current) => ({
      ...current,
      modules: current.modules.map((module) =>
      module.id === moduleId ?
      { ...module, lessons: [...module.lessons, lesson] } :
      module
      )
    }));
    setOpenLessonId(id);
  };

  const patchLesson = (
  moduleId: string,
  lessonId: string,
  patch: Partial<Lesson>) =>

  setDraft((current) => ({
    ...current,
    modules: current.modules.map((module) =>
    module.id === moduleId ?
    {
      ...module,
      lessons: module.lessons.map((lesson) =>
      lesson.id === lessonId ? { ...lesson, ...patch } : lesson
      )
    } :
    module
    )
  }));

  const deleteLesson = (moduleId: string, lessonId: string) =>
  setDraft((current) => ({
    ...current,
    modules: current.modules.map((module) =>
    module.id === moduleId ?
    {
      ...module,
      lessons: module.lessons.filter(
        (lesson) => lesson.id !== lessonId
      )
    } :
    module
    )
  }));

  const applyAccess = (names: string[]) => {
    setDraft((current) => ({ ...current, access: names }));
    onChange({ ...course, access: names });
    setToast('Acces actualizat cu succes');
  };

  const saveChanges = () => {
    onChange(draft);
    setToast('Modificări salvate cu succes');
  };

  return (
    <>
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 transition-colors duration-150 ease-out hover:text-brand-600">
        
        <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
        Toate materialele
      </button>

      <div
        className="mt-4 rounded-2xl border border-l-4 border-slate-200 bg-white p-5 shadow-sm"
        style={{ borderLeftColor: draft.color }}>
        
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">
          {draft.title}
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-ink-500">
          {draft.description || 'Fără descriere'}
        </p>
        <p className="mt-2 text-xs font-semibold text-ink-500">
          {stats.modules} module · {stats.lessons} lecții · {stats.videos}{' '}
          video · {stats.resources} resurse
        </p>
        <CourseAccess access={draft.access} onApply={applyAccess} />
      </div>

      <div className="mt-5 flex items-center justify-between">
        <h2 className="font-display text-base font-extrabold tracking-tight text-ink">
          Structura cursului
        </h2>
        <button
          type="button"
          onClick={addModule}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-3 py-2 text-sm font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600">
          
          <PlusIcon className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
          Adaugă modul
        </button>
      </div>

      <ul className="mt-3 space-y-3">
        {draft.modules.map((module) =>
        <li
          key={module.id}
          className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
          
            <div className="flex flex-wrap items-center gap-3">
              <input
              type="text"
              value={module.title}
              onChange={(event) =>
              patchModule(module.id, { title: event.target.value })
              }
              aria-label="Titlul modulului"
              className="min-w-[220px] flex-1 rounded-lg border border-transparent px-2 py-1.5 font-display text-sm font-bold text-ink transition-colors duration-150 ease-out hover:border-slate-200 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100" />
            
              <span className="text-xs font-semibold text-ink-500">
                {module.lessons.length} lecții
              </span>
              <button
              type="button"
              onClick={() => addLesson(module.id)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-ink-700 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
              
                <PlusIcon
                className="h-3.5 w-3.5"
                strokeWidth={2.5}
                aria-hidden="true" />
              
                Adaugă lecție
              </button>
              <button
              type="button"
              onClick={() => deleteModule(module.id)}
              aria-label={`Șterge ${module.title}`}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-500 transition-colors duration-150 ease-out hover:bg-rose-50 hover:text-rose-600">
              
                <Trash2Icon className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {module.lessons.length === 0 ?
          <p className="mt-3 rounded-xl bg-slate-50 px-3 py-3 text-xs font-semibold text-ink-500">
                Niciun material în acest modul. Adaugă prima lecție video sau
                procedura scrisă.
              </p> :

          <ul className="mt-3 space-y-2">
                {module.lessons.map((lesson) => {
              const open = openLessonId === lesson.id;
              return (
                <li key={lesson.id}>
                      {open ?
                  <LessonEditor
                    lesson={lesson}
                    onChange={(patch) =>
                    patchLesson(module.id, lesson.id, patch)
                    }
                    onDelete={() => {
                      deleteLesson(module.id, lesson.id);
                      setOpenLessonId(null);
                    }} /> :


                  <button
                    type="button"
                    onClick={() => setOpenLessonId(lesson.id)}
                    className="flex w-full items-center gap-3 rounded-xl border border-slate-200 px-3 py-2.5 text-left transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50">
                    
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-ink-700">
                            {lesson.video ?
                      <PlayIcon
                        className="h-3.5 w-3.5"
                        aria-hidden="true" /> :


                      <FileTextIcon
                        className="h-3.5 w-3.5"
                        aria-hidden="true" />

                      }
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold text-ink">
                              {lesson.title || 'Lecție fără titlu'}
                            </span>
                            <span className="block truncate text-xs text-ink-500">
                              {lesson.video ?
                        `${lesson.video} · ${lesson.duration}` :
                        'Doar suport scris'}{' '}
                              · {lesson.resources.length} resurse
                            </span>
                          </span>
                          <ChevronDownIcon
                      className="h-4 w-4 shrink-0 text-ink-500"
                      aria-hidden="true" />
                    
                        </button>
                  }
                    </li>);

            })}
              </ul>
          }
          </li>
        )}
      </ul>

      {dirty &&
      <div className="sticky bottom-4 mt-5 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur">
          <button
          type="button"
          onClick={saveChanges}
          className="rounded-lg bg-brand-500 px-3.5 py-2.5 font-display text-sm font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600">
          
            Salvează modificările
          </button>
          <button
          type="button"
          onClick={() => {
            setDraft(course);
            setOpenLessonId(null);
          }}
          className="text-sm font-semibold text-ink-500 underline-offset-4 hover:text-ink-700 hover:underline">
          
            Anulează
          </button>
          <span className="text-xs font-semibold text-amber-700">
            Ai modificări nesalvate
          </span>
        </div>
      }

      {toast && <Toast message={toast} />}
    </>);

}