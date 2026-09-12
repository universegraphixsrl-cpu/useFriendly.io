/** Modelul de date al editorului de pagini: Section › Row › Element */

export type ElementKind =
'text' |
'headline' |
'bulleted' |
'contentBox' |
'image' |
'video' |
'audio' |
'carousel' |
'form' |
'formInput' |
'button' |
'checkbox' |
'recaptcha' |
'calendar' |
'divider' |
'timer' |
'spacer' |
'icon' |
'progress' |
'social' |
'menu' |
'popup';

export type TextAlign = 'left' | 'center' | 'right';

/** Stilul comun al oricărui element: conținut, aliniere, spațiere și culori */
export interface Typography {
  /** Fontul Google aplicat textului (gol = fontul temei) */
  fontFamily?: string;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  /** Grosimea și înclinarea textului (ex. „600i” = semi-bold italic) */
  fontStyle?: string;
}

/** Variantele disponibile în selectorul „Font style” */
export const fontStyleOptions: Array<{key: string;label: string;}> = [
{ key: '300', label: 'Light 300' },
{ key: '300i', label: 'Light 300 italic' },
{ key: '400', label: 'Regular' },
{ key: '400i', label: 'Regular 400 italic' },
{ key: '600', label: 'Semi-bold 600' },
{ key: '600i', label: 'Semi-bold 600 italic' },
{ key: '700', label: 'Bold 700' },
{ key: '700i', label: 'Bold 700 italic' },
{ key: '800', label: 'Extra-bold 800' },
{ key: '800i', label: 'Extra-bold 800 italic' }];


export interface ElementStyle {
  text: string;
  /** Varianta cu formatare pe bucăți de text (bold/italic/culoare pe selecție) */
  html?: string;
  align: TextAlign;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strike: boolean;
  /** Tipografia pentru desktop */
  typo: Typography;
  /** Suprascrieri doar pentru mobil (gol = moștenește desktopul) */
  typoMobile: Partial<Typography>;
  padTop: number;
  padBottom: number;
  padLeft: number;
  padRight: number;
  marTop: number;
  marBottom: number;
  marLeft: number;
  marRight: number;
  colors: Record<string, string>;
  /** Doar pentru timer: tipul de numărătoare și acțiunea la expirare */
  timerType?: 'fixed' | 'delay' | 'daily';
  timerDate?: string;
  timerTime?: string;
  timerDelay?: {days: number;hours: number;minutes: number;seconds: number;};
  timerAction?: 'nothing' | 'redirect' | 'reset';
  timerRedirectUrl?: string;
  timerLabels?: boolean;
  /** Doar pentru checkbox: mesajul de eroare și caracterul opțional */
  checkboxMessage?: string;
  checkboxOptional?: boolean;
  /** Doar pentru listă: spațierea între rânduri și iconița folosită */
  bulletSpacing?: number;
  bulletIcon?: string;
  bulletSize?: number;
  /** Doar pentru imagine: sursa, acțiunea la click și dimensiunea */
  imageSrc?: string;
  imageName?: string;
  imageAlt?: string;
  imageAction?: 'none' | 'url' | 'popup';
  imageActionUrl?: string;
  imageFull?: boolean;
  imageSize?: number;
  imageBlur?: number;
  /** Doar pentru video: sursa, redarea și proporția */
  videoType?: 'link' | 'embed' | 'upload';
  videoUrl?: string;
  videoEmbed?: string;
  videoFileName?: string;
  videoAutoplay?: boolean;
  videoControls?: boolean;
  videoRatio?: '16:9' | '4:3' | '1:1' | '9:16';
  videoBorderMode?: 'none' | 'full' | 'bottom' | 'top' | 'topBottom';
  videoBorderStyle?: 'solid' | 'dotted' | 'dashed';
  videoBorderWidth?: number;
  videoRadius?: number;
  /** Doar pentru formular: câmpurile, designul și butonul */
  formFields?: FormField[];
  formBorderMode?: 'none' | 'full' | 'bottom';
  formBorderStyle?: 'solid' | 'dotted' | 'dashed';
  formBorderWidth?: number;
  formRadius?: number;
  formShadow?: string;
  formButtonPosition?: 'left' | 'center' | 'right' | 'full';
  formButtonText?: string;
  formButtonSubtext?: string;
  formButtonIcon?: string;
  formSuccessMessage?: string;
  /** Doar pentru buton: subtextul, tipografia lui și umbra butonului */
  btnSubtext?: string;
  btnSubTypo?: {
    fontFamily: string;
    fontSize: number;
    lineHeight: number;
    letterSpacing: number;
    fontStyle: string;
  };
  btnShadow?: string;
  /** Doar pentru buton: efectul la trecerea cursorului */
  btnHoverEnabled?: boolean;
  /** Cât de mult creste butonul la hover, pe o scară de la 1 la 10 */
  btnHoverScale?: number;
  /** Culorile la hover; goale înseamnă „pastreaza culorile normale” */
  btnHoverBg?: string;
  btnHoverText?: string;
  /** Doar pentru meniu: elementele de navigație și sub-meniurile lor */
  menuItems?: MenuItem[];
  /** Doar pentru bara de progres: procentul completat și modelul vizual */
  progressValue?: number;
  progressStyle?: 'plain' | 'striped';
  /** Grosimea barei, pe o scară de la 1 la 5 */
  progressThickness?: number;
  /** Doar pentru elementul Icon: iconița aleasă și dimensiunea ei */
  iconName?: string;
  iconSize?: number;
  /** Câte copii ale iconiței se afișează, una lângă alta (1–20) */
  iconCount?: number;
  /** Doar pentru linia orizontală: stil, grosime și colțuri */
  lineStyle?: 'none' | 'solid' | 'dotted' | 'dashed';
  lineWidth?: number;
  radius?: [number, number, number, number];
  /** Vizibilitatea elementului pe fiecare dispozitiv */
  visibleDesktop: boolean;
  visibleMobile: boolean;
}

/** Setările ferestrei pop-up construite peste pagină */
export interface PopupStyle {
  showClose: boolean;
  autoOpen: boolean;
  exitIntent: boolean;
  width: number;
  bgColor: string;
  padY: number;
  padX: number;
  radius: number;
  borderMode: 'none' | 'full' | 'bottom' | 'top' | 'topBottom';
  borderStyle: 'solid' | 'dotted' | 'dashed';
  borderColor: string;
  borderWidth: number;
  shadow: string;
}

export const defaultPopupStyle = (): PopupStyle => ({
  showClose: false,
  autoOpen: true,
  exitIntent: false,
  width: 800,
  bgColor: '#ffffff',
  padY: 30,
  padX: 30,
  radius: 6,
  borderMode: 'full',
  borderStyle: 'solid',
  borderColor: '#2f6bff',
  borderWidth: 3,
  shadow: 'soft'
});

/** Un link din meniul de navigație, cu sub-meniul lui opțional */
export interface MenuItem {
  id: string;
  label: string;
  link: string;
  newWindow: boolean;
  hasSubmenu: boolean;
  children: Array<{
    id: string;
    label: string;
    link: string;
    newWindow: boolean;
  }>;
}

let menuSeq = 0;
export const createMenuItem = (label = '', link = ''): MenuItem => {
  menuSeq += 1;
  return {
    id: `menu-${Date.now()}-${menuSeq}`,
    label,
    link,
    newWindow: false,
    hasSubmenu: false,
    children: []
  };
};

export const createSubmenuItem = () => {
  menuSeq += 1;
  return {
    id: `sub-${Date.now()}-${menuSeq}`,
    label: '',
    link: '',
    newWindow: false
  };
};

