/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'page',
  name: 'Order Detail',
  displayName: 'Order Detail',
  description: 'Single-record detail in two columns: a summary header with status and actions, a repeating line-item list, a totals block that sums it, and a chronological activity timeline in the rail. The shape for any record holding children plus a history: a customer order with shipping, an invoice, a transaction, or a job.',
  displayNameAr: 'تفاصيل الطلب',
  descriptionAr:
    'تفاصيل سجل واحد في عمودين: ترويسة ملخّص مع الحالة والإجراءات، وقائمة متكرّرة من البنود، وكتلة إجماليات تجمعها، وخط زمني للنشاط مرتّب زمنيًّا في الشريط الجانبي. هذا هو الشكل المناسب لأي سجل يحتوي عناصر فرعية وسجلًّا تاريخيًّا: طلب عميل مع الشحن، أو فاتورة، أو معاملة، أو مهمة.',
  keywords: [
    'order',
    'invoice',
    'transaction',
    'job',
    'record detail',
    'summary header',
  ],
  isReady: true,
  category: 'Content - Order Detail',
  order: 35,
  filter: 'Content',
  previewAspectRatio: 16 / 10,
  slug: 'detail-page',
};
