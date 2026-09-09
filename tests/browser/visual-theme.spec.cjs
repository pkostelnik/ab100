const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.route(/^https:\/\//, route => route.abort());
  await page.goto('/');
  await page.getByRole('button', { name: 'Close', exact: true }).click();
});

for (const theme of ['light', 'dark', 'contrast', 'auto-light', 'auto-dark']) {
  test(`${theme}: warm surfaces, unified type and accessible controls`, async ({ page }, testInfo) => {
    const dark = theme.endsWith('dark');
    await page.emulateMedia({ colorScheme: dark ? 'dark' : 'light' });
    await page.locator('#theme-select').selectOption(theme.startsWith('auto') ? 'auto' : theme);
    for (const width of [320, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const language of ['en', 'de']) {
        await page.locator('#language-select').selectOption(language);
        const readings = await page.evaluate(() => {
          const style = selector => getComputedStyle(document.querySelector(selector));
          const luminance = color => color.match(/[\d.]+/g).slice(0, 3).map(Number)
            .map(v => v / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4)
            .reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0);
          const contrast = (foreground, background) => {
            const a = luminance(foreground), b = luminance(background);
            return (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
          };
          const hero = style('.hero');
          const cta = style('.primary-button');
          return {
            paper: style('body').backgroundColor,
            surface: style('.question-card').backgroundColor,
            hero: hero.backgroundColor,
            heroImage: hero.backgroundImage,
            heroContrast: contrast(style('.hero-intro').color, hero.backgroundColor),
            ctaContrast: contrast(cta.color, cta.backgroundColor),
            type: ['body', '.brand', '.eyebrow', '.hero h1', '.hero h1 em', '.section-caption', '.mode-index', '.question-card h3', '.sources-section h2 em'].map(selector => ({
              selector, family: style(selector).fontFamily, fontStyle: style(selector).fontStyle,
            })),
            rotations: ['.hero', '.hero-stat', '.ring', '.hero-stat p'].map(selector => style(selector).transform),
            radii: ['.hero', '.mode-card', '.area-card', '.lab-card', '.insight-card', '.question-card', '.primary-button', '.small-button', '.ghost-button', '.search'].map(selector => ({
              selector, radius: parseFloat(style(selector).borderRadius), appearance: style(selector).appearance,
            })),
            shadows: ['.hero', '.mode-card', '.question-card', '.modal-panel'].map(selector => style(selector).boxShadow),
            heroHeading: parseFloat(style('.hero h1').fontSize),
            heroBounds: [...document.querySelectorAll('.hero, .hero-copy, .hero-stat, .hero-actions > *')].map(el => {
              const rect = el.getBoundingClientRect();
              return { left: rect.left, right: rect.right, client: el.clientWidth, scroll: el.scrollWidth };
            }),
            questionText: [...document.querySelectorAll('.question-card h3, .option, .option-letter, .question-meta, .source-row, .question-footer button')].map(el => parseFloat(getComputedStyle(el).fontSize)),
          };
        });
        const expected = theme === 'contrast'
          ? { paper: 'rgb(0, 0, 0)', surface: 'rgb(0, 0, 0)', hero: 'rgb(0, 0, 0)' }
          : dark
            ? { paper: 'rgb(32, 27, 23)', surface: 'rgb(44, 37, 31)', hero: 'rgb(56, 41, 31)' }
            : { paper: 'rgb(255, 250, 245)', surface: 'rgb(255, 255, 255)', hero: 'rgb(255, 234, 216)' };
        expect(readings).toMatchObject(expected);
        expect(readings.heroContrast).toBeGreaterThanOrEqual(4.5);
        expect(readings.ctaContrast).toBeGreaterThanOrEqual(4.5);
        for (const type of readings.type) {
          expect(type.family, type.selector).toContain('DM Sans');
          expect(type.family, type.selector).not.toMatch(/DM Mono|Space Grotesk|Georgia/);
          expect(type.fontStyle, type.selector).toBe('normal');
        }
        expect(readings.rotations).toEqual(['none', 'none', 'none', 'none']);
        for (const reading of readings.radii) {
          expect(reading.radius, JSON.stringify(reading)).toBeGreaterThanOrEqual(12);
          expect(reading.radius, JSON.stringify(reading)).toBeLessThanOrEqual(16);
        }
        expect(readings.heroHeading).toBeLessThanOrEqual(width === 320 ? 36 : 56);
        for (const bounds of readings.heroBounds) {
          expect(bounds.left).toBeGreaterThanOrEqual(0);
          expect(bounds.right).toBeLessThanOrEqual(width);
          expect(bounds.scroll).toBeLessThanOrEqual(bounds.client + 1);
        }
        expect(Math.min(...readings.questionText)).toBeGreaterThanOrEqual(16);
        if (theme === 'contrast') {
          expect(readings.heroImage).toBe('none');
          expect(readings.shadows).toEqual(['none', 'none', 'none', 'none']);
        }
        await testInfo.attach(`${language}-${width}-theme`, { body: JSON.stringify(readings, null, 2), contentType: 'application/json' });
      }
      await page.locator('.hero').screenshot({ path: testInfo.outputPath(`${width}-hero.png`) });
    }
  });
}

