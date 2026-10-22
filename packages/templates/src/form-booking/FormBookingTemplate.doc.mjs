/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'page',
  name: 'Booking Flow',
  displayName: 'Booking Flow',
  description:
    'Stepped reservation flow for a shared resource: pick a day on an availability calendar (or a multi-day range) and a time window, choose from rooms that are disabled with a reason when they are too small or already booked, add details, then reserve. The room is held on a live ten-minute countdown until it is confirmed or released, with a sticky summary beside every step.',
  displayNameAr: 'مسار الحجز',
  descriptionAr:
    'مسار حجز متعدد الخطوات لمورد مشترك: اختر يومًا من تقويم يعرض الإتاحة (أو نطاقًا من عدة أيام) ونافذة زمنية، ثم اختر من بين القاعات التي تُعطَّل مع ذكر السبب حين تكون أصغر من اللازم أو محجوزة مسبقًا، وأضف التفاصيل ثم احجز. تبقى القاعة محجوزة مؤقتًا بعدّ تنازلي حيّ مدته عشر دقائق حتى يُؤكَّد الحجز أو يُلغى، مع ملخّص ثابت بجانب كل خطوة.',
  keywords: ['booking', 'reservation', 'room booking', 'scheduling', 'availability', 'calendar', 'time slots', 'hold', 'countdown'],
  isReady: true,
  category: 'Form - Booking',
  order: 21,
  filter: 'Form',
  previewAspectRatio: 16 / 10,
  slug: 'form-booking',
};
