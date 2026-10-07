/**
 * pnpm docs:check — validates Solo's docs sources (the inputs of the docs
 * website) against the code. Fails (exit 1) when any rule fails:
 *
 *   docs-present     every component folder in packages/{core,charts}/src has
 *                    its .doc.mjs (or is covered by a multi-component doc)
 *   props-match      a doc's props match the component's exported props
 *                    interface: names, types, defaults, required
 *   block-example    a block's `exampleFor` names a documented component
 *   block-render     every block renders standalone (vitest + jsdom)
 *   block-imports    a block imports only what Solo exports
 *   families         families.json members are documented components
 *   family-member-docs  every family member has its own <Member>.doc.mjs
 *   family-blocks    every family page has at least one example block
 *   block-unique-names  no two blocks share (exampleFor, name)
 *   slot-elements    a slotElements `__element` is an exported component
 *   template-docs    template docs have their fields, unique names, valid filter
 *   template-render  every page template renders (vitest + jsdom), no prop leaks
 *   template-imports templates import only Solo, React, icons and their own files
 *   template-assets  every asset a template references exists
 *   rtl-physical-classes  no physical-direction class (ml/mr/pl/pr/left/right/
 *                    border-l/r, rounded-l/r, text-left/right…) outside
 *                    scripts/rtl-allowlist.json
 *   font-tokens      core + neutral define --font-family-body-arabic /
 *                    --font-family-heading-arabic; no literal font-family in
 *                    component CSS or inline styles (tokens or inherit only)
 *   translation-ar   every doc, block, template, family, sidebar item and
 *                    category has its Arabic fields; translated prop/param/
 *                    return descriptions cover exactly the documented names
 *
 * Prints a summary: components / with docs / blocks / failures per rule.
 *
 * Usage: node scripts/docs-check.mjs [--skip-render] [--verbose]
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {findPhysicalClasses, loadAllowlist} from './rtl-physical-classes.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const ts = require('typescript');
const VERBOSE = process.argv.includes('--verbose');
const SKIP_RENDER = process.argv.includes('--skip-render');

const P = (...p) => path.join(root, ...p);
const CORE = P('packages/core/src');
const CHARTS = P('packages/charts/src');
const EXAMPLES = P('packages/examples/src');
const TEMPLATES = P('packages/templates/src');
const TEMPLATE_ASSETS = P('packages/templates/public/template-assets');

/**
 * Folders in packages/core/src that are not components (no doc expected).
 * Every entry needs a reason.
 */
const NOT_COMPONENT_FOLDERS = {
  __tests__: 'shared test helpers',
  hooks: 'hooks — each hook has its own .doc.mjs, checked as a doc, not a folder',
  i18n: 'internationalization runtime (InternationalizationProvider is documented in i18n/)',
  theme: 'theme system (Theme, useTheme… are documented in theme/)',
  utils: 'internal utilities',
  fonts: 'optional font stylesheet + files (IBM Plex Sans Arabic)',
  NavItem: 'shared nav-item styles only (no component)',
  SizeContext: 'size context plumbing (SizeProvider/useSize), not a documented component',
  InteractiveRoleContext: 'context plumbing, not a documented component',
};

/** Third-party modules a block may import. */
const ALLOWED_EXTERNAL = [/^react$/, /^react-dom(\/.*)?$/, /^@heroicons\/react\/.+$/, /^lucide-react$/];

const failures = {
  'docs-present': [],
  'props-match': [],
  'block-example': [],
  'block-render': [],
  'block-imports': [],
  families: [],
  'family-member-docs': [],
  'family-blocks': [],
  'block-unique-names': [],
  'slot-elements': [],
  'template-docs': [],
  'template-render': [],
  'template-imports': [],
  'template-assets': [],
  'translation-ar': [],
  'rtl-physical-classes': [],
  'font-tokens': [],
};
const fail = (rule, msg) => failures[rule].push(msg);

// ---------------------------------------------------------------------------
// Load docs
// ---------------------------------------------------------------------------

function walk(dir, pred, out = []) {
  for (const e of fs.readdirSync(dir, {withFileTypes: true})) {
    if (e.name === 'node_modules') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, pred, out);
    else if (pred(p)) out.push(p);
  }
  return out;
}

const docFiles = [
  ...walk(CORE, p => p.endsWith('.doc.mjs')),
  ...walk(CHARTS, p => p.endsWith('.doc.mjs')),
];

/** name → {file, entry, pkg, isHook} for every documented component/hook. */
const documented = new Map();
/** [{name, props, file, pkg}] component entries with props to verify. */
const propEntries = [];

const docModules = new Map(); // file → module
for (const file of docFiles) {
  const pkg = file.startsWith(CHARTS) ? 'charts' : 'core';
  const mod = await import(pathToFileURL(file).href);
  docModules.set(file, mod);
  const doc = mod.docs;
  if (!doc) continue;
  const isHook = Array.isArray(doc.params) || Array.isArray(doc.returns) || /^use[A-Z]/.test(doc.name ?? '');
  const add = (entry, sourceDoc) => {
    if (!entry?.name) return;
    if (!documented.has(entry.name) || entry.props) {
      documented.set(entry.name, {file, entry, pkg, isHook: /^use[A-Z]/.test(entry.name) || isHook});
    }
    if (Array.isArray(entry.props) && !/^use[A-Z]/.test(entry.name)) {
      propEntries.push({name: entry.name, props: entry.props, file, pkg, doc: sourceDoc});
    }
  };
  if (Array.isArray(doc.components)) {
    for (const c of doc.components) add(c, doc);
    if (doc.name && !documented.has(doc.name)) documented.set(doc.name, {file, entry: doc, pkg, isHook});
  } else {
    add(doc, doc);
  }
}

