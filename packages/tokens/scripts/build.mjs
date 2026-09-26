import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const notice = 'GENERATED from the raw Figma snapshot. DO NOT EDIT. Run npm run build in packages/tokens.';
export const extension = 'org.product-design-system.figma';
const collectionConfig = {
  'Color / Primitives': ['color.primitives', 'primitives', 60, ['Default']],
  'Color / Semantic': ['color.semantic', 'semantic', 109, ['Light', 'Dark']],
  'Color / Chart': ['color.chart', 'charts', 8, ['Light', 'Dark']],
  Typography: ['typography', 'typography', 52, ['Default']],
  Spacing: ['spacing', 'spacing', 69, ['Default']],
  Radius: ['radius', 'radius', 9, ['Default']],
  Border: ['border', 'border', 4, ['Default']],
  Motion: ['motion', 'motion', 5, ['Default']],
  Opacity: ['opacity', 'opacity', 1, ['Default']],
};
export function assert(ok, message) { if (!ok) throw new Error(message); }
export const json = value => JSON.stringify(value, null, 2) + '\n';
export const sha = value => createHash('sha256').update(value).digest('hex');
const finite = v => typeof v === 'number' && Number.isFinite(v);
const alias = v => v && typeof v === 'object' && v.type === 'VARIABLE_ALIAS';
const ref = v => typeof v === 'string' && /^\{[^{}]+\}$/.test(v);
const px = value => ({ value, unit: 'px' });
const color = c => ({ colorSpace: 'srgb', components: [c.r, c.g, c.b], alpha: c.a });
const sortEntries = o => Object.entries(o).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0);

export function segment(s) {
  const n = s.trim().toLowerCase().replace(/\s+/g, '-');
  assert(/^[a-z0-9][a-z0-9-]*$/.test(n), 'Unsupported source name segment: ' + s);
  return n;
}
export function variablePath(v, c) {
  const prefix = collectionConfig[c.name]?.[0];
  assert(prefix, 'Unknown collection: ' + c.name);
  const parts = v.name.split('/').map(segment);
  // Remove only a redundant collection prefix. "Space" remains distinct from "Spacing".
  if (!c.name.startsWith('Color / ') && parts[0] === prefix) parts.shift();
  return prefix + '.' + parts.join('.');
}
export const cssName = path => '--' + path.replaceAll('.', '-');

