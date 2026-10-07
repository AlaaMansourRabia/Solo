/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'block',
  exampleFor: 'OverflowList',
  name: 'OverflowList — Capped Toolbar',
  displayName: 'OverflowList — Capped Toolbar',
  description:
    'maxVisibleItems caps the row at three actions even when more would fit; the rest move to a dropdown',
  displayNameAr: 'OverflowList — شريط أدوات محدود',
  descriptionAr: 'يحدّ maxVisibleItems الصف بثلاثة إجراءات حتى لو اتّسع لأكثر؛ وينتقل الباقي إلى قائمة منسدلة.',
  isReady: true,
  order: 2,
  aspectRatio: 4 / 3,
  componentsUsed: ['OverflowList', 'Button', 'DropdownMenu', 'Card', 'Center'],
};
