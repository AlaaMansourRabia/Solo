/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'block',
  exampleFor: 'CollapsibleGroup',
  name: 'CollapsibleGroup',
  displayName: 'Collapsible Group',
  description:
    'CollapsibleGroup coordinates its Collapsible children: with type="single", opening one closes the others. No state or handlers in the example — the group owns which value is open and each child only declares its own. One Collapsible per Card, so each trigger keeps its default large type as the heading of its own surface.',
  displayNameAr: 'Collapsible Group — نظرة عامة',
  descriptionAr: 'ينسّق CollapsibleGroup عناصره الفرعية من Collapsible: مع type="single"، يؤدي فتح أحدها إلى إغلاق البقية. لا حالة ولا معالجات في المثال — تملك المجموعة القيمة المفتوحة، ويكتفي كل عنصر فرعي بالإعلان عن قيمته. عنصر Collapsible واحد لكل Card، بحيث يحتفظ كل مُشغِّل بنوعه الكبير الافتراضي كعنوان لسطحه الخاص.',
  isReady: true,
  order: 0,
  isShowcase: true,
  aspectRatio: 16 / 9,
  componentsUsed: ['Collapsible', 'CollapsibleGroup', 'Card', 'Text', 'Stack'],
};
