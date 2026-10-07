/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'InternationalizationProvider',
  displayName: 'Internationalization Provider',
  group: 'Utilities',
  category: 'Utility',
  isHiddenFromOverview: true,
  keywords: [
    'i18n',
    'internationalization',
    'localization',
    'locale',
    'translation',
    'translations',
    'provider',
    'language',
  ],
  usage: {
    description:
      'Wraps your app to set the active locale and (optionally) merge additional translation catalogs + per-locale overrides. Solo components inside the subtree resolve their strings against this context. If no provider is present, components fall back to the shipped English defaults.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use shipped Solo locale catalogs from `@solo/core/locales/*` when one exists for your target locale.',
      },
      {
        guidance: true,
        description:
          'Use a same-shape local catalog only when Solo has not shipped that locale yet or you are testing in-progress translations.',
      },
      {
        guidance: true,
        description:
          'Use real BCP 47 tags such as `fr-FR`, `pt-BR`, or `ar-SA`; regional locales fall back to their base language before English.',
      },
      {
        guidance: true,
        description:
          "Set the `dir` attribute on `<html>` (or a wrapping element) yourself; the provider does not set it. Solo components mirror layout and directional icons from the DOM `dir`, so an RTL locale won't visually mirror without it. Use `getLocaleDirection(locale)` to derive the value for both the provider and the DOM.",
      },
      {
        guidance: false,
        description:
          'Cast custom catalog maps to `any`; the i18n package exports `ProviderMessagesByLocale`, `MessagesByLocale`, `Catalog`, and `RuntimeCatalog` for local catalog typing.',
      },
    ],
  },
  props: [
    {
      name: 'locale',
      type: 'string',
      required: true,
      description:
        'BCP 47 language tag for the active locale (e.g. "en", "pt", "pt-BR", "zh-Hans"). Regional tags fall back to their base language, then to the shipped "en" catalog.',
    },
    {
      name: 'messages',
      type: 'ProviderMessagesByLocale',
      required: false,
      description:
        'Optional map of BCP 47 tag to a rich or generated runtime catalog. Import compact shipped catalogs from `@solo/core/locales/*.generated.js`; the shipped "en" catalog is always available and does not need to be listed here.',
    },
    {
      name: 'overrides',
      type: 'Overrides',
      required: false,
      description:
        'Sparse per-locale key overrides applied on top of shipped defaults. Overrides are locale-keyed so a runtime locale swap picks up the correct set.',
    },
    {
      name: 'dir',
      type: "'ltr' | 'rtl'",
      required: false,
      description:
        'Explicit text-direction override for the context. When omitted, direction is derived from `locale` via `Intl.Locale.getTextInfo()`. This sets the direction Solo reads, but it does NOT set the DOM `dir` attribute; you must set `dir` on `<html>` (or a wrapping element) yourself, since Solo components mirror layout and directional icons from the DOM `dir`, not from this prop. Set both to the same value and keep them in sync.',
    },
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      description: 'Content to render with the internationalization provider.',
    },
  ],
  examples: [
    {
      label: 'Load a shipped Solo locale catalog',
      code: `import type {ReactNode} from 'react';
import {InternationalizationProvider} from '@solo/core/i18n';
import frFR from '@solo/core/locales/fr-FR.generated.js';

export function AppI18n({children}: {children: ReactNode}) {
  return (
    <InternationalizationProvider locale="fr-FR" messages={{'fr-FR': frFR}}>
      {children}
    </InternationalizationProvider>
  );
}`,
    },
    {
      label: 'Override one Solo string',
      code: `import type {ReactNode} from 'react';
import {InternationalizationProvider} from '@solo/core/i18n';

export function AppI18n({children}: {children: ReactNode}) {
  return (
    <InternationalizationProvider
      locale="en"
      overrides={{
        en: {'@solo.selector.placeholder': 'Choose...'},
      }}
    >
      {children}
    </InternationalizationProvider>
  );
}`,
    },
    {
      label: 'Provide a local fallback catalog',
      code: `import type {ReactNode} from 'react';
import {
  InternationalizationProvider,
  type MessagesByLocale,
} from '@solo/core/i18n';
import ptBR from './locales/pt-BR.json';

const messages: MessagesByLocale = {'pt-BR': ptBR};

export function AppI18n({children}: {children: ReactNode}) {
  return (
    <InternationalizationProvider locale="pt-BR" messages={messages}>
      {children}
    </InternationalizationProvider>
  );
}`,
    },
  ],
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'يلتف حول تطبيقك لتعيين اللغة المحلية النشطة ودمج كتالوجات ترجمة إضافية وتجاوزات لكل لغة اختياريًا، لكي تحلّ مكوّنات Solo نصوصها وفق هذا السياق.',
  propDescriptions: {
    locale: 'وسم لغة BCP 47 للغة المحلية النشطة (مثل "en" و "pt" و "pt-BR" و "zh-Hans"). تعود الوسوم الإقليمية إلى لغتها الأساسية، ثم إلى الكتالوج المرفق "en".',
    messages: 'خريطة اختيارية من وسم BCP 47 إلى كتالوج تشغيل غني أو مُولَّد. استورد الكتالوجات المرفقة المضغوطة من `@solo/core/locales/*.generated.js`؛ فالكتالوج المرفق "en" متاح دائمًا ولا يلزم إدراجه هنا.',
    overrides: 'تجاوزات متفرقة للمفاتيح لكل لغة محلية تُطبَّق فوق الإعدادات الافتراضية المرفقة. تُفهرس التجاوزات حسب اللغة المحلية لكي يلتقط تبديل اللغة أثناء التشغيل المجموعة الصحيحة.',
    dir: 'تجاوز صريح لاتجاه النص في السياق. عند حذفه، يُشتق الاتجاه من `locale` عبر `Intl.Locale.getTextInfo()`. يحدد هذا الاتجاه الذي يقرؤه Solo، لكنه لا يعيّن السمة `dir` في DOM؛ بل يجب عليك تعيين `dir` على `<html>` (أو عنصر مغلِّف) بنفسك، لأن مكوّنات Solo تعكس التخطيط والأيقونات الاتجاهية بناءً على `dir` في DOM، لا من هذه الخاصية. عيّن كليهما إلى القيمة نفسها وأبقهما متزامنين.',
    children: 'المحتوى المعروض مع موفّر التدويل.',
  },
  usage: {
    description: 'يلتف حول تطبيقك لتعيين اللغة المحلية النشطة ودمج كتالوجات ترجمة إضافية وتجاوزات لكل لغة (اختياريًا). تحلّ مكوّنات Solo داخل الشجرة الفرعية نصوصها وفق هذا السياق. وإذا لم يوجد موفّر، تعود المكوّنات إلى الإعدادات الافتراضية الإنجليزية المرفقة.',
    bestPractices: [
      {
        guidance: true,
        description: 'استخدم كتالوجات اللغات المحلية المرفقة مع Solo من `@solo/core/locales/*` عندما يتوفر كتالوج للغتك المستهدفة.',
      },
      {
        guidance: true,
        description: 'استخدم كتالوجًا محليًا بالبنية نفسها فقط عندما لا يكون Solo قد أرفق تلك اللغة بعد أو عندما تختبر ترجمات قيد الإنجاز.',
      },
      {
        guidance: true,
        description: 'استخدم وسوم BCP 47 حقيقية مثل `fr-FR` أو `pt-BR` أو `ar-SA`؛ فاللغات الإقليمية تعود إلى لغتها الأساسية قبل الإنجليزية.',
      },
      {
        guidance: true,
        description: 'عيّن السمة `dir` على `<html>` (أو عنصر مغلِّف) بنفسك؛ فالموفّر لا يعيّنها. تعكس مكوّنات Solo التخطيط والأيقونات الاتجاهية بناءً على `dir` في DOM، لذا لن تنعكس اللغة المكتوبة من اليمين إلى اليسار (RTL) بصريًا من دونها. استخدم `getLocaleDirection(locale)` لاشتقاق القيمة لكلٍّ من الموفّر و DOM.',
      },
      {
        guidance: false,
        description: 'تحويل خرائط الكتالوجات المخصصة إلى `any`؛ إذ تُصدّر حزمة i18n الأنواع `ProviderMessagesByLocale` و `MessagesByLocale` و `Catalog` و `RuntimeCatalog` لتحديد أنواع الكتالوجات المحلية.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Wraps app to set active locale and (optionally) merge translation catalogs + per-locale overrides. Solo components resolve strings against this context; missing keys fall back to shipped English.',
  usage: {
    description:
      'Wraps app to set active locale and (optionally) merge translation catalogs + per-locale overrides. Solo components resolve strings against this context; missing keys fall back to shipped English.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use compact shipped Solo catalogs from `@solo/core/locales/*.generated.js` when one exists for the target locale.',
      },
      {
        guidance: true,
        description:
          'Use a rich `Catalog` or compact `RuntimeCatalog` when Solo has not shipped the target locale or when testing in-progress translations.',
      },
      {
        guidance: true,
        description:
          'Use real BCP 47 tags like `fr-FR`, `pt-BR`, or `ar-SA`; regional locales fall back to base language before English.',
      },
      {
        guidance: true,
        description:
          'Set `dir` on `<html>` (or a wrapper) yourself; the provider does not. Solo mirrors layout and directional icons from the DOM `dir`, so an RTL locale will not mirror without it. Use `getLocaleDirection(locale)` for both the provider and the DOM.',
      },
      {
        guidance: false,
        description:
          'Cast custom catalog maps to `any`; the i18n package exports `ProviderMessagesByLocale`, `MessagesByLocale`, `Catalog`, and `RuntimeCatalog` for local catalog typing.',
      },
    ],
  },
  propDescriptions: {
    locale:
      'BCP 47 language tag (e.g. "en", "pt-BR"); regional tags fall back to base language then "en"',
    messages:
      'map of BCP 47 tag to a rich Catalog or generated RuntimeCatalog; "en" is always available',
    overrides:
      'sparse per-locale key overrides applied on top of shipped defaults',
  },
};
