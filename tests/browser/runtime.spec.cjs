const { test, expect } = require('@playwright/test');

async function open(page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Close', exact: true }).click();
}
async function selectQuestion(page, format) {
  const id = await page.evaluate(format => questions.find(q => q.format === format).id, format);
  await page.locator(`#question-list [data-id="${id}"]`).click();
  return id;
}
test.beforeEach(async ({ page }) => {
  await page.route(/^https:\/\//, route => route.abort());
});

for (const format of ['single', 'multiple', 'matching']) {
  test(`${format}: draft selection, explicit checking, rerender restoration and retry`, async ({ page }) => {
    await open(page);
    const id = await selectQuestion(page, format);
    const inputs = page.locator('#question-card input, #question-card select');
    await expect(page.locator('#check-answer')).toBeDisabled();
    if (format === 'matching') {
      await page.locator('[data-match="0"]').selectOption('B');
      await expect(page.locator('[data-match="0"]')).toHaveValue('B');
    } else {
      await page.locator('.option').first().click();
    }
    await expect(page.locator('.explanation, .option.correct, .option.wrong')).toHaveCount(0);
    await expect(page.locator('#completed-count')).toHaveText('0');
    await page.locator('#language-select').selectOption('de');
    await page.locator('#language-select').selectOption('en');
    if (format === 'matching') {
      await expect(page.locator('[data-match="0"]')).toHaveValue('B');
      await expect(page.locator('#check-answer')).toBeDisabled();
      for (let i = 1; i < await inputs.count(); i++) await page.locator(`[data-match="${i}"]`).selectOption('A');
    } else await expect(inputs.first()).toBeChecked();
    await page.locator('#check-answer').click();
    await expect(page.locator('.explanation')).toBeVisible();
    await expect(page.locator('#completed-count')).toHaveText('1');
    for (const input of await inputs.all()) await expect(input).toBeDisabled();
    await page.reload();
    await page.getByRole('button', { name: 'Close', exact: true }).click();
    await page.locator(`#question-list [data-id="${id}"]`).click();
    await expect(page.locator('.explanation')).toBeVisible();
    await page.locator('#retry-answer').click();
    await expect(page.locator('.explanation')).toHaveCount(0);
    await expect(page.locator('#check-answer')).toBeDisabled();
  });
}

test('seeded learning never scores a fresh exam; start focuses and scrolls; completion freezes', async ({ page }) => {
  await open(page);
  await page.evaluate(() => {
    localStorage.setItem('ab100-study-v1', JSON.stringify({ schemaVersion: 1, answers: Object.fromEntries(questions.map(q => [q.id,
      { revision: q.revision ?? 1, value: q.format === 'matching' ? q.matches : q.answer }])) }));
  });
  await page.reload();
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  const total = await page.evaluate(() => questions.length);
  expect(total).toBeGreaterThanOrEqual(20);
  await expect(page.locator('#completed-count')).toHaveText(String(total));
  await expect(page.locator('#question-list .done')).toHaveCount(total);
  const learning = await page.evaluate(() => localStorage.getItem('ab100-study-v1'));
  await page.locator('[data-mode="exam"]').click();
  expect(await page.evaluate(() => localStorage.getItem('ab100-study-v1'))).toBe(learning);
  await expect(page.locator('#completed-count')).toHaveText(String(total));
  await expect(page.locator('#question-list button')).toHaveCount(20);
  await expect(page.locator('#question-title')).toBeFocused();
  await expect(page.locator('#question-title')).toBeInViewport();
  await expect(page.locator('#search')).toBeDisabled();
  await expect(page.locator('#topic-filter')).toBeDisabled();
  await expect(page.locator('.explanation, .option.correct, .option.wrong')).toHaveCount(0);
  await expect(page.locator('#question-list .done')).toHaveCount(0);
  await page.locator('#finish-exam').click();
  await expect(page.locator('#exam-status')).toContainText('0/20');
  // No answered exam records means completion has nothing to promote.
  expect(await page.evaluate(() => localStorage.getItem('ab100-study-v1'))).toBe(learning);
  for (const input of await page.locator('#question-card input, #question-card select').all()) await expect(input).toBeDisabled();
  const saved = await page.evaluate(() => sessionStorage.getItem('ab100-exam-v1'));
  await page.locator('#language-select').selectOption('de');
  await expect(page.locator('#exam-status')).toContainText('0/20');
  expect(await page.evaluate(() => sessionStorage.getItem('ab100-exam-v1'))).toBe(saved);
  await page.locator('[data-mode="exam"]').click();
  await expect(page.locator('#question-list .done')).toHaveCount(0);
  await expect(page.locator('.explanation')).toHaveCount(0);
});

test('legacy revision-1 answers are backed up but rejected by the current bank', async ({ page }) => {
  await open(page);
  const legacy = await page.evaluate(() => {
    const raw = JSON.stringify(Object.fromEntries(questions.map(q => [q.id, q.format === 'matching' ? q.matches : q.answer])));
    localStorage.removeItem('ab100-study-v1');
    localStorage.setItem('ab100-answers', raw);
    return raw;
  });
  await page.reload();
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  expect(await page.evaluate(() => questions.every(q => q.revision > 1))).toBe(true);
  await expect(page.locator('#completed-count')).toHaveText('0');
  await expect(page.locator('#question-list .done')).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem('ab100-answers-backup'))).toBe(legacy);
});

