/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'block',
  exampleFor: 'ScrollableArea',
  name: 'ScrollableArea — Sticky Passthrough',
  displayName: 'Scrollable Area — Sticky Passthrough',
  description:
    'A section whose content fits clips instead of scrolling, so its sticky label passes outward and pins to the panel edge. The next section sets stickyContainment="always" and keeps its label in its own box.',
  displayNameAr: 'Scrollable Area — تمرير اللصق للخارج',
  descriptionAr: 'قسم يتّسع لمحتواه فيقصّه بدلًا من التمرير، فتنتقل تسميته اللاصقة إلى الخارج وتُثبَّت بحافة اللوحة. يضبط القسم التالي stickyContainment="always" ويُبقي تسميته داخل صندوقه الخاص.',
  isReady: true,
  order: 3,
  aspectRatio: 1,
  componentsUsed: ['ScrollableArea', 'Card', 'Grid'],
};
