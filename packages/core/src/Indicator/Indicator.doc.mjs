/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'Indicator',
  displayName: 'Indicator',
  group: 'Indicator',
  category: 'Form Controls',
  isHiddenFromOverview: true,
  keywords: [
    'indicator',
    'checkbox',
    'radio',
    'control',
    'selection',
    'mark',
    'tick',
    'themeable',
    'swap',
  ],
  description:
    'Decorative control visuals: the mark on a chosen option, the box a checkbox draws, the circle a radio draws. Rendered by Selector, CheckboxInput, RadioList, and menu selection rows. Replace one by name through defineTheme({indicators}) and every component drawing it follows.',
  components: [
    {name: 'CheckboxIndicator'},
    {name: 'CheckIndicator'},
    {name: 'RadioIndicator'},
  ],
  theming: {
    targets: [
      {
        className: 'solo-checkbox-indicator',
        visualProps: ['size'],
        states: ['checked', 'disabled'],
      },
      {className: 'solo-checkbox-indicator-check', visualProps: ['size']},
      {className: 'solo-checkbox-indicator-dash', visualProps: ['size']},
      {
        className: 'solo-radio-indicator',
        visualProps: ['size'],
        states: ['checked', 'disabled'],
      },
      {className: 'solo-radio-indicator-dot', visualProps: ['size']},
      // Retained beside the canonical names for backwards compatibility.
      // New themes use the canonical targets above.
      {
        className: 'solo-checkbox',
        visualProps: ['size'],
        states: ['checked', 'disabled'],
        deprecatedFor: 'checkbox-indicator',
      },
      {
        className: 'solo-radio',
        visualProps: ['size'],
        states: ['checked', 'disabled'],
        deprecatedFor: 'radio-indicator',
      },
      {
        className: 'solo-radio-dot',
        visualProps: ['size'],
        deprecatedFor: 'radio-indicator-dot',
      },
    ],
  },
  examples: [
    {
      label: 'Restyle an indicator (the common path)',
      code: `// Indicators render the same stable class targets wherever they appear, so
// one component override reaches the form control, the menu row, and any
// selection slot themed to use it. No indicator-specific API needed.
defineTheme({
  name: 'brand',
  components: {
    'checkbox-indicator': {
      base: {borderRadius: 'var(--radius-full)', borderWidth: '2px'},
      checked: {
        backgroundColor: 'var(--color-accent)',
        borderColor: 'var(--color-accent)',
      },
      'checked+disabled': {backgroundColor: 'var(--color-background-muted)'},
    },
    'radio-indicator': {base: {borderWidth: '2px'}},
    'radio-indicator-dot': {base: {borderRadius: '2px'}},
  },
});`,
    },
    {
      label: 'Replace an indicator with your own component',
      code: `// When the shape itself is wrong, hand the theme a component. It receives
// {state, size, isDisabled, children} and nothing else.
//
// Use theme tokens, never raw values — see the design tokens
// (\`@solo/core/tokens.css\`) for the full set.
// Color: --color-accent, --color-on-accent, --color-border,
// --color-border-emphasized, --color-background-surface, --color-background-muted.
// Radius: --radius-inner, --radius-full.
// Border width: --border-width.
import {isRenderable} from '@solo/core/utils';

function BrandCheckbox({state, size = 'md', isDisabled, children}) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: size === 'sm' ? 20 : 24,
        height: size === 'sm' ? 20 : 24,
        borderRadius: 'var(--radius-inner)',
        border: 'var(--border-width) solid var(--color-border-emphasized)',
        color: 'var(--color-accent)',
        opacity: isDisabled ? 0.5 : 1,
      }}>
      {/* children first: the owner passes a loading Spinner through it.
          isRenderable, NOT \`children ??\` — a host writes
          children={isBusy && <Spinner/>}, and \`false\` is neither null nor
          caught by ??, so a nullish check takes the children branch, renders
          nothing in it, and deletes your mark on every chosen row. */}
      {isRenderable(children)
        ? children
        : state === 'checked' && <StarGlyph />}
    </span>
  );
}

defineTheme({name: 'brand', indicators: {checkbox: BrandCheckbox}});`,
    },
    {
      label: 'Use radio visuals for single selection',
      code: `// Replacement is by NAME, so one entry reaches every component that draws
// that indicator. Here every option in a Selector listbox draws a radio —
// including the unselected ones, which a check mark cannot do.
import {RadioIndicator} from '@solo/core/Indicator';

defineTheme({name: 'brand', indicators: {check: RadioIndicator}});`,
    },
  ],
  usage: {
    description:
      'Indicators are the componentized selection visuals shared by CheckboxInput, RadioList, and menu selection rows. They are decorative: the owning component keeps the input, role, accessible name, focus, and keyboard behavior, while the indicator turns state into a picture. That split is what makes them themeable: restyle one through its class targets, or replace the component outright.',
    bestPractices: [
      {
        guidance: true,
        description:
          "Reach for the canonical `components['checkbox-indicator']` override first. Replacing the component is the heavier path, for when the shape itself is wrong.",
      },
      {
        guidance: true,
        description:
          'Match the shipped replacement-content branch with `isRenderable(children)`, not `children != null` or `children ?? mark`. The helper is deliberately shallow: it excludes nullish values, booleans, and the empty string, while React elements and containers take the replacement path even when their descendants render nothing. The owning control passes `children={isBusy && <Spinner/>}`, so a nullish check deletes the state mark whenever that value is `false`.',
      },
      {
        guidance: true,
        description:
          'A replacement must set aria-hidden. The owning control provides the role and accessible name; a visible indicator would be announced twice.',
      },
      {
        guidance: true,
        description:
          'Use theme tokens for every color, radius, and border width in a replacement. See the design tokens (`@solo/core/tokens.css`) for the set.',
      },
      {
        guidance: true,
        description:
          'Render a single root ELEMENT, and let it keep the border-radius you want the focus ring to follow. A control whose real input is visually hidden cannot show focus on that input, so the owner paints the standard ring onto the indicator element itself at focus time (useIndicatorFocusRing), and `outline` then picks up that element\'s radius. A replacement needs no cooperation and can forget nothing: the ring is never missing (WCAG 2.4.7), it is only the wrong shape if the root has no radius of its own. Do not draw a focus ring yourself; the owner already did.',
      },
      {
        guidance: false,
        description:
          'Thread hover or pressed state in as props. Interaction state reaches an indicator through the owner\'s CSS ancestor marker, so hovering the row tints the control with no props involved.',
      },
      {
        guidance: false,
        description:
          'Assume you are only mounted when selected. The host renders its indicator unconditionally and passes `state`, in every state; that is what lets a replacement draw where the default draws nothing (a radio\'s empty circle on an unchosen row). Drawing nothing in a state is a decision the indicator makes, not one the host makes for it.',
      },
    ],
    anatomy: [
      {
        name: 'Chrome (checkbox, radio)',
        required: true,
        description:
          'The persistent box or circle rendered by CheckboxIndicator and RadioIndicator in every state. CheckIndicator is the state mark itself and intentionally owns no chrome.',
      },
      {
        name: 'State mark',
        required: false,
        description:
          'The checkmark, indeterminate bar, or radio dot shown inside the chrome for the current state.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'مظاهر زخرفية لعناصر التحكم: العلامة على الخيار المختار، والمربع الذي يرسمه مربع الاختيار، والدائرة التي يرسمها زر الاختيار. تعرضها Selector وCheckboxInput وRadioList وصفوف التحديد في القوائم. استبدل أيًّا منها بالاسم عبر defineTheme({indicators}) وسيتبعها كل مكوّن يرسمها.',
  usage: {
    description: 'المؤشرات هي مظاهر التحديد المحوَّلة إلى مكوّنات والمشتركة بين CheckboxInput وRadioList وصفوف التحديد في القوائم. وهي زخرفية: يحتفظ المكوّن المالك بحقل الإدخال والدور والاسم القابل للوصول والتركيز وسلوك لوحة المفاتيح، بينما يحوّل المؤشر الحالة إلى صورة. هذا الفصل هو ما يجعلها قابلة للتخصيص عبر السمة: أعد تنسيق أحدها عبر أهداف الفئات الخاصة به، أو استبدل المكوّن كليًا.',
    bestPractices: [
      {guidance: true, description: 'ابدأ بالتجاوز القياسي `components[\'checkbox-indicator\']`. استبدال المكوّن هو المسار الأثقل، ويُلجأ إليه عندما يكون الشكل نفسه خاطئًا.'},
      {guidance: true, description: 'طابِق فرع المحتوى البديل المضمَّن باستخدام `isRenderable(children)`، لا `children != null` أو `children ?? mark`. الدالة المساعدة سطحية عن قصد: فهي تستبعد القيم الفارغة (nullish) والقيم المنطقية والنص الفارغ، بينما تسلك عناصر React والحاويات مسار البديل حتى عندما لا تعرض عناصرها الفرعية شيئًا. يمرّر عنصر التحكم المالك `children={isBusy && <Spinner/>}`، لذا فإن فحص القيم الفارغة يحذف علامة الحالة كلما كانت تلك القيمة `false`.'},
      {guidance: true, description: 'يجب أن يعيّن البديل aria-hidden. يوفّر عنصر التحكم المالك الدور والاسم القابل للوصول؛ والمؤشر المرئي لقارئات الشاشة سيُعلَن مرتين.'},
      {guidance: true, description: 'استخدم رموز تصميم السمة لكل لون ونصف قطر وعرض حد في البديل. راجع رموز التصميم (`@solo/core/tokens.css`) للاطلاع على المجموعة.'},
      {guidance: true, description: 'اعرض عنصرًا جذرًا واحدًا، ودعه يحتفظ بنصف قطر الحواف الذي تريد أن تتبعه حلقة التركيز. عنصر التحكم الذي يكون حقل إدخاله الفعلي مخفيًا بصريًا لا يمكنه إظهار التركيز على ذلك الحقل، لذا يرسم المالك الحلقة القياسية على عنصر المؤشر نفسه وقت التركيز (useIndicatorFocusRing)، ثم يأخذ `outline` نصف قطر ذلك العنصر. لا يحتاج البديل إلى أي تعاون ولا يمكنه نسيان شيء: فالحلقة لا تغيب أبدًا (WCAG 2.4.7)، وإنما يكون شكلها خاطئًا فقط إذا لم يكن للجذر نصف قطر خاص به. لا ترسم حلقة تركيز بنفسك؛ فقد رسمها المالك بالفعل.'},
      {guidance: false, description: 'تمرير حالة التمرير أو الضغط كخصائص. تصل حالة التفاعل إلى المؤشر عبر علامة سلف CSS لدى المالك، لذا فإن التمرير فوق الصف يلوّن عنصر التحكم دون أي خصائص.'},
      {guidance: false, description: 'افتراض أنه لا يُركَّب إلا عند التحديد. يعرض المضيف مؤشره دون شروط ويمرّر `state` في كل الحالات؛ وهذا ما يتيح للبديل أن يرسم حيث لا يرسم الافتراضي شيئًا (الدائرة الفارغة لزر الاختيار على صف غير مختار). عدم رسم أي شيء في حالة ما قرار يتخذه المؤشر، لا قرار يتخذه المضيف نيابةً عنه.'},
    ],
    anatomy: [
      {name: 'الإطار (مربع الاختيار، زر الاختيار)', required: true, description: 'المربع أو الدائرة الدائمة التي يعرضها CheckboxIndicator وRadioIndicator في كل الحالات. CheckIndicator هو علامة الحالة نفسها ولا يملك إطارًا عن قصد.'},
      {name: 'علامة الحالة', required: false, description: 'علامة الصح، أو الشريط غير المحدد، أو نقطة زر الاختيار المعروضة داخل الإطار للحالة الحالية.'},
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Decorative selection visuals: the mark on a chosen option, the checkbox box, the radio circle. Rendered by Selector/CheckboxInput/RadioList/menu rows. Replace one by name via defineTheme({indicators}) and every component drawing it follows.',
  usage: {
    description:
      'Componentized selection visuals shared by CheckboxInput, RadioList, and menu rows. Decorative: the owner keeps input/role/name/focus/keyboard; the indicator turns state into a picture. That split makes them themeable: restyle via class targets or replace the component.',
    bestPractices: [
      { guidance: true, description: "Prefer the canonical `components['checkbox-indicator']` override first. Replacing the component is the heavier path, for when the shape itself is wrong." },
      { guidance: true, description: 'Match the shipped replacement-content branch with `isRenderable(children)`, not `children != null` or `children ?? mark`. The helper is shallow: it excludes nullish values, booleans, and the empty string, while React elements and containers take the replacement path even when their descendants render nothing. The owner passes `children={isBusy && <Spinner/>}`, so a nullish check deletes the state mark whenever the value is `false`.' },
      { guidance: true, description: 'A replacement must set aria-hidden. The owner supplies role and accessible name; a visible indicator would be announced twice.' },
      { guidance: true, description: 'Use theme tokens for every color, radius, and border width in a replacement. See the design tokens (`@solo/core/tokens.css`) for the set.' },
      { guidance: true, description: 'Render a single root ELEMENT with the border-radius the focus ring should follow. The owner paints the standard ring onto the indicator at focus time (useIndicatorFocusRing) and outline picks up its radius; the ring is never missing (WCAG 2.4.7), only mis-shaped if the root lacks a radius. Do not draw a focus ring yourself.' },
      { guidance: false, description: 'Thread hover or pressed state in as props. Interaction state reaches an indicator through the owner\'s CSS ancestor marker.' },
      { guidance: false, description: 'Assume you are only mounted when selected. The host renders the indicator unconditionally and passes `state` in every state; that is what lets a replacement draw where the default draws nothing (a radio\'s empty circle on an unchosen row).' },
    ],
  },
  components: [
    {name: 'CheckboxIndicator'},
    {name: 'CheckIndicator'},
    {name: 'RadioIndicator'},
  ],
};
