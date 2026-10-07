'use client';

/**
 * @file MockTextTranslator.tsx
 * @output MockTextTranslator, translateMockText, mergeMockText
 * @position Solo addition: shows a template's / story's English mock text in
 *   another language without changing its source.
 *
 * Templates and stories carry English mock data (names, labels, table rows,
 * placeholders). For an Arabic preview, wrap them in
 *
 *   <MockTextTranslator dictionary={templateMockTextAr.Dashboard}>
 *     <DashboardTemplate />
 *   </MockTextTranslator>
 *
 * and every text node / `placeholder` / `aria-label` / `title` / `alt` whose
 * trimmed value is a dictionary key is shown translated (surrounding
 * whitespace kept). It runs after render and on every DOM change (a
 * MutationObserver), so React updates are re-translated; React itself never
 * reads the DOM text back, so rendering is unaffected. Text inside
 * code/pre/kbd/samp or `translate="no"` is left alone, as are input values.
 * Short composite labels made only of dictionary words, numbers and
 * punctuation ("Mar 12", "Mon, Oct 3", "9:00 AM") are translated word by
 * word, so chart ticks and dates follow the shared date vocabulary.
 * Component strings (Pagination labels, dates…) come from the locale catalog,
 * not from here.
 */

import {useLayoutEffect, useRef, type ReactNode} from 'react';

export type MockTextDictionary = Readonly<Record<string, string>>;

const ATTRIBUTES = ['placeholder', 'aria-label', 'title', 'alt', 'aria-description'] as const;
const SKIP = 'code,pre,kbd,samp,script,style,[translate="no"]';

// Words, digits and date/time punctuation only — anything else (URLs, code,
// sentences with symbols) needs an exact-match entry.
const COMPOSITE = /^[A-Za-z\d\s,.:/+%–—-]+$/;
// A word plus an optional trailing digit, so "Q3" / "H1" are looked up whole.
const WORD = /[A-Za-z]+\d?/g;

/** Translation of `text` (trimmed), or undefined when there is none. */
function lookup(text: string, dictionary: MockTextDictionary): string | undefined {
  const exact = dictionary[text];
  if (exact !== undefined && exact !== text) return exact;
  // Untranslated or identity entries ("Mar 12" kept as-is) still get the
  // word-by-word pass below.
  if (!COMPOSITE.test(text) || !/\d/.test(text)) return undefined;
  const words = text.match(WORD);
  if (!words) return undefined;
  for (const word of words) {
    const t = dictionary[word];
    if (t === undefined || t === word) return undefined;
  }
  return text.replace(WORD, word => dictionary[word]!);
}

/**
 * Merge dictionaries, later ones winning — except that an untranslated
 * (identity) entry never replaces a real translation from an earlier one.
 */
export function mergeMockText(...dictionaries: MockTextDictionary[]): MockTextDictionary {
  const merged: Record<string, string> = {};
  for (const dictionary of dictionaries) {
    for (const [key, value] of Object.entries(dictionary)) {
      if (value === key && merged[key] !== undefined) continue;
      merged[key] = value;
    }
  }
  return merged;
}

/**
 * What the translator changed, so it can be undone when it is turned off or
 * unmounted. React never re-renders text it believes is unchanged, so without
 * this, switching back to English would leave the Arabic on screen.
 */
type Change = {original: string; translated: string};
interface Journal {
  texts: Map<Text, Change>;
  attributes: Map<Element, Map<string, Change>>;
}

function setText(node: Text, next: string, journal?: Journal) {
  const current = node.nodeValue ?? '';
  if (current === next) return;
  if (journal) {
    const prev = journal.texts.get(node);
    // Already ours → keep the first original; otherwise React wrote new text.
    const original = prev && prev.translated === current ? prev.original : current;
    journal.texts.set(node, {original, translated: next});
  }
  node.nodeValue = next;
}

function setAttribute(el: Element, name: string, next: string, journal?: Journal) {
  const current = el.getAttribute(name) ?? '';
  if (current === next) return;
  if (journal) {
    let changes = journal.attributes.get(el);
    if (!changes) journal.attributes.set(el, (changes = new Map()));
    const prev = changes.get(name);
    const original = prev && prev.translated === current ? prev.original : current;
    changes.set(name, {original, translated: next});
  }
  el.setAttribute(name, next);
}