test('two-tab independent submissions preserve both records and pending drafts', async ({ page, context }) => {
  await open(page);
  const other = await context.newPage();
  await open(other);
  const ids = await page.evaluate(() => questions.filter(q => q.format === 'single').slice(0, 2).map(q => q.id));
  for (const [tab, id] of [[page, ids[0]], [other, ids[1]]]) {
    await tab.locator(`#question-list [data-id="${id}"]`).click();
    await tab.locator('.option').first().click();
  }
  await page.locator('#check-answer').click();
  await expect(other.locator('#completed-count')).toHaveText('1');
  await expect(other.locator('[data-option="0"]')).toBeChecked();
  await other.locator('#check-answer').click();
  for (const tab of [page, other]) await expect(tab.locator('#completed-count')).toHaveText('2');
  expect(await page.evaluate(() => Object.keys(JSON.parse(localStorage.getItem('ab100-study-v1')).answers).sort())).toEqual(ids.map(String).sort());
  await page.reload();
  await expect(page.locator('#completed-count')).toHaveText('2');
});

test('two-tab reset clears stale learning drafts and cannot resurrect migrated q95 archive', async ({ page, context }) => {
  await open(page);
  await page.evaluate(() => localStorage.setItem('ab100-study-v1', JSON.stringify({ schemaVersion: 1,
    answers: { 95: { revision: 1, value: 0 }, [questions[0].id]: { revision: questions[0].revision, value: questions[0].answer } } })));
  await page.reload();
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  const other = await context.newPage();
  await open(other);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('ab100-study-v1')).archive)).toEqual([{ id: '95', record: { revision: 1, value: 0 } }]);
  await page.locator('#retry-answer').click();
  await page.locator('.option').first().click();
  other.once('dialog', dialog => dialog.accept());
  await other.locator('#reset-progress').click();
  await expect(page.locator('#completed-count')).toHaveText('0');
  await expect(page.locator('#check-answer')).toBeDisabled();
  await expect(page.locator('#question-card input:checked')).toHaveCount(0);
  const id = await page.evaluate(() => questions.filter(q => q.format === 'single')[1].id);
  await page.locator(`#question-list [data-id="${id}"]`).click();
  await page.locator('.option').first().click();
  await page.locator('#check-answer').click();
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('ab100-study-v1')));
  expect(Object.keys(stored.answers)).toEqual([String(id)]);
  expect(stored.archive).toEqual([]);
  await page.reload();
  await expect(page.locator('#completed-count')).toHaveText('1');
});

