/**
 * Cuts a release: sets every package to <version>, turns the changelog's
 * "Unreleased" section into "<version> — <date>", commits and tags v<version>.
 * Pushing the tag publishes the GitHub Release (.github/workflows/release.yml),
 * which notifies everyone watching the repository's releases.
 *
 * Usage: pnpm release 0.2.0
 *        git push && git push origin v0.2.0
 */
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const git = (...args) => execFileSync('git', args, {cwd: root, encoding: 'utf8'}).trim();
const fail = msg => {
  console.error(msg);
  process.exit(1);
};

const version = (process.argv[2] ?? '').replace(/^v/, '');
if (!/^\d+\.\d+\.\d+(-[0-9A-Za-z.]+)?$/.test(version)) fail('Usage: pnpm release <major.minor.patch>');
if (git('status', '--porcelain')) fail('Commit or stash your changes first — the release commit must contain only the release.');
if (git('rev-parse', '--abbrev-ref', 'HEAD') !== 'main') fail('Release from main.');
if (git('tag', '--list', `v${version}`)) fail(`Tag v${version} already exists.`);

const parse = v => v.split('-')[0].split('.').map(Number);
const rootPkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const [a, b] = [parse(version), parse(rootPkg.version)];
const newer = a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
if (newer <= 0) fail(`${version} is not newer than the current ${rootPkg.version}.`);

// Changelog: the Unreleased body becomes the release section.
const changelogPath = path.join(root, 'CHANGELOG.md');
const changelog = fs.readFileSync(changelogPath, 'utf8');
const lines = changelog.split('\n');
const unreleased = lines.findIndex(l => /^## Unreleased\s*$/.test(l));
if (unreleased < 0) fail('CHANGELOG.md has no "## Unreleased" section.');
let next = lines.findIndex((l, i) => i > unreleased && /^## /.test(l));
if (next < 0) next = lines.length;
const body = lines.slice(unreleased + 1, next).join('\n').trim();
if (!body) fail('The Unreleased section of CHANGELOG.md is empty — describe the release first.');
const date = new Date().toISOString().slice(0, 10);
lines.splice(unreleased, next - unreleased, '## Unreleased', '', `## ${version} — ${date}`, '', body, '');
fs.writeFileSync(changelogPath, lines.join('\n'));

// Versions: root, packages/*, apps/*.
const manifests = [
  'package.json',
  ...['packages', 'apps'].flatMap(dir =>
    fs.readdirSync(path.join(root, dir)).map(d => `${dir}/${d}/package.json`),
  ),
].filter(f => fs.existsSync(path.join(root, f)));
for (const file of manifests) {
  const full = path.join(root, file);
  const text = fs.readFileSync(full, 'utf8');
  fs.writeFileSync(full, text.replace(/("version":\s*")[^"]+(")/, `$1${version}$2`));
}

git('add', 'CHANGELOG.md', ...manifests);
git('commit', '-m', `Release v${version}`);
git('tag', '-a', `v${version}`, '-m', `Solo ${version}`);
console.log(`Release v${version} committed and tagged (${manifests.length} packages).
Publish it:  git push && git push origin v${version}`);
