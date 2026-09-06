const { test, expect } = require('@playwright/test');
const fs = require('node:fs/promises');

test.beforeEach(async ({ page }) => {
  await page.route(/^https:\/\//, route => route.abort());
  await page.goto('/');
  await page.getByRole('button', { name: 'Close', exact: true }).click();
});

async function question(page, format) {
  const id = await page.evaluate(format => questions.find(q => q.format === format).id, format);
  await page.locator(`#question-list [data-id="${id}"]`).click();
}

for (const language of ['en', 'de']) {
  for (const width of [320, 390, 560, 768, 900, 1024, 1440]) {
    test(`${language} ${width}px: header, navigation, filters, answers and matching fit`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.locator('#language-select').selectOption(language);
      await page.evaluate(() => document.fonts.ready);
      if (width <= 560) {
        for (const selector of ['#theme-select', '#language-select']) {
          expect(await page.locator(selector).evaluate(el => el.clientWidth)).toBeGreaterThanOrEqual(125);
        }
      }
      for (const format of ['single', 'multiple', 'matching']) {
        await question(page, format);
        const geometry = await page.evaluate(() => {
          const selectors = ['.topbar', '.brand', '.header-actions', '.top-nav', '.toolbar-controls', '#search', '#topic-filter', '#lab-filter', '.question-card', '.matching-list label', '.matching-list select', '.option-copy'];
          return {
            width: innerWidth, document: document.documentElement.scrollWidth,
            clipped: selectors.flatMap(selector => [...document.querySelectorAll(selector)].filter(el => {
              const rect = el.getBoundingClientRect();
              return rect.left < -1 || rect.right > innerWidth + 1 || el.scrollWidth > el.clientWidth + 1;
            }).map(el => `${selector}: ${el.clientWidth}/${el.scrollWidth}`)),
            fontSizes: [...document.querySelectorAll('.option-copy, .matching-list label, .matching-list select')].map(el => parseFloat(getComputedStyle(el).fontSize)),
            overflow: [document.documentElement, document.body, document.querySelector('.app-shell')].map(el => getComputedStyle(el).overflowX),
          };
        });
        expect(geometry.document, JSON.stringify(geometry)).toBeLessThanOrEqual(width);
        expect(geometry.clipped).toEqual([]);
        expect(Math.min(...geometry.fontSizes)).toBeGreaterThanOrEqual(16);
        expect(geometry.overflow).not.toContain('hidden');
        expect(geometry.overflow).not.toContain('clip');
      }
      for (const id of ['labs', 'insights']) {
        const link = page.locator(`.top-nav a[href="#${id}"]`);
        await expect(link).toBeVisible();
        await link.click();
        await expect(page.locator(`#${id}`)).toBeInViewport();
      }
      expect(await page.locator('#course-title').textContent()).not.toBe(await page.locator('#labs-title').textContent());
      await page.locator('.lab-open').first().click();
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
      const panel = page.locator('.modal-panel');
      expect(await panel.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
      await page.keyboard.press('Escape');
      if ([320, 1440].includes(width)) {
        await page.locator('#exam').scrollIntoViewIfNeeded();
        await page.screenshot({ path: testInfo.outputPath(`${language}-${width}-matching.png`) });
      }
    });
  }
}

for (const theme of ['light', 'dark', 'contrast', 'auto-light', 'auto-dark']) {
  test(`${theme}: computed small-text contrast meets 4.5:1 in EN/DE`, async ({ page }, testInfo) => {
    await page.emulateMedia({ colorScheme: theme.endsWith('dark') ? 'dark' : 'light' });
    await page.locator('#theme-select').selectOption(theme.startsWith('auto') ? 'auto' : theme);
    const readings = [];
    for (const language of ['en', 'de']) {
      await page.locator('#language-select').selectOption(language);
      await question(page, 'single');
      await page.locator('.option').first().click();
      await page.locator('#check-answer').click();
      const colors = await page.evaluate(() => {
        const luminance = rgb => rgb.map(v => v / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4).reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0);
        const parse = color => color.match(/[\d.]+/g).map(Number);
        const selectors = ['.list-item.active', '.list-item.active span', '.list-item.active.done::after', '.mode-card.featured .mode-index', '.mode-card.featured p', '.mode-card.featured .mode-link', '.top-nav a', '.eyebrow', '.option-copy', '.option-letter', '.source-row', '.source-grid span', '.small-button.next'];
        return selectors.flatMap(selector => {
          const pseudo = selector.endsWith('::after');
          const elements = [...document.querySelectorAll(selector.replace('::after', ''))];
          if (!elements.length) throw new Error(`Missing contrast target: ${selector}`);
          return elements.map(el => {
            const style = getComputedStyle(el, pseudo ? '::after' : null);
            let node = el, background = parse(getComputedStyle(node).backgroundColor);
            while (background[3] === 0 && node.parentElement) {
              node = node.parentElement;
              background = parse(getComputedStyle(node).backgroundColor);
            }
            const fg = luminance(parse(style.color).slice(0, 3)), bg = luminance(background.slice(0, 3));
            return { selector, foreground: style.color, background: background.slice(0, 3), ratio: (Math.max(fg, bg) + .05) / (Math.min(fg, bg) + .05) };
          });
        });
      });
      for (const reading of colors) expect(reading.ratio, JSON.stringify(reading)).toBeGreaterThanOrEqual(4.5);
      readings.push({ language, colors });
      await page.locator('#retry-answer').click();
    }
    const evidence = testInfo.outputPath('computed-contrast.json');
    await fs.writeFile(evidence, JSON.stringify(readings, null, 2));
    await testInfo.attach('computed-contrast', { path: evidence, contentType: 'application/json' });
  });
}

