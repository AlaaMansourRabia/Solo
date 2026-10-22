/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'page',
  name: 'Team Members',
  displayName: 'Team Members',
  description:
    'Workspace access as a list of people: a seat meter beside the invite button, Active / Pending invites with search and a role filter, a paginated table with roles edited inline, attention-only status badges, and the same row actions in an overflow menu and on right-click. Inviting turns typed emails into tokens; removing confirms first and reports with an undoable toast. The shape for records with roles, not a page of preferences.',
  displayNameAr: 'أعضاء الفريق',
  descriptionAr:
    'الوصول إلى مساحة العمل بوصفه قائمة أشخاص: مؤشر للمقاعد بجوار زر الدعوة، وتبديل بين النشطين والدعوات المعلّقة مع بحث ومرشّح للأدوار، وجدول مقسّم إلى صفحات تُعدَّل فيه الأدوار في مكانها، وشارات حالة لا تظهر إلا لما يستدعي الانتباه، وإجراءات الصف نفسها في قائمة المزيد وعند النقر بالزر الأيمن. تتحوّل عناوين البريد المكتوبة في الدعوة إلى رموز، ويُطلب التأكيد قبل الإزالة ثم يُبلَّغ بالنتيجة في إشعار قابل للتراجع. هذا هو الشكل المناسب لسجلات لها أدوار، لا لصفحة تفضيلات.',
  keywords: [
    'members',
    'team',
    'users',
    'people',
    'roles',
    'permissions',
    'access control',
    'invite',
    'invitations',
    'seats',
    'workspace',
    'collaborators',
    'admin',
    'user management',
  ],
  isReady: true,
  category: 'Settings - Members',
  order: 26,
  filter: 'Settings',
  previewAspectRatio: 16 / 10,
  slug: 'settings-members',
};
