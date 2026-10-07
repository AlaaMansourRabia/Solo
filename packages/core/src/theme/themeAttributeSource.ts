/**
 * @file themeAttributeSource.ts
 * @output getThemeAttributeSource, setThemeAttributeSource, subscribeThemeAttributeSource
 * @position Theme infrastructure (Solo addition); read by detached surfaces
 *
 * The element whose `data-theme` / `data-solo-theme` attributes detached
 * surfaces (the Toast fallback viewport, mounted on <body> outside any React
 * tree) mirror so the theme's @scope'd CSS reaches them.
 *
 * By default that is <html>: the root `<Theme>` syncs its attributes there.
 * A root `<Theme syncRoot={false}>` (embedding in a host page) leaves <html>
 * untouched and registers its own wrapper element here instead.
 */

type Listener = () => void;

let source: HTMLElement | null = null;
const listeners = new Set<Listener>();

/** The element to mirror theme attributes from (falls back to <html>). */
export function getThemeAttributeSource(): HTMLElement | null {
  if (source) {
    return source;
  }
  return typeof document === 'undefined' ? null : document.documentElement;
}

/** Registers (or clears, with `null`) an embedded root Theme's wrapper. */
export function setThemeAttributeSource(element: HTMLElement | null): void {
  if (source === element) {
    return;
  }
  source = element;
  for (const listener of listeners) {
    listener();
  }
}

/** Notifies when the source element changes. Returns an unsubscribe. */
export function subscribeThemeAttributeSource(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
