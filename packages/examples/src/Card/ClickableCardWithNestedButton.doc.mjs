/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'block',
  exampleFor: 'ClickableCard',
  name: 'ClickableCardWithNestedButton',
  displayName: 'Clickable Card — Nested Button',
  description:
    'A product card that navigates on click but has an independent "Add to cart" button inside.',
  displayNameAr: 'Clickable Card — زر متداخل',
  descriptionAr: 'بطاقة منتج تنتقل عند النقر عليها، لكنها تحتوي على زر "Add to cart" مستقل بداخلها.',
  isReady: true,
  order: 2,
  aspectRatio: 1,
  componentsUsed: ['ClickableCard', 'Button', 'Layout', 'Text'],
};
