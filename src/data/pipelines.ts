export interface PipelineData {
  id: string;
  name: string;
  value: number;
  delta: number;
  inscrisiWebinar: number;
  apeluriProgramate: number;
  prezentiApel: number;
  vanzariNoi: number;
  integrale: number;
  rate: number;
  avansuri: number;
}

export const projectPipelines: PipelineData[] = [
{
  id: 'catalina-enea',
  name: 'Catalina Enea',
  value: 42800,
  delta: 14.2,
  inscrisiWebinar: 620,
  apeluriProgramate: 128,
  prezentiApel: 74,
  vanzariNoi: 24,
  integrale: 10,
  rate: 9,
  avansuri: 5
},
{
  id: 'roberta-thegerminds',
  name: 'Roberta TheGerminds',
  value: 31500,
  delta: 8.6,
  inscrisiWebinar: 480,
  apeluriProgramate: 96,
  prezentiApel: 58,
  vanzariNoi: 18,
  integrale: 7,
  rate: 7,
  avansuri: 4
},
{
  id: 'georgiana-vasilescu',
  name: 'Georgiana Vasilescu',
  value: 27900,
  delta: -3.1,
  inscrisiWebinar: 415,
  apeluriProgramate: 84,
  prezentiApel: 49,
  vanzariNoi: 15,
  integrale: 6,
  rate: 6,
  avansuri: 3
},
{
  id: 'seeding-english',
  name: 'Seeding English',
  value: 46200,
  delta: 21.7,
  inscrisiWebinar: 690,
  apeluriProgramate: 141,
  prezentiApel: 82,
  vanzariNoi: 26,
  integrale: 11,
  rate: 10,
  avansuri: 5
},
{
  id: 'english-hub',
  name: 'English Hub',
  value: 18600,
  delta: 5.4,
  inscrisiWebinar: 310,
  apeluriProgramate: 61,
  prezentiApel: 34,
  vanzariNoi: 11,
  integrale: 4,
  rate: 5,
  avansuri: 2
},
{
  id: 'centrul-herghelia',
  name: 'Centrul Herghelia',
  value: 12400,
  delta: -6.8,
  inscrisiWebinar: 245,
  apeluriProgramate: 47,
  prezentiApel: 26,
  vanzariNoi: 8,
  integrale: 3,
  rate: 3,
  avansuri: 2
},
{
  id: 'dana-rosu',
  name: 'Dana Rosu',
  value: 35700,
  delta: 11.9,
  inscrisiWebinar: 520,
  apeluriProgramate: 103,
  prezentiApel: 61,
  vanzariNoi: 20,
  integrale: 8,
  rate: 8,
  avansuri: 4
},
{
  id: 'denisa-fitness',
  name: 'Denisa Fitness',
  value: 22300,
  delta: 4.3,
  inscrisiWebinar: 360,
  apeluriProgramate: 72,
  prezentiApel: 41,
  vanzariNoi: 13,
  integrale: 5,
  rate: 5,
  avansuri: 3
},
{
  id: 'astrapulse',
  name: 'AstraPulse',
  value: 15900,
  delta: 9.5,
  inscrisiWebinar: 280,
  apeluriProgramate: 55,
  prezentiApel: 31,
  vanzariNoi: 10,
  integrale: 4,
  rate: 4,
  avansuri: 2
}];


const sum = (key: keyof Omit<PipelineData, 'id' | 'name' | 'delta'>) =>
projectPipelines.reduce((total, project) => total + project[key], 0);

export const allProjectsPipeline: PipelineData = {
  id: 'all',
  name: 'Toate proiectele',
  value: sum('value'),
  delta: 18.4,
  inscrisiWebinar: sum('inscrisiWebinar'),
  apeluriProgramate: sum('apeluriProgramate'),
  prezentiApel: sum('prezentiApel'),
  vanzariNoi: sum('vanzariNoi'),
  integrale: sum('integrale'),
  rate: sum('rate'),
  avansuri: sum('avansuri')
};

export const pipelineOptions: PipelineData[] = [
allProjectsPipeline,
...projectPipelines];