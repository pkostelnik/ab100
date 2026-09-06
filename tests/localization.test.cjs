const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.join(__dirname, '..');
const context = vm.createContext({});
for (const file of ['course.js', 'resources.js', 'courseware-insights.js', 'labs.js', 'questions.js', 'content-de.js', 'i18n.js', 'study-state.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, { filename: file });
}
vm.runInContext('const state = { language: "de" };', context);
const read = expression => JSON.parse(vm.runInContext(`JSON.stringify(${expression})`, context));
const { questions, contentDe, labs, courseAreas, learningOutcomes, coursewareInsights, resources, uiText } = read('({ questions, contentDe, labs, courseAreas, learningOutcomes, coursewareInsights, resources, uiText })');
const nonempty = text => typeof text === 'string' && text.trim().length > 0;

test('101 German records preserve all question contracts and contain full display fields', () => {
  assert.equal(questions.length, 101);
  assert.deepEqual(Object.keys(contentDe.questions).sort(), questions.map(q => String(q.id)).sort());
  const permittedUnchanged = new Set(['Microsoft Purview', 'Success by Design', 'Microsoft Defender', 'Cloud Adoption Framework']);
  for (const q of questions) {
    const de = contentDe.questions[q.id];
    assert.equal(de.revision, q.revision, `Q${q.id} revision`);
    assert.deepEqual(Object.keys(de).sort(), ['revision', 'question', 'options', 'explanation', ...(q.matchLabels ? ['matchLabels'] : [])].sort());
    for (const field of ['question', 'explanation']) {
      assert.ok(nonempty(de[field]), `Q${q.id} ${field}`);
      assert.notEqual(de[field], q[field]);
    }
    assert.equal(de.options.length, q.options.length);
    de.options.forEach((option, i) => {
      assert.ok(nonempty(option));
      if (!permittedUnchanged.has(option)) assert.notEqual(option, q.options[i], `Q${q.id} option ${i}`);
    });
    if (q.matchLabels) {
      assert.equal(de.matchLabels.length, q.matchLabels.length);
      de.matchLabels.forEach((label, i) => { assert.ok(nonempty(label)); assert.equal(label[0], q.matchLabels[i][0]); assert.notEqual(label, q.matchLabels[i]); });
    }
    const displayed = read(`localizedQuestion(questions.find(q => q.id === ${q.id}))`);
    for (const field of ['id', 'revision', 'answer', 'matches', 'format', 'labIds', 'source', 'sourceType', 'official', 'verifiedOn', 'originSource']) assert.deepEqual(displayed[field], q[field]);
    assert.equal(vm.runInContext(`StudyState.isCorrect(localizedQuestion(questions.find(q => q.id === ${q.id})), questions.find(q => q.id === ${q.id}).${q.format === 'matching' ? 'matches' : 'answer'})`, context), true);
  }
});

test('all 9 labs, 6 outcomes, 3 areas, 5 insights and 5 resources are covered by stable keys', () => {
  for (const [collection, canonical] of [['labs', labs], ['areas', courseAreas], ['insights', coursewareInsights], ['resources', resources]]) {
    assert.deepEqual(Object.keys(contentDe[collection]).sort(), canonical.map(item => item.id).sort());
  }
  for (const lab of labs) {
    const de = contentDe.labs[lab.id];
    assert.ok(nonempty(de.title) && nonempty(de.summary));
    assert.notEqual(de.title, lab.title);
    assert.notEqual(de.summary, lab.summary);
    for (const field of ['checklist', 'artifacts', 'concepts']) {
      assert.equal(de[field].length, lab[field].length);
      assert.ok(de[field].every(nonempty));
    }
  }
  for (const insight of coursewareInsights) for (const field of ['title', 'text']) {
    assert.ok(nonempty(contentDe.insights[insight.id][field]));
    assert.notEqual(contentDe.insights[insight.id][field], insight[field]);
  }
  const outcomeIds = read('outcomeIds');
  assert.deepEqual(Object.keys(outcomeIds).sort(), [...learningOutcomes].sort());
  assert.equal(new Set(Object.values(outcomeIds)).size, 6);
  for (const id of Object.values(outcomeIds)) assert.ok(nonempty(contentDe.outcomes[id]));
  for (const text of Object.values(contentDe.areas)) assert.ok(nonempty(text));
  for (const text of Object.values(contentDe.resources)) assert.ok(nonempty(text));
});

test('UI keys and annotated text/attributes have complete English and German records', () => {
  assert.deepEqual(Object.keys(uiText.en).sort(), Object.keys(uiText.de).sort());
  for (const locale of ['en', 'de']) assert.ok(Object.values(uiText[locale]).every(nonempty));
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  for (const [, key] of html.matchAll(/data-ui(?:-aria|-placeholder|-alt|-content)?="([^"]+)"/g)) {
    for (const locale of ['en', 'de']) assert.ok(nonempty(uiText[locale][key]), `${locale} ${key}`);
  }
  assert.ok(html.indexOf('src="content-de.js') < html.indexOf('src="app.js'));
  assert.deepEqual(Object.keys(read('topicTextDe')).sort(), [...new Set(questions.map(q => q.topic))].sort());
  assert.equal(vm.runInContext('ui("connectedLabs", { count: 3 })', context), '3 zugehörige Labs');
  assert.equal(vm.runInContext('t("Microsoft Purview")', context), 'Microsoft Purview');
  assert.equal(vm.runInContext('t("Which unrelated word")', context), 'Which unrelated word');
});

test('missing or stale question translations fall back atomically without answer mutation', () => {
  const result = vm.runInContext(`(() => {
    const q = questions[0];
    return localizedQuestion({ ...q, revision: q.revision + 1 }).question === q.question
      && localizedQuestion({ ...q, id: 'missing' }).question === q.question
      && localizedQuestion(q, 'en') === q;
  })()`, context);
  assert.equal(result, true);
});

test('German length and exact-duplicate diagnostics remain explicit editorial signals', t => {
  const singles = questions.filter(q => q.format === 'single').map(q => ({ ...q, ...contentDe.questions[q.id] }));
  const longest = singles.filter(q => q.options.every((option, i) => i === q.answer || q.options[q.answer].length > option.length));
  const shortest = singles.filter(q => q.options.every((option, i) => i === q.answer || q.options[q.answer].length < option.length));
  const normalize = text => text.toLowerCase().replace(/\s+/g, ' ').trim();
  const bank = Object.values(contentDe.questions);
  assert.equal(new Set(bank.map(q => normalize(q.question))).size, bank.length);
  assert.equal(new Set(bank.map(q => JSON.stringify(q.options.map(normalize).sort()))).size, bank.length);
  assert.ok(longest.length < singles.length, 'Do not recreate the universal longest-answer leak');
  const ranks = [0, 0, 0, 0];
  for (const q of singles) {
    const size = q.options[q.answer].length;
    const below = q.options.filter(s => s.length < size).length;
    const equal = q.options.filter(s => s.length === size).length;
    for (let i = below; i < below + equal; i++) ranks[i] += 1 / equal;
  }
  t.diagnostic(JSON.stringify({ singles: singles.length, strictlyLongest: longest.map(q => q.id), strictlyShortest: shortest.map(q => q.id), tieSplitLengthRanks: ranks }));
});