// ---------------------------------------------------------------------------
// Rule: docs-present
// ---------------------------------------------------------------------------

const componentFolders = fs
  .readdirSync(CORE, {withFileTypes: true})
  .filter(e => e.isDirectory() && !(e.name in NOT_COMPONENT_FOLDERS))
  .map(e => e.name);
let foldersWithDocs = 0;
for (const folder of componentFolders) {
  const dir = path.join(CORE, folder);
  const hasDoc = fs.readdirSync(dir).some(f => f.endsWith('.doc.mjs'));
  // A component documented as an entry of another folder's multi-component
  // doc (HStack/VStack in Stack/Stack.doc.mjs) is covered there.
  const coveredElsewhere = documented.has(folder);
  if (hasDoc || coveredElsewhere) foldersWithDocs++;
  else fail('docs-present', `packages/core/src/${folder}/ has no .doc.mjs`);
}
// charts: one doc per exported component module at the package root
const chartComponents = fs.readdirSync(CHARTS).filter(f => /^Chart\w*\.tsx$/.test(f) && !f.includes('.test.'));
for (const f of chartComponents) {
  const name = f.replace(/\.tsx$/, '');
  if (!fs.existsSync(path.join(CHARTS, `${name}.doc.mjs`))) {
    fail('docs-present', `packages/charts/src/${name}.tsx has no ${name}.doc.mjs`);
  } else foldersWithDocs++;
}

// ---------------------------------------------------------------------------
// TypeScript program over the packages and the example blocks
// ---------------------------------------------------------------------------

const blockFiles = walk(EXAMPLES, p => p.endsWith('.tsx') && !p.includes('__tests__'));
const templateFiles = fs.existsSync(TEMPLATES)
  ? walk(TEMPLATES, p => /\.tsx?$/.test(p) && !p.includes('__tests__'))
  : [];
const paths = {
  '@solo/core': ['packages/core/src/index.ts'],
  '@solo/core/locales/*': ['packages/core/src/i18n/generated-locales/*'],
  '@solo/core/*': ['packages/core/src/*'],
  '@solo/charts': ['packages/charts/src/index.ts'],
  '@solo/charts/*': ['packages/charts/src/*'],
  '@solo/theme-neutral': ['packages/theme-neutral/src/source.ts'],
  '@solo/theme-neutral/built': ['packages/theme-neutral/built/neutral'],
};
const compilerOptions = {
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  jsx: ts.JsxEmit.ReactJSX,
  strict: true,
  // Doc types describe handlers with the general event type
  // (`(e: MouseEvent) => void`); compare parameters bivariantly so that reads
  // as the same type as `MouseEventHandler<HTMLButtonElement>`.
  strictFunctionTypes: false,
  skipLibCheck: true,
  noEmit: true,
  allowImportingTsExtensions: true,
  resolveJsonModule: true,
  esModuleInterop: true,
  baseUrl: root,
  paths,
  types: [],
};

// Virtual files used for doc-type assignability checks.
const virtual = new Map();
const host = ts.createCompilerHost(compilerOptions);
const origRead = host.readFile.bind(host);
const origExists = host.fileExists.bind(host);
const origGet = host.getSourceFile.bind(host);
host.readFile = f => virtual.get(f) ?? origRead(f);
host.fileExists = f => virtual.has(f) || origExists(f);
host.getSourceFile = (f, lang, onErr, create) =>
  virtual.has(f) ? ts.createSourceFile(f, virtual.get(f), lang, true) : origGet(f, lang, onErr, create);

const coreIndex = P('packages/core/src/index.ts');
const chartsIndex = P('packages/charts/src/index.ts');

function exportsOf(program, file) {
  const checker = program.getTypeChecker();
  const sf = program.getSourceFile(file);
  const sym = sf && checker.getSymbolAtLocation(sf);
  return sym ? checker.getExportsOfModule(sym) : [];
}

/** Resolve `@solo/core/X` style specifiers the way package exports do. */
function resolveSpecifier(spec, fromFile) {
  const r = ts.resolveModuleName(spec, fromFile, compilerOptions, host);
  return r.resolvedModule?.resolvedFileName ?? null;
}

// Pass 1: build the program; find each documented component's props type.
// Props are checked without the templates in the program: a template that
// imports a built theme brings its module augmentations (e.g. Badge `gray`).
let program = ts.createProgram({rootNames: [coreIndex, chartsIndex, ...blockFiles], options: compilerOptions, host});
let checker = program.getTypeChecker();

const exportedValues = new Map(); // name → {symbol, pkg, indexFile}
for (const [pkg, idx] of [['core', coreIndex], ['charts', chartsIndex]]) {
  for (const s of exportsOf(program, idx)) {
    const target = s.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(s) : s;
    exportedValues.set(s.name, {symbol: target, pkg, indexFile: idx});
  }
}
const isComponentExport = name => {
  const e = exportedValues.get(name);
  return !!e && /^[A-Z]/.test(name) && !!(e.symbol.flags & (ts.SymbolFlags.Function | ts.SymbolFlags.Variable | ts.SymbolFlags.Class));
};

