import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import { loadContent } from './content-data.mjs';

const repository = 'https://github.com/tertiarycourses/C1756-AB-100-Microsoft-Certified-Agentic-AI-Business-Solutions-Architect';
const labFiles = [
  'lab-01-qualify-the-process-and-grounding-data.md',
  'lab-02-choose-the-platform-and-agent-boundaries.md',
  'lab-03-build-the-value-case-and-ai-operating-model.md',
  'lab-04-design-the-core-agent-grounding-and-prompt-contracts.md',
  'lab-05-design-multi-agent-mcp-and-computer-use-extensibility.md',
  'lab-06-map-dynamics-365-power-platform-and-microsoft-365-integration.md',
  'lab-07-create-the-evaluation-telemetry-and-tuning-plan.md',
  'lab-08-design-alm-environments-and-operational-ownership.md',
  'lab-09-complete-the-security-responsible-ai-and-governance-record.md',
];
const labIds = labFiles.map(file => file.slice(0, 6));
const labUrls = labFiles.map(file => `${repository}/blob/main/labs/${file}`);
const requiredResources = {
  'c1756-labs': ['labs', `${repository}/tree/main/labs`, labIds],
  'c1756-learner-guide': ['guide', `${repository}/blob/main/LG-AB-100%20Agentic%20AI%20Business%20Solutions%20Architect%20(C1756).md`, labIds],
  'c1756-lab-guide': ['guide', `${repository}/blob/main/labs/README.md`, ['lab-01']],
  'study-guide': ['official', 'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ab-100', labIds.slice(0, 3)],
  'learn-path': ['official', 'https://learn.microsoft.com/en-us/training/paths/architect-agentic-ai-business-solutions/', ['lab-01']],
};
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const text = value => typeof value === 'string' && value.trim().length > 0;
const normalize = value => value.toLowerCase().replace(/\s+/g, ' ').trim();
const sameSet = (a, b) => a.length === b.length && new Set(a).size === a.length && a.every(value => b.includes(value));

