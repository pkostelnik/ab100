const $ = (selector) => document.querySelector(selector);
let storageWarning = false;
function warnStorage() {
  storageWarning = true;
  $('#storage-warning').hidden = false;
}
const localStore = StudyState.safeStorage(() => window.localStorage, warnStorage);
const sessionStore = StudyState.safeStorage(() => window.sessionStorage, warnStorage);
const savedLanguage = localStore.get('ab100-language');
const state = {
  index: 0,
  mode: 'learn',
  answers: StudyState.loadAnswers(localStore, questions, warnStorage),
  drafts: {},
  query: '',
  topic: 'all',
  areaId: 'all',
  language: ['en', 'de'].includes(savedLanguage) ? savedLanguage : 'en',
  reviewIds: [],
  exam: null,
};
const savedExam = sessionStore.get(StudyState.EXAM_KEY);
let learningReset = localStore.get(StudyState.RESET_KEY);
let learningRaw = localStore.get(StudyState.ANSWERS_KEY);
state.exam = StudyState.restoreExam(savedExam, questions);
if (state.exam) {
  state.mode = 'exam';
  state.index = state.exam.index;
  saveExam();
} else if (savedExam !== null) {
  warnStorage();
  sessionStore.remove(StudyState.EXAM_KEY);
}

const themeSelect = $('#theme-select');
const languageSelect = $('#language-select');
languageSelect.value = state.language;
function applyLanguage(language) {
  if (!['en', 'de'].includes(language)) return;
  const currentId = filtered()[state.index]?.id;
  state.language = language;
  localStore.set('ab100-language', language);
  languageSelect.value = language;
  document.documentElement.lang = language;
  document.title = ui('title');
  document.querySelectorAll('[data-ui]').forEach(element => { element.textContent = ui(element.dataset.ui); });
  for (const [data, attribute] of [['data-ui-aria', 'aria-label'], ['data-ui-placeholder', 'placeholder'], ['data-ui-alt', 'alt'], ['data-ui-content', 'content']]) {
    document.querySelectorAll(`[${data}]`).forEach(element => element.setAttribute(attribute, ui(element.getAttribute(data))));
  }
  refreshDynamicCopy();
  const nextIndex = filtered().findIndex(item => item.id === currentId);
  if (nextIndex >= 0) state.index = nextIndex;
  render(); renderLabs();
  if (!legalModal.hidden && activeModal) {
    const returnFocus = lastFocusedElement;
    if (activeModal.kind === 'legal') openLegalModal(activeModal.id);
    else if (activeModal.kind === 'lab') openLab(activeModal.id);
    else openInsight(activeModal.id);
    lastFocusedElement = returnFocus;
  }
}
languageSelect.addEventListener('change', (event) => applyLanguage(event.target.value));
function applyTheme(theme) { document.documentElement.dataset.theme = theme; themeSelect.value = theme; }
const savedTheme = localStore.get('ab100-theme');
applyTheme(['auto', 'light', 'dark', 'contrast'].includes(savedTheme) ? savedTheme : 'auto');
themeSelect.addEventListener('change', (event) => { localStore.set('ab100-theme', event.target.value); applyTheme(event.target.value); });

