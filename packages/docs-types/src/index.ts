/**
 * @file @solo/docs-types — authoring types for Solo's `.doc.mjs` files.
 *
 * The doc vocabulary (base, component, hook, template) as types only — no
 * parsers. Point a doc file at these with:
 *
 *   /** @type {import('@solo/docs-types').ComponentDoc} *\/
 *
 * Also covers `BlockTemplateDoc.order`; template `slug`/`order`/
 * `filter`/`previewAspectRatio`; Arabic (`docsAr`, `displayNameAr`,
 * `descriptionAr`) — see {@link DocModule}.
 */


// ===========================================================================
// base
// ===========================================================================

/**
 * @file Shared leaf primitives used across the doc types.
 */

/** Every authored documentation kind accepted by `parseDoc`. */
export type AuthoredDocKind =
  | 'component'
  | 'function'
  | 'generic'
  | 'page'
  | 'block'
  | 'schema'
  | 'command'
  | 'enum'
  | 'namespace';

/** Visibility of an authored doc in a compiled audience-specific bundle. */
export type DocAudience = 'public' | 'internal';

/**
 * Optional canonical placement request. The compiler resolves `parent` as a
 * stable doc reference. `slot` selects one parent-owned slot, and `order`
 * provides deterministic sibling ordering inside that slot.
 */
export interface DocPlacement {
  parent: string;
  slot?: string;
  order?: number;
}

/**
 * Tree metadata shared by every authored doc kind. The docs tree reads
 * `placement` for every guide and each integration's;
 * nothing reads `aliases` or `audience` yet. A reference topic
 * outside the docs tree that sets one fails to load.
 */
export interface AuthoredDocGraphFields {
  /** The doc's one parent in the docs tree: a namespace of its own package. */
  placement?: DocPlacement;
  /** Reserved: prior routes or names the docs tree will keep resolving.
   *  Nothing reads it yet. */
  aliases?: string[];
  /** Reserved: docs bundle audience; omit for public docs. Nothing reads it
   *  yet. */
  audience?: DocAudience;
}

/**
 * Stable public identity for generated registry resources.
 *
 * The converter derives a slug from the doc's stable `name` by default. Set
 * `slug` only when the public URL must differ from that derived value. When a
 * published slug changes, keep prior relative paths in `aliases` so existing
 * install commands continue to work.
 */
export interface RegistryDocIdentity {
  /** Lowercase kebab-case leaf slug override. */
  slug?: string;
  /** Prior paths within the item's kind root, without `.json`. */
  aliases?: string[];
}

/**
 * Documents one element in a component's anatomy breakdown.
 * Anatomy describes the visual/structural parts that make up a component
 * (e.g. a Button has: left icon, label, end content, container).
 *
 * @example
 * ```
 * {name: 'Label', required: true, description: 'Accessible text for the button. Set isLabelHidden to visually hide it.'}
 * {name: 'Left icon', required: false, description: 'Visually represents the meaning of the button label. Icon size is typically 16px.'}
 * ```
 */
export interface ComponentAnatomyElement {
  /** Human-readable element name. e.g. `"Label"`, `"Left icon"`, `"Container"` */
  name: string;
  /** Whether this element is required for the component to function. */
  required: boolean;
  /** What this element is and how it contributes to the component. 1-2 sentences. */
  description: string;
}

/**
 * A single do/don't best practice for a component.
 * Rendered as a table row with a colored "Do" or "Don't" badge
 * in the Guidance column and the description in the Practices column.
 *
 * @example
 * ```
 * {guidance: true, description: 'Convey clear action hierarchy. Each surface should only have 1 primary button.'}
 * {guidance: false, description: 'Overuse primary or special buttons. Overusing colored buttons creates visual confusion.'}
 * ```
 */
export interface ComponentBestPractice {
  /** `true` renders a green "Do" badge; `false` renders a red "Don't" badge.  */
  guidance: boolean;
  /** 1-2 short sentences of design guidance. Focus on how a designer
   *  would USE the component, not how it's built.
   *
   *  NEVER start with "Do" or "Don't" — the badge handles that.
   *
   *  Good: `"Convey clear action hierarchy. Each surface should only have 1 primary button."`
   *  Bad:  `"Do use clear action hierarchy."` */
  description: string;
}

/**
 * A component-specific accessibility requirement.
 *
 * Keep this focused on what a consumer must preserve in the rendered result:
 * naming, semantics, keyboard behavior, state exposure, contrast, and supported
 * content combinations. Repository audit procedure belongs in the wiki rubric,
 * not in this field.
 *
 * @example
 * ```
 * {name: 'Loading', description: 'Expose aria-busy and prevent duplicate activation unless the action is explicitly interruptible.'}
 * ```
 */
export interface ComponentAccessibilityRequirement {
  /** Short scannable label, e.g. `"Accessible name"` or `"Loading"`. */
  name: string;
  /**
   * The accessibility contract consumers must preserve. Write at about a
   * grade-7 reading level with short sentences, common words, and active
   * voice. For color contrast, put the ratio in `requirement`; name the exact
   * foreground, background, state, and any overlay in `description`; explain
   * exceptions in plain language; and include enough detail for a human or
   * agent to reproduce the check.
   */
  description: string;
  /** Groups related requirements in the docsite Accessibility tab. */
  category?: 'Color contrast' | 'Keyboard' | 'Semantics' | 'Content';
  /** Relevant WCAG success criterion, e.g. `"1.4.3 Contrast (Minimum)"`. */
  criterion?: string;
  /** Short threshold or rule, e.g. `"4.5:1"`, `"3:1"`, or `"Exempt"`. */
  requirement?: string;
  /** Component states covered by this requirement. */
  states?: string[];
}

export type ComponentAccessibilityThemeStatus = 'Pass' | 'Fail' | 'Not tested';

export type ComponentAccessibilityThemeApplicability =
  'Required' | 'Conditional' | 'Supplemental' | 'Decorative';

export interface ComponentAccessibilityThemeMeasurement {
  /** Column heading, e.g. `"Rest"` or `"Spinner"`. */
  label: string;
  /** Display value, e.g. `"15.13:1"`. */
  value: string;
  /** Optional supporting detail shown below the value, such as a worst case. */
  detail?: string;
  /**
   * Whether this measurement is required for every use, required only in some
   * contexts, shown as a supplemental cue, or decorative. Each theme declares
   * this intent, informed by the component contract. Never infer it from the
   * measured ratio. Non-required measurements do not determine row status.
   */
  applicability?: ComponentAccessibilityThemeApplicability;
  /** Rendered foreground and background colors used for this measurement. */
  colorPair?: {
    foreground: string;
    background: string;
  };
  /** Optional per-variant results shown from a compact details trigger. */
  breakdown?: Array<{
    label: string;
    value: string;
    detail?: string;
    colorPair: {
      foreground: string;
      background: string;
    };
    status?: 'Pass' | 'Fail';
  }>;
  /** Mark a failed measurement so the docsite can emphasize it. */
  status?: 'Pass' | 'Fail';
}

