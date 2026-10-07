/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'block',
  exampleFor: 'Lightbox',
  name: 'Lightbox — Gallery',
  displayName: 'Lightbox — Gallery',
  description:
    'A thumbnail grid that opens a fullscreen gallery. Clicking any thumbnail opens the lightbox at that index. Prev/next navigation lets users browse all images without closing.',
  displayNameAr: 'Lightbox — المعرض',
  descriptionAr: 'شبكة صور مصغّرة تفتح معرضًا بملء الشاشة. يؤدي النقر على أي صورة مصغّرة إلى فتح Lightbox عند ذلك الفهرس. يتيح التنقّل بين السابق/التالي للمستخدمين تصفّح جميع الصور دون الإغلاق.',
  isReady: true,
  order: 1,
  aspectRatio: 4 / 3,
  componentsUsed: ['Lightbox', 'Grid', 'Thumbnail'],
};