const list = $('#question-list');
const card = $('#question-card');
const labProgress = StudyState.readLabs(localStore.get('ab100-lab-progress'), labs, warnStorage);
const labsGrid = $('#labs-grid');
const labFilter = $('#lab-filter');
const outcomesStrip = $('#outcomes-strip');
const areaGrid = $('#area-grid');
const insightsGrid = $('#insights-grid');
const legalModal = $('#legal-modal');
const modalPanel = legalModal.querySelector('.modal-panel');
const modalTitle = $('#modal-title');
const modalContent = $('#modal-content');
let lastFocusedElement;
let returnFocusSelector;
let activeModal;
let modalScrollPosition;
function showModal(invoker = document.activeElement) {
  if (legalModal.hidden) {
    lastFocusedElement = invoker;
    // Lab progress and language changes replace cards; retain a stable trigger identity.
    const trigger = lastFocusedElement;
    returnFocusSelector = trigger.id ? `#${CSS.escape(trigger.id)}` :
      trigger.matches('[data-lab]') ? `.${trigger.classList.contains('lab-open') ? 'lab-open' : 'lab-inline-open'}[data-lab="${CSS.escape(trigger.dataset.lab)}"]` :
      trigger.matches('[data-insight]') ? `[data-insight="${CSS.escape(trigger.dataset.insight)}"]` :
      trigger.matches('[data-legal]') ? `[data-legal="${CSS.escape(trigger.dataset.legal)}"]` : null;
    modalScrollPosition = { left: window.scrollX, top: window.scrollY };
    document.body.style.setProperty('--modal-scroll-top', `${-modalScrollPosition.top}px`);
    document.documentElement.classList.add('modal-open');
  }
  legalModal.hidden = false;
  $('.app-shell').inert = true;
  modalPanel.focus();
}
function openLegalModal(type, invoker) { const content = legalText[state.language][type] || legalText[state.language].disclaimer; activeModal = { kind: 'legal', id: type }; $('#modal-eyebrow').textContent = ui('legalNotes'); modalTitle.textContent = content.title; modalContent.innerHTML = content.html; showModal(invoker); }
function closeLegalModal() {
  if (legalModal.hidden) return;
  legalModal.hidden = true;
  $('.app-shell').inert = false;
  document.documentElement.classList.remove('modal-open');
  document.body.style.removeProperty('--modal-scroll-top');
  window.scrollTo({ ...modalScrollPosition, behavior: 'instant' });
  if (lastFocusedElement === $('#question-title')) focusQuestion();
  else {
    const target = lastFocusedElement?.isConnected && lastFocusedElement !== document.body ? lastFocusedElement : returnFocusSelector && $(returnFocusSelector);
    const restored = target || $('#top');
    restored.focus({ preventScroll: true });
    const bounds = restored.getBoundingClientRect();
    if (bounds.bottom < 0 || bounds.top > window.innerHeight) restored.scrollIntoView({ block: 'nearest', behavior: 'instant' });
  }
}
document.querySelectorAll('[data-legal]').forEach((button) => button.addEventListener('click', () => openLegalModal(button.dataset.legal, button)));
legalModal.querySelectorAll('[data-modal-close]').forEach((button) => button.addEventListener('click', closeLegalModal));
document.addEventListener('keydown', (event) => {
  if (legalModal.hidden) return;
  if (event.key === 'Escape') { event.preventDefault(); closeLegalModal(); }
  if (event.key !== 'Tab') return;
  const controls = [...modalPanel.querySelectorAll('button, a[href], input, select, [tabindex="0"]')].filter(el => !el.disabled && el.getClientRects().length);
  const first = controls[0], last = controls.at(-1);
  if (event.shiftKey && (document.activeElement === first || document.activeElement === modalPanel)) {
    event.preventDefault(); last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault(); first.focus();
  }
});
// Show the disclaimer immediately on every page load so it cannot be missed.
openLegalModal('disclaimer');
if (state.mode === 'exam') lastFocusedElement = $('#question-title');
labFilter.addEventListener('change', renderLabs);
const topics = [...new Set(questions.map((item) => item.topic))];
topics.forEach((topic) => $('#topic-filter').insertAdjacentHTML('beforeend', `<option value="${topic}">${t(topic)}</option>`));
courseAreas.forEach((area) => areaGrid.insertAdjacentHTML('beforeend', `<article class="area-card"><span class="area-weight">${area.weight}</span><h3>${state.language === 'de' ? contentDe.areas[area.id] : area.title}</h3><p>${ui('connectedLabs', { count: area.labs.length })}</p><button class="text-button" data-area="${area.id}" type="button">${ui('studyArea')} ↗</button></article>`));
learningOutcomes.forEach((outcome, index) => outcomesStrip.insertAdjacentHTML('beforeend', `<div><b>0${index + 1}</b><span>${t(outcome)}</span></div>`));
['plan', 'design', 'deploy'].forEach(value => labFilter.insertAdjacentHTML('beforeend', `<option value="${value}">${ui(value)}</option>`));
coursewareInsights.forEach((insight) => insightsGrid.insertAdjacentHTML('beforeend', `<article class="insight-card"><span class="insight-status">${t(insight.status)}</span><h4></h4><p></p><button class="text-button insight-open" data-insight="${insight.id}" type="button">${ui('readInsight')} ↗</button></article>`));
function refreshDynamicCopy() {
  document.querySelectorAll('.area-card').forEach((element, index) => {
    const area = courseAreas[index];
    element.querySelector('h3').textContent = state.language === 'de' ? contentDe.areas[area.id] : area.title;
    element.querySelector('p').textContent = ui('connectedLabs', { count: area.labs.length });
    element.querySelector('button').textContent = `${ui('studyArea')} ↗`;
  });
  document.querySelectorAll('.outcomes-strip span').forEach((element, index) => { element.textContent = t(learningOutcomes[index]); });
  document.querySelectorAll('.insight-card').forEach((element, index) => {
    const insight = localizedRecord('insights', coursewareInsights[index]);
    element.querySelector('h4').textContent = insight.title;
    element.querySelector('p').textContent = insight.text;
    element.querySelector('.insight-status').textContent = t(insight.status);
    element.querySelector('button').textContent = `${ui('readInsight')} ↗`;
  });
  [...$('#topic-filter').options].forEach(option => { option.textContent = option.value === 'all' ? ui('allTopics') : t(option.value); });
  [...labFilter.options].forEach(option => { option.textContent = ui(option.value === 'all' ? 'allDomains' : option.value); });
  $('#resource-links').innerHTML = resources.map((resource, index) => `<a data-resource="${resource.id}" href="${resource.url}" target="_blank" rel="noreferrer"><b>${String(index + 4).padStart(2, '0')}</b><strong>${state.language === 'de' ? contentDe.resources[resource.id] : resource.title}</strong><span>${ui({ labs: 'resourceLabs', guide: 'resourceGuide', official: 'resourceOfficial' }[resource.type])}</span></a>`).join('');
  $('#locale-warning').hidden = state.language !== 'de' || questions.every(item => contentDe.questions[item.id]?.revision === item.revision);
}
document.querySelectorAll('[data-area]').forEach((button) => button.addEventListener('click', () => {
  if (!leaveExam()) return;
  resetFilters();
  state.areaId = button.dataset.area;
  state.mode = 'learn';
  render();
  focusQuestion();
}));
document.querySelectorAll('.insight-open').forEach((button) => button.addEventListener('click', () => openInsight(button.dataset.insight, button)));

