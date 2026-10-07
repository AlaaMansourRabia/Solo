/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'LinkProvider',
  displayName: 'Link Provider',
  group: 'Utilities',
  category: 'Utility',
  isHiddenFromOverview: true,
  keywords: ['link', 'provider', 'router', 'nextjs', 'client-side-routing'],
  usage: {
    description: 'Wraps your app to replace the default <a> tag with a framework-specific link component (e.g. Next.js Link) for client-side routing across all Solo components.',
  },
  props: [
    {name: 'component', type: 'LinkComponentType', required: true, description: 'Link component to use for all link elements in the subtree (e.g. Next.js Link). It receives accepted `href` and `to` values under the shared navigation rule described on the Link `href` prop. Supported structured destinations, including their `protocol`, are checked without changing object identity. If either supplied destination is rejected, Solo renders inert content without invoking this component; it does not pass undefined or fall back to the other destination.'},
    {name: 'children', type: 'ReactNode', required: true, description: 'Content to render with the link provider.'},
  ],
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'يغلّف تطبيقك ليستبدل وسم <a> الافتراضي بمكوّن رابط خاص بإطار العمل (مثل Next.js Link) للتوجيه من جهة العميل عبر جميع مكوّنات Solo.',
  propDescriptions: {
    component: 'مكوّن الرابط المستخدم لجميع عناصر الروابط في الشجرة الفرعية (مثل Next.js Link). يتلقى قيم `href` و`to` المقبولة وفق قاعدة التنقّل المشتركة الموضحة في الخاصية `href` لـ Link. يُتحقق من الوجهات المهيكلة المدعومة، بما في ذلك `protocol` الخاص بها، دون تغيير هوية الكائن. إذا رُفضت أيٌّ من الوجهتين المقدَّمتين، يعرض Solo محتوى خاملًا دون استدعاء هذا المكوّن؛ ولا يمرّر undefined ولا يرجع إلى الوجهة الأخرى.',
    children: 'المحتوى المراد عرضه مع مزوّد الروابط.',
  },
  usage: {
    description: 'يغلّف تطبيقك ليستبدل وسم <a> الافتراضي بمكوّن رابط خاص بإطار العمل (مثل Next.js Link) للتوجيه من جهة العميل عبر جميع مكوّنات Solo.',
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description: 'Wraps app to replace default <a> tag w/ framework-specific link component (e.g. Next.js Link) for client-side routing across all Solo components.',
  usage: {
    description: 'Wraps app to replace default <a> tag w/ framework-specific link component (e.g. Next.js Link) for client-side routing across all Solo components.',
  },
  propDescriptions: {
    component: 'link component for all link elements in subtree (e.g. Next.js Link). Accepted href/to follow the Link href rule; structured fields including protocol are checked, preserving identity. Either rejected => inert content, no router invocation or fallback.',
  },
};
