const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const script = path.join(root, 'scripts/check-release.mjs');
async function api() {
  assert.ok(fs.existsSync(script), 'missing separate release gate');
  return import(pathToFileURL(script));
}
function fixture() {
  // Deliberately not personal data or a proposed legal notice. Tests only the marker gate.
  return Object.fromEntries(['en', 'de'].map(locale => [locale, Object.fromEntries(['disclaimer', 'privacy', 'imprint'].map(name => [name, { title: 'Test fixture', html: '<p>Operator-supplied reviewed content.</p>' }]))]));
}

test('release marker check is pure and does not pretend to certify legal compliance', async () => {
  const { validateRelease } = await api();
  const legal = fixture();
  const before = JSON.stringify(legal);
  assert.deepEqual(validateRelease(legal), []);
  assert.equal(JSON.stringify(legal), before);
});

for (const marker of ['[Operator name or entity]', '[Provider name or entity]', '[Full service address]', '[Email address]', '[Name oder Organisation des Betreibers]', '[Name oder Organisation des Anbieters]', '[Vollständige ladungsfähige Anschrift]', '[E-Mail-Adresse]', 'PLACEHOLDER', 'Platzhalter', '<p class="placeholder-notice">Notice</p>', 'TODO', 'TBD', '&#91;Operator&#93;', '&lbrack;Operator&rbrack;', 'Place<strong>holder</strong>', 'Platz\u200bhalter', 'Complete before public publication.', 'Vor öffentlicher Veröffentlichung vervollständigen.', 'not a complete, individualized privacy policy', 'keine vollständige, individuell geprüfte Datenschutzerklärung']) {
  test(`release gate rejects ${marker} independently in both languages`, async () => {
    const { validateRelease } = await api();
    for (const locale of ['en', 'de']) {
      const legal = fixture();
      legal[locale].privacy.html = `<p>${marker}</p>`;
      assert.ok(validateRelease(legal).some(error => error.includes(`${locale}.privacy`)));
    }
  });
}

test('missing or empty legal records fail closed', async () => {
  const { validateRelease } = await api();
  for (const value of [undefined, null, {}, { en: {} }, { de: {} }]) assert.ok(validateRelease(value).length);
  const legal = fixture();
  legal.en.privacy.html = '<p> </p>';
  assert.ok(validateRelease(legal).length);
});

for (const [name, html] of [
  ['paragraph boundaries', '<p>Operator</p><p>TODO</p><p>Contact</p>'],
  ['block boundaries', '<div>Operator</div><section>TBD</section><div>Contact</div>'],
  ['line breaks', 'Operator<br>TODO<br />Contact'],
  ['list boundaries', '<ul><li>Operator</li><li>TODO</li><li>Contact</li></ul>'],
  ['table cells', '<table><tr><td>Operator</td><td>TODO</td><td>Contact</td></tr></table>'],
  ['inline split inside blocks', '<p>Operator</p><p>Place<strong>holder</strong></p><p>Contact</p>'],
]) test(`release gate preserves ${name} around markers`, async () => {
  const { validateRelease } = await api();
  for (const locale of ['en', 'de']) {
    const legal = fixture();
    legal[locale].privacy.html = html;
    const errors = validateRelease(legal);
    assert.equal(errors.length, 1, `${locale}: expected only the independently injected fault`);
    assert.match(errors[0], new RegExp(`${locale}\\.privacy: unresolved publication placeholder`));
  }
});

for (const body of ['&#32;', '&#160;', '&#x200B;', '&#32;&#160;&#x200B;', '&nbsp;', '\u200b', '&#x2060;']) {
  test(`release gate rejects decoded invisible-only body ${JSON.stringify(body)} despite nonempty title`, async () => {
    const { validateRelease } = await api();
    for (const locale of ['en', 'de']) {
      const legal = fixture();
      legal[locale].privacy.html = `<p>${body}</p>`;
      assert.deepEqual(validateRelease(legal), [`legalText.${locale}.privacy: empty legal body`]);
    }
  });
}

test('release gate accepts visible body text surrounded by encoded spacing and inline markup', async () => {
  const { validateRelease } = await api();
  const legal = fixture();
  for (const locale of ['en', 'de']) legal[locale].privacy.html = '<p>&#32;<strong>Reviewed</strong> content.&#160;&#x200B;</p>';
  assert.deepEqual(validateRelease(legal), []);
});

test('release CLI agrees with the loaded EN/DE gate without coupling tests to operator completion', async () => {
  const { validateRelease } = await api();
  const { loadContent } = await import(pathToFileURL(path.join(root, 'scripts/content-data.mjs')));
  const errors = validateRelease(loadContent().legalText);
  const result = spawnSync(process.execPath, [script], { cwd: require('node:os').tmpdir(), encoding: 'utf8' });
  assert.equal(result.status, errors.length ? 1 : 0);
  if (errors.length) assert.match(result.stderr, /Publication blocked/);
  else assert.match(result.stdout, /not legal approval/);
});
