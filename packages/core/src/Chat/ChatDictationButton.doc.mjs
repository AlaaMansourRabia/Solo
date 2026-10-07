/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'ChatDictationButton',
  displayName: 'Chat Dictation Button',
  group: 'Chat',
  category: 'Chat',
  isHiddenFromOverview: true,
  hidden: false,

  keywords: ['dictation', 'microphone', 'voice', 'speech', 'recording', 'stt', 'speech-to-text', 'voice-input', 'mic'],

  usage: {
    description:
      'ChatDictationButton is a toggle button that starts and stops voice dictation inside a chat composer. It pairs with useChatDictation to show a microphone icon when idle and animated frequency bars when listening. Place it in the sendActions slot of ChatComposer.',
    bestPractices: [
      {guidance: true, description: 'Place the dictation button in the sendActions slot of ChatComposer so it sits next to the send button where users expect voice input controls.'},
      {guidance: true, description: 'Pass an inputRef to useChatDictation so interim transcripts appear as ghost text in the composer input while the user speaks.'},
      {guidance: true, description: "Enable hasSounds on useChatDictation to give users audio feedback when dictation starts and stops. This is especially helpful when the button's visual change is subtle."},
      {guidance: false, description: "Don't use the dictation button outside a chat composer context. It's designed for the composer's send-action layout, not as a standalone recording control."},
      {guidance: false, description: "Don't forget to handle the unsupported case. The button hides itself by default when the browser lacks SpeechRecognition, but you should still design the composer to work without it."},
    ],
    anatomy: [
      {name: 'Microphone icon', required: true, description: 'Shown in the idle state. Indicates that tapping will start voice input.'},
      {name: 'Frequency bars', required: false, description: 'Animated equalizer bars that replace the icon during listening. React to real microphone volume.'},
      {name: 'Ghost button', required: true, description: 'The underlying Button with ghost variant and isIconOnly, providing the hit target and focus ring.'},
    ],
  },

  props: [
    {
      name: 'dictation',
      type: 'UseSpeechRecognitionReturn',
      description:
        'The return value from useChatDictation or useSpeechRecognition. Controls all button state: listening, volume, bands, and toggle.',
      required: true,
    },
    {
      name: 'size',
      type: "'sm' | 'md'",
      description: 'Button size. Matches ChatComposer density.',
      default: "'md'",
    },
    {
      name: 'isHiddenWhenUnsupported',
      type: 'boolean',
      description:
        'When true, renders nothing if the browser does not support SpeechRecognition. When false, keeps the button visible but disabled.',
      default: 'true',
    },
    {
      name: 'label',
      type: 'string',
      description:
        'Accessible label override. Defaults to "Start dictation" or "Stop dictation" based on state.',
    },
    {
      name: 'className',
      type: 'string',
      description: 'Tailwind classes for layout customization (margins, positioning, sizing), merged with the component classes through cn() (tailwind-merge), so a conflicting utility overrides the default.',
    },
  ],

};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsZh = {
  usage: {
    description:
      'ChatDictationButton is a toggle button that starts and stops voice dictation inside a chat composer. It pairs with useChatDictation to show a microphone icon when idle and animated frequency bars when listening. Place it in the sendActions slot of ChatComposer.',
    bestPractices: [
      {guidance: true, description: 'Place the dictation button in the sendActions slot of ChatComposer so it sits next to the send button where users expect voice input controls.'},
      {guidance: true, description: 'Pass an inputRef to useChatDictation so interim transcripts appear as ghost text in the composer input while the user speaks.'},
      {guidance: true, description: "Enable hasSounds on useChatDictation to give users audio feedback when dictation starts and stops. This is especially helpful when the button's visual change is subtle."},
      {guidance: false, description: "Don't use the dictation button outside a chat composer context. It's designed for the composer's send-action layout, not as a standalone recording control."},
      {guidance: false, description: "Don't forget to handle the unsupported case. The button hides itself by default when the browser lacks SpeechRecognition, but you should still design the composer to work without it."},
    ],
  },
  propDescriptions: {
    dictation: 'The return value from useChatDictation or useSpeechRecognition. Controls all button state.',
    size: 'Button size.',
    isHiddenWhenUnsupported: 'When true, hides unsupported dictation; when false, keeps a disabled button visible.',
    label: 'Accessible label override.',
    className: 'Additional Tailwind classes.',
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'ChatDictationButton زر تبديل يبدأ الإملاء الصوتي ويوقفه داخل محرّر رسائل المحادثة.',
  propDescriptions: {
    dictation: 'القيمة المُرجعة من useChatDictation أو useSpeechRecognition. تتحكم في جميع حالات الزر: الاستماع ومستوى الصوت والنطاقات والتبديل.',
    size: 'حجم الزر. يطابق كثافة ChatComposer.',
    isHiddenWhenUnsupported: 'عند تعيينه إلى true لا يُعرض شيء إذا كان المتصفح لا يدعم SpeechRecognition. وعند false يبقى الزر ظاهرًا لكنه معطَّل.',
    label: 'تجاوز للتسمية القابلة للوصول. القيمة الافتراضية "Start dictation" أو "Stop dictation" بحسب الحالة.',
    className: 'أصناف Tailwind لتخصيص التخطيط (الهوامش والتموضع والأبعاد)، تُدمج مع أصناف المكوّن عبر cn() (tailwind-merge)، بحيث تتجاوز الأداة المتعارضة القيمة الافتراضية.',
  },
  usage: {
    description: 'ChatDictationButton زر تبديل يبدأ الإملاء الصوتي ويوقفه داخل محرّر رسائل المحادثة. يعمل مع useChatDictation لعرض أيقونة ميكروفون في وضع الخمول وأشرطة ترددات متحركة أثناء الاستماع. ضعه في فتحة sendActions الخاصة بـ ChatComposer.',
    bestPractices: [
      {guidance: true, description: 'ضع زر الإملاء في فتحة sendActions الخاصة بـ ChatComposer ليكون بجوار زر الإرسال حيث يتوقع المستخدمون عناصر التحكم في الإدخال الصوتي.'},
      {guidance: true, description: 'مرّر inputRef إلى useChatDictation كي تظهر النصوص المؤقتة كنص باهت في حقل إدخال المحرّر أثناء حديث المستخدم.'},
      {guidance: true, description: 'فعّل hasSounds في useChatDictation لتزويد المستخدمين بتغذية راجعة صوتية عند بدء الإملاء وإيقافه. يفيد ذلك خصوصًا عندما يكون التغيير البصري للزر طفيفًا.'},
      {guidance: false, description: 'لا تستخدم زر الإملاء خارج سياق محرّر المحادثة. فهو مصمَّم لتخطيط إجراءات الإرسال في المحرّر، لا كعنصر تحكم مستقل للتسجيل.'},
      {guidance: false, description: 'لا تنسَ معالجة حالة عدم الدعم. يُخفي الزر نفسه افتراضيًا عندما يفتقر المتصفح إلى SpeechRecognition، لكن ينبغي مع ذلك تصميم المحرّر ليعمل بدونه.'},
    ],
    anatomy: [
      {name: 'أيقونة الميكروفون', required: true, description: 'تظهر في حالة الخمول. تشير إلى أن النقر سيبدأ الإدخال الصوتي.'},
      {name: 'أشرطة الترددات', required: false, description: 'أشرطة معادل صوتي متحركة تحل محل الأيقونة أثناء الاستماع. تستجيب لمستوى صوت الميكروفون الفعلي.'},
      {name: 'الزر الشفاف', required: true, description: 'مكوّن Button الأساسي بالنمط ghost مع isIconOnly، ويوفّر منطقة النقر وحلقة التركيز.'},
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description: 'mic toggle btn for voice input in chat composer; idle=mic icon, listening=freq bars; pairs w/ useChatDictation',
  usage: {
    description:
      'Toggle button for voice dictation in chat composer. Pairs with useChatDictation. Shows mic icon when idle, animated frequency bars when listening. Goes in sendActions slot.',
    bestPractices: [
      {guidance: true, description: 'Place in sendActions slot of ChatComposer next to send button.'},
      {guidance: true, description: 'Pass inputRef to useChatDictation for interim ghost text in input.'},
      {guidance: true, description: 'Enable hasSounds for audio feedback on start/stop.'},
      {guidance: false, description: "Don't use outside chat composer context. Designed for composer send-action layout only."},
      {guidance: false, description: "Don't forget unsupported case. Button auto-hides but composer should work without it."},
    ],
  },
  propDescriptions: {
    dictation: 'return from useChatDictation/useSpeechRecognition; controls state',
    size: 'btn size',
    isHiddenWhenUnsupported: 'hide unsupported dictation; false keeps disabled btn visible',
    label: 'a11y label override',
    className: 'extra Tailwind classes',
  },
};
