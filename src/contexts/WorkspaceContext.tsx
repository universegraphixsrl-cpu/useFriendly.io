import React, { createContext, useContext, useMemo, useState } from 'react';
import {
  initialLeadLists,
  initialLeads,
  type Lead,
  type LeadList } from
'../data/leads';
import {
  initialCategories,
  initialTasks,
  type Task,
  type TaskCategory } from
'../data/tasks';
import { courses as initialCourses, type Course } from '../data/courses';
import { bookingCalendars, type BookingCalendar } from '../data/calendars';
import { subAccounts } from '../data/subAccounts';
import { initialMessages, type TeamMessage } from '../data/notifications';

const subAccountNames = subAccounts.flatMap((group) => group.members);

export interface DayAvailability {
  day: string;
  enabled: boolean;
  from: string;
  to: string;
}

export const weekDays = [
'Luni',
'Marți',
'Miercuri',
'Joi',
'Vineri',
'Sâmbătă',
'Duminică'];


export const defaultAvailability: DayAvailability[] = weekDays.map((day) => ({
  day,
  enabled: day !== 'Sâmbătă' && day !== 'Duminică',
  from: '09:00',
  to: '18:00'
}));

interface WorkspaceValue {
  /** null = contul de admin; altfel numele sub-accountului deschis */
  activeUser: string | null;
  setActiveUser: (name: string | null) => void;
  lists: LeadList[];
  setLists: React.Dispatch<React.SetStateAction<LeadList[]>>;
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  categories: TaskCategory[];
  setCategories: React.Dispatch<React.SetStateAction<TaskCategory[]>>;
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  calendars: BookingCalendar[];
  setCalendars: React.Dispatch<React.SetStateAction<BookingCalendar[]>>;
  availability: Record<string, DayAvailability[]>;
  setAvailability: React.Dispatch<
    React.SetStateAction<Record<string, DayAvailability[]>>>;

  /** Task-uri primite azi de la admin și nemarcate ca executate */
  newTasksFor: (name: string) => Task[];
  /** Din cele de mai sus, cele pe care agentul nu le-a deschis încă */
  unseenTasksFor: (name: string) => Task[];
  /** Marchează notificarea de task-uri noi ca văzută */
  markTasksSeen: (name: string) => void;
  messages: TeamMessage[];
  sendMessage: (message: TeamMessage) => void;
  /** Marchează mesajele primite ca văzute (opțional doar de la un expeditor) */
  markMessagesRead: (name: string, from?: string) => void;
  /** Task-uri nefinalizate ale contului activ (admin sau sub-account) */
  openTasksFor: (name: string | null) => number;
  /** Câte elemente noi (liste, calendare, materiale) nu au fost încă văzute */
  unseenSectionFor: (name: string, section: NotifiedSection) => number;
  /** Marchează secțiunea ca văzută pentru sub-accountul respectiv */
  markSectionSeen: (name: string, section: NotifiedSection) => void;
}

export type NotifiedSection = 'leads' | 'calendar' | 'materials';

const WorkspaceContext = createContext<WorkspaceValue | null>(null);

export function WorkspaceProvider({ children }: {children: React.ReactNode;}) {
  const [activeUser, setActiveUser] = useState<string | null>(null);
  const [lists, setLists] = useState<LeadList[]>(initialLeadLists);
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [categories, setCategories] =
  useState<TaskCategory[]>(initialCategories);
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [calendars, setCalendars] =
  useState<BookingCalendar[]>(bookingCalendars);
  const [availability, setAvailability] = useState<
    Record<string, DayAvailability[]>>(
    {});
  const [seenTasks, setSeenTasks] = useState<Record<string, string[]>>({});
  const [messages, setMessages] = useState<TeamMessage[]>(initialMessages);
  /** La pornire, tot ce există deja e considerat văzut */
  const [seenSections, setSeenSections] = useState<
    Record<string, Record<NotifiedSection, string[]>>>(
    () => {
      const initial: Record<string, Record<NotifiedSection, string[]>> = {};
      subAccountNames.forEach((name) => {
        initial[name] = {
          leads: initialLeadLists.
          filter((list) => list.access.includes(name) && !list.indexed).
          map((list) => list.id),
          calendar: bookingCalendars.
          filter(
            (item) =>
            item.owner === name ||
            item.members?.some((member) => member.name === name)
          ).
          map((item) => item.id),
          materials: initialCourses.
          filter((course) => course.access.includes(name)).
          map((course) => course.id)
        };
      });
      return initial;
    });

  const sectionIdsFor = (name: string, section: NotifiedSection): string[] => {
    if (section === 'leads') {
      return lists.
      filter((list) => list.access.includes(name) && !list.indexed).
      map((list) => list.id);
    }
    if (section === 'calendar') {
      return calendars.
      filter(
        (item) =>
        item.owner === name ||
        item.members?.some((member) => member.name === name)
      ).
      map((item) => item.id);
    }
    return courses.
    filter((course) => course.access.includes(name)).
    map((course) => course.id);
  };

  const newTasksFor = (name: string) =>
  tasks.filter(
    (task) =>
    task.team &&
    task.assignedToday &&
    task.assignees?.some((member) => member.name === name && !member.done)
  );

  const value = useMemo<WorkspaceValue>(
    () => ({
      activeUser,
      setActiveUser,
      lists,
      setLists,
      leads,
      setLeads,
      tasks,
      setTasks,
      categories,
      setCategories,
      courses,
      setCourses,
      calendars,
      setCalendars,
      availability,
      setAvailability,
      newTasksFor,
      unseenTasksFor: (name: string) =>
      newTasksFor(name).filter(
        (task) => !(seenTasks[name] ?? []).includes(task.id)
      ),
      markTasksSeen: (name: string) =>
      setSeenTasks((current) => ({
        ...current,
        [name]: newTasksFor(name).map((task) => task.id)
      })),
      messages,
      sendMessage: (message: TeamMessage) =>
      setMessages((current) => [message, ...current]),
      markMessagesRead: (name: string, from?: string) =>
      setMessages((current) =>
      current.map((message) =>
      message.to.includes(name) &&
      !message.readBy.includes(name) && (
      from ? message.from === from : true) ?
      { ...message, readBy: [...message.readBy, name] } :
      message
      )
      ),
      openTasksFor: (name: string | null) => {
        if (!name) {
          return tasks.filter(
            (task) => !task.owner && task.status !== 'Finalizat'
          ).length;
        }
        return tasks.filter((task) => {
          if (task.owner === name) return task.status !== 'Finalizat';
          const mine = task.team ?
          task.assignees?.find((member) => member.name === name) :
          undefined;
          return mine ? !mine.done : false;
        }).length;
      },
      unseenSectionFor: (name: string, section: NotifiedSection) => {
        const seen = seenSections[name]?.[section] ?? [];
        return sectionIdsFor(name, section).filter((id) => !seen.includes(id)).
        length;
      },
      markSectionSeen: (name: string, section: NotifiedSection) =>
      setSeenSections((current) => ({
        ...current,
        [name]: {
          leads: current[name]?.leads ?? [],
          calendar: current[name]?.calendar ?? [],
          materials: current[name]?.materials ?? [],
          [section]: sectionIdsFor(name, section)
        }
      }))
    }),
    [
    activeUser,
    lists,
    leads,
    tasks,
    categories,
    courses,
    calendars,
    availability,
    seenTasks,
    seenSections,
    messages]

  );

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>);

}

export function useWorkspace() {
  const value = useContext(WorkspaceContext);
  if (!value) {
    throw new Error('useWorkspace trebuie folosit în WorkspaceProvider');
  }
  return value;
}