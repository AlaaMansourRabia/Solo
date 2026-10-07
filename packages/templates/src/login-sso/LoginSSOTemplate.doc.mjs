/** @type {import('@solo/docs-types').TemplateDoc} */
export const doc = {
  type: 'page',
  name: 'Login SSO',
  displayName: 'Login SSO',
  description:
    'Progressive credential flow that branches on input: the email domain resolves an identity provider and redirects, with a password path as fallback. Two-stage rather than one form.',
  displayNameAr: 'تسجيل الدخول الموحّد (SSO)',
  descriptionAr:
    'تدفق تدريجي لبيانات الاعتماد يتفرّع بحسب الإدخال: يحدّد نطاق البريد الإلكتروني مزوّد الهوية ويعيد التوجيه إليه، مع مسار كلمة المرور بديلًا احتياطيًّا. مرحلتان بدلًا من نموذج واحد.',
  keywords: [
    'single sign-on',
    'sso',
    'saml',
    'enterprise login',
    'directory',
    'corporate authentication',
  ],
  isReady: true,
  category: 'Login - SSO',
  order: 25,
  filter: 'Login',
  previewAspectRatio: 16 / 10,
  slug: 'login-sso',
};