/** Cele 5 linkuri implicite ale unui meniu nou */
const defaultMenuItems = (): MenuItem[] =>
[
['Home', '/'],
['Programs', '/programs'],
['Success Stories', '/success-stories'],
['Pricing', '/pricing'],
['Contact', '/contact']].
map(([label, link]) => createMenuItem(label, link));

/** Catalogul de câmpuri disponibile într-un formular */
export type FormFieldKind =
'firstName' |
'lastName' |
'email' |
'phone' |
'company' |
'country' |
'state' |
'city' |
'neighborhood' |
'street' |
'streetNumber' |
'postalCode' |
'taxNumber' |
'checkbox';

export interface FormField {
  id: string;
  kind: FormFieldKind;
  /** Textul sugestie afișat vizitatorului */
  placeholder: string;
  /** Câmp opțional (necompletarea nu blochează trimiterea) */
  optional: boolean;
  /** Numele iconiței afișate în câmp (gol = fără iconiță) */
  icon: string;
}

export const formFieldCatalog: Array<{
  kind: FormFieldKind;
  label: string;
  /** Numele intern, afișat doar în editor sub câmp */
  systemName: string;
  placeholder: string;
  group: 'name' | 'contact' | 'address' | 'other';
}> = [
{ kind: 'firstName', label: 'Prenume', systemName: 'FIRST NAME', placeholder: 'Prenume', group: 'name' },
{ kind: 'lastName', label: 'Nume', systemName: 'LAST NAME', placeholder: 'Nume', group: 'name' },
{ kind: 'email', label: 'Email', systemName: 'EMAIL', placeholder: 'Email', group: 'contact' },
{ kind: 'phone', label: 'Telefon', systemName: 'PHONE', placeholder: 'Telefon', group: 'contact' },
{ kind: 'company', label: 'Denumire firmă', systemName: 'COMPANY', placeholder: 'Denumire firmă', group: 'contact' },
{ kind: 'country', label: 'Țară', systemName: 'COUNTRY', placeholder: 'Țară', group: 'contact' },
{ kind: 'state', label: 'Județ', systemName: 'STATE', placeholder: 'Județ', group: 'address' },
{ kind: 'city', label: 'Oraș', systemName: 'CITY', placeholder: 'Oraș', group: 'address' },
{ kind: 'neighborhood', label: 'Cartier', systemName: 'NEIGHBORHOOD', placeholder: 'Cartier', group: 'address' },
{ kind: 'street', label: 'Adresă', systemName: 'STREET ADDRESS', placeholder: 'Adresă', group: 'address' },
{ kind: 'streetNumber', label: 'Număr', systemName: 'STREET NUMBER', placeholder: 'Număr', group: 'address' },
{ kind: 'postalCode', label: 'Cod poștal', systemName: 'POSTAL CODE', placeholder: 'Cod poștal', group: 'address' },
{ kind: 'taxNumber', label: 'CUI / CIF', systemName: 'TAX NUMBER', placeholder: 'CUI / CIF', group: 'address' },
{ kind: 'checkbox', label: 'Checkbox', systemName: 'CHECKBOX', placeholder: 'Da, sunt de acord să primesc emailuri de la voi', group: 'other' }];


export const formFieldMeta = (kind: FormFieldKind) =>
formFieldCatalog.find((item) => item.kind === kind) ?? formFieldCatalog[0];

let formFieldSeq = 0;
export const createFormField = (kind: FormFieldKind): FormField => {
  formFieldSeq += 1;
  return {
    id: `field-${Date.now()}-${formFieldSeq}`,
    kind,
    placeholder: formFieldMeta(kind).placeholder,
    optional: false,
    icon: ''
  };
};

/** Câmpurile implicite ale unui formular nou */
const defaultFormFields = (): FormField[] =>
['firstName', 'lastName', 'email', 'checkbox'].map((kind) =>
createFormField(kind as FormFieldKind)
);

interface ColorFieldDef {
  key: string;
  label: string;
  value: string;
}

/** Culorile editabile pentru fiecare tip de element */
export const elementColorFields: Record<ElementKind, ColorFieldDef[]> = {
  headline: [
  { key: 'text', label: 'Culoare titlu', value: '#0f1729' },
  { key: 'textBg', label: 'Culoare fundal text', value: 'transparent' }],

  text: [
  { key: 'text', label: 'Culoare text', value: '#334155' },
  { key: 'textBg', label: 'Culoare fundal text', value: 'transparent' }],

  bulleted: [
  { key: 'text', label: 'Culoare text', value: '#334155' },
  { key: 'bullet', label: 'Culoare bulină', value: '#2f6bff' },
  { key: 'textBg', label: 'Culoare fundal text', value: 'transparent' }],

  contentBox: [
  { key: 'bg', label: 'Culoare fundal', value: '#f8fafc' },
  { key: 'border', label: 'Culoare contur', value: '#e2e8f0' },
  { key: 'title', label: 'Culoare titlu', value: '#0f1729' },
  { key: 'text', label: 'Culoare text', value: '#64748b' }],

  image: [
  { key: 'bg', label: 'Culoare fundal', value: '#f1f5f9' },
  { key: 'overlay', label: 'Culoare overlay', value: 'transparent' }],

  video: [
  { key: 'bg', label: 'Culoare fundal', value: '#0f1729' },
  { key: 'icon', label: 'Culoare iconiță', value: '#ffffff' },
  { key: 'border', label: 'Culoarea ramei', value: '#2f6bff' }],

  audio: [
  { key: 'bg', label: 'Culoare fundal', value: '#f1f5f9' },
  { key: 'bar', label: 'Culoare bară', value: '#2f6bff' },
  { key: 'text', label: 'Culoare text', value: '#64748b' }],

  carousel: [{ key: 'bg', label: 'Culoare fundal', value: '#f1f5f9' }],
  form: [
  { key: 'field', label: 'Culoare câmpuri', value: '#f5f6f8' },
  { key: 'fieldText', label: 'Culoare text câmpuri', value: '#0f1729' },
  { key: 'border', label: 'Culoare contur', value: '#e2e8f0' },
  { key: 'buttonBg', label: 'Culoare fundal buton', value: '#2f6bff' },
  { key: 'buttonText', label: 'Culoare text buton', value: '#ffffff' }],

  formInput: [
  { key: 'bg', label: 'Culoare fundal', value: '#ffffff' },
  { key: 'border', label: 'Culoare contur', value: '#e2e8f0' },
  { key: 'text', label: 'Culoare text', value: '#94a3b8' }],

  button: [
  { key: 'bg', label: 'Culoare fundal', value: '#2f6bff' },
  { key: 'text', label: 'Culoare text', value: '#ffffff' },
  { key: 'subtext', label: 'Culoare subtext', value: '#dbe6ff' }],

  checkbox: [
  { key: 'box', label: 'Culoare casetă', value: '#2f6bff' },
  { key: 'text', label: 'Culoare text', value: '#334155' },
  { key: 'textBg', label: 'Culoare fundal text', value: 'transparent' }],

  recaptcha: [
  { key: 'bg', label: 'Culoare fundal', value: '#f8fafc' },
  { key: 'border', label: 'Culoare contur', value: '#e2e8f0' },
  { key: 'text', label: 'Culoare text', value: '#64748b' }],

  calendar: [
  { key: 'fieldText', label: 'Culoare text în câmpuri', value: '#0f1729' },
  {
    key: 'fieldPlaceholder',
    label: 'Culoare text sugestie (placeholder)',
    value: '#94a3b8'
  },
  { key: 'titles', label: 'Culoare titluri', value: '#0f1729' },
  { key: 'text', label: 'Culoare text', value: '#64748b' },
  {
    key: 'availableSlot',
    label: 'Fundal interval disponibil',
    value: '#eff4ff'
  },
  {
    key: 'selectedSlot',
    label: 'Fundal interval selectat',
    value: '#2f6bff'
  }],

  divider: [{ key: 'line', label: 'Culoare linie', value: '#e2e8f0' }],
  timer: [
  { key: 'bg', label: 'Culoare fundal', value: '#0f1729' },
  { key: 'text', label: 'Culoare cifre', value: '#ffffff' },
  { key: 'labels', label: 'Culoare scris (zile, ore…)', value: '#64748b' }],

  spacer: [{ key: 'bg', label: 'Culoare fundal', value: '#f8fafc' }],
  icon: [{ key: 'icon', label: 'Culoare iconiță', value: '#2f6bff' }],
  progress: [
  { key: 'done', label: 'Culoare progres parcurs', value: '#2f6bff' },
  { key: 'remaining', label: 'Culoare progres rămas', value: '#cbd5e1' }],

  social: [{ key: 'icon', label: 'Culoare iconițe', value: '#e2e8f0' }],
  popup: [{ key: 'bg', label: 'Culoare fundal', value: '#ffffff' }],
  menu: [
  { key: 'bg', label: 'Culoare fundal', value: 'transparent' },
  { key: 'text', label: 'Culoare scris', value: '#334155' },
  { key: 'hover', label: 'Culoare scris la hover', value: '#2f6bff' },
  { key: 'submenuBg', label: 'Culoare fundal sub-meniu', value: '#ffffff' }]

};

