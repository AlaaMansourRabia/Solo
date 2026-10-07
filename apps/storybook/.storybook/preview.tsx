import type {Preview, Decorator} from '@storybook/react';
import * as React from 'react';
import {
  Theme,
  defineTheme,
  LayerProvider,
  InternationalizationProvider,
} from '@solo/core';
import {neutralTheme} from '@solo/theme-neutral';
import arSA from '@solo/core/locales/ar-SA.generated';
import {ArabicDocsPage} from './ArabicDocsPage';
import '@solo/core/fonts/ibm-plex-sans-arabic.css';
import {
  MockTextTranslator,
  commonMockTextAr,
  mergeMockText,
  templateMockTextAr,
} from '@solo/templates';
import storiesMockTextAr from '../i18n/stories.ar.json';
import './storybook.css';

/** Arabic mock text for stories and templates (shown in RTL). */
const MOCK_TEXT_AR = mergeMockText(
  commonMockTextAr,
  storiesMockTextAr,
  ...Object.values(templateMockTextAr),
);

/**
 * Direction drives the whole language: LTR is English content in Figtree,
 * RTL is Arabic content (ar-SA catalog + Arabic mock text) in IBM Plex Sans
 * Arabic.
 */
const LOCALES = {
  ltr: {locale: 'en', messages: undefined},
  rtl: {locale: 'ar-SA', messages: {'ar-SA': arSA}},
} as const;

/**
 * Selectable themes. Neutral (the default) comes from @solo/theme-neutral;
 * `base` renders the raw token defaults through an empty `defineTheme()`.
 */
const themes = {
  neutral: neutralTheme,
  base: defineTheme({name: 'base'}),
};

/**
 * Decorator that wraps all stories in the Solo Theme provider.
 *
 * Sets `color-scheme` on the document root so that CSS `light-dark()`
 * resolves correctly at every level of the page — not just inside the
 * Theme wrapper div.  Without this, the iframe's `<html>` and
 * `<body>` keep the browser-default `color-scheme` (typically "light")
 * and toggling the toolbar has no visible effect.
 */
const withTheme: Decorator = (Story, context) => {
  // Get theme selection from toolbar
  const themeKey = (context.globals?.soloTheme || 'neutral') as string;
  const mode = context.globals?.colorMode === 'dark' ? 'dark' : 'light';
  const direction: 'ltr' | 'rtl' =
    context.globals?.direction === 'rtl' ? 'rtl' : 'ltr';
  const {locale, messages} = LOCALES[direction];

  // Sync color-scheme to the document root so light-dark() works
  // everywhere, including on <html>/<body> backgrounds and any
  // elements rendered outside the Theme wrapper.
  React.useEffect(() => {
    document.documentElement.style.setProperty('color-scheme', mode);
  }, [mode]);

  // No theme — render with just base defineVars defaults
  if (themeKey === 'none') {
    return (
      <InternationalizationProvider
        locale={locale}
        messages={messages}
        dir={direction}>
        <div
          dir={direction}
          lang={locale}
          style={{
            colorScheme: mode,
            padding: 16,
          }}>
          <MockTextTranslator dictionary={MOCK_TEXT_AR} isEnabled={locale === 'ar-SA'}>
            <Story />
          </MockTextTranslator>
        </div>
      </InternationalizationProvider>
    );
  }

  const theme = themes[themeKey as keyof typeof themes] || themes.neutral;

  return (
    <Theme theme={theme} mode={mode}>
      <LayerProvider>
        <InternationalizationProvider
        locale={locale}
        messages={messages}
        dir={direction}>
          <div
            dir={direction}
            lang={locale}
            style={
              context.parameters?.solo?.bare
                ? {
                    // Full-screen page templates: no padding; a definite
                    // viewport height so templates sized with h-full fill it.
                    backgroundColor: 'var(--color-background-surface)',
                    height: '100vh',
                    overflow: 'auto',
                  }
                : {
                    backgroundColor: 'var(--color-background-surface)',
                    padding: 16,
                  }
            }>
            <MockTextTranslator dictionary={MOCK_TEXT_AR} isEnabled={locale === 'ar-SA'}>
            <Story />
          </MockTextTranslator>
          </div>
        </InternationalizationProvider>
      </LayerProvider>
    </Theme>
  );
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      disable: true, // Disable backgrounds addon, use theme instead
    },
    layout: 'fullscreen',
    // LTR: standard autodocs; RTL: the component's Arabic docsAr.
    docs: {page: ArabicDocsPage},
  },
  globalTypes: {
    soloTheme: {
      description: 'Solo Theme',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          {value: 'neutral', title: 'Neutral', icon: 'circle'},
          {value: 'base', title: 'Base tokens', icon: 'circlehollow'},
          {value: 'none', title: 'None (no Theme provider)', icon: 'close'},
        ],
        dynamicTitle: true,
      },
    },
    colorMode: {
      description: 'Color mode',
      toolbar: {
        title: 'Mode',
        icon: 'contrast',
        items: [
          {value: 'light', title: 'Light', icon: 'sun'},
          {value: 'dark', title: 'Dark', icon: 'moon'},
        ],
        dynamicTitle: true,
      },
    },
    direction: {
      description: 'Text direction',
      toolbar: {
        title: 'Direction',
        icon: 'transfer',
        items: [
          {value: 'ltr', title: 'LTR · English'},
          {value: 'rtl', title: 'RTL · العربية'},
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    soloTheme: 'neutral',
    colorMode: 'light',
    direction: 'ltr',
  },
  decorators: [withTheme],
};

export default preview;
