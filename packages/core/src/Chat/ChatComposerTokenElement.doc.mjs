/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'ChatComposerTokenElement',
  subComponentOf: 'Chat',
  displayName: 'Chat Composer Token Element',
  isHiddenFromOverview: true,
  description: 'Renders a single token chip outside the contentEditable input. Wraps a badge config or custom render function in the correct data-solo-token span so the token serializes properly and stays visually consistent with tokens inside the composer.',
  playground: {
    defaults: {
      token: {value: '@solo', label: '@solo', variant: 'blue'},
    },
  },
  props: [
    {
      name: 'token',
      type: 'ChatComposerToken',
      description: 'The token to render. Pass a badge config ({ value, label, variant?, icon? }) for the common case, or a custom render ({ value, render }) for full control.',
      required: true,
    },
  ],
};

export const docsZh = {
  name: 'ChatComposerTokenElement',
  isHiddenFromOverview: true,
  displayName: 'Chat Composer Token Element',
  description: '在 contentEditable 外部渲染标记芯片。',
  propDescriptions: {
    token: '徽章配置或自定义渲染。',
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'يعرض شريحة رمز واحدة خارج حقل الإدخال contentEditable. يغلّف إعدادات شارة أو دالة عرض مخصصة داخل عنصر span الصحيح ذي السمة data-solo-token كي يُسلسَل الرمز على نحو صحيح ويبقى متسقًا بصريًا مع الرموز داخل المحرر.',
  propDescriptions: {
    token: 'الرمز المراد عرضه. مرّر إعدادات شارة ({ value, label, variant?, icon? }) للحالة الشائعة، أو عرضًا مخصصًا ({ value, render }) للتحكم الكامل.',
  },
};

export const docsDense = {
  name: 'ChatComposerTokenElement',
  isHiddenFromOverview: true,
  displayName: 'Chat Composer Token Element',
  description: 'token chip outside contentEditable; badge config or custom render in data-solo-token span',
  propDescriptions: {
    token: 'badge config or custom render',
  },
};
