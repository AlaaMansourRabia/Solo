/**
 * @file Where the templates load their images/video from.
 *
 * The assets ship in `@solo/templates/public/template-assets/`. By default a
 * host serves that folder at `/template-assets/`. To serve it elsewhere, set
 * `globalThis.__SOLO_TEMPLATE_ASSET_BASE__` (e.g. "/static/solo-assets/")
 * before the templates are imported — templates resolve asset URLs when their
 * module loads, the same moment the CLI bakes its asset paths in.
 */

declare global {
  // eslint-disable-next-line no-var
  var __SOLO_TEMPLATE_ASSET_BASE__: string | undefined;
}

const configured = globalThis.__SOLO_TEMPLATE_ASSET_BASE__;

/** Base URL of the template assets, always ending in "/". */
export const templateAssetBase: string = configured
  ? configured.endsWith('/')
    ? configured
    : `${configured}/`
  : '/template-assets/';

/** URL of one template asset file (e.g. `templateAsset('building.png')`). */
export function templateAsset(file: string): string {
  return `${templateAssetBase}${file}`;
}
