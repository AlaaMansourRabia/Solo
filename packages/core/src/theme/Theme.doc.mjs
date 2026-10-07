/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'Theme',
  displayName: 'Theme',
  group: 'Utilities',
  category: 'Utility',
  isHiddenFromOverview: true,
  keywords: ['theme', 'theming', 'provider', 'color-scheme'],
  playground: {
    defaults: {
      theme: '@solo/theme-matcha',
      mode: 'light',
      children: {
        __element: 'Card',
        props: {padding: 4, style: {maxWidth: 360}},
        children: {
          __element: 'VStack',
          props: {gap: 3},
          children: [
            {
              __element: 'Heading',
              props: {level: 4},
              children: 'Theme preview',
            },
            {
              __element: 'Text',
              props: {type: 'body', color: 'secondary'},
              children:
                'Cards, text, and buttons inherit tokens from the selected theme.',
            },
            {__element: 'Button', props: {label: 'Primary action'}},
          ],
        },
      },
    },
  },
  usage: {
    description:
      'Wraps a subtree with a specific Solo theme. For static production themes, import the CSS of a pre-built theme plus its built theme object (for example `@solo/theme-neutral/theme.css` and `@solo/theme-neutral/built`) for first-paint and SSR performance. Use runtime `defineTheme()` when themes are dynamic or for prototyping.\n\n`defineTheme` accepts a `tokens` object whose keys are CSS custom property names (always prefixed with `--`). Common token names include `--color-accent`, `--color-background-surface`, `--color-background-body`, `--color-text-primary`, `--color-text-secondary`, `--radius-container`, `--spacing-1` through `--spacing-6`. Values can be a string (same for light/dark) or a `[light, dark]` tuple.\n\nExample:\n```ts\nimport {defineTheme} from \'@solo/core/theme\';\nconst myTheme = defineTheme({\n  name: \'ocean\',\n  tokens: {\n    \'--color-accent\': [\'#0077B6\', \'#48CAE4\'],\n    \'--color-background-surface\': [\'#F0F8FF\', \'#0A1628\'],\n    \'--color-text-primary\': [\'#0A1317\', \'#FFFFFF\'],\n    \'--radius-container\': \'16px\',\n  },\n});\n```',
    bestPractices: [
      {
        guidance: true,
        description:
          'Ship app themes that are known ahead of time pre-built, then import their CSS and built theme object.',
      },
      {
        guidance: true,
        description:
          'Use runtime themes when the theme is created or edited in the browser, such as theme editors, user branding, or prototypes.',
      },
      {
        guidance: true,
        description:
          'Token names always start with `--` (e.g. `--color-accent`, `--color-background-surface`). Do not omit the prefix.',
      },
      {
        guidance: false,
        description:
          'Default to runtime themes in SSR production apps. Component overrides inject after hydration instead of shipping as static CSS.',
      },
    ],
  },
  props: [
    {
      name: 'theme',
      type: 'DefinedTheme',
      required: true,
      description:
        'Theme object to apply. Prefer built theme objects for static production themes; use runtime `defineTheme()` for dynamic themes.',
    },
    {
      name: 'mode',
      type: "'light' | 'dark' | 'system'",
      default: "'system'",
      description: 'Color mode. System follows OS preference.',
    },
    {
      name: 'syncRoot',
      type: 'boolean',
      description:
        "Root Theme only: sync data-theme and data-solo-theme onto <html>. Set false when embedding Solo in a host page that keeps its own styles: the theme's scoped element rules then stay inside this Theme's wrapper instead of restyling the whole page. Layers (Popover, Tooltip, DropdownMenu, Dialog) render inside the wrapper and stay themed; detached surfaces such as the Toast fallback viewport mirror the wrapper's attributes instead. Ignored by nested Themes, which never sync.",
      default: 'true',
    },
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      description: 'Content to render with the theme.',
    },
  ],
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description:
    'يغلّف شجرة فرعية بسمة Solo محددة، ويطبّق رموز التصميم الخاصة بها ووضع الألوان على المحتوى الذي بداخله.',
  propDescriptions: {
    theme:
      'كائن السمة المراد تطبيقه. يُفضَّل استخدام كائنات السمات المبنية للسمات الثابتة في بيئة الإنتاج؛ واستخدم `defineTheme()` وقت التشغيل للسمات الديناميكية.',
    mode: 'وضع الألوان. يتبع الخيار System تفضيل نظام التشغيل.',
    syncRoot:
      'خاص بـ Theme الجذري فقط: يزامن data-theme وdata-solo-theme على <html>. اضبطه على false عند تضمين Solo في صفحة مضيفة تحتفظ بأنماطها الخاصة: عندئذٍ تبقى قواعد العناصر المحصورة بالسمة داخل غلاف Theme هذا بدلًا من إعادة تنسيق الصفحة بأكملها. تُعرض الطبقات (Popover وTooltip وDropdownMenu وDialog) داخل الغلاف وتبقى مُنسَّقة بالسمة؛ أما الأسطح المنفصلة مثل منفذ العرض الاحتياطي لـ Toast فتعكس سمات الغلاف بدلًا من ذلك. تتجاهله مكونات Theme المتداخلة، إذ لا تُجري أي مزامنة.',
    children: 'المحتوى المراد عرضه بالسمة.',
  },
  usage: {
    description:
      'يغلّف شجرة فرعية بسمة Solo محددة. للسمات الثابتة في بيئة الإنتاج، استورد ملف CSS الخاص بسمة مبنية مسبقًا مع كائن السمة المبني (مثل `@solo/theme-neutral/theme.css` و`@solo/theme-neutral/built`) لتحقيق أداء أفضل في العرض الأول وSSR. واستخدم `defineTheme()` وقت التشغيل عندما تكون السمات ديناميكية أو لأغراض النماذج الأولية.\n\nيقبل `defineTheme` كائن `tokens` تكون مفاتيحه أسماء خصائص CSS مخصصة (مسبوقة دائمًا بـ `--`). من أسماء رموز التصميم الشائعة: `--color-accent` و`--color-background-surface` و`--color-background-body` و`--color-text-primary` و`--color-text-secondary` و`--radius-container` ومن `--spacing-1` إلى `--spacing-6`. يمكن أن تكون القيم سلسلة نصية (متطابقة في الوضعين الفاتح والداكن) أو صفًّا ثنائيًا `[light, dark]`.\n\nمثال:\n```ts\nimport {defineTheme} from \'@solo/core/theme\';\nconst myTheme = defineTheme({\n  name: \'ocean\',\n  tokens: {\n    \'--color-accent\': [\'#0077B6\', \'#48CAE4\'],\n    \'--color-background-surface\': [\'#F0F8FF\', \'#0A1628\'],\n    \'--color-text-primary\': [\'#0A1317\', \'#FFFFFF\'],\n    \'--radius-container\': \'16px\',\n  },\n});\n```',
    bestPractices: [
      {
        guidance: true,
        description:
          'وفّر سمات التطبيق المعروفة مسبقًا مبنيةً مسبقًا، ثم استورد ملف CSS الخاص بها وكائن السمة المبني.',
      },
      {
        guidance: true,
        description:
          'استخدم السمات وقت التشغيل عندما تُنشأ السمة أو تُعدَّل في المتصفح، كما في محررات السمات أو العلامة التجارية للمستخدم أو النماذج الأولية.',
      },
      {
        guidance: true,
        description:
          'تبدأ أسماء رموز التصميم دائمًا بـ `--` (مثل `--color-accent` و`--color-background-surface`). لا تحذف البادئة.',
      },
      {
        guidance: false,
        description:
          'اللجوء افتراضيًا إلى السمات وقت التشغيل في تطبيقات الإنتاج التي تعتمد SSR؛ إذ تُحقن تجاوزات المكونات بعد الإماهة (hydration) بدلًا من شحنها كملف CSS ثابت.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  usage: {
    description:
      'Wraps subtree w/ specific Solo theme. For static production themes, import a pre-built theme CSS + built theme object for first-paint/SSR performance. Use runtime `defineTheme()` for dynamic themes or prototyping. Token names always start with `--` (e.g. `--color-accent`, `--color-background-surface`).',
    bestPractices: [
      {
        guidance: true,
        description:
          'Ship app themes known ahead of time pre-built; import their CSS + built theme object.',
      },
      {
        guidance: true,
        description:
          'Use runtime themes when theme is created/edited in browser, e.g. theme editor, user branding, prototype.',
      },
      {
        guidance: true,
        description:
          'Token names always start with `--` (e.g. `--color-accent`, `--color-background-surface`). Do not omit the prefix.',
      },
      {
        guidance: false,
        description:
          'Default to runtime themes in SSR production apps. Component overrides inject after hydration instead of static CSS.',
      },
    ],
  },
  propDescriptions: {
    theme:
      'theme object to apply. Prefer built theme objects for static production themes; use runtime `defineTheme()` for dynamic themes.',
    mode: 'color mode. System follows OS preference. defaults to "system"',
    syncRoot: 'root Theme syncs data-theme/data-solo-theme onto <html>; false for embedding in a host page (styles stay in the wrapper); nested Themes never sync',
  },
};
