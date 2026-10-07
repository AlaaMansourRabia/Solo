/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'block',
  exampleFor: 'LinkProvider',
  name: 'Link Provider — Custom Link Component',
  displayName: 'Link Provider — Custom Link Component',
  description:
    'Routes every Solo link through a custom component that intercepts the click, the hook frameworks like Next.js use for client-side navigation. Click the link to see the custom handler fire instead of a full-page load.',
  displayNameAr: 'Link Provider — مكوّن رابط مخصص',
  descriptionAr: 'يوجّه كل روابط Solo عبر مكوّن مخصص يعترض النقرة، وهي النقطة التي تستخدمها أطر عمل مثل Next.js للتنقّل من جهة العميل. انقر على الرابط لترى المعالج المخصص يعمل بدلًا من تحميل الصفحة بالكامل.',
  isReady: true,
  order: 1,
  aspectRatio: 4 / 3,
  componentsUsed: ['LinkProvider', 'Link'],
};