/** Elementele cu conținut editabil și eticheta câmpului de text */
export const elementTextFields: Partial<
  Record<ElementKind, {label: string;multiline: boolean;value: string;}>> =
{
  headline: {
    label: 'Titlu',
    multiline: false,
    value: 'Titlul paginii tale'
  },
  text: {
    label: 'Text',
    multiline: true,
    value:
    'Scrie aici textul paginii tale. Poți edita oricând conținutul din panoul de setări.'
  },
  bulleted: {
    label: 'Listă (câte un rând pentru fiecare punct)',
    multiline: true,
    value: 'Primul beneficiu\nAl doilea beneficiu\nAl treilea beneficiu'
  },
  contentBox: {
    label: 'Text în casetă',
    multiline: true,
    value: 'Grupează conținut într-o casetă.'
  },
  button: { label: 'Text pe buton', multiline: false, value: 'Vreau acces acum' },
  checkbox: {
    label: 'Text lângă casetă',
    multiline: false,
    value: 'Sunt de acord cu termenii și condițiile'
  },
  formInput: {
    label: 'Text sugestie (placeholder)',
    multiline: false,
    value: 'Adresa ta de email'
  },
  recaptcha: { label: 'Text', multiline: false, value: 'Nu sunt robot' }
};

/** Meniul are tipografie, dar conținutul se editează prin lista de linkuri */
export const hasMenuContent = (kind: ElementKind) => kind === 'menu';

/** Elementele care au setări de tipografie */
export const hasTypography = (kind: ElementKind) =>
Boolean(elementTextFields[kind]) || kind === 'menu';

/** Stilul implicit al unui element nou */
export function defaultStyle(kind: ElementKind): ElementStyle {
  const colors: Record<string, string> = {};
  elementColorFields[kind].forEach((field) => {
    // doar elementele cu text pornesc cu fundal transparent;
    // media (poză, video, carousel, audio) își păstrează fundalul propriu
    const transparentBg =
    field.key === 'bg' && hasTypography(kind) && kind !== 'button';
    colors[field.key] = transparentBg ? 'transparent' : field.value;
  });
  const isHeadline = kind === 'headline';
  return {
    text: elementTextFields[kind]?.value ?? '',
    // imaginea pornește centrată
    align: kind === 'image' || kind === 'menu' ? 'center' : 'left',
    // grosimea implicită vine din „Font style”, nu din butonul de bold
    bold: false,
    italic: false,
    underline: false,
    strike: false,
    typo: {
      fontFamily: '',
      fontSize: isHeadline ? 30 : 16,
      lineHeight: isHeadline ? 38 : 26,
      letterSpacing: 0,
      fontStyle: isHeadline || kind === 'button' ? '700' : '400'
    },
    typoMobile: {},
    padTop: 0,
    padBottom: 0,
    padLeft: 0,
    padRight: 0,
    marTop: 0,
    marBottom: 0,
    marLeft: 0,
    marRight: 0,
    colors,
    ...(kind === 'timer' ?
    {
      timerType: 'fixed' as const,
      timerDate: '2026-09-12',
      timerTime: '14:25',
      timerDelay: { days: 0, hours: 1, minutes: 0, seconds: 0 },
      timerAction: 'nothing' as const,
      timerRedirectUrl: '',
      timerLabels: true
    } :
    {}),
    ...(kind === 'checkbox' ?
    {
      checkboxMessage: 'Trebuie să bifezi această căsuță',
      checkboxOptional: false
    } :
    {}),
    ...(kind === 'bulleted' ?
    { bulletSpacing: 0, bulletIcon: 'dot', bulletSize: 16 } :
    {}),
    ...(kind === 'image' ?
    {
      imageSrc: '',
      imageName: '',
      imageAlt: '',
      imageAction: 'none' as const,
      imageActionUrl: '',
      imageFull: false,
      imageSize: 320,
      imageBlur: 0
    } :
    {}),
    ...(kind === 'video' ?
    {
      videoType: 'link' as const,
      videoUrl: '',
      videoEmbed: '',
      videoFileName: '',
      videoAutoplay: false,
      videoControls: true,
      videoRatio: '16:9' as const
    } :
    {}),
    ...(kind === 'form' ?
    {
      formFields: defaultFormFields(),
      formBorderMode: 'full' as const,
      formBorderStyle: 'solid' as const,
      formBorderWidth: 1,
      formRadius: 12,
      formShadow: 'none',
      formButtonPosition: 'full' as const,
      formButtonText: 'Trimite',
      formButtonSubtext: '',
      formButtonIcon: '',
      formSuccessMessage: 'Îți mulțumim! Te contactăm în cel mai scurt timp.'
    } :
    {}),
    ...(kind === 'button' ?
    {
      btnSubtext: '',
      btnSubTypo: {
        fontFamily: '',
        fontSize: 13,
        lineHeight: 18,
        letterSpacing: 0,
        fontStyle: '400'
      },
      btnShadow: 'none'
    } :
    {}),
    ...(kind === 'menu' ? { menuItems: defaultMenuItems() } : {}),
    ...(kind === 'divider' ?
    {
      lineStyle: 'solid' as const,
      lineWidth: 1,
      radius: [0, 0, 0, 0] as [number, number, number, number]
    } :
    {}),
    visibleDesktop: true,
    visibleMobile: true
  };
}

export interface ElementNode {
  id: string;
  type: 'element';
  kind: ElementKind;
  /** Conținut, aliniere, spațiere și culori */
  style?: ElementStyle;
  /** Doar pentru calendar: id-ul calendarului activ selectat */
  calendarId?: string | null;
}