export interface ComponentAccessibilityThemeResult {
  /** Row heading, usually a component variant. */
  name: string;
  /** Measurements shown between the row heading and status. */
  measurements: ComponentAccessibilityThemeMeasurement[];
  /** Overall result for the row. */
  status: ComponentAccessibilityThemeStatus;
}

export interface ComponentAccessibilityThemeMode {
  /** Theme mode covered by these results. */
  mode: 'Light' | 'Dark';
  /** Detailed results for the component in this mode. */
  results: ComponentAccessibilityThemeResult[];
}

export interface ComponentAccessibilityThemeTable {
  /** Optional heading for one complete group of measurements. */
  title?: string;
  /** Explains the scope of this measurement group. */
  description?: string;
  /** Detailed results separated by theme mode. */
  modes: ComponentAccessibilityThemeMode[];
}

export interface ComponentAccessibilityThemeCoverage {
  /** Display name of the audited theme. */
  theme: string;
  /** Complete groups of measurements for this theme and component. */
  tables: ComponentAccessibilityThemeTable[];
  /** Theme visuals intentionally excluded from measurement, with a reason. */
  notMeasured?: string[];
}

/**
 * Code example for a component or sub-component.
 */
export interface ComponentExampleDoc {
  /** Optional heading shown above the code block. */
  label?: string;
  /** TSX source for the example. */
  code: string;
}

/**
 * Playground configuration for the interactive component preview.
 *
 * `defaults` provides the initial prop state for the playground. Every key
 * maps to a prop name, and the value is either:
 * - A **primitive** (string, number, boolean) — used directly as the prop value
 * - An **ComponentSlotElement** — resolved to a React element via createElement
 *
 * Props not listed in `defaults` fall back to the standard logic:
 * doc `default` values, then auto-generated values for required props.
 *
 * @example
 * ```
 * // Button — just override the label
 * playground: {
 *   defaults: {label: 'Click me', variant: 'primary'},
 * }
 *
 * // Card — provide children content
 * playground: {
 *   defaults: {
 *     padding: 4,
 *     children: {
 *       __element: 'VStack', props: {gap: 2}, children: [
 *         {__element: 'Heading', props: {level: 3}, children: 'Card Title'},
 *         {__element: 'Text', props: {type: 'body'}, children: 'Card content goes here.'},
 *       ],
 *     },
 *   },
 * }
 *
 * // Dialog — provide structured children
 * playground: {
 *   defaults: {
 *     isOpen: true,
 *     isInline: true,
 *     onOpenChange: undefined,
 *     children: {__element: 'Text', props: {type: 'body'}, children: 'Dialog content'},
 *   },
 * }
 * ```
 */
export interface ComponentPlaygroundConfig {
  /** Initial prop values for the playground preview.
   *  Keys are prop names. Values are primitives or ElementDescriptors. */
  defaults?: Record<string, unknown>;
  /** The component opens as a full-viewport overlay (e.g. via
   *  `dialog.showModal()`) and renders nothing inline while closed. The
   *  interactive preview shows an open-trigger placeholder instead of an
   *  empty stage while `isOpen` is false, and lets the real overlay render
   *  when opened. Include `isOpen: false` in `defaults` so the preview can
   *  bridge `onOpenChange` back into playground state.
   *
   *  Only for components with no inline containment (MobileNav, Lightbox).
   *  Components with an `isInline` docs-preview prop (Dialog, AlertDialog,
   *  CommandPalette) intentionally keep contained inline previews instead:
   *  the component is visible on load and knobs stay usable, whereas a real
   *  top-layer modal makes the rest of the page inert. */
  overlay?: boolean;
  /** Override the controlled prop and open value used by an overlay preview.
   *  Use with `overlay: true` when the component does not use `isOpen: true`
   *  to represent its open state. */
  overlayControl?: {
    /** Controlled prop that determines whether the overlay is open. */
    stateProp: string;
    /** Value assigned to stateProp when the preview's open button is used. */
    openValue: unknown;
  };
  /** The component reads AppShell mobile context and renders nothing
   *  without it (e.g. `MobileNavToggle` returns null unless the context
   *  reports an enabled mobile viewport — the default value outside
   *  AppShell never does). The interactive preview provides a simulated
   *  mobile AppShell context so the stage is not an empty box, keeps the
   *  drawer open state interactive, and notes the simulation under the
   *  rendered component. */
  appShellMobile?: boolean;
  /** Required parent wrapper for sub-components that depend on a parent
   *  context provider (e.g. `Tab` calls `useTabListContext()` and throws
   *  standalone). The preview wraps the component in this parent before
   *  rendering, injecting it as `children`. Provide any props the wrapper
   *  requires (e.g. a matching `value`).
   *
   *  @example
   *  ```
   *  playground: {wrapper: {component: 'TabList', props: {value: 'tab-1'}}}
   *  ```
   */
  wrapper?: {
    /** Parent component name as exported from `@solo/core`, e.g. `'TabList'`. */
    component: string;
    /** Props for the wrapper. The previewed sub-component becomes its `children` unless slotProp is set. */
    props?: Record<string, unknown>;
    /** Wrapper prop that receives the previewed sub-component instead of `children`. */
    slotProp?: string;
  };
}

/**
 * Documents a single component prop. Each prop the component accepts
 * should have an entry. Skip internal/styling props like `className`,
 * `style`, and `data-testid`.
 *
 * @example
 * ```
 * {name: 'label', type: 'string', description: 'Visible label text', required: true}
 * {name: 'size', type: "'sm' | 'md' | 'lg'", description: 'Control size', default: "'md'"}
 * {name: 'onChange', type: '(value: string) => void', description: 'Called when value changes.'}
 * ```
 */
