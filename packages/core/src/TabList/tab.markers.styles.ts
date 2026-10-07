/**
 * Scoped group name for Tab ancestor selectors.
 * Used by both Tab and TabMenu to scope hover background styles
 * and ensure they don't leak from parent containers.
 *
 * Put it on the marked element and read it with `group-hover/tab:` etc.
 */
export const tabScope = 'group/tab';
