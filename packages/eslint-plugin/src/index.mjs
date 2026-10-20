/**
 * @file index.mjs
 * @output @solo/eslint-plugin — `logical-direction`, plus a `recommended`
 *   flat config.
 *
 * Usage (eslint.config.js):
 *   import solo from '@solo/eslint-plugin';
 *   export default [solo.configs.recommended];
 */

import {checkClassString, checkStyleProperty} from './physical.mjs';

/** Functions whose string arguments are class lists. */
const CLASS_FUNCTIONS = new Set(['cn', 'clsx', 'classnames', 'cx', 'twMerge', 'twJoin', 'cva', 'tv']);
const CLASS_ATTRIBUTES = new Set(['className', 'class']);

function staticStrings(node, out = []) {
  if (!node) return out;
  switch (node.type) {
    case 'Literal':
      if (typeof node.value === 'string') out.push({node, value: node.value});
      break;
    case 'TemplateLiteral':
      for (const q of node.quasis) out.push({node: q, value: q.value.cooked ?? ''});
      for (const e of node.expressions) staticStrings(e, out);
      break;
    case 'ConditionalExpression':
      staticStrings(node.consequent, out);
      staticStrings(node.alternate, out);
      break;
    case 'LogicalExpression':
      staticStrings(node.right, out);
      staticStrings(node.left, out);
      break;
    case 'ArrayExpression':
      node.elements.forEach(e => staticStrings(e, out));
      break;
    case 'ObjectExpression':
      // clsx({'ml-2': cond})
      for (const p of node.properties) {
        if (p.type === 'Property' && p.key.type === 'Literal' && typeof p.key.value === 'string') out.push({node: p.key, value: p.key.value});
      }
      break;
    case 'CallExpression':
      if (node.callee.type === 'Identifier' && CLASS_FUNCTIONS.has(node.callee.name)) node.arguments.forEach(a => staticStrings(a, out));
      break;
    case 'JSXExpressionContainer':
      staticStrings(node.expression, out);
      break;
  }
  return out;
}

const keyName = key => (key.type === 'Identifier' ? key.name : key.type === 'Literal' ? String(key.value) : null);

const logicalDirection = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow left/right styling; use logical start/end so layouts mirror in right-to-left languages.',
    },
    schema: [],
    messages: {
      physicalClass: '"{{className}}" stays on the same physical side in right-to-left layouts (Arabic, Hebrew). Use "{{replacement}}".',
      physicalStyle: '`{{property}}` stays on the same physical side in right-to-left layouts (Arabic, Hebrew). Use `{{replacement}}`.',
    },
  },
  create(context) {
    const reportClasses = strings => {
      for (const {node, value} of strings) {
        for (const hit of checkClassString(value)) context.report({node, messageId: 'physicalClass', data: hit});
      }
    };
    return {
      JSXAttribute(node) {
        const name = node.name.type === 'JSXIdentifier' ? node.name.name : null;
        if (CLASS_ATTRIBUTES.has(name)) {
          reportClasses(staticStrings(node.value));
        } else if (name === 'style' && node.value?.type === 'JSXExpressionContainer' && node.value.expression.type === 'ObjectExpression') {
          for (const p of node.value.expression.properties) {
            if (p.type !== 'Property') continue;
            const property = keyName(p.key);
            if (!property) continue;
            const value = p.value.type === 'Literal' ? p.value.value : undefined;
            const hit = checkStyleProperty(property, value);
            if (hit) context.report({node: p, messageId: 'physicalStyle', data: hit});
          }
        }
      },
      CallExpression(node) {
        // Class lists built outside JSX: const styles = cn('ml-2', …)
        if (node.callee.type === 'Identifier' && CLASS_FUNCTIONS.has(node.callee.name)) {
          const inJsxClass = context.sourceCode.getAncestors(node).some(a => a.type === 'JSXAttribute' && CLASS_ATTRIBUTES.has(a.name?.name));
          if (!inJsxClass) reportClasses(node.arguments.flatMap(a => staticStrings(a)));
        }
      },
    };
  },
};

const plugin = {
  meta: {name: '@solo/eslint-plugin', version: '0.1.0'},
  rules: {'logical-direction': logicalDirection},
  configs: {},
};
plugin.configs.recommended = {
  plugins: {solo: plugin},
  rules: {'solo/logical-direction': 'error'},
};

export default plugin;