/** Put back every original value the translator still owns. */
function restore(journal: Journal) {
  journal.texts.forEach(({original, translated}, node) => {
    if (node.nodeValue === translated) node.nodeValue = original;
  });
  journal.attributes.forEach((changes, el) => {
    changes.forEach(({original, translated}, name) => {
      if (el.getAttribute(name) === translated) el.setAttribute(name, original);
    });
  });
  journal.texts.clear();
  journal.attributes.clear();
}

/**
 * SVG chart labels (Recharts' <Text>) wrap by splitting words into <tspan>s,
 * so "Architecture sign-off" arrives as two text nodes. Match the joined label
 * and put the translation in the first tspan.
 */
function translateWrappedSvgLabel(
  node: Text,
  dictionary: MockTextDictionary,
  journal?: Journal,
): boolean {
  const tspan = node.parentElement;
  const label = tspan?.parentElement;
  if (tspan?.localName !== 'tspan' || label?.localName !== 'text') return false;
  const parts = Array.from(label.children).filter(c => c.localName === 'tspan');
  if (parts.length < 2) return false;
  const joined = parts.map(p => p.textContent?.trim() ?? '').filter(Boolean).join(' ');
  const translated = lookup(joined, dictionary);
  if (translated === undefined) return false;
  // Write through the existing text nodes (never replace them): React keeps
  // references to these nodes and updates them in place.
  parts.forEach((p, i) => {
    p.childNodes.forEach((child, j) => {
      if (child.nodeType === Node.TEXT_NODE) {
        setText(child as Text, i === 0 && j === 0 ? translated : '', journal);
      }
    });
  });
  return true;
}

function translateText(node: Text, dictionary: MockTextDictionary, journal?: Journal) {
  if (translateWrappedSvgLabel(node, dictionary, journal)) return;
  const value = node.nodeValue;
  if (!value) return;
  const trimmed = value.trim();
  if (!trimmed) return;
  const translated = lookup(trimmed, dictionary);
  if (translated === undefined) return;
  if (node.parentElement?.closest(SKIP)) return;
  const start = value.indexOf(trimmed);
  setText(node, value.slice(0, start) + translated + value.slice(start + trimmed.length), journal);
}

function translateAttributes(el: Element, dictionary: MockTextDictionary, journal?: Journal) {
  for (const name of ATTRIBUTES) {
    const value = el.getAttribute(name);
    if (!value) continue;
    const translated = lookup(value.trim(), dictionary);
    if (translated !== undefined && !el.closest(SKIP)) {
      setAttribute(el, name, translated, journal);
    }
  }
}

/** Translate every matching text node and attribute under `root`, once. */
export function translateMockText(root: Node, dictionary: MockTextDictionary): void {
  translateTree(root, dictionary);
}

function translateTree(root: Node, dictionary: MockTextDictionary, journal?: Journal): void {
  const walker = root.ownerDocument!.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
  let node: Node | null = root;
  while (node) {
    if (node.nodeType === Node.TEXT_NODE) translateText(node as Text, dictionary, journal);
    else if (node.nodeType === Node.ELEMENT_NODE) translateAttributes(node as Element, dictionary, journal);
    node = walker.nextNode();
  }
}

export interface MockTextTranslatorProps {
  /** English → translated text. Entries whose value equals the key are kept. */
  dictionary: MockTextDictionary;
  /** Turn translation off (e.g. when the locale is English). @default true */
  isEnabled?: boolean;
  children: ReactNode;
}

/**
 * Shows the English mock text of its children in another language (see the
 * file comment). Renders a `display: contents` wrapper.
 */
export function MockTextTranslator({
  dictionary,
  isEnabled = true,
  children,
}: MockTextTranslatorProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || !isEnabled) return;
    const journal: Journal = {texts: new Map(), attributes: new Map()};
    translateTree(root, dictionary, journal);
    const observer = new MutationObserver(records => {
      for (const record of records) {
        if (record.type === 'characterData') {
          translateText(record.target as Text, dictionary, journal);
        } else if (record.type === 'attributes') {
          translateAttributes(record.target as Element, dictionary, journal);
        } else {
          record.addedNodes.forEach(n => translateTree(n, dictionary, journal));
        }
      }
    });
    observer.observe(root, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: [...ATTRIBUTES],
    });
    return () => {
      observer.disconnect();
      // Turning translation off (or unmounting) puts the English back.
      restore(journal);
    };
  }, [dictionary, isEnabled]);

  return (
    <div ref={ref} style={{display: 'contents'}}>
      {children}
    </div>
  );
}
