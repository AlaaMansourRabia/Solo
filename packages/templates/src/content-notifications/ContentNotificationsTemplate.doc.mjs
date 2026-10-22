/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'page',
  name: 'Notifications & Activity',
  displayName: 'Notifications & Activity',
  description:
    'A notification center for a work app: a chronological feed of mentions, assignments, approvals and system events grouped into Today, Yesterday and Earlier this week, each a sentence with the actor and the object emphasised, a relative time and an unread dot. Approvals are decided and mentions answered right on the row, everything else (read state, muting a thread, turning a kind of notification off) sits in a per-row menu, and a filter, an Unread only switch and an undoable Mark all as read keep the triage fast. Separate empty states for "all caught up" and for a filter with nothing in it.',
  displayNameAr: 'الإشعارات والنشاط',
  descriptionAr:
    'مركز إشعارات لتطبيق عمل: موجز زمني للإشارات والمهام المسندة وطلبات الموافقة وأحداث النظام، مجمّع في اليوم وأمس وفي وقت سابق من هذا الأسبوع، وكل إشعار جملة تُبرز صاحب الحدث وموضوعه مع وقت نسبي ونقطة لغير المقروء. تُعتمد الطلبات ويُرد على الإشارات من الصف مباشرة، وتبقى بقية الإجراءات (حالة القراءة وكتم سلسلة وإيقاف نوع من الإشعارات) في قائمة لكل صف، ويُسرّع الفرز مرشّحٌ ومفتاح «غير المقروءة فقط» وزر «تعليم الكل كمقروء» القابل للتراجع. وتُعرض حالة فارغة مختلفة عند قراءة كل شيء وأخرى عند خلو مرشّح من النتائج.',
  keywords: [
    'notifications',
    'notification center',
    'activity',
    'activity feed',
    'inbox',
    'mentions',
    'alerts',
    'updates',
    'approvals',
    'unread',
    'mark as read',
    'mute',
    'timeline',
    'feed',
  ],
  isReady: true,
  category: 'Content - Activity Feed',
  order: 44,
  filter: 'Content',
  previewAspectRatio: 16 / 10,
  slug: 'content-notifications',
};