test('two-tab reset rejects a stale Check before storage events even after fresh progress is saved', async ({ page, context }) => {
  await page.addInitScript(() => window.addEventListener('storage', event => event.stopImmediatePropagation(), true));
  await open(page);
  await page.locator('.option').first().click();
  const other = await context.newPage();
  await open(other);
  other.once('dialog', dialog => dialog.accept());
  await other.locator('#reset-progress').click();
  const id = await other.evaluate(() => questions.filter(q => q.format === 'single')[1].id);
  await other.locator(`#question-list [data-id="${id}"]`).click();
  await other.locator('.option').first().click();
  await other.locator('#check-answer').click();
  const fresh = await other.evaluate(() => localStorage.getItem('ab100-study-v1'));
  // Deliberately hold A's old DOM/draft, as in a tab awaiting event delivery.
  await page.evaluate(() => document.querySelector('#check-answer').click());
  expect(await page.evaluate(() => localStorage.getItem('ab100-study-v1'))).toBe(fresh);
  await expect(page.locator('#check-answer')).toBeDisabled();
  expect(await page.evaluate(() => state.drafts)).toEqual({});
});

test('two-tab learning writes and reset preserve the other tab exam session', async ({ page, context }) => {
  await open(page);
  await page.locator('[data-mode="exam"]').click();
  const id = await page.evaluate(() => state.exam.questions.find(ref => questions.find(q => q.id === ref.id).format === 'single').id);
  await page.locator(`#question-list [data-id="${id}"]`).click();
  await page.locator('.option').first().click();
  const attempt = await page.evaluate(() => sessionStorage.getItem('ab100-exam-v1'));
  const other = await context.newPage();
  await open(other);
  expect(await other.evaluate(() => sessionStorage.getItem('ab100-exam-v1'))).toBeNull();
  await other.locator('.option').first().click();
  await other.locator('#check-answer').click();
  await expect(page.locator('#completed-count')).toHaveText('1');
  other.once('dialog', dialog => dialog.accept());
  await other.locator('#reset-progress').click();
  await expect(page.locator('#completed-count')).toHaveText('0');
  expect(await page.evaluate(() => sessionStorage.getItem('ab100-exam-v1'))).toBe(attempt);
  await expect(page.locator('#question-list .done')).toHaveCount(1);
  await page.reload();
  expect(await page.evaluate(() => sessionStorage.getItem('ab100-exam-v1'))).toBe(attempt);
});

test('two-tab review recomputes unanswered eligibility on reset and remote saves', async ({ page, context }) => {
  await open(page);
  await page.evaluate(() => localStorage.setItem('ab100-study-v1', JSON.stringify({ schemaVersion: 1,
    answers: Object.fromEntries(questions.map(q => [q.id, StudyState.submitAnswer(q, q.format === 'matching' ? q.matches : q.answer)])) })));
  await page.reload();
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await page.locator('[data-mode="review"]').click();
  await expect(page.locator('#question-card')).toContainText('No weak spots');
  const other = await context.newPage();
  await open(other);
  other.once('dialog', dialog => dialog.accept());
  await other.locator('#reset-progress').click();
  await expect(page.locator('#question-list button')).toHaveCount(101);
  await expect(page.locator('#question-list .done')).toHaveCount(0);
  await expect(page.locator('#question-card')).not.toContainText('No weak spots');
  const q = await other.evaluate(() => questions[0]);
  await other.locator(`[data-option="${q.answer}"]`).check();
  await other.locator('#check-answer').click();
  await expect(page.locator('#question-list button')).toHaveCount(100);
  await expect(page.locator(`#question-list [data-id="${q.id}"]`)).toHaveCount(0);
  await other.locator('#retry-answer').click();
  await other.locator(`[data-option="${(q.answer + 1) % q.options.length}"]`).check();
  await other.locator('#check-answer').click();
  await expect(page.locator('#question-list button')).toHaveCount(101);
});

