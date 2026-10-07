/**
 * Fast Arabic check for a set of files (same rules as docs:check
 * `translation-ar`). Accepts component/hook `.doc.mjs` files and block/template
 * `.doc.mjs` files. Prints problems; exit 1 if any.
 *
 * Usage: node scripts/i18n/check-ar.mjs <file...>
 */
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const ARABIC = /[؀-ۿ]/;
const isAr = v => typeof v === 'string' && v.trim().length > 0 && ARABIC.test(v);
const problems = [];
const p = (f, m) => problems.push(`${f}: ${m}`);
const sameKeys = (f, label, rec, names) => {
  const keys = Object.keys(rec ?? {});
  for (const n of names) if (!keys.includes(n)) p(f, `${label} missing ${n}`);
  for (const k of keys) if (!names.includes(k)) p(f, `${label} has undocumented key ${k}`);
  for (const k of keys) if (names.includes(k) && !isAr(rec[k])) p(f, `${label}.${k} is not Arabic`);
};
const usage = (f, en, tr) => {
  if (!en) return;
  if (en.description && !isAr(tr?.description)) p(f, 'usage.description missing/not Arabic');
  for (const key of ['bestPractices', 'anatomy']) {
    const a = en[key] ?? [], b = tr?.[key] ?? [];
    if (a.length !== b.length) { p(f, `usage.${key}: ${b.length} entries, English has ${a.length}`); continue; }
    b.forEach((it, i) => {
      if (!isAr(it.description)) p(f, `usage.${key}[${i}].description not Arabic`);
      if (key === 'anatomy' && !isAr(it.name)) p(f, `usage.anatomy[${i}].name not Arabic`);
    });
  }
};

for (const file of process.argv.slice(2)) {
  const f = path.relative(process.cwd(), file);
  let mod;
  try { mod = await import(pathToFileURL(path.resolve(file)).href); }
  catch (e) { p(f, `does not import: ${e.message}`); continue; }
  if (mod.doc) { // block or template
    if (!isAr(mod.doc.displayNameAr)) p(f, 'displayNameAr missing/not Arabic');
    if (!isAr(mod.doc.descriptionAr)) p(f, 'descriptionAr missing/not Arabic');
    continue;
  }
  const en = mod.docs, tr = mod.docsAr;
  if (!en) continue;
  if (!tr) { p(f, 'no docsAr export'); continue; }
  if (!isAr(tr.description)) p(f, 'description missing/not Arabic');
  usage(f, en.usage, tr.usage);
  if (Array.isArray(en.params) && en.params.length) sameKeys(f, 'paramDescriptions', tr.paramDescriptions, en.params.map(x => x.name));
  if (Array.isArray(en.returns) && en.returns.length) sameKeys(f, 'returnDescriptions', tr.returnDescriptions, en.returns.map(x => x.name));
  if (Array.isArray(en.props)) sameKeys(f, 'propDescriptions', tr.propDescriptions, en.props.map(x => x.name));
  for (const c of en.components ?? []) {
    if (!c.props && !c.params && !c.returns && !c.description) continue;
    const t = (tr.components ?? []).find(x => x.name === c.name);
    if (!t) { p(f, `components: no Arabic entry for ${c.name}`); continue; }
    if (!isAr(t.description)) p(f, `components ${c.name}: description not Arabic`);
    if (c.props?.length) sameKeys(f, `components ${c.name} propDescriptions`, t.propDescriptions, c.props.map(x => x.name));
  }
}
for (const m of problems) console.log(m);
console.log(problems.length ? `${problems.length} problem(s)` : 'check-ar: ok');
process.exit(problems.length ? 1 : 0);
