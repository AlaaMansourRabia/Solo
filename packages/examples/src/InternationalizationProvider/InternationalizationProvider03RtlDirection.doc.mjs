/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'block',
  exampleFor: 'InternationalizationProvider',
  name: 'InternationalizationProvider — RTL Direction',
  displayName: 'Internationalization Provider — RTL Direction',
  description:
    'Toggle text direction with the `dir` prop and watch Solo components mirror. Pagination flips its prev/next chevrons under RTL. The `dir` prop is passed to both `InternationalizationProvider` (so Solo components pick it up) and the `VStack` (so the DOM subtree mirrors); both channels stay in sync with no extra wrapper.',
  displayNameAr: 'Internationalization Provider — اتجاه RTL',
  descriptionAr: 'بدّل اتجاه النص باستخدام الخاصية `dir` وشاهد مكوّنات Solo تنعكس. يقلب ترقيم الصفحات أسهم السابق/التالي في وضع RTL. تُمرَّر الخاصية `dir` إلى كل من `InternationalizationProvider` (لتلتقطها مكوّنات Solo) و`VStack` (لينعكس الشجرة الفرعية في DOM)؛ ويبقى المساران متزامنين دون أي مغلّف إضافي.',
  isReady: true,
  order: 2,
  aspectRatio: 16 / 9,
  componentsUsed: [
    'InternationalizationProvider',
    'Pagination',
    'SegmentedControl',
    'Layout',
  ],
};