test('Auto follows OS changes without changing stored theme', async ({ page }) => {
  await page.locator('#theme-select').selectOption('auto');
  const colors = [];
  for (const colorScheme of ['light', 'dark', 'light']) {
    await page.emulateMedia({ colorScheme });
    colors.push(await page.locator('body').evaluate(el => getComputedStyle(el).backgroundColor));
  }
  expect(colors[0]).not.toBe(colors[1]);
  expect(colors[0]).toBe(colors[2]);
  expect(await page.evaluate(() => localStorage.getItem('ab100-theme'))).toBe('auto');
});

test('keyboard skip during an active exam preserves responses, session and deadline', async ({ page }) => {
  await page.locator('[data-mode="exam"]').click();
  const input = page.locator('#question-card input, #question-card select').first();
  if (await input.evaluate(el => el.tagName === 'SELECT')) await input.selectOption('A');
  else await input.check();
  const before = await page.evaluate(() => ({ mode: state.mode, index: state.index, exam: state.exam, session: sessionStorage.getItem(StudyState.EXAM_KEY) }));
  const prompts = [];
  page.on('dialog', async dialog => { prompts.push(dialog.message()); await dialog.dismiss(); });
  await page.locator('.skip-link').focus();
  await page.keyboard.press('Enter');
  expect(prompts).toEqual([]);
  await expect(page.locator('main')).toBeFocused();
  expect(await page.evaluate(() => ({ mode: state.mode, index: state.index, exam: state.exam, session: sessionStorage.getItem(StudyState.EXAM_KEY) }))).toEqual(before);
  await expect(page.locator('#search')).toBeDisabled();
});

for (const selector of ['.lab-open', '.lab-inline-open', '.insight-open', '[data-legal="privacy"]']) {
  test(`pointer modal return uses actual trigger: ${selector}`, async ({ page }) => {
    const trigger = page.locator(selector).first();
    // Deliberately leave focus elsewhere: WebKit pointer clicks do not focus buttons.
    await page.locator('main').focus();
    await trigger.click();
    await expect(page.locator('.modal-panel')).toBeFocused();
    if (selector.includes('lab')) {
      await page.locator('[data-lab-step="0"]').check();
      await page.evaluate(() => applyLanguage('de'));
    }
    await page.locator('.modal-actions button').click();
    await expect(trigger).toBeFocused();
    await expect(trigger).toBeInViewport();
  });
}

