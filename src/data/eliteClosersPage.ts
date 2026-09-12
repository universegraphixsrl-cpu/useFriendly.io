import {
  rowOf,
  sectionOf,
  styled,
  type ElementStyle,
  type RowNode,
  type SectionNode } from
'./editor';

/** Paleta violet a paginii EliteClosers */
const VIOLET = '#7c3aed';
const VIOLET_DARK = '#5b21b6';
const VIOLET_SOFT = '#f5f0ff';
const INK = '#160d2b';
const MUTED = '#5c5473';

const heading = (
text: string,
size: number,
color = INK,
align: ElementStyle['align'] = 'center') =>

styled('headline', {
  text,
  align,
  typo: {
    fontFamily: 'Poppins',
    fontSize: size,
    lineHeight: Math.round(size * 1.18),
    letterSpacing: size > 40 ? -1 : 0,
    fontStyle: '800'
  },
  colors: { text: color }
});

const body = (
text: string,
size = 17,
color = MUTED,
align: ElementStyle['align'] = 'center') =>

styled('text', {
  text,
  align,
  typo: {
    fontFamily: 'Poppins',
    fontSize: size,
    lineHeight: Math.round(size * 1.6),
    letterSpacing: 0,
    fontStyle: '400'
  },
  colors: { text: color }
});

const cta = (text: string, subtext: string) =>
styled('button', {
  text,
  align: 'center',
  marTop: 10,
  btnSubtext: subtext,
  btnHoverEnabled: true,
  btnHoverScale: 4,
  btnHoverBg: VIOLET_DARK,
  typo: {
    fontFamily: 'Poppins',
    fontSize: 19,
    lineHeight: 26,
    letterSpacing: 0.4,
    fontStyle: '800'
  },
  colors: { bg: VIOLET, text: '#ffffff', subtext: '#e6dcff' }
});

const bullets = (items: string[]) =>
styled('bulleted', {
  text: items.join('\n'),
  align: 'left',
  marTop: 12,
  typo: {
    fontFamily: 'Poppins',
    fontSize: 17,
    lineHeight: 30,
    letterSpacing: 0,
    fontStyle: '400'
  },
  bulletIcon: 'check',
  bulletSize: 20,
  bulletSpacing: 4,
  colors: { text: INK, bullet: VIOLET }
});

/** Card de serviciu: titlu + descriere, pe fundal alb sau violet */
const serviceCard = (
cardTitle: string,
cardBody: string,
accent = false)
: RowNode =>
rowOf(
  [
  [
  heading(cardTitle, 19, accent ? '#ffffff' : INK, 'left'),
  body(cardBody, 15, accent ? '#e6dcff' : MUTED, 'left')]],


  {
    bgColor: accent ? VIOLET : '#ffffff',
    borderRadius: 16,
    borderMode: 'full',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: accent ? VIOLET : '#e7ddff',
    padTop: 14,
    padBottom: 14,
    padLeft: 40,
    padRight: 40,
    marLeft: 0,
    marRight: 0
  }
);

const metric = (value: string, label: string) => [
heading(value, 44, VIOLET, 'center'),
body(label, 14, MUTED, 'center')];


/**
 * Pagina „Webinar live” din funnelul EliteClosers, salvată permanent.
 * Reia structura de pe eliteclosers.ro, în paletă violet, construită
 * exclusiv din elementele editorului — deci rămâne complet editabilă.
 */