for (const completion of ['finish', 'timeout', 'expired reload', 'late answer']) {
  test(`exam promotion: ${completion} updates learning once without replay on completed reload`, async ({ page, context }) => {
    await open(page);
    const fixture = await page.evaluate(() => {
      const pool = [...questions.filter(q => q.format === 'single'), ...questions.filter(q => q.format !== 'single')];
      const [correct, wrong, blank] = pool;
      const answers = { [blank.id]: StudyState.submitAnswer(blank, blank.answer) };
      localStorage.setItem('ab100-study-v1', JSON.stringify({ schemaVersion: 1, answers }));
      sessionStorage.setItem('ab100-exam-v1', JSON.stringify(StudyState.createExam(pool, Date.now(), () => 0.999999)));
      return { correct, wrong, blank };
    });
    await page.reload();
    await page.getByRole('button', { name: 'Close', exact: true }).click();
    const before = await page.evaluate(() => localStorage.getItem('ab100-study-v1'));
    await page.locator(`[data-option="${fixture.correct.answer}"]`).check();
    await page.locator(`#question-list [data-id="${fixture.wrong.id}"]`).click();
    const wrongValue = (fixture.wrong.answer + 1) % fixture.wrong.options.length;
    await page.locator(`[data-option="${wrongValue}"]`).check();
    expect(await page.evaluate(() => localStorage.getItem('ab100-study-v1'))).toBe(before);
    if (completion === 'finish') await page.locator('#finish-exam').click();
    else if (completion === 'timeout') {
      await page.clock.install();
      await page.clock.fastForward(1200001);
    } else if (completion === 'expired reload') {
      await page.evaluate(() => {
        const exam = JSON.parse(sessionStorage.getItem('ab100-exam-v1'));
        exam.startedAt = Date.now() - 1200001; exam.deadline = exam.startedAt + 1200000;
        // Prevent beforeunload from replacing this expired fixture with live state.
        state.exam = null;
        sessionStorage.setItem('ab100-exam-v1', JSON.stringify(exam));
      });
      await page.reload();
      await page.getByRole('button', { name: 'Close', exact: true }).click();
    } else {
      await page.clock.setFixedTime(await page.evaluate(() => state.exam.deadline));
      await page.evaluate(() => {
        const input = document.querySelector('[data-option]');
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });
    }
    await expect(page.locator('#exam-status')).toContainText('1/20');
    await expect(page.locator('#completed-count')).toHaveText('3');
    const frozen = await page.evaluate(() => sessionStorage.getItem('ab100-exam-v1'));
    expect(JSON.parse(frozen).learningApplied).toBe(true);
    const other = await context.newPage();
    await open(other);
    await other.locator('[data-mode="review"]').click();
    await expect(other.locator(`#question-list [data-id="${fixture.correct.id}"]`)).toHaveCount(0);
    await expect(other.locator(`#question-list [data-id="${fixture.wrong.id}"]`)).toHaveCount(1);
    await expect(other.locator(`#question-list [data-id="${fixture.blank.id}"]`)).toHaveCount(0);
    await other.locator('[data-mode="learn"]').click();
    await other.locator(`#question-list [data-id="${fixture.correct.id}"]`).click();
    await other.locator('#retry-answer').click();
    await other.locator(`[data-option="${(fixture.correct.answer + 1) % fixture.correct.options.length}"]`).check();
    await other.locator('#check-answer').click();
    const newer = await other.evaluate(() => localStorage.getItem('ab100-study-v1'));
    await page.reload();
    expect(await page.evaluate(() => localStorage.getItem('ab100-study-v1'))).toBe(newer);
    expect(await page.evaluate(() => sessionStorage.getItem('ab100-exam-v1'))).toBe(frozen);
  });
}

