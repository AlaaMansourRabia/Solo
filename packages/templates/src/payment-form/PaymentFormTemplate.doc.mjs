/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'page',
  name: 'Checkout Form',
  displayName: 'Checkout Form',
  description:
    'Long sectioned form running beside a summary that stays visible while the fields scroll and recalculates as they change, ending on a terminal confirm of the total. Sections run contact, address, delivery choice, then card details.',
  displayNameAr: 'نموذج إتمام الشراء',
  descriptionAr:
    'نموذج طويل مقسّم إلى أقسام بجانب ملخّص يبقى مرئيًّا بينما تُمرَّر الحقول ويُعاد حسابه كلما تغيّرت، وينتهي بتأكيد نهائي للإجمالي. تتوالى الأقسام: بيانات التواصل، فالعنوان، فخيار التوصيل، ثم بيانات البطاقة.',
  keywords: ['checkout', 'payment', 'billing', 'cart', 'buyer', 'purchase'],
  isReady: true,
  category: 'Form - Checkout',
  order: 12,
  filter: 'Form',
  previewAspectRatio: 16 / 10,
  slug: 'payment-form',
};