export interface ComponentPropDoc {
  /** Prop name exactly as used in JSX, camelCased.
   *  Callbacks start with `on` (`"onChange"`, `"onToggle"`).
   *  Booleans use `is`/`has` prefix (`"isDisabled"`, `"hasHover"`). */
  name: string;
  /** TypeScript type signature as a string. Use single quotes for string
   *  literal unions. Keep close to the actual TS type.
   *
   *  Simple: `"string"`, `"boolean"`, `"ReactNode"`
   *  Union: `"'primary' | 'secondary' | 'ghost'"`
   *  Function: `"(checked: boolean, e: ChangeEvent) => void"`
   *  Async: `"(e: MouseEvent) => void | Promise<void>"`
   *  Generic: `"TableColumn<T>[]"` */
  type: string;
  /** What this prop does, in 1-2 sentences. Focus on behavior and
   *  consequences rather than restating the prop name.
   *
   *  Good: `"Shows a loading spinner and disables interaction."`
   *  Weak: `"Shows a loading spinner."` */
  description: string;
  /** Default value as a string, if the prop is optional and has one.
   *  String literals in single quotes: `"'md'"`, `"'balanced'"`.
   *  Other values unquoted: `"false"`, `"0"`, `"() => true"`.
   *  Omit entirely for required props or optional props with no default. */
  default?: string;
  /** True if the prop must be provided. Omit (don't set to false) if optional. */
  required?: boolean;
  /** For ReactNode props: the Solo components this slot typically accepts.
   *  Each entry is an ComponentSlotElement that the playground uses to
   *  create a default instance when the user toggles the slot on.
   *
   *  Single-element slots (icon, endContent) have one option with a toggle.
   *  Multi-element slots (children on List) can have options the user picks from.
   *
   *  The playground uses this instead of hardcoded component→control mappings.
   *  Omit for ReactNode props that accept plain text (label, description).
   *
   *  @example
   *  ```
   *  // Single option — renders as a toggle switch
   *  slotElements: [{__element: 'Icon', props: {icon: 'check', size: 'sm'}}]
   *
   *  // Multiple options — renders as a selector
   *  slotElements: [
   *    {__element: 'Icon', props: {icon: 'check', size: 'sm'}},
   *    {__element: 'Badge', props: {label: 'Badge'}},
   *  ]
   *  ```
   */
  slotElements?: ComponentSlotElement[];
}

/**
 * A serializable descriptor for a React element. The playground resolves
 * these at runtime via `createElement(Core[component], props, ...children)`.
 *
 * Use this for any prop value that needs to be a React element —
 * children slots, icon props, endContent, etc.
 *
 * @example
 * ```
 * // Simple element
 * {__element: 'Icon', props: {icon: 'check', size: 'sm'}}
 *
 * // Element with text children
 * {__element: 'Text', props: {type: 'body'}, children: 'Hello world'}
 *
 * // Nested composition
 * {__element: 'VStack', props: {gap: 2}, children: [
 *   {__element: 'Heading', props: {level: 3}, children: 'Title'},
 *   {__element: 'Text', props: {}, children: 'Body text'},
 * ]}
 * ```
 */
export interface ComponentSlotElement {
  /** Marker field — presence distinguishes this from a plain object prop value. */
  __element: string;
  /** Props passed to createElement. Omit or use {} for no props. */
  props?: Record<string, unknown>;
  /** Children — a string, another ComponentSlotElement, or an array of them. */
  children?: string | ComponentSlotElement | (string | ComponentSlotElement)[];
}

/**
 * Maps a standard CSS property to one or more internal CSS custom properties.
 *
 * Theme authors write standard CSS (e.g. `borderRadius: '32px'`). The theme
 * pipeline reads this metadata and expands it: emitting both the CSS property
 * AND the internal var(s) that the component reads.
 *
 * Entries are ordered by priority — earlier entries are emitted first.
 * When multiple entries share the same `property`, all fire (in order).
 *
 * The special `expand: 'container'` triggers the 7-token container padding
 * expansion instead of setting a specific var.
 *
 * @example
 * ```
 * // Simple: borderRadius → one internal var
 * { property: 'borderRadius', vars: ['--_card-radius'] }
 *
 * // Container expansion: padding → 7 container tokens
 * { property: 'padding', expand: 'container' }
 *
 * // Multiple vars from one property
 * { property: 'padding', vars: ['--_chat-composer-padding', '--_composer-button-offset'] }
 *
 * // Multiple entries for the same property (both fire, in order)
 * { property: 'padding', expand: 'container' },
 * { property: 'padding', vars: ['--_card-padding'] },
 * ```
 */
// SYNC: the docs website's copy of this interface — see the note on
// ComponentThemingTarget below.
export interface ComponentThemingDerivedVar {
  /** The standard CSS property name (camelCase) that theme authors write.
   *  e.g. `'borderRadius'`, `'padding'`, `'paddingBlock'` */
  property: string;
  /** Internal CSS custom property names to set when this property appears
   *  in a theme's component overrides. Omit when using `expand`. */
  vars?: string[];
  /** Named expansion strategy instead of specific vars.
   *  `'container'` — expands padding to 7 container layout tokens. */
  expand?: 'container';
  /** Emit only the internal `vars`, dropping the source property from the
   *  generated rule. Use when the class-carrying element must not receive the
   *  standard property itself — the value reaches a child through the var
   *  (e.g. TextArea's flush wrapper drives the inner textarea's inline
   *  padding). Without this, the property is emitted alongside the var. */
  replaces?: boolean;
}

/**
 * A theming target — a stable selector surface that `defineTheme` can target
 * via `@scope` selectors. Each component renders one or more stable `solo-*`
 * class names and reflects visual props/states as `data-*` attributes via
 * `themeProps()`, so themes and external CSS have an explicit prop-aware selector surface.
 *
 * @example
 * ```
 * {className: 'solo-button', visualProps: ['variant', 'size']}
 * {className: 'solo-avatar-status-dot', visualProps: ['variant']}
 * {className: 'solo-card'}
 * ```
 */
// SYNC: When adding a field here, add it to the docsite's generated-registry
// copy too (interface ThemingTarget).
// `next build` type-checks the emitted componentRegistry.ts against that copy,
// so a field present in a .doc.mjs but missing there fails the docsite build.
export interface ComponentThemingTarget {
  /** The stable CSS class name rendered by the component.
   *  Always starts with `solo-`.
   *  e.g. `"solo-button"`, `"solo-avatar-status-dot"`, `"solo-card"` */
  className: string;
  /** Visual prop names reflected on this element.
   *  These are the props passed to `themeProps()` as the second argument.
   *  Use these names to derive selectors: `variant` →
   *  `[data-variant="secondary"]`, `level` → `[data-level="2"]`. Values are
   *  reflected only as data attributes; the stable target class identifies the
   *  component or part. Omit if the component has no visual props. */
  visualProps?: string[];
  /** State names reflected on this element based on component state.
   *  Unlike visualProps (driven by props), these reflect runtime state
   *  (checked, selected, today, on, expanded, etc.). Use these names to derive
   *  selectors such as `[data-checked="checked"]`. Omit if the element has no
   *  state-driven selectors. */
  states?: string[];
  /** Set when this target has been renamed and this entry is the old name.
   *  The component continues emitting the class through `themeProps`'s
   *  `legacyNames`, so existing themes keep working while discovery and build
   *  guidance prefer the replacement. The value is the canonical target key
   *  without the `solo-` prefix — e.g. `"checkbox-indicator"`.
   *
   *  A theme target is public API; deprecation alone does not authorize
   *  removing either this metadata or runtime support. */
  deprecatedFor?: string;
}

