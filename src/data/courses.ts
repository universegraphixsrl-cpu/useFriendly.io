export interface LessonResource {
  id: string;
  name: string;
  kind: 'link' | 'file';
}

export interface Lesson {
  id: string;
  title: string;
  /** Numele fișierului video încărcat prin drag & drop */
  video: string | null;
  duration: string;
  /** Suportul scris al lecției */
  notes: string;
  resources: LessonResource[];
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  color: string;
  /** Numele membrilor din sub-accounts care au acces */
  access: string[];
  modules: CourseModule[];
}

export const courses: Course[] = [
{
  id: 'course-onboarding',
  title: 'Onboarding closeri',
  description:
  'Tot ce trebuie să știe un closer nou în primele 10 zile: produs, obiecții, structura apelului.',
  color: '#2f6bff',
  access: ['Vlad Ionescu', 'Ana Dumitrescu', 'Sergiu Petrache'],
  modules: [
  {
    id: 'mod-1',
    title: 'Modul 1 · Produsul și avatarul',
    lessons: [
    {
      id: 'les-1',
      title: 'Cui vindem și de ce cumpără',
      video: 'avatar-client-ideal.mp4',
      duration: '12:40',
      notes:
      'Avatarul principal: antreprenor cu business online, 8.000–30.000 € lunar, blocat în livrare. Durerea reală nu e lipsa leadurilor, ci lipsa unui sistem de vânzare.',
      resources: [
      { id: 'res-1', name: 'avatar-worksheet.pdf', kind: 'file' },
      { id: 'res-2', name: 'Studiu de caz — Herghelia', kind: 'link' }]

    },
    {
      id: 'les-2',
      title: 'Oferta și pachetele de preț',
      video: 'oferta-pachete.mp4',
      duration: '18:05',
      notes:
      'Trei pachete: Start, Growth, Pro. Nu prezinți prețul până nu ai confirmat bugetul și decizia.',
      resources: [{ id: 'res-3', name: 'grila-preturi.pdf', kind: 'file' }]
    }]

  },
  {
    id: 'mod-2',
    title: 'Modul 2 · Structura apelului',
    lessons: [
    {
      id: 'les-3',
      title: 'Deschiderea și preluarea controlului',
      video: 'deschidere-apel.mp4',
      duration: '15:22',
      notes:
      'Primele 90 de secunde stabilesc cadrul. Anunți agenda, ceri permisiunea pentru întrebări, confirmi durata.',
      resources: [
      { id: 'res-4', name: 'script-deschidere.pdf', kind: 'file' },
      { id: 'res-5', name: 'Înregistrare apel model', kind: 'link' }]

    }]

  }]

},
{
  id: 'course-callers',
  title: 'Proceduri callers',
  description:
  'Proceduri de contactare, follow-up și programare pentru echipa de calling.',
  color: '#f97316',
  access: ['Bianca Moldovan', 'Rareș Ciobanu', 'Teodora Sava'],
  modules: [
  {
    id: 'mod-3',
    title: 'Modul 1 · Primul contact',
    lessons: [
    {
      id: 'les-4',
      title: 'Apelul în 15 minute după lead',
      video: 'primul-apel.mp4',
      duration: '09:14',
      notes:
      'Suni în maximum 15 minute de la înscriere. Trei încercări în prima zi, la interval de 2 ore.',
      resources: [
      { id: 'res-6', name: 'procedura-contact.pdf', kind: 'file' }]

    }]

  }]

},
{
  id: 'course-sop',
  title: 'SOP interne & raportare',
  description:
  'Proceduri standard de lucru: raportare zilnică, completarea CRM-ului, escaladări.',
  color: '#22c55e',
  access: ['Cristian Barbu', 'Larisa Neagu'],
  modules: [
  {
    id: 'mod-4',
    title: 'Modul 1 · Raportare',
    lessons: [
    {
      id: 'les-5',
      title: 'Raportul zilnic de activitate',
      video: null,
      duration: '—',
      notes:
      'Raportul se trimite până la 19:00 și conține apeluri făcute, prezenți, oferte trimise și încasări.',
      resources: [
      { id: 'res-7', name: 'template-raport.pdf', kind: 'file' }]

    }]

  }]

}];


export function courseStats(course: Course) {
  const lessons = course.modules.reduce(
    (total, module) => total + module.lessons.length,
    0
  );
  const videos = course.modules.reduce(
    (total, module) =>
    total + module.lessons.filter((lesson) => lesson.video).length,
    0
  );
  const resources = course.modules.reduce(
    (total, module) =>
    total +
    module.lessons.reduce(
      (sum, lesson) => sum + lesson.resources.length,
      0
    ),
    0
  );
  return { lessons, videos, resources, modules: course.modules.length };
}