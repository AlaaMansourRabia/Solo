/** @type {import('@solo/docs-types').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Document',
    required: true,
    description: 'Root container for block or inline Markdown content.',
  },
  {
    name: 'Heading',
    required: false,
    description:
      'Rendered semantic heading block; a custom heading renderer replaces the built-in part.',
  },
  {
    name: 'Paragraph',
    required: false,
    description:
      'Rendered paragraph block; a custom paragraph renderer replaces the default part.',
  },
  {
    name: 'List',
    required: false,
    description:
      'Ordered, unordered, or task-list block rendered from Markdown items.',
  },
  {
    name: 'Code block',
    required: false,
    description:
      'Fenced code block; a custom code renderer replaces the default part.',
  },
  {
    name: 'Blockquote',
    required: false,
    description:
      'Quoted block; a custom blockquote renderer replaces the default part.',
  },
  {
    name: 'Table',
    required: false,
    description:
      'Table block rendered from Markdown rows and columns; its Table child owns horizontal scrolling.',
  },
  {
    name: 'Divider',
    required: false,
    description:
      'Horizontal rule block; a custom hr renderer replaces the default part.',
  },
  {
    name: 'Image',
    required: false,
    description:
      'Block image or unsafe-URL fallback; a custom image renderer replaces a safe default image.',
  },
];

/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'Markdown',
  displayName: 'Markdown',
  category: 'Content',
  keywords: [
    'markdown',
    'rich text',
    'prose',
    'renderer',
    'streaming',
    'markup',
    'formatted text',
    'md',
    'markdown renderer',
  ],
  props: [
    {
      name: 'children',
      type: 'string',
      description: 'The markdown string to render.',
      required: true,
    },
    {
      name: 'display',
      type: "'block' | 'inline'",
      description:
        "Display type. Markdown defaults to block. Use 'inline' for markdown spans embedded inside text.",
      default: "'block'",
    },
    {
      name: 'density',
      type: "\'default\' | \'compact\'",
      description: 'Controls spacing between block-level elements.',
      default: "\'default\'",
    },
    {
      name: 'headingLevelStart',
      type: '1 | 2 | 3 | 4 | 5 | 6',
      description:
        'The HTML heading level that markdown # maps to. Shifts all heading levels down to fit the surrounding page hierarchy. Levels exceeding h6 are clamped to h6.',
      default: '1',
    },
    {
      name: 'isStreaming',
      type: 'boolean',
      description:
        'Enables streaming mode; it uses incremental parsing and a smooth fade-in animation for chunk-by-chunk text delivery.',
      default: 'false',
    },
    {
      name: 'onLinkClick',
      type: '(href: string, event: MouseEvent) => void | false',
      description:
        'Handler for link clicks. Return false to prevent the default navigation behavior. Link destinations in the markdown follow the shared navigation rule described on the Link `href` prop: a blocked destination renders as plain text and never reaches this handler or a custom link renderer. Image URLs use a separate, stricter policy (every data: URL is rejected).',
    },
    {
      name: 'sources',
      type: 'Record<string, MarkdownSource>',
      description:
        'Citation sources keyed by ID. When provided, [id] and 【id】 markers in the markdown that match a key are rendered as citation chips.',
    },
    {
      name: 'citationStyle',
      type: "'label' | 'number'",
      description:
        "How citations are displayed inline. 'label' shows a chip with source title, icon, and border. 'number' shows a compact numbered badge.",
      default: "'label'",
    },
    {
      name: 'contentWidth',
      type: 'number | string',
      description:
        'Max width for prose content (paragraphs, headings, lists, blockquotes). Tables and code blocks are unconstrained and can expand to the full container width. Use for readable line lengths in wide layouts.',
      default: '680',
    },
    {
      name: 'contentAlign',
      type: "'start' | 'center'",
      description:
        'Alignment of prose content within the container when contentWidth is narrower than the available space.',
      default: "'start'",
    },
    {
      name: 'plugins',
      type: 'Plugins',
      description:
        'Ordered extensions created by createMarkdownPlugin(); the generic Plugins parameter is a readonly array of plugin entries (readonly MarkdownPluginEntry[]), so the rendered extension node types are inferred from it. Plugins may add bounded syntax, immutable typed AST transforms, and typed extension renderers. Use isMarkdownExtensionNode() to narrow extension data observed from other plugins. Renderer callbacks are pure; return a child component when hooks are needed. Omitted and empty lists preserve the released Markdown behavior.',
    },
    {
      name: 'inlinePlugins',
      type: 'MarkdownInlinePlugin[]',
      description:
        'Transforms regex matches in parsed text nodes into custom inline React elements. Use for prefixed identifiers, mentions, and other shorthand patterns. Inline code, fenced code blocks, and math are unaffected.',
    },
    {
      name: 'autolink',
      type: "'gfm'",
      description:
        "Opt-in autolinking of bare URLs and emails. 'gfm' applies GitHub-Flavored Markdown autolink-literal rules: bare https?://..., www...., <scheme:url>, <email>, and user@host all become links. Trailing sentence punctuation and unbalanced trailing close-parens are excluded; matches inside code spans, code blocks, existing links, and image alt text are skipped. Default behavior (option unset) is unchanged.",
    },
    {
      name: 'components',
      type: 'MarkdownComponents',
      description:
        'Custom React component overrides for rendered Markdown elements (code, inlineCode, math, link, heading, paragraph, image, blockquote, hr, citation). Providing math enables `$…$` inline and `$$…$$` display parsing and receives `{value, display}`; omit it when dollar text should stay literal.',
    },
    {
      name: 'className',
      type: 'string',
      description:
        'Tailwind classes for layout customization (margins, positioning, sizing), merged with the component classes through cn() (tailwind-merge), so a conflicting utility overrides the default.',
    },
    {
      name: 'style',
      type: 'CSSProperties',
      description:
        'Inline styles for the root element. Prefer className for styling: its classes merge with the component classes and stay overridable, while inline styles always win and cannot be overridden by className.',
    },
    {
      name: 'data-testid',
      type: 'string',
      description: 'Test selector for automated testing frameworks.',
    },
  ],
  playground: {
    defaults: {
      children:
        "## Getting Started\n\nInstall the package:\n\n```bash\nnpm install @solo/core\n```\n\nThen import and use any component:\n\n```tsx\nimport {Button} from '@solo/core/Button';\n```\n\n**Bold**, *italic*, and `inline code` all work.",
    },
  },
  theming: {
    targets: [
      {className: 'solo-markdown', visualProps: ['density']},
      {
        className: 'solo-markdown-heading',
        visualProps: ['density', 'level'],
      },
      {
        className: 'solo-markdown-paragraph',
        visualProps: ['density'],
      },
      {
        className: 'solo-markdown-list',
        visualProps: ['density'],
      },
      {
        className: 'solo-markdown-codeblock',
        visualProps: ['density'],
      },
      {
        className: 'solo-markdown-blockquote',
        visualProps: ['density'],
      },
      {
        className: 'solo-markdown-table',
        visualProps: ['density'],
      },
      {
        className: 'solo-markdown-hr',
        visualProps: ['density'],
      },
      {
        className: 'solo-markdown-image',
        visualProps: ['density'],
      },
    ],
  },
  usage: {
    anatomy,
    description:
      'Renders a markdown string as Solo-styled components. Use Markdown for user-generated content, AI responses, and documentation; it handles headings, lists, tables, code blocks, and citations with consistent styling.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Set headingLevelStart to match the page hierarchy, e.g. start at 3 if the markdown sits inside an h2 section.',
      },
      {
        guidance: true,
        description:
          'Use contentWidth to keep prose at a readable line length in wide layouts.',
      },
      {
        guidance: true,
        description:
          'Use plugins created by createMarkdownPlugin for reusable syntax, immutable AST transforms, and typed extension rendering. Keep the ordered list stable while its syntax configuration is unchanged.',
      },
      {
        guidance: true,
        description:
          'Add markdownSoftBreaksPlugin when single line endings are meaningful. It matches remark-breaks for supported Markdown, including multiline link labels, while code and other opaque content stay unchanged.',
      },
      {
        guidance: true,
        description:
          'Use createMarkdownTextTransform for prose matching; it preserves code, links, images, citations, math, and accepted extension syntax as protected contexts. Provide requiredSubstrings only when they conservatively cover every possible match.',
      },
      {
        guidance: true,
        description:
          'Use createMarkdownFenceTransform for declared code-fence languages with semantic data. createNode returns an owned block extension node; its standard plugin renderer and toText own presentation. components.code still wins, and a declined or failed proposal keeps the accessible, copyable CodeBlock fallback.',
      },
      {
        guidance: true,
        description:
          'Use createMarkdownSourceDecoration to attach non-visual metadata — search hits, review annotations — to the blocks a source range touches, and getMarkdownSourceDecorations to read it back in a later plugin. Decorations appear on the settled document rather than on partial streaming chunks, and never change rendering, copyable text, accessible names, ids, focus order, or navigation.',
      },
      {
        guidance: true,
        description:
          'Import parseMarkdownAst or parseInlineAst from @solo/core/Markdown/parser when server or React Server Component code needs to run plugins against the canonical readonly tree. The parser and plugin subpaths have no use-client boundary. The Markdown component remains client-owned, so function-bearing plugin entries must not be passed across an RSC serialization boundary.',
      },
      {
        guidance: true,
        description:
          'Use createMarkdownFrontmatter for typed document metadata. Its parse() method gives the host metadata directly; its plugin removes a complete leading block before rendering and withholds an unfinished block during streaming.',
      },
      {
        guidance: true,
        description:
          "Import createMarkdownRemarkTransform from '@solo/core/Markdown/remark' only to reuse an existing synchronous transform-only Remark plugin; it stays out of every other bundle. Prove each plugin with fixtures: anything outside the supported MDAST subset — async work, parser or compiler plugins, processor state, raw HTML, unsupported nodes, forged positions, or metadata Solo cannot represent — keeps the last valid document and reports one diagnostic.",
      },
      {
        guidance: true,
        description:
          'Use inlinePlugins for prefixed identifiers, mentions, and other prose-only shorthand instead of preprocessing the markdown string.',
      },
      {
        guidance: true,
        description:
          'Provide components.math only for documents that use dollar-delimited math. The renderer owns typesetting and accessible output; Solo passes the expression as text and never executes raw HTML.',
      },
      {
        guidance: true,
        description:
          'For direct parsing, use MathParseOptions and handle InlineNodeWithMath or BlockNodeWithMath. Incremental math parsing also uses createIncrementalState<true>() and IncrementalParseState<true>; default calls and ParseOptions annotations keep the legacy unions.',
      },
      {
        guidance: true,
        description:
          'Install createMarkdownHeadingLinks() through plugins when a document needs copyable h1–h6 permalinks. The returned entry carries its validated namespace and URL base across compatible Core package copies. Each built-in heading keeps its incoming fragment ID and gains an inline trailing # copy button: it is hidden at fine-pointer rest through useContainerReveal, reveals on heading-row hover or keyboard focus, and stays visible under the hook’s coarse/touch semantics. Unmodified tap, click, Enter, or Space copies the canonical URL without navigation, hash mutation, or scrolling; a check confirms success for 1.5 seconds. The no-plugin path stays unchanged, and nested headings use the same depth-first identity projection as Markdown-derived Outline.',
      },
      {
        guidance: true,
        description:
          'For multiple documents, create one heading-links plugin per document with headingIdPrefix and pass that same plugin to Markdown and useOutlineFromMarkdown. Use the same stable value for Markdown id when the root also needs a DOM id; permalinkBaseUrl may supply a safe caller-owned URL before the fragment.',
      },
      {
        guidance: false,
        description:
          'Use Markdown for hand-authored layouts; use Text and Heading directly when you control the content.',
      },
    ],
  },
  examples: [
    {
      label: 'Inline display',
      code: `
import {Text} from '@solo/core/Text';

<Text>
  This description includes{' '}
  <Markdown display="inline">{'\`inline code\` and **bold text**'}</Markdown>
  .
</Text>;
`,
    },
    {
      label: 'GFM autolinks',
      code: `
<Markdown autolink="gfm">
  {'Visit https://example.com or email contact@example.com. ' +
    'You can also bracket links: <https://docs.example.com>.'}
</Markdown>;
`,
    },
    {
      label: 'Linkable headings',
      code: `
import {Markdown} from '@solo/core/Markdown';
import {createMarkdownHeadingLinks} from '@solo/core/Markdown/plugins';
import {Outline, useOutlineFromMarkdown} from '@solo/core/Outline';

const documentId = 'guide';
const headingLinks = createMarkdownHeadingLinks({
  headingIdPrefix: documentId,
});
const plugins = [headingLinks];

function Guide({source}) {
  const items = useOutlineFromMarkdown(source, {plugins});
  return (
    <>
      <Markdown id={documentId} plugins={plugins}>{source}</Markdown>
      <Outline items={items} />
    </>
  );
}
`,
    },
    {
      label: 'First-party soft breaks',
      code: `
import {Markdown} from '@solo/core/Markdown';
import {markdownSoftBreaksPlugin} from '@solo/core/Markdown/plugins';

<Markdown plugins={[markdownSoftBreaksPlugin]}>
  {'First line\\nSecond line'}
</Markdown>;
`,
    },
    {
      label: 'Text transform helper',
      code: `
import {Markdown} from '@solo/core/Markdown';
import {
  createMarkdownPlugin,
  createMarkdownTextTransform,
} from '@solo/core/Markdown/plugins';

const finalLabels = createMarkdownPlugin({
  name: 'final-labels',
  apiVersion: 1,
  transform: createMarkdownTextTransform({
    pattern: /\\bDraft\\b/g,
    requiredSubstrings: ['Draft'],
    replace: () => ({type: 'text', value: 'Final'}),
  }),
});

<Markdown plugins={[finalLabels]}># Draft</Markdown>;
`,
    },
    {
      label: 'Semantic fence helper',
      code: `
import {Markdown} from '@solo/core/Markdown';
import {
  createMarkdownFenceTransform,
  createMarkdownPlugin,
  type MarkdownExtensionNode,
} from '@solo/core/Markdown/plugins';

type DiagramNode = MarkdownExtensionNode<
  'diagrams',
  'diagram',
  {readonly code: string; readonly label?: string},
  'block'
>;

const diagrams = createMarkdownPlugin<'diagrams', DiagramNode>({
  name: 'diagrams',
  apiVersion: 1,
  transform: createMarkdownFenceTransform({
    languages: ['mermaid'],
    createNode: ({code, meta}) => ({
      type: 'extension',
      plugin: 'diagrams',
      name: 'diagram',
      display: 'block',
      data: {code, ...(meta == null ? {} : {label: meta})},
    }),
  }),
  renderers: {
    diagram: {
      render: ({node}) => (
        <Diagram source={node.data.code} label={node.data.label} />
      ),
      toText: node => node.data.code,
    },
  },
});

<Markdown plugins={[diagrams]}>
  {'\`\`\`mermaid Checkout flow\\ngraph LR; A-->B\\n\`\`\`'}
</Markdown>;
`,
    },
    {
      label: 'Source decoration helper',
      code: `
import {Markdown} from '@solo/core/Markdown';
import {
  createMarkdownPlugin,
  createMarkdownSourceDecoration,
  getMarkdownSourceDecorations,
} from '@solo/core/Markdown/plugins';

// Ranges are UTF-16 offsets into the same string Markdown renders. Every
// block a range touches is annotated; rendering, copyable text, and ids
// never change.
const searchHits = createMarkdownPlugin({
  name: 'search-hits',
  apiVersion: 1,
  transform: createMarkdownSourceDecoration({
    name: 'search-hit',
    ranges: [{start: 0, end: 15, data: {query: 'release'}}],
  }),
});

const readDecorations = createMarkdownPlugin({
  name: 'read-decorations',
  apiVersion: 1,
  transform: root => {
    report(root.children.map(getMarkdownSourceDecorations));
    return root;
  },
});

<Markdown plugins={[searchHits, readDecorations]}>{source}</Markdown>;
`,
    },
    {
      label: 'Native frontmatter',
      code: `
import {Markdown} from '@solo/core/Markdown';
import {createMarkdownFrontmatter} from '@solo/core/Markdown/plugins';

const frontmatter = createMarkdownFrontmatter({
  name: 'document-metadata',
  parse: fields => ({
    title: fields.title ?? 'Untitled',
    draft: fields.draft === 'true',
  }),
});

const source = '---\\ntitle: Release notes\\ndraft: true\\n---\\n# Shipped';
const result = frontmatter.parse(source);

<Markdown plugins={[frontmatter.plugin]}>{source}</Markdown>;
`,
    },
    {
      label: 'Compatible Remark plugin',
      code: `
import {Markdown} from '@solo/core/Markdown';
import {createMarkdownPlugin} from '@solo/core/Markdown/plugins';
import {createMarkdownRemarkTransform} from '@solo/core/Markdown/remark';

// A synchronous transform-only Remark plugin in the usual attacher shape.
const remarkRename =
  ({from, to}) =>
  tree => {
    const rename = node => {
      if (node.type === 'text') {
        node.value = node.value.split(from).join(to);
      }
      node.children?.forEach(rename);
    };
    rename(tree);
  };

const productName = createMarkdownPlugin({
  name: 'product-name',
  apiVersion: 1,
  transform: createMarkdownRemarkTransform(remarkRename, {
    from: 'Solo',
    to: 'Solo Design',
  }),
});

<Markdown plugins={[productName]}># Solo release notes</Markdown>;
`,
    },
    {
      label: 'Entity links',
      code: `
import {Link} from '@solo/core/Link';

const entityPlugins = [
  {
    pattern: /\\b([A-Z][A-Z0-9]+-\\d+)\\b/g,
    render: (match, key) => (
      <Link key={key} href={\`/entities/\${match[1]}\`}>
        {match[0]}
      </Link>
    ),
  },
];

<Markdown inlinePlugins={entityPlugins}>
  {'See DOC-2048. Inline code stays plain: \`DOC-9999\`.'}
</Markdown>;
`,
    },
    {
      label: 'Math renderer',
      code: `
import {BlockMath, InlineMath} from 'react-katex';

function MathExpression({value, display}) {
  const Component = display === 'block' ? BlockMath : InlineMath;
  return <Component math={value} />;
}

<Markdown components={{math: MathExpression}}>
  {'Inline $x_1 + y$ and display math:\\n\\n$$\\n\\\\sum_i x_i\\n$$'}
</Markdown>;
`,
    },
  ],
};

export const docsZh = {
  name: 'Markdown',
  displayName: 'Markdown',
  props: [
    {
      name: 'children',
      type: 'string',
      description: '要渲染的 Markdown 字符串。',
      required: true,
    },
    {
      name: 'display',
      type: "'block' | 'inline'",
      description:
        "显示类型。Markdown 默认为 block。使用 'inline' 可在文本内嵌入 Markdown 片段。",
      default: "'block'",
    },
    {
      name: 'density',
      type: "'default' | 'compact'",
      description: '控制块级元素之间的间距。',
      default: "'default'",
    },
    {
      name: 'headingLevelStart',
      type: '1 | 2 | 3 | 4 | 5 | 6',
      description:
        'Markdown # 映射到的 HTML 标题级别。将所有标题级别向下偏移以适应页面层次结构。超过 h6 的级别将被限制为 h6。',
      default: '1',
    },
    {
      name: 'isStreaming',
      type: 'boolean',
      description: '启用流式模式，使用增量解析和淡入动画处理分块文本。',
      default: 'false',
    },
    {
      name: 'onLinkClick',
      type: '(href: string, event: MouseEvent) => void | false',
      description: '链接点击处理器。返回 false 可阻止默认导航行为。',
    },
    {
      name: 'sources',
      type: 'Record<string, MarkdownSource>',
      description:
        '按 ID 索引的引用来源。提供后，Markdown 中匹配的 [id] 和 【id】 标记将渲染为引用标签。',
    },
    {
      name: 'citationStyle',
      type: "'label' | 'number'",
      description:
        "引用的内联显示方式。'label' 显示带标题、图标和边框的标签。'number' 显示紧凑编号徽章。",
      default: "'label'",
    },
    {
      name: 'contentWidth',
      type: 'number | string',
      description:
        '正文内容的最大宽度（段落、标题、列表、引用块）。表格和代码块不受限制，可扩展到完整容器宽度。用于在宽布局中保持可读行长。',
      default: '680',
    },
    {
      name: 'contentAlign',
      type: "'start' | 'center'",
      description:
        '当 contentWidth 小于可用空间时，正文内容在容器内的对齐方式。',
      default: "'start'",
    },
    {
      name: 'plugins',
      type: 'Plugins',
      description:
        '由 createMarkdownPlugin() 创建的有序扩展；泛型参数 Plugins 是插件条目的只读数组（readonly MarkdownPluginEntry[]），扩展节点类型由其推断。插件可添加有界语法、不可变的类型化 AST 转换和类型化扩展渲染器。使用 isMarkdownExtensionNode() 缩小从其他插件观察到的扩展数据类型。渲染回调必须是纯函数；需要 Hook 时请返回子组件。省略或传入空列表时保持已发布的 Markdown 行为。',
    },
    {
      name: 'inlinePlugins',
      type: 'MarkdownInlinePlugin[]',
      description:
        '将已解析文本节点中的正则匹配转换为自定义内联 React 元素。适用于带前缀的标识符、用户提及等简写模式。内联代码、围栏代码块和数学表达式不受影响。',
    },
    {
      name: 'autolink',
      type: "'gfm'",
      description:
        "可选的裸 URL 和电子邮箱自动链接。设为 'gfm' 启用 GitHub Flavored Markdown 自动链接规则：裸 https?://、www.、<scheme:url>、<email> 以及 user@host 都会变成链接。末尾句末标点和不平衡的末尾右括号会被排除；代码块、现有链接和图片替代文本内部的匹配会被跳过。默认为关闭。",
    },
    {
      name: 'components',
      type: 'MarkdownComponents',
      description:
        '用于覆盖 Markdown 渲染元素的自定义 React 组件（code、inlineCode、math、link、heading、paragraph、image、blockquote、hr、citation）。提供 math 会启用 `$…$` 行内数学和 `$$…$$` 块级数学解析，并接收 `{value, display}`；不提供时美元符号保持原样。',
    },
    {
      name: 'className',
      type: 'string',
      description:
        '用于布局自定义的 Tailwind 类（外边距、定位、尺寸），通过 cn()（tailwind-merge）与组件自身的类合并，冲突的工具类会覆盖组件默认值。',
    },
    {
      name: 'style',
      type: 'CSSProperties',
      description:
        '根元素的内联样式。建议使用 className：其类会与组件类合并且可被覆盖，而内联样式始终优先，className 无法覆盖。',
    },
    {
      name: 'data-testid',
      type: 'string',
      description: '用于自动化测试框架的测试选择器。',
    },
  ],
  theming: {
    targets: [
      {className: 'solo-markdown', visualProps: ['density']},
      {
        className: 'solo-markdown-heading',
        visualProps: ['density', 'level'],
        description:
          '每个渲染的标题块（h1–h6）。覆盖 marginBlockStart/marginBlockEnd 可调整标题周围的间距；反映 data-density 和 data-level，因此主题可按密度和标题层级设置间距。仅适用于默认标题渲染——自定义的 components.heading 拥有自己的样式。',
      },
      {
        className: 'solo-markdown-paragraph',
        visualProps: ['density'],
        description:
          '每个渲染的段落块。覆盖 marginBlockStart/marginBlockEnd 可调整段落之间的间距。反映 data-density，因此主题可以为不同密度设置不同的间距。',
      },
      {
        className: 'solo-markdown-list',
        visualProps: ['density'],
        description:
          '每个渲染的列表块（有序、无序和任务列表）。覆盖 marginBlockStart/marginBlockEnd 可调整列表周围的间距；反映 data-density。',
      },
      {
        className: 'solo-markdown-codeblock',
        visualProps: ['density'],
        description:
          '每个渲染的代码块外层容器。覆盖 marginBlockStart/marginBlockEnd 可调整代码块周围的间距；反映 data-density。仅适用于默认渲染——自定义的 components.code 拥有自己的样式。',
      },
      {
        className: 'solo-markdown-blockquote',
        visualProps: ['density'],
        description:
          '每个渲染的引用块（与 solo-blockquote 目标共用同一元素）。覆盖 marginBlockStart/marginBlockEnd 可调整引用块周围的间距；反映 data-density。仅适用于默认渲染——自定义的 components.blockquote 拥有自己的样式。',
      },
      {
        className: 'solo-markdown-table',
        visualProps: ['density'],
        description:
          '每个渲染的表格外层容器。覆盖 marginBlockStart/marginBlockEnd 可调整表格周围的间距；反映 data-density。',
      },
      {
        className: 'solo-markdown-hr',
        visualProps: ['density'],
        description:
          '每个渲染的水平分隔线。覆盖 marginBlockStart/marginBlockEnd 可调整分隔线周围的间距；反映 data-density。仅适用于默认渲染——自定义的 components.hr 拥有自己的样式。',
      },
      {
        className: 'solo-markdown-image',
        visualProps: ['density'],
        description:
          '每个渲染的块级图片外层容器（以及损坏图片的占位符）。覆盖 marginBlockStart/marginBlockEnd 可调整图片周围的间距；反映 data-density。仅适用于默认渲染——自定义的 components.image 拥有自己的样式。',
      },
    ],
  },
  usage: {
    anatomy,
    description:
      'Renders a markdown string as Solo-styled components. Use Markdown for user-generated content, AI responses, and documentation; it handles headings, lists, tables, code blocks, and citations with consistent styling.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Set headingLevelStart to match the page hierarchy, e.g. start at 3 if the markdown sits inside an h2 section.',
      },
      {
        guidance: true,
        description:
          'Use contentWidth to keep prose at a readable line length in wide layouts.',
      },
      {
        guidance: true,
        description:
          'Use plugins created by createMarkdownPlugin for reusable syntax, immutable AST transforms, and typed extension rendering. Keep the ordered list stable while its syntax configuration is unchanged.',
      },
      {
        guidance: true,
        description:
          'Add markdownSoftBreaksPlugin when single line endings are meaningful. It matches remark-breaks for supported Markdown, including multiline link labels, while code and other opaque content stay unchanged.',
      },
      {
        guidance: true,
        description:
          'Use createMarkdownTextTransform for prose matching; it preserves code, links, images, citations, math, and accepted extension syntax as protected contexts. Provide requiredSubstrings only when they conservatively cover every possible match.',
      },
      {
        guidance: true,
        description:
          'Use createMarkdownFenceTransform for declared code-fence languages with semantic data. createNode returns an owned block extension node; its standard plugin renderer and toText own presentation. components.code still wins, and a declined or failed proposal keeps the accessible, copyable CodeBlock fallback.',
      },
      {
        guidance: true,
        description:
          'Use createMarkdownSourceDecoration to attach non-visual metadata — search hits, review annotations — to the blocks a source range touches, and getMarkdownSourceDecorations to read it back in a later plugin. Decorations appear on the settled document rather than on partial streaming chunks, and never change rendering, copyable text, accessible names, ids, focus order, or navigation.',
      },
      {
        guidance: true,
        description:
          'Import parseMarkdownAst or parseInlineAst from @solo/core/Markdown/parser when server or React Server Component code needs to run plugins against the canonical readonly tree. The parser and plugin subpaths have no use-client boundary. The Markdown component remains client-owned, so function-bearing plugin entries must not be passed across an RSC serialization boundary.',
      },
      {
        guidance: true,
        description:
          'Use createMarkdownFrontmatter for typed document metadata. Its parse() method gives the host metadata directly; its plugin removes a complete leading block before rendering and withholds an unfinished block during streaming.',
      },
      {
        guidance: true,
        description:
          "Import createMarkdownRemarkTransform from '@solo/core/Markdown/remark' only to reuse an existing synchronous transform-only Remark plugin; it stays out of every other bundle. Prove each plugin with fixtures: anything outside the supported MDAST subset — async work, parser or compiler plugins, processor state, raw HTML, unsupported nodes, forged positions, or metadata Solo cannot represent — keeps the last valid document and reports one diagnostic.",
      },
      {
        guidance: true,
        description:
          'Use inlinePlugins for prefixed identifiers, mentions, and other prose-only shorthand instead of preprocessing the markdown string.',
      },
      {
        guidance: true,
        description:
          'Provide components.math only for documents that use dollar-delimited math. The renderer owns typesetting and accessible output; Solo passes the expression as text and never executes raw HTML.',
      },
      {
        guidance: true,
        description:
          'For direct parsing, use MathParseOptions and handle InlineNodeWithMath or BlockNodeWithMath. Incremental math parsing also uses createIncrementalState<true>() and IncrementalParseState<true>; default calls and ParseOptions annotations keep the legacy unions.',
      },
      {
        guidance: true,
        description:
          'Install createMarkdownHeadingLinks() through plugins when a document needs copyable h1–h6 permalinks. The returned entry carries its validated namespace and URL base across compatible Core package copies. Each built-in heading keeps its incoming fragment ID and gains an inline trailing # copy button: it is hidden at fine-pointer rest through useContainerReveal, reveals on heading-row hover or keyboard focus, and stays visible under the hook’s coarse/touch semantics. Unmodified tap, click, Enter, or Space copies the canonical URL without navigation, hash mutation, or scrolling; a check confirms success for 1.5 seconds. The no-plugin path stays unchanged, and nested headings use the same depth-first identity projection as Markdown-derived Outline.',
      },
      {
        guidance: true,
        description:
          'For multiple documents, create one heading-links plugin per document with headingIdPrefix and pass that same plugin to Markdown and useOutlineFromMarkdown. Use the same stable value for Markdown id when the root also needs a DOM id; permalinkBaseUrl may supply a safe caller-owned URL before the fragment.',
      },
      {
        guidance: false,
        description:
          'Use Markdown for hand-authored layouts; use Text and Heading directly when you control the content.',
      },
    ],
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'يعرض سلسلة Markdown النصية كمكوّنات بتنسيق Solo، مع معالجة العناوين والقوائم والجداول وكتل الشيفرة والاستشهادات بتنسيق متّسق.',
  propDescriptions: {
    children: 'سلسلة Markdown النصية المراد عرضها.',
    display: 'نوع العرض. القيمة الافتراضية في Markdown هي block. استخدم \'inline\' لمقاطع Markdown المضمّنة داخل النص.',
    density: 'يتحكم في التباعد بين العناصر على مستوى الكتل.',
    headingLevelStart: 'مستوى عنوان HTML الذي يُربط به الرمز # في Markdown. يُزيح جميع مستويات العناوين إلى الأسفل لتتلاءم مع التسلسل الهرمي للصفحة المحيطة. تُقيَّد المستويات التي تتجاوز h6 عند h6.',
    isStreaming: 'يفعّل وضع البث؛ إذ يستخدم التحليل التدريجي وحركة ظهور سلسة لتسليم النص جزءًا تلو الآخر.',
    onLinkClick: 'معالج النقر على الروابط. أرجع false لمنع سلوك التنقّل الافتراضي. تتبع وجهات الروابط في Markdown قاعدة التنقّل المشتركة الموصوفة في الخاصية `href` لـ Link: تُعرض الوجهة المحظورة كنص عادي ولا تصل أبدًا إلى هذا المعالج أو إلى عارض روابط مخصّص. تستخدم عناوين URL للصور سياسة منفصلة أكثر صرامة (يُرفض كل عنوان data:).',
    sources: 'مصادر الاستشهاد مفهرسة بالمعرّف. عند توفيرها، تُعرض العلامات [id] و【id】 في Markdown المطابقة لمفتاح ما كشرائح استشهاد.',
    citationStyle: 'طريقة عرض الاستشهادات ضمن النص. \'label\' يعرض شريحة بعنوان المصدر وأيقونته وحدود. و\'number\' يعرض شارة مرقّمة مدمجة.',
    contentWidth: 'الحد الأقصى لعرض المحتوى النثري (الفقرات والعناوين والقوائم والاقتباسات). لا تُقيَّد الجداول وكتل الشيفرة ويمكنها التمدد إلى العرض الكامل للحاوية. استخدمه للحفاظ على أطوال أسطر مقروءة في التخطيطات العريضة.',
    contentAlign: 'محاذاة المحتوى النثري داخل الحاوية عندما يكون contentWidth أضيق من المساحة المتاحة.',
    plugins: 'امتدادات مرتّبة تُنشأ عبر createMarkdownPlugin()؛ والمعامل العام Plugins مصفوفة للقراءة فقط من إدخالات الإضافات (readonly MarkdownPluginEntry[])، لذا تُستنتج منه أنواع عُقد الامتدادات المعروضة. يمكن للإضافات إضافة صياغة محدودة، وتحويلات AST غير قابلة للتعديل ومحددة الأنواع، وعارضات امتدادات محددة الأنواع. استخدم isMarkdownExtensionNode() لتضييق بيانات الامتدادات الملحوظة من إضافات أخرى. دوال الاستدعاء في العارضات نقية؛ أرجع مكوّنًا فرعيًا عند الحاجة إلى خطّافات. تحافظ القوائم المحذوفة والفارغة على سلوك Markdown المُصدَر.',
    inlinePlugins: 'يحوّل مطابقات التعابير النمطية في عُقد النص المحلَّلة إلى عناصر React مضمّنة مخصّصة. استخدمه للمعرّفات ذات البادئات والإشارات وأنماط الاختصار الأخرى. لا تتأثر الشيفرة المضمّنة وكتل الشيفرة المسوّرة والرياضيات.',
    autolink: 'تحويل اختياري لعناوين URL والبريد الإلكتروني المجرّدة إلى روابط. تطبّق \'gfm\' قواعد autolink-literal في GitHub-Flavored Markdown: تصبح https?://... المجرّدة وwww.... و<scheme:url> و<email> وuser@host كلها روابط. تُستثنى علامات ترقيم نهاية الجملة والأقواس الختامية غير المتوازنة في النهاية؛ وتُتخطى المطابقات داخل مقاطع الشيفرة وكتل الشيفرة والروابط الموجودة والنص البديل للصور. السلوك الافتراضي (عند عدم تعيين الخيار) دون تغيير.',
    components: 'تجاوزات بمكوّنات React مخصّصة لعناصر Markdown المعروضة (code وinlineCode وmath وlink وheading وparagraph وimage وblockquote وhr وcitation). يؤدي توفير math إلى تفعيل تحليل `$…$` المضمّن و`$$…$$` المعروض، ويتلقى `{value, display}`؛ احذفه عندما ينبغي أن يبقى نص علامة الدولار حرفيًا.',
    className: 'أصناف Tailwind لتخصيص التخطيط (الهوامش والتموضع والأبعاد)، تُدمج مع أصناف المكوّن عبر cn() (tailwind-merge)، بحيث تتجاوز الأداة المتعارضة القيمة الافتراضية.',
    style: 'أنماط مضمّنة لعنصر الجذر. فضّل className للتنسيق: إذ تُدمج أصنافه مع أصناف المكوّن وتبقى قابلة للتجاوز، بينما تتغلب الأنماط المضمّنة دائمًا ولا يمكن تجاوزها عبر className.',
    'data-testid': 'محدِّد اختبار لأطر الاختبار الآلي.',
  },
  usage: {
    description: 'يعرض سلسلة Markdown النصية كمكوّنات بتنسيق Solo. استخدم Markdown للمحتوى الذي ينشئه المستخدمون واستجابات الذكاء الاصطناعي والتوثيق؛ فهو يعالج العناوين والقوائم والجداول وكتل الشيفرة والاستشهادات بتنسيق متّسق.',
    bestPractices: [
      {guidance: true, description: 'اضبط headingLevelStart ليطابق التسلسل الهرمي للصفحة، مثلًا ابدأ من 3 إذا كان Markdown داخل قسم h2.'},
      {guidance: true, description: 'استخدم contentWidth لإبقاء النثر بطول سطر مقروء في التخطيطات العريضة.'},
      {guidance: true, description: 'استخدم الإضافات المُنشأة عبر createMarkdownPlugin للصياغة القابلة لإعادة الاستخدام وتحويلات AST غير القابلة للتعديل وعرض الامتدادات محددة الأنواع. أبقِ القائمة المرتّبة ثابتة ما دامت إعدادات صياغتها دون تغيير.'},
      {guidance: true, description: 'أضف markdownSoftBreaksPlugin عندما تكون نهايات الأسطر المفردة ذات معنى. فهو يطابق remark-breaks في Markdown المدعوم، بما في ذلك تسميات الروابط متعددة الأسطر، بينما تبقى الشيفرة والمحتوى المعتم الآخر دون تغيير.'},
      {guidance: true, description: 'استخدم createMarkdownTextTransform لمطابقة النثر؛ فهو يحافظ على الشيفرة والروابط والصور والاستشهادات والرياضيات وصياغة الامتدادات المقبولة كسياقات محمية. لا توفّر requiredSubstrings إلا عندما تغطي بتحفّظ كل مطابقة ممكنة.'},
      {guidance: true, description: 'استخدم createMarkdownFenceTransform للغات كتل الشيفرة المسوّرة المُعلنة ذات البيانات الدلالية. يُرجع createNode عقدة امتداد كتلية مملوكة؛ ويتولى عارض الإضافة القياسي وtoText الخاصان بها العرض. يظل components.code متقدّمًا، ويحتفظ المقترح المرفوض أو الفاشل بالبديل CodeBlock القابل للوصول والنسخ.'},
      {guidance: true, description: 'استخدم createMarkdownSourceDecoration لإرفاق بيانات وصفية غير مرئية — نتائج البحث وتعليقات المراجعة — بالكتل التي يلامسها نطاق مصدري، وgetMarkdownSourceDecorations لقراءتها مجددًا في إضافة لاحقة. تظهر الزخارف على المستند المستقر لا على أجزاء البث الجزئية، ولا تغيّر أبدًا العرض أو النص القابل للنسخ أو الأسماء القابلة للوصول أو المعرّفات أو ترتيب التركيز أو التنقّل.'},
      {guidance: true, description: 'استورد parseMarkdownAst أو parseInlineAst من @solo/core/Markdown/parser عندما تحتاج شيفرة الخادم أو React Server Component إلى تشغيل الإضافات على الشجرة المرجعية للقراءة فقط. لا يحتوي المساران الفرعيان للمحلّل والإضافات على حد use-client. يظل مكوّن Markdown مملوكًا للعميل، لذا يجب عدم تمرير إدخالات الإضافات التي تحمل دوالًا عبر حد تسلسل RSC.'},
      {guidance: true, description: 'استخدم createMarkdownFrontmatter للبيانات الوصفية للمستند محددة الأنواع. يمنح التابع parse() الخاص به المضيف البيانات الوصفية مباشرةً؛ وتُزيل إضافته كتلة بادئة كاملة قبل العرض وتحجب الكتلة غير المكتملة أثناء البث.'},
      {guidance: true, description: 'استورد createMarkdownRemarkTransform من \'@solo/core/Markdown/remark\' فقط لإعادة استخدام إضافة Remark متزامنة موجودة تقتصر على التحويل؛ فهو يبقى خارج كل الحزم الأخرى. أثبت صحة كل إضافة بحالات اختبار: أي شيء خارج المجموعة الفرعية المدعومة من MDAST — العمل غير المتزامن، أو إضافات المحلّل أو المترجم، أو حالة المعالج، أو HTML الخام، أو العُقد غير المدعومة، أو المواضع المزيّفة، أو البيانات الوصفية التي لا يستطيع Solo تمثيلها — يحتفظ بآخر مستند صالح ويُبلغ عن تشخيص واحد.'},
      {guidance: true, description: 'استخدم inlinePlugins للمعرّفات ذات البادئات والإشارات وغيرها من الاختصارات الخاصة بالنثر بدلًا من المعالجة المسبقة لسلسلة Markdown النصية.'},
      {guidance: true, description: 'لا توفّر components.math إلا للمستندات التي تستخدم رياضيات محاطة بعلامة الدولار. يتولى العارض التنضيد والمخرجات القابلة للوصول؛ ويمرّر Solo التعبير كنص ولا ينفّذ HTML الخام أبدًا.'},
      {guidance: true, description: 'للتحليل المباشر، استخدم MathParseOptions وعالج InlineNodeWithMath أو BlockNodeWithMath. يستخدم التحليل التدريجي للرياضيات أيضًا createIncrementalState<true>() وIncrementalParseState<true>؛ وتحافظ الاستدعاءات الافتراضية وتعليقات ParseOptions على الاتحادات القديمة.'},
      {guidance: true, description: 'ثبّت createMarkdownHeadingLinks() عبر plugins عندما يحتاج المستند إلى روابط دائمة قابلة للنسخ للعناوين h1–h6. يحمل الإدخال المُرجَع مساحة أسمائه المتحقق منها وأساس URL عبر نسخ حزمة Core المتوافقة. يحتفظ كل عنوان مدمج بمعرّف الجزء الوارد ويكتسب زر نسخ # مضمّنًا في نهايته: يكون مخفيًا في حالة السكون مع المؤشر الدقيق عبر useContainerReveal، ويظهر عند التمرير فوق صف العنوان أو تركيز لوحة المفاتيح، ويبقى ظاهرًا وفق دلالات الخطّاف للمؤشر الخشن/اللمس. يؤدي النقر أو اللمس أو Enter أو Space دون مفاتيح تعديل إلى نسخ عنوان URL المرجعي دون تنقّل أو تغيير في hash أو تمرير؛ وتؤكد علامة اختيار النجاح لمدة 1.5 ثانية. يبقى المسار دون الإضافة دون تغيير، وتستخدم العناوين المتداخلة إسقاط الهوية نفسه بالعمق أولًا الذي يستخدمه Outline المشتق من Markdown.'},
      {guidance: true, description: 'للمستندات المتعددة، أنشئ إضافة heading-links واحدة لكل مستند مع headingIdPrefix ومرّر الإضافة نفسها إلى Markdown وuseOutlineFromMarkdown. استخدم القيمة الثابتة نفسها لـ id في Markdown عندما يحتاج الجذر أيضًا إلى معرّف DOM؛ ويمكن أن يوفّر permalinkBaseUrl عنوان URL آمنًا يملكه المستدعي قبل الجزء.'},
      {guidance: false, description: 'استخدام Markdown للتخطيطات المؤلَّفة يدويًا؛ استخدم Text وHeading مباشرةً عندما تتحكم في المحتوى.'},
    ],
    anatomy: [
      {name: 'المستند', required: true, description: 'الحاوية الجذرية لمحتوى Markdown الكتلي أو المضمّن.'},
      {name: 'العنوان', required: false, description: 'كتلة عنوان دلالية معروضة؛ يحل عارض العناوين المخصّص محل الجزء المدمج.'},
      {name: 'الفقرة', required: false, description: 'كتلة فقرة معروضة؛ يحل عارض الفقرات المخصّص محل الجزء الافتراضي.'},
      {name: 'القائمة', required: false, description: 'كتلة قائمة مرتّبة أو غير مرتّبة أو قائمة مهام تُعرض من عناصر Markdown.'},
      {name: 'كتلة الشيفرة', required: false, description: 'كتلة شيفرة مسوّرة؛ يحل عارض الشيفرة المخصّص محل الجزء الافتراضي.'},
      {name: 'الاقتباس', required: false, description: 'كتلة مقتبسة؛ يحل عارض blockquote المخصّص محل الجزء الافتراضي.'},
      {name: 'الجدول', required: false, description: 'كتلة جدول تُعرض من صفوف Markdown وأعمدته؛ ويتولى المكوّن الفرعي Table التمرير الأفقي.'},
      {name: 'الفاصل', required: false, description: 'كتلة خط أفقي؛ يحل عارض hr المخصّص محل الجزء الافتراضي.'},
      {name: 'الصورة', required: false, description: 'صورة كتلية أو بديل لعنوان URL غير آمن؛ يحل عارض الصور المخصّص محل الصورة الافتراضية الآمنة.'},
    ],
  },
};

export const docsDense = {
  description:
    'Renders markdown string as Solo-styled components. Use for user-generated content, AI responses, docs. Headings, lists, tables, code, citations w/ consistent styling.',
  usage: {
    anatomy,
    description:
      'Renders a markdown string as Solo-styled components. Use Markdown for user-generated content, AI responses, and documentation; it handles headings, lists, tables, code blocks, and citations with consistent styling.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Set headingLevelStart to match the page hierarchy, e.g. start at 3 if the markdown sits inside an h2 section.',
      },
      {
        guidance: true,
        description:
          'Use contentWidth to keep prose at a readable line length in wide layouts.',
      },
      {
        guidance: true,
        description:
          'Use plugins created by createMarkdownPlugin for reusable syntax, immutable AST transforms, and typed extension rendering. Keep the ordered list stable while its syntax configuration is unchanged.',
      },
      {
        guidance: true,
        description:
          'Add markdownSoftBreaksPlugin when single line endings are meaningful. It matches remark-breaks for supported Markdown, including multiline link labels, while code and other opaque content stay unchanged.',
      },
      {
        guidance: true,
        description:
          'Use createMarkdownTextTransform for prose matching; it preserves code, links, images, citations, math, and accepted extension syntax as protected contexts. Provide requiredSubstrings only when they conservatively cover every possible match.',
      },
      {
        guidance: true,
        description:
          'Use createMarkdownFenceTransform for declared code-fence languages with semantic data. createNode returns an owned block extension node; its standard plugin renderer and toText own presentation. components.code still wins, and a declined or failed proposal keeps the accessible, copyable CodeBlock fallback.',
      },
      {
        guidance: true,
        description:
          'Use createMarkdownSourceDecoration to attach non-visual metadata — search hits, review annotations — to the blocks a source range touches, and getMarkdownSourceDecorations to read it back in a later plugin. Decorations appear on the settled document rather than on partial streaming chunks, and never change rendering, copyable text, accessible names, ids, focus order, or navigation.',
      },
      {
        guidance: true,
        description:
          'Import parseMarkdownAst or parseInlineAst from @solo/core/Markdown/parser when server or React Server Component code needs to run plugins against the canonical readonly tree. The parser and plugin subpaths have no use-client boundary. The Markdown component remains client-owned, so function-bearing plugin entries must not be passed across an RSC serialization boundary.',
      },
      {
        guidance: true,
        description:
          'Use createMarkdownFrontmatter for typed document metadata. Its parse() method gives the host metadata directly; its plugin removes a complete leading block before rendering and withholds an unfinished block during streaming.',
      },
      {
        guidance: true,
        description:
          "Import createMarkdownRemarkTransform from '@solo/core/Markdown/remark' only to reuse a synchronous transform-only Remark plugin; it stays out of every other bundle and unsupported behavior keeps the last valid document with one diagnostic.",
      },
      {
        guidance: true,
        description:
          'Use inlinePlugins for prefixed identifiers, mentions, and other prose-only shorthand instead of preprocessing the markdown string.',
      },
      {
        guidance: true,
        description:
          'Provide components.math only for documents that use dollar-delimited math; the renderer owns typesetting and accessible output.',
      },
      {
        guidance: true,
        description:
          'Direct math parser calls use MathParseOptions and the explicit WithMath node unions; incremental calls also use createIncrementalState<true>() and IncrementalParseState<true>. Default calls keep the legacy unions.',
      },
      {
        guidance: true,
        description:
          'Install createMarkdownHeadingLinks() through plugins to add all-depth stable IDs and inline trailing # copy buttons to built-in headings. useContainerReveal keeps each button hidden at fine-pointer rest and keyboard/touch reachable. Unmodified activation copies the canonical URL without navigation, hash mutation, or scrolling and shows a 1.5-second check; failures stay silent. Pass the same plugin entry to Markdown-derived Outline; use headingIdPrefix for multiple instances.',
      },
      {
        guidance: false,
        description:
          'Use Markdown for hand-authored layouts; use Text and Heading directly when you control the content.',
      },
    ],
  },
  propDescriptions: {
    children: 'markdown string',
    density: "Block spacing. 'default'|'compact'. Default: 'default'.",
    headingLevelStart:
      'Maps # to this heading level (1-6). Clamped to h6. Default: 1.',
    isStreaming:
      'Incremental parse + fade-in for streamed chunks. Default: false.',
    onLinkClick:
      '(href, event) => void|false. Return false prevents navigation. Link destinations follow the shared navigation rule (see Link href); blocked ones render as text. Image URLs: separate stricter policy.',
    sources:
      'Record<string, MarkdownSource>. Citation sources by ID. [id]/【id】 markers render as chips.',
    citationStyle:
      "'label'|'number'. label=chip w/ title+icon, number=compact badge. Default: 'label'.",
    contentWidth:
      'number|string. Max width for prose (headings, paragraphs, lists). Tables/code unconstrained.',
    contentAlign:
      "'start'|'center'. Prose alignment when contentWidth < container. Default: 'start'.",
    plugins:
      'readonly MarkdownPluginEntry[]. Ordered syntax, immutable AST transforms, and typed extension renderers from createMarkdownPlugin(), plus first-party helpers such as createMarkdownHeadingLinks(). Default: omitted or empty.',
    inlinePlugins:
      'MarkdownInlinePlugin[]. Regex matches in text nodes -> custom inline React elements. Skips inline/fenced code and math.',
    autolink:
      "'gfm'. Opt-in GFM autolinking: bare URLs (https?://, www.), <scheme:url>, <email>, user@host. Skips code, code blocks, existing links. Default: off.",
    components:
      'MarkdownComponents. Custom renderers; math({value, display}) opts into $…$/$$…$$ parsing. Renderer owns output and accessibility.',
    className: 'Tailwind classes for layout (margins, sizing).',
    style: 'Inline styles. Prefer className.',
    'data-testid': 'Test selector.',
  },
};
