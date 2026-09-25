import { useEffect, useRef, useState } from 'react';
import { supabase, supabaseConfigured } from './supabase';
import type { Task, TaskCategory, TaskAssignee } from '../data/tasks';

/**
 * Task-urile și categoriile lor, legate de baza de date.
 *
 * Merge pe același tipar ca `leadsSync`: la pornire încarcă ce e în bază,
 * apoi la fiecare modificare trimite doar ce s-a schimbat. Paginile
 * existente continuă să folosească `tasks` și `setTasks` din
 * WorkspaceContext, fără nicio modificare.
 */

type SyncStatus = 'idle' | 'loading' | 'ready' | 'error';

interface TaskRow {
  id: string;
  category_id: string | null;
  title: string;
  detail: string;
  deadline: string;
  time: string;
  status: string;
  alarm: boolean;
  recurrence: string | null;
  recurrence_time: string;
  team: boolean;
  owner: string;
  assigned_today: boolean;
}

interface CategoryRow {
  id: string;
  name: string;
  color: string;
  position: number;
}

function toTaskRow(task: Task): TaskRow {
  return {
    id: task.id,
    category_id: task.categoryId || null,
    title: task.title ?? '',
    detail: task.detail ?? '',
    deadline: task.deadline ?? '',
    time: task.time ?? '',
    status: task.status,
    alarm: Boolean(task.alarm),
    recurrence: task.recurrence ?? null,
    recurrence_time: task.recurrenceTime ?? '',
    team: Boolean(task.team),
    owner: task.owner ?? '',
    assigned_today: Boolean(task.assignedToday)
  };
}

function toCategoryRow(category: TaskCategory, position: number): CategoryRow {
  return {
    id: category.id,
    name: category.name,
    color: category.color,
    position
  };
}

const fingerprint = (value: unknown) => JSON.stringify(value);

