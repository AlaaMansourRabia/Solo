/**
 * Scoped group name for indicator ancestor selectors.
 *
 * An owner (CheckboxInput's row, RadioListItem's row) applies this group class
 * to the element whose hover and focus should drive the indicator's appearance.
 * The indicator reads it through `group-hover/indicator:` /
 * `group-has-[:focus-visible]/indicator:` variants, so interaction state stays
 * in CSS instead of being threaded through React props — and owners that
 * should *not* tint their indicator on hover (decorative menu markers, listbox
 * options) simply don't apply the class.
 *
 * Owners apply it only while enabled, so disabled controls get no hover
 * feedback.
 */
export const indicatorScope = "group/indicator";
