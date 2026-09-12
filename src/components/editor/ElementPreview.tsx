import React from 'react';
import {
  ImageIcon,
  PlayIcon,
  Volume2Icon,
  GalleryHorizontalIcon,
  RefreshCwIcon,
  StarIcon,
  UserRoundIcon,
  MailIcon,
  PhoneIcon,
  Building2Icon,
  MapPinIcon,
  ChevronDownIcon } from
'lucide-react';
import {
  defaultStyle,
  H_MARGIN_SCALE,
  V_PADDING_SCALE,
  formFieldMeta,
  shadowOptions,
  type ElementNode,
  type ElementStyle } from
'../../data/editor';
import { loadGoogleFont } from '../../data/googleFonts';
import { bulletIcon } from './bulletIcons';
import { ElementIcon } from './elementIcons';
import { CalendarElement } from './CalendarElement';
import { InlineText } from './InlineText';

/** Randarea vizuală a fiecărui tip de element, cu stilurile lui editabile */
export function ElementPreview({
  node,
  device = 'desktop',
  onChange




}: {node: ElementNode;device?: 'desktop' | 'mobile';onChange?: (patch: Partial<ElementStyle>) => void;}) {
  const kind = node.kind;
  const style = node.style ?? defaultStyle(kind);
  const [buttonHover, setButtonHover] = React.useState(false);
  const color = (key: string) => style.colors[key];
  const typo =
  device === 'mobile' ?
  { ...style.typo, ...style.typoMobile } :
  style.typo;

  if (typo.fontFamily) loadGoogleFont(typo.fontFamily);

  const typoStyle: React.CSSProperties = {
    ...(typo.fontFamily ?
    { fontFamily: `'${typo.fontFamily}', sans-serif` } :
    {}),
    fontSize: typo.fontSize,
    lineHeight: `${typo.lineHeight}px`,
    letterSpacing: `${typo.letterSpacing}px`,
    ...(typo.fontStyle ?
    {
      fontWeight: Number(typo.fontStyle.replace('i', '')),
      fontStyle: typo.fontStyle.endsWith('i') ? 'italic' : 'normal'
    } :
    {})
  };

  // padding-ul negativ nu există în CSS: se aplică pe conținutul din interior
  const inner: React.CSSProperties = {
    marginTop: Math.min(0, style.padTop) * V_PADDING_SCALE,
    marginBottom: Math.min(0, style.padBottom) * V_PADDING_SCALE,
    marginLeft: Math.min(0, style.padLeft),
    marginRight: Math.min(0, style.padRight)
  };

  const wrapper: React.CSSProperties = {
    paddingTop: Math.max(0, style.padTop) * V_PADDING_SCALE,
    paddingBottom: Math.max(0, style.padBottom) * V_PADDING_SCALE,
    paddingLeft: Math.max(0, style.padLeft),
    paddingRight: Math.max(0, style.padRight),
    // spațierea exterioară se aplică pe containerul din EditorCanvas,
    // ca să se strângă și conturul elementului odată cu conținutul
    textAlign: style.align,
    ...(style.colors.textBg && style.colors.textBg !== 'transparent' ?
    { backgroundColor: style.colors.textBg } :
    {})
  };

  const alignClass =
  style.align === 'center' ?
  'justify-center' :
  style.align === 'right' ?
  'justify-end' :
  'justify-start';

  const content = () => {
    switch (kind) {
      case 'headline':
        return (
          <InlineText
            as="h2"
            value={style.text}
            style={style}
            colorKey="text"
            className="font-display"
            cssStyle={{ color: color('text'), ...typoStyle }}
            onChange={(patch) => onChange?.(patch)} />);


      case 'text':
        return (
          <InlineText
            as="p"
            value={style.text}
            style={style}
            colorKey="text"
            className="whitespace-pre-line"
            cssStyle={{ color: color('text'), ...typoStyle }}
            onChange={(patch) => onChange?.(patch)} />);


      case 'bulleted':
        return (
          <div
            className={`flex gap-2 ${style.align === 'center' ? 'justify-center' : style.align === 'right' ? 'justify-end' : ''}`}>
            
            <div className="flex flex-col">
              {style.text.
              split('\n').
              filter(Boolean).
              map((item, index) =>
              <span
                key={`${item}-${index}`}
                className="flex shrink-0 items-center justify-center"
                style={{
                  height: typo.lineHeight + (style.bulletSpacing ?? 0),
                  width: style.bulletSize ?? 16
                }}>
                
                    {bulletIcon(style.bulletIcon ?? 'dot').render(
                  style.bulletSize ?? 16,
                  color('bullet')
                )}
                  </span>
              )}
            </div>
            <InlineText
              as="p"
              value={style.text}
              style={style}
              colorKey="text"
              className="whitespace-pre-line"
              cssStyle={{
                color: color('text'),
                ...typoStyle,
                lineHeight: `${typo.lineHeight + (style.bulletSpacing ?? 0)}px`
              }}
              onChange={(patch) => onChange?.(patch)} />
            
          </div>);

      case 'contentBox':
        return (
          <div
            className="rounded-lg border p-5"
            style={{
              backgroundColor: color('bg'),
              borderColor: color('border')
            }}>
            
            <p
              className="font-display text-lg font-bold"
              style={{ color: color('title') }}>
              
              Content box
            </p>
            <InlineText
              as="p"
              value={style.text}
              style={style}
              colorKey="text"
              className="mt-1 whitespace-pre-line"
              cssStyle={{ color: color('text'), ...typoStyle }}
              onChange={(patch) => onChange?.(patch)} />
            
          </div>);

      case 'image':
        return (
          <div className={`flex ${alignClass}`}>
            <div
              className="relative overflow-hidden rounded-lg"
              style={{
                width: style.imageFull ? '100%' : style.imageSize ?? 480,
                maxWidth: '100%'
              }}>
              
              {style.imageSrc ?
              <img
                src={style.imageSrc}
                alt={style.imageAlt ?? ''}
                className="block w-full object-cover"
                style={
                style.imageBlur ?
                { filter: `blur(${style.imageBlur}px)` } :
                undefined
                } /> :


              <div
                className="flex aspect-square w-full items-center justify-center text-ink-400"
                style={{
                  backgroundColor: color('bg'),
                  ...(style.imageBlur ?
                  { filter: `blur(${style.imageBlur}px)` } :
                  {})
                }}>
                
                  <ImageIcon className="h-8 w-8" aria-hidden="true" />
                </div>
              }
              {color('overlay') && color('overlay') !== 'transparent' &&
              <span
                aria-hidden="true"
                className="absolute inset-0"
                style={{ backgroundColor: color('overlay') }} />

              }
            </div>
          </div>);

      case 'video':{
          const ratio = style.videoRatio ?? '16:9';
          const aspect =
          ratio === '4:3' ?
          '4 / 3' :
          ratio === '1:1' ?
          '1 / 1' :
          ratio === '9:16' ?
          '9 / 16' :
          '16 / 9';
          const label =
          style.videoType === 'upload' ?
          style.videoFileName || 'Niciun fișier încărcat' :
          style.videoType === 'embed' ?
          style.videoEmbed ?
          'Cod embed adăugat' :
          'Niciun cod embed' :
          style.videoUrl || 'Adaugă linkul video';
          const mode = style.videoBorderMode ?? 'none';
          const line = `${style.videoBorderWidth ?? 1}px ${
          style.videoBorderStyle ?? 'solid'} ${
          color('border')}`;
          const border =
          mode === 'none' ?
          {} :
          mode === 'full' ?
          { border: line } :
          mode === 'bottom' ?
          { borderBottom: line } :
          mode === 'top' ?
          { borderTop: line } :
          { borderTop: line, borderBottom: line };
          return (
            <div
              className="mx-auto flex w-full flex-col items-center justify-center gap-2 overflow-hidden"
              style={{
                backgroundColor: color('bg'),
                color: color('icon'),
                aspectRatio: aspect,
                maxWidth: ratio === '9:16' ? 320 : undefined,
                borderRadius: style.videoRadius ?? 8,
                ...border
              }}>
              
            <PlayIcon className="h-9 w-9" aria-hidden="true" />
            <span className="max-w-[80%] truncate text-xs font-semibold opacity-80">
              {label}
            </span>
          </div>);

        }
      case 'audio':
        return (
          <div
            className="flex items-center gap-3 rounded-lg px-4 py-3"
            style={{ backgroundColor: color('bg') }}>
            
            <Volume2Icon
              className="h-5 w-5"
              style={{ color: color('text') }}
              aria-hidden="true" />
            
            <div
              className="h-1.5 flex-1 rounded-full"
              style={{ backgroundColor: color('bar') }} />
            
            <span
              className="text-xs font-semibold"
              style={{ color: color('text') }}>
              
              02:14
            </span>
          </div>);

      case 'carousel':
        return (
          <div className="flex gap-3">
            {[0, 1, 2].map((index) =>
            <div
              key={index}
              className="flex h-28 flex-1 items-center justify-center rounded-lg text-ink-400"
              style={{ backgroundColor: color('bg') }}>
              
                <GalleryHorizontalIcon className="h-6 w-6" aria-hidden="true" />
              </div>
            )}
          </div>);

      case 'form':{
          const fields = style.formFields ?? [];
          const radius = style.formRadius ?? 12;
          const borderMode = style.formBorderMode ?? 'full';
          const fieldBorder =
          borderMode === 'none' ?
          {} :
          borderMode === 'bottom' ?
          {
            borderBottomWidth: style.formBorderWidth ?? 1,
            borderBottomStyle: style.formBorderStyle ?? 'solid',
            borderBottomColor: color('border')
          } :
          {
            borderWidth: style.formBorderWidth ?? 1,
            borderStyle: style.formBorderStyle ?? 'solid',
            borderColor: color('border')
          };
          const buttonPosition = style.formButtonPosition ?? 'full';
          const buttonWrap =
          buttonPosition === 'full' ?
          'block' :
          buttonPosition === 'center' ?
          'flex justify-center' :
          buttonPosition === 'right' ?
          'flex justify-end' :
          'flex justify-start';
          return (
            <div className="space-y-4">
            {fields.map((field) => {
                const meta = formFieldMeta(field.kind);
                if (field.kind === 'checkbox') {
                  return (
                    <label
                      key={field.id}
                      className="flex items-center gap-3 text-sm"
                      style={{ color: color('fieldText') }}>
                      
                    <span
                        className="h-5 w-5 shrink-0 rounded border"
                        style={{ borderColor: color('border') }} />
                      
                    <span style={typoStyle}>{field.placeholder}</span>
                    <span className="rounded bg-ink-700 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white">
                      {meta.systemName}
                    </span>
                  </label>);

                }
                return (
                  <div key={field.id} className="relative pb-2">
                  <div
                      className="flex h-14 items-center px-5 transition-[filter] duration-150 ease-out hover:brightness-95"
                      style={{
                        backgroundColor: color('field'),
                        color: color('fieldText'),
                        borderRadius: radius,
                        ...fieldBorder,
                        ...typoStyle
                      }}>
                      
                    {field.placeholder}
                    {field.optional &&
                      <span className="ml-2 text-xs text-ink-400">
                        (opțional)
                      </span>
                      }
                  </div>
                  <span className="absolute -bottom-0.5 left-3 rounded bg-ink-700 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white">
                    {meta.systemName}
                  </span>
                </div>);

              })}
            <div className={buttonWrap}>
              <div
                  className="flex min-h-[56px] flex-col items-center justify-center px-8 py-2 font-display"
                  style={{
                    backgroundColor: color('buttonBg'),
                    color: color('buttonText'),
                    borderRadius: radius,
                    width: buttonPosition === 'full' ? '100%' : undefined
                  }}>
                  
                <span className="flex items-center gap-2 text-base font-bold">
                  {style.formButtonIcon === 'user' &&
                    <UserRoundIcon className="h-4 w-4" aria-hidden="true" />
                    }
                  {style.formButtonIcon === 'mail' &&
                    <MailIcon className="h-4 w-4" aria-hidden="true" />
                    }
                  {style.formButtonIcon === 'phone' &&
                    <PhoneIcon className="h-4 w-4" aria-hidden="true" />
                    }
                  {style.formButtonIcon === 'building' &&
                    <Building2Icon className="h-4 w-4" aria-hidden="true" />
                    }
                  {style.formButtonIcon === 'pin' &&
                    <MapPinIcon className="h-4 w-4" aria-hidden="true" />
                    }
                  {style.formButtonText || 'Trimite'}
                </span>
                {style.formButtonSubtext &&
                  <span className="text-xs font-semibold opacity-80">
                    {style.formButtonSubtext}
                  </span>
                  }
              </div>
            </div>
          </div>);

        }
      case 'formInput':
        return (
          <div
            className="flex h-11 items-center rounded-md border px-3"
            style={{
              backgroundColor: color('bg'),
              borderColor: color('border'),
              color: color('text'),
              ...typoStyle
            }}>
            
            <InlineText
              as="span"
              value={style.text}
              style={style}
              colorKey="text"
              cssStyle={{ color: color('text'), ...typoStyle }}
              onChange={(patch) => onChange?.(patch)} />
            
          </div>);

      case 'button':{
          // creșterea la hover: 1 = abia perceptibil, 10 = pronunțat
          const hoverStep = Math.min(10, Math.max(1, style.btnHoverScale ?? 3));
          const hovered = style.btnHoverEnabled && buttonHover;
          const scale = hovered ? 1 + hoverStep * 0.01 : 1;
          return (
            <div
              className={`flex ${alignClass}`}>
              
            <div
                onMouseEnter={() => setButtonHover(true)}
                onMouseLeave={() => setButtonHover(false)}
                className="inline-flex flex-col items-center rounded-md px-6 py-3 font-display transition-[transform,background-color] duration-150 ease-out"
                style={{
                  backgroundColor:
                  hovered && style.btnHoverBg ?
                  style.btnHoverBg :
                  color('bg'),
                  transform: `scale(${scale})`,
                  boxShadow:
                  shadowOptions.find(
                    (option) => option.key === (style.btnShadow ?? 'none')
                  )?.css ?? 'none'
                }}>
                
              <InlineText
                  as="span"
                  value={style.text}
                  style={style}
                  colorKey="text"
                  cssStyle={{
                    color:
                    hovered && style.btnHoverText ?
                    style.btnHoverText :
                    color('text'),
                    ...typoStyle
                  }}
                  onChange={(patch) => onChange?.(patch)} />
                
              {(style.btnSubtext ?? '').trim() &&
                <span
                  style={{
                    color: color('subtext'),
                    fontFamily: style.btnSubTypo?.fontFamily || undefined,
                    fontSize: style.btnSubTypo?.fontSize ?? 13,
                    lineHeight: `${style.btnSubTypo?.lineHeight ?? 18}px`,
                    letterSpacing: `${style.btnSubTypo?.letterSpacing ?? 0}px`,
                    fontWeight: Number(
                      (style.btnSubTypo?.fontStyle ?? '400').replace('i', '')
                    ),
                    fontStyle: (style.btnSubTypo?.fontStyle ?? '400').endsWith(
                      'i'
                    ) ?
                    'italic' :
                    'normal'
                  }}>
                  
                  {style.btnSubtext}
                </span>
                }
            </div>
          </div>);

        }
      case 'checkbox':
        return (
          <div>
            <div
              className={`flex items-center gap-2.5 ${alignClass}`}
              style={{ color: color('text'), ...typoStyle }}>
              
              <span
                className="h-4 w-4 shrink-0 rounded border-2"
                style={{ borderColor: color('box') }} />
              
              <InlineText
                as="span"
                value={style.text}
                style={style}
                colorKey="text"
                cssStyle={{ color: color('text'), ...typoStyle }}
                onChange={(patch) => onChange?.(patch)} />
              
            </div>
            {/* mesajul roșu nu apare în editor: se afișează doar pe pagina
                 publicată, după ce vizitatorul încearcă submit fără să bifeze */}
          </div>);

      case 'recaptcha':
        return (
          <div
            className="inline-flex items-center gap-3 rounded-md border px-4 py-3"
            style={{
              backgroundColor: color('bg'),
              borderColor: color('border'),
              color: color('text'),
              ...typoStyle
            }}>
            
            <RefreshCwIcon className="h-4 w-4" aria-hidden="true" />
            <InlineText
              as="span"
              value={style.text}
              style={style}
              colorKey="text"
              cssStyle={{ color: color('text'), ...typoStyle }}
              onChange={(patch) => onChange?.(patch)} />
            
          </div>);

      case 'calendar':
        return (
          <CalendarElement
            calendarId={node.calendarId ?? null}
            colors={style.colors} />);


      case 'divider':{
          const lineStyle = style.lineStyle ?? 'solid';
          const width = style.lineWidth ?? 1;
          const radius = style.radius ?? [0, 0, 0, 0];
          if (lineStyle === 'none') return <div className="w-full" />;
          return (
            <div
              className="w-full"
              style={{
                borderTopWidth: width,
                borderTopStyle: lineStyle,
                borderTopColor: color('line'),
                borderRadius: radius.map((value) => `${value}px`).join(' ')
              }} />);


        }
      case 'timer':{
          const delay = style.timerDelay ?? {
            days: 0,
            hours: 1,
            minutes: 0,
            seconds: 0
          };
          const units =
          style.timerType === 'delay' ?
          [
          { label: 'zile', value: delay.days },
          { label: 'ore', value: delay.hours },
          { label: 'minute', value: delay.minutes },
          { label: 'secunde', value: delay.seconds }] :

          [
          { label: 'zile', value: 2 },
          { label: 'ore', value: 14 },
          { label: 'minute', value: 39 },
          { label: 'secunde', value: 5 }];

          return (
            <div className={`flex gap-2 ${alignClass}`}>
            {units.map((unit) =>
              <div key={unit.label} className="flex flex-col items-center">
                <span
                  className="rounded-md px-4 py-2.5 font-display font-bold"
                  style={{
                    backgroundColor: color('bg'),
                    color: color('text'),
                    ...typoStyle
                  }}>
                  
                  {String(unit.value).padStart(2, '0')}
                </span>
                {style.timerLabels !== false &&
                <span
                  className="mt-1 font-semibold"
                  style={{
                    color: color('labels'),
                    ...typoStyle,
                    fontSize: Math.max(10, Math.round(typo.fontSize * 0.55)),
                    lineHeight: 1.2
                  }}>
                  
                    {unit.label}
                  </span>
                }
              </div>
              )}
          </div>);

        }
      case 'spacer':
        return (
          <div
            className="h-10 w-full rounded"
            style={{ backgroundColor: color('bg') }} />);


      case 'icon':{
          const count = Math.min(20, Math.max(1, style.iconCount ?? 1));
          return (
            <div className={`flex flex-wrap items-center gap-1.5 ${alignClass}`}>
            {Array.from({ length: count }).map((_, index) =>
              <ElementIcon
                key={index}
                iconKey={style.iconName}
                size={style.iconSize ?? 32}
                color={color('icon')} />

              )}
          </div>);

        }
      case 'progress':{
          const value = Math.min(100, Math.max(0, style.progressValue ?? 66));
          const level = Math.min(5, Math.max(1, style.progressThickness ?? 1));
          if ((style.progressStyle ?? 'plain') === 'plain') {
            return (
              <div
                className="w-full overflow-hidden rounded-full"
                style={{
                  height: [10, 16, 22, 30, 40][level - 1],
                  backgroundColor: color('remaining')
                }}>
                
              <div
                  className="h-full rounded-full"
                  style={{ width: `${value}%`, backgroundColor: color('done') }} />
                
            </div>);

          }
          return (
            <div className="w-full">
            <div className="relative">
              <div
                  className="w-full overflow-hidden rounded-full"
                  style={{
                    height: [10, 16, 22, 30, 40][level - 1],
                    backgroundColor: color('remaining')
                  }}>
                  
                <div
                    className="h-full rounded-full"
                    style={{
                      width: `${value}%`,
                      backgroundColor: color('done'),
                      backgroundImage:
                      'repeating-linear-gradient(115deg, rgba(255,255,255,0.22) 0 10px, rgba(255,255,255,0) 10px 22px)'
                    }} />
                  
              </div>
            </div>
          </div>);

        }
      case 'menu':
        return (
          <nav
            className={`flex flex-wrap items-center gap-x-8 gap-y-2 ${alignClass}`}
            style={{ backgroundColor: color('bg') }}>
            
            {(style.menuItems ?? []).map((item) =>
            <span key={item.id} className="group relative">
                <span
                className="flex cursor-pointer items-center gap-1.5"
                style={{ color: color('text'), ...typoStyle }}>
                
                  {item.label || 'Menu item'}
                  {item.hasSubmenu &&
                <ChevronDownIcon
                  className="h-4 w-4 shrink-0"
                  aria-hidden="true" />

                }
                </span>
                {item.hasSubmenu && item.children.length > 0 &&
              <span
                className="pointer-events-none absolute left-0 top-full z-30 hidden min-w-[180px] flex-col rounded-lg border border-slate-200 py-1 shadow-xl group-hover:flex"
                style={{ backgroundColor: color('submenuBg') }}>
                
                    {item.children.map((child) =>
                <span
                  key={child.id}
                  className="px-3 py-2 text-sm"
                  style={{ color: color('text') }}>
                  
                        {child.label || 'Submenu item'}
                      </span>
                )}
                  </span>
              }
              </span>
            )}
          </nav>);

      case 'social':
        return (
          <div className={`flex gap-2 ${alignClass}`}>
            {[0, 1, 2].map((index) =>
            <span
              key={index}
              className="h-9 w-9 rounded-full"
              style={{ backgroundColor: color('icon') }} />

            )}
          </div>);

      default:
        return null;
    }
  };

  return (
    <div style={wrapper}>
      <div style={inner}>{content()}</div>
    </div>);

}