export function useTasksSync(options: {
  enabled: boolean;
  tasks: Task[];
  categories: TaskCategory[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setCategories: React.Dispatch<React.SetStateAction<TaskCategory[]>>;
}) {
  const { enabled, tasks, categories, setTasks, setCategories } = options;
  const [status, setStatus] = useState<SyncStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const savedTasks = useRef(new Map<string, string>());
  const savedCategories = useRef(new Map<string, string>());
  const savedAssignees = useRef(new Map<string, string>());
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ---------- încărcarea inițială ----------
  useEffect(() => {
    if (!enabled || !supabaseConfigured) return;

    let active = true;
    setStatus('loading');

    (async () => {
      const [categoriesResult, tasksResult, assigneesResult] = await Promise.all([
      supabase.
      from('task_categories').
      select('id, name, color, position').
      order('position', { ascending: true }),
      supabase.from('tasks').select('*').order('created_at', { ascending: false }),
      supabase.from('task_assignees').select('*')]
      );

      if (!active) return;

      const failure =
      categoriesResult.error ?? tasksResult.error ?? assigneesResult.error;
      if (failure) {
        console.error('[Supabase] Încărcarea task-urilor a eșuat:', failure.message);
        setError(failure.message);
        setStatus('error');
        return;
      }

      const assigneesByTask = new Map<string, TaskAssignee[]>();
      (assigneesResult.data ?? []).forEach((row: any) => {
        const bucket = assigneesByTask.get(row.task_id) ?? [];
        bucket.push({
          name: row.name,
          role: row.role ?? '',
          done: Boolean(row.done)
        });
        assigneesByTask.set(row.task_id, bucket);
      });

      const nextCategories: TaskCategory[] = (categoriesResult.data ?? []).map(
        (row: any) => ({
          id: row.id,
          name: row.name,
          color: row.color ?? '#2f6bff'
        })
      );

      const nextTasks: Task[] = (tasksResult.data ?? []).map((row: any) => ({
        id: row.id,
        categoryId: row.category_id ?? '',
        title: row.title ?? '',
        detail: row.detail ?? '',
        deadline: row.deadline ?? '',
        time: row.time ?? '',
        status: row.status,
        alarm: Boolean(row.alarm),
        recurrence: row.recurrence ?? null,
        recurrenceTime: row.recurrence_time ?? '',
        team: Boolean(row.team),
        assignees: assigneesByTask.get(row.id) ?? [],
        owner: row.owner || undefined,
        assignedToday: Boolean(row.assigned_today)
      }));

      savedCategories.current = new Map(
        nextCategories.map((item, index) => [
        item.id,
        fingerprint(toCategoryRow(item, index))]
        )
      );
      savedTasks.current = new Map(
        nextTasks.map((task) => [task.id, fingerprint(toTaskRow(task))])
      );
      savedAssignees.current = new Map(
        nextTasks.flatMap((task) =>
        (task.assignees ?? []).map((person) => [
        `${task.id}|${person.name}`,
        fingerprint(person)]
        )
        )
      );

      setCategories(nextCategories);
      setTasks(nextTasks);
      setStatus('ready');
    })();

    return () => {
      active = false;
    };
  }, [enabled]);

  // ---------- salvarea modificărilor ----------
  useEffect(() => {
    if (status !== 'ready') return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      void pushChanges();
    }, 600);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks, categories, status]);

  async function pushChanges() {
    // --- categorii ---
    const categoryRows = categories.map((item, index) =>
    toCategoryRow(item, index)
    );
    const changedCategories = categoryRows.filter(
      (row) => savedCategories.current.get(row.id) !== fingerprint(row)
    );
    const removedCategoryIds = [...savedCategories.current.keys()].filter(
      (id) => !categoryRows.some((row) => row.id === id)
    );

    if (changedCategories.length) {
      const { error: categoryError } = await supabase.
      from('task_categories').
      upsert(changedCategories);
      if (categoryError) {
        console.error('[Supabase] Salvarea categoriilor a eșuat:', categoryError.message);
        setError(categoryError.message);
        return;
      }
    }
    if (removedCategoryIds.length) {
      await supabase.from('task_categories').delete().in('id', removedCategoryIds);
    }

    // --- task-uri ---
    const taskRows = tasks.map(toTaskRow);
    const changedTasks = taskRows.filter(
      (row) => savedTasks.current.get(row.id) !== fingerprint(row)
    );
    const removedTaskIds = [...savedTasks.current.keys()].filter(
      (id) => !taskRows.some((row) => row.id === id)
    );

    if (changedTasks.length) {
      for (let index = 0; index < changedTasks.length; index += 200) {
        const batch = changedTasks.slice(index, index + 200);
        const { error: taskError } = await supabase.from('tasks').upsert(batch);
        if (taskError) {
          console.error('[Supabase] Salvarea task-urilor a eșuat:', taskError.message);
          setError(taskError.message);
          return;
        }
      }
    }
    if (removedTaskIds.length) {
      await supabase.from('tasks').delete().in('id', removedTaskIds);
    }

    // --- cine e atribuit pe fiecare task ---
    const assigneeRows = tasks.flatMap((task) =>
    (task.assignees ?? []).map((person) => ({
      task_id: task.id,
      name: person.name,
      role: person.role ?? '',
      done: Boolean(person.done)
    }))
    );
    const currentAssigneeKeys = new Set(
      assigneeRows.map((row) => `${row.task_id}|${row.name}`)
    );
    const changedAssignees = assigneeRows.filter((row) => {
      const key = `${row.task_id}|${row.name}`;
      return (
        savedAssignees.current.get(key) !==
        fingerprint({ name: row.name, role: row.role, done: row.done }));

    });
    if (changedAssignees.length) {
      await supabase.from('task_assignees').upsert(changedAssignees);
    }

    // Persoanele scoase de pe un task
    const removedAssignees = [...savedAssignees.current.keys()].filter(
      (key) => !currentAssigneeKeys.has(key)
    );
    for (const key of removedAssignees) {
      const [taskId, name] = key.split('|');
      // dacă task-ul mai există, doar persoana a fost scoasă
      if (taskRows.some((row) => row.id === taskId)) {
        await supabase.
        from('task_assignees').
        delete().
        eq('task_id', taskId).
        eq('name', name);
      }
    }

    savedCategories.current = new Map(
      categoryRows.map((row) => [row.id, fingerprint(row)])
    );
    savedTasks.current = new Map(
      taskRows.map((row) => [row.id, fingerprint(row)])
    );
    savedAssignees.current = new Map(
      assigneeRows.map((row) => [
      `${row.task_id}|${row.name}`,
      fingerprint({ name: row.name, role: row.role, done: row.done })]
      )
    );
    setError(null);
  }

  return { status, error };
}