for (const width of [320, 1440]) {
  test(`${width}px modal wheel lock and panel boundaries preserve visible return position`, async ({ page }) => {
    await page.setViewportSize({ width, height: 600 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const trigger = page.locator('.lab-open').first();
    await trigger.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }));
    const before = await page.evaluate(() => ({ y: scrollY, top: document.querySelector('.app-shell').getBoundingClientRect().top }));
    await trigger.click();
    const panel = page.locator('.modal-panel');
    // Real wheel events are dispatched asynchronously; wait for scrolling to settle.
    async function wheelAndCheck(delta) {
      await page.mouse.wheel(0, delta);
      await page.waitForTimeout(350);
      expect(await page.locator('.app-shell').evaluate(el => el.getBoundingClientRect().top)).toBeCloseTo(before.top, 0);
    }
    await page.mouse.move(5, 5);
    await wheelAndCheck(650);
    await wheelAndCheck(-650);
    const box = await panel.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await panel.evaluate(el => { el.scrollTop = 0; });
    await wheelAndCheck(250);
    expect(await panel.evaluate(el => el.scrollTop)).toBeGreaterThan(0);
    await panel.evaluate(el => { el.scrollTop = el.scrollHeight; });
    await wheelAndCheck(650);
    await panel.evaluate(el => { el.scrollTop = 0; });
    await wheelAndCheck(-650);
    await page.keyboard.press('Escape');
    expect(await page.evaluate(() => scrollY)).toBeCloseTo(before.y, 0);
    await expect(trigger).toBeFocused();
    await expect(trigger).toBeInViewport();
    await page.mouse.move(width / 2, 300);
    await page.mouse.wheel(0, 300);
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(before.y);
  });
}

test('keyboard modal containment and stable return after lab cards and locale rerender', async ({ page, browserName }) => {
  const tab = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';
  const backTab = browserName === 'webkit' ? 'Alt+Shift+Tab' : 'Shift+Tab';
  for (const selector of ['.lab-open', '.insight-open', '[data-legal="privacy"]']) {
    const trigger = page.locator(selector).first();
    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.modal-panel')).toBeFocused();
    await expect(page.locator('.app-shell')).toHaveAttribute('inert', '');
    await page.keyboard.press(backTab);
    await expect(page.locator('.modal-actions button')).toBeFocused();
    await page.keyboard.press(tab);
    await expect(page.locator('.modal-close')).toBeFocused();
    await page.keyboard.press(backTab);
    await expect(page.locator('.modal-actions button')).toBeFocused();
    await page.locator('#search').evaluate(el => el.focus());
    await expect(page.locator('.modal-actions button')).toBeFocused();
    if (selector === '.lab-open') {
      await page.locator('[data-lab-step="0"]').focus();
      await page.keyboard.press('Space');
      await page.evaluate(() => applyLanguage('de'));
    }
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
    await expect(page.locator('.app-shell')).not.toHaveAttribute('inert');
  }
  await page.locator('.lab-inline-open').first().focus();
  await page.keyboard.press('Enter');
  await page.evaluate(() => render());
  await page.keyboard.press('Escape');
  await expect(page.locator('.lab-inline-open').first()).toBeFocused();
});

