/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'block',
  exampleFor: 'Collapsible',
  name: 'Collapsible — Single Mode',
  displayName: 'Collapsible — Single Mode',
  description:
    'Only one section open at a time, so a single body of content competes for attention. Use defaultValue to pre-expand whichever section a first-time reader needs. Each Collapsible owns a Section, so its trigger is that section heading.',
  displayNameAr: 'Collapsible — الوضع الفردي',
  descriptionAr: 'قسم واحد فقط مفتوح في كل مرة، فلا يتنافس على الانتباه إلا محتوى واحد. استخدم defaultValue لتوسيع القسم الذي يحتاجه القارئ لأول مرة مسبقاً. يمتلك كل Collapsible قسماً Section، فيكون مشغّله عنوان ذلك القسم.',
  isReady: true,
  order: 4,
  aspectRatio: 4 / 3,
  componentsUsed: [
    'Collapsible',
    'CollapsibleGroup',
    'Section',
    'Text',
    'Stack',
  ],
};