/**
 * Documents a CSS custom property exposed by a component for theming.
 * These vars are set on the component's root element and can be overridden
 * via `defineTheme` component overrides.
 *
 * @example
 * ```
 * {name: '--_card-radius', description: 'Border radius', default: 'var(--radius-container)'}
 * {name: '--card-concentric-radius', description: 'Inner radius', derived: true, formula: 'max(0px, calc(var(--_card-radius) - var(--card-padding)))'}
 * ```
 */
export interface ComponentThemingVar {
  /** CSS custom property name, e.g. '--_card-radius' or '--button-focus-offset' */
  name: string;
  /** What this var controls */
  description: string;
  /** Default value as a CSS expression, e.g. 'var(--radius-container)' */
  default: string;
  /** Whether this var is derived from other vars (not directly settable) */
  derived?: boolean;
  /** CSS expression showing how derived vars are computed */
  formula?: string;
  /**
   * Whether this var is private (internal implementation detail).
   * Private vars are set by the derived var expansion pipeline — theme
   * authors write standard CSS properties instead of setting them directly.
   * Theming output hides private vars, and a theme must not set a
   * private var directly.
   */
  private?: boolean;
}

/**
 * Documents a hook parameter/option. Similar to ComponentPropDoc but for hook
 * arguments and options object fields.
 */
export interface HookParamDoc {
  /** Parameter or option field name. */
  name: string;
  /** TypeScript type signature as a string. */
  type: string;
  /** What this parameter does. 1-2 sentences. */
  description: string;
  /** Default value as a string, if optional with a default. */
  default?: string;
  /** True if required. Omit if optional. */
  required?: boolean;
}

/**
 * Documents a hook's return value field.
 */
export interface HookReturnDoc {
  /** Field name on the returned object, or 'value' for primitive returns. */
  name: string;
  /** TypeScript type. */
  type: string;
  /** What this return value provides. */
  description: string;
}

/**
 * Component usage documentation — a concise summary, design guidance,
 * component-specific accessibility requirements, and optional visual anatomy.
 *
 * ## description
 * Exactly 2-3 short sentences:
 * - Sentence 1: What the component is and does.
 * - Sentence 2-3: When to use it, or what context it belongs in.
 *
 * Reference tone: "Buttons provide visual cues for actions and events.
 * These fundamental components allow users to commit actions and navigate
 * a page flow. Use a Button when a user needs to submit a form, start a
 * new task or action, or trigger a new UI element to appear on the page."
 *
 * ## bestPractices
 * Array of 3-4 items. Usually 2 Do items, then 1-2 Don't items.
 * Each item is design guidance — not implementation details.
 * Never start the description with "Do" or "Don't".
 */
export interface UsageDoc {
  /** What the component is and when to use it. 2-3 short sentences.
   *
   *  Sentence 1: What the component is and does.
   *  Sentence 2-3: When to use it, or what context it belongs in.
   *
   *  e.g. `"Buttons provide visual cues for actions and events. These
   *  fundamental components allow users to commit actions and navigate
   *  a page flow. Use a Button when a user needs to submit a form,
   *  start a new task or action, or trigger a new UI element to appear
   *  on the page."` */
  description: string;
  /** 3-4 do/don't design guidance items. Usually 2 Do's then 1-2 Don'ts.
   *  Focus on how a designer would USE the component, not how it's built. */
  bestPractices?: ComponentBestPractice[];
  /** Accessibility requirements specific to this component and its supported
   * content combinations. Generic audit procedure stays in the wiki rubric. */
  accessibility?: ComponentAccessibilityRequirement[];
  /** Verified color-accessibility coverage for bundled themes. */
  accessibilityThemeCoverage?: ComponentAccessibilityThemeCoverage[];
  /** Structural/visual anatomy of the component. Each entry describes one
   *  element that makes up the component (icon slot, label, container, etc.).
   *  Order entries in the visual reading order (leading → trailing, top → bottom). */
  anatomy?: ComponentAnatomyElement[];
}


// ===========================================================================
// component
// ===========================================================================

/**
 * @file Component doc types (ComponentDoc + its field/variant types).
 */


/**
 * Shared fields between single-component and multi-component docs.
 * Do not use this interface directly — use `ComponentDoc` (the union type).
 */
