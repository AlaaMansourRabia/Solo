import {useState} from 'react';
import {act, render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import {MockTextTranslator, mergeMockText} from '../i18n/MockTextTranslator';
import {templateMockTextAr} from '../i18n/templateMockTextAr';

const dict = {
  'Primary Button': 'زر أساسي',
  'Search…': 'بحث…',
  Inbox: 'البريد الوارد',
  Count: 'العدد',
  Keep: 'Keep',
};

function Counter() {
  const [n, setN] = useState(0);
  return (
    <button type="button" onClick={() => setN(n + 1)}>
      {n === 0 ? 'Inbox' : 'Count'}
    </button>
  );
}

describe('MockTextTranslator', () => {
  it('translates text, attributes, keeps whitespace and code', () => {
    render(
      <MockTextTranslator dictionary={dict}>
        <p data-testid="p"> Primary Button </p>
        <input placeholder="Search…" aria-label="Inbox" />
        <code>Primary Button</code>
        <span translate="no">Inbox</span>
        <span>Keep</span>
      </MockTextTranslator>,
    );
    expect(screen.getByTestId('p').textContent).toBe(' زر أساسي ');
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('placeholder', 'بحث…');
    expect(input).toHaveAttribute('aria-label', 'البريد الوارد');
    expect(screen.getByText('Primary Button').tagName).toBe('CODE');
    expect(screen.getByText('Inbox').tagName).toBe('SPAN');
    expect(screen.getByText('Keep')).toBeInTheDocument();
  });

  it('re-translates text React updates', async () => {
    render(
      <MockTextTranslator dictionary={dict}>
        <Counter />
      </MockTextTranslator>,
    );
    const button = screen.getByRole('button');
    expect(button.textContent).toBe('البريد الوارد');
    await act(async () => button.click());
    await act(async () => {});
    expect(button.textContent).toBe('العدد');
  });

  it('does nothing when disabled', () => {
    render(
      <MockTextTranslator dictionary={dict} isEnabled={false}>
        <p>Primary Button</p>
      </MockTextTranslator>,
    );
    expect(screen.getByText('Primary Button')).toBeInTheDocument();
  });

  it('restores the English when switched off, without a reload', async () => {
    const view = (isEnabled: boolean) => (
      <MockTextTranslator dictionary={dict} isEnabled={isEnabled}>
        <p>Primary Button</p>
        <input placeholder="Search…" />
        <Counter />
      </MockTextTranslator>
    );
    const {rerender} = render(view(true));
    const button = screen.getByRole('button');
    await act(async () => button.click());
    await act(async () => {});
    expect(button.textContent).toBe('العدد');
    expect(screen.getByText('زر أساسي')).toBeInTheDocument();

    rerender(view(false));
    expect(screen.getByText('Primary Button')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', 'Search…');
    // React's later update wrote "Count"; that is what comes back.
    expect(button.textContent).toBe('Count');

    rerender(view(true));
    expect(screen.getByText('زر أساسي')).toBeInTheDocument();
  });

  it('ships an Arabic dictionary for every template', () => {
    expect(Object.keys(templateMockTextAr).length).toBe(55);
  });

  it('translates date-like labels word by word from the shared vocabulary', () => {
    render(
      <MockTextTranslator dictionary={templateMockTextAr.Dashboard}>
        <svg>
          <text>Jan</text>
          <text>Mar 12</text>
          <text>9:00 AM</text>
          <text>Q3 2025</text>
        </svg>
        <p>Mar 12 release notes</p>
      </MockTextTranslator>,
    );
    expect(screen.getByText('يناير')).toBeInTheDocument();
    expect(screen.getByText('مارس 12')).toBeInTheDocument();
    expect(screen.getByText('9:00 ص')).toBeInTheDocument();
    expect(screen.getByText('الربع 3 2025')).toBeInTheDocument();
    // Words outside the vocabulary keep the whole string as written.
    expect(screen.getByText('Mar 12 release notes')).toBeInTheDocument();
  });

  it('merges without letting identity entries erase translations', () => {
    expect(mergeMockText({Jan: 'يناير'}, {Jan: 'Jan', Feb: 'فبراير'})).toEqual({
      Jan: 'يناير',
      Feb: 'فبراير',
    });
  });
});