function syncLearning(reset = false) {
  const marker = localStore.get(StudyState.RESET_KEY);
  const raw = localStore.get(StudyState.ANSWERS_KEY);
  if (reset || marker !== learningReset || (raw === null && learningRaw !== null)) {
    state.drafts = {}; state.reviewIds = [];
  }
  learningReset = marker;
  learningRaw = raw;
  state.answers = StudyState.readAnswers(raw, questions, warnStorage);
  if (state.mode === 'review') state.reviewIds = questions.filter(item => !StudyState.isCorrect(item, state.answers[item.id]?.value)).map(item => item.id);
}
function save(changes) {
  state.answers = StudyState.saveAnswers(localStore, questions, changes);
  learningRaw = localStore.get(StudyState.ANSWERS_KEY);
}
function saveLabs() { localStore.set('ab100-lab-progress', JSON.stringify(labProgress)); }
function saveExam() {
  if (state.exam) {
    state.exam = StudyState.applyExamLearning(state.exam, questions, localStore, sessionStore);
    sessionStore.set(StudyState.EXAM_KEY, JSON.stringify(state.exam));
    syncLearning();
  }
  else sessionStore.remove(StudyState.EXAM_KEY);
}
function renderLabs() { const visible = labs.filter((lab) => labFilter.value === 'all' || lab.domain === labFilter.value).map(lab => localizedRecord('labs', lab)); labsGrid.innerHTML = visible.map((lab) => `<article class="lab-card"><div class="lab-top"><span>${ui('lab')} ${String(lab.number).padStart(2, '0')} · ${ui(lab.domain)}</span><span>${labProgress[lab.id] || 0}%</span></div><h3>${lab.title}</h3><p>${lab.summary}</p><div class="lab-tags">${lab.concepts.slice(0, 3).map((concept) => `<span>${concept}</span>`).join('')}</div><button class="text-button lab-open" data-lab="${lab.id}" type="button">${ui('openLab')} ↗</button></article>`).join(''); labsGrid.querySelectorAll('.lab-open').forEach((button) => button.addEventListener('click', () => openLab(button.dataset.lab, button))); }
function openLab(id, invoker) { const lab = localizedRecord('labs', labs.find((item) => item.id === id)); activeModal = { kind: 'lab', id }; $('#modal-eyebrow').textContent = ui('labNotes'); modalTitle.textContent = `${ui('lab')} ${String(lab.number).padStart(2, '0')} · ${lab.title}`; modalContent.innerHTML = `<p>${lab.summary}</p><h4>${ui('checklist')}</h4><div class="lab-checklist">${lab.checklist.map((step, index) => `<label><input type="checkbox" data-lab-step="${index}" ${labProgress[`${lab.id}-${index}`] ? 'checked' : ''} />${step}</label>`).join('')}</div><h4>${ui('artifacts')}</h4><p>${lab.artifacts.join(' · ')}</p><p class="verification-note">${t(lab.verificationStatus)}</p><a class="source-link" href="${lab.sourceUrl}" target="_blank" rel="noreferrer">${ui('originalLab')} ↗</a>`; showModal(invoker); modalContent.querySelectorAll('[data-lab-step]').forEach((input) => input.addEventListener('change', () => { labProgress[`${lab.id}-${input.dataset.labStep}`] = input.checked; labProgress[lab.id] = Math.round(Object.keys(labProgress).filter((key) => key.startsWith(`${lab.id}-`) && labProgress[key]).length / lab.checklist.length * 100); saveLabs(); renderLabs(); })); }
function openInsight(id, invoker) { const insight = localizedRecord('insights', coursewareInsights.find((item) => item.id === id)); activeModal = { kind: 'insight', id }; $('#modal-eyebrow').textContent = ui('insightNotes'); modalTitle.textContent = insight.title; modalContent.innerHTML = `<p>${insight.text}</p><p><strong>${ui('status')}:</strong> ${t(insight.status)}</p><a class="source-link" href="${insight.source}" target="_blank" rel="noreferrer">${ui('learnSource')} ↗</a>`; showModal(invoker); }
function currentQuestions() {
  if (state.mode === 'exam') return state.exam.questions.map(ref => questions.find(q => q.id === ref.id));
  if (state.mode === 'review') return state.reviewIds.map(id => questions.find(q => q.id === id));
  return questions;
}
function filtered() {
  const pool = currentQuestions();
  if (state.mode === 'exam') return pool;
  return pool.filter((item) => {
    const display = localizedQuestion(item);
    const searchable = [display.question, ...display.options, display.explanation, ...(display.matchLabels || []), t(item.topic), item.question, ...item.options, item.explanation, ...(item.matchLabels || []), item.topic, item.sourceType, item.source, item.originSource || ''].join(' ').toLocaleLowerCase(state.language);
    return (state.areaId === 'all' || item.labIds.some((labId) => courseAreas.find((area) => area.id === state.areaId)?.labs.includes(labId))) && (state.topic === 'all' || item.topic === state.topic) && (!state.query || searchable.includes(state.query.toLocaleLowerCase(state.language)));
  });
}
const isCorrect = StudyState.isCorrect;
function updateProgress() {
  const completed = Object.keys(state.answers).length;
  const percent = Math.round((completed / questions.length) * 100);
  $('#completed-count').textContent = completed;
  $('#total-count').textContent = questions.length;
  $('#question-total').textContent = filtered().length;
  $('#results-status').textContent = ui('resultsCount', { count: filtered().length });
  $('#progress-percent').textContent = `${percent}%`;
  $('#progress-ring').style.setProperty('--progress', percent);
  $('#progress-ring').setAttribute('aria-valuenow', percent);
}
function renderTopicLinks(item) { const target = labs.find((lab) => item.labIds?.includes(lab.id)); const sourceLink = item.originSource ? `<a class="source-link" href="${item.originSource}" target="_blank" rel="noreferrer">${ui('originalCourseware')} ↗</a>` : ''; return target || sourceLink ? `<div class="related-lab">${target ? `<strong>${ui('related')}</strong><button class="text-button lab-inline-open" data-lab="${target.id}" type="button">${localizedRecord('labs', target).title} ↗</button>` : ''}${sourceLink}</div>` : ''; }
function renderList(items) {
  const answers = state.mode === 'exam' ? state.exam.answers : state.answers;
  list.innerHTML = items.map((item, index) => `<button class="list-item ${index === state.index ? 'active' : ''} ${StudyState.validResponse(item, state.mode === 'exam' ? answers[item.id] : answers[item.id]?.value, true) ? 'done' : ''}" data-id="${item.id}" ${index === state.index ? 'aria-current="step"' : ''} aria-label="${ui('question')} ${item.id}: ${t(item.topic)}" type="button"><span>Q${String(item.id).padStart(2, '0')}</span><span>${t(item.topic).split(' ')[0]}</span></button>`).join('');
  list.querySelectorAll('button').forEach((button, index) => button.addEventListener('click', () => navigateQuestion(index)));
}
function answerText(item) {
  if (item.format === 'matching') return Object.entries(item.matches).map(([key, value]) => `${Number(key) + 1} → ${value}`).join(', ');
  return Array.isArray(item.answer) ? item.answer.map((entry) => String.fromCharCode(65 + entry)).join(', ') : String.fromCharCode(65 + item.answer);
}
function optionMarkup(item, answered, reveal, locked) {
  const selected = Array.isArray(answered) ? answered : answered === undefined ? [] : [answered];
  return item.options.map((option, index) => {
    const right = Array.isArray(item.answer) ? item.answer.includes(index) : index === item.answer;
    const cls = !reveal ? '' : right ? 'correct' : selected.includes(index) ? 'wrong' : '';
    return `<label class="option ${cls}"><span class="option-letter">${String.fromCharCode(65 + index)}</span><input data-option="${index}" name="response" type="${item.format === 'multiple' ? 'checkbox' : 'radio'}" ${selected.includes(index) ? 'checked' : ''} ${locked ? 'disabled' : ''} /><span class="option-copy">${t(option)}</span></label>`;
  }).join('');
}
function renderCard() {
  const items = filtered();
  const canonical = items[state.index];
  if (!canonical) return;
  const item = localizedQuestion(canonical);
  const examView = state.mode === 'exam';
  const drafting = Object.hasOwn(state.drafts, item.id);
  const record = state.answers[item.id];
  const answered = examView ? state.exam.answers[item.id] : drafting ? state.drafts[item.id] : record?.value;
  const reveal = examView ? state.exam.status === 'completed' : !!record && !drafting;
  const locked = reveal;
  const active = examView && !reveal;
  const matching = item.format === 'matching' ? `<div class="matching-list">${item.options.map((option, index) => `<label>${t(option)}<select data-match="${index}" ${locked ? 'disabled' : ''}><option value="">${ui('chooseAnswer')}</option>${item.matchLabels.map(label => `<option value="${label[0]}" ${answered?.[index] === label[0] ? 'selected' : ''}>${t(label)}</option>`).join('')}</select></label>`).join('')}</div>` : '';
  const feedback = reveal ? `<div class="explanation" tabindex="-1"><strong>${isCorrect(item, answered) ? ui('correct') : `${ui('correctAnswer')}: ${answerText(item)}`}</strong>${t(item.explanation)}<br /><br /><a class="source-link" href="${item.source}" target="_blank" rel="noreferrer">${ui('verificationSource')} ↗</a><br /><small>${t(item.verification)}</small></div>` : '';
  const learningControl = examView ? '' : reveal
    ? `<button class="small-button" id="retry-answer" type="button">${ui('retryAnswer')}</button>`
    : `<button class="small-button next" id="check-answer" type="button" ${StudyState.validResponse(item, answered, true) ? '' : 'disabled'}>${ui('checkAnswer')}</button>`;
  card.innerHTML = `<div class="question-meta"><span>${t(item.topic)}</span><span>${active ? ui('exam') : t(item.sourceType)}</span></div><h3>${t(item.question)}</h3>${matching || `<div class="options">${optionMarkup(item, answered, reveal, locked)}</div>`}${learningControl}${active ? '' : `<div class="source-row"><strong>${ui('source')}:</strong> ${t(item.sourceType)}</div>${feedback}${renderTopicLinks(item)}`}<div class="question-footer"><button class="small-button" id="previous" type="button" ${state.index === 0 ? 'disabled' : ''}>← ${ui('previous')}</button><button class="small-button next" id="next" type="button" ${state.index === items.length - 1 && !active ? 'disabled' : ''}>${state.index === items.length - 1 && active ? ui('finish') : `${ui('next')} →`}</button></div>`;
  const contentLanguage = item === canonical ? 'en' : state.language;
  card.querySelectorAll('h3, .option-copy, .matching-list, .explanation').forEach(element => { element.lang = contentLanguage; });
  // Keep native inputs mounted during selection so keyboard focus is not lost.
  card.querySelectorAll('[data-option], [data-match]').forEach(input => input.addEventListener('change', () => {
    if (locked) return;
    let value;
    if (item.format === 'matching') value = Object.fromEntries([...card.querySelectorAll('[data-match]')].filter(select => select.value).map(select => [select.dataset.match, select.value]));
    else if (item.format === 'multiple') value = [...card.querySelectorAll('[data-option]:checked')].map(input => Number(input.dataset.option));
    else value = Number(input.dataset.option);
    if (examView) {
      state.exam = StudyState.answerExam(state.exam, questions, item.id, value);
      saveExam();
      if (!activeExam()) { render(); return; }
    } else state.drafts[item.id] = value;
    if ($('#check-answer')) $('#check-answer').disabled = !StudyState.validResponse(item, value, true);
    renderList(items);
  }));
  $('#check-answer')?.addEventListener('click', () => {
    // A reset may already be persisted while its storage event is still queued.
    syncLearning();
    const submitted = StudyState.submitAnswer(item, state.drafts[item.id]);
    if (!submitted) { render(); return; }
    delete state.drafts[item.id];
    save({ [item.id]: submitted }); render();
    card.querySelector('.explanation').focus();
  });
  $('#retry-answer')?.addEventListener('click', () => {
    state.drafts[item.id] = undefined;
    render();
    card.querySelector('input, select').focus();
  });
  card.querySelectorAll('.lab-inline-open').forEach((button) => button.addEventListener('click', () => openLab(button.dataset.lab, button)));
  $('#previous').addEventListener('click', () => navigateQuestion(Math.max(0, state.index - 1)));
  $('#next').addEventListener('click', () => { if (state.index === items.length - 1 && active) finishExam(); else navigateQuestion(Math.min(items.length - 1, state.index + 1)); });
  $('#question-number').textContent = state.index + 1;
}
function renderExamStatus() {
  const status = $('#exam-status');
  if (state.mode !== 'exam') { status.hidden = true; return; }
  status.hidden = false;
  if (!activeExam()) {
    const { correct, total } = state.exam.result;
    status.textContent = `${ui('complete')} · ${correct}/${total} ${ui('correct')} (${Math.round(correct / total * 100)}%)`;
    return;
  }
  const remaining = Math.max(0, state.exam.deadline - Date.now());
  status.textContent = `${ui('exam')} · ${Math.ceil(remaining / 60000)} ${ui('minutes')}`;
  if (remaining <= 0) finishExam();
}
function finishExam() {
  if (!activeExam()) return;
  state.exam = StudyState.finishExam(state.exam, questions);
  saveExam();
  state.index = 0;
  render();
  if (legalModal.hidden) focusQuestion();
}
function startExam() {
  if (questions.length < 20 || new Set(questions.map(q => q.id)).size !== questions.length) { alert(ui('examUnavailable')); return; }
  if (!leaveExam()) return;
  resetFilters();
  state.mode = 'exam';
  state.exam = StudyState.createExam(questions);
  saveExam(); render(); focusQuestion();
}
function activeExam() { return state.exam?.status === 'active'; }
function focusQuestion() {
  $('#question-title').focus({ preventScroll: true });
  $('#exam').scrollIntoView({ behavior: 'instant', block: 'start' });
}
function navigateQuestion(index) {
  if (activeExam() && Date.now() >= state.exam.deadline) { finishExam(); return; }
  state.index = index;
  if (activeExam()) { state.exam.index = index; saveExam(); }
  render(); focusQuestion();
}
function resetFilters() {
  state.areaId = 'all'; state.topic = 'all'; state.query = ''; state.index = 0;
  $('#topic-filter').value = 'all'; $('#search').value = '';
}
function leaveExam() {
  if (activeExam() && Date.now() >= state.exam.deadline) finishExam();
  if (activeExam() && !confirm(ui('abortConfirm'))) return false;
  state.exam = null;
  saveExam();
  return true;
}
function render() {
  if (activeExam() && Date.now() >= state.exam.deadline) { finishExam(); return; }
  const items = filtered();
  $('#search').disabled = state.mode === 'exam';
  $('#topic-filter').disabled = state.mode === 'exam';
  $('#finish-exam').hidden = !activeExam();
  $('#abort-exam').hidden = !activeExam();
  $('#storage-warning').hidden = !storageWarning;
  renderExamStatus();
  if (!items.length) {
    const emptyReview = state.mode === 'review' && state.reviewIds.length === 0;
    list.innerHTML = '';
    card.innerHTML = `<p class="empty-state">${ui(emptyReview ? 'noWeakSpots' : 'noMatch')}</p>`;
    $('#question-number').textContent = '0';
    updateProgress(); return;
  }
  if (state.index >= items.length) state.index = 0;
  renderList(items); renderCard(); updateProgress();
}
document.querySelectorAll('[data-mode]').forEach((button) => button.addEventListener('click', () => {
  if (button.dataset.mode === 'exam') startExam();
  else {
    if (!leaveExam()) return;
    resetFilters();
    state.mode = button.dataset.mode;
    if (state.mode === 'review') state.reviewIds = questions.filter(item => !isCorrect(item, state.answers[item.id]?.value)).map(item => item.id);
    render(); focusQuestion();
  }
}));
$('#search').addEventListener('input', event => { if (state.mode === 'exam') return; state.query = event.target.value; state.areaId = 'all'; state.index = 0; render(); });
$('#topic-filter').addEventListener('change', event => { if (state.mode === 'exam') return; state.topic = event.target.value; state.areaId = 'all'; state.index = 0; render(); });
$('#finish-exam').addEventListener('click', finishExam);
$('#abort-exam').addEventListener('click', () => {
  if (!leaveExam()) return;
  state.mode = 'learn'; resetFilters(); render(); focusQuestion();
});
// In-page/external links away from the question view require a deliberate abort.
document.addEventListener('click', event => {
  const link = event.target.closest('a[href]');
  if (link?.matches('.skip-link')) {
    event.preventDefault();
    $('#top').focus({ preventScroll: true });
    $('#top').scrollIntoView({ behavior: 'instant', block: 'start' });
    return;
  }
  const studyButton = event.target.closest('.lab-open, .lab-inline-open, .insight-open');
  if ((!link && !studyButton) || link?.getAttribute('href') === '#exam' || !activeExam()) return;
  if (!leaveExam()) { event.preventDefault(); event.stopImmediatePropagation(); return; }
  state.mode = 'learn'; resetFilters(); render();
}, true);
window.addEventListener('beforeunload', event => {
  if (!activeExam()) return;
  saveExam();
  event.preventDefault();
  event.returnValue = '';
});
$('#reset-progress').addEventListener('click', () => {
  if (!confirm(ui('resetConfirm'))) return;
  state.answers = {}; state.drafts = {}; state.reviewIds = []; state.exam = null; state.mode = 'learn';
  resetFilters();
  Object.keys(labProgress).forEach(key => delete labProgress[key]);
  localStore.remove('ab100-answers');
  localStore.remove('ab100-answers-backup');
  localStore.remove(StudyState.ANSWERS_KEY);
  localStore.remove('ab100-lab-progress');
  localStore.set(StudyState.RESET_KEY, crypto.randomUUID());
  learningReset = localStore.get(StudyState.RESET_KEY);
  learningRaw = null;
  sessionStore.remove(StudyState.EXAM_KEY);
  renderLabs(); render();
});
window.addEventListener('storage', event => {
  // sessionStorage attempts belong to this tab, never to another tab's reset.
  let storage;
  try { storage = window.localStorage; } catch { return; }
  if (event.storageArea !== storage) return;
  localStore.invalidate(event.key);
  if ([null, StudyState.ANSWERS_KEY, StudyState.RESET_KEY].includes(event.key)) {
    syncLearning(event.key === null || event.key === StudyState.RESET_KEY || event.newValue === null);
    render();
  }
  if ([null, 'ab100-lab-progress', StudyState.RESET_KEY].includes(event.key)) {
    Object.keys(labProgress).forEach(key => delete labProgress[key]);
    Object.assign(labProgress, StudyState.readLabs(localStore.get('ab100-lab-progress'), labs, warnStorage));
    renderLabs();
    if (!legalModal.hidden && activeModal?.kind === 'lab') {
      modalContent.querySelectorAll('[data-lab-step]').forEach(input => { input.checked = !!labProgress[`${activeModal.id}-${input.dataset.labStep}`]; });
    }
  }
});
document.addEventListener('visibilitychange', () => { if (!document.hidden) { syncLearning(); render(); } });
setInterval(renderExamStatus, 1000);
applyLanguage(state.language);
