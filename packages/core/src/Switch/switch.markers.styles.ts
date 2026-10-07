/**
 * Scoped group name for Switch ancestor selectors.
 * Prevents focus-within and hover styles from leaking from parent containers.
 *
 * Put it on the marked element (`className={cn(switchScope, …)}`) and read it
 * from descendants with `group-hover/switch:`, `group-has-[:focus-visible]/switch:` …
 */
export const switchScope = "group/switch";