test('skip link, search focus, live results and logical native answer navigation', async ({ page }) => {
  const skip = page.locator('.skip-link');
  await skip.focus();
  await expect(skip).toBeInViewport();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  await page.locator('#search').focus();
  expect(await page.locator('#search').evaluate(el => parseFloat(getComputedStyle(el).outlineWidth))).toBeGreaterThanOrEqual(2);
  await page.locator('#search').fill('no-match-xyz');
  await expect(page.locator('#results-status')).toContainText('0');
  await expect(page.locator('#results-status')).toHaveAttribute('aria-live', 'polite');
  await page.locator('#search').fill('');
  for (const format of ['single', 'multiple', 'matching']) {
    await question(page, format);
    const input = page.locator('#question-card input, #question-card select').first();
    await input.focus();
    if (format === 'matching') {
      await input.selectOption('A');
      for (const select of await page.locator('[data-match]').all()) await select.selectOption('A');
    } else await page.keyboard.press('Space');
    if (format !== 'matching') await expect(input).toBeFocused();
    await expect(page.locator('#question-card [aria-pressed]')).toHaveCount(0);
    await page.locator('#check-answer').focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.explanation')).toBeFocused();
    await page.locator('#next').focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#question-title')).toBeFocused();
  }
});

test('source DOM preserves every resource URL and existing labeled destinations in EN/DE', async ({ page }) => {
  for (const language of ['en', 'de']) {
    await page.locator('#language-select').selectOption(language);
    const expected = await page.evaluate(() => resources.map(r => ({ id: r.id, url: r.url, title: state.language === 'de' ? contentDe.resources[r.id] : r.title })));
    for (const resource of expected) {
      const link = page.locator(`#sources [data-resource="${resource.id}"]`);
      await expect(link).toHaveAttribute('href', resource.url);
      await expect(link).toContainText(resource.title);
      await expect(link).toHaveAttribute('rel', /noreferrer/);
    }
    await expect(page.locator('#sources a[href="https://aka.ms/AB100-StudyGuide"]')).toContainText(language === 'en' ? 'Official exam study guide' : 'Offizieller Prüfungsleitfaden');
    await expect(page.locator('#sources a[href*="dumpsbase.com"]')).toContainText('DumpsBase');
    await expect(page.locator('#sources [data-ui="learnPath"]')).toHaveText(language === 'en' ? 'Architect AI solutions for business productivity' : 'KI-Lösungen für Geschäftsproduktivität entwerfen');
    await expect(page.locator('#sources [data-resource^="c1756-"]')).toHaveCount(3);
  }
});

test('reduced motion disables CSS movement and navigation never requests smooth scrolling', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.evaluate(() => {
    window.scrollRequests = [];
    const original = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = function(options) { window.scrollRequests.push(options); return original.call(this, options); };
  });
  await page.locator('[data-mode="learn"]').hover();
  expect(await page.locator('html').evaluate(el => getComputedStyle(el).scrollBehavior)).toBe('auto');
  const movement = await page.locator('.mode-card').first().evaluate(el => {
    const style = getComputedStyle(el);
    return { transition: style.transitionDuration, animation: style.animationDuration, transform: style.transform };
  });
  expect(movement).toEqual({ transition: '0s', animation: '0s', transform: 'none' });
  await page.locator('[data-mode="learn"]').click();
  await page.locator('#next').click();
  expect(await page.evaluate(() => window.scrollRequests.some(options => options?.behavior === 'smooth'))).toBe(false);
});

test('presentation changes leave active and frozen exam records unchanged', async ({ page }) => {
  await page.locator('[data-mode="exam"]').click();
  for (const completed of [false, true]) {
    if (completed) await page.locator('#finish-exam').click();
    const saved = await page.evaluate(() => sessionStorage.getItem(StudyState.EXAM_KEY));
    for (const language of ['de', 'en']) {
      await page.locator('#language-select').selectOption(language);
      for (const theme of ['light', 'dark', 'auto', 'contrast']) {
        await page.locator('#theme-select').selectOption(theme);
        await page.setViewportSize({ width: 320, height: 900 });
        await page.locator('[data-legal="disclaimer"]').focus();
        await page.keyboard.press('Enter');
        await page.keyboard.press('Escape');
        await expect(page.locator('[data-legal="disclaimer"]')).toBeFocused();
        expect(await page.evaluate(() => sessionStorage.getItem(StudyState.EXAM_KEY))).toBe(saved);
      }
    }
    if (!completed) await expect(page.locator('.explanation, .option.correct, .option.wrong')).toHaveCount(0);
  }
});
