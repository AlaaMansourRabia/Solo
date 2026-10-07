/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'block',
  exampleFor: 'Dialog',
  alsoExampleFor: ['useImperativeDialog'],
  alsoShowcaseFor: ['useImperativeDialog'],
  name: 'Dialog — Confirmation',
  displayName: 'Dialog — Confirmation',
  description:
    'Asks the user to confirm a destructive action before it happens. Use before deleting projects, removing team members, revoking API keys, or any irreversible operation.',
  displayNameAr: 'Dialog — التأكيد',
  descriptionAr: 'يطلب من المستخدم تأكيد إجراء هدّام قبل حدوثه. استخدمه قبل حذف المشاريع أو إزالة أعضاء الفريق أو إلغاء مفاتيح API أو أي عملية لا يمكن التراجع عنها.',
  isReady: true,
  order: 2,
  aspectRatio: 4 / 3,
  componentsUsed: ['Dialog', 'Layout', 'Button', 'Text'],
};
