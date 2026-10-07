/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'block',
  exampleFor: 'Step',
  name: 'Step — Content Slot',
  displayName: 'Step — Content Slot',
  description:
    'Children passed to a Step render below its description, indented to line up with the label rather than the indicator, and stay outside the clickable label area so buttons inside remain their own targets. In a full flow you gate the slot on the step being active. That is what turns a vertical stepper into an expanding one.',
  displayNameAr: 'Step — فتحة المحتوى',
  descriptionAr: 'تُعرض العناصر الفرعية المُمرَّرة إلى Step أسفل وصفه، بإزاحة تحاذيها مع التسمية لا مع المؤشر، وتبقى خارج منطقة التسمية القابلة للنقر لتظل الأزرار بداخلها أهدافاً مستقلة. في مسار كامل تُظهر الفتحة فقط عندما تكون الخطوة نشطة؛ وهذا ما يحوّل الخطوات العمودية إلى خطوات قابلة للتوسيع.',
  isReady: true,
  order: 1,
  aspectRatio: 4 / 3,
  componentsUsed: ['Stepper', 'Step', 'TextInput', 'Button'],
};