/** Umbrele disponibile pentru secțiuni și row-uri */
export const shadowOptions: Array<{key: string;label: string;css: string;}> =
[
{ key: 'none', label: 'Fără umbră', css: 'none' },
{
  key: 'soft',
  label: 'Umbră fină',
  css: '0 4px 12px rgba(15, 23, 41, 0.08)'
},
{
  key: 'mid',
  label: 'Umbră medie',
  css: '0 10px 24px rgba(15, 23, 41, 0.12)'
},
{
  key: 'hard',
  label: 'Umbră puternică',
  css: '0 12px 20px rgba(15, 23, 41, 0.28)'
},
{
  key: 'far',
  label: 'Umbră depărtată',
  css: '0 28px 48px rgba(15, 23, 41, 0.18)'
},
{
  key: 'blurry',
  label: 'Umbră difuză',
  css: '0 18px 60px rgba(15, 23, 41, 0.22)'
},
{
  key: 'dark',
  label: 'Închisă cu accent',
  css: '0 14px 30px rgba(15, 23, 41, 0.35), 0 1px 0 rgba(255,255,255,0.4) inset'
},
{
  key: 'inner',
  label: 'Umbră interioară',
  css: 'inset 0 2px 12px rgba(15, 23, 41, 0.14)'
}];


/** Stilul unei secțiuni sau al unui row */
export interface ContainerStyle {
  bgColor: string;
  bgImage: string;
  bgVideo: string;
  padTop: number;
  padBottom: number;
  padLeft: number;
  padRight: number;
  marTop: number;
  marBottom: number;
  marLeft: number;
  marRight: number;
  shadow: string;
  /** Conturul containerului: fără / complet / doar linia de jos */
  borderMode?: 'none' | 'full' | 'bottom' | 'top' | 'topBottom';
  borderStyle?: 'solid' | 'dotted' | 'dashed';
  borderWidth?: number;
  borderRadius?: number;
  borderColor?: string;
  visibleDesktop: boolean;
  visibleMobile: boolean;
}

/**
 * Factorul cu care se aplică spațierea exterioară pe orizontală.
 * Calibrat astfel încât valoarea 100 din panou să însemne același inset
 * ca în editorul de referință.
 */
export const H_MARGIN_SCALE = 2.6;

/**
 * Factorul cu care se aplică spațierea interioară pe verticală, astfel încât
 * valoarea 0 să lipească textul de marginea containerului, iar valorile mici
 * să producă aceeași grosime ca în editorul de referință.
 */
export const V_PADDING_SCALE = 3;

export const defaultContainerStyle = (kind: 'section' | 'row'): ContainerStyle => ({
  // row-urile pornesc transparent, ca să preia fundalul secțiunii
  bgColor: kind === 'row' ? 'transparent' : '#ffffff',
  bgImage: '',
  bgVideo: '',
  // grosimea implicită stă pe secțiune; row-ul nu adaugă spațiu propriu,
  // ca valorile din panou să corespundă exact cu înălțimea reală a secțiunii
  padTop: kind === 'section' ? 12 : 0,
  padBottom: kind === 'section' ? 12 : 0,
  padLeft: 0,
  padRight: 0,
  marTop: 0,
  marBottom: 0,
  marLeft: kind === 'row' ? 48 : 0,
  marRight: kind === 'row' ? 48 : 0,
  shadow: 'none',
  borderMode: 'none',
  borderStyle: 'solid',
  borderWidth: 1,
  borderRadius: 0,
  borderColor: 'transparent',
  visibleDesktop: true,
  visibleMobile: true
});

export interface RowNode {
  id: string;
  type: 'row';
  style?: ContainerStyle;
  /** Numărul de coloane: 1, 2, 3, 4, 6 (2x3) sau 8 (2x4) */
  columns: 1 | 2 | 3 | 4 | 6 | 8;
  /** Conținutul fiecărei celule: elemente sau row-uri imbricate */
  cells: Array<Array<RowNode | ElementNode>>;
}

export interface SectionNode {
  id: string;
  type: 'section';
  style?: ContainerStyle;
  children: RowNode[];
}

/** Ce se trage din paletă în canvas */
export type DragPayload =
{kind: 'element';element: ElementKind;} |
{kind: 'row';columns: RowNode['columns'];} |
{kind: 'section';}
/** Mutarea unui nod deja existent în pagină */ |
{kind: 'move';node: SectionNode | RowNode | ElementNode;};

/** Verifică dacă un id se află în interiorul unui nod (pentru a nu muta un nod în el însuși) */
export function containsId(
node: SectionNode | RowNode | ElementNode,
id: string)
: boolean {
  if (node.id === id) return true;
  if (node.type === 'section')
  return node.children.some((row) => containsId(row, id));
  if (node.type === 'row')
  return node.cells.some((cell) =>
  cell.some((child) => containsId(child, id))
  );
  return false;
}

let counter = 0;
const nextId = (prefix: string) => `${prefix}-${Date.now()}-${counter++}`;

export const elementLabels: Record<ElementKind, string> = {
  text: 'Text',
  headline: 'Headline',
  bulleted: 'Listă',
  contentBox: 'Content box',
  image: 'Poză',
  video: 'Video',
  audio: 'Audio',
  carousel: 'Carousel',
  form: 'Form',
  formInput: 'Form input',
  button: 'Buton',
  checkbox: 'Checkbox',
  recaptcha: 'reCAPTCHA',
  calendar: 'Calendar',
  divider: 'Linie',
  timer: 'Timer',
  spacer: 'Spațiu',
  icon: 'Icon',
  progress: 'Progress bar',
  social: 'Social',
  menu: 'Menu',
  popup: 'Popup'
};

export const createElement = (kind: ElementKind): ElementNode => ({
  id: nextId('el'),
  type: 'element',
  kind,
  style: defaultStyle(kind),
  ...(kind === 'calendar' ? { calendarId: null } : {})
});

/** Caută un element după id în tot arborele */
export function findElement(
sections: SectionNode[],
id: string)
: ElementNode | null {
  const walkCell = (nodes: Array<RowNode | ElementNode>): ElementNode | null => {
    for (const node of nodes) {
      if (node.type === 'element') {
        if (node.id === id) return node;
      } else {
        for (const cell of node.cells) {
          const found = walkCell(cell);
          if (found) return found;
        }
      }
    }
    return null;
  };

  for (const section of sections) {
    for (const row of section.children) {
      for (const cell of row.cells) {
        const found = walkCell(cell);
        if (found) return found;
      }
    }
  }
  return null;
}

/** Caută orice nod (secțiune, row sau element) după id */
export function findNode(
sections: SectionNode[],
id: string)
: SectionNode | RowNode | ElementNode | null {
  const walkCell = (
  nodes: Array<RowNode | ElementNode>)
  : RowNode | ElementNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.type === 'row') {
        for (const cell of node.cells) {
          const found = walkCell(cell);
          if (found) return found;
        }
      }
    }
    return null;
  };

  for (const section of sections) {
    if (section.id === id) return section;
    for (const row of section.children) {
      if (row.id === id) return row;
      for (const cell of row.cells) {
        const found = walkCell(cell);
        if (found) return found;
      }
    }
  }
  return null;
}

/** Actualizează stilul unei secțiuni sau al unui row */
export function updateContainerStyle(
sections: SectionNode[],
id: string,
patch: Partial<ContainerStyle>)
: SectionNode[] {
  const mapRow = (row: RowNode): RowNode => {
    const next: RowNode = {
      ...row,
      cells: row.cells.map((cell) =>
      cell.map((child) => child.type === 'row' ? mapRow(child) : child)
      )
    };
    if (row.id !== id) return next;
    return {
      ...next,
      style: { ...defaultContainerStyle('row'), ...row.style, ...patch }
    };
  };

  return sections.map((section) => {
    const next: SectionNode = {
      ...section,
      children: section.children.map(mapRow)
    };
    if (section.id !== id) return next;
    return {
      ...next,
      style: { ...defaultContainerStyle('section'), ...section.style, ...patch }
    };
  });
}