test('active exam hides grading for every format and keeps responses/index/deadline on reload', async ({ page }) => {
  await open(page);
  // Seed a valid attempt containing all three formats, independently of random sampling.
  await page.evaluate(() => {
    const first = ['single', 'multiple', 'matching'].map(format => questions.find(q => q.format === format));
    const pool = [...first, ...questions.filter(q => !first.includes(q))];
    sessionStorage.setItem('ab100-exam-v1', JSON.stringify(StudyState.createExam(pool, Date.now(), () => 0.999999)));
  });
  await page.reload();
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  for (const format of ['single', 'multiple', 'matching']) {
    await selectQuestion(page, format);
    if (format === 'matching') await page.locator('[data-match="0"]').selectOption('A');
    else await page.locator('.option').first().click();
    await expect(page.locator('.explanation, .option.correct, .option.wrong, #check-answer, .related-lab, #question-card .source-link')).toHaveCount(0);
  }
  const before = await page.evaluate(() => JSON.parse(sessionStorage.getItem('ab100-exam-v1')));
  await page.reload();
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await expect(page.locator('[data-match="0"]')).toHaveValue('A');
  await expect(page.locator('#question-title')).toBeFocused();
  await expect(page.locator('#question-title')).toBeInViewport();
  const after = await page.evaluate(() => JSON.parse(sessionStorage.getItem('ab100-exam-v1')));
  expect(after).toEqual(before);
});

test('timeout while open and expired reload both complete through frozen results', async ({ page }) => {
  await open(page);
  await page.clock.install();
  await page.locator('[data-mode="exam"]').click();
  await page.clock.fastForward(1200001);
  await expect(page.locator('#exam-status')).toContainText('Exam complete');
  await expect(page.locator('#exam-status')).toContainText('0/20');
  await page.evaluate(() => sessionStorage.setItem('ab100-exam-v1', JSON.stringify(StudyState.createExam(questions, Date.now() - 1200001))));
  await page.reload();
  await expect(page.locator('#exam-status')).toContainText('Exam complete');
  expect(await page.evaluate(() => JSON.parse(sessionStorage.getItem('ab100-exam-v1')).status)).toBe('completed');
});

test('navigation cancellation retains exam; confirmed area navigation aborts and clears session', async ({ page }) => {
  await open(page);
  await page.locator('[data-mode="exam"]').click();
  page.once('dialog', dialog => dialog.dismiss());
  await page.locator('[data-mode="review"]').click();
  await expect(page.locator('#search')).toBeDisabled();
  page.once('dialog', dialog => dialog.dismiss());
  await page.locator('a[href="#sources"]').first().click();
  await expect(page.locator('#search')).toBeDisabled();
  page.once('dialog', dialog => dialog.accept());
  await page.locator('[data-area]').first().click();
  await expect(page.locator('#search')).toBeEnabled();
  await expect(page.locator('#exam-status')).toBeHidden();
  expect(await page.evaluate(() => sessionStorage.getItem('ab100-exam-v1'))).toBeNull();
});

test('all-correct weak review remains empty', async ({ page }) => {
  await open(page);
  await page.evaluate(() => localStorage.setItem('ab100-study-v1', JSON.stringify({ schemaVersion: 1, answers: Object.fromEntries(questions.map(q => [q.id, { revision: q.revision ?? 1, value: q.format === 'matching' ? q.matches : q.answer }])) })));
  await page.reload();
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await page.locator('[data-mode="review"]').click();
  await expect(page.locator('#question-list button')).toHaveCount(0);
  await expect(page.locator('#question-card')).toContainText('No weak spots');
  await expect(page.locator('#question-number')).toHaveText('0');
});

test('opening labs or insights during an active exam requires a confirmed abort', async ({ page }) => {
  await open(page);
  await page.locator('[data-mode="exam"]').click();
  page.once('dialog', dialog => dialog.dismiss());
  await page.locator('.lab-open').first().click();
  await expect(page.locator('#legal-modal')).toBeHidden();
  await expect(page.locator('#search')).toBeDisabled();
  page.once('dialog', dialog => dialog.accept());
  await page.locator('.insight-open').first().click();
  await expect(page.locator('#legal-modal')).toBeVisible();
  expect(await page.evaluate(() => sessionStorage.getItem('ab100-exam-v1'))).toBeNull();
});

