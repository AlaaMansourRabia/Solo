/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'block',
  exampleFor: 'ResizeHandle',
  alsoExampleFor: ['useResizable'],
  name: 'Resizable — Collapsible with snap points',
  displayName: 'Resizable — Collapsible with snap points',
  description:
    'A collapsible sidebar with snap points, driven by useResizable. Dragging snaps to preset widths, dragging past the minimum collapses the panel, and the expand method restores it programmatically.',
  displayNameAr: 'Resizable — قابل للطي مع نقاط الالتقاط',
  descriptionAr: 'شريط جانبي قابل للطي مع نقاط التقاط، يعمل بواسطة useResizable. يلتقط السحب عروضًا محددة مسبقًا، ويؤدي السحب إلى ما دون الحد الأدنى إلى طي اللوحة، وتستعيدها الدالة expand برمجيًا.',
  isReady: true,
  order: 1,
  aspectRatio: 16 / 9,
  componentsUsed: [
    'Resizable',
    'ResizeHandle',
    'Layout',
    'LayoutPanel',
    'LayoutContent',
    'Card',
    'VStack',
    'Button',
    'Text',
  ],
};