/** Actualizează stilul (conținut, aliniere, spațiere, culori) unui element */
export function updateElementStyle(
sections: SectionNode[],
id: string,
patch: Partial<ElementStyle> & {calendarId?: string | null;})
: SectionNode[] {
  const mapCell = (
  nodes: Array<RowNode | ElementNode>)
  : Array<RowNode | ElementNode> =>
  nodes.map((node) => {
    if (node.type === 'row') return { ...node, cells: node.cells.map(mapCell) };
    if (node.id !== id) return node;
    const { calendarId, ...stylePatch } = patch;
    const base = node.style ?? defaultStyle(node.kind);
    // text schimbat din panou = se pierde formatarea pe bucăți
    if (stylePatch.text !== undefined && stylePatch.html === undefined)
    stylePatch.html = '';
    return {
      ...node,
      ...(calendarId !== undefined ? { calendarId } : {}),
      style: {
        ...base,
        ...stylePatch,
        colors: { ...base.colors, ...(stylePatch.colors ?? {}) },
        typo: { ...base.typo, ...(stylePatch.typo ?? {}) },
        typoMobile: {
          ...base.typoMobile,
          ...(stylePatch.typoMobile ?? {})
        }
      }
    };
  });

  return sections.map((section) => ({
    ...section,
    children: section.children.map((row) => ({
      ...row,
      cells: row.cells.map(mapCell)
    }))
  }));
}

/** True dacă există cel puțin un element calendar fără calendar selectat */
export function hasUnconfiguredCalendar(sections: SectionNode[]): boolean {
  const checkCell = (nodes: Array<RowNode | ElementNode>): boolean =>
  nodes.some((node) =>
  node.type === 'row' ?
  node.cells.some(checkCell) :
  node.kind === 'calendar' && !node.calendarId
  );

  return sections.some((section) =>
  section.children.some((row) => row.cells.some(checkCell))
  );
}

export const createRow = (columns: RowNode['columns'] = 1): RowNode => ({
  id: nextId('row'),
  type: 'row',
  columns,
  style: defaultContainerStyle('row'),
  cells: Array.from({ length: columns }, () => [])
});

export const createSection = (children?: RowNode[]): SectionNode => ({
  id: nextId('sec'),
  type: 'section',
  style: defaultContainerStyle('section'),
  children: children ?? []
});

/** Un row cu un singur element, folosit de șablonul de pop-up */
const rowWith = (element: ElementNode): RowNode => {
  const row = createRow(1);
  row.cells[0] = [element];
  return row;
};

/** Șablonul implicit al unui pop-up nou: titlu, email, buton și nota de siguranță */
export const defaultPopupSections = (): SectionNode[] => {
  const headline = createElement('headline');
  headline.style = {
    ...headline.style!,
    text: 'Abonează-te gratuit',
    align: 'center',
    typo: {
      ...headline.style!.typo,
      fontStyle: '300',
      fontSize: 40,
      lineHeight: 50
    },
    colors: { ...headline.style!.colors, text: '#334155' }
  };

  const input = createElement('formInput');
  input.style = {
    ...input.style!,
    text: 'Email',
    marTop: 18
  };

  const button = createElement('button');
  button.style = {
    ...button.style!,
    text: 'Abonează-te chiar acum',
    align: 'center',
    marTop: 12
  };

  const note = createElement('text');
  note.style = {
    ...note.style!,
    text: 'Securitate 100% a adresei tale de email',
    align: 'center',
    marTop: 12,
    typo: { ...note.style!.typo, fontSize: 15, lineHeight: 22 },
    colors: { ...note.style!.colors, text: '#64748b' }
  };

  return [createSection([rowWith(headline), rowWith(input), rowWith(button), rowWith(note)])];
};

/** Creează un element cu stilul de bază peste care se aplică modificările date */
export const styled = (
kind: ElementKind,
patch: Partial<ElementStyle>)
: ElementNode => {
  const node = createElement(kind);
  const base = node.style!;
  node.style = {
    ...base,
    ...patch,
    typo: { ...base.typo, ...(patch.typo ?? {}) },
    colors: { ...base.colors, ...(patch.colors ?? {}) }
  };
  return node;
};

/** Row cu conținut și stil de container personalizat */
export const rowOf = (
children: Array<Array<RowNode | ElementNode>>,
style?: Partial<ContainerStyle>)
: RowNode => {
  const columns = children.length as RowNode['columns'];
  const row = createRow(columns);
  row.cells = children;
  row.style = { ...row.style!, ...style };
  return row;
};

export const sectionOf = (
children: RowNode[],
style?: Partial<ContainerStyle>)
: SectionNode => {
  const section = createSection(children);
  section.style = { ...section.style!, ...style };
  return section;
};

const INK = '#0f1729';
const PANEL = '#f2f6ff';
const BLUE = '#2f6bff';
const MUTED = '#5b6478';

/** Titlu Poppins, folosit în tot șablonul */
const title = (
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
    lineHeight: Math.round(size * 1.2),
    letterSpacing: size > 40 ? -1 : 0,
    fontStyle: '800'
  },
  colors: { text: color }
});