function unique(items, key, label) {
  const result = new Map();
  for (const item of items) {
    const id = key(item);
    assert(!result.has(id), 'Duplicate ' + label + ': ' + id);
    result.set(id, item);
  }
  return result;
}
export function loadSnapshot() {
  const manifest = JSON.parse(readFileSync(resolve(root, 'figma/manifest.json'), 'utf8'));
  const parts = {};
  for (const [name, hash] of Object.entries(manifest.sha256)) {
    const bytes = readFileSync(resolve(root, 'figma', name));
    assert(sha(bytes) === hash, 'Raw snapshot hash mismatch: ' + name);
    parts[name] = JSON.parse(bytes);
  }
  const chunks = Object.entries(parts).filter(([name]) => name.startsWith('variables-')).sort();
  let count = 0;
  const variables = [];
  for (const [name, part] of chunks) {
    assert(part.total === manifest.variableCount && part.offset === count, 'Source count/offset mismatch: ' + name);
    variables.push(...part.variables);
    count += part.variables.length;
  }
  assert(count === manifest.variableCount, 'Source count mismatch');
  return { ...parts['collections.json'], ...parts['styles.json'], variables, manifest };
}
function variableType(v, c) {
  if (c.name.startsWith('Color / ')) {
    assert(v.resolvedType === 'COLOR', 'Type mismatch: ' + v.name);
    return 'color';
  }
  assert(v.resolvedType === 'FLOAT', 'Type mismatch: ' + v.name);
  if (c.name === 'Opacity') {
    assert(v.scopes?.length === 1 && v.scopes[0] === 'OPACITY', 'Unconfirmed opacity scope: ' + v.name);
    return 'number';
  }
  if (c.name === 'Typography') {
    assert(/^Typography\s*\/\s*(Size|Line Height|Tracking|Weight)\s*\//.test(v.name), 'Unknown typography quantity: ' + v.name);
    return /\/\s*Weight\s*\//.test(v.name) ? 'fontWeight' : 'dimension';
  }
  return c.name === 'Motion' ? 'duration' : 'dimension';
}
function literal(v, type, source) {
  if (type === 'number') {
    assert(finite(v) && v >= 0 && v <= 100, 'Invalid authored opacity percentage: ' + source.name);
    return v / 100;
  }
  if (type === 'color') return color(v);
  if (type === 'duration') {
    assert(source.description.trim() === v + 'ms', 'Unconfirmed motion unit: ' + source.name);
    return { value: v, unit: 'ms' };
  }
  return type === 'dimension' ? px(v) : v;
}
function documentMeta(description) { return { $description: description }; }
export function tree(flat, description = notice) {
  const result = documentMeta(description);
  for (const [path, token] of sortEntries(flat)) {
    const keys = path.split('.');
    let node = result;
    for (const key of keys.slice(0, -1)) {
      assert(!node[key]?.$type, 'Token/group naming collision: ' + path);
      node = node[key] ??= {};
    }
    const key = keys.at(-1);
    assert(!(key in node), 'Duplicate normalized name: ' + path);
    node[key] = token;
  }
  return result;
}
function sourceMeta(v, c, mode) {
  return { fileKey: 'A5R8vBTXZzfV5aj3omQYFG', id: v.id, key: v.key, name: v.name,
    collection: c?.name, collectionId: c?.id, mode: mode?.name, modeId: mode?.modeId,
    sourceType: v.resolvedType ?? 'STYLE' };
}

export function normalize(snapshot) {
  const collections = unique(snapshot.collections, c => c.id, 'collection ID');
  unique(snapshot.collections, c => c.name, 'collection name');
  const variables = unique(snapshot.variables, v => v.id, 'variable ID');
  const styles = [...snapshot.textStyles, ...snapshot.effectStyles];
  unique(styles, s => s.id, 'style ID');
  assert(snapshot.collections.length === 9, 'Source collection count mismatch');
  assert(snapshot.variables.length === 317, 'Source variable count mismatch; review changed Figma inventory');
  assert(snapshot.textStyles.length === 16 && snapshot.effectStyles.length === 14, 'Source style count mismatch');
  const paths = new Map(), names = new Map(), cssNames = new Set();
  const types = new Map();
  for (const c of collections.values()) {
    const cfg = collectionConfig[c.name];
    assert(cfg, 'Unknown collection: ' + c.name);
    assert(c.variableIds.length === cfg[2], 'Source count mismatch in ' + c.name);
    unique(c.variableIds, id => id, 'collection variable ID');
    unique(c.modes, m => m.modeId, 'mode ID');
    unique(c.modes, m => m.name, 'mode name');
    assert(c.modes.length === cfg[3].length && cfg[3].every(name => c.modes.some(m => m.name === name)), 'Missing or unexpected modes in ' + c.name);
    assert(c.modes.some(m => m.modeId === c.defaultModeId), 'Missing default mode in ' + c.name);
    for (const id of c.variableIds) assert(variables.get(id)?.variableCollectionId === c.id, 'Missing/misassigned source variable: ' + id);
  }
  for (const v of variables.values()) {
    const c = collections.get(v.variableCollectionId);
    assert(c?.variableIds.includes(v.id), 'Unknown source collection membership: ' + v.id);
    const p = variablePath(v, c);
    assert(!names.has(p), 'Duplicate normalized name: ' + p);
    assert(!cssNames.has(cssName(p)), 'CSS naming collision: ' + p);
    names.set(p, v.id); cssNames.add(cssName(p)); paths.set(v.id, p); types.set(v.id, variableType(v, c));
    assert(Object.keys(v.valuesByMode).length === c.modes.length, 'Missing/extra modes: ' + p);
    for (const mode of c.modes) assert(Object.hasOwn(v.valuesByMode, mode.modeId), 'Missing mode: ' + p + ' ' + mode.name);
  }
  const themes = { Light: {}, Dark: {} };
  const files = {};
  const register = (p, token, category, theme) => {
    assert(!Object.hasOwn(themes[theme], p), 'Duplicate normalized name: ' + p);
    themes[theme][p] = token;
    const file = 'src/' + category + '/' + (['semantic', 'charts'].includes(category) ? theme.toLowerCase() : 'tokens') + '.tokens.json';
    (files[file] ??= {})[p] = token;
  };
  for (const theme of Object.keys(themes)) {
    for (const v of variables.values()) {
      const c = collections.get(v.variableCollectionId);
      const mode = c.modes.find(m => m.name === theme) ?? c.modes.find(m => m.name === 'Default');
      assert(mode, 'Missing mode ' + theme + ': ' + c.name);
      const value = v.valuesByMode[mode.modeId], type = types.get(v.id);
      let normalized;
      if (alias(value)) {
        assert(variables.has(value.id), 'Broken alias: ' + v.id + ' -> ' + value.id);
        assert(types.get(value.id) === type, 'Alias type mismatch: ' + v.id);
        normalized = '{' + paths.get(value.id) + '}';
      } else {
        if (v.resolvedType === 'FLOAT') {
          assert(finite(value), 'Invalid numeric source value: ' + v.name);
          // The approved Button Group overlap is a signed spacing dimension.
          // Keep negative padding/global spacing rejected; do not widen this to all spacing.
          const signedOverlap = v.id === 'VariableID:344:10441' && paths.get(v.id) === 'spacing.component.button-group.segment-overlap';
          if (signedOverlap) assert(value === -1, 'Changed Button Group overlap; review current Figma source');
          else if (c.name !== 'Typography' || !v.name.includes('Tracking')) assert(value >= 0, 'Invalid negative source value: ' + v.name);
        }
        normalized = literal(value, type, v);
      }
      const token = { $type: type, $value: normalized, $extensions: { [extension]: sourceMeta(v, c, mode) } };
      if (c.name === 'Opacity') Object.assign(token.$extensions[extension], {
        scopes: v.scopes, originalValue: value, sourceUnit: 'percent', normalizedUnit: 'unitless',
      });
      if (v.description) token.$description = v.description;
      const category = collectionConfig[c.name][1];
      register(paths.get(v.id), token, category, theme);
    }
    for (const s of snapshot.textStyles) {
      assert(s.name.split('/')[0].trim() === 'Typography', 'Unexpected text-style namespace: ' + s.name);
      assert(Object.keys(s.boundVariables ?? {}).length === 0, 'New text-style bindings need explicit mapping: ' + s.name);
      assert(s.fontName.family === 'Geist', 'Unexpected font family: ' + s.name);
      const weight = s.fontName.variationSettings?.wght;
      assert(finite(weight), 'Missing explicit source font weight: ' + s.name);
      assert(s.lineHeight.unit === 'PIXELS' && s.letterSpacing.unit === 'PIXELS', 'New typography units need explicit mapping: ' + s.name);
      assert(s.paragraphSpacing === 0 && s.paragraphIndent === 0 && s.textCase === 'ORIGINAL' && s.textDecoration === 'NONE', 'Unsupported text-style property: ' + s.name);
      const path = 'typography.styles.' + s.name.split('/').map(segment).slice(1).join('.');
      const token = { $type: 'typography', $value: {
        fontFamily: s.fontName.family, fontWeight: weight, fontSize: px(s.fontSize),
        lineHeight: s.lineHeight.value / s.fontSize, letterSpacing: px(s.letterSpacing.value),
      }, $extensions: { [extension]: { ...sourceMeta(s), lineHeight: s.lineHeight, letterSpacing: s.letterSpacing } } };
      register(path, token, 'typography', theme);
    }
    for (const s of snapshot.effectStyles) {
      const path = 'effects.' + s.name.split('/').map(segment).join('.');
      const meta = { ...sourceMeta(s), effects: s.effects };
      let type, value;
      if (s.name.split('/')[0].trim() === 'Shadow') {
        assert(s.effects.length > 0, 'Empty shadow style: ' + s.name);
        type = 'shadow';
        value = s.effects.map(e => {
          assert(['DROP_SHADOW', 'INNER_SHADOW'].includes(e.type) && e.visible && e.blendMode === 'NORMAL', 'Unsupported shadow effect: ' + s.name);
          assert(Object.keys(e.boundVariables ?? {}).length === 0, 'New effect binding needs mapping: ' + s.name);
          return { color: color(e.color), offsetX: px(e.offset.x), offsetY: px(e.offset.y),
            blur: px(e.radius), spread: px(e.spread), inset: e.type === 'INNER_SHADOW' };
        });
        meta.cssProperty = 'box-shadow';
      } else {
        assert(s.name.split('/')[0].trim() === 'Blur', 'Unknown effect style: ' + s.name);
        assert(s.effects.length <= 1, 'Multiple blur effects need explicit mapping: ' + s.name);
        const e = s.effects[0];
        assert(!e || (e.visible && ['BACKGROUND_BLUR', 'LAYER_BLUR'].includes(e.type) && e.blurType === 'NORMAL'), 'Unsupported blur effect: ' + s.name);
        assert(!e || Object.keys(e.boundVariables ?? {}).length === 0, 'New blur binding needs mapping: ' + s.name);
        assert(e || s.name.trim() === 'Blur / None', 'Unclassified empty blur style');
        // Zero is the exact no-effect radius, not a newly designed blur.
        type = 'dimension'; value = px(e ? e.radius : 0);
        meta.cssProperty = e?.type === 'LAYER_BLUR' ? 'filter' : 'backdrop-filter';
        meta.noEffect = !e;
      }
      register(path, { $type: type, $value: value, $description: s.description, $extensions: { [extension]: meta } }, 'effects', theme);
    }
    validateTokens(themes[theme]);
    tree(themes[theme]); // Detect leaf/group collisions before writing anything.
  }
  for (const [name, tokens] of Object.entries(files)) files[name] = tree(tokens);
  return { themes, files, paths };
}

export function validateTokens(tokens) {
  const css = new Set();
  for (const path of Object.keys(tokens)) {
    const name = cssName(path);
    assert(!css.has(name), 'CSS naming collision: ' + path);
    css.add(name);
  }
  const done = new Map();
  function resolveToken(path, stack = []) {
    assert(Object.hasOwn(tokens, path), 'Missing alias target: ' + path);
    assert(!stack.includes(path), 'Alias cycle: ' + [...stack, path].join(' -> '));
    if (done.has(path)) return done.get(path);
    const t = tokens[path];
    assert(t && Object.hasOwn(t, '$value'), 'Missing value: ' + path);
    if (path.startsWith('opacity.')) assert(t.$type === 'number', 'Opacity must use unitless number type: ' + path);
    let value = t.$value;
    if (ref(value)) {
      const target = value.slice(1, -1);
      assert(tokens[target], 'Broken alias: ' + path + ' -> ' + target);
      assert(tokens[target].$type === t.$type, 'Alias type mismatch: ' + path);
      value = resolveToken(target, [...stack, path]);
    }
    validValue(t.$type, value, path);
    if (path.startsWith('opacity.')) assert(value >= 0 && value <= 1, 'Invalid normalized opacity range: ' + path);
    done.set(path, value);
    return value;
  }
  for (const path of Object.keys(tokens)) resolveToken(path);
  return Object.fromEntries(done);
}
function validValue(type, v, path) {
  const fail = () => { throw new Error('Invalid ' + type + ' value: ' + path); };
  if (type === 'color') {
    if (!(v?.colorSpace === 'srgb' && v.components?.length === 3 && [...v.components, v.alpha].every(n => finite(n) && n >= 0 && n <= 1))) fail();
  } else if (type === 'dimension' || type === 'duration') {
    if (!(finite(v?.value) && (type === 'dimension' ? ['px', 'rem'] : ['ms', 's']).includes(v.unit))) fail();
    if (type === 'duration' && v.value < 0) fail();
  } else if (type === 'number') {
    if (!finite(v)) fail();
  } else if (type === 'fontWeight') {
    if (!(finite(v) && v >= 1 && v <= 1000)) fail();
  } else if (type === 'typography') {
    if (!(typeof v?.fontFamily === 'string' && v.fontFamily.length && finite(v.lineHeight) && v.lineHeight > 0)) fail();
    validValue('fontWeight', v.fontWeight, path);
    validValue('dimension', v.fontSize, path);
    validValue('dimension', v.letterSpacing, path);
    if (v.fontSize.value <= 0) fail();
  } else if (type === 'shadow') {
    if (!Array.isArray(v) || !v.length) fail();
    for (const s of v) {
      validValue('color', s.color, path);
      for (const k of ['offsetX', 'offsetY', 'blur', 'spread']) validValue('dimension', s[k], path);
      if (s.blur.value < 0 || typeof s.inset !== 'boolean') fail();
    }
  } else fail();
}
function cssValue(type, value) {
  if (ref(value)) return 'var(' + cssName(value.slice(1, -1)) + ')';
  if (type === 'color') return 'color(srgb ' + value.components.join(' ') + ' / ' + value.alpha + ')';
  if (type === 'dimension' || type === 'duration') return value.value + value.unit;
  if (type === 'fontWeight' || type === 'number') return String(value);
  if (type === 'shadow') return value.map(s =>
    (s.inset ? 'inset ' : '') + [s.offsetX, s.offsetY, s.blur, s.spread].map(d => cssValue('dimension', d)).join(' ') + ' ' + cssValue('color', s.color)).join(', ');
  throw new Error('Unsupported CSS type: ' + type);
}
export function declarations(tokens) {
  const output = new Map();
  function add(name, value) {
    assert(!output.has(name), 'CSS naming collision: ' + name);
    output.set(name, value);
  }
  for (const [path, t] of sortEntries(tokens)) {
    const name = cssName(path);
    if (t.$type === 'typography') {
      const v = t.$value;
      add(name + '-font-family', JSON.stringify(v.fontFamily));
      add(name + '-font-size', cssValue('dimension', v.fontSize));
      add(name + '-font-weight', String(v.fontWeight));
      add(name + '-line-height', String(v.lineHeight));
      add(name + '-letter-spacing', cssValue('dimension', v.letterSpacing));
    } else {
      add(name, cssValue(t.$type, t.$value));
      const meta = t.$extensions?.[extension];
      if (meta?.cssProperty === 'backdrop-filter' || meta?.cssProperty === 'filter') {
        add(name + '-' + meta.cssProperty, meta.noEffect ? 'none' : 'blur(' + cssValue('dimension', t.$value) + ')');
      }
    }
  }
  return Object.fromEntries(output);
}
function cssBlock(selector, values) {
  return selector + ' {\n' + Object.entries(values).map(([k, v]) => '  ' + k + ': ' + v + ';').join('\n') + '\n}\n';
}
export function outputs(snapshot) {
  const { themes, files, paths } = normalize(snapshot);
  const output = Object.fromEntries(Object.entries(files).map(([p, data]) => [p, json(data)]));
  const categories = ['primitives/tokens', 'typography/tokens', 'spacing/tokens', 'radius/tokens', 'border/tokens', 'effects/tokens', 'motion/tokens', 'opacity/tokens'];
  for (const theme of ['Light', 'Dark']) {
    const name = theme.toLowerCase();
    output['src/themes/' + name + '/theme.json'] = json({ $description: notice, mode: theme,
      sources: [...categories, 'semantic/' + name, 'charts/' + name].map(p => '../../' + p + '.tokens.json') });
    output['dist/' + name + '.tokens.json'] = json(tree(themes[theme]));
  }
  const light = declarations(themes.Light), dark = declarations(themes.Dark);
  output['dist/light.css'] = '/* ' + notice + ' */\n' + cssBlock(':root, [data-theme="light"]', light);
  output['dist/dark.css'] = '/* ' + notice + ' */\n' + cssBlock('[data-theme="dark"]', dark);
  // Full declarations on both scopes let nested light/dark roots rebind aliases correctly.
  output['dist/tokens.css'] = output['dist/light.css'] + '\n' + cssBlock('[data-theme="dark"]', dark);
  output['dist/tokens.json'] = json({ $description: notice, format: 'DTCG 2025.10', themes: { Light: './light.tokens.json', Dark: './dark.tokens.json' } });
  const structured = { Light: themes.Light, Dark: themes.Dark };
  output['dist/index.js'] = '// ' + notice + '\nexport const tokens = ' + json(structured).trim() + ';\nexport const cssVariables = ' + json({ Light: light, Dark: dark }).trim() + ';\n';
  const names = Object.keys(themes.Light).sort();
  output['dist/index.d.ts'] = '// ' + notice + '\nexport type Theme = "Light" | "Dark";\nexport type TokenName = ' + names.map(JSON.stringify).join(' | ') + ';\n' +
    'export type Dimension = { value: number; unit: "px" | "rem" };\n' +
    'export type Color = { colorSpace: "srgb"; components: [number, number, number]; alpha: number };\n' +
    'export type Alias = \`{\${TokenName}}\`;\n' +
    'export type Shadow = { color: Color; offsetX: Dimension; offsetY: Dimension; blur: Dimension; spread: Dimension; inset: boolean };\n' +
    'export type Typography = { fontFamily: string; fontWeight: number; fontSize: Dimension; lineHeight: number; letterSpacing: Dimension };\n' +
    'export type Token = ({ $type: "color"; $value: Color | Alias } | { $type: "dimension"; $value: Dimension | Alias } | { $type: "duration"; $value: { value: number; unit: "ms" | "s" } | Alias } | { $type: "fontWeight"; $value: number | Alias } | { $type: "number"; $value: number | Alias } | { $type: "shadow"; $value: Shadow[] | Alias } | { $type: "typography"; $value: Typography | Alias }) & { $description?: string; $extensions: Record<string, unknown> };\n' +
    'export declare const tokens: Record<Theme, Record<TokenName, Token>>;\n' +
    'export type CSSVariableName = ' + Object.keys(light).sort().map(JSON.stringify).join(' | ') + ';\n' +
    'export declare const cssVariables: Record<Theme, Record<CSSVariableName, string>>;\n';
  const mapping = snapshot.variables.map(v => ({ id: v.id, name: v.name, collectionId: v.variableCollectionId, token: paths.get(v.id), css: cssName(paths.get(v.id)) }));
  output['dist/source-map.json'] = json({ $description: notice, variables: mapping,
    styles: Object.entries(themes.Light).filter(([, t]) => t.$extensions[extension].sourceType === 'STYLE').map(([p, t]) => ({ ...t.$extensions[extension], token: p })) });
  output['dist/validation-report.json'] = json({ $description: notice, status: 'passed',
    fileKey: snapshot.fileKey, extractedAt: snapshot.extractedAt, variableCount: snapshot.variables.length,
    auditVariableCount: 287, difference: snapshot.variables.length - 287, textStyleCount: snapshot.textStyles.length, effectStyleCount: snapshot.effectStyles.length,
    tokensPerTheme: names.length, cssPropertiesPerTheme: Object.keys(light).length,
    collections: snapshot.collections.map(c => ({ name: c.name, count: c.variableIds.length, modes: c.modes.map(m => m.name) })),
    aliasesByTheme: Object.fromEntries(Object.entries(themes).map(([m, t]) => [m, Object.values(t).filter(t => ref(t.$value)).length])),
    checks: ['snapshot hashes', 'source counts and membership', 'source IDs', 'mode names and completeness', 'alias targets/types/cycles', 'DTCG value types', 'opacity scope, percentage conversion and unitless range', 'normalized names and group collisions', 'CSS name collisions', 'source-to-output reproducibility'] });
  return output;
}
export function run(check = false) {
  const expected = outputs(loadSnapshot());
  const owned = ['src', 'dist'].flatMap(folder => (existsSync(resolve(root, folder)) ? readdirSync(resolve(root, folder), { recursive: true, withFileTypes: true }) : [])
    .filter(e => e.isFile() && /\.(json|css|js|ts)$/.test(e.name))
    .map(e => relative(root, resolve(e.parentPath, e.name)).replaceAll('\\', '/')));
  for (const path of owned) assert(Object.hasOwn(expected, path), 'Unexpected/stale generated file: ' + path);
  for (const [path, bytes] of Object.entries(expected)) {
    const target = resolve(root, path);
    if (check) assert(existsSync(target) && readFileSync(target, 'utf8') === bytes, 'Generated file missing or modified: ' + path);
    else { mkdirSync(dirname(target), { recursive: true }); writeFileSync(target, bytes); }
  }
  console.log((check ? 'Validated' : 'Generated') + ' ' + Object.keys(expected).length + ' files: 317 variables + 16 text styles + 14 effect styles; 347 tokens per theme; Light and Dark.');
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { run(process.argv.includes('--check')); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
