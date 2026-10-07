'use client';

import {Breadcrumbs, BreadcrumbItem} from '@solo/core/Breadcrumbs';

export default function BreadcrumbsShowcase() {
  return (
    <Breadcrumbs>
      <BreadcrumbItem href="/">Home</BreadcrumbItem>
      <BreadcrumbItem href="/projects">Projects</BreadcrumbItem>
      <BreadcrumbItem isCurrent>My Project</BreadcrumbItem>
    </Breadcrumbs>
  );
}
