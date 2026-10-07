/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'Tokenizer',
  displayName: 'Tokenizer',
  category: 'Form Controls',
  keywords: [
    'tokenizer',
    'multiselect',
    'multi-select',
    'chips',
    'tags',
    'combobox',
    'autocomplete',
    'taginput',
    'chipinput',
  ],
  playground: {
    // `value` is a required array of custom items the preview cannot
    // auto-generate; without a default the properties tab shows the
    // missing-props placeholder instead of the field. `searchSource` and
    // `onChange` are supplied by the preview's own fallbacks.
    defaults: {
      label: 'Tags',
      placeholder: 'Search...',
      value: [
        {id: '1', label: 'Design'},
        {id: '2', label: 'Engineering'},
      ],
    },
  },
  props: [
    {
      name: 'label',
      type: 'string',
      description: 'Accessible label for the input.',
      required: true,
    },
    {
      name: 'searchSource',
      type: '{search(query: string): T[] | Promise<T[]>; bootstrap(): T[] | Promise<T[]>; cancel?(): void}',
      description:
        'Data source (a SearchSource<T>) providing search and bootstrap methods for populating the dropdown; cancel aborts an in-flight search.',
      required: true,
    },
    {
      name: 'value',
      type: 'T[]',
      description: 'Array of currently selected items.',
      required: true,
    },
    {
      name: 'onChange',
      type: "(items: T[], change: {item: T; type: 'add' | 'create' | 'remove'} | {type: 'reorder'}) => void",
      description:
        "Called when selection changes. The change argument includes the affected item and type ('add' | 'create' | 'remove' | 'reorder'). Additions and removals (including Backspace on an empty input) are announced to screen readers via a polite live region.",
      required: true,
    },
    {
      name: 'placeholder',
      type: 'string',
      description:
        'Input placeholder text. Only shown when no tokens are selected.',
    },
    {
      name: 'maxEntries',
      type: 'number',
      description:
        'Maximum number of selections allowed. Input is hidden when the limit is reached.',
    },
    {
      name: 'hasClear',
      type: 'boolean',
      description: 'Show a clear-all button for bulk removal of all tokens.',
      default: 'false',
    },
    {
      name: 'renderToken',
      type: '(item: T, onRemove: () => void) => ReactNode',
      description:
        'Custom render function for selected tokens. Default renders Token with label and onRemove.',
    },
    {
      name: 'renderItem',
      type: '(item: T) => ReactNode',
      description:
        'Custom render function for dropdown items. Default renders TypeaheadItem.',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Disables the input and all token interactions.',
      default: 'false',
    },
    {
      name: 'htmlName',
      type: 'string',
      description:
        'The HTML name attribute for form submissions. Renders one hidden input per selected item id.',
    },
    {
      name: 'disabledMessage',
      type: 'string',
      description:
        'Explains why the tokenizer is disabled. With isDisabled, shows a tooltip on hover/keyboard focus and keeps the input focusable via aria-disabled (input stays blocked). Use this instead of wrapping a disabled Tokenizer in Tooltip. Disabled controls swallow the hover events an external Tooltip needs.',
    },
    {
      name: 'status',
      type: "{type: 'warning' | 'error' | 'success', message?: string}",
      description:
        'Validation status object with type and message for error/warning/success states.',
    },
    {
      name: 'statusVariant',
      type: "'attached' | 'detached' | 'tooltip'",
      description:
        'How the status message is placed relative to the input. attached overlaps directly below the input (bordered treatment); detached floats below as a separate element with spacing; tooltip renders no message box and surfaces the status through a tooltip on the on-field icon, for compact toolbar controls.',
      default: "'attached'",
    },
    {
      name: 'isLabelHidden',
      type: 'boolean',
      description: 'Visually hides the label while keeping it accessible.',
      default: 'false',
    },
    {
      name: 'description',
      type: 'string',
      description: 'Helper text displayed below the label.',
    },
    {
      name: 'isRequired',
      type: 'boolean',
      description: 'Marks the field as required.',
      default: 'false',
    },
    {
      name: 'isOptional',
      type: 'boolean',
      description: 'Shows an optional indicator on the label.',
      default: 'false',
    },
    {
      name: 'labelTooltip',
      type: 'string',
      description: 'Tooltip text shown on the label.',
    },
    {
      name: 'hasEntriesOnFocus',
      type: 'boolean',
      description: 'Show bootstrap results on focus before typing.',
      default: 'false',
    },
    {
      name: 'maxMenuItems',
      type: 'number',
      description:
        'Maximum number of search results to display. The hasCreate entry is offered on top of them, so a menu can show one more than this.',
      default: '10',
    },
    {
      name: 'menuWidth',
      type: 'number',
      description:
        'Fixed dropdown width in pixels. The menu never shrinks below its anchor width.',
    },
    {
      name: 'minQueryLength',
      type: 'number',
      description:
        'Minimum query length before the search source is queried. Below it no search runs, and the menu stays closed — unless hasCreate is set, in which case the "Create ..." entry is still offered, being derived from the typed text rather than fetched for it.',
      default: '1',
    },
    {
      name: 'emptySearchText',
      type: 'ReactNode',
      description:
        'Content shown when the query matched nothing. Takes a ReactNode, so the dead end can carry a link or a create row. Announced in a polite live region as the text it renders, read from the DOM; aria-hidden parts stay out of both, and content that renders no text announces nothing. null counts as not given, like undefined, and falls through to the default; pass an empty string to render nothing.',
      default: "'No results found'",
    },
    {
      name: 'emptySearchResultsText',
      type: 'string',
      description:
        'Deprecated: renamed to emptySearchText, which takes a ReactNode rather than a string, so every existing value stays valid. Still works exactly as released; emptySearchText wins when both are set.',
      default: "'No results found'",
    },
    {
      name: 'hasAutoFocus',
      type: 'boolean',
      description: 'Auto-focus the input on mount.',
      default: 'false',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      description: 'Input and token size.',
      default: "'md'",
    },
    {
      name: 'debounceMs',
      type: 'number',
      description:
        'Debounce delay in ms before triggering search. Set to 0 for synchronous sources.',
      default: '150',
    },
    {
      name: 'hasCreate',
      type: 'boolean',
      description:
        "Allow users to create new tokens from free-text input. When true, a \"Create\" option appears in the dropdown for typed text that doesn't match existing results. The onChange change type is 'create' for these items.",
      default: 'false',
    },
    {
      name: 'onChangeQuery',
      type: '(query: string) => void',
      description: 'Callback fired when the search query text changes.',
    },
    {
      name: 'startIcon',
      type: 'ReactNode | IconType',
      description:
        'Icon to display at the start of the input, before any tokens. Accepts a semantic icon name, an SVG icon component, or a ReactNode directly.',
      slotElements: [{__element: 'Icon', props: {icon: 'search', size: 'sm'}}],
    },
    {
      name: 'endContent',
      type: 'ReactNode',
      description:
        'Content to display at the end of the input row. Useful for buttons, result counts, or other controls.',
      slotElements: [
        {__element: 'Icon', props: {icon: 'chevronDown', size: 'sm'}},
        {__element: 'Badge', props: {label: '3'}},
      ],
    },
    {
      name: 'handleRef',
      type: 'React.Ref<TokenizerHandle>',
      description:
        'Imperative handle exposing focusInput(), focusFirstToken(), focusLastToken(), clearInput(), and selectAll().',
    },
    {
      name: 'width',
      type: 'SizeValue',
      description:
        'Width of the field (number = pixels, string used as-is, e.g. "100%"). Sizes the whole field (label, control, and status) so they stay aligned.',
    },
    {
      name: 'tokenOverflowBehavior',
      type: "'none' | 'unfocusedInline' | 'unfocusedLayer'",
      description:
        'Controls how tokens overflow when the container is too narrow.',
      default: "'none'",
    },
    {
      name: 'onFocus',
      type: '(e: FocusEvent<HTMLInputElement>) => void',
      description: 'Fires when focus enters the tokenizer input.',
    },
    {
      name: 'onBlur',
      type: '(e: FocusEvent<HTMLInputElement>) => void',
      description: 'Fires when focus leaves the tokenizer input.',
    },
    {
      name: 'className',
      type: 'string',
      description:
        'Tailwind classes for layout customization (margins, positioning, sizing), merged with the component classes through cn() (tailwind-merge), so a conflicting utility overrides the default.',
    },
  ],
  theming: {
    targets: [
      {
        className: 'solo-tokenizer',
        visualProps: ['size', 'status'],
        states: ['disabled'],
      },
    ],
  },
  usage: {
    description:
      'Tokenizer is a multi-select input that lets users search, select, and manage multiple items displayed as removable chips. Use it when users need to build a set of selections from a searchable data source, like adding team members, applying tags, or choosing filters.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Write a placeholder that tells users what they can search for, such as "Search people..." or "Add tags...", so the input is not a blank mystery.',
      },
      {
        guidance: true,
        description:
          'Set maxEntries when the number of selections should be bounded, like limiting a review to 5 approvers.',
      },
      {
        guidance: true,
        description:
          'Use hasCreate for free-form tagging where users need to enter values that do not exist in the search source.',
      },
      {
        guidance: true,
        description:
          'Show validation status with the status prop so users know immediately when a selection is missing or invalid.',
      },
      {
        guidance: false,
        description:
          "Don't use Tokenizer for single-item selection; use Typeahead instead. Tokenizer is for building sets of two or more items.",
      },
      {
        guidance: false,
        description:
          'Avoid applying custom colors to individual tokens inside a Tokenizer; use the default token style for visual consistency across the set.',
      },
      {
        guidance: false,
        description:
          "Don't hide the label; every Tokenizer needs a visible label so users understand what they are selecting. Use isLabelHidden only when surrounding context makes the purpose obvious.",
      },
      {
        guidance: false,
        description:
          'Wrap a disabled Tokenizer in Tooltip to explain why it is disabled; disabled controls swallow the hover events the wrapper needs. Use the disabledMessage prop instead.',
      },
    ],
    anatomy: [
      {
        name: 'Label',
        required: true,
        description:
          'The visible text above the input describing what the user is selecting. Also used as the accessible name.',
      },
      {
        name: 'Token chips',
        required: false,
        description:
          'Removable chips representing each selected item. Each chip shows a label and a remove button.',
      },
      {
        name: 'Search input',
        required: true,
        description:
          'The text input where users type to search the data source. Hides when maxEntries is reached.',
      },
      {
        name: 'Dropdown menu',
        required: false,
        description:
          'The search results list that appears below the input as the user types.',
      },
      {
        name: 'Spinner',
        required: false,
        description:
          'Loading indicator shown at the end of the field while a search is in flight.',
      },
      {
        name: 'End content',
        required: false,
        description:
          'A trailing slot after the input for action buttons, counts, or other controls.',
      },
      {
        name: 'Clear button',
        required: false,
        description:
          'A button that removes all selected tokens at once. Shown when hasClear is true and tokens are present.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentDoc} */
export const docsZh = {
  name: 'Tokenizer',
  displayName: 'Tokenizer',
  props: [
    {
      name: 'label',
      type: 'string',
      description:
        '\u8f93\u5165\u6846\u7684\u65e0\u969c\u788d\u6807\u7b7e\u3002',
      required: true,
    },
    {
      name: 'searchSource',
      type: '{search(query: string): T[] | Promise<T[]>; bootstrap(): T[] | Promise<T[]>; cancel?(): void}',
      description:
        '提供搜索和引导方法的数据源（SearchSource<T>），用于填充下拉列表；cancel 用于中止进行中的搜索。',
      required: true,
    },
    {
      name: 'value',
      type: 'T[]',
      description:
        '\u5f53\u524d\u5df2\u9009\u9879\u76ee\u7684\u6570\u7ec4\u3002',
      required: true,
    },
    {
      name: 'onChange',
      type: "(items: T[], change: {item: T; type: 'add' | 'create' | 'remove'} | {type: 'reorder'}) => void",
      description:
        "\u9009\u62e9\u53d8\u66f4\u65f6\u8c03\u7528\u3002change \u53c2\u6570\u5305\u542b\u53d7\u5f71\u54cd\u7684\u9879\u76ee\u548c\u7c7b\u578b\uff08'add' | 'create' | 'remove' | 'reorder'\uff09\u3002",
      required: true,
    },
    {
      name: 'placeholder',
      type: 'string',
      description:
        '\u8f93\u5165\u6846\u5360\u4f4d\u6587\u672c\u3002\u4ec5\u5728\u672a\u9009\u62e9\u4efb\u4f55\u6807\u8bb0\u65f6\u663e\u793a\u3002',
    },
    {
      name: 'maxEntries',
      type: 'number',
      description:
        '\u5141\u8bb8\u7684\u6700\u5927\u9009\u62e9\u6570\u91cf\u3002\u8fbe\u5230\u9650\u5236\u65f6\u8f93\u5165\u6846\u4f1a\u9690\u85cf\u3002',
    },
    {
      name: 'hasClear',
      type: 'boolean',
      description:
        '\u663e\u793a\u5168\u90e8\u6e05\u9664\u6309\u94ae\uff0c\u7528\u4e8e\u6279\u91cf\u79fb\u9664\u6240\u6709\u6807\u8bb0\u3002',
      default: 'false',
    },
    {
      name: 'renderToken',
      type: '(item: T, onRemove: () => void) => ReactNode',
      description:
        '\u5df2\u9009\u6807\u8bb0\u7684\u81ea\u5b9a\u4e49\u6e32\u67d3\u51fd\u6570\u3002\u9ed8\u8ba4\u6e32\u67d3\u5e26\u6709 label \u548c onRemove \u7684 Token\u3002',
    },
    {
      name: 'renderItem',
      type: '(item: T) => ReactNode',
      description:
        '\u4e0b\u62c9\u5217\u8868\u9879\u7684\u81ea\u5b9a\u4e49\u6e32\u67d3\u51fd\u6570\u3002\u9ed8\u8ba4\u6e32\u67d3 TypeaheadItem\u3002',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description:
        '\u7981\u7528\u8f93\u5165\u6846\u548c\u6240\u6709\u6807\u8bb0\u4ea4\u4e92\u3002',
      default: 'false',
    },
    {
      name: 'htmlName',
      type: 'string',
      description:
        '用于表单提交的 HTML name 属性。为每个已选项目的 id 渲染一个隐藏输入。',
    },
    {
      name: 'disabledMessage',
      type: 'string',
      description:
        'Explains why the tokenizer is disabled. With isDisabled, shows a tooltip on hover/keyboard focus and keeps the input focusable via aria-disabled (input stays blocked). Use this instead of wrapping a disabled Tokenizer in Tooltip. Disabled controls swallow the hover events an external Tooltip needs.',
    },
    {
      name: 'status',
      type: "{type: 'warning' | 'error' | 'success', message?: string}",
      description:
        '\u9a8c\u8bc1\u72b6\u6001\u5bf9\u8c61\uff0c\u5305\u542b\u7c7b\u578b\u548c\u6d88\u606f\uff0c\u7528\u4e8e\u9519\u8bef/\u8b66\u544a/\u6210\u529f\u72b6\u6001\u3002',
    },
    {
      name: 'statusVariant',
      type: "'attached' | 'detached' | 'tooltip'",
      description:
        '状态消息相对于输入框的放置方式。attached 直接叠加在输入框下方（带边框处理）；detached 作为独立元素浮于下方并留有间距；tooltip 不渲染消息框，而是通过输入框内状态图标的提示显示状态，适用于紧凑的工具栏控件。',
      default: "'attached'",
    },
    {
      name: 'isLabelHidden',
      type: 'boolean',
      description:
        '\u89c6\u89c9\u9690\u85cf\u6807\u7b7e\uff0c\u540c\u65f6\u4fdd\u6301\u5176\u53ef\u8bbf\u95ee\u6027\u3002',
      default: 'false',
    },
    {
      name: 'description',
      type: 'string',
      description:
        '\u663e\u793a\u5728\u6807\u7b7e\u4e0b\u65b9\u7684\u8f85\u52a9\u6587\u672c\u3002',
    },
    {
      name: 'isRequired',
      type: 'boolean',
      description: '\u5c06\u5b57\u6bb5\u6807\u8bb0\u4e3a\u5fc5\u586b\u3002',
      default: 'false',
    },
    {
      name: 'isOptional',
      type: 'boolean',
      description:
        '\u5728\u6807\u7b7e\u4e0a\u663e\u793a\u53ef\u9009\u6307\u793a\u5668\u3002',
      default: 'false',
    },
    {
      name: 'labelTooltip',
      type: 'string',
      description:
        '\u6807\u7b7e\u4e0a\u663e\u793a\u7684\u5de5\u5177\u63d0\u793a\u6587\u672c\u3002',
    },
    {
      name: 'hasEntriesOnFocus',
      type: 'boolean',
      description:
        '\u805a\u7126\u65f6\u5728\u8f93\u5165\u524d\u663e\u793a\u5f15\u5bfc\u7ed3\u679c\u3002',
      default: 'false',
    },
    {
      name: 'maxMenuItems',
      type: 'number',
      description:
        '下拉列表显示的最大搜索结果数。“创建 ...”条目会在此之外额外提供，因此菜单可能比该数量多显示一项。',
      default: '10',
    },
    {
      name: 'menuWidth',
      type: 'number',
      description: '下拉菜单的固定像素宽度。菜单不会小于其锚点宽度。',
    },
    {
      name: 'minQueryLength',
      type: 'number',
      description:
        '查询搜索源前的最小查询长度。低于该长度不会发起搜索，菜单保持关闭；但设置 hasCreate 时仍会提供“创建 ...”条目——该条目由输入的文本推导而来，并非通过搜索获取。',
      default: '1',
    },
    {
      name: 'emptySearchText',
      type: 'ReactNode',
      description:
        '查询无匹配结果时显示的内容。接受 ReactNode，因此可在无结果处放置链接或创建入口。会从 DOM 读取其渲染出的文本在礼貌性实时区域中播报；aria-hidden 的部分两处都不包含，不渲染任何文本的内容则不会播报。null 与 undefined 同样视为未提供，将回退到默认值；若要不渲染任何内容，请传入空字符串。',
      default: "'No results found'",
    },
    {
      name: 'emptySearchResultsText',
      type: 'string',
      description:
        '已弃用：改名为 emptySearchText，其类型由 string 放宽为 ReactNode，原有取值全部仍然有效。仍按已发布行为工作；两者同时设置时以 emptySearchText 为准。',
      default: "'No results found'",
    },
    {
      name: 'hasAutoFocus',
      type: 'boolean',
      description:
        '\u6302\u8f7d\u65f6\u81ea\u52a8\u805a\u7126\u8f93\u5165\u6846\u3002',
      default: 'false',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      description:
        '\u8f93\u5165\u6846\u548c\u6807\u8bb0\u7684\u5c3a\u5bf8\u3002',
      default: "'md'",
    },
    {
      name: 'debounceMs',
      type: 'number',
      description:
        '\u89e6\u53d1\u641c\u7d22\u524d\u7684\u9632\u6296\u5ef6\u8fdf\uff08\u6beb\u79d2\uff09\u3002\u540c\u6b65\u6570\u636e\u6e90\u8bbe\u7f6e\u4e3a 0\u3002',
      default: '150',
    },
    {
      name: 'hasCreate',
      type: 'boolean',
      description: "允许用户通过自由文本输入创建新令牌。为 true 时，对于不匹配现有结果的输入文本，下拉列表中会出现“创建”选项。这些项的 onChange 变更类型为 'create'。",
      default: 'false',
    },
    {
      name: 'onChangeQuery',
      type: '(query: string) => void',
      description:
        '\u641c\u7d22\u67e5\u8be2\u6587\u672c\u53d8\u66f4\u65f6\u89e6\u53d1\u7684\u56de\u8c03\u3002',
    },
    {
      name: 'startIcon',
      type: 'ReactNode | IconType',
      description:
        '\u5728\u8f93\u5165\u6846\u5f00\u5934\uff08token \u4e4b\u524d\uff09\u663e\u793a\u7684\u56fe\u6807\u3002\u63a5\u53d7\u8bed\u4e49\u56fe\u6807\u540d\u79f0\u3001SVG \u56fe\u6807\u7ec4\u4ef6\u6216\u76f4\u63a5\u4f20\u5165 ReactNode\u3002',
    },
    {
      name: 'endContent',
      type: 'ReactNode',
      description:
        '\u5728\u8f93\u5165\u884c\u672b\u5c3e\u663e\u793a\u7684\u5185\u5bb9\u3002\u9002\u7528\u4e8e\u6309\u94ae\u3001\u7ed3\u679c\u8ba1\u6570\u6216\u5176\u4ed6\u63a7\u4ef6\u3002',
    },
    {
      name: 'handleRef',
      type: 'React.Ref<TokenizerHandle>',
      description: '用于 focus() 和 blur() 控制的命令式句柄。',
    },
    {
      name: 'width',
      type: 'SizeValue',
      description: '字段宽度（数字为像素，字符串按原样使用，如 "100%"）。作用于整个字段（标签、控件和状态），使其保持对齐。',
    },
    {
      name: 'tokenOverflowBehavior',
      type: "'none' | 'unfocusedInline' | 'unfocusedLayer'",
      description: '控制容器过窄时令牌的溢出方式。',
      default: "'none'",
    },
    {
      name: 'onFocus',
      type: '(e: FocusEvent<HTMLInputElement>) => void',
      description: '焦点进入令牌输入框时触发。',
    },
    {
      name: 'onBlur',
      type: '(e: FocusEvent<HTMLInputElement>) => void',
      description: '焦点离开令牌输入框时触发。',
    },
    {
      name: 'className',
      type: 'string',
      description:
        'Tailwind classes for layout customization (margins, positioning, sizing), merged with the component classes through cn() (tailwind-merge), so a conflicting utility overrides the default.',
    },
  ],
  theming: {
    targets: [
      {
        className: 'solo-tokenizer',
        visualProps: ['size', 'status'],
        states: ['disabled'],
      },
    ],
  },
  usage: {
    description:
      'Tokenizer is a multi-select input that lets users search, select, and manage multiple items displayed as removable chips. Use it when users need to build a set of selections from a searchable data source, like adding team members, applying tags, or choosing filters.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Write a placeholder that tells users what they can search for, such as "Search people..." or "Add tags...", so the input is not a blank mystery.',
      },
      {
        guidance: true,
        description:
          'Set maxEntries when the number of selections should be bounded, like limiting a review to 5 approvers.',
      },
      {
        guidance: true,
        description:
          'Use hasCreate for free-form tagging where users need to enter values that do not exist in the search source.',
      },
      {
        guidance: true,
        description:
          'Show validation status with the status prop so users know immediately when a selection is missing or invalid.',
      },
      {
        guidance: false,
        description:
          "Don't use Tokenizer for single-item selection; use Typeahead instead. Tokenizer is for building sets of two or more items.",
      },
      {
        guidance: false,
        description:
          'Avoid applying custom colors to individual tokens inside a Tokenizer; use the default token style for visual consistency across the set.',
      },
      {
        guidance: false,
        description:
          "Don't hide the label; every Tokenizer needs a visible label so users understand what they are selecting. Use isLabelHidden only when surrounding context makes the purpose obvious.",
      },
      {
        guidance: false,
        description:
          'Wrap a disabled Tokenizer in Tooltip to explain why it is disabled; disabled controls swallow the hover events the wrapper needs. Use the disabledMessage prop instead.',
      },
    ],
    anatomy: [
      {
        name: 'Label',
        required: true,
        description:
          'The visible text above the input describing what the user is selecting. Also used as the accessible name.',
      },
      {
        name: 'Token chips',
        required: false,
        description:
          'Removable chips representing each selected item. Each chip shows a label and a remove button.',
      },
      {
        name: 'Search input',
        required: true,
        description:
          'The text input where users type to search the data source. Hides when maxEntries is reached.',
      },
      {
        name: 'Dropdown menu',
        required: false,
        description:
          'The search results list that appears below the input as the user types.',
      },
      {
        name: 'Spinner',
        required: false,
        description:
          'Loading indicator shown at the end of the field while a search is in flight.',
      },
      {
        name: 'End content',
        required: false,
        description:
          'A trailing slot after the input for action buttons, counts, or other controls.',
      },
      {
        name: 'Clear button',
        required: false,
        description:
          'A button that removes all selected tokens at once. Shown when hasClear is true and tokens are present.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description:
    'حقل إدخال متعدد الاختيار يتيح للمستخدمين البحث عن عناصر متعددة واختيارها وإدارتها، وتُعرض كرقاقات قابلة للإزالة.',
  propDescriptions: {
    label: 'التسمية القابلة للوصول لحقل الإدخال.',
    searchSource:
      'مصدر البيانات (SearchSource<T>) الذي يوفّر الدالتين search وbootstrap لتعبئة القائمة المنسدلة؛ وتُلغي cancel عملية البحث الجارية.',
    value: 'مصفوفة العناصر المحددة حاليًا.',
    onChange:
      'تُستدعى عند تغيّر الاختيار. يتضمن الوسيط change العنصر المتأثر ونوع التغيير (\'add\' | \'create\' | \'remove\' | \'reorder\'). تُعلَن الإضافات والإزالات (بما فيها الضغط على Backspace في حقل إدخال فارغ) لقارئات الشاشة عبر منطقة حية مهذبة (polite).',
    placeholder: 'النص الإرشادي لحقل الإدخال. لا يظهر إلا عند عدم تحديد أي رموز.',
    maxEntries:
      'الحد الأقصى لعدد الاختيارات المسموح بها. يُخفى حقل الإدخال عند بلوغ الحد.',
    hasClear: 'يعرض زر مسح الكل لإزالة جميع الرموز دفعة واحدة.',
    renderToken:
      'دالة عرض مخصصة للرموز المحددة. يعرض الخيار الافتراضي Token مع label وonRemove.',
    renderItem:
      'دالة عرض مخصصة لعناصر القائمة المنسدلة. يعرض الخيار الافتراضي TypeaheadItem.',
    isDisabled: 'يعطّل حقل الإدخال وجميع التفاعلات مع الرموز.',
    htmlName:
      'سمة name في HTML لإرسال النماذج. يعرض حقل إدخال مخفيًا واحدًا لكل معرّف عنصر محدد.',
    disabledMessage:
      'يوضّح سبب تعطيل Tokenizer. مع isDisabled، يعرض تلميحًا عند التمرير أو تركيز لوحة المفاتيح، ويُبقي حقل الإدخال قابلًا للتركيز عبر aria-disabled (مع بقاء الإدخال محظورًا). استخدمه بدلًا من تغليف Tokenizer معطَّل داخل Tooltip؛ إذ تبتلع عناصر التحكم المعطَّلة أحداث التمرير التي يحتاجها Tooltip الخارجي.',
    status:
      'كائن حالة التحقق يتضمن النوع والرسالة لحالات الخطأ والتحذير والنجاح.',
    statusVariant:
      'كيفية وضع رسالة الحالة بالنسبة إلى حقل الإدخال. attached يتراكب مباشرةً أسفل حقل الإدخال (بمعالجة ذات حدود)؛ وdetached يطفو أسفله كعنصر منفصل مع تباعد؛ وtooltip لا يعرض مربع رسالة ويُظهر الحالة عبر تلميح على الأيقونة داخل الحقل، وهو مناسب لعناصر التحكم المدمجة في أشرطة الأدوات.',
    isLabelHidden: 'يُخفي التسمية بصريًا مع إبقائها قابلة للوصول.',
    description: 'نص مساعد يُعرض أسفل التسمية.',
    isRequired: 'يحدد الحقل على أنه مطلوب.',
    isOptional: 'يعرض مؤشر «اختياري» على التسمية.',
    labelTooltip: 'نص التلميح المعروض على التسمية.',
    hasEntriesOnFocus: 'يعرض نتائج bootstrap عند التركيز قبل الكتابة.',
    maxMenuItems:
      'الحد الأقصى لعدد نتائج البحث المعروضة. يُعرض إدخال hasCreate إضافةً إليها، لذا قد تعرض القائمة عنصرًا واحدًا أكثر من هذا العدد.',
    menuWidth:
      'عرض ثابت للقائمة المنسدلة بالبكسل. لا تتقلص القائمة أبدًا إلى أقل من عرض العنصر المرتكزة إليه.',
    minQueryLength:
      'الحد الأدنى لطول الاستعلام قبل الاستعلام من مصدر البحث. دونه لا يُجرى أي بحث وتبقى القائمة مغلقة، إلا إذا ضُبط hasCreate، وفي هذه الحالة يظل إدخال "Create ..." معروضًا لأنه مشتق من النص المكتوب لا مجلوب بناءً عليه.',
    emptySearchText:
      'المحتوى المعروض عندما لا يطابق الاستعلام أي شيء. يقبل ReactNode، لذا يمكن أن تتضمن هذه النهاية المسدودة رابطًا أو صف إنشاء. يُعلَن في منطقة حية مهذبة (polite) بالنص الذي يعرضه كما يُقرأ من DOM؛ وتبقى الأجزاء ذات aria-hidden خارج كليهما، ولا يُعلَن شيء عن المحتوى الذي لا يعرض نصًا. تُعامَل null كأنها غير مُمرَّرة، مثل undefined، فيُستخدم الافتراضي؛ مرّر سلسلة نصية فارغة لعدم عرض أي شيء.',
    emptySearchResultsText:
      'مُهمَل: أُعيدت تسميته إلى emptySearchText الذي يقبل ReactNode بدلًا من سلسلة نصية، لذا تبقى كل القيم الحالية صالحة. لا يزال يعمل تمامًا كما صدر؛ وتكون الأولوية لـ emptySearchText عند ضبط كليهما.',
    hasAutoFocus: 'يركّز حقل الإدخال تلقائيًا عند التركيب.',
    size: 'حجم حقل الإدخال والرموز.',
    debounceMs:
      'مهلة التأخير (debounce) بالمللي ثانية قبل بدء البحث. اضبطها على 0 للمصادر المتزامنة.',
    hasCreate:
      'يسمح للمستخدمين بإنشاء رموز جديدة من نص حر. عند ضبطه على true، يظهر خيار "Create" في القائمة المنسدلة للنص المكتوب الذي لا يطابق النتائج الموجودة. يكون نوع التغيير في onChange لهذه العناصر \'create\'.',
    onChangeQuery: 'دالة استدعاء تُنفَّذ عند تغيّر نص استعلام البحث.',
    startIcon:
      'أيقونة تُعرض في بداية حقل الإدخال قبل أي رموز. تقبل اسم أيقونة دلاليًا، أو مكوّن أيقونة SVG، أو ReactNode مباشرةً.',
    endContent:
      'محتوى يُعرض في نهاية صف الإدخال. مفيد للأزرار أو أعداد النتائج أو عناصر تحكم أخرى.',
    handleRef:
      'مقبض أمري (imperative handle) يتيح focusInput() وfocusFirstToken() وfocusLastToken() وclearInput() وselectAll().',
    width:
      'عرض الحقل (number = بكسل، وstring يُستخدم كما هو، مثل "100%"). يحدد حجم الحقل بأكمله (التسمية وعنصر التحكم والحالة) لتبقى متحاذية.',
    tokenOverflowBehavior:
      'يتحكم في كيفية فيض الرموز عندما تكون الحاوية ضيقة جدًا.',
    onFocus: 'يُطلق عند دخول التركيز إلى حقل إدخال Tokenizer.',
    onBlur: 'يُطلق عند خروج التركيز من حقل إدخال Tokenizer.',
    className:
      'فئات Tailwind لتخصيص التخطيط (الهوامش والتموضع والأبعاد)، تُدمج مع فئات المكوّن عبر cn() (tailwind-merge)، بحيث تتجاوز الأداة المتعارضة القيمة الافتراضية.',
  },
  usage: {
    description:
      'Tokenizer حقل إدخال متعدد الاختيار يتيح للمستخدمين البحث عن عناصر متعددة واختيارها وإدارتها، وتُعرض كرقاقات قابلة للإزالة. استخدمه عندما يحتاج المستخدمون إلى بناء مجموعة من الاختيارات من مصدر بيانات قابل للبحث، مثل إضافة أعضاء الفريق أو تطبيق الوسوم أو اختيار عوامل التصفية.',
    bestPractices: [
      {
        guidance: true,
        description:
          'اكتب نصًا إرشاديًا يخبر المستخدمين بما يمكنهم البحث عنه، مثل "Search people..." أو "Add tags..."، حتى لا يكون حقل الإدخال فارغًا وغامضًا.',
      },
      {
        guidance: true,
        description:
          'اضبط maxEntries عندما يجب تقييد عدد الاختيارات، مثل حصر المراجعة في 5 معتمِدين.',
      },
      {
        guidance: true,
        description:
          'استخدم hasCreate للوسم الحر عندما يحتاج المستخدمون إلى إدخال قيم غير موجودة في مصدر البحث.',
      },
      {
        guidance: true,
        description:
          'اعرض حالة التحقق باستخدام الخاصية status ليعرف المستخدمون فورًا متى يكون الاختيار مفقودًا أو غير صالح.',
      },
      {
        guidance: false,
        description:
          'لا تستخدم Tokenizer لاختيار عنصر واحد؛ استخدم Typeahead بدلًا منه. فـ Tokenizer مخصص لبناء مجموعات من عنصرين أو أكثر.',
      },
      {
        guidance: false,
        description:
          'تجنّب تطبيق ألوان مخصصة على رموز فردية داخل Tokenizer؛ استخدم نمط الرمز الافتراضي للحفاظ على الاتساق البصري عبر المجموعة.',
      },
      {
        guidance: false,
        description:
          'لا تُخفِ التسمية؛ فكل Tokenizer يحتاج إلى تسمية مرئية ليفهم المستخدمون ما يختارونه. لا تستخدم isLabelHidden إلا عندما يجعل السياق المحيط الغرض واضحًا.',
      },
      {
        guidance: false,
        description:
          'تغليف Tokenizer معطَّل داخل Tooltip لتوضيح سبب تعطيله؛ إذ تبتلع عناصر التحكم المعطَّلة أحداث التمرير التي يحتاجها الغلاف. استخدم الخاصية disabledMessage بدلًا من ذلك.',
      },
    ],
    anatomy: [
      {
        name: 'التسمية',
        required: true,
        description:
          'النص المرئي أعلى حقل الإدخال الذي يصف ما يختاره المستخدم. يُستخدم أيضًا بوصفه الاسم القابل للوصول.',
      },
      {
        name: 'رقاقات الرموز',
        required: false,
        description:
          'رقاقات قابلة للإزالة تمثّل كل عنصر محدد. تعرض كل رقاقة تسمية وزر إزالة.',
      },
      {
        name: 'حقل البحث',
        required: true,
        description:
          'حقل إدخال النص الذي يكتب فيه المستخدمون للبحث في مصدر البيانات. يُخفى عند بلوغ maxEntries.',
      },
      {
        name: 'القائمة المنسدلة',
        required: false,
        description: 'قائمة نتائج البحث التي تظهر أسفل حقل الإدخال أثناء الكتابة.',
      },
      {
        name: 'مؤشر التحميل',
        required: false,
        description: 'مؤشر تحميل يُعرض في نهاية الحقل أثناء تنفيذ البحث.',
      },
      {
        name: 'المحتوى الختامي',
        required: false,
        description:
          'منفذ ختامي بعد حقل الإدخال لأزرار الإجراءات أو الأعداد أو عناصر تحكم أخرى.',
      },
      {
        name: 'زر المسح',
        required: false,
        description:
          'زر يزيل جميع الرموز المحددة دفعة واحدة. يظهر عندما تكون hasClear مضبوطة على true وتوجد رموز.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Multi-select typeahead w/ token chips for selected items. Composes BaseTypeahead for search+Token for chips.',
  usage: {
    description:
      'Multi-select input for searching and selecting multiple items as removable chips. Use for team members, tags, filters, or any set built from a searchable source.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Placeholder that communicates what to search, such as "Search people..." rather than blank.',
      },
      {
        guidance: true,
        description:
          'maxEntries when selections are bounded (e.g. 5 approvers max).',
      },
      {
        guidance: true,
        description:
          'hasCreate for free-form tagging with values not in the source.',
      },
      {
        guidance: true,
        description: 'status prop for immediate validation feedback.',
      },
      {
        guidance: false,
        description:
          "Don't use for single-item selection; use Typeahead instead.",
      },
      {
        guidance: false,
        description:
          'Avoid custom token colors; default style for consistency.',
      },
      {
        guidance: false,
        description:
          "Don't hide the label unless context makes purpose obvious.",
      },
      {
        guidance: false,
        description:
          'Wrap a disabled Tokenizer in Tooltip to explain why it is disabled; disabled controls swallow the hover events the wrapper needs. Use the disabledMessage prop instead.',
      },
    ],
  },
  propDescriptions: {
    label: 'Accessible label for input.',
    searchSource:
      'Data source w/ search+bootstrap methods for populating dropdown.',
    value: 'Array of currently selected items.',
    onChange:
      "Fired on selection change. Change arg includes affected item+type ('add'|'create'|'remove'|'reorder').",
    hasCreate:
      'Enable free-text token creation. Shows "Create" dropdown option for unmatched typed text.',
    placeholder: 'Input placeholder. Only shown when no tokens selected.',
    maxEntries: 'Max selections allowed. Input hidden at limit.',
    hasClear: 'Clear-all button for bulk removal.',
    renderToken:
      'Custom token render. Default renders Token w/ label+onRemove.',
    renderItem: 'Custom dropdown item render. Default renders TypeaheadItem.',
    isDisabled: 'Disables input+all token interactions.',
    htmlName: 'HTML name attr; one hidden input per selected item id.',
    status: 'Validation status w/ type+message for error/warning/success.',
    statusVariant:
      'How status message is placed: attached overlaps below input; detached floats below w/ spacing.',
    isLabelHidden: 'Visually hides label; keeps a11y.',
    description: 'Helper text below label.',
    isRequired: 'Marks field required.',
    isOptional: 'Shows optional indicator on label.',
    labelTooltip: 'Tooltip on label.',
    hasEntriesOnFocus: 'Show bootstrap results on focus before typing.',
    maxMenuItems:
      'Max search results shown; the hasCreate entry sits on top of them.',
    menuWidth: 'Fixed dropdown width in pixels.',
    minQueryLength:
      'Min query length before searching. Menu stays closed below it, except the hasCreate entry.',
    emptySearchText: 'Content when the query matched nothing. ReactNode.',
    emptySearchResultsText:
      'deprecated, use emptySearchText (ReactNode). still works as released; emptySearchText wins if both set.',
    hasAutoFocus: 'Auto-focus input on mount.',
    size: 'Input+token size.',
    debounceMs: 'Search debounce delay ms. 0 for sync sources.',
    onChangeQuery: 'Fired on search query text change.',
    startIcon:
      'Icon at input start, before tokens. Icon name, SVG component, or ReactNode.',
    endContent: 'Content at input row end. For buttons, counts, controls.',
    handleRef: 'Imperative handle for focus() and blur() control.',
    className:
      'Tailwind layout classes (margins, positioning); merged via cn(), so conflicting utilities override defaults.',
  },
};
