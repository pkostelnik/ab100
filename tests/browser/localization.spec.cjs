const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  page.localizationErrors = [];
  page.on('pageerror', error => page.localizationErrors.push(error.message));
  await page.route(/^https:\/\//, route => route.abort());
  await page.goto('/');
  await page.getByRole('button', { name: 'Close', exact: true }).click();
});
test.afterEach(async ({ page }) => { expect(page.localizationErrors).toEqual([]); });

test('every German question renders its stem, options, labels and explanation', async ({ page }) => {
  await page.locator('#language-select').selectOption('de');
  const failures = await page.evaluate(() => {
    const failures = [];
    for (const q of questions) {
      state.index = questions.indexOf(q);
      state.answers[q.id] = StudyState.submitAnswer(q, q.format === 'matching' ? q.matches : q.answer);
      render();
      const de = contentDe.questions[q.id];
      if (document.querySelector('#question-card h3').textContent !== de.question) failures.push(`stem ${q.id}`);
      if (!document.querySelector('.explanation').textContent.includes(de.explanation)) failures.push(`explanation ${q.id}`);
      const optionNodes = document.querySelectorAll(q.format === 'matching' ? '.matching-list label' : '.option-copy');
      de.options.forEach((option, i) => { if (!optionNodes[i].textContent.includes(option)) failures.push(`option ${q.id}/${i}`); });
      if (q.matchLabels) {
        const labels = [...document.querySelector('select[data-match]').options].slice(1).map(o => o.textContent);
        if (JSON.stringify(labels) !== JSON.stringify(de.matchLabels)) failures.push(`labels ${q.id}`);
      }
      if (!document.querySelector('.source-row').textContent.includes('Inoffizielle Übung')) failures.push(`source ${q.id}`);
    }
    return failures;
  });
  expect(failures).toEqual([]);
});

test('static and accessible UI, all dialogs and resource labels switch in both directions', async ({ page }) => {
  for (const language of ['de', 'en']) {
    await page.evaluate(language => { closeLegalModal(); applyLanguage(language); }, language);
    expect(await page.evaluate(() => {
      const failures = [];
      for (const element of document.querySelectorAll('[data-ui]')) if (element.textContent !== ui(element.dataset.ui)) failures.push(element.dataset.ui);
      for (const [attr, key] of [['aria-label', 'uiAria'], ['placeholder', 'uiPlaceholder'], ['alt', 'uiAlt'], ['content', 'uiContent']]) {
        for (const element of document.querySelectorAll('*')) if (element.dataset[key] && element.getAttribute(attr) !== ui(element.dataset[key])) failures.push(key);
      }
      for (const resource of resources) {
        const link = document.querySelector(`[data-resource="${resource.id}"]`);
        if (!link.textContent.includes(state.language === 'de' ? contentDe.resources[resource.id] : resource.title) || link.href !== resource.url) failures.push(resource.id);
      }
      for (const lab of labs) {
        openLab(lab.id);
        const display = localizedRecord('labs', lab);
        if (!modalTitle.textContent.includes(display.title) || !modalContent.textContent.includes(display.summary)) failures.push(lab.id);
        for (const text of [...display.checklist, ...display.artifacts]) if (!modalContent.textContent.includes(text)) failures.push(text);
      }
      for (const insight of coursewareInsights) {
        openInsight(insight.id);
        const display = localizedRecord('insights', insight);
        if (modalTitle.textContent !== display.title || !modalContent.textContent.includes(display.text)) failures.push(insight.id);
        if (!modalContent.textContent.includes(t(insight.status))) failures.push(insight.status);
      }
      for (const type of ['disclaimer', 'privacy', 'imprint']) {
        openLegalModal(type);
        const expected = document.createElement('div');
        expected.innerHTML = legalText[state.language][type].html;
        if (modalTitle.textContent !== legalText[state.language][type].title || modalContent.innerHTML !== expected.innerHTML) failures.push(type);
      }
      closeLegalModal();
      return failures;
    })).toEqual([]);
    await expect(page.locator('html')).toHaveAttribute('lang', language);
  }
});

