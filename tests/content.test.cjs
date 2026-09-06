const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const validator = import(pathToFileURL(path.join(root, 'scripts/validate-content.mjs')));

function fixture() {
  const context = vm.createContext({});
  for (const file of ['course.js', 'resources.js', 'courseware-insights.js', 'labs.js', 'questions.js', 'content-de.js', 'i18n.js']) {
    vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context);
  }
  return JSON.parse(vm.runInContext('JSON.stringify({questions, labs, courseAreas, learningOutcomes, coursewareInsights, resources, contentDe, uiText, topicTextDe, outcomeIds, legalText})', context));
}

test('validator exports a pure API and accepts the current complete contract', async () => {
  const { validateContent } = await validator;
  assert.equal(typeof validateContent, 'function');
  const data = fixture();
  const before = JSON.stringify(data);
  const result = validateContent(data);
  assert.deepEqual(result.errors, []);
  assert.ok(Array.isArray(result.diagnostics));
  assert.equal(JSON.stringify(data), before);
  assert.deepEqual(validateContent(data), result);
});

const mutations = [
  ['G17 out-of-range answer', d => { d.questions[0].answer = 999; }, /answer/],
  ['G17 empty lab mappings', d => { d.questions[0].labIds = []; }, /labIds/],
  ['G17 missing verification URL', d => { delete d.questions[0].source; }, /source/],
  ['G17 duplicate ID', d => { d.questions[1].id = d.questions[0].id; }, /id/],
  ['G17 wrong Tertiary repository', d => { const q = d.questions.find(q => q.originSource); q.originSource = q.originSource.replace('C1756-AB-100', 'C1760-AB-620'); }, /originSource/],
  ['G17 empty resources', d => { d.resources = []; }, /resources/],
  ['missing ID', d => { delete d.questions[0].id; }, /id/],
  ['string ID', d => { d.questions[0].id = '1'; }, /id/],
  ['fractional revision', d => { d.questions[0].revision = 1.5; }, /revision/],
  ['missing revision', d => { delete d.questions[0].revision; }, /revision/],
  ['zero revision', d => { d.questions[0].revision = 0; }, /revision/],
  ['question domain', d => { d.questions[0].domain = 'plan'; }, /domain/],
  ['unknown format', d => { d.questions[0].format = 'essay'; }, /format/],
  ['string answer', d => { d.questions[0].answer = '3'; }, /answer/],
  ['empty option', d => { d.questions[0].options[0] = ' '; }, /options/],
  ['duplicate option', d => { d.questions[0].options[0] = d.questions[0].options[1]; }, /options/],
  ['missing explanation', d => { delete d.questions[0].explanation; }, /explanation/],
  ['unknown lab', d => { d.questions[0].labIds = ['lab-99']; }, /labIds/],
  ['duplicate lab mapping', d => { d.questions[0].labIds = ['lab-01', 'lab-01']; }, /labIds/],
  ['official authorship', d => { d.questions[0].official = true; }, /official/],
  ['misleading provenance', d => { d.questions[0].sourceType = 'Microsoft Learn'; }, /sourceType/],
  ['missing verification', d => { d.questions[0].verification = ''; }, /verification/],
  ['invalid review date', d => { d.questions[0].verifiedOn = '2026-02-30'; }, /verifiedOn/],
  ['URL substring spoof', d => { d.questions[0].source = 'https://learn.microsoft.com.evil.test/docs'; }, /source/],
  ['URL credentials spoof', d => { d.questions[0].source = 'https://evil@learn.microsoft.com/docs'; }, /source/],
  ['non-HTTPS source', d => { d.questions[0].source = 'http://learn.microsoft.com/docs'; }, /source/],
  ['non-URL source', d => { d.questions[0].source = 'learn.microsoft.com/docs'; }, /source/],
  ['empty origin', d => { d.questions[0].originSource = ''; }, /originSource/],
  ['wrong origin path', d => { const q = d.questions.find(q => q.originSource); q.originSource = q.originSource.replace('/labs/', '/other/'); }, /originSource/],
  ['unrelated C1756 lab origin', d => { const q = d.questions.find(q => q.originSource); q.originSource = d.labs[8].sourceUrl; }, /originSource/],
  ['obsolete provenance schema', d => { d.questions[0].coursewareSource = d.labs[0].sourceUrl; }, /coursewareSource/],
  ['empty multiple answer', d => { d.questions.find(q => q.format === 'multiple').answer = []; }, /answer/],
  ['duplicate multiple indices', d => { d.questions.find(q => q.format === 'multiple').answer = [0, 0]; }, /answer/],
  ['out-of-range multiple index', d => { d.questions.find(q => q.format === 'multiple').answer = [0, 999]; }, /answer/],
  ['incomplete matching', d => { delete d.questions.find(q => q.format === 'matching').matches[0]; }, /matches/],
  ['extra matching key', d => { d.questions.find(q => q.format === 'matching').matches[99] = 'A'; }, /matches/],
  ['unknown matching value', d => { d.questions.find(q => q.format === 'matching').matches[0] = 'Z'; }, /matches/],
  ['duplicate matching letters', d => { const q = d.questions.find(q => q.format === 'matching'); q.matchLabels[1] = 'A. Other'; }, /matchLabels/],
  ['empty matching labels', d => { d.questions.find(q => q.format === 'matching').matchLabels = []; }, /matchLabels/],
  ['short bank', d => { d.questions = d.questions.slice(0, 89); }, /questions/],
  ['missing lab', d => { d.labs.pop(); }, /labs/],
  ['duplicate lab ID', d => { d.labs[1].id = d.labs[0].id; }, /id/],
  ['wrong lab file', d => { d.labs[0].sourceUrl = d.labs[1].sourceUrl; }, /sourceUrl/],
  ['empty lab checklist', d => { d.labs[0].checklist = []; }, /checklist/],
  ['wrong area ID', d => { d.courseAreas[0].id = 'other'; }, /courseAreas/],
  ['wrong area mapping', d => { d.courseAreas[0].labs = ['lab-04']; }, /labs/],
  ['wrong area weight', d => { d.courseAreas[0].weight = '99%'; }, /weight/],
  ['wrong lab domain', d => { d.labs[0].domain = 'deploy'; }, /domain/],
  ['too few insights', d => { d.coursewareInsights.pop(); }, /coursewareInsights/],
  ['empty insight text', d => { d.coursewareInsights[0].text = ''; }, /text/],
  ['missing required learner guide', d => { d.resources = d.resources.filter(r => r.id !== 'c1756-learner-guide'); }, /c1756-learner-guide/],
  ['wrong learner guide', d => { const r = d.resources.find(r => r.id === 'c1756-learner-guide'); r.url = r.url.replace('C1756).md', 'C1760).md'); }, /url/],
  ['wrong labs resource', d => { d.resources[0].url += '/other'; }, /url/],
  ['missing resource title', d => { d.resources[0].title = ''; }, /title/],
  ['unsupported resource type', d => { d.resources[0].type = 'video'; }, /type/],
  ['empty resource labs', d => { d.resources[0].labs = []; }, /labs/],
  ['prototype-named resource', d => { d.resources[0].id = 'constructor'; }, /resources/],
  ['missing question locale', d => { delete d.contentDe.questions[1]; }, /contentDe.questions/],
  ['stale locale revision', d => { d.contentDe.questions[1].revision--; }, /revision/],
  ['locale option drift', d => { d.contentDe.questions[1].options.pop(); }, /options/],
  ['locale empty explanation', d => { d.contentDe.questions[1].explanation = ''; }, /explanation/],
  ['locale answer override', d => { d.contentDe.questions[1].answer = 0; }, /answer/],
  ['locale match-letter drift', d => { d.contentDe.questions[4].matchLabels[0] = 'Z. Anders'; }, /matchLabels/],
  ['locale lab URL override', d => { d.contentDe.labs['lab-01'].sourceUrl = 'https://evil.test'; }, /sourceUrl/],
  ['locale checklist drift', d => { d.contentDe.labs['lab-01'].checklist.pop(); }, /checklist/],
  ['locale area wrong shape', d => { d.contentDe.areas.plan = { title: 'Titel' }; }, /contentDe.areas/],
  ['locale resource empty', d => { d.contentDe.resources['c1756-labs'] = ''; }, /contentDe.resources/],
  ['locale insight missing', d => { delete d.contentDe.insights['grounding-readiness']; }, /contentDe.insights/],
  ['locale outcome missing', d => { delete d.contentDe.outcomes['grounding-caf']; }, /outcomes/],
  ['locale topic missing', d => { delete d.topicTextDe[d.questions[0].topic]; }, /topicTextDe/],
  ['locale UI missing', d => { delete d.uiText.de.checkAnswer; }, /uiText/],
  ['dynamic resource UI missing in both languages', d => { delete d.uiText.en.resourceLabs; delete d.uiText.de.resourceLabs; }, /resourceLabs/],
  ['locale UI interpolation drift', d => { d.uiText.de.connectedLabs = 'Labs'; }, /connectedLabs/],
  ['locale legal missing', d => { delete d.legalText.de.privacy; }, /legalText/],
  ['null question', d => { d.questions[0] = null; }, /questions/],
  ['null options', d => { d.questions[0].options = null; }, /options/],
  ['null lab', d => { d.labs[0] = null; }, /labs/],
  ['missing locale collection', d => { delete d.contentDe; }, /contentDe/],
];
for (const [name, mutate, pattern] of mutations) test(`rejects ${name}`, async () => {
  const { validateContent } = await validator;
  assert.equal(typeof validateContent, 'function');
  const data = fixture();
  mutate(data);
  const { errors } = validateContent(data);
  assert.ok(errors.some(error => pattern.test(error)), `${name}: ${errors.join('\n')}`);
});

