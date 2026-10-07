/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'page',
  name: 'Tree Table',
  displayName: 'Tree Table',
  description:
    'Hierarchical table where every parent row rolls up from its children — a code repository whose folders show the newest commit beneath them, beside a detail sidebar and a rendered README. Columns resize, siblings sort within their own level, arrow keys walk the rows, and search prunes the tree to matching branches.',
  displayNameAr: 'جدول شجري',
  descriptionAr:
    'جدول هرمي يُجمِّع فيه كل صف أب بياناته من صفوفه الفرعية — مستودع تعليمات برمجية تعرض مجلداته أحدث إيداع بداخلها، بجانب شريط جانبي للتفاصيل وملف README معروض. تتغيّر أحجام الأعمدة، وتُفرز العناصر الشقيقة ضمن مستواها، وتتنقّل مفاتيح الأسهم بين الصفوف، ويقلّم البحث الشجرة إلى الفروع المطابقة.',
  keywords: [
    'tree',
    'hierarchy',
    'nested rows',
    'drilldown',
    'expand',
    'collapse',
    'resizable',
    'expandable',
    'file browser',
    'repository',
    'rolled-up parents',
  ],
  isReady: true,
  category: 'Table - Tree/Hierarchical List',
  order: 11,
  filter: 'Table',
  previewAspectRatio: 16 / 10,
  slug: 'table-tree',
};