export function validateContent(input) {
  const errors = [], diagnostics = [];
  const data = object(input) ? input : {};
  const check = (condition, field, message) => { if (!condition) errors.push(`${field}: ${message}`); };
  const record = (value, field) => { check(object(value), field, 'expected an object'); return object(value) ? value : {}; };
  const strings = (value, field, min = 1, unique = false) => {
    const valid = Array.isArray(value) && value.length >= min && value.every(text);
    check(valid, field, `expected at least ${min} nonempty strings`);
    if (valid && unique) check(new Set(value.map(normalize)).size === value.length, field, 'entries must be unique');
    return valid ? value : [];
  };
  const keys = (value, expected, field) => {
    const actual = Object.keys(record(value, field));
    for (const key of expected) check(actual.includes(key), `${field}.${key}`, 'missing key');
    for (const key of actual) check(expected.includes(key), `${field}.${key}`, 'unsupported key');
  };
  const url = (value, field, host = 'learn.microsoft.com') => {
    let parsed;
    try { parsed = new URL(value); } catch { /* Report malformed URLs rather than throwing. */ }
    check(text(value) && /^https:\/\//.test(value) && !/\s/.test(value) && parsed?.protocol === 'https:' && parsed.hostname === host && !parsed.username && !parsed.password && !parsed.port && parsed.pathname !== '/', field, `expected an HTTPS ${host} document URL without credentials or custom port`);
  };
  const mapping = (value, field) => {
    const ids = strings(value, field, 1, true);
    ids.forEach(id => check(labIds.includes(id), field, `unsupported lab ${id}`));
    return ids;
  };
  const collections = {};
  for (const [name, min, exact] of [['questions', 90], ['labs', 9, true], ['courseAreas', 3, true], ['coursewareInsights', 5], ['resources', 1]]) {
    const values = data[name];
    check(Array.isArray(values) && (exact ? values.length === min : values.length >= min), name, `expected ${exact ? 'exactly' : 'at least'} ${min} records`);
    collections[name] = (Array.isArray(values) ? values : []).map((value, i) => record(value, `${name}[${i}]`));
    const ids = new Set();
    for (const [i, item] of collections[name].entries()) {
      check(Object.hasOwn(item, 'id') && (name === 'questions' ? Number.isSafeInteger(item.id) && item.id > 0 : text(item.id)), `${name}[${i}].id`, 'expected explicit positive integer question ID or nonempty record ID');
      check(!ids.has(item.id), `${name}[${i}].id`, `duplicate id ${item.id}`);
      ids.add(item.id);
    }
  }
  const { questions, labs, courseAreas, coursewareInsights, resources } = collections;
  labs.forEach((lab, i) => {
    const field = `labs[${i}]`, index = labIds.indexOf(lab.id);
    check(index >= 0, `${field}.id`, 'expected lab-01 through lab-09');
    check(lab.number === index + 1, `${field}.number`, 'must match lab ID');
    check(lab.domain === ['plan', 'design', 'deploy'][Math.floor(index / 3)], `${field}.domain`, 'must match the course area');
    for (const key of ['title', 'summary']) check(text(lab[key]), `${field}.${key}`, 'required text');
    for (const key of ['artifacts', 'concepts', 'checklist']) strings(lab[key], `${field}.${key}`);
    check(lab.sourceUrl === labUrls[index], `${field}.sourceUrl`, 'expected the exact original C1756 lab file');
    check(lab.sourceType === 'Tertiary Courses C1756 Courseware', `${field}.sourceType`, 'unsupported provenance');
    check(lab.verificationStatus === 'Courseware-derived; verify against Microsoft Learn', `${field}.verificationStatus`, 'unsupported verification label');
  });
  const areaNames = ['plan', 'design', 'deploy'];
  courseAreas.forEach((area, i) => {
    const field = `courseAreas[${i}]`, index = areaNames.indexOf(area.id);
    check(index >= 0, `${field}.id`, 'expected plan, design or deploy');
    check(area.title === `${['Plan', 'Design', 'Deploy'][index]} AI-powered business solutions`, `${field}.title`, 'incorrect exam area title');
    check(area.weight === (area.id === 'deploy' ? '40\u201345%' : '25\u201330%'), `${field}.weight`, 'incorrect exam weight');
    check(sameSet(mapping(area.labs, `${field}.labs`), labIds.slice(index * 3, index * 3 + 3)), `${field}.labs`, 'incorrect area lab membership');
    strings(area.sources, `${field}.sources`).forEach(source => url(source, `${field}.sources`));
  });
  coursewareInsights.forEach((insight, i) => {
    const field = `coursewareInsights[${i}]`;
    for (const key of ['title', 'text']) check(text(insight[key]), `${field}.${key}`, 'required text');
    check(['confirmed', 'partially confirmed'].includes(insight.status), `${field}.status`, 'unsupported status');
    mapping(insight.labs, `${field}.labs`);
    url(insight.source, `${field}.source`);
  });
  for (const id of Object.keys(requiredResources)) check(resources.some(r => r.id === id), `resources.${id}`, 'required resource missing');
  resources.forEach((resource, i) => {
    const field = `resources[${i}]`, expected = Object.hasOwn(requiredResources, resource.id) ? requiredResources[resource.id] : null;
    check(text(resource.title), `${field}.title`, 'required text');
    check(['labs', 'guide', 'official'].includes(resource.type), `${field}.type`, 'unsupported type');
    const ids = mapping(resource.labs, `${field}.labs`);
    url(resource.url, `${field}.url`, resource.type === 'official' ? 'learn.microsoft.com' : 'github.com');
    if (expected) {
      check(resource.type === expected[0], `${field}.type`, 'incorrect resource type');
      check(resource.url === expected[1], `${field}.url`, 'incorrect canonical resource URL');
      check(sameSet(ids, expected[2]), `${field}.labs`, 'incorrect resource lab membership');
    } else if (resource.type !== 'official') {
      check([...labUrls, ...Object.values(requiredResources).map(r => r[1])].includes(resource.url), `${field}.url`, 'unsupported C1756 path');
    }
  });
  questions.forEach((q, i) => {
    const field = `questions[${i}] (Q${q.id})`;
    check(Object.hasOwn(q, 'revision') && Number.isSafeInteger(q.revision) && q.revision > 0, `${field}.revision`, 'expected explicit positive integer');
    check(!Object.hasOwn(q, 'domain'), `${field}.domain`, 'question areas derive only from labIds');
    check(!Object.hasOwn(q, 'coursewareSource'), `${field}.coursewareSource`, 'obsolete field; current provenance uses originSource');
    for (const key of ['question', 'topic', 'explanation']) check(text(q[key]), `${field}.${key}`, 'required text');
    check(q.official === false, `${field}.official`, 'all practice must explicitly be unofficial');
    check(q.sourceType === 'Unofficial practice, Learn-aligned', `${field}.sourceType`, 'unsupported authorship label');
    check(q.verification === 'Documentation-reviewed; scenario judgment, not a product execution test', `${field}.verification`, 'unsupported verification claim');
    check(typeof q.verifiedOn === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(q.verifiedOn) && Number.isFinite(Date.parse(q.verifiedOn)) && new Date(q.verifiedOn).toISOString().slice(0, 10) === q.verifiedOn, `${field}.verifiedOn`, 'expected real YYYY-MM-DD documentation-review date');
    url(q.source, `${field}.source`);
    const ids = mapping(q.labIds, `${field}.labIds`);
    if (Object.hasOwn(q, 'originSource')) {
      // Current bank supports lab association only; a historic dump link is not item lineage.
      check(labUrls.includes(q.originSource) && ids.includes(labIds[labUrls.indexOf(q.originSource)]), `${field}.originSource`, 'expected an exact C1756 lab URL also listed in labIds');
    }
    const options = strings(q.options, `${field}.options`, 2, true);
    check(options.length <= 26, `${field}.options`, 'UI supports at most 26 option letters');
    const answerIndex = value => Number.isInteger(value) && value >= 0 && value < options.length;
    check(['single', 'multiple', 'matching'].includes(q.format), `${field}.format`, 'unsupported answer format');
    if (q.format === 'single') check(answerIndex(q.answer), `${field}.answer`, 'expected in-range integer index');
    if (q.format === 'multiple') check(Array.isArray(q.answer) && q.answer.length > 0 && q.answer.every(answerIndex) && new Set(q.answer).size === q.answer.length, `${field}.answer`, 'expected nonempty unique in-range integer indices');
    if (q.format === 'matching') {
      const labels = strings(q.matchLabels, `${field}.matchLabels`, 1, true);
      const letters = labels.map(label => label[0]);
      check(labels.every(label => /^[A-Z]\.\s+\S/.test(label)) && new Set(letters).size === letters.length, `${field}.matchLabels`, 'expected unique uppercase letter prefixes and label text');
      keys(q.matches, options.map((_, index) => String(index)), `${field}.matches`);
      Object.values(object(q.matches) ? q.matches : {}).forEach(value => check(letters.includes(value), `${field}.matches`, 'unknown match letter'));
      check(q.answer === 0, `${field}.answer`, 'matching retains numeric sentinel 0; matches is the actual answer key');
    } else {
      check(!Object.hasOwn(q, 'matches') && !Object.hasOwn(q, 'matchLabels'), `${field}.format`, 'nonmatching record has matching fields');
    }
  });

  const de = record(data.contentDe, 'contentDe');
  keys(de, ['questions', 'labs', 'areas', 'outcomes', 'insights', 'resources'], 'contentDe');
  for (const [name, originals] of [['questions', questions], ['labs', labs], ['areas', courseAreas], ['insights', coursewareInsights], ['resources', resources]]) {
    const translated = record(de[name], `contentDe.${name}`);
    keys(translated, originals.map(item => String(item.id)), `contentDe.${name}`);
    originals.forEach(item => {
      const field = `contentDe.${name}.${item.id}`, value = translated[item.id];
      if (name === 'areas' || name === 'resources') { check(text(value), field, 'expected translated title string'); return; }
      const local = record(value, field);
      const fields = name === 'questions' ? ['revision', 'question', 'options', 'explanation', ...(item.format === 'matching' ? ['matchLabels'] : [])] : name === 'labs' ? ['title', 'summary', 'artifacts', 'concepts', 'checklist'] : ['title', 'text'];
      keys(local, fields, field);
      fields.forEach(key => {
        if (key === 'revision') { check(local.revision === item.revision, `${field}.revision`, 'stale translation'); return; }
        if (['options', 'matchLabels', 'artifacts', 'concepts', 'checklist'].includes(key)) {
          const values = strings(local[key], `${field}.${key}`, 1, ['options', 'matchLabels'].includes(key));
          check(Array.isArray(item[key]) && values.length === item[key].length, `${field}.${key}`, 'must preserve canonical array length/order');
          if (key === 'matchLabels') values.forEach((label, index) => check(/^[A-Z]\.\s+\S/.test(label) && label[0] === item.matchLabels?.[index]?.[0], `${field}.matchLabels`, 'must preserve match letters'));
        } else check(text(local[key]), `${field}.${key}`, 'required translated text');
      });
    });
  }
  const outcomes = strings(data.learningOutcomes, 'learningOutcomes', 6, true);
  check(outcomes.length === 6, 'learningOutcomes', 'expected six outcomes');
  const outcomeIds = record(data.outcomeIds, 'outcomeIds');
  keys(outcomeIds, outcomes, 'outcomeIds');
  const outcomeKeys = strings(Object.values(outcomeIds), 'outcomeIds', 6, true);
  keys(de.outcomes, outcomeKeys, 'contentDe.outcomes');
  Object.entries(object(de.outcomes) ? de.outcomes : {}).forEach(([key, value]) => check(text(value), `contentDe.outcomes.${key}`, 'required translation'));
  keys(data.topicTextDe, [...new Set(questions.map(q => q.topic).filter(text))], 'topicTextDe');
  Object.entries(object(data.topicTextDe) ? data.topicTextDe : {}).forEach(([key, value]) => check(text(value), `topicTextDe.${key}`, 'required translation'));
  const ui = record(data.uiText, 'uiText');
  const en = record(ui.en, 'uiText.en');
  check(Object.keys(en).length > 0, 'uiText.en', 'missing UI dictionary');
  for (const locale of ['en', 'de']) {
    keys(ui[locale], Object.keys(en), `uiText.${locale}`);
    const entries = record(ui[locale], `uiText.${locale}`);
    // These keys are selected dynamically by the renderer or t(), not literal ui() calls.
    const dynamicKeys = ['resourceLabs', 'resourceGuide', 'resourceOfficial', 'confirmed', 'partiallyConfirmed', 'unofficial', 'verification', 'labVerification', 'plan', 'design', 'deploy', 'allDomains', 'allTopics', 'finish', 'next', 'noWeakSpots', 'noMatch'];
    for (const key of [...Object.keys(en), ...dynamicKeys, ...(Array.isArray(data.uiKeys) ? data.uiKeys : [])]) {
      check(text(entries[key]), `uiText.${locale}.${key}`, 'required UI text');
      const tokens = value => typeof value === 'string' ? [...value.matchAll(/\{\w+\}/g)].map(m => m[0]).sort().join(',') : '';
      check(tokens(entries[key]) === tokens(en[key]), `uiText.${locale}.${key}`, 'interpolation tokens must match English');
    }
    const legal = record(data.legalText?.[locale], `legalText.${locale}`);
    for (const name of ['disclaimer', 'privacy', 'imprint']) {
      check(text(legal[name]?.title) && text(legal[name]?.html), `legalText.${locale}.${name}`, 'required title and HTML; placeholders are a separate release gate');
    }
  }

  // Signals for editors, not semantic distinctness, answer quality or psychometric proof.
  for (const locale of ['en', 'de']) {
    const bank = questions.map(q => locale === 'en' ? q : { ...q, ...(object(de.questions?.[q.id]) ? de.questions[q.id] : {}) });
    for (const [code, signature] of [
      ['duplicate-stem', q => text(q.question) ? normalize(q.question) : null],
      ['duplicate-options', q => Array.isArray(q.options) && q.options.every(text) ? JSON.stringify(q.options.map(normalize).sort()) : null],
    ]) {
      const groups = new Map();
      bank.forEach(q => { const key = signature(q); if (key) groups.set(key, [...(groups.get(key) || []), q.id]); });
      for (const ids of groups.values()) if (ids.length > 1) diagnostics.push({ code, locale, ids });
    }
    const singles = bank.filter(q => q.format === 'single' && Array.isArray(q.options) && q.options.length >= 2 && q.options.every(text) && Number.isInteger(q.answer) && text(q.options[q.answer]));
    const longest = [], shortest = [], ranks = [];
    for (const q of singles) {
      const length = q.options[q.answer].length;
      if (q.options.every((option, i) => i === q.answer || option.length < length)) longest.push(q.id);
      if (q.options.every((option, i) => i === q.answer || option.length > length)) shortest.push(q.id);
      const below = q.options.filter(option => option.length < length).length;
      const equal = q.options.filter(option => option.length === length).length;
      for (let i = below; i < below + equal; i++) ranks[i] = (ranks[i] || 0) + 1 / equal;
    }
    diagnostics.push({ code: 'answer-length', locale, singleCount: singles.length, strictlyLongest: longest, strictlyShortest: shortest, tieSplitLengthRanks: Array.from(ranks, n => n || 0) });
  }
  return { errors, diagnostics };
}

if (process.argv[1] && pathToFileURL(fs.realpathSync(process.argv[1])).href === import.meta.url) {
  try {
    if (process.argv.length > 2) throw new Error('Usage: node scripts/validate-content.mjs');
    const data = loadContent();
    const { errors, diagnostics } = validateContent(data);
    for (const diagnostic of diagnostics) console.log(`Editorial diagnostic (not psychometric validation): ${JSON.stringify(diagnostic)}`);
    if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
    else console.log(`Content validation passed: ${data.questions.length} questions, ${data.labs.length} labs, ${data.courseAreas.length} exam areas, ${data.coursewareInsights.length} insights, ${data.resources.length} resources; EN/DE contracts checked. URLs are structural checks, not live verification.`);
  } catch (error) { console.error(`Content validation failed: ${error.message}`); process.exitCode = 1; }
}