export interface ComponentBaseDoc extends AuthoredDocGraphFields {
  /** Doc-kind discriminant for the stamped default-export format
   *  (`export default { type: 'component', ... }`). Optional: legacy
   *  `export const docs = {...}` docs omit it, and `parseDoc` falls back to
   *  shape-sniffing when it is absent. */
  type?: 'component';
  /**
   * Stable machine identity and directory name without the Solo prefix,
   * PascalCase (for example `Button`, `Table`, or `AppShell`). Do not change
   * this to edit the visible label; use `displayName` for that. Registry URLs
   * derive from this value by default.
   */
  name: string;
  /** Human-readable display name with spaces between words, used by the
   *  docsite gallery and sidebar. Matches the import name visually (so
   *  `"AppShell"` → `"App Shell"`, `"ChatMessageMetadata"` → `"Chat
   *  Message Metadata"`). Required so authors stay in control of how
   *  each component reads in the UI rather than relying on a build-time
   *  regex derivation. */
  displayName: string;
  /** Exact consumer import specifier for integration-owned components. */
  import?: string;
  /** Integration components only: the exact `name` of the Core ComponentDoc
   *  this component takes over for unqualified lookup, so every app that loads
   *  the integration gets this component from component detail, lists, search,
   *  swizzle, and issue routing. The Core original stays reachable with
   *  `--package @solo/core`. Set it only to intentionally own a Core
   *  identity; give an alternative or variant its own name instead. Older CLIs
   *  that do not read `replaces` keep the component under its own name. */
  replaces?: string;
  /** Search keywords for CLI discovery. Terms a developer might type when
   *  looking for this component: synonyms, related UI concepts, and common
   *  names from other design systems (MUI, Chakra, Radix, and others).
   *  Lowercase only. Used by `solo component <term>` for fuzzy matching.
   *  e.g. `['accordion', 'expand', 'toggle', 'disclosure']` for Collapsible */
  keywords?: string[];
  /** Sub-component names to hide from human-facing UI (CLI listings,
   *  docs catalogs). The components stay public and importable — agents
   *  and tooling can still discover them via source. Use when the
   *  directory's doc covers a group but some Solo*.tsx files shouldn't
   *  appear in the catalog. */
  hiddenComponents?: string[];
  /** Hide this entire component from human-facing UI (CLI listings,
   *  docs catalogs). The component stays public and importable — agents
   *  and tooling can still discover it via source. Use for shared
   *  primitives (NavIcon, NavMenu) that only make sense in the context
   *  of their parent compositions. */
  hidden?: boolean;
  /** Optional group for sidebar/docs organization.
   *  Components without a group appear flat in alphabetical order.
   *  Groups cluster related components that are always used together
   *  or are variants of each other. */
  group?: string;
  /** Component category for the overview page gallery. Independent of
   *  `group` (which is for the sidebar). Categories represent the
   *  component's functional role in a UI.
   *
   *  Valid values:
   *  - `'Action'` — interactive triggers: buttons, links, toggles, menus
   *  - `'Chat'` — conversational UI: messages, composers, layouts
   *  - `'Container'` — wrappers: cards, carousels, collapsibles
   *  - `'Content'` — display: text, icons, avatars, code blocks
   *  - `'Form Controls'` — data entry: text fields, selectors, date pickers
   *  - `'Data Input'` — deprecated compatibility alias for `'Form Controls'`
   *  - `'Data Visualization'` — charts, graphs, 3D visualizations
   *  - `'Feedback & Status'` — progress indication: spinners, banners, badges
   *  - `'Layout'` — structural: grid, stack, dividers, app shell
   *  - `'Navigation'` — wayfinding: tabs, breadcrumbs, sidebars
   *  - `'Overlay'` — layered UI: dialogs, popovers, tooltips
   *  - `'Table & List'` — tabular and list data display
   *  - `'Utility'` — providers and context: themes, link providers */
  category?:
    | 'Action'
    | 'Chat'
    | 'Container'
    | 'Content'
    | 'Form Controls'
    | 'Data Input'
    | 'Data Visualization'
    | 'Feedback & Status'
    | 'Layout'
    | 'Navigation'
    | 'Overlay'
    | 'Table & List'
    | 'Utility';
  /** When true, this component is excluded from the categorized overview
   *  page but remains in the sidebar and CLI. Use for sub-components that
   *  only make sense within a parent (e.g. BreadcrumbItem, DialogHeader)
   *  or internal primitives that shouldn't appear in the gallery. */
  isHiddenFromOverview?: boolean;
  /** Optional stable slug override and prior aliases for registry output. */
  registry?: RegistryDocIdentity;
  /** Theming configuration. Documents the stable selector surface rendered
   *  by this component: `solo-*` classes plus data-attribute reflections that
   *  themes can target via `@scope` selectors in `defineTheme`. */
  theming?: {
    /** Whether this component is a container whose `padding` properties
     *  should be mapped to container tokens by the theme pipeline.
     *  When true, `padding`, `paddingBlock`, `paddingInline` etc. in
     *  component overrides are expanded to `--container-padding-*` and
     *  `--layout-padding-*` tokens instead of emitting raw CSS. */
    container?: boolean;
    /** Selector targets rendered by this component.
     *  Each entry corresponds to an `themeProps()` call in the source. */
    targets: ComponentThemingTarget[];
    /** CSS custom properties exposed for theming. */
    vars?: ComponentThemingVar[];
    /** Maps standard CSS properties to internal vars for theme pipeline
     *  expansion. Ordered by priority — earlier entries emit first.
     *  The pipeline reads this to know: when a theme sets `borderRadius`
     *  on this component, also emit the internal var.
     *  @see ComponentThemingDerivedVar */
    derived?: ComponentThemingDerivedVar[];
  };
  /** Component usage documentation — concise summary, best practices,
   *  and optional visual anatomy. */
  usage: UsageDoc;
  /** Short code examples rendered by the CLI after the props table. */
  examples?: ComponentExampleDoc[];

  /** Playground configuration. Controls how the interactive preview
   *  renders this component with sensible defaults and slot content. */
  playground?: ComponentPlaygroundConfig;
}

/**
 * The documentation type for a component directory's {Name}.doc.mjs file.
 *
 * Every new .doc.mjs default-exports a stamped object of this type:
 *
 *   /\*\* \@type \{import('@solo/docs-types').ComponentDoc\} *\/
 *   export default \{ type: 'component', ... \};
 *
 * Use SingleComponentDoc (with `props`) for single-component directories.
 * Use MultiComponentDoc (with `components`) for multi-component directories.
 * Use SubComponentDoc (with `subComponentOf`) for a sub-component that lives
 * in its own file inside its parent's directory.
 */
export type ComponentDoc =
  SingleComponentDoc | MultiComponentDoc | SubComponentDoc;

/**
 * Documents one component within a multi-component directory. Used when a
 * directory exports multiple public components (e.g. Table exports Table,
 * BaseTable, TableRow, TableCell, TableHeaderCell).
 *
 * Also use for hooks that are part of a component API (e.g.
 * useTableSelection). For hook entries, document arguments in `params`
 * and return fields in `returns` so the docsite renders a Parameters / Returns
 * signature instead of an interactive Properties playground. Order components
 * with the primary/most-used component first.
 */
