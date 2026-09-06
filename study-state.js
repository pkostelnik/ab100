// Pure state transitions plus an injected storage adapter; no DOM dependencies.
const StudyState = (() => {
  const EXAM_DURATION = 20 * 60 * 1000;
  const ANSWERS_KEY = 'ab100-study-v1';
  const EXAM_KEY = 'ab100-exam-v1';
  const RESET_KEY = 'ab100-reset-v1';
  const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
  const revision = q => q.revision ?? 1;
  const copy = value => JSON.parse(JSON.stringify(value));
  function parse(raw) { try { return JSON.parse(raw); } catch { return null; } }
  function freeze(value) {
    if (value && typeof value === 'object') {
      Object.values(value).forEach(freeze);
      Object.freeze(value);
    }
    return value;
  }

  function validResponse(q, value, complete = false) {
    if (q.format === 'matching') {
      if (!object(value)) return false;
      const keys = Object.keys(q.matches);
      const labels = q.matchLabels.map(label => label[0]);
      return Object.entries(value).every(([key, entry]) => keys.includes(key) && labels.includes(entry))
        && (!complete || Object.keys(value).length === keys.length);
    }
    const validIndex = entry => Number.isInteger(entry) && entry >= 0 && entry < q.options.length;
    if (q.format === 'multiple') {
      return Array.isArray(value) && value.every(validIndex) && new Set(value).size === value.length
        && (!complete || value.length > 0);
    }
    return validIndex(value);
  }
  function isCorrect(q, value) {
    if (!validResponse(q, value, true)) return false;
    if (q.format === 'matching') return Object.entries(q.matches).every(([key, expected]) => value[key] === expected);
    if (q.format === 'multiple') return value.length === q.answer.length && value.every(entry => q.answer.includes(entry));
    return value === q.answer;
  }
  function submitAnswer(q, value) {
    return validResponse(q, value, true) ? { revision: revision(q), value: copy(value) } : null;
  }

  function createExam(bank, now = Date.now(), random = Math.random) {
    if (bank.length < 20 || new Set(bank.map(q => String(q.id))).size !== bank.length) throw Error('An exam requires at least 20 unique questions.');
    const pool = [...bank];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return {
      schemaVersion: 1, status: 'active', startedAt: now, deadline: now + EXAM_DURATION,
      questions: pool.slice(0, 20).map(q => ({ id: q.id, revision: revision(q) })),
      answers: {}, index: 0,
    };
  }
  function finishExam(exam, bank, now = Date.now()) {
    if (exam.status === 'completed') return exam;
    const correct = exam.questions.filter(ref => {
      const q = bank.find(q => q.id === ref.id && revision(q) === ref.revision);
      return q && isCorrect(q, exam.answers[ref.id]);
    }).length;
    return freeze({ ...copy(exam), status: 'completed', learningApplied: false, completedAt: Math.min(now, exam.deadline), result: { correct, total: exam.questions.length } });
  }
  function answerExam(exam, bank, id, value, now = Date.now()) {
    if (exam.status !== 'active') return exam;
    if (now >= exam.deadline) return finishExam(exam, bank, now);
    const ref = exam.questions.find(q => q.id === id);
    const q = bank.find(q => q.id === id && revision(q) === ref?.revision);
    if (!q || !validResponse(q, value)) return exam;
    return { ...exam, answers: { ...exam.answers, [id]: copy(value) } };
  }
  function restoreExam(raw, bank, now = Date.now()) {
    const exam = parse(raw);
    if (!object(exam) || exam.schemaVersion !== 1 || !['active', 'completed'].includes(exam.status)
      || !Number.isSafeInteger(exam.startedAt) || exam.startedAt < 0 || exam.startedAt > now
      || exam.deadline !== exam.startedAt + EXAM_DURATION || !Number.isSafeInteger(exam.deadline)
      || !Number.isInteger(exam.index) || exam.index < 0 || exam.index >= 20
      || !Array.isArray(exam.questions) || exam.questions.length !== 20 || !object(exam.answers)) return null;
    const ids = new Set();
    for (const ref of exam.questions) {
      if (!object(ref) || ids.has(String(ref.id)) || !Number.isInteger(ref.revision) || ref.revision < 1
        || !bank.some(q => q.id === ref.id && revision(q) === ref.revision)) return null;
      ids.add(String(ref.id));
    }
    for (const [id, value] of Object.entries(exam.answers)) {
      const q = bank.find(q => String(q.id) === id);
      if (!ids.has(id) || !q || !validResponse(q, value)) return null;
    }
    if (exam.status === 'completed') {
      if (!Number.isSafeInteger(exam.completedAt) || exam.completedAt < exam.startedAt
        || exam.completedAt > Math.min(now, exam.deadline) || !object(exam.result)
        || ('learningApplied' in exam && typeof exam.learningApplied !== 'boolean')) return null;
      const expected = finishExam({ ...exam, status: 'active' }, bank, exam.completedAt);
      if (exam.result.correct !== expected.result.correct || exam.result.total !== expected.result.total) return null;
      // Old completed sessions must not overwrite learning collected since then.
      return freeze({ ...expected, learningApplied: exam.learningApplied ?? true });
    }
    if ('result' in exam || 'completedAt' in exam || 'learningApplied' in exam) return null;
    return now >= exam.deadline ? finishExam(exam, bank, now) : exam;
  }

  function applyExamLearning(exam, bank, storage, session) {
    if (exam.status !== 'completed' || exam.learningApplied !== false) return exam;
    const changes = {};
    for (const ref of exam.questions) {
      const q = bank.find(q => q.id === ref.id && revision(q) === ref.revision);
      const record = q && submitAnswer(q, exam.answers[ref.id]);
      if (record) changes[ref.id] = record;
    }
    const applied = freeze({ ...exam, learningApplied: true });
    // Claim before merging: a resumed result must never replay over newer learning.
    session.set(EXAM_KEY, JSON.stringify(applied));
    if (Object.keys(changes).length) saveAnswers(storage, bank, changes);
    return applied;
  }

  function readAnswers(raw, bank, warn = () => {}) {
    const data = parse(raw);
    if (!object(data) || data.schemaVersion !== 1 || !object(data.answers)) {
      if (raw !== null) warn();
      return {};
    }
    const entries = Object.entries(data.answers).filter(([id, record]) => {
      const q = bank.find(q => String(q.id) === id);
      const valid = q && object(record) && record.revision === revision(q) && validResponse(q, record.value, true);
      if (!valid) warn();
      return valid;
    });
    return Object.fromEntries(entries.map(([id, record]) => [id, { revision: record.revision, value: record.value }]));
  }
  function loadAnswers(storage, bank, warn = () => {}) {
    const stored = storage.get(ANSWERS_KEY);
    if (stored !== null) {
      const answers = readAnswers(stored, bank, warn);
      const data = parse(stored);
      if (object(data) && data.schemaVersion === 1 && object(data.answers)) saveAnswers(storage, bank, {});
      return answers;
    }
    const raw = storage.get('ab100-answers');
    const answers = {};
    if (raw !== null) {
      // Never overwrite the legacy source or an existing verbatim backup.
      if (storage.get('ab100-answers-backup') === null) storage.set('ab100-answers-backup', raw);
      const legacy = parse(raw);
      if (!object(legacy)) warn();
      else for (const [id, value] of Object.entries(legacy)) {
        const q = bank.find(q => String(q.id) === id);
        if (q && revision(q) === 1 && validResponse(q, value, true)) answers[id] = submitAnswer(q, value);
        else warn();
      }
    }
    storage.set(ANSWERS_KEY, JSON.stringify({ schemaVersion: 1, answers }));
    return answers;
  }
  function saveAnswers(storage, bank, changes) {
    const raw = storage.get(ANSWERS_KEY);
    const data = parse(raw);
    // Callers pass only newly checked records, never their tab's whole snapshot.
    const answers = { ...readAnswers(raw, bank), ...readAnswers(JSON.stringify({ schemaVersion: 1, answers: changes }), bank) };
    const archive = Array.isArray(data?.archive) ? data.archive.filter(entry => object(entry) && typeof entry.id === 'string' && Object.hasOwn(entry, 'record')) : [];
    if (object(data) && data.schemaVersion === 1 && object(data.answers)) {
      const compatible = readAnswers(JSON.stringify(data), bank);
      for (const [id, record] of Object.entries(data.answers)) {
        if (!Object.hasOwn(compatible, id)) archive.push({ id, record });
      }
    }
    // Archive and active records share one write: a failed archive write cannot
    // be followed by a successful overwrite that loses the old records.
    const unique = [...new Map(archive.map(entry => [JSON.stringify(entry), entry])).values()];
    storage.set(ANSWERS_KEY, JSON.stringify({ schemaVersion: 1, answers, archive: unique }));
    return answers;
  }
  function readLabs(raw, labs, warn = () => {}) {
    const data = parse(raw);
    if (!object(data)) { if (raw !== null) warn(); return {}; }
    const progress = {};
    for (const lab of labs) {
      let checked = 0;
      lab.checklist.forEach((_, index) => {
        const key = `${lab.id}-${index}`;
        if (data[key] === true) { progress[key] = true; checked++; }
        else if (key in data && data[key] !== false) warn();
      });
      if (checked) progress[lab.id] = Math.round(checked / lab.checklist.length * 100);
    }
    return progress;
  }
  function safeStorage(getStorage, warn = () => {}) {
    const memory = new Map();
    const pending = new Set();
    let backend;
    const failed = new Set();
    try { backend = getStorage(); } catch { warn(); }
    function access(method, key, value) {
      if (!backend || failed.has(method)) return;
      try {
        const result = backend[method](key, value);
        return method === 'getItem' ? result : true;
      }
      catch {
        failed.add(method);
        warn();
      }
    }
    return {
      get(key) {
        if (!pending.has(key)) {
          const value = access('getItem', key);
          if (value !== undefined) memory.set(key, value);
        }
        return memory.get(key) ?? null;
      },
      set(key, value) {
        memory.set(key, value);
        if (access('setItem', key, value)) pending.delete(key);
        else pending.add(key);
      },
      remove(key) {
        memory.set(key, null);
        if (access('removeItem', key)) pending.delete(key);
        else pending.add(key);
      },
      invalidate(key) {
        if (key === null) { memory.clear(); pending.clear(); }
        else { memory.delete(key); pending.delete(key); }
      },
    };
  }
  return { ANSWERS_KEY, EXAM_KEY, RESET_KEY, revision, validResponse, isCorrect, submitAnswer, createExam, answerExam, finishExam, restoreExam, applyExamLearning, readAnswers, loadAnswers, saveAnswers, readLabs, safeStorage };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = StudyState;
