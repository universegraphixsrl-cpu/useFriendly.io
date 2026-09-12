import React, { useState } from 'react';
import {
  PlusIcon,
  FolderPlusIcon,
  UsersRoundIcon,
  BellRingIcon,
  ChevronLeftIcon } from
'lucide-react';
import {
  taskStatuses,
  type Task,
  type TaskAssignee,
  type TaskStatus } from
'../data/tasks';
import { TaskRow } from '../components/tasks/TaskRow';
import { CategoryForm } from '../components/tasks/CategoryForm';
import { TeamTaskForm } from '../components/tasks/TeamTaskForm';
import { CategoryPicker } from '../components/tasks/CategoryPicker';
import { useWorkspace } from '../contexts/WorkspaceContext';

const statusStyles: Record<TaskStatus, string> = {
  Finalizat: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'În lucru': 'bg-brand-50 text-brand-700 border-brand-200',
  'Deadline ratat': 'bg-red-50 text-red-700 border-red-200',
  'Urmează să înceapă': 'bg-slate-100 text-ink-700 border-slate-200'
};

export function Tasks() {
  const {
    activeUser,
    categories,
    setCategories,
    tasks: allTasks,
    setTasks,
    newTasksFor,
    unseenTasksFor,
    markTasksSeen
  } = useWorkspace();
  const isSub = activeUser !== null;
  const [showNewOnly, setShowNewOnly] = useState(false);

  /** Sub-accountul vede doar task-urile lui și pe cele primite de la admin */
  const tasks = isSub ?
  allTasks.filter(
    (task) =>
    task.owner === activeUser ||
    task.team &&
    task.assignees?.some((member) => member.name === activeUser)
  ) :
  allTasks.filter((task) => !task.owner);

  const newTasks = isSub ? newTasksFor(activeUser) : [];
  const unseenCount = isSub ? unseenTasksFor(activeUser).length : 0;
  const [editingId, setEditingId] = useState<string | null>(null);
  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  /** Categoria pentru care se creează un task nou după alegerea din listă */
  const [categoryPickerOpen, setCategoryPickerOpen] = useState(false);
  const [topPickerOpen, setTopPickerOpen] = useState(false);
  const [teamFormOpen, setTeamFormOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const updateTask = (id: string, patch: Partial<Task>) =>
  setTasks((current) =>
  current.map((task) => task.id === id ? { ...task, ...patch } : task)
  );

  const addTask = (categoryId: string) => {
    const id = `task-${Date.now()}`;
    setTasks((current) => [
    ...current,
    {
      id,
      categoryId,
      title: '',
      detail: '',
      deadline: '',
      time: '',
      status: 'Urmează să înceapă',
      alarm: true,
      recurrence: null,
      recurrenceTime: '09:00',
      owner: activeUser ?? undefined
    }]
    );
    setEditingId(id);
    setCategoryPickerOpen(false);
  };

  /** Sub-accountul marchează, doar pentru el, un team task ca executat */
  const toggleMyDone = (taskId: string) =>
  setTasks((current) =>
  current.map((task) =>
  task.id === taskId ?
  {
    ...task,
    assignees: task.assignees?.map((member) =>
    member.name === activeUser ?
    { ...member, done: !member.done } :
    member
    )
  } :
  task
  )
  );

  const createTeamTask = (draft: {
    title: string;
    detail: string;
    categoryId: string;
    assignees: TaskAssignee[];
  }) => {
    setTasks((current) => [
    ...current,
    {
      id: `team-${Date.now()}`,
      categoryId: draft.categoryId,
      title: draft.title,
      detail: draft.detail,
      deadline: '',
      time: '',
      status: 'Urmează să înceapă',
      alarm: true,
      recurrence: null,
      recurrenceTime: '09:00',
      team: true,
      assignedToday: true,
      assignees: draft.assignees
    }]
    );
    setTeamFormOpen(false);
    setNotice(
      `Task trimis către ${draft.assignees.length} sub-accounts. Au primit notificare în CRM și pe email, iar task-ul apare deja în secțiunea lor de task-uri.`
    );
  };

  const createCategory = (name: string, color: string) => {
    const id = `cat-${Date.now()}`;
    setCategories((current) => [...current, { id, name, color }]);
    setCategoryFormOpen(false);
  };

  const [statusFilter, setStatusFilter] = useState<TaskStatus | null>(null);

  const counts = taskStatuses.map((status) => ({
    status,
    total: tasks.filter((task) => task.status === status).length
  }));

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Task-uri
          </h1>
          <p className="mt-1 text-sm text-ink-700">
            {isSub ?
            'Task-urile tale, plus cele primite de la admin. Pe cele de echipă le poți doar marca drept finalizate.' :
            'Grupate pe categorii, cu deadline, recurență și alarmă pe fiecare.'}
          </p>
          {showNewOnly &&
          <button
            type="button"
            onClick={() => setShowNewOnly(false)}
            className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 transition-colors duration-150 ease-out hover:text-brand-600">
            
              <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
              Întoarce-te la lista completă de task-uri
            </button>
          }
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {isSub ?
          <button
            type="button"
            onClick={() => {
              markTasksSeen(activeUser);
              setShowNewOnly((value) => !value);
            }}
            aria-pressed={showNewOnly}
            className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-2.5 text-sm font-semibold transition-colors duration-150 ease-out ${
            showNewOnly ?
            'border-brand-300 bg-brand-50 text-brand-700' :
            'border-slate-200 bg-white text-ink-700 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700'}`
            }>
            
              <BellRingIcon className="h-4 w-4" aria-hidden="true" />
              Task-uri noi
              <span
              className={`rounded-full px-1.5 py-0.5 text-[11px] font-bold ${
              unseenCount > 0 ?
              'bg-brand-500 text-white' :
              'bg-slate-100 text-ink-500'}`
              }>
              
                {unseenCount}
              </span>
            </button> :

          <>
              <button
              type="button"
              onClick={() => setCategoryFormOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-ink-700 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
              
                <FolderPlusIcon className="h-4 w-4" aria-hidden="true" />
                Creează categorie task-uri
              </button>
              <button
              type="button"
              onClick={() => {
                setTeamFormOpen(true);
                setCategoryFormOpen(false);
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-ink-700 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
              
                <UsersRoundIcon className="h-4 w-4" aria-hidden="true" />
                Creează team task
              </button>
            </>
          }
          <div className="relative">
            <button
              type="button"
              onClick={() => setTopPickerOpen((value) => !value)}
              aria-haspopup="menu"
              aria-expanded={topPickerOpen}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-3.5 py-2.5 font-display text-sm font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600">
              
              <PlusIcon
                className="h-4 w-4"
                strokeWidth={2.5}
                aria-hidden="true" />
              
              Adaugă task
            </button>

            {topPickerOpen &&
            <CategoryPicker
              categories={categories}
              tasks={tasks}
              placement="below"
              onPick={(categoryId) => {
                setTopPickerOpen(false);
                addTask(categoryId);
              }}
              onCreateNew={() => {
                setTopPickerOpen(false);
                setCategoryFormOpen(true);
              }}
              onClose={() => setTopPickerOpen(false)} />

            }
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setStatusFilter(null)}
          aria-pressed={statusFilter === null}
          className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-colors duration-150 ease-out ${
          statusFilter === null ?
          'border-ink bg-ink text-white' :
          'border-slate-200 bg-white text-ink-700 hover:bg-slate-50'}`
          }>
          
          Toate · {tasks.length}
        </button>
        {counts.map((item) =>
        <button
          key={item.status}
          type="button"
          onClick={() =>
          setStatusFilter((current) =>
          current === item.status ? null : item.status
          )
          }
          aria-pressed={statusFilter === item.status}
          className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-colors duration-150 ease-out ${statusStyles[item.status]} ${
          statusFilter === item.status ?
          'ring-2 ring-ink ring-offset-1' :
          'hover:opacity-80'}`
          }>
          
            {item.status} · {item.total}
          </button>
        )}
      </div>

      {notice &&
      <p
        role="status"
        className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
        
          <BellRingIcon className="h-4 w-4" aria-hidden="true" />
          {notice}
        </p>
      }

      {categoryFormOpen &&
      <CategoryForm
        onCreate={createCategory}
        onCancel={() => setCategoryFormOpen(false)} />

      }

      {teamFormOpen &&
      <TeamTaskForm
        categories={categories}
        onCreate={createTeamTask}
        onCancel={() => setTeamFormOpen(false)} />

      }

      <div className="mt-6 space-y-8">
        {categories.map((category) => {
          const categoryTasks = tasks.filter(
            (task) =>
            task.categoryId === category.id && (
            statusFilter ? task.status === statusFilter : true) && (
            showNewOnly ? newTasks.some((item) => item.id === task.id) : true)
          );
          if ((statusFilter || showNewOnly) && categoryTasks.length === 0)
          return null;
          return (
            <section key={category.id} aria-labelledby={`cat-${category.id}`}>
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                  aria-hidden="true" />
                
                <h2
                  id={`cat-${category.id}`}
                  className="font-display text-base font-extrabold tracking-tight text-ink">
                  
                  {category.name}
                </h2>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-ink-500">
                  {categoryTasks.length}
                </span>
                <button
                  type="button"
                  onClick={() => addTask(category.id)}
                  className="ml-auto inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 underline-offset-4 hover:underline">
                  
                  <PlusIcon
                    className="h-3.5 w-3.5"
                    strokeWidth={2.5}
                    aria-hidden="true" />
                  
                  Adaugă în {category.name}
                </button>
              </div>

              {categoryTasks.length > 0 ?
              <ul className="mt-3 space-y-3">
                  {categoryTasks.map((task) =>
                <TaskRow
                  key={task.id}
                  task={task}
                  accentColor={category.color}
                  editing={editingId === task.id}
                  viewerName={activeUser ?? undefined}
                  onToggleMine={
                  isSub && task.team ?
                  () => toggleMyDone(task.id) :
                  undefined
                  }
                  onEdit={() => {
                    if (isSub && task.team) return;
                    setEditingId(task.id);
                  }}
                  onStopEditing={() => setEditingId(null)}
                  onUpdate={(patch) => updateTask(task.id, patch)}
                  onDelete={
                  isSub && task.team ?
                  undefined :
                  () =>
                  setTasks((current) =>
                  current.filter((item) => item.id !== task.id)
                  )
                  } />

                )}
                </ul> :

              <p className="mt-3 rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-6 text-center text-sm text-ink-500">
                  Nicio sarcină în această categorie.
                </p>
              }
            </section>);

        })}
      </div>

      <div className="relative mt-8">
        <button
          type="button"
          onClick={() => setCategoryPickerOpen((value) => !value)}
          aria-haspopup="menu"
          aria-expanded={categoryPickerOpen}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-5 text-sm font-bold text-ink-700 transition-colors duration-150 ease-out hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700">
          
          <PlusIcon className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
          Adaugă task
        </button>

        {categoryPickerOpen &&
        <CategoryPicker
          categories={categories}
          tasks={tasks}
          placement="above"
          onPick={(categoryId) => addTask(categoryId)}
          onCreateNew={() => {
            setCategoryPickerOpen(false);
            setCategoryFormOpen(true);
          }}
          onClose={() => setCategoryPickerOpen(false)} />

        }
      </div>
    </>);

}