export interface ComponentEntry {
  /** Full export name including Solo prefix. e.g. `"TableRow"`,
   *  `"DialogHeader"`, `"useTableSelection"` */
  name: string;
  /** Human-readable display name for this subcomponent. Matches the import
   *  name visually with spaces between PascalCase / camelCase words
   *  (e.g. `"TableRow"` → `"Solo Table Row"`). See `ComponentBaseDoc.displayName`. */
  displayName: string;
  /** One-sentence description of what this specific component does.
   *  For sub-components, explain the role within the parent composition. */
  description: string;
  /** Optional stable slug override and prior aliases for this entry. */
  registry?: RegistryDocIdentity;
  /** All public props for this component. Omit for hook entries. */
  props?: ComponentPropDoc[];
  /** Hook parameters or options object fields. Use for `use*` entries. */
  params?: HookParamDoc[];
  /** Hook return value fields. Use for `use*` entries. */
  returns?: HookReturnDoc[];
  /** Usage documentation for this specific component or hook. */
  usage?: UsageDoc;
  /** Components this hook is commonly used with. */
  relatedComponents?: string[];
  /** Other hooks this hook is commonly used with. */
  relatedHooks?: string[];
  /** Short code examples rendered by the CLI after the props table. */
  examples?: ComponentExampleDoc[];
  /** When true, this sub-component is excluded from the overview page. */
  isHiddenFromOverview?: boolean;
  /** Playground configuration for this specific component. Falls back to
   *  the directory doc's `playground` when omitted — declare one here when
   *  siblings must not share it (e.g. an overlay drawer whose toggle
   *  sub-component should not inherit `overlay: true`). */
  playground?: ComponentPlaygroundConfig;
}

/**
 * Metadata for a component group that is NOT itself a component.
 *
 * Some groups (e.g. 'Checkbox', 'Layout', 'Tabs') are category labels —
 * they cluster related components but have no corresponding Solo*.tsx file.
 * This metadata tells the docsite and CLI which component to treat as the
 * canonical entry point for the group.
 *
 * Groups whose name IS a component (e.g. 'Avatar', 'Button', 'Dialog')
 * don't need an entry here — the component IS the canonical representative.
 *
 * @example
 * ```
 * { name: 'Checkbox', canonical: 'CheckboxList', description: 'Selection controls for choosing one or more options from a set.' }
 * { name: 'Layout', canonical: 'Stack', description: 'Structural primitives for page and content layout.' }
 * ```
 */
export interface ComponentGroupDoc {
  /** Group name — must match one of the `group` union values on ComponentBaseDoc. */
  name: string;
  /** The canonical component for this group — the one the docsite links
   *  to when a user clicks the group name. Should be the most commonly
   *  used or most representative component in the group.
   *  e.g. `'CheckboxList'` for the Checkbox group. */
  canonical: string;
  /** One-sentence description of what this group of components does.
   *  Shown in the sidebar, catalog, or group landing page. */
  description: string;
}

/**
 * A cross-link reference to a sub-component that lives in its own sibling
 * `{Name}.doc.mjs` file (see {@link SubComponentDoc}). The parent's
 * `components` array lists these names so the family stays discoverable;
 * the entry's content is emitted from the sub-component's own file, not here.
 */
export interface ComponentRef {
  /** Full export name including Solo prefix, e.g. `"ChatComposer"`. Must
   *  match the `name` field of the referenced sub-component's own doc. */
  name: string;
}

/**
 * Translation overlay for component documentation.
 *
 * Contains only the prose fields that change between languages/formats.
 * The CLI merges this onto the base `docs` at read time — props,
 * types, defaults, and code all come from `docs`.
 *
 * Used by both `docsZh` (Chinese translation) and `docsDense` (compressed format).
 */
export interface ComponentTranslationDoc {
  /** Compressed/translated component description. */
  description?: string;
  /** Prop descriptions keyed by prop name. Only include props that have descriptions. */
  propDescriptions?: Record<string, string>;
  /** Translated/compressed usage overlay. Mirrors UsageDoc fields. */
  usage?: {
    description?: string;
    bestPractices?: ComponentBestPractice[];
    accessibility?: ComponentAccessibilityRequirement[];
    anatomy?: ComponentAnatomyElement[];
  };
  /** Sub-component translations. Must match docs.components length and order (if present). */
  components?: {
    /** Exact name from docs.components[n].name */
    name: string;
    /** Optional translated displayName for the sub-component. Allowed so
     *  the displayName backfill codemod (which adds `displayName` next
     *  to every `name:` field) does not break translation overlays.
     *  Translation overlays render via the canonical docs, so this
     *  field is ignored at render time. */
    displayName?: string;
    /** Compressed/translated sub-component description. */
    description: string;
    /** Prop descriptions keyed by prop name. */
    propDescriptions?: Record<string, string>;
    /** When true, this sub-component is excluded from the overview page. */
    isHiddenFromOverview?: boolean;
  }[];
}

/**
 * Documentation for a directory that exports multiple public components.
 * Props live on each entry in `components`.
 *
 * Use this when the directory has multiple component `*.tsx` files
 * (e.g. Table, Dialog, TabList, TopNav, Layout).
 *
 * Each `components` entry is either a full {@link ComponentEntry} (inline
 * sub-component) or a name-only {@link ComponentRef} pointing at a sibling
 * `{Name}.doc.mjs` file. The two styles can be mixed during migration.
 */
export interface MultiComponentDoc extends ComponentBaseDoc {
  /** Each public component/hook exported from this directory — either an
   *  inline entry or a name-only reference to a sibling sub-component doc. */
  components: (ComponentEntry | ComponentRef)[];
}

/**
 * Documentation for a directory that exports a single primary component.
 * Props live directly on this object.
 *
 * Use this when the directory has one main component `*.tsx` file
 * (e.g. Switch, Badge, Spinner, TextInput).
 */
export interface SingleComponentDoc extends ComponentBaseDoc {
  /** All public props for the component. */
  props: ComponentPropDoc[];
}

/**
 * Documentation for a single sub-component that lives in its own
 * `{Name}.doc.mjs` file inside its parent's directory. Identified by the
 * `subComponentOf` field, which names the parent component.
 *
 * A sub-component owns its `description`, `props`, and (optionally) its own
 * `usage`. Family-level fields (`group`, `category`, `keywords`, `theming`,
 * `playground`) are inherited from the directory's primary doc unless
 * overridden here. The generated registry entry is identical to the legacy
 * inline `components[]` expansion — this is purely a file-structure change.
 */
export interface SubComponentDoc extends Omit<ComponentBaseDoc, 'usage'> {
  /** Name of the parent component this sub-component belongs to, matching the
   *  parent doc's `name` (e.g. `"Chat"`). Marks this file as a sub-component
   *  doc so the pipeline parents and inherits family fields correctly. */
  subComponentOf: string;
  /** One-sentence description of what this sub-component does and its role
   *  within the parent composition. */
  description: string;
  /** All public props for this sub-component. */
  props: ComponentPropDoc[];
  /** Usage is optional for sub-components — when omitted, generated surfaces
   *  should use the sub-component's own description as the concise usage
   *  summary (not inherited from the parent, which was the #2602 bug). */
  usage?: UsageDoc;
}


// ===========================================================================
// hook
// ===========================================================================

