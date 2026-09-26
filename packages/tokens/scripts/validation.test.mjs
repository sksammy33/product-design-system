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
  assert.equal(paths.size, 297);
  for (const theme of ['Light', 'Dark']) {
    assert.equal(Object.keys(themes[theme]).length, 327);
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
    } else assert.equal(typeof token.$value === 'object' ? token.$value.value : token.$value, raw);
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
  assert.equal(Object.keys(tokens.Light).length, 327);
  assert.equal(Object.keys(tokens.Dark).length, 327);
  assert.equal(Object.keys(cssVariables.Dark).length, 396);
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
