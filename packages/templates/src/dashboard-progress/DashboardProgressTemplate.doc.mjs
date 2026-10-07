/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'page',
  name: 'Project Status Dashboard',
  displayName: 'Project Status Dashboard',
  description:
    'Status analytics mixing progress and time-axis shapes: a completion donut, a horizontal timeline of dated bars against a today marker, a per-owner table with progress and status, an at-risk list, and a burndown.',
  displayNameAr: 'لوحة معلومات حالة المشروع',
  descriptionAr:
    'تحليلات للحالة تمزج بين أشكال التقدّم والمحور الزمني: مخطط حلقي للإنجاز، وخط زمني أفقي من أشرطة مؤرَّخة مقابل مؤشر اليوم، وجدول لكل مسؤول مع التقدّم والحالة، وقائمة بالعناصر المعرّضة للخطر، ومخطط للعمل المتبقّي.',
  keywords: [
    'project',
    'program',
    'milestone',
    'roadmap',
    'launch',
    'delivery status',
    'workstreams and milestones',
    'gates',
    'blockers',
    'gantt',
    'rollout',
    'release planning',
    'readiness',
    'tracker',
  ],
  isReady: true,
  category: 'Dashboard - Project Status',
  order: 5,
  filter: 'Dashboard',
  previewAspectRatio: 16 / 10,
  slug: 'dashboard-progress',
};