test('revised questions reject saved learning and exam state without reviving legacy answers', async ({ page }) => {
  await open(page);
  await page.evaluate(() => {
    localStorage.setItem('ab100-answers', JSON.stringify({ [questions[0].id]: questions[0].answer }));
    localStorage.setItem('ab100-study-v1', JSON.stringify({ schemaVersion: 1, answers: { [questions[0].id]: { revision: questions[0].revision ?? 1, value: questions[0].answer } } }));
    sessionStorage.setItem('ab100-exam-v1', JSON.stringify(StudyState.createExam(questions, Date.now(), () => 0.99999)));
  });
  await page.route('**/questions.js?*', async route => {
    const response = await route.fetch();
    await route.fulfill({ response, body: `${await response.text()}\nquestions[0].revision = (questions[0].revision ?? 1) + 1;` });
  });
  await page.reload();
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await expect(page.locator('#storage-warning')).toBeVisible();
  await expect(page.locator('#completed-count')).toHaveText('0');
  await expect(page.locator('#exam-status')).toBeHidden();
  await expect(page.locator('.explanation')).toHaveCount(0);
  expect(await page.evaluate(() => sessionStorage.getItem('ab100-exam-v1'))).toBeNull();
});

test('keyboard draft changes retain native focus and commit only on Check answer', async ({ page, browserName }) => {
  await open(page);
  await selectQuestion(page, 'multiple');
  const first = page.locator('[data-option="0"]');
  await first.focus();
  await page.keyboard.press('Space');
  await expect(first).toBeFocused();
  await expect(first).toBeChecked();
  // macOS WebKit defaults to Option-Tab for all controls (Safari keyboard navigation).
  await page.keyboard.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab');
  await page.keyboard.press('Space');
  await expect(page.locator('[data-option="1"]')).toBeFocused();
  await expect(page.locator('[data-option="1"]')).toBeChecked();
  await expect(page.locator('.explanation')).toHaveCount(0);
  await page.locator('#check-answer').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.explanation')).toBeFocused();
});

for (const kind of ['malformed', 'null', 'shape', 'denied-read', 'denied-write', 'denied-getter']) {
  test(`storage resilience: ${kind}`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(kind => {
      if (kind === 'denied-getter') {
        for (const key of ['localStorage', 'sessionStorage']) Object.defineProperty(window, key, { get() { throw Error('denied'); } });
      } else if (kind.startsWith('denied')) {
        Storage.prototype[kind === 'denied-read' ? 'getItem' : 'setItem'] = () => { throw Error('denied'); };
      } else {
        const raw = kind === 'malformed' ? '{' : kind === 'null' ? 'null' : '[]';
        localStorage.setItem('ab100-answers', raw);
        localStorage.setItem('ab100-lab-progress', raw);
        sessionStorage.setItem('ab100-exam-v1', raw);
      }
    }, kind);
    await open(page);
    await expect(page.locator('#question-list button')).not.toHaveCount(0);
    await expect(page.locator('#labs-grid .lab-card')).toHaveCount(9);
    await expect(page.locator('#storage-warning')).toBeVisible();
    await selectQuestion(page, 'single');
    await page.locator('.option').first().click();
    await page.locator('#check-answer').click();
    await expect(page.locator('#completed-count')).toHaveText('1');
    await page.locator('[data-mode="exam"]').click();
    await page.locator('#finish-exam').click();
    await expect(page.locator('#exam-status')).toContainText('0/20');
    expect(errors).toEqual([]);
  });
}

test('reset clears active session, learning and lab progress but retains preferences', async ({ page }) => {
  await open(page);
  await page.locator('#theme-select').selectOption('dark');
  await page.locator('.option').first().click();
  await page.locator('#check-answer').click();
  await page.locator('.lab-open').first().click();
  await page.locator('[data-lab-step="0"]').check();
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await page.locator('[data-mode="exam"]').click();
  await page.locator('#language-select').selectOption('de');
  page.once('dialog', dialog => dialog.accept());
  await page.locator('#reset-progress').click();
  await expect(page.locator('#completed-count')).toHaveText('0');
  await expect(page.locator('#exam-status')).toBeHidden();
  expect(await page.evaluate(() => sessionStorage.getItem('ab100-exam-v1'))).toBeNull();
  expect(await page.evaluate(() => localStorage.getItem('ab100-lab-progress'))).toBeNull();
  await page.reload();
  await expect(page.locator('#theme-select')).toHaveValue('dark');
  await expect(page.locator('#language-select')).toHaveValue('de');
  await expect(page.locator('#completed-count')).toHaveText('0');
});