export const eliteClosersSections = (): SectionNode[] => {
  const heroImage = styled('image', {
    imageFull: true,
    imageSrc: "/32ec80b1-5f6d-4c3f-b06a-e1823eb176ba.jpg",

    imageAlt: 'Echipă de vânzări EliteClosers la telefon',
    colors: { bg: VIOLET_SOFT }
  });

  const founderImage = styled('image', {
    imageFull: true,
    imageSrc: "/ca092d9f-fe98-432a-b4b8-036c5918be59.jpg",

    imageAlt: 'Fondatorul EliteClosers',
    colors: { bg: VIOLET_SOFT }
  });

  return [
  // bară de anunț
  sectionOf(
    [
    rowOf(
      [
      [
      body(
        'EXCLUSIV pentru autorii ce au deja un program de mentorat, inteleg online-ul si au o promisiune de valoare pragmatica.',
        15,
        '#ffffff'
      )]],


      { marLeft: 40, marRight: 40 }
    )],

    { bgColor: VIOLET, padTop: 5, padBottom: 5 }
  ),

  // hero
  sectionOf(
    [
    rowOf(
      [
      [
      heading('Afacere „la cheie”\npentru autorii de cursuri', 52, INK, 'left'),
      body(
        'Angajam, manageriem si recrutam echipe de vanzari (Closers, Callers, Setters) pentru autori de cursuri ce vor sa scaleze programul de mentorat la +30.000 EURO lunar.',
        18,
        MUTED,
        'left'
      ),
      cta(
        'Programeaza o consultatie GRATUITA',
        '+20 de autori colaboratori in acest moment'
      )],

      [heroImage]],

      { marTop: 10, marLeft: 60, marRight: 60 }
    )],

    { bgColor: '#ffffff', padTop: 16, padBottom: 16 }
  ),

  // cifre
  sectionOf(
    [
    rowOf(
      [
      metric('+20', 'Autori colaboratori'),
      metric('30k€', 'Obiectiv lunar de vanzari'),
      metric('3', 'Roluri recrutate: closer, caller, setter'),
      metric('100%', 'Echipa manageriata de noi')],

      { marLeft: 40, marRight: 40 }
    )],

    { bgColor: VIOLET_SOFT, padTop: 12, padBottom: 12 }
  ),

  // servicii
  sectionOf(
    [
    rowOf([[heading('Servicii de baza ale EliteClosers', 40)]], {
      marLeft: 40,
      marRight: 40
    }),
    rowOf(
      [
      [
      body(
        'Cand spunem ca iti oferim o afacere „la cheie”, la asta ne referim.',
        17
      )]],


      { marTop: 2, marLeft: 70, marRight: 70 }
    ),
    rowOf(
      [
      [
      serviceCard(
        'Recrutare closeri si setteri',
        'Selectam, testam si aducem in echipa ta oameni de vanzari deja obisnuiti cu programele de mentorat de mare valoare.'
      )],

      [
      serviceCard(
        'Management si training',
        'Ii instruim, le facem scripturile, le ascultam apelurile si le corectam saptamanal performanta. Tu nu gestionezi pe nimeni.',
        true
      )],

      [
      serviceCard(
        'Sistem de vanzari complet',
        'CRM, calendare, urmarire lead-uri si raportare zilnica, ca sa vezi in orice moment unde se duce fiecare programare.'
      )]],


      { marTop: 12, marLeft: 44, marRight: 44 }
    )],

    { bgColor: '#ffffff', padTop: 16, padBottom: 16 }
  ),

  // cum lucram
  sectionOf(
    [
    rowOf(
      [
      [founderImage],
      [
      heading('CUM LUCRAM', 15, VIOLET, 'left'),
      heading('Tu livrezi programul. Noi aducem vanzarile.', 36, INK, 'left'),
      body(
        'Preluam intreg procesul de vanzare: de la primul contact cu leadul, pana la apelul de inchidere si incasare. Tu ramai cu ce stii sa faci cel mai bine — sa livrezi rezultate cursantilor tai.',
        17,
        MUTED,
        'left'
      ),
      bullets([
      'Recrutam si testam oamenii potriviti pentru oferta ta',
      'Scriem scripturile si structura apelurilor',
      'Manageriem echipa zilnic, cu obiective clare',
      'Raportare transparenta a fiecarui lead si a fiecarei incasari']
      )]],


      { marTop: 8, marLeft: 40, marRight: 40 }
    )],

    { bgColor: VIOLET_SOFT, padTop: 14, padBottom: 14 }
  ),

  // webinar live
  sectionOf(
    [
    rowOf([[heading('WEBINAR LIVE · GRATUIT', 15, '#e6dcff')]], {
      marLeft: 40,
      marRight: 40
    }),
    rowOf(
      [
      [
      heading(
        'Cum construiesti o echipa de vanzari care iti scaleaza mentoratul la 30.000 € pe luna',
        40,
        '#ffffff'
      )]],


      { marTop: 4, marLeft: 60, marRight: 60 }
    ),
    rowOf(
      [
      [
      body(
        'Joi, ora 19:00 · online, live, cu sesiune de intrebari la final. Locurile sunt limitate.',
        18,
        '#e6dcff'
      )]],


      { marTop: 4, marLeft: 70, marRight: 70 }
    ),
    rowOf(
      [
      [
      styled('form', {
        colors: {
          field: '#ffffff',
          fieldText: INK,
          border: '#e7ddff',
          buttonBg: VIOLET,
          buttonText: '#ffffff'
        },
        formButtonText: 'VREAU LOC LA WEBINARUL LIVE'
      }),
      cta(
        'REZERVA-MI LOCUL GRATUIT',
        'Primesti linkul pe email imediat dupa inscriere'
      )]],


      {
        bgColor: '#ffffff',
        borderRadius: 18,
        padTop: 8,
        padBottom: 8,
        padLeft: 28,
        padRight: 28,
        marTop: 12,
        marLeft: 80,
        marRight: 80
      }
    )],

    { bgColor: VIOLET_DARK, padTop: 16, padBottom: 16 }
  ),

  // urgenta: timer + bara de progres
  sectionOf(
    [
    rowOf([[heading('Inscrierile se inchid in:', 30, '#ffffff')]], {
      marLeft: 40,
      marRight: 40
    }),
    rowOf(
      [
      [
      styled('timer', {
        align: 'center',
        timerType: 'delay',
        timerDelay: { days: 1, hours: 6, minutes: 30, seconds: 0 },
        timerLabels: true,
        timerAction: 'nothing',
        typo: {
          fontFamily: 'Poppins',
          fontSize: 34,
          lineHeight: 40,
          letterSpacing: 0,
          fontStyle: '800'
        },
        colors: { bg: '#ffffff', text: VIOLET_DARK }
      })]],


      { marTop: 6, marLeft: 60, marRight: 60 }
    ),
    rowOf(
      [
      [
      body('84 din 100 de locuri sunt deja ocupate', 15, '#e6dcff'),
      styled('progress', {
        marTop: 6,
        progressValue: 84,
        progressStyle: 'striped',
        colors: { done: '#a78bfa', remaining: '#3b0f75' }
      })]],


      { marTop: 6, marLeft: 90, marRight: 90 }
    )],

    { bgColor: VIOLET, padTop: 14, padBottom: 14 }
  ),

  // ce inveti la webinar
  sectionOf(
    [
    rowOf([[heading('Ce inveti in cele 90 de minute', 40)]], {
      marLeft: 40,
      marRight: 40
    }),
    rowOf(
      [
      [
      serviceCard(
        '01 · Structura echipei',
        'Cine face prospectarea, cine califica si cine inchide. Cum arata organigrama unei echipe care produce 30.000 € pe luna.'
      )],

      [
      serviceCard(
        '02 · Scriptul de inchidere',
        'Cadrul de apel folosit de closerii nostri, pas cu pas, plus intrebarile care decid vanzarea in primele 5 minute.',
        true
      )]],


      { marTop: 12, marLeft: 60, marRight: 60 }
    ),
    rowOf(
      [
      [
      serviceCard(
        '03 · Sistemul de comisionare',
        'Cum platesti oamenii de vanzari astfel incat sa fie motivati si sa ramana in echipa pe termen lung.'
      )],

      [
      serviceCard(
        '04 · Raportarea zilnica',
        'Ce cifre urmaresti zilnic ca sa stii din timp daca luna se inchide bine sau prost.'
      )]],


      { marTop: 8, marLeft: 60, marRight: 60 }
    )],

    { bgColor: '#ffffff', padTop: 16, padBottom: 16 }
  ),

  // video + rezultate
  sectionOf(
    [
    rowOf(
      [
      [
      heading('VEZI CUM ARATA IN PRACTICA', 15, VIOLET, 'left'),
      heading('3 minute din interiorul unei echipe EliteClosers', 34, INK, 'left'),
      body(
        'O inregistrare reala dintr-o sedinta de dimineata: obiective, distribuirea lead-urilor si feedback pe apelurile din ziua precedenta.',
        17,
        MUTED,
        'left'
      ),
      styled('divider', {
        marTop: 10,
        lineStyle: 'solid',
        lineWidth: 2,
        colors: { line: '#e7ddff' }
      }),
      bullets([
      'Sedinta zilnica de 15 minute',
      'Ascultare de apeluri si corectie imediata',
      'Obiective individuale, nu doar de echipa']
      )],

      [
      styled('video', {
        videoType: 'link',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        videoRatio: '16:9',
        videoControls: true,
        videoRadius: 16,
        colors: { bg: '#1b1030', icon: '#ffffff' }
      })]],


      { marTop: 8, marLeft: 50, marRight: 50 }
    )],

    { bgColor: VIOLET_SOFT, padTop: 16, padBottom: 16 }
  ),

  // intrebari frecvente
  sectionOf(
    [
    rowOf([[heading('Intrebari frecvente', 38)]], {
      marLeft: 40,
      marRight: 40
    }),
    rowOf(
      [
      [
      styled('contentBox', {
        text: 'Nu, noi aducem oamenii. Tu ne dai oferta, materialele si accesul la lead-uri, iar restul procesului il gestionam integral.',
        align: 'left',
        typo: {
          fontFamily: 'Poppins',
          fontSize: 16,
          lineHeight: 26,
          letterSpacing: 0,
          fontStyle: '400'
        },
        colors: {
          bg: '#ffffff',
          border: '#e7ddff',
          title: INK,
          text: MUTED
        }
      }),
      styled('contentBox', {
        text: 'Primele rezultate apar de obicei in 3-4 saptamani, dupa ce echipa trece de training si primele 200 de apeluri.',
        align: 'left',
        marTop: 8,
        typo: {
          fontFamily: 'Poppins',
          fontSize: 16,
          lineHeight: 26,
          letterSpacing: 0,
          fontStyle: '400'
        },
        colors: {
          bg: '#ffffff',
          border: '#e7ddff',
          title: INK,
          text: MUTED
        }
      }),
      styled('contentBox', {
        text: 'Lucram doar cu autori care au deja un program de mentorat livrat cel putin o data si o promisiune clara de rezultat.',
        align: 'left',
        marTop: 8,
        typo: {
          fontFamily: 'Poppins',
          fontSize: 16,
          lineHeight: 26,
          letterSpacing: 0,
          fontStyle: '400'
        },
        colors: {
          bg: '#ffffff',
          border: '#e7ddff',
          title: INK,
          text: MUTED
        }
      })]],


      { marTop: 10, marLeft: 90, marRight: 90 }
    )],

    { bgColor: '#ffffff', padTop: 16, padBottom: 16 }
  ),

  // rezervare apel, cu calendar
  sectionOf(
    [
    rowOf([[heading('Prefer sa vorbim direct', 38, '#ffffff')]], {
      marLeft: 40,
      marRight: 40
    }),
    rowOf(
      [
      [
      body(
        'Alege un interval de 30 de minute si discutam concret despre programul tau, oferta si echipa de care ai nevoie.',
        17,
        '#e6dcff'
      )]],


      { marTop: 4, marLeft: 80, marRight: 80 }
    ),
    rowOf([[styled('calendar', { marTop: 12 })]], {
      marTop: 10,
      marLeft: 50,
      marRight: 50
    })],

    { bgColor: VIOLET_DARK, padTop: 16, padBottom: 16 }
  ),

  // testimonial
  sectionOf(
    [
    rowOf(
      [
      [
      heading(
        '„In trei luni am trecut de la 8.000 la 27.000 € pe luna, fara sa mai vand eu.”',
        30,
        INK
      ),
      body(
        'Autor program de mentorat business · colaborator EliteClosers',
        16
      )]],


      { marLeft: 60, marRight: 60 }
    )],

    { bgColor: '#ffffff', padTop: 14, padBottom: 14 }
  ),

  // ultimul apel
  sectionOf(
    [
    rowOf([[styled('icon', { align: 'center', colors: { icon: VIOLET } })]], {
      marLeft: 40,
      marRight: 40
    }),
    rowOf([[heading('Ultimele locuri pentru sesiunea de joi', 36)]], {
      marTop: 4,
      marLeft: 60,
      marRight: 60
    }),
    rowOf(
      [
      [
      body(
        'Daca ai deja un program de mentorat si vrei sa nu mai vinzi tu, acesta e webinarul potrivit.',
        17
      ),
      cta(
        'VREAU SA PARTICIP LA WEBINAR',
        'Participarea este gratuita · locuri limitate'
      ),
      styled('social', {
        align: 'center',
        marTop: 12,
        colors: { icon: '#d9caff' }
      })]],


      { marTop: 4, marLeft: 70, marRight: 70 }
    )],

    { bgColor: VIOLET_SOFT, padTop: 16, padBottom: 16 }
  ),

  // footer
  sectionOf(
    [
    rowOf(
      [
      [
      body(
        'EliteClosers · Bucuresti, Romania · contact@eliteclosers.ro',
        14,
        '#c4b5fd'
      ),
      body('Termeni si conditii · Politica de confidentialitate', 13, '#a78bfa')]],


      { marLeft: 40, marRight: 40 }
    )],

    { bgColor: INK, padTop: 12, padBottom: 12 }
  )];

};