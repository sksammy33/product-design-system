import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { parseDocument } from 'yaml';

const doc = parseDocument(readFileSync(new URL('../.github/workflows/ci.yml', import.meta.url), 'utf8'), { uniqueKeys: true });
assert.equal(doc.errors.length, 0, doc.errors.map(e => e.message).join('\n'));
const workflow = doc.toJS();
const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
assert(workflow.on.push && Object.hasOwn(workflow.on, 'pull_request'));
assert.equal(workflow.permissions.contents, 'read');
for (const job of Object.values(workflow.jobs)) {
  assert(job['runs-on']);
  assert(job['timeout-minutes'] > 0);
  assert(Array.isArray(job.steps));
  for (const step of job.steps) {
    assert(Boolean(step.run) !== Boolean(step.uses), 'Each step must run a command or use an action');
    for (const match of (step.run ?? '').matchAll(/npm run ([\w:-]+)/g)) {
      assert(pkg.scripts[match[1]], 'Unknown npm script in CI: ' + match[1]);
    }
  }
}
console.log('CI YAML parsed successfully; triggers, permissions, jobs and npm command references verified.');
