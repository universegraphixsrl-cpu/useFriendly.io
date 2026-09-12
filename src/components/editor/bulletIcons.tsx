import React from 'react';
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  BadgeCheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronUpIcon,
  ChevronsDownIcon,
  ChevronsLeftIcon,
  ChevronsUpIcon,
  MinusIcon,
  PlusIcon,
  SparklesIcon,
  StarIcon,
  CheckCheckIcon,
  CheckIcon,
  ChevronRightIcon,
  ChevronsRightIcon,
  CircleArrowRightIcon,
  CircleCheckBigIcon,
  CircleCheckIcon,
  CircleXIcon,
  LightbulbIcon,
  SquareCheckBigIcon,
  SquareCheckIcon,
  XIcon } from
'lucide-react';

/** Iconițele disponibile pentru punctele unei liste */
export const bulletIconOptions: Array<{
  key: string;
  label: string;
  render: (size: number, color: string) => React.ReactNode;
}> = [
{
  key: 'dot',
  label: 'Bulină',
  render: (size, color) =>
  <span
    className="rounded-full"
    style={{
      width: Math.max(4, size / 2.6),
      height: Math.max(4, size / 2.6),
      backgroundColor: color
    }} />


},
{
  key: 'check',
  label: 'Bifă',
  render: (size, color) =>
  <CheckIcon style={{ width: size, height: size, color }} />

},
{
  key: 'checkDouble',
  label: 'Bifă dublă',
  render: (size, color) =>
  <CheckCheckIcon style={{ width: size, height: size, color }} />

},
{
  key: 'squareCheck',
  label: 'Bifă în pătrat',
  render: (size, color) =>
  <SquareCheckBigIcon style={{ width: size, height: size, color }} />

},
{
  key: 'squareCheckFull',
  label: 'Bifă în pătrat plin',
  render: (size, color) =>
  <SquareCheckIcon
    style={{ width: size, height: size, color }}
    fill={color}
    stroke="#ffffff" />


},
{
  key: 'circleCheck',
  label: 'Bifă în cerc',
  render: (size, color) =>
  <CircleCheckBigIcon style={{ width: size, height: size, color }} />

},
{
  key: 'circleCheckFull',
  label: 'Bifă în cerc plin',
  render: (size, color) =>
  <CircleCheckIcon
    style={{ width: size, height: size, color }}
    fill={color}
    stroke="#ffffff" />


},
{
  key: 'arrowCircle',
  label: 'Săgeată în cerc',
  render: (size, color) =>
  <CircleArrowRightIcon
    style={{ width: size, height: size, color }}
    fill={color}
    stroke="#ffffff" />


},
{
  key: 'bulb',
  label: 'Bec',
  render: (size, color) =>
  <LightbulbIcon style={{ width: size, height: size, color }} />

},
{
  key: 'badge',
  label: 'Bifă cu contur zimțat',
  render: (size, color) =>
  <BadgeCheckIcon style={{ width: size, height: size, color }} />

},
{
  key: 'chevron',
  label: 'Săgeată',
  render: (size, color) =>
  <ChevronRightIcon style={{ width: size, height: size, color }} />

},
{
  key: 'chevronDouble',
  label: 'Săgeată dublă',
  render: (size, color) =>
  <ChevronsRightIcon style={{ width: size, height: size, color }} />

},
{
  key: 'x',
  label: 'X',
  render: (size, color) =>
  <XIcon style={{ width: size, height: size, color }} />

},
{
  key: 'xCircle',
  label: 'X în cerc plin',
  render: (size, color) =>
  <CircleXIcon
    style={{ width: size, height: size, color }}
    fill={color}
    stroke="#ffffff" />


}];


/** Săgeți suplimentare pentru puncte de listă */
const arrowIcons: Array<{key: string;label: string;icon: typeof CheckIcon;}> =
[
{ key: 'chevronDown', label: 'Săgeată jos', icon: ChevronDownIcon },
{ key: 'chevronsDown', label: 'Săgeată dublă jos', icon: ChevronsDownIcon },
{ key: 'chevronUp', label: 'Săgeată sus', icon: ChevronUpIcon },
{ key: 'chevronsUp', label: 'Săgeată dublă sus', icon: ChevronsUpIcon },
{ key: 'chevronLeft', label: 'Săgeată stânga', icon: ChevronLeftIcon },
{
  key: 'chevronsLeft',
  label: 'Săgeată dublă stânga',
  icon: ChevronsLeftIcon
},
{ key: 'arrowRight', label: 'Săgeată dreapta', icon: ArrowRightIcon },
{ key: 'arrowUpRight', label: 'Săgeată oblică', icon: ArrowUpRightIcon },
{ key: 'star', label: 'Stea', icon: StarIcon },
{ key: 'sparkle', label: 'Sclipire', icon: SparklesIcon },
{ key: 'plus', label: 'Plus', icon: PlusIcon },
{ key: 'minus', label: 'Minus', icon: MinusIcon }];


arrowIcons.forEach((item) =>
bulletIconOptions.push({
  key: item.key,
  label: item.label,
  render: (size, color) =>
  <item.icon style={{ width: size, height: size, color }} />

})
);

export const bulletIcon = (key: string) =>
bulletIconOptions.find((option) => option.key === key) ?? bulletIconOptions[0];