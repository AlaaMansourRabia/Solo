'use client';

import {
  Breadcrumbs,
  BreadcrumbItem,
  type BreadcrumbMenuOption,
} from '@solo/core/Breadcrumbs';

const teamMenu: BreadcrumbMenuOption[] = [
  {label: 'Design', onClick: () => {}},
  {label: 'Engineering', onClick: () => {}},
  {type: 'divider'},
  {label: 'Data', onClick: () => {}},
];

export default function BreadcrumbsMenuItem() {
  return (
    <Breadcrumbs>
      <BreadcrumbItem href="/">Home</BreadcrumbItem>
      <BreadcrumbItem menu={teamMenu}>Teams</BreadcrumbItem>
      <BreadcrumbItem isCurrent>Overview</BreadcrumbItem>
    </Breadcrumbs>
  );
}
