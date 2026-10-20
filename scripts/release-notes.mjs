/**
 * Prints the CHANGELOG.md section for one version — the GitHub Release notes.
 * Exits 1 when the version has no section or the section is empty.
 *
 * Usage: node scripts/release-notes.mjs 0.2.0
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export function releaseNotes(changelog, version) {
  const lines = changelog.split('\n');
  const start = lines.findIndex(l => new RegExp(`^## ${version.replace(/\./g, '\\.')}(\\s|$)`).test(l));
  if (start < 0) return null;
  let end = lines.findIndex((l, i) => i > start && /^## /.test(l));
  if (end < 0) end = lines.length;
  return lines.slice(start + 1, end).join('\n').trim();
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const version = (process.argv[2] ?? '').replace(/^v/, '');
  const notes = releaseNotes(fs.readFileSync(path.join(root, 'CHANGELOG.md'), 'utf8'), version);
  if (!notes) {
    console.error(`CHANGELOG.md has no notes for ${version || '(no version given)'}`);
    process.exit(1);
  }
  console.log(notes);
}
