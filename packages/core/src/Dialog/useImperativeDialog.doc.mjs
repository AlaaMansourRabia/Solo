/** @type {import('@solo/docs-types').ComponentDoc} */

export const docs = {
  name: 'useImperativeDialog',
  subComponentOf: 'Dialog',
  displayName: 'useImperativeDialog',
  description: 'Hook for showing a dialog without managing open state. Call dialog.show(content, options) to open and dialog.hide() to close. Render dialog.element in your JSX tree.',
  props: [
    {
      name: 'show',
      type: '(content: ReactNode, options?: DialogOptions) => void',
      description: 'Show the dialog with the given content. Options are the same as Dialog props minus isOpen/onOpenChange/children.',
    },
    {
      name: 'hide',
      type: '() => void',
      description: 'Hide the dialog.',
    },
    {
      name: 'isOpen',
      type: 'boolean',
      description: 'Whether the dialog is currently open.',
    },
    {
      name: 'element',
      type: 'ReactNode',
      description: 'The dialog element: render this in your JSX tree.',
    },
  ],
};

/** @type {import('@solo/docs-types').ComponentTranslationDoc} */
export const docsAr = {
  description: 'خطّاف (hook) لعرض مربع حوار دون إدارة حالة الفتح. استدعِ dialog.show(content, options) للفتح وdialog.hide() للإغلاق. اعرض dialog.element داخل شجرة JSX الخاصة بك.',
  propDescriptions: {
    show: 'يعرض مربع الحوار بالمحتوى المحدد. الخيارات هي نفسها خصائص Dialog باستثناء isOpen/onOpenChange/children.',
    hide: 'يخفي مربع الحوار.',
    isOpen: 'ما إذا كان مربع الحوار مفتوحًا حاليًا.',
    element: 'عنصر مربع الحوار: اعرضه داخل شجرة JSX الخاصة بك.',
  },
};

export const docsDense = {
  name: 'useImperativeDialog',
  description: 'hook to show a dialog w/o managing open state; call dialog.show(content, options) to open + dialog.hide() to close; render dialog.element in your JSX tree',
  propDescriptions: {
    show: 'show the dialog with given content; options = Dialog props minus isOpen/onOpenChange/children',
    hide: 'hide the dialog',
    isOpen: 'whether the dialog is currently open',
    element: 'the dialog element: render this in your JSX tree',
  },
};