/** Paragraf Poppins */
const para = (
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

/** Card alb cu titlu și descriere, folosit la beneficii și la FAQ */
const card = (heading: string, body: string, accent = false): RowNode =>
rowOf(
  [
  [
  title(heading, 20, accent ? '#ffffff' : INK, 'left'),
  para(body, 15, accent ? '#dbe6ff' : MUTED, 'left')]],


  {
    bgColor: accent ? BLUE : '#ffffff',
    borderRadius: 14,
    borderMode: 'full',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: accent ? BLUE : '#dfe7f7',
    padTop: 14,
    padBottom: 14,
    padLeft: 34,
    padRight: 34,
    marLeft: 0,
    marRight: 0
  }
);

/** Card numerotat: cifră mare, titlu scurt și descriere */
const numberedCard = (
number: string,
heading: string,
body: string,
accent = false)
: RowNode =>
rowOf(
  [
  [
  title(number, 44, accent ? '#ffffff' : BLUE, 'left'),
  title(heading, 18, accent ? '#ffffff' : INK, 'left'),
  para(body, 16, accent ? '#dbe6ff' : MUTED, 'left')]],


  {
    bgColor: accent ? BLUE : '#ffffff',
    borderRadius: 16,
    padTop: 14,
    padBottom: 14,
    padLeft: 46,
    padRight: 46,
    marLeft: 0,
    marRight: 0
  }
);

/** Coloană de statistică: cifră mare albastră + etichetă */
const stat = (value: string, label: string) => [
title(value, 42, BLUE, 'center'),
para(label, 14, MUTED, 'center')];


/**
 * Șablonul cu care pornește o pagină nouă:
 * landing page de fitness, negru cu galben, construit exclusiv din
 * elementele editorului, deci fiecare bucată se poate edita din panou.
 */
export const defaultPageSections = (): SectionNode[] => {
  const heroImage = styled('image', {
    imageFull: true,
    imageSrc: "/978cdcd2-78ed-43ba-bcec-ea5a318911a4.jpg",

    imageAlt: 'Laptop și caiet pregătite pentru lecțiile de engleză',
    colors: { bg: PANEL }
  });

  const bigCta = (text: string, subtext: string) =>
  styled('button', {
    text,
    align: 'center',
    marTop: 10,
    btnSubtext: subtext,
    typo: {
      fontFamily: 'Poppins',
      fontSize: 20,
      lineHeight: 28,
      letterSpacing: 0.5,
      fontStyle: '800'
    },
    colors: { bg: BLUE, text: '#ffffff', subtext: '#d7e3ff' }
  });

  const list = (items: string[]) =>
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
    colors: { text: INK, bullet: BLUE }
  });

  const form = styled('form', {
    colors: {
      field: '#ffffff',
      fieldText: INK,
      border: '#dfe7f7',
      buttonBg: BLUE,
      buttonText: '#ffffff'
    },
    formButtonText: 'VREAU PACHETUL COMPLET · 137 RON'
  });

  return [
  // bară de anunț
  sectionOf(
    [
    rowOf(
      [
      [
      title(
        'IMPORTANT! Locul tau la webinar este confirmat si va ajunge pe email! (Iata ce urmeaza)',
        18,
        '#ffffff'
      ),
      para(
        'OFERTA SPECIALA DOAR PENTRU PARTICIPANTII LA WEBINAR',
        14,
        '#d7e3ff'
      )]],


      { marLeft: 24, marRight: 24 }
    )],

    { bgColor: BLUE, padTop: 5, padBottom: 5 }
  ),

  // hero
  sectionOf(
    [
    rowOf(
      [
      [
      title(
        'AI WEBINARUL. ACUM IA SI PACHETUL COMPLET CU DOAR 1010 RON  ·  137 RON',
        17,
        BLUE
      )]],


      {
        bgColor: PANEL,
        borderRadius: 40,
        padTop: 6,
        padBottom: 6,
        padLeft: 26,
        padRight: 26,
        marLeft: 90,
        marRight: 90
      }
    ),
    rowOf(
      [
      [
      title(
        'Pune fundamentul englezei tale INAINTE sa vii la webinar,',
        48,
        INK
      ),
      title('CU LECTII VIDEO, MATERIALE SI 3 SESIUNI LIVE.', 48, BLUE)]],


      { marTop: 14, marLeft: 60, marRight: 60 }
    ),
    rowOf([[heroImage]], { marTop: 16, marLeft: 96, marRight: 96 })],

    { bgColor: '#ffffff', padTop: 14, padBottom: 16 }
  ),

  // statistici
  sectionOf(
    [
    rowOf(
      [
      stat('12', 'Lectii video la cerere'),
      stat('3', 'Sesiuni live cu profesor'),
      stat('40+', 'Pagini de materiale'),
      stat('137 RON', 'In loc de 1010 RON')],

      { marLeft: 34, marRight: 34 }
    )],

    { bgColor: PANEL, padTop: 10, padBottom: 10 }
  ),

  // ce contine pachetul
  sectionOf(
    [
    rowOf([[title('CE PRIMESTI IN PACHETUL COMPLET', 40)]], {
      marLeft: 40,
      marRight: 40
    }),
    rowOf(
      [
      [
      para(
        'Totul este pregatit inainte de webinar, ca sa ajungi acolo cu bazele deja puse.',
        17
      )]],


      { marTop: 4, marLeft: 70, marRight: 70 }
    ),
    rowOf(
      [
      [
      card(
        '12 lectii video',
        'Structurate pe niveluri, de la pronuntie si vocabular de baza pana la conversatie fluenta. Le urmaresti cand vrei, de pe telefon sau laptop.'
      )],

      [
      card(
        '3 sesiuni live',
        'Intalniri cu profesorul, in grup restrans, unde exersezi conversatia si primesti corectura in timp real.',
        true
      )],

      [
      card(
        'Materiale scrise',
        'Peste 40 de pagini cu exercitii, liste de vocabular si fise de gramatica pe care le poti descarca si printa.'
      )]],


      { marTop: 12, marLeft: 60, marRight: 60 }
    )],

    { bgColor: '#ffffff', padTop: 16, padBottom: 16 }
  ),

  // continut detaliat
  sectionOf(
    [
    rowOf(
      [
      [
      title('DE CE ACUM, INAINTE DE WEBINAR?', 15, BLUE, 'left'),
      title(
        'Vii la webinar pregatit, nu de la zero.',
        38,
        INK,
        'left'
      ),
      para(
        'Participantii care intra in webinar cu bazele puse inteleg de doua ori mai repede si pun intrebarile potrivite. Pachetul iti da exact acel avans.',
        17,
        MUTED,
        'left'
      ),
      list([
      'Pronuntie corecta din prima, fara obiceiuri gresite',
      'Vocabularul de care ai nevoie in primele conversatii',
      'Structuri de gramatica explicate simplu, cu exemple',
      'Acces pe viata la toate materialele si inregistrarile']
      )],

      [heroImage]],

      { marTop: 8, marLeft: 34, marRight: 34 }
    )],

    { bgColor: PANEL, padTop: 14, padBottom: 14 }
  ),

  // diferenta webinar vs pachet
  sectionOf(
    [
    rowOf([[title('CE DIFERENTA ESTE INTRE WEBINAR SI PACHET?', 38)]], {
      marLeft: 40,
      marRight: 40
    }),
    rowOf(
      [
      [
      rowOf(
        [
        [
        title('WEBINARUL (GRATUIT)', 22, INK, 'left'),
        para(
          'O sesiune live unde iti explicam strategia completa in 12 saptamani, metodele noastre si cum ajuta cursantii nostri sa ajunga la fluenta. Webinarul este suficient ca sa intelegi PRINCIPIUL.',
          16,
          MUTED,
          'left'
        ),
        styled('contentBox', {
          text: 'Webinarul te informeaza.',
          align: 'center',
          marTop: 14,
          typo: {
            fontFamily: 'Poppins',
            fontSize: 18,
            lineHeight: 28,
            letterSpacing: 0,
            fontStyle: '700i'
          },
          colors: {
            bg: PANEL,
            border: PANEL,
            title: INK,
            text: INK
          }
        })]],


        {
          bgColor: '#ffffff',
          borderRadius: 18,
          borderMode: 'full',
          borderStyle: 'solid',
          borderWidth: 1,
          borderColor: '#dfe7f7',
          padTop: 16,
          padBottom: 16,
          padLeft: 34,
          padRight: 34,
          marLeft: 0,
          marRight: 0
        }
      )],

      [
      rowOf(
        [
        [
        title('PACHETUL (137 RON) · RECOMANDAT', 22, '#ffffff', 'left'),
        para(
          '3 module video cu profesorii, 3 sesiuni LIVE, PDF-uri descarcabile, exercitii practice, acces pe viata la tot. Webinarul iti spune CE sa faci. Pachetul iti da TOATA fundatia ca sa poti face.',
          16,
          '#dbe6ff',
          'left'
        ),
        styled('contentBox', {
          text: 'Pachetul te transforma.',
          align: 'center',
          marTop: 14,
          typo: {
            fontFamily: 'Poppins',
            fontSize: 18,
            lineHeight: 28,
            letterSpacing: 0,
            fontStyle: '700i'
          },
          colors: {
            bg: '#4d84ff',
            border: '#4d84ff',
            title: '#ffffff',
            text: '#ffffff'
          }
        })]],


        {
          bgColor: BLUE,
          borderRadius: 18,
          padTop: 16,
          padBottom: 16,
          padLeft: 34,
          padRight: 34,
          marLeft: 0,
          marRight: 0
        }
      )]],


      { marTop: 12, marLeft: 60, marRight: 60 }
    ),
    rowOf(
      [
      [
      bigCta(
        'DA! VREAU PACHETUL CU DOAR 137 RON →',
        'Acces imediat, pe email, dupa plata'
      )]],


      { marTop: 14, marLeft: 90, marRight: 90 }
    )],

    { bgColor: '#ffffff', padTop: 16, padBottom: 16 }
  ),

  // ce primesti in plus
  sectionOf(
    [
    rowOf([[title('CE PRIMESTI IN PLUS FATA DE MATERIALELE STANDARD', 38)]], {
      marLeft: 40,
      marRight: 40
    }),
    rowOf(
      [
      [
      para(
        'Pachetul nu este doar teorie. Este un kit complet. Iata ce primesti in plus:',
        17
      )]],


      { marTop: 4, marLeft: 70, marRight: 70 }
    ),
    rowOf(
      [
      [
      numberedCard(
        '01',
        'VIDEO-URI DETALIATE CU PROFESORII NOSTRI PE FIECARE LECTIE',
        'Ne vezi explicand pe ecran, cu exemple concrete, cu greseli pe care oamenii le fac la fiecare pas si cu trucuri practice pe care le-am dezvoltat in anii de lucru cu peste 1500 de cursanti. Intelegi altfel cand vezi si auzi.'
      )],

      [
      numberedCard(
        '02',
        'LECTII BONUS CARE NU SUNT IN CURSURILE STANDARD',
        'Cele 10 expresii de zi cu zi pe care romanii le traduc gresit. Cum eviti „romgleza” care te da de gol. Cele 20 de „false friends” (cuvinte care te pacalesc). Toate bonusuri exclusive.'
      )]],


      { marTop: 12, marLeft: 90, marRight: 90 }
    ),
    rowOf(
      [
      [
      numberedCard(
        '03',
        'PDF-URI DESCARCABILE PENTRU FIECARE MODUL',
        'Le printezi, le ai cu tine in geanta, le citesti in metrou, le ai mereu la indemana. Nu mai trebuie sa cauti prin video-uri sa iti amintesti o regula.'
      )],

      [
      numberedCard(
        '24/7',
        'CEL MAI PUTERNIC BONUS: 3 SESIUNI LIVE CU PROFESORII',
        'Acesta este cel mai valoros bonus din pachet. Profesorii English Hub sunt cu tine in direct, iti raspund la intrebari, iti corecteaza pronuntia si iti arata EXACT ce ai de facut pentru nivelul tau. Este ca si cum ai avea un profesor privat pentru 3 ore intregi — la o fractiune din pret.',
        true
      )]],


      { marTop: 10, marLeft: 90, marRight: 90 }
    )],

    { bgColor: PANEL, padTop: 16, padBottom: 16 }
  ),

  // de ce doar 137 RON
  sectionOf(
    [
    rowOf([[title('DE CE DOAR 137 RON?', 40)]], {
      marLeft: 40,
      marRight: 40
    }),
    rowOf(
      [
      [
      rowOf(
        [
        [
        rowOf([[title('ENGLISH HUB', 15, '#d7e3ff')]], {
          bgColor: '#4d84ff',
          borderRadius: 12,
          padTop: 5,
          padBottom: 5,
          padLeft: 24,
          padRight: 24,
          marLeft: 30,
          marRight: 30
        }),
        title('English\nStarter Pack', 40, '#ffffff'),
        styled('divider', {
          marTop: 8,
          marBottom: 8,
          marLeft: 60,
          marRight: 60,
          lineStyle: 'solid',
          lineWidth: 2,
          colors: { line: '#7ea6ff' }
        }),
        para('3 Module Video', 15, '#e2ebff'),
        para('3 Sesiuni LIVE', 15, '#e2ebff'),
        para('PDF-uri Descarcabile', 15, '#e2ebff'),
        rowOf(
          [
          [
          para('1010 RON', 15, '#8a93a6'),
          title('137 RON', 34, BLUE)]],


          {
            bgColor: '#ffffff',
            borderRadius: 14,
            padTop: 6,
            padBottom: 6,
            padLeft: 24,
            padRight: 24,
            marTop: 12,
            marLeft: 40,
            marRight: 40
          }
        )]],


        {
          bgColor: BLUE,
          borderRadius: 18,
          padTop: 12,
          padBottom: 12,
          padLeft: 20,
          padRight: 20,
          marLeft: 0,
          marRight: 0
        }
      )],

      [
      para(
        'Aceasta oferta nu este disponibila public. Nu o vei gasi pe website-ul nostru. Nu o vei gasi in cursurile standard. Nu o vei gasi nicaieri altundeva.',
        17,
        MUTED,
        'left'
      ),
      para(
        'Pretul din cursurile noastre principale este mult mai mare, pentru ca acolo incluse sunt 20-24 de saptamani de lucru cu profesori, comunitate permanenta si garantia rezultatului.',
        17,
        MUTED,
        'left'
      ),
      para(
        'Dar tu tocmai te-ai inscris la webinar. Ai facut un pas. Ai aratat ca esti serios si vrei sa inveti engleza cu adevarat. Vreau sa te recompensez pentru asta.',
        17,
        MUTED,
        'left'
      ),
      para(
        '137 RON este pretul meu de „multumesc ca ai actionat”. Este pretul pe care il oferim o singura data, doar pe aceasta pagina, doar in urmatoarele 48 de ore. Cand inchizi pagina sau cand expira timer-ul, pretul revine la valoarea normala si oferta dispare.',
        17,
        MUTED,
        'left'
      ),
      styled('contentBox', {
        text: 'Nu trebuie sa te decizi pentru totdeauna.\nTrebuie doar sa te decizi acum.',
        align: 'left',
        marTop: 12,
        typo: {
          fontFamily: 'Poppins',
          fontSize: 22,
          lineHeight: 32,
          letterSpacing: 0,
          fontStyle: '700'
        },
        colors: {
          bg: '#ffffff',
          border: BLUE,
          title: INK,
          text: INK
        }
      })]],


      { marTop: 12, marLeft: 24, marRight: 24 }
    )],

    { bgColor: PANEL, padTop: 16, padBottom: 16 }
  ),

  // oferta + formular
  sectionOf(
    [
    rowOf([[title('OFERTA VALABILA DOAR PANA LA WEBINAR', 38, '#ffffff')]], {
      marLeft: 40,
      marRight: 40
    }),
    rowOf(
      [
      [
      para(
        'Pachetul complet costa 1010 RON. Pentru participantii la webinar, astazi, 137 RON.',
        18,
        '#d7e3ff'
      )]],


      { marTop: 4, marLeft: 70, marRight: 70 }
    ),
    rowOf(
      [
      [
      form,
      bigCta(
        'VREAU PACHETUL COMPLET · 137 RON',
        'Plata securizata · acces imediat pe email'
      )]],


      {
        bgColor: '#ffffff',
        borderRadius: 18,
        padTop: 8,
        padBottom: 8,
        padLeft: 28,
        padRight: 28,
        marTop: 12,
        marLeft: 78,
        marRight: 78
      }
    )],

    { bgColor: BLUE, padTop: 16, padBottom: 16 }
  ),

  // garantie si testimonial
  sectionOf(
    [
    rowOf(
      [
      [
      title(
        '„Am inteles mai mult in 12 lectii decat in doi ani de scoala.”',
        30,
        INK
      ),
      para(
        'Explicatiile sunt scurte si clare, iar sesiunile live m-au facut sa vorbesc fara sa imi mai fie teama de greseli. — Ioana R., cursanta',
        16
      )]],


      { marLeft: 60, marRight: 60 }
    ),
    rowOf(
      [
      [
      para(
        'Garantie 14 zile: daca simti ca nu e pentru tine, iti returnam integral banii, fara intrebari.',
        15,
        BLUE
      )]],


      {
        bgColor: PANEL,
        borderRadius: 12,
        padTop: 6,
        padBottom: 6,
        padLeft: 24,
        padRight: 24,
        marTop: 12,
        marLeft: 80,
        marRight: 80
      }
    )],

    { bgColor: '#ffffff', padTop: 14, padBottom: 14 }
  ),

  // footer
  sectionOf(
    [
    rowOf(
      [
      [para('© Cursuri de engleza · Toate drepturile rezervate', 14, '#8a93a6', 'left')],
      [para('Termeni si conditii · Politica de confidentialitate', 14, '#8a93a6', 'right')]],

      { marLeft: 34, marRight: 34 }
    )],

    { bgColor: '#0f1729', padTop: 6, padBottom: 6 }
  )];

};

