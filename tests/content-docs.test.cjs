const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const script = path.join(root, 'scripts/generate-docs.mjs');

test('Markdown generator includes complete answer contracts and provenance deterministically', async () => {
  assert.ok(fs.existsSync(script), 'missing deterministic generator');
  const { renderMarkdown } = await import(pathToFileURL(script));
  const { loadContent } = await import(pathToFileURL(path.join(root, 'scripts/content-data.mjs')));
  const data = loadContent();
  const before = JSON.stringify(data);
  const markdown = renderMarkdown(data);
  assert.equal(renderMarkdown(data), markdown);
  assert.equal(JSON.stringify(data), before);
  assert.match(markdown, /Total: 101 questions/);
  for (const q of data.questions) {
    const section = markdown.split(`## Q${q.id} - `)[1]?.split('\n## Q')[0];
    assert.ok(section, `missing Q${q.id}`);
    for (const value of [q.question, ...q.options, q.explanation, q.source, q.sourceType, q.verification, q.verifiedOn, ...(q.matchLabels || []), ...(q.originSource ? [q.originSource] : [])]) assert.ok(section.includes(value), `Q${q.id} omitted ${value}`);
    assert.ok(section.includes(`**Revision:** ${q.revision}`));
    assert.ok(section.includes('**Official:** false'));
    const answer = q.format === 'matching'
      ? Object.entries(q.matches).map(([index, letter]) => `${Number(index) + 1} -> ${letter}`).join(', ')
      : (q.format === 'multiple' ? q.answer : [q.answer]).map(index => String.fromCharCode(65 + index)).join(', ');
    assert.ok(section.includes(`**Answer:** ${answer}`), `Q${q.id} answer`);
  }
});

test('docs check fails stale or missing mirrors without writes; generation is repeatable in any cwd', t => {
  assert.ok(fs.existsSync(script), 'missing deterministic generator');
  const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'ab100 docs '));
  t.after(() => fs.rmSync(scratch, { recursive: true, force: true }));
  fs.cpSync(path.join(root, 'scripts'), path.join(scratch, 'scripts'), { recursive: true });
  for (const file of ['course.js', 'resources.js', 'courseware-insights.js', 'labs.js', 'questions.js', 'content-de.js', 'i18n.js', 'index.html', 'app.js']) fs.copyFileSync(path.join(root, file), path.join(scratch, file));
  const mirror = path.join(scratch, 'AB100.md');
  const run = (...args) => spawnSync(process.execPath, [path.join(scratch, 'scripts/generate-docs.mjs'), ...args], { cwd: os.tmpdir(), encoding: 'utf8' });
  assert.equal(run('--check').status, 1);
  assert.equal(fs.existsSync(mirror), false);
  fs.writeFileSync(mirror, 'STALE\n');
  const mtime = fs.statSync(mirror).mtimeMs;
  const stale = run('--check');
  assert.equal(stale.status, 1);
  assert.match(stale.stderr, /stale/i);
  assert.equal(fs.readFileSync(mirror, 'utf8'), 'STALE\n');
  assert.equal(fs.statSync(mirror).mtimeMs, mtime);
  const generated = run();
  assert.equal(generated.status, 0, generated.stderr);
  const first = fs.readFileSync(mirror, 'utf8');
  assert.equal(run().status, 0);
  assert.equal(fs.readFileSync(mirror, 'utf8'), first);
  const freshTime = fs.statSync(mirror).mtimeMs;
  assert.equal(run('--check').status, 0);
  assert.equal(fs.statSync(mirror).mtimeMs, freshTime);
  assert.equal(run('--chekc').status, 1, 'unknown flag must not accidentally write');
  assert.equal(fs.statSync(mirror).mtimeMs, freshTime);
  const validate = spawnSync(process.execPath, [path.join(scratch, 'scripts/validate-content.mjs')], { cwd: os.tmpdir(), encoding: 'utf8' });
  assert.equal(validate.status, 0, validate.stderr);
  assert.match(validate.stdout, /101 questions/);
  const release = spawnSync(process.execPath, [path.join(scratch, 'scripts/check-release.mjs')], { cwd: os.tmpdir(), encoding: 'utf8' });
  assert.ok(release.stdout.includes('not legal approval') || release.stderr.includes('Publication blocked'));
  fs.unlinkSync(path.join(scratch, 'questions.js'));
  const invalid = run();
  assert.equal(invalid.status, 1);
  assert.equal(fs.readFileSync(mirror, 'utf8'), first);
  assert.equal(fs.statSync(mirror).mtimeMs, freshTime);
});

test('committed Markdown mirror matches current data', () => {
  assert.ok(fs.existsSync(script), 'missing deterministic generator');
  const result = spawnSync(process.execPath, [script, '--check'], { cwd: os.tmpdir(), encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
});
