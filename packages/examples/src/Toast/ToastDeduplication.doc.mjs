/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'block',
  exampleFor: 'Toast',
  name: 'Toast — Deduplication',
  displayName: 'Toast — Deduplication',
  description: 'Prevent duplicate toasts with uniqueID. Use ignore to keep the first toast, or overwrite to replace it with updated content like a progress percentage.',
  displayNameAr: 'Toast — منع التكرار',
  descriptionAr: 'امنع تكرار الإشعارات المنبثقة باستخدام uniqueID. استخدم ignore للإبقاء على الإشعار الأول، أو overwrite لاستبداله بمحتوى محدّث مثل نسبة التقدّم.',
  isReady: true,
  order: 2,
  aspectRatio: 16 / 9,
  componentsUsed: ['Toast', 'Button', 'Layout', 'Text'],
};