/** Transformă un payload într-un row gata de inserat într-o secțiune */
export const payloadToRow = (payload: DragPayload): RowNode => {
  if (payload.kind === 'move') {
    if (payload.node.type === 'row') return payload.node;
    if (payload.node.type === 'element') {
      const row = createRow(1);
      row.cells[0] = [payload.node];
      return row;
    }
    return payload.node.children[0] ?? createRow(1);
  }
  if (payload.kind === 'row') return createRow(payload.columns);
  if (payload.kind === 'element') {
    const row = createRow(1);
    row.cells[0] = [createElement(payload.element)];
    return row;
  }
  return createRow(1);
};

/** Transformă un payload într-o secțiune completă (auto-wrapping) */
export const payloadToSection = (payload: DragPayload): SectionNode => {
  if (payload.kind === 'move' && payload.node.type === 'section')
  return payload.node;
  if (payload.kind === 'section') {
    return createSection([createRow(1)]);
  }
  return createSection([payloadToRow(payload)]);
};

/** Ce se poate pune într-o celulă: element sau row imbricat */
export const payloadToCellNode = (
payload: DragPayload)
: RowNode | ElementNode => {
  if (payload.kind === 'move')
  return payload.node.type === 'section' ?
  payload.node.children[0] ?? createRow(1) :
  payload.node;
  if (payload.kind === 'element') return createElement(payload.element);
  if (payload.kind === 'row') return createRow(payload.columns);
  // o secțiune trasă într-o celulă devine un row simplu
  return createRow(1);
};

