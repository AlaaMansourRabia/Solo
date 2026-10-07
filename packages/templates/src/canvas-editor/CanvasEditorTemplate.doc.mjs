/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'page',
  name: 'Canvas Editor',
  displayName: 'Canvas Editor',
  description:
    'Layered artboard workspace: document tabs over a layer rail, a fixed-size frame you zoom on a muted backdrop, and an inspector of position, type, and filter fields that retargets to the selected layer. Objects hold a coordinate rather than reflowing, so moving one never moves another.',
  displayNameAr: 'محرّر اللوحة',
  descriptionAr:
    'مساحة عمل للوحات الرسم متعددة الطبقات: علامات تبويب للمستندات فوق شريط طبقات، وإطار ثابت الحجم تكبّره وتصغّره على خلفية خافتة، ولوحة فحص لحقول الموضع والخط والمرشّحات تتبدّل وفق الطبقة المحدَّدة. تحتفظ العناصر بإحداثياتها بدل إعادة الانسياب، فلا يؤدي تحريك عنصر إلى تحريك غيره.',
  keywords: [
    'design tool',
    'artboard',
    'poster',
    'graphic',
    'image',
    'slide editor',
  ],
  isReady: true,
  category: 'Tools - Canvas Editor',
  order: 26,
  filter: 'Tools',
  previewAspectRatio: 16 / 10,
  slug: 'canvas-editor',
};