/**
 * @file Hook/function doc types.
 */


/**
 * Documentation for a standalone hook's .doc.mjs file.
 *
 * Hooks that are part of a component's API (e.g. useImperativeDialog)
 * should be documented in the component's MultiComponentDoc.components array.
 *
 * Standalone hooks (e.g. useMediaQuery, useFocusTrap, useOverflow) get
 * their own {hookName}.doc.mjs file and use this type.
 *
 * Every new hook .doc.mjs default-exports a stamped object:
 *
 *   /\*\* @type {import('@solo/docs-types').HookDoc} \*\/
 *   export default { type: 'function', ... };
 */
export interface HookDoc extends AuthoredDocGraphFields {
  /** Doc-kind discriminant for the stamped default-export format
   *  (`export default { type: 'function', ... }`). Optional: legacy
   *  `export const docs = {...}` docs omit it. */
  type?: 'function';
  /** Hook name exactly as exported, e.g. 'useMediaQuery', 'useFocusTrap'. */
  name: string;
  /** Human-readable display name for the hook. Hooks read better as the
   *  raw identifier ('useMediaQuery') than spaced ('use Media Query'), so
   *  the codemod keeps the identifier verbatim. See `ComponentBaseDoc.displayName`. */
  displayName: string;
  /** Optional group for sidebar/docs organization — same as ComponentDoc.group. */
  group?: string;
  /** Search keywords for CLI discovery. */
  keywords?: string[];
  /** Optional stable slug override and prior aliases for registry output. */
  registry?: RegistryDocIdentity;
  /** Hook parameters or options object fields. */
  params: HookParamDoc[];
  /** Return value documentation. For object returns, list each field.
   *  For primitive returns, use a single entry. */
  returns: HookReturnDoc[];
  /** Usage documentation — description, best practices. */
  usage: UsageDoc;
  /** Component names this hook is commonly used with.
   *  Enables cross-referencing: \`solo component Toast\` can mention useToast,
   *  and \`solo hook useToast\` can link back to Toast. */
  relatedComponents?: string[];
  /** Other hook names this hook is commonly used with. */
  relatedHooks?: string[];
  /** Import path, e.g. '@solo/core/hooks' or '@solo/core/Toast'. */
  importPath?: string;
  /** Category for grouping in listings. */
  category?: string;
}

/**
 * Translation overlay for hook documentation.
 */
export interface HookTranslationDoc {
  /** Compressed/translated description. */
  description?: string;
  /** Param descriptions keyed by param name. */
  paramDescriptions?: Record<string, string>;
  /** Return descriptions keyed by field name. */
  returnDescriptions?: Record<string, string>;
  /** Translated usage. */
  usage?: {
    description?: string;
    bestPractices?: ComponentBestPractice[];
    accessibility?: ComponentAccessibilityRequirement[];
  };
}


// ===========================================================================
// template
// ===========================================================================

/**
 * @file Template doc types.
 */


export interface BaseTemplateDoc extends AuthoredDocGraphFields {
  /** Identifier name for the template. For block templates this matches
   *  the React component import name (e.g. `"ChatMessageMetadata"`); for
   *  page templates it's a human-readable label that doubles as the
   *  display value (e.g. `"Dashboard"`). */
  name: string;
  /** Human-readable display name for the gallery / CLI. Matches `name`
   *  for already-spaced template names (e.g. `"Blank Page"`); for block
   *  templates that mirror a PascalCase component, spaces it out
   *  (`"ChatMessageMetadata"` → `"Chat Message Metadata"`). Required so
   *  authors stay in control of the visible label rather than relying
   *  on a build-time regex derivation. */
  displayName: string;

  /** One-sentence description of what the template provides. */
  description?: string;

  /** Optional stable slug override and prior aliases for registry output. */
  registry?: RegistryDocIdentity;

  /** Integration templates only: the exact id of the Core template this one
   *  replaces for unqualified lookup. The Core template stays selectable
   *  by its package. */
  replaces?: string;
  /** Whether this template is ready for use. Templates with
   *  isReady: false show as "(WIP)" in the gallery and CLI. */
  isReady?: boolean;

  /** Whether this template is a scaffolding tool only (e.g. blank page).
   *  Scaffold templates are available via the CLI but hidden from
   *  browsable template galleries like the craft browser. */
  scaffold?: boolean;

  /** Functional category for the docsite Templates overview gallery.
   *  Templates are grouped by the part before `" - "` (e.g. `"Dashboard"`).
   *  Independent of CLI discovery, which uses `name`/`description`. */
  category?: TemplateCategory;

  /** Boolean opt-out for templates that shouldn't appear on the Templates
   *  overview gallery. The template stays available via the CLI and
   *  `solo template <name>` — it's only hidden from the browsable gallery.
   *  Use for duplicate/experimental variants. Scaffold templates are
   *  hidden automatically and don't need this flag. */
  isHiddenFromOverview?: boolean;
}

export interface BlockTemplateDoc extends BaseTemplateDoc {
  type: 'block';
  /** The component this block is an example of. When omitted, the block is a
   *  standalone composition and is not owned by any component doc page. */
  exampleFor?: string;
  /** Additional component or hook doc pages whose Examples section should
   *  include this block. Use when a component example is also the canonical
   *  usage example for one of that component's hooks. */
  alsoExampleFor?: string[];
  /** Additional component or hook doc pages whose hero showcase should reuse
   *  this block. Unlike `isShowcase`, this does not make the block the primary
   *  showcase for `exampleFor`; it only creates explicit secondary placements. */
  alsoShowcaseFor?: string[];
  /** Width-to-height ratio for preview containers (e.g. 16/9, 1, 3/4). */
  aspectRatio: number;
  /** Scale factor for the block preview (default 1). */
  scale?: number;
  /** Component names this block uses, for cross-referencing.
   *  Powers "See also" and "Used in" sections — not for primary attribution. */
  componentsUsed?: string[];
  /** When true this block is the canonical hero showcase for `exampleFor`.
   *  Requires `exampleFor`; standalone blocks cannot be component showcases. */
  isShowcase?: boolean;
  /** Solo: Arabic (ar-SA) display name for RTL docs. */
  displayNameAr: string;
  /** Solo: Arabic (ar-SA) description for RTL docs. */
  descriptionAr: string;
  /** Solo: position of this block among its component's examples (0-based).
   *  The `<Component>Showcase` block, when present, is `0` and is the page
   *  overview; the rest follow Solo's docsite order (alphabetical by name). */
  order: number;
}