test('malformed root returns errors rather than throwing', async () => {
  const { validateContent } = await validator;
  assert.equal(typeof validateContent, 'function');
  for (const input of [null, {}, [], 'bad']) assert.ok(validateContent(input).errors.length);
});

test('editorial diagnostics expose duplicates and answer-length signals for both languages', async () => {
  const { validateContent } = await validator;
  assert.equal(typeof validateContent, 'function');
  const data = fixture();
  data.questions[1].question = data.questions[0].question;
  data.questions[1].options = [...data.questions[0].options];
  const { diagnostics } = validateContent(data);
  assert.ok(diagnostics.some(d => d.code === 'duplicate-stem' && d.locale === 'en'));
  assert.ok(diagnostics.some(d => d.code === 'duplicate-options' && d.locale === 'en'));
  for (const locale of ['en', 'de']) assert.ok(diagnostics.some(d => d.code === 'answer-length' && d.locale === locale && d.singleCount > 0));
});

test('CLI resolves files relative to itself, not the working directory', () => {
  const result = spawnSync(process.execPath, [path.join(root, 'scripts/validate-content.mjs')], { cwd: require('node:os').tmpdir(), encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /101 questions/);
});

test('shared loader provides canonical data and required DOM/application UI keys', async () => {
  const { loadContent } = await import(pathToFileURL(path.join(root, 'scripts/content-data.mjs')));
  const { validateContent } = await validator;
  const data = loadContent();
  assert.ok(data.uiKeys.includes('checkAnswer') && data.uiKeys.includes('searchPlaceholder'));
  const { uiKeys, ...records } = data;
  assert.deepEqual(records, fixture());
  delete data.uiText.en.searchPlaceholder;
  delete data.uiText.de.searchPlaceholder;
  assert.ok(validateContent(data).errors.some(error => /searchPlaceholder/.test(error)));
});

test('importing validator has no output or data-file reads', () => {
  // Node's ESM loader also uses readFileSync; permit module source, not content data.
  const source = `const fs = await import('node:fs'); const {syncBuiltinESMExports} = await import('node:module'); const read = fs.default.readFileSync; fs.default.readFileSync = (file, ...args) => { if (!String(file).endsWith('.mjs')) throw new Error('unexpected data read: ' + file); return read(file, ...args); }; syncBuiltinESMExports(); await import(${JSON.stringify(pathToFileURL(path.join(root, 'scripts/validate-content.mjs')).href)});`;
  const result = spawnSync(process.execPath, ['--input-type=module', '-e', source], { cwd: require('node:os').tmpdir(), encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, '');
  assert.equal(result.stderr, '');
});
