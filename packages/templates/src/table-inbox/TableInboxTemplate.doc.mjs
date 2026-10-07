/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'page',
  name: 'Inbox Table',
  displayName: 'Inbox Table',
  description:
    'Two-pane message queue: the table indexes a reading pane rather than being the destination, with a divider you drag to resize. Rows stack when the table narrows, not the window; threads read as collapsible messages; replying opens a composer that leaves the list live.',
  displayNameAr: 'جدول صندوق الوارد',
  descriptionAr:
    'قائمة انتظار رسائل من لوحتين: يعمل الجدول فهرسًا للوحة القراءة بدلًا من أن يكون الوجهة، مع فاصل تسحبه لتغيير الحجم. تتراصّ الصفوف عندما يضيق الجدول لا النافذة؛ وتُقرأ سلاسل الرسائل كرسائل قابلة للطيّ؛ ويفتح الرد محرّرًا يُبقي القائمة نشطة.',
  keywords: [
    'inbox',
    'mail',
    'email',
    'conversations',
    'thread',
    'triage',
    'reading pane',
    'split pane',
    'resize',
    'collapse',
    'compose',
    'notifications',
    'review queue',
    'approvals',
    'decisions',
  ],
  isReady: true,
  category: 'Table - Split Pane',
  order: 9,
  filter: 'Table',
  previewAspectRatio: 16 / 10,
  slug: 'table-inbox',
};
