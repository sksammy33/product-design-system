// Read-only Figma Plugin API script. Set kind and offset, then return the result.
// Execute through use_figma (top-level await/return supported), not Node.
const kind = 'collections'; // 'collections', 'variables', or 'styles'
const offset = 0;
const pick = (o, keys) => Object.fromEntries(keys.map(k => [k, o[k]]));
if (kind === 'collections') {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  return { fileKey: figma.fileKey, extractedAt: new Date().toISOString(),
    collections: collections.map(c => pick(c, ['id', 'key', 'name', 'defaultModeId', 'modes', 'variableIds', 'hiddenFromPublishing', 'remote'])) };
}
if (kind === 'variables') {
  const variables = await figma.variables.getLocalVariablesAsync();
  return { total: variables.length, offset, variables: variables.slice(offset, offset + 30).map(v => pick(v,
    ['id', 'key', 'name', 'description', 'variableCollectionId', 'resolvedType', 'valuesByMode', 'scopes', 'codeSyntax', 'hiddenFromPublishing', 'remote'])) };
}
if (kind === 'styles') {
  const [textStyles, effectStyles] = await Promise.all([figma.getLocalTextStylesAsync(), figma.getLocalEffectStylesAsync()]);
  return {
    textStyles: textStyles.map(s => pick(s, ['id', 'key', 'name', 'description', 'fontName', 'fontSize', 'lineHeight', 'letterSpacing', 'paragraphSpacing', 'paragraphIndent', 'textCase', 'textDecoration', 'boundVariables'])),
    effectStyles: effectStyles.map(s => pick(s, ['id', 'key', 'name', 'description', 'effects'])),
  };
}
throw new Error('Unknown export kind');