test('revision archive survives q2 submission after q1 changes from revision 1 to 2', async ({ page }) => {
  await open(page);
  const fixture = await page.evaluate(() => {
    const [q1, q2] = questions.filter(q => q.format === 'single');
    const record = { revision: 1, value: q1.answer };
    localStorage.setItem('ab100-study-v1', JSON.stringify({ schemaVersion: 1, answers: { [q1.id]: record } }));
    return { q1: q1.id, q2: q2.id, record };
  });
  await page.route('**/questions.js?*', async route => {
    const response = await route.fetch();
    await route.fulfill({ response, body: `${await response.text()}\nquestions.find(q => q.id === ${JSON.stringify(fixture.q1)}).revision = 2;` });
  });
  for (let visit = 0; visit < 2; visit++) {
    await page.reload();
    await page.getByRole('button', { name: 'Close', exact: true }).click();
    await page.locator(`#question-list [data-id="${fixture.q1}"]`).click();
    await expect(page.locator('.explanation')).toHaveCount(0);
    await page.locator(`#question-list [data-id="${fixture.q2}"]`).click();
    if (visit) await page.locator('#retry-answer').click();
    await page.locator('.option').first().click();
    await page.locator('#check-answer').click();
    const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('ab100-study-v1')));
    expect(stored.answers[fixture.q1]).toBeUndefined();
    expect(stored.archive).toEqual([{ id: String(fixture.q1), record: fixture.record }]);
    await expect(page.locator('#completed-count')).toHaveText('1');
  }
});

test('quota failure then reset removes backing progress and session before reload', async ({ page }) => {
  await open(page);
  await page.evaluate(() => {
    localStorage.setItem('ab100-study-v1', JSON.stringify({ schemaVersion: 1,
      answers: { [questions[0].id]: { revision: questions[0].revision ?? 1, value: questions[0].answer } },
      archive: [{ id: 'retired', record: { revision: 1, value: 0 } }] }));
    localStorage.setItem('ab100-answers', JSON.stringify({ [questions[0].id]: questions[0].answer }));
    localStorage.setItem('ab100-answers-backup', 'legacy backup');
    localStorage.setItem('ab100-lab-progress', '{"lab-01-0":true}');
    localStorage.setItem('ab100-theme', 'dark');
    localStorage.setItem('ab100-language', 'en');
    sessionStorage.setItem('ab100-exam-v1', JSON.stringify(StudyState.createExam(questions)));
  });
  await page.addInitScript(() => { Storage.prototype.setItem = () => { throw new DOMException('Quota exceeded', 'QuotaExceededError'); }; });
  await page.reload();
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await expect(page.locator('#storage-warning')).toBeVisible();
  page.once('dialog', dialog => dialog.accept());
  await page.locator('#reset-progress').click();
  expect(await page.evaluate(() => ({
    study: localStorage.getItem('ab100-study-v1'), legacy: localStorage.getItem('ab100-answers'),
    backup: localStorage.getItem('ab100-answers-backup'), labs: localStorage.getItem('ab100-lab-progress'),
    exam: sessionStorage.getItem('ab100-exam-v1'),
  }))).toEqual({ study: null, legacy: null, backup: null, labs: null, exam: null });
  await page.reload();
  await expect(page.locator('#completed-count')).toHaveText('0');
  await expect(page.locator('#exam-status')).toBeHidden();
  await expect(page.locator('#theme-select')).toHaveValue('dark');
  await expect(page.locator('#language-select')).toHaveValue('en');
  expect(await page.evaluate(() => Object.keys(labProgress))).toEqual([]);
});