const cloneRow = (row: RowNode): RowNode => ({
  ...row,
  id: nextId('row'),
  cells: row.cells.map((cell) =>
  cell.map((node) =>
  node.type === 'row' ? cloneRow(node) : { ...node, id: nextId('el') }
  )
  )
});

export const duplicateNode = (
node: SectionNode | RowNode | ElementNode)
: SectionNode | RowNode | ElementNode => {
  if (node.type === 'section')
  return { ...node, id: nextId('sec'), children: node.children.map(cloneRow) };
  if (node.type === 'row') return cloneRow(node);
  return { ...node, id: nextId('el') };
};

/** Șterge recursiv un nod după id */
export function removeNode(
sections: SectionNode[],
id: string)
: SectionNode[] {
  const filterCell = (
  nodes: Array<RowNode | ElementNode>)
  : Array<RowNode | ElementNode> =>
  nodes.
  filter((node) => node.id !== id).
  map((node) =>
  node.type === 'row' ?
  { ...node, cells: node.cells.map(filterCell) } :
  node
  );

  return sections.
  filter((section) => section.id !== id).
  map((section) => ({
    ...section,
    children: section.children.
    filter((row) => row.id !== id).
    map((row) => ({ ...row, cells: row.cells.map(filterCell) }))
  }));
}

/** Inserează un duplicat imediat după nodul cu id-ul dat */
export function duplicateById(
sections: SectionNode[],
id: string)
: SectionNode[] {
  const dupCell = (
  nodes: Array<RowNode | ElementNode>)
  : Array<RowNode | ElementNode> => {
    const out: Array<RowNode | ElementNode> = [];
    nodes.forEach((node) => {
      const next =
      node.type === 'row' ? { ...node, cells: node.cells.map(dupCell) } : node;
      out.push(next);
      if (node.id === id)
      out.push(duplicateNode(node) as RowNode | ElementNode);
    });
    return out;
  };

  const out: SectionNode[] = [];
  sections.forEach((section) => {
    const children: RowNode[] = [];
    section.children.forEach((row) => {
      children.push({ ...row, cells: row.cells.map(dupCell) });
      if (row.id === id) children.push(duplicateNode(row) as RowNode);
    });
    out.push({ ...section, children });
    if (section.id === id) out.push(duplicateNode(section) as SectionNode);
  });
  return out;
}

/** Mută nodul cu id-ul dat cu o poziție mai sus sau mai jos, între frații lui */
export function moveById(
sections: SectionNode[],
id: string,
direction: 'up' | 'down')
: SectionNode[] {
  const shift = <T extends {id: string;},>(list: T[]): T[] => {
    const index = list.findIndex((item) => item.id === id);
    if (index === -1) return list;
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= list.length) return list;
    const next = [...list];
    [next[index], next[target]] = [next[target], next[index]];
    return next;
  };

  const mapCell = (
  nodes: Array<RowNode | ElementNode>)
  : Array<RowNode | ElementNode> =>
  shift(
    nodes.map((node) =>
    node.type === 'row' ? { ...node, cells: node.cells.map(mapCell) } : node
    )
  );

  return shift(
    sections.map((section) => ({
      ...section,
      children: shift(
        section.children.map((row) => ({
          ...row,
          cells: row.cells.map(mapCell)
        }))
      )
    }))
  );
}

/** Inserează o secțiune la un index dat în pagină */
export function insertSection(
sections: SectionNode[],
index: number,
section: SectionNode)
: SectionNode[] {
  const next = [...sections];
  next.splice(index, 0, section);
  return next;
}

/** Inserează un row într-o secțiune, la un index dat */
export function insertRow(
sections: SectionNode[],
sectionId: string,
index: number,
row: RowNode)
: SectionNode[] {
  return sections.map((section) => {
    if (section.id !== sectionId) return section;
    const children = [...section.children];
    children.splice(index, 0, row);
    return { ...section, children };
  });
}

/** Inserează un nod într-o celulă de row (recursiv, pentru row-uri imbricate) */
/** Poziția unui nod într-o celulă (sau -1 dacă nu e acolo) */
export function positionInCell(
sections: SectionNode[],
rowId: string,
cellIndex: number,
nodeId: string)
: number {
  let found = -1;
  const walkRow = (row: RowNode) => {
    row.cells.forEach((cell, index) => {
      if (row.id === rowId && index === cellIndex) {
        const at = cell.findIndex((child) => child.id === nodeId);
        if (at !== -1) found = at;
      }
      cell.forEach((child) => {
        if (child.type === 'row') walkRow(child);
      });
    });
  };
  sections.forEach((section) => section.children.forEach(walkRow));
  return found;
}

export function insertInCell(
sections: SectionNode[],
rowId: string,
cellIndex: number,
node: RowNode | ElementNode,
/** Poziția în celulă; implicit la final */
at?: number)
: SectionNode[] {
  const mapRow = (row: RowNode): RowNode => {
    const cells = row.cells.map((cell, index) => {
      const mapped = cell.map((child) =>
      child.type === 'row' ? mapRow(child) : child
      );
      if (row.id === rowId && index === cellIndex) {
        const position = at ?? mapped.length;
        return [...mapped.slice(0, position), node, ...mapped.slice(position)];
      }
      return mapped;
    });
    return { ...row, cells };
  };

  return sections.map((section) => ({
    ...section,
    children: section.children.map(mapRow)
  }));
}