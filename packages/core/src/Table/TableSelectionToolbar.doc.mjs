/** @type {import('@solo/docs-types').ComponentDoc} */
export const docs = {
  name: 'TableSelectionToolbar',
  subComponentOf: 'Table',
  displayName: 'Table Selection Toolbar',
  description:
    'Selection-aware bulk-action surface built on Toolbar. Pass selectionState from useTableSelectionState so count, visibility, and complete clearing stay synchronized with the Table selection plugin. The component owns no table or sticky layout: place it in flow or apply caller-owned positioning through className.',
  props: [
    {
      name: 'selection',
      type: 'TableSelectionState',
      description:
        'Shared selection state returned by useTableSelectionState: selectedKeys, selectedCount, hasSelection, and clearSelection.',
      required: true,
    },
    {
      name: 'startContent',
      type: 'ReactNode',
      description:
        'Product-owned action controls aligned to the logical start. Child controls inherit the toolbar size.',
    },
    {
      name: 'centerContent',
      type: 'ReactNode',
      description:
        'Centered content, forwarded to Toolbar. Switches the layout to CSS grid (1fr auto 1fr).',
    },
    {
      name: 'label',
      type: 'string',
      description: 'Accessible name for the action surface.',
      default: "'Bulk actions'",
    },
    {
      name: 'renderSelectionLabel',
      type: '(selectedCount: number) => ReactNode',
      description:
        'Overrides the visible count text for localisation or domain-specific copy.',
      default: 'count => `${count} selected`',
    },
    {
      name: 'clearLabel',
      type: 'string',
      description:
        'Visible label for the command that clears the complete controlled selection.',
      default: "'Unselect All'",
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      description:
        'Toolbar size. Cascades to product action controls and the clear action.',
      default: "'sm'",
    },
    {
      name: 'variant',
      type: 'SectionVariant',
      description: 'Toolbar surface variant.',
      default: "'muted'",
    },
    {
      name: 'gap',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description:
        'Gap between items within each slot, forwarded to Toolbar.',
      default: '1',
    },
    {
      name: 'orientation',
      type: "'horizontal' | 'vertical'",
      description:
        'Orientation for keyboard navigation, forwarded to Toolbar. Controls which arrow keys move between items.',
      default: "'horizontal'",
    },
    {
      name: 'dividers',
      type: "Array<'top' | 'bottom' | 'start' | 'end'>",
      description:
        'Sides that get divider borders, forwarded to Toolbar.',
    },
    {
      name: 'className',
      type: 'string',
      description:
        'Tailwind classes for layout customization (margins, positioning, sizing), merged with the component classes through cn() (tailwind-merge), so a conflicting utility overrides the default.',
    },
  ],
  usage: {
    description:
      'Pass both outputs of useTableSelectionState to their matching consumers: selectionConfig to useTableSelection and selectionState to TableSelectionToolbar. Render product actions through startContent. Keep fixed or floating placement in the surrounding layout.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Pass selectionState directly from useTableSelectionState so the count and clear action stay synchronized with row selection.',
      },
      {
        guidance: true,
        description:
          'Provide product actions as startContent instead of encoding them as configuration objects.',
      },
      {
        guidance: false,
        description:
          'Inject the toolbar through the Table plugin or its horizontal scroll wrapper.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'سطح إجراءات جماعية مدرك للتحديد ومبني على Toolbar. مرِّر selectionState من useTableSelectionState كي يبقى العدد والظهور والمسح الكامل متزامنة مع إضافة التحديد في Table. لا يمتلك المكوّن أي تخطيط جدول أو تخطيط لاصق: ضعه ضمن التدفق أو طبّق تموضعًا يملكه المستدعي عبر className.',
  propDescriptions: {
    selection: 'حالة التحديد المشتركة التي يُرجعها useTableSelectionState: ‏selectedKeys، وselectedCount، وhasSelection، وclearSelection.',
    startContent: 'عناصر تحكم الإجراءات التي يملكها المنتج، بمحاذاة البداية المنطقية. ترث عناصر التحكم الفرعية حجم شريط الأدوات.',
    centerContent: 'محتوى موسَّط يُمرَّر إلى Toolbar. يحوّل التخطيط إلى شبكة CSS ‏(1fr auto 1fr).',
    label: 'الاسم القابل للوصول لسطح الإجراءات.',
    renderSelectionLabel: 'يتجاوز نص العدد المرئي للترجمة المحلية أو لصياغة خاصة بالمجال.',
    clearLabel: 'التسمية المرئية للأمر الذي يمسح التحديد المتحكَّم به بالكامل.',
    size: 'حجم شريط الأدوات. يُمرَّر إلى عناصر تحكم إجراءات المنتج وإجراء المسح.',
    variant: 'نمط سطح شريط الأدوات.',
    gap: 'المسافة بين العناصر داخل كل فتحة، تُمرَّر إلى Toolbar.',
    orientation: 'الاتجاه للتنقّل بلوحة المفاتيح، يُمرَّر إلى Toolbar. يتحكم في مفاتيح الأسهم التي تنقل بين العناصر.',
    dividers: 'الجوانب التي تحصل على حدود فاصلة، تُمرَّر إلى Toolbar.',
    className: 'أصناف Tailwind لتخصيص التخطيط (الهوامش، والتموضع، والأحجام)، تُدمج مع أصناف المكوّن عبر cn() ‏(tailwind-merge)، بحيث تتجاوز الأداة المتعارضة القيمة الافتراضية.',
  },
  usage: {
    description: 'مرِّر مخرجَي useTableSelectionState إلى المستهلكَين المطابقَين لهما: selectionConfig إلى useTableSelection وselectionState إلى TableSelectionToolbar. اعرض إجراءات المنتج عبر startContent. واترك التموضع الثابت أو العائم للتخطيط المحيط.',
    bestPractices: [
      {
        guidance: true,
        description: 'مرِّر selectionState مباشرةً من useTableSelectionState كي يبقى العدد وإجراء المسح متزامنين مع تحديد الصفوف.',
      },
      {
        guidance: true,
        description: 'قدّم إجراءات المنتج عبر startContent بدلًا من ترميزها ككائنات إعداد.',
      },
      {
        guidance: false,
        description: 'حقن شريط الأدوات عبر إضافة Table أو غلاف التمرير الأفقي الخاص بها.',
      },
    ],
  },
};

export const docsDense = {
  name: 'TableSelectionToolbar',
  displayName: 'Table Selection Toolbar',
  description:
    'Selection-aware Toolbar wrapper. Consumes selectionState from useTableSelectionState; owns count, clear, visibility, and Toolbar semantics. Caller owns actions and fixed/floating placement.',
  propDescriptions: {
    selection:
      'selectionState from useTableSelectionState: selectedKeys/count/presence + complete clear command',
    startContent: 'product-owned bulk action controls',
    centerContent: 'centered content (Toolbar); switches to 1fr auto 1fr grid',
    label: 'accessible toolbar name; defaults to Bulk actions',
    renderSelectionLabel: 'override visible count copy; receives selectedCount',
    clearLabel: 'complete-clear button label; defaults to Unselect All',
    size: 'Toolbar size; defaults to sm and cascades to child controls',
    variant: 'Toolbar surface; defaults to muted',
    gap: 'gap between items in each slot (Toolbar)',
    orientation: 'keyboard-navigation orientation (Toolbar)',
    dividers: 'sides with divider borders (Toolbar)',
    className: 'caller-owned layout/positioning classes',
  },
};
