/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'page',
  name: 'Checkout Wizard',
  displayName: 'Checkout Wizard',
  description:
    'Multi-step checkout, cart, order, and payment wizard with a running summary that recalculates as answers change. It adapts to its host width, renders the summary first on narrow surfaces, validates every forward path, and completes locally without sending payment.',
  displayNameAr: 'معالج إتمام الشراء',
  descriptionAr:
    'معالج متعدد الخطوات لإتمام الشراء والسلة والطلب والدفع، مع ملخّص جارٍ يُعاد حسابه كلما تغيّرت الإجابات. يتكيّف مع عرض الحاوية المضيفة، ويعرض الملخّص أولًا على الواجهات الضيقة، ويتحقق من صحة كل مسار إلى الأمام، ويكتمل محليًّا دون إرسال أي دفعة.',
  keywords: ['checkout', 'cart', 'order', 'payment'],
  isReady: true,
  category: 'Form - Checkout',
  order: 13,
  filter: 'Form',
  previewAspectRatio: 16 / 10,
  slug: 'checkout-wizard',
};
