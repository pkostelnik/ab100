const { test } = require('node:test');
const assert = require('node:assert/strict');
const S = require('../study-state.js');
const single = { id: 1, format: 'single', options: ['a', 'b'], answer: 1 };
const multiple = { id: 'multi', revision: 2, format: 'multiple', options: ['a', 'b', 'c'], answer: [0, 2] };
const matching = { id: 4, format: 'matching', options: ['one', 'two'], matchLabels: ['A. a', 'B. b'], matches: { 0: 'B', 1: 'A' } };
const bank = [single, multiple, matching, ...Array.from({ length: 22 }, (_, i) => ({ ...single, id: i + 10 }))];
const now = 1800000000000;
const memory = (initial = {}) => {
  const data = new Map(Object.entries(initial));
  return { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value), removeItem: key => data.delete(key) };
};

test('pure study-state API is available in Node', () => assert.equal(typeof S.createExam, 'function'));
test('responses validate all formats, partial drafts and exact scoring', () => {
  assert.equal(S.validResponse(single, 0, true), true);
  for (const v of [null, '1', -1, 2, [], {}]) assert.equal(S.validResponse(single, v), false);
  assert.equal(S.validResponse(multiple, [], false), true);
  assert.equal(S.validResponse(multiple, [], true), false);
  assert.equal(S.isCorrect(multiple, [2, 0]), true);
  for (const v of [[0, 0], [0], [0, 1, 2], [3]]) assert.equal(S.isCorrect(multiple, v), false);
  assert.equal(S.validResponse(matching, { 0: 'B' }), true);
  assert.equal(S.validResponse(matching, { 0: 'B' }, true), false);
  for (const v of [[], null, { 2: 'A' }, { 0: 'Z' }]) assert.equal(S.validResponse(matching, v), false);
  assert.equal(S.isCorrect(matching, { 0: 'B', 1: 'A' }), true);
});
test('learning requires explicit submit and stores a revisioned copy', () => {
  const draft = [0, 2];
  const record = S.submitAnswer(multiple, draft);
  draft.pop();
  assert.deepEqual(record, { revision: 2, value: [0, 2] });
  assert.equal(S.submitAnswer(matching, { 0: 'B' }), null);
});
test('attempts start empty with 20 unique questions and an absolute 20-minute deadline', () => {
  const a = S.createExam(bank, now, () => 0.5);
  const b = S.createExam(bank, now + 1, () => 0.1);
  assert.equal(a.questions.length, 20);
  assert.equal(new Set(a.questions.map(q => q.id)).size, 20);
  assert.deepEqual(a.answers, {});
  assert.notEqual(a.answers, b.answers);
  assert.equal(a.deadline, now + 1200000);
  assert.equal(a.questions.find(q => q.id === 1)?.revision ?? 1, 1);
  assert.throws(() => S.createExam(bank.slice(0, 3), now));
});
test('exam edits are copied; completion is idempotent, immutable and scores only this attempt', () => {
  let exam = S.createExam(bank, now, () => 0.999);
  exam = S.answerExam(exam, bank, single.id, 1, now + 1);
  const done = S.finishExam(exam, bank, now + 2);
  assert.deepEqual(done.result, { correct: 1, total: 20 });
  assert.equal(exam.status, 'active');
  assert.equal(S.answerExam(done, bank, single.id, 0, now + 3), done);
  assert.equal(S.finishExam(done, bank, now + 4), done);
  assert.ok(Object.isFrozen(done.answers));
  assert.ok(Object.isFrozen(done.result));
});
test('completion scores all formats and freezes nested responses independently of input drafts', () => {
  let exam = S.createExam(bank, now, () => 0.999);
  const draft = { 0: 'B', 1: 'A' };
  exam = S.answerExam(exam, bank, 4, draft, now);
  draft[0] = 'A';
  exam = S.answerExam(exam, bank, 'multi', [0, 2], now);
  const done = S.finishExam(exam, bank, now + 1);
  assert.equal(done.result.correct, 2);
  assert.equal(done.answers[4][0], 'B');
  assert.ok(Object.isFrozen(done.answers[4]));
  assert.ok(Object.isFrozen(done.answers.multi));
});
test('a response at or after the deadline finishes without accepting the late edit', () => {
  const exam = S.createExam(bank, now, () => 0.999);
  const done = S.answerExam(exam, bank, 1, 1, exam.deadline);
  assert.equal(done.status, 'completed');
  assert.equal(done.result.correct, 0);
});
test('resume keeps order, index, drafts and deadline; expiration uses the same finish', () => {
  const exam = S.answerExam(S.createExam(bank, now, () => 0.999), bank, 4, { 0: 'B' }, now);
  exam.index = 2;
  assert.deepEqual(S.restoreExam(JSON.stringify(exam), bank, now + 500), exam);
  const done = S.restoreExam(JSON.stringify(exam), bank, exam.deadline + 100);
  assert.deepEqual(done, S.finishExam(exam, bank, exam.deadline + 100));
  assert.equal(S.restoreExam(JSON.stringify(done), bank, exam.deadline + 200).status, 'completed');
});
test('resume rejects malformed, incompatible, duplicate, revised and forged result sessions', () => {
  const exam = S.createExam(bank, now, () => 0.999);
  for (const raw of ['{', 'null', '[]', '{}']) assert.equal(S.restoreExam(raw, bank, now), null);
  const changes = [
    x => x.questions.push(x.questions[0]),
    x => x.questions[0].revision++,
    x => x.questions[0].id = 'missing',
    x => x.index = -1,
    x => x.index = 20,
    x => x.deadline += 1,
    x => x.startedAt = now + 1,
    x => x.answers = [],
    x => x.answers[1] = 99,
    x => x.answers.missing = 0,
    x => x.schemaVersion = 99,
    x => x.status = 'other',
  ];
  for (const change of changes) {
    const bad = structuredClone(exam); change(bad);
    assert.equal(S.restoreExam(JSON.stringify(bad), bank, now), null);
  }
  const done = structuredClone(S.finishExam(exam, bank, now + 1));
  done.result.correct = 20;
  assert.equal(S.restoreExam(JSON.stringify(done), bank, now + 2), null);
});
test('revisioned progress drops unknown IDs, invalid values and outdated revisions', () => {
  const raw = JSON.stringify({ schemaVersion: 1, answers: {
    1: { revision: 1, value: 1 }, multi: { revision: 1, value: [0, 2] }, 4: { revision: 1, value: { 0: 'B' } }, unknown: { revision: 1, value: 1 },
  } });
  assert.deepEqual(S.readAnswers(raw, bank), { 1: { revision: 1, value: 1 } });
  for (const raw of ['{', 'null', '[]', '{}', '{"schemaVersion":2,"answers":{}}']) assert.deepEqual(S.readAnswers(raw, bank), {});
  assert.deepEqual(S.readAnswers(raw, bank.map(q => ({ ...q, revision: 2 }))), {});
});
test('legacy migration backs up verbatim and imports only validated revision-1 mappings', () => {
  const raw = JSON.stringify({ 1: 1, 4: { 0: 'B' }, multi: [0, 2], missing: 0, 10: 999 });
  const storage = S.safeStorage(() => memory({ 'ab100-answers': raw }));
  assert.deepEqual(S.loadAnswers(storage, bank), { 1: { revision: 1, value: 1 } });
  assert.equal(storage.get('ab100-answers'), raw);
  assert.equal(storage.get('ab100-answers-backup'), raw);
  assert.deepEqual(S.loadAnswers(storage, bank.map(q => ({ ...q, revision: 2 }))), {});
  storage.set('ab100-study-v1', JSON.stringify({ schemaVersion: 1, answers: {} }));
  assert.deepEqual(S.loadAnswers(storage, bank), {});
});
test('storage getters, reads, writes and removals fall back to memory and warn', () => {
  for (const method of ['getter', 'getItem', 'setItem', 'removeItem']) {
    let warnings = 0;
    const backend = memory();
    if (method !== 'getter') backend[method] = () => { throw Error('denied'); };
    const storage = S.safeStorage(() => { if (method === 'getter') throw Error('denied'); return backend; }, () => warnings++);
    storage.get('x'); storage.set('x', 'value'); storage.remove('other');
    assert.equal(storage.get('x'), 'value');
    storage.remove('x'); assert.equal(storage.get('x'), null);
    assert.ok(warnings > 0);
  }
});
test('malformed legacy data is preserved with a warning and cannot disable startup', () => {
  let warnings = 0;
  const storage = S.safeStorage(() => memory({ 'ab100-answers': '{' }));
  assert.deepEqual(S.loadAnswers(storage, bank, () => warnings++), {});
  assert.equal(storage.get('ab100-answers-backup'), '{');
  assert.ok(warnings > 0);
});
test('write failure does not hide still-readable preferences or other progress', () => {
  const backend = memory({ theme: 'dark', labs: '{"lab-01-0":true}' });
  backend.setItem = () => { throw Error('quota'); };
  const storage = S.safeStorage(() => backend);
  storage.set('answers', '{}');
  assert.equal(storage.get('theme'), 'dark');
  assert.equal(storage.get('labs'), '{"lab-01-0":true}');
  assert.equal(storage.get('answers'), '{}');
});
test('lab progress accepts known boolean steps and derives percentages, not stored totals', () => {
  const labs = [{ id: 'lab-01', checklist: ['one', 'two'] }];
  assert.deepEqual(S.readLabs('{"lab-01":999,"lab-01-0":true,"lab-01-1":"yes","unknown":true}', labs), { 'lab-01-0': true, 'lab-01': 50 });
  for (const raw of ['{', 'null', '[]']) assert.deepEqual(S.readLabs(raw, labs), {});
});
test('revised learning archive retains old records across unrelated saves without duplicates', () => {
  const oldRecord = { revision: 1, value: 1 };
  const backend = memory({ [S.ANSWERS_KEY]: JSON.stringify({ schemaVersion: 1, answers: { 1: oldRecord } }) });
  const revisedBank = [{ ...single, revision: 2 }, { ...single, id: 2 }];
  for (let visit = 0; visit < 3; visit++) {
    const storage = S.safeStorage(() => backend);
    const answers = S.loadAnswers(storage, revisedBank);
    assert.equal(answers[1], undefined);
    answers[2] = S.submitAnswer(revisedBank[1], 1);
    assert.equal(typeof S.saveAnswers, 'function');
    S.saveAnswers(storage, revisedBank, answers);
    const stored = JSON.parse(backend.getItem(S.ANSWERS_KEY));
    assert.deepEqual(stored.archive, [{ id: '1', record: oldRecord }]);
    assert.deepEqual(stored.answers, { 2: { revision: 1, value: 1 } });
  }
});
test('quota failure still permits backing removal and does not disable other operations', () => {
  const backend = memory({ progress: 'old', theme: 'dark' });
  backend.setItem = () => { throw Error('quota'); };
  const storage = S.safeStorage(() => backend);
  storage.set('progress', 'new');
  storage.remove('progress');
  assert.equal(backend.getItem('progress'), null);
  assert.equal(S.safeStorage(() => backend).get('theme'), 'dark');
});
test('successful storage reads observe another tab writes and removals', () => {
  const backend = memory({ shared: 'old' });
  const a = S.safeStorage(() => backend);
  const b = S.safeStorage(() => backend);
  assert.equal(a.get('shared'), 'old');
  b.set('shared', 'new');
  assert.equal(a.get('shared'), 'new');
  b.remove('shared');
  assert.equal(a.get('shared'), null);
});
test('independent answer patches merge fresh compatible records from both tabs', () => {
  const backend = memory();
  const a = S.safeStorage(() => backend);
  const b = S.safeStorage(() => backend);
  S.loadAnswers(a, bank);
  S.loadAnswers(b, bank);
  S.saveAnswers(a, bank, { 1: S.submitAnswer(single, 1) });
  S.saveAnswers(b, bank, { multi: S.submitAnswer(multiple, [0, 2]) });
  assert.deepEqual(S.readAnswers(backend.getItem(S.ANSWERS_KEY), bank), {
    1: { revision: 1, value: 1 }, multi: { revision: 2, value: [0, 2] },
  });
});
test('a stale tab save cannot restore a reset revision archive', () => {
  const backend = memory({ [S.ANSWERS_KEY]: JSON.stringify({ schemaVersion: 1,
    answers: { 95: { revision: 1, value: 0 } } }) });
  const a = S.safeStorage(() => backend);
  const b = S.safeStorage(() => backend);
  S.loadAnswers(a, bank);
  assert.equal(JSON.parse(backend.getItem(S.ANSWERS_KEY)).archive.length, 1);
  b.remove(S.ANSWERS_KEY);
  S.saveAnswers(a, bank, { 1: S.submitAnswer(single, 1) });
  assert.deepEqual(JSON.parse(backend.getItem(S.ANSWERS_KEY)).archive, []);
});
test('external invalidation drops failed-write overlays, including a full storage clear', () => {
  const backend = memory({ x: 'persisted' });
  const storage = S.safeStorage(() => backend);
  const write = backend.setItem;
  backend.setItem = () => { throw Error('quota'); };
  storage.set('x', 'local');
  assert.equal(storage.get('x'), 'local');
  write('x', 'external');
  storage.invalidate('x');
  assert.equal(storage.get('x'), 'external');
  storage.set('y', 'local');
  storage.invalidate(null);
  assert.equal(storage.get('y'), null);
});
test('exam learning promotion is completed-only, answered-only and once per persisted session', () => {
  const local = S.safeStorage(() => memory());
  const session = S.safeStorage(() => memory());
  S.saveAnswers(local, bank, { 4: S.submitAnswer(matching, matching.matches) });
  let exam = S.createExam(bank, now, () => 0.999);
  exam = S.answerExam(exam, bank, 1, 1, now);
  exam = S.answerExam(exam, bank, 'multi', [0], now);
  exam = S.answerExam(exam, bank, 4, { 0: 'A' }, now);
  const before = local.get(S.ANSWERS_KEY);
  assert.equal(S.applyExamLearning(exam, bank, local, session), exam);
  assert.equal(local.get(S.ANSWERS_KEY), before);
  const done = S.finishExam(exam, bank, now + 1);
  const applied = S.applyExamLearning(done, bank, local, session);
  assert.equal(applied.learningApplied, true);
  assert.ok(Object.isFrozen(applied));
  assert.deepEqual(applied.result, done.result);
  assert.deepEqual(S.readAnswers(local.get(S.ANSWERS_KEY), bank), {
    1: { revision: 1, value: 1 }, multi: { revision: 2, value: [0] },
    4: { revision: 1, value: matching.matches },
  });
  S.saveAnswers(local, bank, { 1: S.submitAnswer(single, 0) });
  const changed = local.get(S.ANSWERS_KEY);
  const restored = S.restoreExam(session.get(S.EXAM_KEY), bank, now + 2);
  S.applyExamLearning(restored, bank, local, session);
  assert.equal(local.get(S.ANSWERS_KEY), changed);
});
test('resume validates promotion flags and never retroactively promotes old completed sessions', () => {
  const active = S.createExam(bank, now, () => 0.999);
  const done = S.finishExam(active, bank, now + 1);
  for (const value of [null, 'true', 1, {}]) {
    assert.equal(S.restoreExam(JSON.stringify({ ...done, learningApplied: value }), bank, now + 2), null);
  }
  assert.equal(S.restoreExam(JSON.stringify({ ...active, learningApplied: true }), bank, now), null);
  const legacy = { ...done };
  delete legacy.learningApplied;
  assert.equal(S.restoreExam(JSON.stringify(legacy), bank, now + 2).learningApplied, true);
  assert.equal(S.restoreExam(JSON.stringify(active), bank, active.deadline).learningApplied, false);
});
test('promotion merges complete multiple and matching responses; unanswered completion makes no learning write', () => {
  const local = S.safeStorage(() => memory());
  const session = S.safeStorage(() => memory());
  let exam = S.createExam(bank, now, () => 0.999);
  exam = S.answerExam(exam, bank, 'multi', [0, 2], now);
  exam = S.answerExam(exam, bank, 4, matching.matches, now);
  S.applyExamLearning(S.finishExam(exam, bank, now + 1), bank, local, session);
  assert.deepEqual(S.readAnswers(local.get(S.ANSWERS_KEY), bank), {
    multi: S.submitAnswer(multiple, [0, 2]), 4: S.submitAnswer(matching, matching.matches),
  });
  const before = local.get(S.ANSWERS_KEY);
  S.applyExamLearning(S.finishExam(S.createExam(bank, now), bank, now + 1), bank, local, session);
  assert.equal(local.get(S.ANSWERS_KEY), before);
});