export interface PageTemplateDoc extends BaseTemplateDoc {
  type: 'page';
  /** Solo: the template's folder in @solo/templates (`src/<slug>/`). */
  slug: string;
  /** Solo: position in the Templates gallery, as on the Solo site
   *  (category group, then group, then name; templates the gallery hides —
   *  not ready or `isHiddenFromOverview` — come last). */
  order: number;
  /** Solo: the gallery filter chip the template appears under — the
   *  category group (text before " - "). `null` for an uncategorized,
   *  hidden template. */
  filter: TemplateFilter | null;
  /** Solo: preview width/height for the gallery card (Solo: 1440×900). */
  previewAspectRatio: number;
  /** Solo: Arabic (ar-SA) display name for RTL docs. */
  displayNameAr: string;
  /** Solo: Arabic (ar-SA) description for RTL docs. */
  descriptionAr: string;
}

/** The Templates gallery filter chips, in the order the gallery shows them. */
export type TemplateFilter =
  | 'Dashboard'
  | 'Table'
  | 'Form'
  | 'Settings'
  | 'Login'
  | 'Tools'
  | 'Content'
  | 'AI Chat'
  | 'Gallery'
  | 'Shell';

/** Arabic (ar-SA) names of the Templates gallery filter chips. */
export const TEMPLATE_FILTER_NAMES_AR: Readonly<Record<TemplateFilter, string>> = {
  Dashboard: 'لوحات المعلومات',
  Table: 'الجداول',
  Form: 'النماذج',
  Settings: 'الإعدادات',
  Login: 'تسجيل الدخول',
  Tools: 'الأدوات',
  Content: 'المحتوى',
  'AI Chat': 'محادثة الذكاء الاصطناعي',
  Gallery: 'المعارض',
  Shell: 'الهياكل',
};

/** Runtime list of {@link TemplateFilter} values, in gallery order. */
export const TEMPLATE_FILTERS: readonly TemplateFilter[] = [
  'Dashboard',
  'Table',
  'Form',
  'Settings',
  'Login',
  'Tools',
  'Content',
  'AI Chat',
  'Gallery',
  'Shell',
];

/**
 * Functional category for a page template, used to group templates on the
 * docsite Templates overview gallery. Independent of any sidebar/nav grouping.
 *
 * Values follow a `"Group - Variant"` convention (e.g. `"Dashboard - Analytics"`).
 * The overview page derives the group heading from the text before the `" - "`.
 * Standalone values without a hyphen (e.g. `"Settings"`) are their own group.
 *
 * Not every value maps to an existing template — unused values are reserved
 * for future templates so authors get autocomplete for the full taxonomy.
 */
export type TemplateCategory =
  // Dashboard
  | 'Dashboard - Analytics'
  | 'Dashboard - Comparison'
  | 'Dashboard - KPI Summary'
  | 'Dashboard - Monitoring'
  | 'Dashboard - Executive Summary'
  | 'Dashboard - Scorecard'
  | 'Dashboard - Widget Grid'
  | 'Dashboard - Split'
  | 'Dashboard - Tabbed'
  | 'Dashboard - Filterable'
  | 'Dashboard - Portfolio'
  | 'Dashboard - Project Status'
  | 'Dashboard - Funnel & Cohort'
  // Table
  | 'Table - Basic'
  | 'Table - Grouped'
  | 'Table - Index/Detail'
  | 'Table - Split Pane'
  | 'Table - Bulk Actions'
  | 'Table - Filtering'
  | 'Table - Tree/Hierarchical List'
  | 'Table - Frozen Column'
  | 'Table - Chart'
  | 'Table - Heatmap'
  // Form
  | 'Form - Basic'
  | 'Form - Page'
  | 'Form - Checkout'
  | 'Form - Two-column'
  | 'Form - Wizard'
  | 'Form - Wizard Dialog'
  | 'Form - Wizard Inline'
  | 'Form - Wizard Vertical'
  | 'Form - Modal Overlay'
  | 'Form - Side Sheet'
  | 'Form - Inline Edits'
  | 'Form - Settings'
  // Settings
  | 'Settings'
  | 'Settings - Dialog'
  | 'Settings - Sidebar'
  | 'Settings - Panels'
  | 'Settings - Form'
  // Login
  | 'Login - Basic'
  | 'Login - Card'
  | 'Login - SSO'
  | 'Login - Split'
  // Tools
  | 'Tools - Canvas Editor'
  | 'Tools - File Explorer'
  | 'Tools - Page Editor'
  | 'Tools - IDE'
  | 'Tools - Incident Console'
  | 'Tools - Kanban Board'
  | 'Tools - Notebook/Report Page'
  | 'Tools - Diff Compare Viewer'
  | 'Tools - Search Results Page'
  // Content
  | 'Content - Card Grid'
  | 'Content - Order Detail'
  | 'Content - Product Detail'
  | 'Content - Work Item Detail'
  | 'Content - Product List'
  | 'Content - Documentation Catalog'
  | 'Content - Documentation Design'
  | 'Content - Documentation Technical'
  | 'Content - Infinite Scroll Page'
  | 'Content - Timeline'
  | 'Content - Profile Page'
  // AI Chat
  | 'AI Chat - Conversation'
  | 'AI Chat - Landing'
  | 'AI Chat - Artifact Page'
  // Gallery
  | 'Gallery - Hero'
  | 'Gallery - Basic'
  | 'Gallery - Mixed'
  | 'Gallery - Side'
  | 'Gallery - Product'
  // Shell
  | 'Shell - Left Sidebar'
  | 'Shell - Top Nav'
  | 'Shell - Top Nav + Left Sidebar'
  | 'Shell - Breadcrumb Driven Layout'
  | 'Shell - Messaging'
  | 'Shell - Blank';

export type TemplateDoc = PageTemplateDoc | BlockTemplateDoc;

// ===========================================================================
// Solo: doc module shape and locales
// ===========================================================================

/** Locales a doc file can carry. */
export type DocLocale = 'en' | 'zh' | 'ar';

/**
 * The exports of a component/hook `.doc.mjs` file. `docs` is the English
 * source of truth; `docsZh` is a full Chinese doc (not on
 * every file); `docsAr` is the Arabic overlay (every file) — translate the
 * English doc's text and leave names, types and code untouched; `docsDense`
 * is the short English variant.
 */
export interface DocModule {
  docs: ComponentDoc | HookDoc;
  docsZh?: ComponentDoc | HookDoc;
  docsAr: ComponentTranslationDoc | HookTranslationDoc;
  docsDense?: ComponentTranslationDoc | HookTranslationDoc;
}
