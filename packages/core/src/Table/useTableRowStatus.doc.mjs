/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'useTableRowStatus',
  subComponentOf: 'Table',
  displayName: 'useTableRowStatus',
  description:
    'Hook that returns a TablePlugin which prepends a narrow column signaling per-row status. Return {status, label} for a semantic success, warning, or error: Table resolves the matching glyph and tone through the active theme. Return {color, icon?, label} for a custom marker: every color is paint-only, an omitted icon renders the stable 8px dot, and an explicit icon renders that caller-selected glyph. Named custom icons keep their released Icon color mapping; raw CSS custom icons inherit the caller\'s exact paint instead of the previous primary fallback. Existing callers require no source migration. label is required and becomes the accessible image name plus supplemental hover tooltip; return null for no indicator. The column header is visually blank but carries a screen-reader-only localized name ("Row status", i18n key @solo.table.rowStatus.columnHeader). Memoize getStatus with useCallback for a stable plugin identity.',
  props: [
    {
      name: 'getStatus',
      type: "(item: T) => ({ status: 'success' | 'warning' | 'error'; color?: never; icon?: never; label: string } | { status?: never; color: 'accent' | 'success' | 'error' | 'warning' | 'red' | 'orange' | 'green' | 'yellow' | 'blue' | 'gray' | string; icon?: IconName; label: string }) | null",
      description:
        'Derive either a semantic outcome or a custom marker. {status, label} accepts the closed success/error/warning vocabulary and resolves its glyph and tone through the active theme. {color, icon?, label} preserves the stable custom-marker path: color always selects paint, no icon renders an 8px dot, and icon renders the explicit caller glyph. Even color values named success/error/warning remain dots without icon. Valid icon names: close, chevronDown, chevronLeft, chevronRight, chevronsLeft, chevronsRight, check, success, error, warning, info, calendar, clock, externalLink, menu, moreHorizontal, search, arrowUp, arrowDown, arrowsUpDown, funnel, eyeSlash, viewColumns, copy, checkDouble, wrench, stop, microphone. The branches are exclusive, label is required and announced via role="img", and null leaves the row status cell empty. Memoize with useCallback for a stable plugin identity.',
      required: true,
    },
  ],
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'خطّاف (hook) يُرجع TablePlugin يضيف في البداية عمودًا ضيقًا يشير إلى حالة كل صف. أرجِع {status, label} لنتيجة دلالية من نجاح أو تحذير أو خطأ: إذ يحلّ Table الرمز واللون المطابقين عبر السمة النشطة. أرجِع {color, icon?, label} لعلامة مخصصة: كل لون للطلاء فقط، والأيقونة المحذوفة تعرض النقطة الثابتة بحجم 8px، والأيقونة الصريحة تعرض الرمز الذي اختاره المستدعي. تحتفظ الأيقونات المخصصة المسمّاة بربط ألوان Icon المعتمد في الإصدار؛ بينما ترث الأيقونات المخصصة بـ CSS الخام طلاء المستدعي بالضبط بدلًا من البديل primary السابق. لا يحتاج المستدعون الحاليون إلى أي ترحيل في الشيفرة المصدرية. label مطلوب ويصبح الاسم القابل للوصول للصورة إضافةً إلى تلميح تكميلي عند التمرير؛ أرجِع null لعدم عرض مؤشر. ترويسة العمود فارغة بصريًا لكنها تحمل اسمًا مترجَمًا مخصصًا لقارئات الشاشة فقط ("Row status"، مفتاح i18n @solo.table.rowStatus.columnHeader). احفظ getStatus باستخدام useCallback للحصول على هوية ثابتة للإضافة.',
  propDescriptions: {
    getStatus: 'اشتقّ إما نتيجة دلالية أو علامة مخصصة. يقبل {status, label} المفردات المغلقة success/error/warning ويحلّ رمزها ولونها عبر السمة النشطة. ويحافظ {color, icon?, label} على مسار العلامة المخصصة الثابت: يختار color الطلاء دائمًا، وغياب icon يعرض نقطة بحجم 8px، ويعرض icon رمز المستدعي الصريح. حتى قيم color المسمّاة success/error/warning تبقى نقاطًا دون icon. أسماء الأيقونات الصالحة: close، chevronDown، chevronLeft، chevronRight، chevronsLeft، chevronsRight، check، success، error، warning، info، calendar، clock، externalLink، menu، moreHorizontal، search، arrowUp، arrowDown، arrowsUpDown، funnel، eyeSlash، viewColumns، copy، checkDouble، wrench، stop، microphone. الفرعان متنافيان، وlabel مطلوب ويُعلَن عبر role="img"، وتترك null خلية حالة الصف فارغة. احفظها باستخدام useCallback للحصول على هوية ثابتة للإضافة.',
  },
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Returns a TablePlugin with a narrow per-row status column. {status,label} resolves themed success/error/warning glyph + tone. Stable {color,icon?,label} stays custom: color is paint-only, no icon = 8px dot, icon = caller glyph. label is required; null leaves the cell empty. Memoize getStatus.',
  propDescriptions: {
    getStatus:
      'Map a row to semantic {status,label}, custom {color,icon?,label}, or null. Semantic status owns themed glyph + tone. Custom color always owns paint; omitted icon = dot, explicit icon = caller glyph. Branches are exclusive and label is required.',
  },
};