test('language switching preserves checked answers, all draft formats and lab checklist state', async ({ page }) => {
  for (const format of ['single', 'multiple', 'matching']) {
    const id = await page.evaluate(format => questions.find(q => q.format === format).id, format);
    await page.locator(`#question-list [data-id="${id}"]`).click();
    if (format === 'matching') await page.locator('[data-match="0"]').selectOption('B');
    else await page.locator('.option').first().click();
    const before = await page.evaluate(() => JSON.stringify({ answers: state.answers, drafts: state.drafts }));
    await page.locator('#language-select').selectOption('de');
    expect(await page.evaluate(() => JSON.stringify({ answers: state.answers, drafts: state.drafts }))).toBe(before);
    if (format === 'matching') await expect(page.locator('[data-match="0"]')).toHaveValue('B');
    else await expect(page.locator('[data-option="0"]')).toBeChecked();
    await page.locator('#language-select').selectOption('en');
  }
  await page.locator('#question-list [data-id="1"]').click();
  await page.locator('#check-answer').click();
  const saved = await page.evaluate(() => localStorage.getItem(StudyState.ANSWERS_KEY));
  await page.locator('.lab-open').first().click();
  await page.locator('[data-lab-step="0"]').check();
  // The header is behind the modal; exercise the same language handler directly.
  await page.evaluate(() => applyLanguage('de'));
  await expect(page.locator('#modal-title')).toContainText('Prozess und Grounding-Daten qualifizieren');
  await expect(page.locator('[data-lab-step="0"]')).toBeChecked();
  await page.getByRole('button', { name: 'Schließen', exact: true }).click();
  await expect(page.locator('.explanation')).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem(StudyState.ANSWERS_KEY))).toBe(saved);
  await page.reload();
  await expect(page.locator('#modal-title')).toHaveText('Haftungsausschluss');
  await page.getByRole('button', { name: 'Schließen', exact: true }).click();
  await page.locator('.lab-open').first().click();
  await expect(page.locator('[data-lab-step="0"]')).toBeChecked();
});

test('active exam language changes preserve exact session and timer; results remain frozen', async ({ page }) => {
  await page.clock.install();
  await page.locator('[data-mode="exam"]').click();
  const input = page.locator('#question-card input, #question-card select').first();
  if (await input.evaluate(e => e.tagName === 'SELECT')) await input.selectOption('A');
  else await page.locator('.option').first().click();
  const saved = await page.evaluate(() => sessionStorage.getItem(StudyState.EXAM_KEY));
  await page.clock.fastForward(61000);
  await page.locator('#language-select').selectOption('de');
  await expect(page.locator('#exam-status')).toHaveText('Prüfungsmodus · 19 Min. übrig');
  expect(await page.evaluate(() => sessionStorage.getItem(StudyState.EXAM_KEY))).toBe(saved);
  await expect(page.locator('.explanation')).toHaveCount(0);
  await page.locator('#finish-exam').click();
  const completed = await page.evaluate(() => sessionStorage.getItem(StudyState.EXAM_KEY));
  await page.locator('#language-select').selectOption('en');
  await expect(page.locator('#exam-status')).toContainText('Exam complete');
  expect(await page.evaluate(() => sessionStorage.getItem(StudyState.EXAM_KEY))).toBe(completed);
});

test('German errors, no-results, confirmation prompts and stale-locale fallback', async ({ page }) => {
  await page.locator('#language-select').selectOption('de');
  await page.locator('#search').fill('unfindable-xyz');
  await expect(page.locator('.empty-state')).toHaveText('Keine Fragen passen zu dieser Suche.');
  await page.locator('#search').fill('');
  await page.evaluate(() => { warnStorage(); applyLanguage('de'); });
  await expect(page.locator('#storage-warning')).toContainText('Einige gespeicherte Daten');
  await page.locator('[data-mode="exam"]').click();
  page.once('dialog', async dialog => { expect(dialog.message()).toContain('Diese Prüfung abbrechen?'); await dialog.dismiss(); });
  await page.locator('#abort-exam').click();
  page.once('dialog', async dialog => { expect(dialog.message()).toContain('Lernfortschritt, Lab-Fortschritt'); await dialog.accept(); });
  await page.locator('#reset-progress').click();
  await page.evaluate(() => { contentDe.questions[1].revision = 0; applyLanguage('de'); });
  await expect(page.locator('#locale-warning')).toBeVisible();
  await expect(page.locator('#question-card h3')).toContainText('A catalog model');
  await expect(page.locator('#question-card h3')).toHaveAttribute('lang', 'en');
});

