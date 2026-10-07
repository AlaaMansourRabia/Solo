/**
 * Docs page that shows a component's Arabic doc (`docsAr`) when the Direction
 * toolbar is RTL (Arabic). English stays Storybook's standard autodocs
 * page; Arabic adds a right-to-left panel built from the component's
 * `.doc.mjs` (description, usage, best practices, anatomy, props) above the
 * stories.
 */

import * as React from 'react';
import {
  Controls,
  Description,
  DocsContext,
  Primary,
  Stories,
  Subtitle,
  Title,
  useOf,
} from '@storybook/addon-docs/blocks';

type Doc = Record<string, any>;

// Every component/hook doc module in core + charts, keyed by documented name.
const modules = import.meta.glob<Record<string, any>>(
  [
    '../../../packages/core/src/**/*.doc.mjs',
    '../../../packages/charts/src/*.doc.mjs',
  ],
  {eager: true},
);
const byName = new Map<string, Record<string, any>>();
for (const mod of Object.values(modules)) {
  const name = mod.docs?.name;
  if (name && !byName.has(name)) byName.set(name, mod);
  for (const c of mod.docs?.components ?? []) {
    if (c.name && !byName.has(c.name)) byName.set(c.name, mod);
  }
}

/**
 * The locale implied by the Direction global (RTL = ar-SA), live — docs pages
 * are outside story decorators.
 */
function toLocale(direction: unknown): string {
  return direction === 'rtl' ? 'ar-SA' : 'en';
}

function useLocaleGlobal(): string {
  const ctx = React.useContext(DocsContext) as any;
  const read = React.useCallback(
    () =>
      toLocale(
        ctx?.store?.userGlobals?.get?.()?.direction ??
          ctx?.store?.globals?.get?.()?.direction,
      ),
    [ctx],
  );
  const [locale, setLocale] = React.useState<string>(read);
  React.useEffect(() => {
    const channel = ctx?.channel;
    if (!channel) return;
    const onGlobals = (event: {globals?: {direction?: string}}) =>
      setLocale(
        event?.globals?.direction ? toLocale(event.globals.direction) : read(),
      );
    channel.on('globalsUpdated', onGlobals);
    return () => channel.off('globalsUpdated', onGlobals);
  }, [ctx, read]);
  return locale;
}

function componentNameOf(meta: any): string | undefined {
  const component = meta?.csfFile?.meta?.component ?? meta?.preparedMeta?.component;
  return (
    component?.displayName ??
    component?.name ??
    String(meta?.csfFile?.meta?.title ?? '').split('/').pop()?.replace(/\s+/g, '')
  );
}

const panel: React.CSSProperties = {
  direction: 'rtl',
  fontFamily: 'var(--font-family-body)',
  lineHeight: 1.7,
  border: '1px solid var(--color-border, #e5e5e5)',
  borderRadius: 12,
  padding: '16px 20px',
  margin: '16px 0 24px',
};

function ArabicDoc({mod, name}: {mod: Record<string, any>; name: string}) {
  const en: Doc = mod.docs;
  const ar: Doc = mod.docsAr;
  const entryEn: Doc =
    en.name === name ? en : (en.components ?? []).find((c: Doc) => c.name === name) ?? en;
  const entryAr: Doc =
    en.name === name ? ar : (ar.components ?? []).find((c: Doc) => c.name === name) ?? ar;
  const props: Doc[] = entryEn.props ?? [];
  const usage: Doc = ar.usage ?? {};
  return (
    <section lang="ar" dir="rtl" style={panel} data-testid="arabic-docs">
      <p>{entryAr.description ?? ar.description}</p>
      {usage.description ? (
        <>
          <h3>الاستخدام</h3>
          <p>{usage.description}</p>
        </>
      ) : null}
      {usage.bestPractices?.length ? (
        <>
          <h3>أفضل الممارسات</h3>
          <ul>
            {usage.bestPractices.map((b: Doc, i: number) => (
              <li key={i}>
                <strong>{b.guidance ? 'افعل: ' : 'لا تفعل: '}</strong>
                {b.description}
              </li>
            ))}
          </ul>
        </>
      ) : null}
      {usage.anatomy?.length ? (
        <>
          <h3>البنية</h3>
          <ul>
            {usage.anatomy.map((a: Doc, i: number) => (
              <li key={i}>
                <strong>{a.name}</strong> — {a.description}
              </li>
            ))}
          </ul>
        </>
      ) : null}
      {props.length ? (
        <>
          <h3>الخصائص</h3>
          <table style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead>
              <tr>
                <th style={{textAlign: 'start'}}>الخاصية</th>
                <th style={{textAlign: 'start'}}>النوع</th>
                <th style={{textAlign: 'start'}}>الوصف</th>
              </tr>
            </thead>
            <tbody>
              {props.map(p => (
                <tr key={p.name}>
                  <td dir="ltr" style={{textAlign: 'start'}}>
                    <code>{p.name}</code>
                  </td>
                  <td dir="ltr" style={{textAlign: 'start'}}>
                    <code>{p.type}</code>
                  </td>
                  <td>{entryAr.propDescriptions?.[p.name] ?? p.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : null}
    </section>
  );
}

export function ArabicDocsPage() {
  const locale = useLocaleGlobal();
  const meta = useOf('meta');
  const name = componentNameOf(meta);
  const mod = name ? byName.get(name) : undefined;
  const isArabic = locale.startsWith('ar');
  return (
    <>
      <Title />
      <Subtitle />
      {isArabic && mod?.docsAr ? <ArabicDoc mod={mod} name={name!} /> : <Description />}
      <Primary />
      <Controls />
      <Stories />
    </>
  );
}