test('upright progress ring still advances and evaluation colors stay distinct', async ({ page }) => {
  const item = await page.evaluate(() => questions.find(q => q.format === 'single'));
  await page.locator(`#question-list [data-id="${item.id}"]`).click();
  const ring = page.locator('#progress-ring');
  const before = await ring.evaluate(el => getComputedStyle(el).backgroundImage);
  await page.locator(`[data-option="${(item.answer + 1) % item.options.length}"]`).check();
  await page.locator('#check-answer').click();
  expect(Number(await ring.getAttribute('aria-valuenow'))).toBeGreaterThan(0);
  expect(await ring.evaluate(el => Number(el.style.getPropertyValue('--progress')))).toBe(Number(await ring.getAttribute('aria-valuenow')));
  expect(await ring.evaluate(el => getComputedStyle(el).backgroundImage)).not.toBe(before);
  await expect(ring).toHaveCSS('transform', 'none');
  for (const theme of ['light', 'dark', 'contrast']) {
    await page.locator('#theme-select').selectOption(theme);
    const colors = await page.evaluate(() => {
      const correct = getComputedStyle(document.querySelector('.option.correct'));
      const wrong = getComputedStyle(document.querySelector('.option.wrong'));
      return { correct: correct.color, wrong: wrong.color, wrongBorder: wrong.borderColor, brand: getComputedStyle(document.querySelector('.eyebrow')).color };
    });
    expect(colors.correct).not.toBe(colors.wrong);
    expect(colors.wrongBorder).toBe(colors.wrong);
    expect(colors.wrongBorder).not.toBe(colors.brand);
    for (const selector of ['.explanation', '.explanation strong', '.explanation small', '.related-lab']) {
      expect(await page.locator(selector).evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(16);
    }
  }
});

test('selects retain native appearance and keyboard operation with authored rounded corners', async ({ page, browserName }, testInfo) => {
  const item = await page.evaluate(() => questions.find(q => q.format === 'matching'));
  await page.locator(`#question-list [data-id="${item.id}"]`).click();
  for (const width of [320, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const readings = await page.locator('select').evaluateAll(elements => elements.map(el => {
      const native = getComputedStyle(el);
      const reading = { id: el.id || 'matching', appearance: native.appearance, nativeRadius: parseFloat(native.borderRadius) };
      // WebKit's native menulist theme adjusts the used radius. Measure the
      // authored radius separately, then restore native rendering immediately.
      const previous = el.style.appearance;
      el.style.appearance = 'none';
      reading.authoredRadius = parseFloat(getComputedStyle(el).borderRadius);
      if (previous) el.style.appearance = previous;
      else el.style.removeProperty('appearance');
      return reading;
    }));
    for (const reading of readings) {
      expect(reading.appearance, reading.id).toBe('auto');
      expect(reading.authoredRadius, reading.id).toBeGreaterThanOrEqual(12);
      expect(reading.authoredRadius, reading.id).toBeLessThanOrEqual(16);
      // Native WebKit corners are platform-owned, not a relaxed card/button contract.
      expect(reading.nativeRadius, reading.id).toBe(browserName === 'webkit' ? 5 : 12);
    }
    await testInfo.attach(`${width}-native-selects`, { body: JSON.stringify(readings, null, 2), contentType: 'application/json' });
  }
  const select = page.locator('.matching-list select').first();
  await select.focus();
  // Native popup arrow navigation is not driven by headless macOS engines;
  // type-ahead exercises the select's real keyboard selection path instead.
  await page.keyboard.press('a');
  await page.keyboard.press('Enter');
  await expect(select).toBeFocused();
  await expect(select).toHaveValue('A');
  expect(await select.evaluate(el => parseFloat(getComputedStyle(el).outlineWidth))).toBeGreaterThanOrEqual(2);
});
