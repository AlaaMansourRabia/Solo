import type {Meta, StoryObj} from '@storybook/react';
import {Code} from '@solo/core/Code';
import {Heading} from '@solo/core/Heading';
import {Text} from '@solo/core/Text';

/**
 * Every text role in Arabic (lang="ar", dir="rtl" — IBM Plex Sans Arabic via
 * --font-family-body-arabic / --font-family-heading-arabic, taller line
 * heights) next to its Latin version (lang="en" — the theme's Latin face).
 * Code stays monospace and Latin in both.
 */
const meta: Meta = {
  title: 'Typography/Arabic',
  parameters: {layout: 'fullscreen'},
};
export default meta;

const ROLES: Array<{role: string; ar: string; en: string; render: (text: string) => React.ReactNode}> = [
  {role: 'Heading 1', ar: 'نظام تصميم للمنتجات الحديثة', en: 'A design system for modern products', render: t => <Heading level={1}>{t}</Heading>},
  {role: 'Heading 2', ar: 'المكوّنات والقوالب', en: 'Components and templates', render: t => <Heading level={2}>{t}</Heading>},
  {role: 'Heading 3', ar: 'إعدادات الحساب', en: 'Account settings', render: t => <Heading level={3}>{t}</Heading>},
  {role: 'Heading 4', ar: 'الإشعارات', en: 'Notifications', render: t => <Heading level={4}>{t}</Heading>},
  {role: 'Heading 5', ar: 'آخر تحديث', en: 'Last updated', render: t => <Heading level={5}>{t}</Heading>},
  {role: 'Heading 6', ar: 'ملاحظة', en: 'Note', render: t => <Heading level={6}>{t}</Heading>},
  {role: 'Large', ar: 'ابدأ بإنشاء مشروعك الأول خلال دقائق.', en: 'Start your first project in minutes.', render: t => <Text type="large">{t}</Text>},
  {role: 'Body', ar: 'تساعدك هذه المكوّنات على بناء واجهات متّسقة وسهلة الوصول تدعم الكتابة من اليمين إلى اليسار دون أي إعداد إضافي.', en: 'These components help you build consistent, accessible interfaces that support right-to-left writing with no extra setup.', render: t => <Text type="body">{t}</Text>},
  {role: 'Label', ar: 'البريد الإلكتروني', en: 'Email address', render: t => <Text type="label">{t}</Text>},
  {role: 'Supporting', ar: 'سنرسل رمز التحقق إلى هذا العنوان.', en: 'We will send a verification code to this address.', render: t => <Text type="supporting" color="secondary">{t}</Text>},
  {role: 'Code', ar: 'npm install @solo/core', en: 'npm install @solo/core', render: t => <Code>{t}</Code>},
];

const grid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '120px 1fr 1fr',
  gap: '16px 24px',
  alignItems: 'baseline',
  padding: 24,
};

export const AllRoles: StoryObj = {
  name: 'All text roles (Arabic | Latin)',
  render: () => (
    <div style={grid} dir="ltr" lang="en">
      <Text type="supporting" color="secondary">Role</Text>
      <Text type="supporting" color="secondary">العربية (ar, rtl)</Text>
      <Text type="supporting" color="secondary">Latin (en, ltr)</Text>
      {ROLES.map(r => (
        <div key={r.role} style={{display: 'contents'}}>
          <Text type="supporting" color="secondary">{r.role}</Text>
          <div lang="ar" dir="rtl" data-role={r.role}>{r.render(r.ar)}</div>
          <div lang="en" dir="ltr">{r.render(r.en)}</div>
        </div>
      ))}
    </div>
  ),
};
