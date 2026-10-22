/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'page',
  name: 'Site Operations Dashboard',
  displayName: 'Site Operations Dashboard',
  description:
    'A live view of one job site for the current shift: headcount and hours against plan, zones at capacity, and safety alerts to acknowledge, with short-horizon charts (today by hour, this week by trade, two weeks of safety events) built on Solo charts that mirror in right-to-left.',
  displayNameAr: 'لوحة عمليات الموقع',
  descriptionAr:
    'عرض مباشر لموقع عمل واحد خلال الوردية الحالية: عدد العمال وساعات العمل مقارنةً بالخطة، والمناطق التي بلغت سعتها، وتنبيهات السلامة بانتظار الإقرار، مع مخططات قصيرة المدى (اليوم بالساعة، والأسبوع حسب الحرفة، وأسبوعان من أحداث السلامة) مبنية على مخططات Solo التي تنعكس في الاتجاه من اليمين إلى اليسار.',
  keywords: [
    'dashboard',
    'operations',
    'real-time',
    'live',
    'construction',
    'job site',
    'shift',
    'headcount',
    'safety alerts',
    'occupancy',
    'capacity',
    'field operations',
  ],
  isReady: true,
  category: 'Dashboard - Operations',
  order: 7,
  filter: 'Dashboard',
  previewAspectRatio: 16 / 10,
  slug: 'dashboard-operations',
};