test('German renders complete question copy and finds translated options', async ({ page }) => {
  await page.locator('#language-select').selectOption('de');
  await expect(page.locator('#search')).toHaveAttribute('placeholder', 'Konzepte durchsuchen …');
  await expect(page.locator('#question-card h3')).toContainText('Versicherers');
  await expect(page.locator('#question-card')).not.toContainText('A catalog model');
  await page.locator('#search').fill('Schadenfallbewertung');
  await expect(page.locator('#question-list [data-id="1"]')).toBeVisible();
  await page.locator('#search').fill('endpoint access');
  await expect(page.locator('#question-list [data-id="1"]')).toBeVisible();
  expect(await page.evaluate(() => {
    const failures = [];
    for (const q of questions) {
      const de = localizedQuestion(q);
      for (const query of [de.question, ...de.options, de.explanation, ...(de.matchLabels || []), q.topic, q.source]) {
        state.query = query;
        if (!filtered().some(item => item.id === q.id)) failures.push(`Q${q.id}: ${query}`);
      }
    }
    state.query = '';
    return failures;
  })).toEqual([]);
});

test('German startup survives denied storage and localizes empty review and exam errors', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('ab100-language', 'de');
    Storage.prototype.setItem = () => { throw Error('quota'); };
  });
  await page.reload();
  await expect(page.locator('#modal-title')).toHaveText('Haftungsausschluss');
  await expect(page.locator('#storage-warning')).toContainText('Einige gespeicherte Daten');
  await page.getByRole('button', { name: 'Schließen', exact: true }).click();
  await page.evaluate(() => {
    state.answers = Object.fromEntries(questions.map(q => [q.id, StudyState.submitAnswer(q, q.format === 'matching' ? q.matches : q.answer)]));
  });
  await page.locator('[data-mode="review"]').click();
  await expect(page.locator('.empty-state')).toHaveText('Keine Schwachstellen. Alle Fragen wurden richtig beantwortet.');
  await page.evaluate(() => questions.splice(19));
  page.once('dialog', async dialog => { expect(dialog.message()).toBe('Eine Prüfung benötigt mindestens 20 eindeutige Fragen.'); await dialog.accept(); });
  await page.locator('[data-mode="exam"]').click();
});

test('all content records have revision-compatible complete translations', async ({ page }) => {
  expect(await page.evaluate(() => typeof contentDe)).toBe('object');
  const failures = await page.evaluate(() => {
    const failures = [];
    for (const q of questions) {
      const de = contentDe.questions[q.id];
      if (!de || de.revision !== q.revision || !de.question || !de.explanation || de.options.length !== q.options.length) failures.push(`Q${q.id}`);
      if (q.matchLabels && (!de?.matchLabels || de.matchLabels.length !== q.matchLabels.length || de.matchLabels.some((s, i) => s[0] !== q.matchLabels[i][0]))) failures.push(`matching ${q.id}`);
    }
    for (const lab of labs) {
      const de = contentDe.labs[lab.id];
      if (!de?.title || !de.summary || de.checklist.length !== lab.checklist.length || de.artifacts.length !== lab.artifacts.length || de.concepts.length !== lab.concepts.length) failures.push(lab.id);
    }
    for (const item of courseAreas) if (!contentDe.areas[item.id]) failures.push(item.id);
    for (const item of coursewareInsights) if (!contentDe.insights[item.id]?.text) failures.push(item.id);
    for (const item of resources) if (!contentDe.resources[item.id]) failures.push(item.id);
    if (Object.keys(contentDe.outcomes).length !== learningOutcomes.length) failures.push('outcomes');
    return failures;
  });
  expect(failures).toEqual([]);
});
