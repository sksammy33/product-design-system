import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSnapshot, normalize, validateTokens, outputs, declarations, extension, tree } from './build.mjs';

const source = loadSnapshot();
const mutate = fn => { const s = structuredClone(source); fn(s); return s; };
const byName = (s, name, collection) => s.variables.find(v => v.name === name && (!collection || s.collections.find(c => c.id === v.variableCollectionId).name === collection));
const firstMode = v => Object.keys(v.valuesByMode)[0];
const set = (v, value) => { v.valuesByMode[firstMode(v)] = value; };

test('complete current inventory, exact paths, no lost styles, both modes', () => {
  const { themes, paths } = normalize(source);
  assert.equal(paths.size, 317);
  for (const theme of ['Light', 'Dark']) {
    assert.equal(Object.keys(themes[theme]).length, 347);
    assert.equal(themes[theme]['border.default'].$type, 'dimension');
    assert.equal(themes[theme]['color.semantic.border.default'].$type, 'color');
    assert.equal(themes[theme]['spacing.inline.sm'].$value, '{spacing.space.8}');
    assert.equal(themes[theme]['typography.weight.regular'].$value, 400);
    assert.deepEqual(themes[theme]['motion.fast'].$value, { value: 100, unit: 'ms' });
    assert.deepEqual(themes[theme]['spacing.component.input.padding.small.vertical'].$value, { value: 6, unit: 'px' });
  }
});
test('every source variable matches its normalized literal or alias in each mode', () => {
  const { themes, paths } = normalize(source);
  for (const [theme, tokens] of Object.entries(themes)) for (const v of source.variables) {
    const c = source.collections.find(c => c.id === v.variableCollectionId);
    const mode = c.modes.find(m => m.name === theme) ?? c.modes.find(m => m.name === 'Default');
    const raw = v.valuesByMode[mode.modeId], token = tokens[paths.get(v.id)];
    assert.equal(token.$extensions[extension].id, v.id);
    if (raw?.type === 'VARIABLE_ALIAS') assert.equal(token.$value, '{' + paths.get(raw.id) + '}');
    else if (v.resolvedType === 'COLOR') {
      assert.deepEqual(token.$value.components, [raw.r, raw.g, raw.b]);
      assert.equal(token.$value.alpha, raw.a);
    } else if (c.name === 'Opacity') assert.equal(token.$value, raw / 100);
    else assert.equal(typeof token.$value === 'object' ? token.$value.value : token.$value, raw);
  }
});
test('mode IDs may change while Light/Dark mapping stays identical', () => {
  const changed = mutate(s => {
    for (const c of s.collections) {
      const renamed = Object.fromEntries(c.modes.map(m => [m.modeId, 'new-' + m.modeId]));
      for (const v of s.variables.filter(v => v.variableCollectionId === c.id))
        v.valuesByMode = Object.fromEntries(Object.entries(v.valuesByMode).map(([id, val]) => [renamed[id], val]));
      c.defaultModeId = renamed[c.defaultModeId];
      for (const m of c.modes) m.modeId = renamed[m.modeId];
      c.modes.reverse();
    }
  });
  const original = normalize(source), result = normalize(changed);
  for (const theme of ['Light', 'Dark']) assert.deepEqual(declarations(result.themes[theme]), declarations(original.themes[theme]));
});
test('typography source units and weights survive exact conversion', () => {
  const { themes } = normalize(source);
  for (const s of source.textStyles) {
    const t = Object.values(themes.Light).find(t => t.$extensions[extension].id === s.id);
    assert.equal(t.$value.fontFamily, 'Geist');
    assert.equal(t.$value.fontWeight, s.fontName.variationSettings.wght);
    assert.equal(t.$value.fontSize.value, s.fontSize);
    assert.ok(Math.abs(t.$value.lineHeight * s.fontSize - s.lineHeight.value) < 1e-12);
    assert.equal(t.$value.letterSpacing.value, s.letterSpacing.value);
  }
});
test('CSS preserves alias references and maps effect kinds correctly', () => {
  const { themes } = normalize(source);
  const css = declarations(themes.Light);
  assert.equal(css['--spacing-inline-sm'], 'var(--spacing-space-8)');
  assert.equal(css['--effects-blur-md-backdrop-filter'], 'blur(8px)');
  assert.equal(css['--effects-blur-none-backdrop-filter'], 'none');
  assert.equal(css['--effects-blur-md-filter'], undefined);
  assert.match(css['--effects-shadow-inner'], /^inset /);
  assert.equal(css['--typography-weight-regular'], '400');
  assert.equal(css['--motion-fast'], '100ms');
});
test('standalone Light/Dark CSS includes foundations and both color collections', () => {
  const result = outputs(source);
  for (const name of ['light', 'dark']) {
    assert.match(result['dist/' + name + '.css'], /--color-chart-series-01: var\(/);
    assert.match(result['dist/' + name + '.css'], /--color-semantic-text-primary: var\(/);
    assert.match(result['dist/' + name + '.css'], /--spacing-space-8: 8px/);
  }
});
test('current Text Danger alias improves Light contrast and preserves Dark source mapping', () => {
  const variable = byName(source, 'Text / Danger', 'Color / Semantic');
  assert.equal(variable.id, 'VariableID:18:48');
  assert.deepEqual(variable.valuesByMode['18:1'], { type: 'VARIABLE_ALIAS', id: 'VariableID:44:49' });
  assert.deepEqual(variable.valuesByMode['18:2'], { type: 'VARIABLE_ALIAS', id: 'VariableID:18:31' });
  const { themes } = normalize(source);
  assert.equal(themes.Light['color.semantic.text.danger'].$value, '{color.primitives.red.700}');
  assert.equal(themes.Dark['color.semantic.text.danger'].$value, '{color.primitives.red.300}');
  for (const [mode, target] of [['Light', 'red.700'], ['Dark', 'red.300']]) {
    assert.equal(declarations(themes[mode])['--color-semantic-text-danger'],
      'var(--color-primitives-' + target.replaceAll('.', '-') + ')');
  }
});
const failures = [
  ['missing variable', s => s.variables.pop(), /count mismatch/],
  ['duplicate source ID', s => { s.variables[1].id = s.variables[0].id; }, /Duplicate variable ID/],
  ['collection membership', s => { s.collections[0].variableIds[0] = 'missing'; }, /Missing\/misassigned/],
  ['missing mode', s => { s.collections.find(c => c.name === 'Color / Chart').modes.pop(); }, /Missing or unexpected modes/],
  ['missing value for mode', s => { const v = byName(s, 'Text / Primary'); delete v.valuesByMode[firstMode(v)]; }, /Missing\/extra modes/],
  ['broken alias', s => set(byName(s, 'Spacing / Inline / SM'), { type: 'VARIABLE_ALIAS', id: 'missing' }), /Broken alias/],
  ['type mismatch', s => { byName(s, 'Border / Default', 'Border').resolvedType = 'COLOR'; }, /Type mismatch/],
  ['alias type mismatch', s => set(byName(s, 'Spacing / Inline / SM'), { type: 'VARIABLE_ALIAS', id: byName(s, 'Text / Primary').id }), /Alias type mismatch/],
  ['alias cycle', s => { const a = byName(s, 'Spacing / Inline / SM'), b = byName(s, 'Spacing / Inline / MD'); set(a, { type: 'VARIABLE_ALIAS', id: b.id }); set(b, { type: 'VARIABLE_ALIAS', id: a.id }); }, /Alias cycle/],
  ['duplicate normalized name', s => { const a = byName(s, 'Spacing / Inline / SM'); a.name = 'spacing/inline/MD'; }, /Duplicate normalized name/],
  ['CSS collision', s => { byName(s, 'Spacing / Inline / SM').name = 'Spacing / Inline-MD'; }, /CSS naming collision/],
  ['invalid value', s => set(byName(s, 'Space / 8'), '8'), /Invalid numeric/],
  ['negative spacing', s => set(byName(s, 'Space / 8'), -8), /Invalid negative/],
  ['negative Button padding', s => set(byName(s, 'Component / Button / Small / Padding Y'), -6), /Invalid negative/],
  ['unreviewed Button Group overlap', s => set(byName(s, 'Component / Button Group / Segment Overlap'), -2), /Changed Button Group overlap/],
  ['unconfirmed duration unit', s => { byName(s, 'Motion / Fast').description = ''; }, /Unconfirmed motion unit/],
  ['invalid color', s => { set(s.variables.find(v => v.resolvedType === 'COLOR'), { r: 2, g: 0, b: 0, a: 1 }); }, /Invalid color/],
  ['unsupported effect', s => { s.effectStyles[0].effects[0].type = 'NOISE'; }, /Unsupported shadow/],
  ['unknown typography unit', s => { s.textStyles[0].letterSpacing.unit = 'PERCENT'; }, /New typography units/],
];
for (const [label, change, message] of failures) test('rejects ' + label, () => assert.throws(() => normalize(mutate(change)), message));
test('rejects token/group naming collisions', () => assert.throws(() => tree({
  a: { $type: 'dimension', $value: { value: 1, unit: 'px' } },
  'a.b': { $type: 'dimension', $value: { value: 1, unit: 'px' } },
}), /collision/));
test('rejects missing normalized values and malformed alias values', () => {
  assert.throws(() => validateTokens({ x: { $type: 'color' } }), /Missing value/);
  assert.throws(() => validateTokens({ x: { $type: 'color', $value: '{missing}' } }), /Broken alias/);
});
test('outputs are deterministic', () => assert.deepEqual(outputs(source), outputs(structuredClone(source))));
test('package exports load generated ESM data', async () => {
  const { tokens, cssVariables } = await import('@product-design-system/tokens');
  assert.equal(Object.keys(tokens.Light).length, 347);
  assert.equal(Object.keys(tokens.Dark).length, 347);
  assert.equal(Object.keys(cssVariables.Dark).length, 416);
});
test('approved Button spacing retains source identity and signed overlap in both CSS themes', () => {
  const expected = [
    ['spacing.component.button.small.padding-y', 'VariableID:344:2171', 6],
    ['spacing.component.button.small.icon-gap', 'VariableID:344:2172', 6],
    ['spacing.component.button.split.medium.dropdown-padding-x', 'VariableID:344:10439', 10],
    ['spacing.component.button.split.large.dropdown-padding-x', 'VariableID:344:10440', 14],
    ['spacing.component.button-group.segment-overlap', 'VariableID:344:10441', -1],
  ];
  const { themes } = normalize(source);
  for (const tokens of Object.values(themes)) {
    const css = declarations(tokens);
    for (const [path, id, value] of expected) {
      assert.equal(tokens[path].$extensions[extension].id, id);
      assert.equal(tokens[path].$type, 'dimension');
      assert.deepEqual(tokens[path].$value, { value, unit: 'px' });
      assert.equal(css['--' + path.replaceAll('.', '-')], value + 'px');
    }
  }
});

test('finalized Button dimensions and specialized aliases survive both theme outputs', () => {
  const expected = [
  [
    "spacing.component.button.xs.height",
    "VariableID:351:1508",
    {
      "value": 28,
      "unit": "px"
    }
  ],
  [
    "spacing.component.button.xs.icon-size",
    "VariableID:351:1509",
    {
      "value": 14,
      "unit": "px"
    }
  ],
  [
    "spacing.component.button.small.height",
    "VariableID:351:1510",
    {
      "value": 32,
      "unit": "px"
    }
  ],
  [
    "spacing.component.button.small.icon-size",
    "VariableID:351:1511",
    {
      "value": 16,
      "unit": "px"
    }
  ],
  [
    "spacing.component.button.medium.height",
    "VariableID:351:1512",
    {
      "value": 40,
      "unit": "px"
    }
  ],
  [
    "spacing.component.button.medium.icon-size",
    "VariableID:351:1513",
    {
      "value": 18,
      "unit": "px"
    }
  ],
  [
    "spacing.component.button.large.height",
    "VariableID:351:1514",
    {
      "value": 48,
      "unit": "px"
    }
  ],
  [
    "spacing.component.button.large.icon-size",
    "VariableID:351:1515",
    {
      "value": 20,
      "unit": "px"
    }
  ],
  [
    "spacing.component.button.xl.height",
    "VariableID:351:1516",
    {
      "value": 56,
      "unit": "px"
    }
  ],
  [
    "spacing.component.button.xl.icon-size",
    "VariableID:351:1517",
    {
      "value": 24,
      "unit": "px"
    }
  ],
  [
    "spacing.component.button.fab.small.height",
    "VariableID:351:1518",
    "{spacing.component.button.medium.height}"
  ],
  [
    "spacing.component.button.fab.medium.height",
    "VariableID:351:1519",
    "{spacing.component.button.large.height}"
  ],
  [
    "spacing.component.button.fab.large.height",
    "VariableID:351:1520",
    "{spacing.component.button.xl.height}"
  ],
  [
    "spacing.component.button.fab.small.icon-size",
    "VariableID:351:1521",
    "{spacing.component.button.medium.icon-size}"
  ],
  [
    "spacing.component.button.fab.medium.icon-size",
    "VariableID:351:1522",
    "{spacing.component.button.large.icon-size}"
  ],
  [
    "spacing.component.button.fab.large.icon-size",
    "VariableID:351:1523",
    "{spacing.component.button.xl.icon-size}"
  ],
  [
    "spacing.component.button.social.small.provider-icon-size",
    "VariableID:351:1524",
    "{spacing.component.button.small.icon-size}"
  ],
  [
    "spacing.component.button.social.medium.provider-icon-size",
    "VariableID:351:1525",
    "{spacing.component.button.large.icon-size}"
  ],
  [
    "spacing.component.button.social.large.provider-icon-size",
    "VariableID:351:1526",
    "{spacing.component.button.xl.icon-size}"
  ]
];
  const { themes } = normalize(source);
  for (const tokens of Object.values(themes)) {
    const css = declarations(tokens);
    const resolved = validateTokens(tokens);
    for (const [path, id, value] of expected) {
      assert.equal(tokens[path].$extensions[extension].id, id);
      assert.equal(tokens[path].$type, 'dimension');
      assert.deepEqual(tokens[path].$value, value);
      const name = '--' + path.replaceAll('.', '-');
      if (typeof value === 'string') {
        const target = value.slice(1, -1);
        assert.equal(css[name], 'var(--' + target.replaceAll('.', '-') + ')');
        assert.deepEqual(resolved[path], resolved[target]);
      } else assert.equal(css[name], value.value + 'px');
    }
  }
});

test('opacity preserves authored percentage metadata and emits unitless CSS in both themes', () => {
  const v = byName(source, 'Disabled', 'Opacity');
  assert.equal(v.id, 'VariableID:361:1691');
  assert.equal(v.valuesByMode[firstMode(v)], 50);
  const { themes } = normalize(source);
  for (const tokens of Object.values(themes)) {
    const t = tokens['opacity.disabled'];
    assert.equal(t.$type, 'number');
    assert.equal(t.$value, 0.5);
    assert.equal(t.$extensions[extension].originalValue, 50);
    assert.equal(t.$extensions[extension].sourceType, 'FLOAT');
    assert.equal(t.$extensions[extension].sourceUnit, 'percent');
    assert.equal(t.$extensions[extension].normalizedUnit, 'unitless');
    assert.deepEqual(t.$extensions[extension].scopes, ['OPACITY']);
    assert.equal(declarations(tokens)['--opacity-disabled'], '0.5');
  }
  assert.match(outputs(source)['dist/index.d.ts'], /\$type: "number"; \$value: number \| Alias/);
});
test('opacity percentage conversion supports boundaries without guessing value scale', () => {
  for (const [raw, normalized] of [[0, 0], [0.5, 0.005], [50, 0.5], [100, 1]]) {
    const { themes } = normalize(mutate(s => set(byName(s, 'Disabled', 'Opacity'), raw)));
    assert.equal(themes.Light['opacity.disabled'].$value, normalized);
  }
});
test('opacity rejects invalid source scope, type, units and ranges', () => {
  for (const raw of [-1, 101, NaN, Infinity, '50', '50%', { value: 50, unit: '%' }]) {
    assert.throws(() => normalize(mutate(s => set(byName(s, 'Disabled', 'Opacity'), raw))), /Invalid/);
  }
  assert.throws(() => normalize(mutate(s => { byName(s, 'Disabled', 'Opacity').scopes = ['ALL_SCOPES']; })), /opacity scope/);
  assert.throws(() => normalize(mutate(s => { byName(s, 'Disabled', 'Opacity').resolvedType = 'STRING'; })), /Type mismatch/);
  assert.throws(() => normalize(mutate(s => set(byName(s, 'Disabled', 'Opacity'), { type: 'VARIABLE_ALIAS', id: byName(s, 'Space / 8').id }))), /Alias type mismatch/);
});
test('normalized opacity rejects dimensions, percentages, nonfinite values and out-of-range aliases', () => {
  for (const value of [-0.1, 1.1, 50, NaN, Infinity, '0.5', { value: 0.5, unit: 'px' }]) {
    assert.throws(() => validateTokens({ 'opacity.disabled': { $type: 'number', $value: value } }), /Invalid/);
  }
  assert.throws(() => validateTokens({ 'opacity.disabled': { $type: 'dimension', $value: { value: 0.5, unit: 'px' } } }), /unitless number/);
  const tokens = { base: { $type: 'number', $value: 0.5 }, 'opacity.disabled': { $type: 'number', $value: '{base}' } };
  assert.equal(validateTokens(tokens)['opacity.disabled'], 0.5);
  assert.equal(declarations(tokens)['--opacity-disabled'], 'var(--base)');
  tokens.base.$value = 50;
  assert.throws(() => validateTokens(tokens), /opacity range/);
});
