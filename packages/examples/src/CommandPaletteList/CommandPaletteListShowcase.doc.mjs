/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'block',
  exampleFor: 'CommandPaletteList',
  name: 'CommandPaletteList',
  displayName: 'Command Palette List',
  description:
    'Scrollable command palette list with grouped items, including a highlighted item, composed without a full CommandPalette.',
  displayNameAr: 'Command Palette List — نظرة عامة',
  descriptionAr: 'قائمة لوحة أوامر قابلة للتمرير بعناصر مجمّعة، بما فيها عنصر مميَّز، مركّبة دون CommandPalette كاملة.',
  isReady: true,
  order: 0,
  isShowcase: true,
  aspectRatio: 4 / 3,
  componentsUsed: ['CommandPaletteList', 'CommandPaletteGroup', 'CommandPaletteItem'],
};