/** Locate the component's declaration file + props type name. */
function componentInfo(name) {
  const e = exportedValues.get(name);
  if (!e) return null;
  const decl = e.symbol.valueDeclaration ?? e.symbol.declarations?.[0];
  if (!decl) return null;
  const file = decl.getSourceFile().fileName;
  // first parameter of the function component
  let fn = decl;
  if (ts.isVariableDeclaration(decl) && decl.initializer) fn = decl.initializer;
  // Unwrap `function X<T>() {…} as …`, `memo(Impl)`, `forwardRef(fn)`.
  for (let i = 0; i < 6; i++) {
    if (ts.isAsExpression(fn) || ts.isParenthesizedExpression(fn) || ts.isSatisfiesExpression(fn) || ts.isTypeAssertionExpression?.(fn)) {
      fn = fn.expression;
    } else if (ts.isCallExpression(fn) && fn.arguments[0]) {
      fn = fn.arguments[0];
    } else if (ts.isIdentifier(fn)) {
      const s = checker.getSymbolAtLocation(fn);
      const d = s?.valueDeclaration ?? s?.declarations?.[0];
      if (!d) break;
      fn = ts.isVariableDeclaration(d) && d.initializer ? d.initializer : d;
    } else break;
  }
  const params = fn.parameters ?? [];
  return {file, fn, param: params[0] ?? null};
}

/** Destructured defaults from `function X({a = 1, b = 'x'})`. */
function destructuredDefaults(param) {
  const out = new Map();
  if (param && ts.isObjectBindingPattern(param.name)) {
    for (const el of param.name.elements) {
      if (!el.initializer) continue;
      const key = (el.propertyName ?? el.name).getText();
      out.set(key, el.initializer.getText());
    }
  }
  return out;
}

