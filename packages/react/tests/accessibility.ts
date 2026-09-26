import axe from 'axe-core';

export async function assertAccessible(element: Element) {
  const result = await axe.run(element, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] },
  });
  if (result.violations.length) {
    throw new Error(result.violations.map(v => v.id + ': ' + v.help + ' (' + v.nodes.map(n => n.target.join(' ')).join(', ') + ')').join('\n'));
  }
  return result;
}
