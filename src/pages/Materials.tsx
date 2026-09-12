import React, { useState } from 'react';
import { PlusIcon, ArrowRightIcon, LayersIcon } from 'lucide-react';
import { courseStats, type Course } from '../data/courses';
import { CourseForm } from '../components/materials/CourseForm';
import { CourseAccess } from '../components/materials/CourseAccess';
import { CourseDetail } from '../components/materials/CourseDetail';
import { CourseViewer } from '../components/materials/CourseViewer';
import { useWorkspace } from '../contexts/WorkspaceContext';

export function Materials() {
  const { activeUser, courses: items, setCourses: setItems } = useWorkspace();
  const isSub = activeUser !== null;
  const [formOpen, setFormOpen] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  /** Sub-accountul vede doar materialele la care i s-a dat acces */
  const visible = isSub ?
  items.filter((course) => course.access.includes(activeUser)) :
  items;

  const openCourse = visible.find((course) => course.id === openId) ?? null;

  const updateCourse = (updated: Course) =>
  setItems((current) =>
  current.map((course) => course.id === updated.id ? updated : course)
  );

  const applyAccess = (courseId: string, names: string[]) =>
  setItems((current) =>
  current.map((course) =>
  course.id === courseId ? { ...course, access: names } : course
  )
  );

  if (openCourse && isSub) {
    return <CourseViewer course={openCourse} onBack={() => setOpenId(null)} />;
  }

  if (openCourse) {
    return (
      <CourseDetail
        course={openCourse}
        onChange={updateCourse}
        onBack={() => setOpenId(null)} />);


  }

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Materiale & proceduri
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-500">
            {isSub ?
            `Ai acces la ${visible.length} materiale. Le poți parcurge, dar nu le poți modifica.` :
            'Încarcă cursuri, lecții video și proceduri scrise, apoi dă acces individual fiecărui sub-account.'}
          </p>
        </div>
        {!isSub &&
        <button
          type="button"
          onClick={() => setFormOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-3 py-2 text-sm font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600">
          
            <PlusIcon
            className="h-4 w-4"
            strokeWidth={2.5}
            aria-hidden="true" />
          
            Curs nou
          </button>
        }
      </div>

      {formOpen &&
      <CourseForm
        onCreate={(draft) => {
          setItems((current) => [
          ...current,
          {
            id: `course-${Date.now()}`,
            title: draft.title,
            description: draft.description,
            color: draft.color,
            access: draft.access,
            modules: []
          }]
          );
          setFormOpen(false);
        }}
        onCancel={() => setFormOpen(false)} />

      }

      <ul className="mt-6 space-y-3">
        {visible.map((course) => {
          const stats = courseStats(course);
          return (
            <li
              key={course.id}
              className="rounded-2xl border border-l-4 border-slate-200 bg-white p-4 sm:p-5"
              style={{ borderLeftColor: course.color }}>
              
              <div className="flex flex-wrap items-start gap-4">
                <div className="min-w-[240px] flex-1">
                  <h2 className="font-display text-sm font-bold text-ink">
                    {course.title}
                  </h2>
                  <p className="mt-1 text-xs text-ink-500">
                    {course.description || 'Fără descriere'}
                  </p>
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-ink-500">
                    <LayersIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    {stats.modules} module · {stats.lessons} lecții ·{' '}
                    {stats.videos} video · {stats.resources} resurse
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setOpenId(course.id)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-2.5 py-1.5 text-xs font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600">
                  
                  Deschide cursul
                  <ArrowRightIcon className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>

              {!isSub &&
              <CourseAccess
                access={course.access}
                onApply={(names) => applyAccess(course.id, names)} />

              }
            </li>);

        })}
      </ul>
    </>);

}