const normalizeLiteral = s =>
  String(s)
    .replace(/\s+/g, '')
    .replace(/^\{(.*)\}$/, '$1')
    .replace(/^['"`](.*)['"`]$/, '$1')
    .replace(/"/g, "'");

/** A doc default worth comparing: a number, string, boolean, null, [] or {}. */
const isLiteralText = s =>
  /^\s*(-?\d+(\.\d+)?|['"`][^'"`]*['"`]|true|false|null|undefined|\[\s*\]|\{\s*\}|[A-Za-z][\w-]*)\s*$/.test(s);

/** Code default text → literal text, resolving a same-file const. */
function resolveDefault(text) {
  if (/^(-?\d+(\.\d+)?|['"`][^'"`]*['"`]|true|false|null|undefined|\[\s*\]|\{\s*\})$/.test(text)) return text;
  if (/^[A-Z_][A-Z0-9_]*$/.test(text)) return CONSTANTS.get(text) ?? null;
  return null;
}
const CONSTANTS = new Map();

/** Props that come from BaseProps / DOM attributes rather than the component. */
function isInheritedFromPlatform(prop) {
  return (prop.declarations ?? []).every(d => {
    const f = d.getSourceFile().fileName;
    return f.includes('node_modules') || f.endsWith('/BaseProps.ts');
  });
}

// Build one virtual file per documented component, containing an
// assignability probe for each documented prop type.
const probes = []; // {name, prop, file(virtual), line}
const componentChecks = [];
for (const entry of propEntries) {
  const info = componentInfo(entry.name);
  if (!info) {
    fail('props-match', `${entry.name}: documented in ${path.relative(root, entry.file)} but not exported by @solo/${entry.pkg}`);
    continue;
  }
  if (!info.param) {
    if (entry.props.length) fail('props-match', `${entry.name}: documents ${entry.props.length} props but takes none`);
    continue;
  }
  const propsType = checker.getTypeAtLocation(info.param);
  componentChecks.push({entry, info, propsType});
}

for (const c of componentChecks) {
  const {entry, info, propsType} = c;
  const vfile = P(`.docs-check-${entry.name}.tsx`);
  const rel = './' + path.relative(root, info.file).replace(/\.tsx?$/, '');
  const moduleExports = exportsOf(program, info.file).map(s => s.name);
  const typeNames = moduleExports.filter(n => /^[A-Z]/.test(n));
  const coreTypeNames = exportsOf(program, coreIndex).map(x => x.name).filter(n => /^[A-Z]/.test(n) && !typeNames.includes(n));
  let src = `import type * as React from 'react';\n`;
  src += `import type {ReactNode, ReactElement, CSSProperties, Ref, RefObject, MouseEvent, KeyboardEvent, FocusEvent, ChangeEvent, FormEvent, PointerEvent, ClipboardEvent, DragEvent, WheelEvent, SyntheticEvent, AriaRole, SVGProps, ComponentType, ElementType, HTMLAttributes, ComponentProps, Dispatch, SetStateAction, JSX} from 'react';\n`;
  src += `import type * as __M from '${rel}';\n`;
  src += `import type * as __C from './packages/core/src/index';\n`;
  src += `import type * as __CH from './packages/charts/src/index';\n`;
  for (const n of typeNames) if (isTypeOnly(info.file, n)) src += `type ${n} = __M.${n};\n`;
  for (const n of coreTypeNames) if (isTypeOnly(coreIndex, n)) src += `type ${n} = __C.${n};\n`;
  const chartsTypeNames = exportsOf(program, chartsIndex).map(x => x.name)
    .filter(n => /^[A-Z]/.test(n) && !typeNames.includes(n) && !coreTypeNames.includes(n));
  for (const n of chartsTypeNames) if (isTypeOnly(chartsIndex, n)) src += `type ${n} = __CH.${n};\n`;
  // Docs name a generic component's type parameters (`value: Value`).
  for (const tp of info.fn.typeParameters ?? []) src += `type ${tp.name.text} = any;\n`;
  // Resolve the component through its package index: a component may be a
  // re-export under another name (ContextMenuItem = DropdownMenuItem).
  const ns = exportedValues.get(entry.name)?.pkg === 'charts' ? '__CH' : '__C';
  src += `declare function __props(): Parameters<typeof ${ns}.${entry.name}>[0];\n`;
  src += `type __P = NonNullable<ReturnType<typeof __props>>;\n`;
  entry.props.forEach((prop, i) => {
    if (!prop.type || /^\s*$/.test(prop.type)) return;
    // data-*/aria-* come from an index signature or the DOM types.
    if (/^(data|aria)-/.test(prop.name)) return;
    const docType = prop.type.replace(/\n/g, ' ');
    src += `// ${prop.name}\n`;
    src += `declare const __doc${i}: Exclude<${docType}, undefined>;\n`;
    src += `declare const __act${i}: Exclude<__P extends {${JSON.stringify(prop.name)}?: infer T} ? T : never, undefined>;\n`;
    src += `const __a${i}: Exclude<__P extends {${JSON.stringify(prop.name)}?: infer T} ? T : never, undefined> = __doc${i};\n`;
    src += `const __b${i}: Exclude<${docType}, undefined> = __act${i};\n`;
  });
  virtual.set(vfile, src);
  c.vfile = vfile;
}

function isTypeOnly(file, name) {
  const s = exportsOf(program, file).find(x => x.name === name);
  if (!s) return false;
  const t = s.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(s) : s;
  if (!(t.flags & (ts.SymbolFlags.Type | ts.SymbolFlags.Interface | ts.SymbolFlags.TypeAlias | ts.SymbolFlags.Enum))) return false;
  // Generic types can't be aliased without arguments; docs inline them.
  return !(t.declarations ?? []).some(d => d.typeParameters?.length);
}

// Pass 2: include the probes.
program = ts.createProgram({rootNames: [coreIndex, chartsIndex, ...blockFiles, ...virtual.keys()], options: compilerOptions, host, oldProgram: program});
checker = program.getTypeChecker();

for (const sf of program.getSourceFiles()) {
  if (sf.fileName.includes('node_modules')) continue;
  for (const st of sf.statements) {
    if (!ts.isVariableStatement(st)) continue;
    for (const d of st.declarationList.declarations) {
      if (ts.isIdentifier(d.name) && /^[A-Z_][A-Z0-9_]*$/.test(d.name.text) && d.initializer &&
          (ts.isNumericLiteral(d.initializer) || ts.isStringLiteral(d.initializer) || d.initializer.kind === ts.SyntaxKind.TrueKeyword || d.initializer.kind === ts.SyntaxKind.FalseKeyword)) {
        CONSTANTS.set(d.name.text, d.initializer.getText());
      }
    }
  }
}

for (const c of componentChecks) {
  const {entry, info} = c;
  const propsType = checker.getTypeAtLocation(componentInfo(entry.name).param);
  const actualProps = new Map(checker.getPropertiesOfType(checker.getApparentType(propsType)).map(p => [p.name, p]));
  const documentedNames = new Set(entry.props.map(p => p.name));
  const defaults = destructuredDefaults(componentInfo(entry.name).param);
  const where = `${entry.name} (${path.relative(root, entry.file)})`;

  // names
  for (const p of entry.props) {
    if (/^(data|aria)-/.test(p.name)) continue; // index signature / DOM attrs
    if (!actualProps.has(p.name)) fail('props-match', `${where}: documents prop "${p.name}" which ${entry.name}Props does not have`);
  }
  for (const [name, sym] of actualProps) {
    if (documentedNames.has(name) || isInheritedFromPlatform(sym)) continue;
    // Styling/infra props every component accepts (docs-types: "Skip
    // internal/styling props like className, style, and data-testid").
    if (['ref', 'key', 'className', 'style'].includes(name) || name.startsWith('data-') || name.startsWith('aria-')) continue;
    fail('props-match', `${where}: prop "${name}" is not documented`);
  }
  // required
  for (const p of entry.props) {
    const sym = actualProps.get(p.name);
    if (!sym) continue;
    const optional = !!(sym.flags & ts.SymbolFlags.Optional);
    if (!optional && p.required !== true) fail('props-match', `${where}: "${p.name}" is required in code but not marked required`);
    if (optional && p.required === true) fail('props-match', `${where}: "${p.name}" is marked required but is optional in code`);
  }
  // defaults — compared when the doc states a literal and the code
  // destructures one (named constants are resolved to their literal).
  for (const p of entry.props) {
    if (p.default == null || !defaults.has(p.name)) continue;
    if (!isLiteralText(String(p.default))) continue; // prose ("true for bottom; …")
    const codeDefault = resolveDefault(defaults.get(p.name));
    if (codeDefault == null) continue; // computed in code (expression)
    if (normalizeLiteral(p.default) !== normalizeLiteral(codeDefault)) {
      fail('props-match', `${where}: "${p.name}" default is ${p.default} in docs but ${codeDefault} in code`);
    }
  }
  // types (diagnostics in the probe file)
  const sf = program.getSourceFile(c.vfile);
  if (sf) {
    const diags = program.getSemanticDiagnostics(sf);
    const reported = new Set();
    for (const d of diags) {
      const line = sf.getLineAndCharacterOfPosition(d.start ?? 0).line;
      const lines = sf.text.split('\n');
      let k = line;
      while (k >= 0 && !lines[k].startsWith('// ')) k--;
      const propName = k >= 0 ? lines[k].slice(3) : '?';
      if (reported.has(propName)) continue;
      reported.add(propName);
      const p = entry.props.find(x => x.name === propName);
      const msg = ts.flattenDiagnosticMessageText(d.messageText, ' ').slice(0, 160);
      fail('props-match', `${where}: "${propName}" type ${JSON.stringify(p?.type)} does not match the code (${msg})`);
    }
  }
}

// ---------------------------------------------------------------------------
// Blocks
// ---------------------------------------------------------------------------

const familiesFile = P('packages/docs-registry/families.json');
const families = JSON.parse(fs.readFileSync(familiesFile, 'utf8'));
const familyPages = new Set(families.map(f => f.page));

const blockDocs = walk(EXAMPLES, p => p.endsWith('.doc.mjs'));
const blockTitles = new Map(); // `${exampleFor}::${name}` → [file]
const blocksByExampleFor = new Map(); // exampleFor → count
for (const file of blockDocs) {
  const {doc} = await import(pathToFileURL(file).href);
  const rel = path.relative(root, file);
  if (!doc) {
    fail('block-example', `${rel}: no \`doc\` export`);
    continue;
  }
  const titleKey = `${doc.exampleFor ?? '(standalone)'}::${doc.name}`;
  if (!blockTitles.has(titleKey)) blockTitles.set(titleKey, []);
  blockTitles.get(titleKey).push(rel);
  if (doc.exampleFor) blocksByExampleFor.set(doc.exampleFor, (blocksByExampleFor.get(doc.exampleFor) ?? 0) + 1);
  if (typeof doc.order !== 'number') fail('block-example', `${rel}: missing numeric \`order\``);
  if (doc.exampleFor && !documented.has(doc.exampleFor) && !familyPages.has(doc.exampleFor)) {
    fail('block-example', `${rel}: exampleFor "${doc.exampleFor}" is not a documented component`);
  }
  if (!fs.existsSync(file.replace(/\.doc\.mjs$/, '.tsx'))) fail('block-example', `${rel}: no matching .tsx block`);
}

/** Is a resolved file reachable through the @solo packages' "exports" maps? */
const allowedSoloSubpaths = file => {
  const rel = path.relative(root, file);
  return (
    /^packages\/core\/src\/index\.ts$/.test(rel) ||
    /^packages\/core\/src\/[^/]+\/index\.ts$/.test(rel) || // "./*"
    /^packages\/core\/src\/(theme|utils|hooks)\/[^/]+\.tsx?$/.test(rel) ||
    /^packages\/core\/src\/i18n\/index\.ts$/.test(rel) ||
    /^packages\/core\/src\/theme\/syntax\/index\.ts$/.test(rel) ||
    /^packages\/core\/src\/i18n\/generated-locales\/[^/]+\.ts$/.test(rel) ||
    /^packages\/charts\/src\/[^/]+\.tsx?$/.test(rel) ||
    /^packages\/charts\/src\/marks\/index\.ts$/.test(rel) ||
    /^packages\/theme-neutral\/src\/source\.ts$/.test(rel) ||
    /^packages\/theme-neutral\/built\/neutral\.d\.ts$/.test(rel)
  );
};
/** Check one file's imports against what Solo exports. */
function checkImports(file, rule, {allowedExternal, allowRelative}) {
  const sf = program.getSourceFile(file);
  const rel = path.relative(root, file);
  for (const stmt of sf.statements) {
    if (!ts.isImportDeclaration(stmt)) continue;
    const spec = stmt.moduleSpecifier.text;
    if (spec.startsWith('.')) {
      if (!allowRelative(spec, file)) fail(rule, `${rel}: imports "${spec}" from outside its own files`);
      continue;
    }
    if (allowedExternal.some(re => re.test(spec))) continue;
    if (!/^@solo\/(core|charts|theme-neutral)(\/|$)/.test(spec)) {
      fail(rule, `${rel}: imports "${spec}" (not Solo or an allowed dependency)`);
      continue;
    }
    const resolved = resolveSpecifier(spec, file);
    if (!resolved || !allowedSoloSubpaths(resolved)) {
      fail(rule, `${rel}: "${spec}" is not exported by Solo`);
      continue;
    }
    const names = stmt.importClause?.namedBindings && ts.isNamedImports(stmt.importClause.namedBindings)
      ? stmt.importClause.namedBindings.elements.map(e => (e.propertyName ?? e.name).text)
      : [];
    const exported = new Set(exportsOf(program, resolved).map(s => s.name));
    for (const n of names) if (!exported.has(n)) fail(rule, `${rel}: "${n}" is not exported by "${spec}"`);
  }
}

for (const file of blockFiles) {
  checkImports(file, 'block-imports', {allowedExternal: ALLOWED_EXTERNAL, allowRelative: () => true});
}

// ---------------------------------------------------------------------------
// Templates
// ---------------------------------------------------------------------------

/** Third-party modules a template may import. Solo's dashboards draw their
 *  charts with recharts, so it is allowed here (and only here). */
const TEMPLATE_EXTERNAL = [...ALLOWED_EXTERNAL, /^recharts$/];
const TEMPLATE_FILTER_VALUES = ['Dashboard', 'Table', 'Form', 'Settings', 'Login', 'Tools', 'Content', 'AI Chat', 'Gallery', 'Shell'];
const templateDocs = fs.existsSync(TEMPLATES) ? walk(TEMPLATES, p => p.endsWith('Template.doc.mjs')) : [];
const templateNames = new Map();
const templateOrders = new Map();
for (const file of templateDocs) {
  const rel = path.relative(root, file);
  const {doc} = await import(pathToFileURL(file).href);
  const slug = path.basename(path.dirname(file));
  if (!doc) {
    fail('template-docs', `${rel}: no \`doc\` export`);
    continue;
  }
  const need = {type: 'string', name: 'string', displayName: 'string', description: 'string', isReady: 'boolean', order: 'number', previewAspectRatio: 'number', slug: 'string'};
  for (const [k, t] of Object.entries(need)) {
    if (typeof doc[k] !== t) fail('template-docs', `${rel}: missing or invalid \`${k}\` (${t})`);
  }
  if (doc.type !== 'page') fail('template-docs', `${rel}: type must be 'page'`);
  if (!Array.isArray(doc.keywords) || doc.keywords.length === 0) fail('template-docs', `${rel}: missing \`keywords\``);
  if (doc.slug !== slug) fail('template-docs', `${rel}: slug "${doc.slug}" does not match its folder "${slug}"`);
  const hidden = !doc.isReady || doc.isHiddenFromOverview;
  if (doc.filter == null ? !hidden : !TEMPLATE_FILTER_VALUES.includes(doc.filter)) {
    fail('template-docs', `${rel}: filter ${JSON.stringify(doc.filter)} is not one of ${TEMPLATE_FILTER_VALUES.join(', ')}`);
  }
  if (typeof doc.category !== 'string' && !hidden) fail('template-docs', `${rel}: missing \`category\``);
  if (doc.category && doc.filter && !doc.category.startsWith(doc.filter)) {
    fail('template-docs', `${rel}: filter "${doc.filter}" does not match category "${doc.category}"`);
  }
  for (const [map, key] of [[templateNames, doc.name], [templateOrders, doc.order]]) {
    if (map.has(key)) fail('template-docs', `${rel}: ${map === templateNames ? 'name' : 'order'} ${JSON.stringify(key)} also used by ${map.get(key)}`);
    else map.set(key, rel);
  }
  if (!fs.existsSync(file.replace(/\.doc\.mjs$/, '.tsx'))) fail('template-docs', `${rel}: no matching .tsx template`);
}

program = ts.createProgram({rootNames: [coreIndex, chartsIndex, ...templateFiles], options: compilerOptions, host});
checker = program.getTypeChecker();
// Package infrastructure (index.ts, assets.ts, i18n/) is not a template.
const isTemplateSource = file =>
  path.dirname(file) !== TEMPLATES && !file.startsWith(path.join(TEMPLATES, 'i18n') + path.sep);
for (const file of templateFiles.filter(isTemplateSource)) {
  checkImports(file, 'template-imports', {
    allowedExternal: TEMPLATE_EXTERNAL,
    // own folder, or the package's shared asset helper
    allowRelative: (spec, from) => {
      const target = path.resolve(path.dirname(from), spec);
      return target.startsWith(path.dirname(from)) || target === path.join(TEMPLATES, 'assets');
    },
  });
  const text = fs.readFileSync(file, 'utf8');
  const rel = path.relative(root, file);
  for (const m of text.matchAll(/templateAsset\(\s*['"`]([^'"`]+)['"`]\s*\)/g)) {
    if (!fs.existsSync(path.join(TEMPLATE_ASSETS, m[1]))) fail('template-assets', `${rel}: asset "${m[1]}" not found in packages/templates/public/template-assets`);
  }
  for (const m of text.matchAll(/['"`]\/template-assets\/([^'"`]+)['"`]/g)) {
    fail('template-assets', `${rel}: hard-coded "/template-assets/${m[1]}" — use templateAsset('${m[1]}')`);
  }
}

// ---------------------------------------------------------------------------
// Families & slot elements
// ---------------------------------------------------------------------------

for (const [key, files] of blockTitles) {
  if (files.length > 1) {
    const [exampleFor, name] = key.split('::');
    fail('block-unique-names', `"${name}" (exampleFor ${exampleFor}) is used by ${files.join(', ')}`);
  }
}

// One doc file per family member, found by file name (the docs site loads
// `<Member>.doc.mjs` for each member of a family page).
const docFileNames = new Set(docFiles.map(f => path.basename(f, '.doc.mjs')));
for (const fam of families) {
  for (const m of fam.members) {
    if (!documented.has(m)) fail('families', `families.json "${fam.page}": member "${m}" is not a documented component`);
    if (!docFileNames.has(m)) fail('family-member-docs', `families.json "${fam.page}": member "${m}" has no ${m}.doc.mjs`);
  }
  const blockCount = [fam.page, ...fam.members].reduce((n, name) => n + (blocksByExampleFor.get(name) ?? 0), 0);
  if (blockCount === 0) fail('family-blocks', `families.json "${fam.page}": no example block has exampleFor set to the page or a member`);
}
for (const entry of propEntries) {
  for (const p of entry.props) {
    for (const el of p.slotElements ?? []) {
      const name = el?.__element;
      if (name && !isComponentExport(name)) {
        fail('slot-elements', `${entry.name}.${p.name}: slotElements __element "${name}" is not an exported component`);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Arabic (translation-ar)
// ---------------------------------------------------------------------------

const ARABIC = /[\u0600-\u06FF]/;
const isAr = v => typeof v === 'string' && v.trim().length > 0 && ARABIC.test(v);
const ar = (rel, msg) => fail('translation-ar', `${rel}: ${msg}`);
const sameKeys = (rel, label, record, names) => {
  const keys = Object.keys(record ?? {});
  const missing = names.filter(n => !keys.includes(n));
  const extra = keys.filter(k => !names.includes(k));
  if (missing.length) ar(rel, `${label} missing ${missing.join(', ')}`);
  if (extra.length) ar(rel, `${label} has keys that are not documented: ${extra.join(', ')}`);
  for (const k of keys) if (names.includes(k) && !isAr(record[k])) ar(rel, `${label}.${k} is not Arabic`);
};
const checkUsage = (rel, en, tr) => {
  if (!en) return;
  if (en.description && !isAr(tr?.description)) ar(rel, 'usage.description missing/not Arabic');
  for (const key of ['bestPractices', 'anatomy']) {
    const a = en[key] ?? [];
    const b = tr?.[key] ?? [];
    if (a.length !== b.length) {
      ar(rel, `usage.${key} has ${b.length} entries, English has ${a.length}`);
      continue;
    }
    b.forEach((item, i) => {
      if (!isAr(item.description)) ar(rel, `usage.${key}[${i}].description is not Arabic`);
      if (key === 'anatomy' && !isAr(item.name)) ar(rel, `usage.anatomy[${i}].name is not Arabic`);
    });
  }
};

for (const [file, mod] of docModules) {
  const rel = path.relative(root, file);
  const en = mod.docs;
  const tr = mod.docsAr;
  if (!en) continue;
  if (!tr) {
    ar(rel, 'no `docsAr` export');
    continue;
  }
  if (!isAr(tr.description)) ar(rel, 'description missing/not Arabic');
  checkUsage(rel, en.usage, tr.usage);
  const isHookDoc = Array.isArray(en.params) || Array.isArray(en.returns);
  if (isHookDoc) {
    if (en.params?.length) sameKeys(rel, 'paramDescriptions', tr.paramDescriptions, en.params.map(p => p.name));
    if (en.returns?.length) sameKeys(rel, 'returnDescriptions', tr.returnDescriptions, en.returns.map(r => r.name));
  }
  if (Array.isArray(en.props)) sameKeys(rel, 'propDescriptions', tr.propDescriptions, en.props.map(p => p.name));
  if (Array.isArray(en.components)) {
    for (const c of en.components) {
      if (!c.props && !c.params && !c.returns && !c.description) continue; // reference to a doc elsewhere
      const t = (tr.components ?? []).find(x => x.name === c.name);
      if (!t) {
        ar(rel, `components: no Arabic entry for ${c.name}`);
        continue;
      }
      if (!isAr(t.description)) ar(rel, `components ${c.name}: description missing/not Arabic`);
      if (c.props?.length) sameKeys(rel, `components ${c.name} propDescriptions`, t.propDescriptions, c.props.map(p => p.name));
    }
  }
}

for (const file of blockDocs) {
  const {doc} = await import(pathToFileURL(file).href);
  const rel = path.relative(root, file);
  if (!isAr(doc?.displayNameAr)) ar(rel, '`displayNameAr` missing/not Arabic');
  if (!isAr(doc?.descriptionAr)) ar(rel, '`descriptionAr` missing/not Arabic');
}
for (const file of templateDocs) {
  const {doc} = await import(pathToFileURL(file).href);
  const rel = path.relative(root, file);
  if (!isAr(doc?.displayNameAr)) ar(rel, '`displayNameAr` missing/not Arabic');
  if (!isAr(doc?.descriptionAr)) ar(rel, '`descriptionAr` missing/not Arabic');
}
for (const fam of families) {
  if (!isAr(fam.displayNameAr)) ar('packages/docs-registry/families.json', `"${fam.page}": displayNameAr missing/not Arabic`);
  if (!isAr(fam.descriptionAr)) ar('packages/docs-registry/families.json', `"${fam.page}": descriptionAr missing/not Arabic`);
}
const sidebar = JSON.parse(fs.readFileSync(P('packages/docs-registry/sidebar.json'), 'utf8'));
for (const section of sidebar) {
  if (!isAr(section.categoryAr)) ar('packages/docs-registry/sidebar.json', `category "${section.category}": categoryAr missing/not Arabic`);
  for (const item of [...section.items, ...section.utilities]) {
    // Hooks keep their code name in Arabic UI (glossary: never translate
    // hook names), so `displayNameAr` is the name itself.
    const isHook = /^use[A-Z]/.test(item.page);
    const ok = isHook ? item.displayNameAr === item.page || isAr(item.displayNameAr) : isAr(item.displayNameAr);
    if (!ok) ar('packages/docs-registry/sidebar.json', `"${item.page}": displayNameAr missing/not Arabic`);
  }
}
const OVERVIEW_CATEGORIES = ['Action', 'Chat', 'Container', 'Content', 'Data Visualization', 'Feedback & Status', 'Form Controls', 'Layout', 'Navigation', 'Overlay', 'Table & List', 'Utility'];
const categoriesFile = P('packages/docs-registry/categories.json');
const categories = fs.existsSync(categoriesFile) ? JSON.parse(fs.readFileSync(categoriesFile, 'utf8')) : [];
for (const name of OVERVIEW_CATEGORIES) {
  const c = categories.find(x => x.name === name);
  if (!c || !isAr(c.nameAr)) ar('packages/docs-registry/categories.json', `"${name}": nameAr missing/not Arabic`);
}

// ---------------------------------------------------------------------------
// RTL: physical-direction classes
// ---------------------------------------------------------------------------

{
  const allow = loadAllowlist();
  for (const [cls, {pkg, decl}] of findPhysicalClasses()) {
    if (!(cls in allow)) {
      fail('rtl-physical-classes', `${pkg}: "${cls}" (${decl}) does not mirror in RTL — use the logical utility (ms/me/ps/pe/start/end/text-start/border-s/rounded-s…) or add it to scripts/rtl-allowlist.json with a reason`);
    }
  }
}

// ---------------------------------------------------------------------------
// Fonts: Arabic tokens defined, no literal font-family
// ---------------------------------------------------------------------------

{
  const ARABIC_TOKENS = ['--font-family-body-arabic', '--font-family-heading-arabic'];
  const sources = {
    'packages/core/src/theme/tokens.css': fs.readFileSync(P('packages/core/src/theme/tokens.css'), 'utf8'),
    'packages/theme-neutral/src/neutralTheme.ts': fs.readFileSync(P('packages/theme-neutral/src/neutralTheme.ts'), 'utf8'),
    'packages/theme-neutral/built/theme.css': fs.readFileSync(P('packages/theme-neutral/built/theme.css'), 'utf8'),
    'packages/theme-neutral/built/neutral.js': fs.readFileSync(P('packages/theme-neutral/built/neutral.js'), 'utf8'),
  };
  for (const [file, text] of Object.entries(sources)) {
    for (const token of ARABIC_TOKENS) {
      if (!new RegExp(`['"]?${token}['"]?\\s*:`).test(text)) fail('font-tokens', `${file}: does not define ${token}`);
    }
  }
  // Compiled component CSS: font-family must be a token or inherit.
  const allowed = /^(inherit|var\(--font-family-[a-z-]+[,)])/;
  const bin = P('node_modules/.bin/tailwindcss');
  for (const pkg of ['core', 'charts', 'examples', 'templates']) {
    const out = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'solo-fonts-')), `${pkg}.css`);
    execFileSync(bin, ['-i', P(`packages/${pkg}/src/styles.css`), '-o', out], {stdio: 'pipe'});
    const css = fs.readFileSync(out, 'utf8').replace(/@font-face\s*\{[^}]*\}/g, '');
    for (const m of css.matchAll(/([^{};]+)\{[^{}]*?font-family:\s*([^;}]+)/g)) {
      if (!allowed.test(m[2].trim())) fail('font-tokens', `${pkg} CSS: ${m[1].trim().slice(0, 80)} sets font-family: ${m[2].trim().slice(0, 60)} (use a --font-family-* token)`);
    }
  }
  // Inline styles in components, blocks and templates.
  for (const dir of [CORE, CHARTS, EXAMPLES, TEMPLATES]) {
    for (const file of walk(dir, p => /\.tsx?$/.test(p) && !/\.test\.|__tests__/.test(p))) {
      const text = fs.readFileSync(file, 'utf8');
      for (const m of text.matchAll(/fontFamily:\s*(['"`])([^'"`]+)\1/g)) {
        if (!allowed.test(m[2].trim())) fail('font-tokens', `${path.relative(root, file)}: inline fontFamily '${m[2].slice(0, 60)}' (use a --font-family-* token)`);
      }
      for (const m of text.matchAll(/\[font-family:([^\]]+)\]/g)) {
        if (!allowed.test(m[1].trim())) fail('font-tokens', `${path.relative(root, file)}: class [font-family:${m[1].slice(0, 60)}] (use a --font-family-* token)`);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Render every block (vitest + jsdom)
// ---------------------------------------------------------------------------

if (!SKIP_RENDER) {
  const report = P('node_modules/.cache/docs-check-render.json');
  fs.mkdirSync(path.dirname(report), {recursive: true});
  try {
    execFileSync(
      process.execPath,
      [P('node_modules/vitest/vitest.mjs'), 'run', 'packages/examples', 'packages/templates', '--reporter=json', `--outputFile=${report}`],
      {cwd: root, stdio: 'ignore'},
    );
  } catch {
    // failures are read from the report below
  }
  if (fs.existsSync(report)) {
    const json = JSON.parse(fs.readFileSync(report, 'utf8'));
    for (const file of json.testResults ?? []) {
      const rule = file.name.includes('/packages/templates/') ? 'template-render' : 'block-render';
      for (const a of file.assertionResults ?? []) {
        if (a.status === 'failed') {
          fail(rule, `${a.title}: ${(a.failureMessages?.[0] ?? '').split('\n')[0].slice(0, 160)}`);
        }
      }
      if (file.status === 'failed' && (file.assertionResults ?? []).length === 0) {
        fail(rule, `${path.relative(root, file.name)}: ${(file.message ?? '').slice(0, 160)}`);
      }
    }
  } else {
    fail('block-render', 'vitest produced no report');
  }
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

const totalComponents = componentFolders.length + chartComponents.length;
console.log('\ndocs:check');
console.log(`  components (folders): ${totalComponents}`);
console.log(`  with docs:            ${foldersWithDocs}`);
console.log(`  documented entries:   ${documented.size} (${propEntries.length} with props checked)`);
console.log(`  blocks:               ${blockDocs.length}`);
console.log(`  families:             ${families.length}`);
console.log(`  templates:            ${templateDocs.length}`);
console.log('\n  failures per rule:');
let total = 0;
for (const [rule, list] of Object.entries(failures)) {
  total += list.length;
  console.log(`    ${rule.padEnd(19)} ${list.length}${/render$/.test(rule) && SKIP_RENDER ? ' (skipped)' : ''}`);
}
for (const [rule, list] of Object.entries(failures)) {
  if (!list.length) continue;
  console.log(`\n  ${rule}:`);
  for (const m of VERBOSE ? list : list.slice(0, 25)) console.log(`    - ${m}`);
  if (!VERBOSE && list.length > 25) console.log(`    … ${list.length - 25} more (--verbose)`);
}
console.log(total ? `\ndocs:check FAILED (${total})` : '\ndocs:check passed');
process.exit(total ? 1 : 0);
